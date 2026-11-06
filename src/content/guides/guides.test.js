import guides, { findGuide } from './index'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

test('every guide has a unique slug', () => {
  const slugs = guides.map((g) => g.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
})

test.each(guides.map((g) => [g.slug, g]))('%s has the metadata the layout needs', (_slug, g) => {
  expect(g.title).toBeTruthy()
  expect(g.summary).toBeTruthy()
  expect(g.Component).toBeTruthy()
  expect(g.updated).toMatch(ISO_DATE)
})

test.each(guides.map((g) => [g.slug, g]))('%s version history matches its current version', (_slug, g) => {
  expect(g.changes.length).toBeGreaterThan(0)
  const [latest] = g.changes
  // changes is newest first, and its top entry is the version shown in the hero
  expect(latest.version).toBe(g.version)
  expect(latest.date).toBe(g.updated)
  for (const c of g.changes) {
    expect(c.date).toMatch(ISO_DATE)
    expect(c.note).toBeTruthy()
  }
})

test('findGuide looks up by slug and misses cleanly', () => {
  expect(findGuide(guides[0].slug)).toBe(guides[0])
  expect(findGuide('no-such-guide')).toBeUndefined()
})
