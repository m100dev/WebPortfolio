import './ai-engineering.css'
import { BsShieldCheck, BsRobot, BsClipboardCheck } from 'react-icons/bs'
import { MdSecurity } from 'react-icons/md'

const data = [
  {
    id: 1,
    icon: <BsShieldCheck />,
    title: 'Automated Quality Enforcement',
    description:
      'Designed a tiered quality gate system that enforces code standards, security policies, and test coverage automatically. Includes auto-formatting on every file change, pre-commit validation that blocks bad code, intelligent audit routing based on what changed, and protected file rules that prevent accidental modification of critical configs.',
    tags: ['Claude Code', 'CI/CD', 'GitHub Actions', 'Git Hooks', 'Automated Testing']
  },
  {
    id: 2,
    icon: <BsRobot />,
    title: 'Multi-Agent Orchestration System',
    description:
      'Built a subagent architecture with specialized AI workers — a read-only researcher for codebase exploration, a reviewer for code quality analysis, and a test-runner for isolated test execution. Each agent has scoped tool access and model selection for cost-efficient, secure operation.',
    tags: ['Claude Code', 'Subagents', 'Context Management', 'Prompt Engineering']
  },
  {
    id: 3,
    icon: <MdSecurity />,
    title: 'AI-Powered Security Auditing',
    description:
      'Created a custom database security audit system that automatically validates multi-tenant data isolation, Row-Level Security policies, soft-delete compliance, and SQL injection prevention across every database operation before code reaches production.',
    tags: ['PostgreSQL', '.NET', 'EF Core', 'Security', 'Automated Auditing']
  },
  {
    id: 4,
    icon: <BsClipboardCheck />,
    title: 'Structured Change Management',
    description:
      'Developed a plan-driven engineering methodology where every change starts with a structured specification — problem statement, dependency ordering, acceptance criteria, and rollback strategy. Changes are implemented one at a time, each verified before moving to the next, ensuring nothing ships without passing automated checks. The same specs are what I hand to AI coding agents, so they build what was planned instead of guessing.',
    tags: ['Spec-Driven Development', 'Systems Design', 'Technical Writing', 'Change Management']
  }
]

const AiEngineering = () => {
  return (
    <section id='ai-engineering'>
      <h5 className='reveal'>02 — How I Build</h5>
      <h2 className='reveal'>AI &amp; automation engineering</h2>

      <div className='ai-engineering__intro reveal'>
        <p>
          I build MyAutoTab with a test-driven Claude Code workflow that cut feature delivery from about a week to under a day — with automated gates for quality, security, and process discipline so agent-written code doesn't reach production unchecked.
        </p>
      </div>

      <div className='container ai-engineering__container'>
        {data.map(({ id, icon, title, description, tags }, index) => (
          <article key={id} className='ai-engineering__card reveal' style={{ '--i': index % 2 }}>
            <div className='ai-engineering__card-icon'>{icon}</div>
            <h3 className='ai-engineering__card-title'>{title}</h3>
            <p className='ai-engineering__card-description'>{description}</p>
            <ul className='ai-engineering__card-tags'>
              {tags.map((tag, index) => (
                <li key={index} className='ai-engineering__tag'>{tag}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AiEngineering
