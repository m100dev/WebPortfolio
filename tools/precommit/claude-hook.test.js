const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawnSync } = require('child_process')
const path = require('path')
const { tokenize, inspect } = require('./claude-hook')

const bypassed = (cmd) => inspect(cmd).bypass !== null
const commits = (cmd) => inspect(cmd).isCommit

test('tokenizer keeps quoted text whole and splits on separators outside quotes', () => {
  assert.deepEqual(tokenize(`git add . && git commit -m "fix -n; flag"`), ['git', 'add', '.', '&&', 'git', 'commit', '-m', 'fix -n; flag'])
})

test('refuses --no-verify and -n, alone or in a short-flag cluster', () => {
  for (const cmd of ['git commit --no-verify -m "x"', 'git commit -n -m x', 'git commit -nm x', 'git commit -anm x', "git commit -m 'x' --no-verify"]) {
    assert.equal(bypassed(cmd), true, cmd)
  }
})

test('refuses a core.hooksPath override on the commit', () => {
  assert.equal(bypassed('git -c core.hooksPath=/dev/null commit -m x'), true)
  assert.equal(bypassed('git -c core.hooksPath= commit -m x'), true)
})

test('refuses abbreviated --no-verify (git accepts unambiguous prefixes)', () => {
  assert.equal(bypassed('git commit --no-veri -m x'), true)
  assert.equal(bypassed('git commit --no-verif -m x'), true)
  assert.equal(bypassed('git commit --no-verbose -m x'), false)
})

test('refuses a commit chained after a core.hooksPath change', () => {
  assert.equal(bypassed('git config core.hooksPath /dev/null && git commit -m x'), true)
  assert.equal(bypassed('git config --unset core.hooksPath; git commit -m x'), true)
  assert.equal(bypassed('git config core.hooksPath .githooks'), false) // no commit in the command
  assert.equal(bypassed('git config user.name x && git commit -m x'), false)
})

test('finds the bypass in a chained or multi-line command', () => {
  assert.equal(bypassed('npm test && git commit --no-verify -m x'), true)
  assert.equal(bypassed('git status; git commit -n -m x'), true)
  assert.equal(bypassed('git add .\ngit commit --no-verify -m x'), true)
})

test('a message that mentions -n or --no-verify is not a bypass', () => {
  assert.equal(bypassed('git commit -m "explained why -n is refused"'), false)
  assert.equal(bypassed('git commit -m "--no-verify is blocked"'), false)
  assert.equal(bypassed('git commit -mnope'), false) // -m with an attached value
  assert.equal(bypassed('git commit -F msg.txt -- -n'), false) // after --, a pathspec
})

test('a heredoc message spanning lines stays one commit', () => {
  const cmd = `git commit -m "$(cat <<'EOF'\nfixed the -n flag\n\nCo-Authored-By: x\nEOF\n)"`
  assert.deepEqual(inspect(cmd), { isCommit: true, bypass: null })
})

test('detects git commit with global options, and only git commit', () => {
  assert.equal(commits('git -C repo commit -m x'), true)
  assert.equal(commits('"/c/Program Files/Git/cmd/git.exe" commit -m x'), true)
  for (const cmd of ['git commit-tree abc', 'git log --grep commit', 'git status', 'npm test']) {
    assert.equal(commits(cmd), false, cmd)
  }
})

test('known over-match: "git commit" as another command\'s argument reads as a commit (it only triggers the checks)', () => {
  assert.deepEqual(inspect('echo git commit'), { isCommit: true, bypass: null })
})

test('hook process: exit 2 with a reason on a bypass, exit 0 on unrelated or malformed input', () => {
  const hook = path.join(__dirname, 'claude-hook.js')
  const runHook = (input) => spawnSync(process.execPath, [hook], { input, encoding: 'utf8' })
  const blocked = runHook(JSON.stringify({ tool_name: 'PowerShell', tool_input: { command: 'git commit --no-verify -m x' } }))
  assert.equal(blocked.status, 2)
  assert.match(blocked.stderr, /Don't bypass the pre-commit hook/)
  assert.equal(runHook(JSON.stringify({ tool_name: 'Bash', tool_input: { command: 'ls' } })).status, 0)
  assert.equal(runHook('not json').status, 0)
})
