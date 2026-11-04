import { lazy } from 'react'
import avdToc from './avd/toc'

// Guide metadata. Each guide's body is a React component in this folder, loaded lazily
// (its own chunk) so the guides don't weigh down the home page.
// license: show the CC BY 4.0 line (only where the original guide carried it).
const guides = [
  {
    slug: 'avd-enterprise-workspace',
    eyebrow: 'Advanced Portfolio Project',
    title: 'Hybrid Enterprise Workspace with AVD & Auto-Remediation',
    summary: 'Build a complete hybrid identity + endpoint + virtual desktop solution. Includes a production-grade PowerShell remediation that automatically heals Microsoft 365 activation failures on Azure Virtual Desktop session hosts.',
    facts: ['15–25 hours', '7 Phases', 'Mid–Senior Role Ready'],
    tags: ['Azure Virtual Desktop', 'Entra ID', 'Intune', 'PowerShell'],
    readingTime: '80 min read',
    repo: 'https://github.com/m100dev/AVD-Enterprise-Lab-Portfolio',
    footnote: 'Advanced portfolio project for aspiring mid-to-senior system administrators.',
    license: true,
    year: 2026,
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
    Component: lazy(() => import('./AiAutonomyLevels'))
  }
]

export const findGuide = (slug) => guides.find((g) => g.slug === slug)

export default guides
