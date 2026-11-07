import { lazy } from 'react'
import avdToc from './avd/toc'

// Guide metadata. Each guide's body is a React component in this folder, loaded lazily
// (its own chunk) so the guides don't weigh down the home page.
// repoLabel: the repo button's text (defaults to "Lab repo").
// license: show the CC BY 4.0 line (only where the original guide carried it).
// version / updated (YYYY-MM-DD): shown in the hero and on the Guides cards. Bump both when the
// content changes, and add a line to changes (newest first) for the Version history list.
const guides = [
  {
    slug: 'how-i-build-with-ai-agents',
    eyebrow: 'Build log, measured',
    title: 'How I Build with AI Agents',
    summary: 'The plans, hooks, and skills behind this site, and what each one measurably changed, including the results that came out close to zero.',
    tags: ['AI Engineering', 'Claude Code', 'Security', 'Workflow'],
    readingTime: '5 min read',
    repo: 'https://github.com/m100dev/WebPortfolio',
    repoLabel: 'Source code',
    license: true,
    year: 2026,
    version: '1.3',
    updated: '2026-11-07',
    changes: [
      { version: '1.3', date: '2026-11-07', note: 'Fixed grammar and punctuation.' },
      { version: '1.2', date: '2026-11-06', note: 'Re-measured CLAUDE.md (2.2k tokens now, from 1.2k right after the split), and said exactly which commits the hooks check and which advisories block.' },
      { version: '1.1', date: '2026-11-06', note: 'Linked the source repo now that it’s public.' },
      { version: '1.0', date: '2026-11-06', note: 'First published.' }
    ],
    Component: lazy(() => import('./HowIBuildWithAiAgents'))
  },
  {
    slug: 'avd-enterprise-workspace',
    eyebrow: 'Advanced Portfolio Project',
    title: 'Hybrid Enterprise Workspace with AVD & Auto-Remediation',
    summary: 'Build a complete hybrid identity + endpoint + virtual desktop solution. Includes a production-grade PowerShell remediation that automatically heals Microsoft 365 activation failures on Azure Virtual Desktop session hosts.',
    facts: ['15–25 hours', '7 Phases', 'Mid–Senior Role Ready'],
    tags: ['Azure Virtual Desktop', 'Entra ID', 'Intune', 'PowerShell'],
    readingTime: '80 min read',
    repo: 'https://github.com/m100dev/AVD-Enterprise-Lab-Portfolio',
    footnote: 'Advanced portfolio project for aspiring mid-to-senior cloud engineers / sysadmins.',
    license: true,
    year: 2026,
    version: '1.2',
    updated: '2026-11-07',
    changes: [
      { version: '1.2', date: '2026-11-07', note: 'Fixed grammar and punctuation.' },
      { version: '1.1', date: '2026-11-04', note: 'Reframed for cloud engineers as well as sysadmins.' },
      { version: '1.0', date: '2026-07-01', note: 'First published.' }
    ],
    toc: avdToc,
    Component: lazy(() => import('./AvdEnterpriseWorkspace'))
  },
  {
    slug: 'ai-autonomy-levels',
    eyebrow: 'Framework for AI Engineers',
    title: 'The Five Levels of AI Autonomy',
    summary: 'A practical guide for measuring your growth from AI-assisted coding to fully autonomous multi-agent orchestration. Track skills as you master them.',
    tags: ['AI Engineering', 'Agents', 'Framework'],
    readingTime: '5 min read',
    repo: null,
    license: true,
    year: 2026,
    version: '1.2',
    updated: '2026-11-07',
    changes: [
      { version: '1.2', date: '2026-11-07', note: 'Fixed grammar and punctuation.' },
      { version: '1.1', date: '2026-11-04', note: 'Made the framework tool-agnostic: it now applies to any agentic coding tool, not just Claude Code.' },
      { version: '1.0', date: '2026-07-01', note: 'First published.' }
    ],
    Component: lazy(() => import('./AiAutonomyLevels'))
  }
]

export const findGuide = (slug) => guides.find((g) => g.slug === slug)

export default guides
