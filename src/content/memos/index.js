import templateFile from './_template.md?url'
import index0File from './index-0-local-ai-tutor.md?url'
import gpuServerFile from './dual-5070-ti-image-server.md?url'
import ankiFile from './ai-made-my-anki-cards.md?url'
import formatDate from '../../utils/formatDate'

// Memos: short posts. Each body is a Markdown file in this folder, imported as a URL
// (Vite emits it as a static asset) and fetched by pages/Memo.jsx.
// Release rules (production):
//   draft: true                        -> hidden, whatever the date (the route 404s)
//   draft: false, date in the future   -> scheduled: hidden until that date, then appears on its own
//   draft: false, date today or past   -> live
// `date` is both the release date and the date shown on the memo. Development shows everything.
// The nav shows "Memos" only once at least one memo is live.
export const memos = [
  {
    slug: 'index-0-local-ai-tutor',
    title: 'Index 0 gets AI tutoring right',
    date: '2026-11-05',
    summary: 'A free, local-first learning app whose AI coach helps you work through DSA problems instead of handing over the answer.',
    draft: false,
    file: index0File
  },
  {
    slug: 'dual-5070-ti-image-server',
    title: 'My Mac mini is getting a GPU worker',
    date: '2026-11-05',
    summary: 'Two 5070 Tis on the LAN to take image and high-bandwidth jobs off my Mac mini.',
    draft: false,
    file: gpuServerFile
  },
  {
    slug: 'ai-made-my-anki-cards',
    title: 'I stopped typing my own flashcards',
    date: '2026-11-04',
    summary: 'I hand-typed every CCNA card. Now AI drafts them and I review them.',
    draft: false,
    file: ankiFile
  },
  {
    slug: '_template',
    title: 'Memo template',
    date: '2026-11-04',
    summary: 'Format reference for new memos. Never published.',
    draft: true,
    file: templateFile
  }
]

// Development previews everything: drafts and scheduled memos, each with a badge
const PREVIEW = !import.meta.env.PROD

// The visitor's local date as YYYY-MM-DD (not toISOString, which is UTC and runs a day ahead on US evenings)
export const todayISO = (now = new Date()) =>
  [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((n) => String(n).padStart(2, '0')).join('-')

// YYYY-MM-DD strings compare correctly as plain strings
export const isLive = (memo, today = todayISO()) => !memo.draft && memo.date <= today
export const isScheduled = (memo, today = todayISO()) => !memo.draft && memo.date > today

// Newest first; only live memos unless previewing
export const visibleMemos = (list = memos, preview = PREVIEW, today = todayISO()) =>
  list
    .filter((memo) => preview || isLive(memo, today))
    .sort((a, b) => b.date.localeCompare(a.date))

export const findMemo = (slug, list = memos, preview = PREVIEW, today = todayISO()) =>
  visibleMemos(list, preview, today).find((memo) => memo.slug === slug)

export const hasPublishedMemos = (list = memos, today = todayISO()) => list.some((memo) => isLive(memo, today))

export const formatMemoDate = formatDate
