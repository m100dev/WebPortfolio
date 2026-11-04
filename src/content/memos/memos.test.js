import { findMemo, hasPublishedMemos, visibleMemos } from './index'

const list = [
  { slug: 'older', date: '2026-01-10', draft: false },
  { slug: 'draft', date: '2026-03-01', draft: true },
  { slug: 'newer', date: '2026-02-20', draft: false }
]

test('hides drafts unless asked, newest first', () => {
  expect(visibleMemos(list, false).map((m) => m.slug)).toEqual(['newer', 'older'])
  expect(visibleMemos(list, true).map((m) => m.slug)).toEqual(['draft', 'newer', 'older'])
})

test('a draft slug is not found when drafts are hidden (so the route 404s)', () => {
  expect(findMemo('draft', list, false)).toBeUndefined()
  expect(findMemo('draft', list, true)?.slug).toBe('draft')
})

test('the Memos nav link needs at least one published memo', () => {
  expect(hasPublishedMemos(list)).toBe(true)
  expect(hasPublishedMemos([{ slug: 'x', date: '2026-01-01', draft: true }])).toBe(false)
  expect(hasPublishedMemos([])).toBe(false)
})
