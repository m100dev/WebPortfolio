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
// `date` is both the release date and the date shown on the memo. One field, so the date a
// reader sees is always the day the memo went live. Development shows everything.
// The nav shows "Memos" only once at least one memo is live.
// Drafts live in `drafts` below, not here, and load their body with a dynamic import. A static
// import would ship the body in build/assets, and draft metadata in this list would ship the
// title and summary, even though the route 404s.
const published = [
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
  }
]

// Development only. The condition has to sit inline: a production build folds it to [] and drops
// both the entries and their imports. A helper function (devOnly(...)) isn't folded, and the
// file still shipped when I tried one.
const drafts = import.meta.env.DEV
  ? [
      {
        slug: '_template',
        title: 'Memo template',
        date: '2026-11-04',
        summary: 'Format reference for new memos. Never published.',
        draft: true,
        load: () => import('./_template.md?url')
      }
    ]
  : []

export const memos = [...published, ...drafts]

// The URL to fetch a memo's Markdown from: the bundled file, or a draft's dev-only loader
export const memoUrl = (memo) => {
  if (memo.file) return Promise.resolve(memo.file)
  if (memo.load) return memo.load().then((mod) => mod.default)
  return Promise.reject(new Error(`No body for memo ${memo.slug}`))
}

// Development previews everything: drafts and scheduled memos, each with a badge
const PREVIEW = !import.meta.env.PROD

// I release memos on the visitor's local date, not toISOString(). That one is UTC, so on a
// US evening it's already tomorrow, and a memo scheduled for tomorrow would go live early.
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
