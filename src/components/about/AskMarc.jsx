import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsCheck2, BsArrowCounterclockwise } from 'react-icons/bs'
import './askmarc.css'

// Canned answers, assembled only from copy already on the site (bio, experience, How I Build,
// certifications, contact). No model is involved; if this ever moves to a real LLM, it should
// be grounded on the same facts.
// link: optional follow-up, a route (to) or an in-page anchor (href).
export const prompts = [
  {
    id: 'building',
    question: 'What are you building right now?',
    answer: 'Right now that’s MyAutoTab, a vehicle management app for owners of cars, boats, jet skis, and ATVs. I built it end to end with React, .NET, and PostgreSQL: a multi-tenant SaaS with tenant data isolation through PostgreSQL Row-Level Security, automated backups, and a GitHub Actions CI/CD pipeline. It’s in staging with 5 test users. On the side, I run a sandboxed local AI agent on a Mac mini M5 Pro, comparing open-source LLMs on speed and output quality.',
    link: { href: '#portfolio', label: 'See the projects' }
  },
  {
    id: 'background',
    question: 'What’s your background?',
    answer: 'I spent six years keeping enterprise systems running for a city government, a healthcare company, and airline customers on AWS and Azure. At the City of Miami Beach I handled identity and device management across Active Directory, Entra ID, and Intune with Autopilot for 3,000+ devices. At Trax Corp I maintained AWS infrastructure for airline customers’ production environments, and earlier roles include frontend development at Wiretap Telecom and Xtreme Polishing Systems.',
    link: { href: '#experience', label: 'Full experience' }
  },
  {
    id: 'ai',
    question: 'How do you use AI to build software?',
    answer: 'I build MyAutoTab with a test-driven Claude Code workflow that cut feature delivery from about a week to under a day. It has automated gates for quality, security, and process discipline so agent-written code doesn’t reach production unchecked: specialized subagents (a read-only researcher, a reviewer, and a test-runner), database security audits in the CI/CD pipeline, and plan-driven changes where every change starts with a spec and acceptance criteria.',
    link: { to: '/guides/ai-autonomy-levels', label: 'Read my AI autonomy framework' }
  },
  {
    id: 'certs',
    question: 'What certifications do you have?',
    answer: 'CCNA (2026), Azure Fundamentals (2024), and CIW JavaScript Specialist (2021). I’m working toward CompTIA Security+ and studying Applied Agentic AI at Virginia Tech.'
  },
  {
    id: 'roles',
    question: 'Are you open to roles?',
    answer: 'Yes. I’m open to Cloud & AI engineering roles in the DC/Maryland area or remote. I’m a U.S. citizen, eligible for a security clearance. The quickest way to reach me is mbastien.dev@gmail.com or the contact form.',
    link: { href: '#contact', label: 'Get in touch' }
  }
]

const THINK_MS = 550
const WORD_MS = 32

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const FollowUp = ({ link }) =>
  link.to
    ? <Link to={link.to} className='askmarc__followup'>{link.label} →</Link>
    : <a href={link.href} className='askmarc__followup'>{link.label} →</a>

// "Ask Marc": a chat-style panel with prompt chips. The answer "types" in word by word
// (instant under reduced motion). Screen readers get each finished answer once, via a
// separate live region, instead of every streamed word.
const AskMarc = () => {
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const timers = useRef([])
  const transcript = useRef(null)
  const nextId = useRef(0)

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t))
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  // Keep the newest message in view inside the transcript (without scrolling the page)
  useEffect(() => {
    const el = transcript.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const ask = (prompt) => {
    if (busy) return
    const qId = nextId.current++
    const aId = nextId.current++
    const words = prompt.answer.split(' ')
    const finish = () => {
      setMessages((list) => list.map((m) => (m.id === aId ? { ...m, shown: words.length, done: true } : m)))
      setAnnouncement(`Marc: ${prompt.answer}`)
      setBusy(false)
    }

    setBusy(true)
    setAnnouncement('')
    setMessages((list) => [...list, { id: qId, role: 'user', promptId: prompt.id, text: prompt.question }])

    if (prefersReducedMotion()) {
      setMessages((list) => [...list, { id: aId, role: 'marc', prompt, shown: words.length, done: false }])
      finish()
      return
    }

    // "Thinking" dots, then stream word by word
    setMessages((list) => [...list, { id: aId, role: 'marc', prompt, shown: 0, done: false }])
    const step = (n) => {
      if (n >= words.length) {
        finish()
        return
      }
      setMessages((list) => list.map((m) => (m.id === aId ? { ...m, shown: n + 1 } : m)))
      later(() => step(n + 1), WORD_MS)
    }
    later(() => step(0), THINK_MS)
  }

  const reset = () => {
    clearTimers()
    setMessages([])
    setAnnouncement('')
    setBusy(false)
  }

  const asked = new Set(messages.filter((m) => m.role === 'user').map((m) => m.promptId))

  return (
    <div className='askmarc'>
      <div className='askmarc__head'>
        <span className='askmarc__avatar mono' aria-hidden='true'>MB</span>
        <div>
          <p className='askmarc__title'>Ask Marc</p>
          <p className='askmarc__subtitle mono'>canned answers, written by me</p>
        </div>
        {messages.length > 0 && (
          <button type='button' className='askmarc__reset' onClick={reset}>
            <BsArrowCounterclockwise aria-hidden='true' /> Start over
          </button>
        )}
      </div>

      <div className='askmarc__transcript' ref={transcript} aria-label='Conversation'>
        {messages.length === 0 && (
          <p className='askmarc__empty'>Pick a question below.</p>
        )}
        {messages.map((m) =>
          m.role === 'user' ? (
            <p key={m.id} className='askmarc__bubble askmarc__bubble--user'>{m.text}</p>
          ) : (
            <div key={m.id} className='askmarc__bubble askmarc__bubble--marc' aria-hidden={!m.done || undefined}>
              {m.shown === 0 ? (
                <span className='askmarc__thinking' aria-label='Marc is typing'>
                  <span /><span /><span />
                </span>
              ) : (
                <p>
                  {m.prompt.answer.split(' ').slice(0, m.shown).join(' ')}
                  {!m.done && <span className='askmarc__caret' aria-hidden='true' />}
                </p>
              )}
              {m.done && m.prompt.link && <FollowUp link={m.prompt.link} />}
            </div>
          )
        )}
      </div>

      <p className='visually-hidden' aria-live='polite'>{announcement}</p>

      <div className='askmarc__composer' role='group' aria-label='Questions you can ask'>
        {prompts.map((p) => {
          const done = asked.has(p.id)
          return (
            <button
              key={p.id}
              type='button'
              className={done ? 'askmarc__chip is-asked' : 'askmarc__chip'}
              onClick={() => ask(p)}
              disabled={busy || done}
            >
              {done && <BsCheck2 aria-hidden='true' />}
              {p.question}
              {done && <span className='visually-hidden'> (asked)</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default AskMarc
