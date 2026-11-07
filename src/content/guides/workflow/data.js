// Every number on the How I Build with AI Agents guide. Each one names the plan file it was
// measured in (`source`) and the exact text there (`quote`); data.test.js checks the quote is
// still in that file, so this page and the README can't drift apart.

const PLAN = 'docs/plans/2026-11-05-claude-workflow'
const CP2 = `${PLAN}/cp2.md`
const CP3 = `${PLAN}/cp3.md`
const CP3B = `${PLAN}/cp3b.md`
const CP4 = `${PLAN}/cp4.md`
const CP5 = `${PLAN}/cp5.md`
const TOOLCHAIN = 'docs/plans/2026-11-05-toolchain-upgrade/cp4.md'

// Spec → plan → tests → hooks → skills → review. Not numbers, so no source.
export const flow = [
  { step: 'Spec', detail: 'What done looks like, written before any code.' },
  { step: 'Checkpointed plan', detail: 'Small steps, each with its own gate and a fresh session.' },
  { step: 'Tests', detail: 'The behaviour I expect, so a regression fails loudly.' },
  { step: 'Hooks enforce', detail: 'Secrets, unsafe code, build, tests, and audit block the commit.' },
  { step: 'Skills judge', detail: 'The calls a script can’t make, run as checklists.' },
  { step: 'My review', detail: 'Every change, at every gate.' }
]

export const context = {
  before: { value: 3.1, label: 'Before: one CLAUDE.md', source: CP2, quote: '3.1k → 1.2k for `CLAUDE.md`' },
  // The split reached 1.2k; documenting hooks, skills and graphify since grew it to 2.2k (re-measured)
  atSplit: { value: 1.2, label: 'Right after the split', source: CP2, quote: '3.1k → 1.2k for `CLAUDE.md`' },
  after: { value: 2.2, label: 'Now, re-measured', source: CP2, quote: 'That\'s 3.1k → 2.2k now' },
  saving: { value: '−29%', source: CP2, quote: 'about 29% fewer tokens every session' },
  nested: [
    { file: 'src/components/CLAUDE.md', holds: 'sections, nav, styling tokens, Ask Marc, the contact form', source: CP2, quote: '`src/components/CLAUDE.md`: 2,636 chars' },
    { file: 'src/content/CLAUDE.md', holds: 'guides and memos, including the release rules', source: CP2, quote: '`src/content/CLAUDE.md`: 1,909 chars' },
    { file: 'infra/visitor-counter/CLAUDE.md', holds: 'the visitor counter’s AWS stack', source: CP2, quote: '`infra/visitor-counter/CLAUDE.md`: 1,146 chars' }
  ]
}

export const gates = {
  testsBefore: { value: 6, source: CP3, quote: '`npm run test:security` reports 6/6 passing' },
  testsAfter: { value: 32, source: CP3B, quote: '32/32 (6 vuln-check + 26 new)' },
  // outcome: refused | fixed | blocked | limit
  matrix: [
    { attempt: 'git commit --no-verify (Bash)', outcome: 'refused', result: 'Refused by the agent’s pre-tool hook', source: CP3B, quote: 'Bypass via Bash: `git commit --no-verify` | refused by the PreToolUse hook (live)' },
    { attempt: 'git commit -n (PowerShell)', outcome: 'refused', result: 'By the same hook, from PowerShell', source: CP3B, quote: 'Bypass via PowerShell: `git commit -n` | refused (live)' },
    { attempt: 'git commit --no-veri (abbreviated flag)', outcome: 'fixed', result: 'Got through at first. Fixed, now refused', source: CP3B, quote: 'got through at first; fixed, now refused (live)' },
    { attempt: 'core.hooksPath change chained before a commit', outcome: 'fixed', result: 'Found in testing. Fixed, now refused', source: CP3B, quote: 'fixed: refused when a commit follows a `core.hooksPath` change' },
    { attempt: 'Staged file with eval(location.hash)', outcome: 'blocked', result: 'Blocked by vuln-check, and again after graphify’s hooks went in', source: CP3B, quote: 'blocked: `vuln-check: src/scratch-vuln.js:1 eval`' },
    { attempt: 'Nested shell: sh -c "git commit --no-verify"', outcome: 'limit', result: 'Not parsed. A documented limit; a server-side gate would close it', source: CP3B, quote: 'A nested shell (`sh -c "git commit --no-verify"`, `pwsh -c ...`) isn\'t parsed' }
  ],
  evalAgain: { source: CP5, quote: 'An `eval` probe commit was still blocked by vuln-check.' }
}

export const quality = {
  js: { before: 227.29, after: 227.27, unit: 'kB gz', source: CP4, quote: 'Total JS 227.29 kB, total CSS 13.25 kB.** After: **227.27 kB** / **13.24 kB**' },
  css: { before: 13.25, after: 13.24, unit: 'kB gz', source: CP4, quote: 'Total JS 227.29 kB, total CSS 13.25 kB.** After: **227.27 kB** / **13.24 kB**' },
  net: { value: '−0.03 kB', source: CP4, quote: 'Net −0.03 kB.' },
  unusedAssets: { value: '236 kB', source: CP4, quote: '236 kB from the repo; never bundled' },
  visualDiff: { value: 'byte-identical', source: CP4, quote: 'are byte-identical screenshots' }
}

export const graphify = {
  questions: [
    { id: 'a', text: 'How does a memo go from a .md file to the page?', without: 53054, with: 55355, delta: '+4.3%', source: CP5, quote: '53,054 (4 tool calls) | 55,355 (3) | +4.3%' },
    { id: 'b', text: 'What calls the visitor counter API, and when?', without: 54014, with: 52083, delta: '−3.6%', source: CP5, quote: '54,014 (5) | 52,083 (5) | −3.6%' },
    { id: 'c', text: 'Which components use the card-surface tokens?', without: 54546, with: 53371, delta: '−2.2%', source: CP5, quote: '54,546 (5) | 53,371 (4) | −2.2%' }
  ],
  total: { without: 161614, with: 160809, delta: '−0.5%', source: CP5, quote: '161,614 | 160,809 | **−0.5%**' },
  allCorrect: { source: CP5, quote: '| +4.3% | yes / yes |' },
  why: { source: CP5, quote: 'grep already finds the right file in 1–2 calls' }
}

// Not this workflow's result: the Vite / React 19 toolchain upgrade did this.
export const toolchain = {
  auditBefore: { value: 78, source: TOOLCHAIN, quote: '78 (21 low, 22 moderate, 30 high, 5 critical) | **0**' },
  auditAfter: { value: 0, source: TOOLCHAIN, quote: '78 (21 low, 22 moderate, 30 high, 5 critical) | **0**' }
}

export const REPO = 'https://github.com/m100dev/WebPortfolio'

// Folders in the public repo, linked from "See the code"
export const codePaths = [
  { path: '.claude/skills/', holds: 'the project skills: planning, security, comments, dedupe' },
  { path: 'tools/', holds: 'the vuln-check scanner and the pre-commit checker, with their tests' },
  { path: '.githooks/', holds: 'the git pre-commit and pre-push hooks' },
  { path: 'docs/plans/', holds: 'every checkpointed plan, with its measured Results' }
].map((p) => ({ ...p, url: `${REPO}/tree/main/${p.path.replace(/\/$/, '')}` }))

// Every entry with a source, for the drift test
export const sourced = [
  context.before, context.atSplit, context.after, context.saving, ...context.nested,
  gates.testsBefore, gates.testsAfter, ...gates.matrix, gates.evalAgain,
  quality.js, quality.css, quality.net, quality.unusedAssets, quality.visualDiff,
  ...graphify.questions, graphify.total, graphify.allCorrect, graphify.why,
  toolchain.auditBefore, toolchain.auditAfter
]
