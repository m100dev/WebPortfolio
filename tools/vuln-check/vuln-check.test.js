const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { scan } = require('./vuln-check')

const fixture = (name) => path.join(__dirname, 'fixtures', name)
const rules = (findings) => findings.map((f) => f.rule)

test('flags dangerouslySetInnerHTML with a non-literal __html', () => {
  assert.deepEqual(rules(scan([fixture('unsafe-html.jsx')])), ['unsafe-html'])
})

test('flags eval on user input', () => {
  assert.deepEqual(rules(scan([fixture('eval-input.js')])), ['eval'])
})

test('flags a hardcoded AWS access key ID', () => {
  assert.deepEqual(rules(scan([fixture('leaked-key.js')])), ['hardcoded-secret'])
})

test('a safe external link has no findings', () => {
  assert.deepEqual(scan([fixture('safe-link.jsx')]), [])
})

test('reports a file that does not parse as syntax-error', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'vuln-check-'))
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }))
  const file = path.join(dir, 'broken.jsx')
  fs.writeFileSync(file, 'export default function () { return <div>\n')
  const findings = scan([file])
  assert.deepEqual(rules(findings), ['syntax-error'])
  assert.equal(path.basename(findings[0].file), 'broken.jsx')
})

test('an ignore comment suppresses a finding only when it gives a reason', () => {
  const { scanSource } = require('./vuln-check')
  const withReason = '// vuln-check-ignore eval: test only\neval(x)\n'
  const noReason = '// vuln-check-ignore eval\neval(x)\n'
  assert.deepEqual(scanSource(withReason, 'a.js'), [])
  assert.deepEqual(rules(scanSource(noReason, 'b.js')), ['eval'])
})
