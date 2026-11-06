const { test } = require('node:test')
const assert = require('node:assert/strict')
const { classify, isLogicFile, testsFor, testDecisions, auditVerdict } = require('./check')

// A fake repo layout: folder → file names
const tree = {
  'src/hooks': ['useTheme.js', 'useTheme.test.js', 'useReveal.js'],
  'src/content/memos': ['index.js', 'memos.test.js', '_template.md'],
  'src/content/guides': ['index.js', 'guides.test.js'],
  'tools/precommit': ['check.js', 'check.test.js', 'claude-hook.js'],
  'infra/visitor-counter/lambda': ['handler.py', 'test_handler.py']
}
const listDir = (dir) => tree[dir] || []

test('docs-only: Markdown and images only', () => {
  assert.equal(classify(['README.md', 'src/assets/a.png']).docsOnly, true)
  assert.equal(classify(['README.md', 'src/App.jsx']).docsOnly, false)
  assert.equal(classify([]).docsOnly, false)
})

test('code to scan skips the vuln-check fixtures', () => {
  assert.deepEqual(classify(['src/App.jsx', 'tools/vuln-check/fixtures/eval-input.js', 'tools/x.js']).code, ['src/App.jsx', 'tools/x.js'])
})

test('infra: Lambda files and Terraform are detected', () => {
  const c = classify(['infra/visitor-counter/lambda/handler.py', 'infra/visitor-counter/main.tf'])
  assert.equal(c.lambda, true)
  assert.deepEqual(c.terraform, ['infra/visitor-counter/main.tf'])
  assert.equal(classify(['src/App.jsx']).lambda, false)
})

test('logic files: hooks, content indexes, tools, Lambda; never tests or fixtures', () => {
  for (const f of ['src/hooks/useTheme.js', 'src/content/memos/index.js', 'tools/precommit/check.js', 'infra/visitor-counter/lambda/handler.py']) {
    assert.equal(isLogicFile(f), true, f)
  }
  for (const f of ['src/hooks/useTheme.test.js', 'src/App.jsx', 'src/content/guides/ai-autonomy/data.js', 'tools/vuln-check/fixtures/eval-input.js', 'infra/visitor-counter/lambda/test_handler.py']) {
    assert.equal(isLogicFile(f), false, f)
  }
})

test('a file is covered by its own <name>.test.js, not by a neighbour test', () => {
  assert.deepEqual(testsFor('src/hooks/useTheme.js', listDir), ['src/hooks/useTheme.test.js'])
  assert.deepEqual(testsFor('src/hooks/useReveal.js', listDir), [])
  assert.deepEqual(testsFor('tools/precommit/claude-hook.js', listDir), [])
})

test('an index.js is covered by any test in its folder', () => {
  assert.deepEqual(testsFor('src/content/memos/index.js', listDir), ['src/content/memos/memos.test.js'])
})

test('the Lambda is covered by test_<name>.py', () => {
  assert.deepEqual(testsFor('infra/visitor-counter/lambda/handler.py', listDir), ['infra/visitor-counter/lambda/test_handler.py'])
})

test('heuristic blocks an untested logic file', () => {
  const [d] = testDecisions(['src/hooks/useReveal.js'], listDir)
  assert.equal(d.level, 'block')
  assert.equal(d.file, 'src/hooks/useReveal.js')
})

test('heuristic warns when the test exists but is not staged', () => {
  assert.equal(testDecisions(['src/content/memos/index.js'], listDir)[0].level, 'warn')
})

test('heuristic is quiet when the test is staged too, and for non-logic files', () => {
  assert.deepEqual(testDecisions(['src/hooks/useTheme.js', 'src/hooks/useTheme.test.js', 'src/App.jsx', 'README.md'], listDir), [])
})

test('audit verdict: pass, block on advisories, warn when offline', () => {
  assert.equal(auditVerdict(0, 'found 0 vulnerabilities'), 'pass')
  assert.equal(auditVerdict(1, '1 high severity vulnerability'), 'block')
  assert.equal(auditVerdict(1, 'npm error code ENOTFOUND'), 'offline')
  assert.equal(auditVerdict(1, 'npm error audit endpoint returned an error'), 'offline')
})
