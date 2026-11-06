const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')
const { install } = require('./install-hooks')

test('sets core.hooksPath when there is a .git folder', () => {
  const calls = []
  const r = install({ root: '/repo', exists: () => true, git: (args) => (calls.push(args), { status: 0 }) })
  assert.deepEqual(r, { installed: true })
  assert.deepEqual(calls, [['config', 'core.hooksPath', '.githooks']])
})

test('skips without .git, so packaged and CI copies install cleanly', () => {
  let called = false
  const r = install({ root: '/pkg', exists: () => false, git: () => ((called = true), { status: 0 }) })
  assert.equal(r.installed, false)
  assert.equal(called, false)
})

test('reports, but does not throw, when git fails or is missing', () => {
  assert.equal(install({ root: '/repo', exists: () => true, git: () => ({ status: 1, stderr: 'boom' }) }).installed, false)
  assert.equal(install({ root: '/repo', exists: () => true, git: () => ({ error: new Error('ENOENT') }) }).installed, false)
})

test('the script exits 0 from a copy with no .git folder', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'install-hooks-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  fs.mkdirSync(path.join(dir, 'tools', 'precommit'), { recursive: true })
  const copy = path.join(dir, 'tools', 'precommit', 'install-hooks.js')
  fs.copyFileSync(path.join(__dirname, 'install-hooks.js'), copy)
  const res = spawnSync(process.execPath, [copy], { cwd: dir, encoding: 'utf8' })
  assert.equal(res.status, 0)
  assert.match(res.stdout, /skipped/)
})
