import React from 'react'
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
    tags: ['CI/CD', 'Git Hooks', 'Bash', 'Automated Testing', 'Quality Assurance']
  },
  {
    id: 2,
    icon: <BsRobot />,
    title: 'Multi-Agent Orchestration System',
    description:
      'Built a subagent architecture with specialized AI workers — a read-only researcher for codebase exploration, a reviewer for code quality analysis, and a test-runner for isolated test execution. Each agent has scoped tool access and model selection for cost-efficient, secure operation.',
    tags: ['Agent Design', 'Context Management', 'Prompt Engineering', 'Task Decomposition']
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
      'Developed a plan-driven engineering methodology where every change starts with a structured specification — problem statement, dependency ordering, acceptance criteria, and rollback strategy. Changes are implemented one at a time, each verified before moving to the next, ensuring nothing ships without passing automated checks.',
    tags: ['Systems Design', 'Technical Writing', 'Change Management', 'Process Engineering']
  }
]

const AiEngineering = () => {
  return (
    <section id='ai-engineering'>
      <h5>Building the Future</h5>
      <h2>AI &amp; Automation Engineering</h2>

      <p className='ai-engineering__intro'>
        I design automated systems that enforce quality, security, and process discipline — so nothing reaches production without passing through structured gates.
      </p>

      <div className='container ai-engineering__container'>
        {data.map(({ id, icon, title, description, tags }) => (
          <article key={id} className='ai-engineering__card'>
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
