import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { context, gates, graphify, quality, sourced, toolchain } from './data'

// Vitest runs from the repo root (vite.config.mjs); under jsdom import.meta.url isn't a file: URL
const read = (path) => readFileSync(resolve(process.cwd(), path), 'utf8')

test.each(sourced.map((e) => [e.quote, e]))('"%s" is still in its source plan file', (_quote, entry) => {
  expect(entry.source).toMatch(/^docs\/plans\/.+\.md$/)
  expect(read(entry.source)).toContain(entry.quote)
})

// A value typed wrong in data.js would still pass the test above, so tie each number to its quote
test('every charted number appears in the quote it cites', () => {
  const n = (v) => v.toLocaleString('en-US')
  expect(context.before.quote).toContain(`${context.before.value}k`)
  expect(context.after.quote).toContain(`${context.after.value}k`)
  expect(gates.testsBefore.quote).toContain(`${gates.testsBefore.value}/${gates.testsBefore.value}`)
  expect(gates.testsAfter.quote).toContain(`${gates.testsAfter.value}/${gates.testsAfter.value}`)
  for (const k of ['js', 'css']) {
    expect(quality[k].quote).toContain(`${quality[k].before} kB`)
    expect(quality[k].quote).toContain(`${quality[k].after} kB`)
  }
  for (const q of [...graphify.questions, graphify.total]) {
    expect(q.quote).toContain(n(q.without))
    expect(q.quote).toContain(n(q.with))
    expect(q.quote).toContain(q.delta)
  }
  expect(toolchain.auditBefore.quote).toMatch(new RegExp(`^${toolchain.auditBefore.value} `))
  expect(toolchain.auditAfter.quote).toContain(`**${toolchain.auditAfter.value}**`)
})

test('the README headline numbers match this page', () => {
  const readme = read('README.md')
  expect(readme).toContain(`${context.before.value}k → ${context.after.value}k`)
  expect(readme).toContain(context.saving.value)
  expect(readme).toContain(graphify.total.delta)
  expect(readme).toContain('/guides/how-i-build-with-ai-agents')
})
