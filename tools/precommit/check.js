#!/usr/bin/env node
// Pre-commit checker: run by .githooks/pre-commit (and by the Claude hook when git hooks aren't installed).
// Classifies the staged files and runs, in order: gitleaks, vuln-check, the build, the tests,
// the Lambda/Terraform checks, the test heuristic and npm audit. Any block exits 1 with the reason.
// Docs-only commits (Markdown and images) run only gitleaks and npm audit.
//
// The checks run on the working tree, not the staged snapshot (cp3b.md D3): unstaged broken work
// elsewhere can block a commit. Stash or finish it rather than bypassing the hook.

const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const ROOT = path.resolve(__dirname, '..', '..')
const LAMBDA_DIR = 'infra/visitor-counter/lambda/'

const DOCS_RE = /\.(md|png|jpe?g|gif|svg|webp|ico|avif)$/i
const isFixture = (f) => /^tools\/.*\/fixtures\//.test(f)
const isTestFile = (f) => /\.test\.jsx?$/.test(f) || /(^|\/)test_[^/]*\.py$/.test(f)

// Files whose behaviour must be covered by a test (cp3b.md step 1.6)
function isLogicFile(f) {
  if (isTestFile(f) || isFixture(f)) return false
  return (
    /^src\/hooks\/[^/]+\.js$/.test(f) ||
    /^src\/content\/[^/]+\/index\.js$/.test(f) ||
    /^tools\/.+\.js$/.test(f) ||
    new RegExp(`^${LAMBDA_DIR}[^/]+\\.py$`).test(f)
  )
}

function classify(files) {
  const code = files.filter((f) => /\.jsx?$/.test(f) && !isFixture(f))
  return {
    docsOnly: files.length > 0 && files.every((f) => DOCS_RE.test(f)),
    code,
    lambda: files.some((f) => f.startsWith(LAMBDA_DIR)),
    terraform: files.filter((f) => f.endsWith('.tf')),
    logic: files.filter(isLogicFile)
  }
}

// The tests that cover a logic file: <name>.test.js(x) or test_<name>.py beside it. An index.js is
// a folder's entry point, so any test in its folder covers it (e.g. memos/index.js → memos.test.js).
function testsFor(file, listDir) {
  const dir = path.posix.dirname(file)
  const base = path.posix.basename(file).replace(/\.(jsx?|py)$/, '')
  const siblings = listDir(dir).filter((name) => isTestFile(`${dir}/${name}`))
  const own = siblings.filter((name) => name === `${base}.test.js` || name === `${base}.test.jsx` || name === `test_${base}.py`)
  const covering = base === 'index' ? siblings : own
  return covering.map((name) => `${dir}/${name}`)
}

// Block a logic file with no test; warn when its test exists but isn't part of this commit
function testDecisions(staged, listDir) {
  const stagedSet = new Set(staged)
  const decisions = []
  for (const file of classify(staged).logic) {
    const tests = testsFor(file, listDir)
    if (tests.length === 0) {
      decisions.push({ file, level: 'block', reason: 'no test beside it (add <name>.test.js, or test_<name>.py for the Lambda)' })
    } else if (!tests.some((t) => stagedSet.has(t))) {
      decisions.push({ file, level: 'warn', reason: `its test (${tests.join(', ')}) isn't staged; check it still covers the change` })
    }
  }
  return decisions
}

const NETWORK_RE = /ENOTFOUND|EAI_AGAIN|ECONNREFUSED|ECONNRESET|ETIMEDOUT|network|audit endpoint returned an error/i

// npm audit's exit code can't tell "found advisories" from "couldn't reach the registry"
function auditVerdict(status, output) {
  if (status === 0) return 'pass'
  return NETWORK_RE.test(output) ? 'offline' : 'block'
}

// ---- runner -------------------------------------------------------------------------------------

const quote = (s) => `"${s}"`

function run(label, command, opts = {}) {
  process.stdout.write(`\n▸ ${label}\n`)
  const res = spawnSync(command, { cwd: opts.cwd || ROOT, shell: true, encoding: 'utf8', stdio: opts.capture ? 'pipe' : 'inherit' })
  const output = opts.capture ? `${res.stdout || ''}${res.stderr || ''}` : ''
  if (opts.capture && output) process.stdout.write(output)
  return { status: res.error ? 1 : res.status, output }
}

function stagedFiles() {
  const res = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], { cwd: ROOT, encoding: 'utf8' })
  if (res.status !== 0) throw new Error(`git diff --cached failed: ${res.stderr}`)
  return res.stdout.split('\n').map((l) => l.trim()).filter(Boolean)
}

function main() {
  const staged = stagedFiles()
  if (staged.length === 0) return 0
  const c = classify(staged)
  const failures = []
  const warnings = []
  const check = (label, command, opts) => {
    if (run(label, command, opts).status !== 0) failures.push(label)
  }

  check('gitleaks (staged)', 'gitleaks git --staged --config .gitleaks.toml --no-banner')

  if (!c.docsOnly) {
    if (c.code.length) check('vuln-check (staged JS/JSX)', `node tools/vuln-check/vuln-check.js ${c.code.map(quote).join(' ')}`)
    check('build (eslint . + vite build)', 'npm run build --silent')
    check('tests (Vitest)', 'npm run test:once --silent')
    check('tests (tools, node:test)', 'npm run test:security --silent')
    if (c.lambda) check('Lambda tests', 'python -m unittest', { cwd: path.join(ROOT, LAMBDA_DIR) })
    if (c.terraform.length) check('terraform fmt', `terraform fmt -check ${c.terraform.map(quote).join(' ')}`)

    process.stdout.write('\n▸ test heuristic\n')
    const listDir = (dir) => (fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)) : [])
    for (const d of testDecisions(staged, listDir)) {
      const line = `${d.file}: ${d.reason}`
      if (d.level === 'block') failures.push(`test heuristic: ${line}`)
      else warnings.push(line)
      process.stdout.write(`  ${d.level}: ${line}\n`)
    }
  }

  const audit = run('npm audit (runtime deps, high+)', 'npm audit --omit=dev --audit-level=high', { capture: true })
  const verdict = auditVerdict(audit.status, audit.output)
  if (verdict === 'block') failures.push('npm audit: high or critical advisory in a runtime dependency')
  if (verdict === 'offline') warnings.push('npm audit could not reach the registry; run it again before pushing')

  for (const w of warnings) process.stdout.write(`\nwarning: ${w}`)
  if (failures.length) {
    process.stderr.write(`\n\nCommit blocked by the pre-commit hook:\n${failures.map((f) => `  - ${f}`).join('\n')}\nFix the cause. Never bypass the hook (--no-verify / -n).\n`)
    return 1
  }
  process.stdout.write('\n\npre-commit: all checks passed\n')
  return 0
}

if (require.main === module) process.exitCode = main()

module.exports = { classify, isLogicFile, testsFor, testDecisions, auditVerdict }
