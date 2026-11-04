// Guide metadata. Each guide's body is a React component in this folder,
// loaded lazily by pages/Guide.jsx so it isn't in the home page bundle.
const guides = [
  {
    slug: 'avd-enterprise-workspace',
    title: 'AVD Enterprise Workspace — Project Guide',
    summary: 'Hybrid identity, Microsoft 365, AVD, and Intune lab — including production-grade PowerShell auto-remediation for AVD activation failures.',
    tags: ['Azure Virtual Desktop', 'Entra ID', 'Intune', 'PowerShell'],
    readingTime: '35 min read',
    repo: 'https://github.com/m100dev/AVD-Enterprise-Lab-Portfolio'
  },
  {
    slug: 'ai-autonomy-levels',
    title: 'The Five Levels of AI Autonomy',
    summary: 'A practical framework for measuring growth from AI-assisted coding to fully autonomous multi-agent orchestration.',
    tags: ['AI Engineering', 'Agents', 'Framework'],
    readingTime: '15 min read',
    repo: null
  }
]

export const findGuide = (slug) => guides.find((g) => g.slug === slug)

export default guides
