#!/usr/bin/env node
// Claude Code PreToolUse hook for the Bash and PowerShell tools (.claude/settings.json).
// Reads the hook JSON on stdin. Refuses any git commit that skips the pre-commit hook
// (--no-verify, -n, or -c core.hooksPath=...). For other commits it runs the checker itself only
// when the git hooks aren't installed; otherwise .githooks/pre-commit runs it at commit time.
// Exit 2 blocks the tool call and shows stderr to Claude.

const path = require('path')
const { spawnSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const SEPARATORS = new Set(['&&', '||', ';', '|', '&', '\n'])
// git commit short options that take a value; a cluster stops at one (-mnope is -m "nope")
const VALUE_SHORT = new Set(['m', 'F', 'c', 'C', 't'])
// git global options that take a separate value (git -C dir commit, git -c k=v commit)
const VALUE_GLOBAL = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace', '--exec-path'])

// Shell-ish tokenizer: keeps quoted strings whole (so a message containing "-n" or a newline
// isn't read as a flag or a new command) and emits separators outside quotes as their own tokens.
function tokenize(command) {
  const tokens = []
  let cur = ''
  let quote = null
  let has = false
  const push = () => {
    if (has) tokens.push(cur)
    cur = ''
    has = false
  }
  for (let i = 0; i < command.length; i++) {
    const ch = command[i]
    if (quote) {
      if (ch === quote) quote = null
      else cur += ch
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch
      has = true
      continue
    }
    const two = command.slice(i, i + 2)
    if (two === '&&' || two === '||') {
      push()
      tokens.push(two)
      i++
    } else if (ch === ';' || ch === '|' || ch === '&' || ch === '\n') {
      push()
      tokens.push(ch)
    } else if (/\s/.test(ch)) {
      push()
    } else {
      cur += ch
      has = true
    }
  }
  push()
  return tokens
}

function segments(tokens) {
  const out = [[]]
  for (const t of tokens) {
    if (SEPARATORS.has(t)) out.push([])
    else out[out.length - 1].push(t)
  }
  return out.filter((s) => s.length)
}

// Returns null if the segment isn't a git commit, else { bypass: reason | null }
function inspectSegment(seg) {
  const gitAt = seg.findIndex((t) => t === 'git' || /[\\/]git(\.exe)?$/i.test(t))
  if (gitAt === -1) return null
  let i = gitAt + 1
  let hooksPathOverride = false
  while (i < seg.length && seg[i].startsWith('-')) {
    const opt = seg[i]
    if (opt === '-c' && /^core\.hookspath=/i.test(seg[i + 1] || '')) hooksPathOverride = true
    if (/^-c.+/.test(opt) && /core\.hookspath=/i.test(opt)) hooksPathOverride = true
    i += VALUE_GLOBAL.has(opt) ? 2 : 1
  }
  // `git config [set|--unset|...] core.hooksPath ...` earlier in the same command would switch the
  // hooks off after this hook has already checked core.hooksPath
  if (seg[i] === 'config') return { hooksPathChange: seg.slice(i + 1).some((t) => /^core\.hookspath$/i.test(t)) }
  if (seg[i] !== 'commit') return null
  if (hooksPathOverride) return { bypass: 'it overrides core.hooksPath' }
  for (let j = i + 1; j < seg.length; j++) {
    const t = seg[j]
    if (t === '--') break
    // git accepts any unambiguous prefix of a long option, so --no-veri works like --no-verify
    if (t.startsWith('--no-v') && '--no-verify'.startsWith(t)) return { bypass: 'it passes --no-verify' }
    if (/^-[A-Za-z]/.test(t) && !t.startsWith('--')) {
      for (const ch of t.slice(1)) {
        if (ch === 'n') return { bypass: 'it passes -n (short for --no-verify)' }
        if (VALUE_SHORT.has(ch)) {
          if (t.endsWith(ch)) j++ // value is the next token
          break
        }
      }
    }
  }
  return { bypass: null }
}

function inspect(command) {
  let isCommit = false
  let hooksPathChange = false
  for (const seg of segments(tokenize(command || ''))) {
    const r = inspectSegment(seg)
    if (!r) continue
    if ('hooksPathChange' in r) {
      hooksPathChange = hooksPathChange || r.hooksPathChange
      continue
    }
    if (r.bypass) return { isCommit: true, bypass: r.bypass }
    isCommit = true
  }
  if (isCommit && hooksPathChange) return { isCommit, bypass: 'the same command changes core.hooksPath' }
  return { isCommit, bypass: null }
}

function gitHooksInstalled() {
  const res = spawnSync('git', ['config', '--get', 'core.hooksPath'], { cwd: ROOT, encoding: 'utf8' })
  return res.status === 0 && res.stdout.trim() === '.githooks'
}

function main(input) {
  let payload
  try {
    payload = JSON.parse(input)
  } catch {
    return 0 // not a hook payload we understand; don't block unrelated tool calls
  }
  const { isCommit, bypass } = inspect(payload?.tool_input?.command)
  if (bypass) {
    process.stderr.write(`Don't bypass the pre-commit hook: this git commit was refused because ${bypass}. Fix what the hook reports instead.\n`)
    return 2
  }
  if (!isCommit || gitHooksInstalled()) return 0
  const res = spawnSync(process.execPath, [path.join(__dirname, 'check.js')], { cwd: ROOT, encoding: 'utf8' })
  if (res.status !== 0) {
    process.stderr.write(`${res.stdout || ''}${res.stderr || ''}\nThe git hooks aren't installed here (run npm install), so the Claude hook ran the checks and they failed.\n`)
    return 2
  }
  return 0
}

if (require.main === module) {
  let input = ''
  process.stdin.setEncoding('utf8')
  process.stdin.on('data', (d) => (input += d))
  process.stdin.on('end', () => (process.exitCode = main(input)))
}

module.exports = { tokenize, inspect }
