import templateFile from './_template.md'
import formatDate from '../../utils/formatDate'

// Memos: short posts. Each body is a Markdown file in this folder, imported as a URL
// (CRA emits it as a static asset) and fetched by pages/Memo.jsx.
// draft: true memos only render in development; in production they 404 and stay out of the list.
// The nav shows "Memos" only once at least one memo is published.
export const memos = [
  {
    slug: '_template',
    title: 'Memo template',
    date: '2026-11-04',
    summary: 'Format reference for new memos. Never published.',
    draft: true,
    file: templateFile
  }
]

const SHOW_DRAFTS = process.env.NODE_ENV !== 'production'

// Newest first; drafts only when asked for
export const visibleMemos = (list = memos, includeDrafts = SHOW_DRAFTS) =>
  list
    .filter((memo) => includeDrafts || !memo.draft)
    .sort((a, b) => b.date.localeCompare(a.date))

export const findMemo = (slug, list = memos, includeDrafts = SHOW_DRAFTS) =>
  visibleMemos(list, includeDrafts).find((memo) => memo.slug === slug)

export const hasPublishedMemos = (list = memos) => list.some((memo) => !memo.draft)

export const formatMemoDate = formatDate
