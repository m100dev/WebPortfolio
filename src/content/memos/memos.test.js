import { findMemo, hasPublishedMemos, isScheduled, todayISO, visibleMemos } from './index'

const TODAY = '2026-03-15'

const list = [
  { slug: 'older', date: '2026-01-10', draft: false },
  { slug: 'draft', date: '2026-03-01', draft: true },
  { slug: 'newer', date: '2026-02-20', draft: false },
  { slug: 'scheduled', date: '2026-04-01', draft: false },
  { slug: 'future-draft', date: '2026-04-01', draft: true }
]

const slugs = (memos) => memos.map((m) => m.slug)

test('production shows only live memos, newest first', () => {
  expect(slugs(visibleMemos(list, false, TODAY))).toEqual(['newer', 'older'])
})

test('preview (development) shows drafts and scheduled memos too', () => {
  expect(slugs(visibleMemos(list, true, TODAY))).toEqual(['scheduled', 'future-draft', 'draft', 'newer', 'older'])
})

test('a scheduled memo goes live on its date, not before', () => {
  expect(slugs(visibleMemos(list, false, '2026-03-31'))).not.toContain('scheduled')
  expect(slugs(visibleMemos(list, false, '2026-04-01'))).toContain('scheduled')
  expect(isScheduled(list[3], TODAY)).toBe(true)
  expect(isScheduled(list[3], '2026-04-01')).toBe(false)
})

test('a draft stays hidden even after its date passes', () => {
  expect(slugs(visibleMemos(list, false, '2027-01-01'))).not.toContain('future-draft')
  expect(isScheduled(list[4], TODAY)).toBe(false)
})

test('draft and scheduled slugs are not found in production (so the route 404s)', () => {
  expect(findMemo('draft', list, false, TODAY)).toBeUndefined()
  expect(findMemo('scheduled', list, false, TODAY)).toBeUndefined()
  expect(findMemo('draft', list, true, TODAY)?.slug).toBe('draft')
  expect(findMemo('scheduled', list, false, '2026-04-01')?.slug).toBe('scheduled')
})

test('the Memos nav link needs at least one live memo', () => {
  expect(hasPublishedMemos(list, TODAY)).toBe(true)
  expect(hasPublishedMemos([{ slug: 'x', date: '2026-01-01', draft: true }], TODAY)).toBe(false)
  expect(hasPublishedMemos([{ slug: 'y', date: '2026-04-01', draft: false }], TODAY)).toBe(false)
  expect(hasPublishedMemos([], TODAY)).toBe(false)
})

test('todayISO uses the local date, zero-padded', () => {
  expect(todayISO(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05')
})
