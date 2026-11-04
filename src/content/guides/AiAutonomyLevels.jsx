import React, { useCallback, useState } from 'react'
import DATA from './ai-autonomy/data'
import Icon from './ai-autonomy/Icon'
import './ai-autonomy/ai-autonomy.css'

// Same key and shape as the original standalone page ({ "<level>-<skill>": bool }),
// so visitors who ticked skills there keep their progress.
export const STORAGE_KEY = 'alv4'

const storageWorks = () => {
  try {
    window.localStorage.setItem('__alv_test__', '1')
    window.localStorage.removeItem('__alv_test__')
    return true
  } catch {
    return false
  }
}

const readChecks = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const useChecklist = () => {
  const [checks, setChecks] = useState(readChecks)
  const [storage] = useState(storageWorks)

  const toggle = useCallback((key) => {
    setChecks((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Not saved (private mode); progress lasts for this visit
      }
      return next
    })
  }, [])

  return { checks, storage, toggle }
}

const progress = (level, checks) => {
  const total = level.skills.length
  const done = level.skills.filter((_, i) => checks[`${level.id}-${i}`]).length
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 }
}

// Each level's colour slot (c1..c5) maps to a theme-aware accent in ai-autonomy.css
const levelStyle = (level) => ({ '--lv': `var(--alv-${level.c})`, '--lv-rgb': `var(--alv-${level.c}-rgb)` })

const scrollToId = (e, id) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const pad = (n) => String(n).padStart(2, '0')

// Ordered jump nav: one cell per level with a rising meter (lit up to that level) and a
// hairline along the bottom that fills with the level's checklist progress. Nothing shows
// at 0, so a first-time visitor doesn't see a row of "0%".
const AutonomyScale = ({ checks }) => (
  <nav className='alv-scale' aria-labelledby='alv-scale-label'>
    <p className='alv-scale__label mono' id='alv-scale-label'>Jump to a level</p>
    <ol className='alv-scale__list'>
      {DATA.map((level) => {
        const { done, total, pct } = progress(level, checks)
        return (
          <li key={level.id}>
            <a
              href={`#level-${level.id}`}
              className={done === total ? 'alv-scale__cell is-done' : 'alv-scale__cell'}
              style={{ ...levelStyle(level), '--pct': `${pct}%` }}
              onClick={(e) => scrollToId(e, `level-${level.id}`)}
            >
              <span className='alv-scale__top'>
                <span className='alv-scale__num mono'>
                  <span className='visually-hidden'>Level </span>{pad(level.id)}
                  {done === total && <Icon name='check' />}
                </span>
                <span className='alv-scale__arrow mono' aria-hidden='true'>↓</span>
              </span>
              <span className='alv-scale__name'>{level.label}</span>
              <span className='alv-scale__meter' aria-hidden='true'>
                {DATA.map((step) => <span key={step.id} className={step.id <= level.id ? 'is-on' : undefined} />)}
              </span>
              {done > 0 && (
                <span className='visually-hidden'>
                  {done === total ? ', all skills checked' : `, ${done} of ${total} skills checked`}
                </span>
              )}
              <span className='alv-scale__progress' aria-hidden='true' />
            </a>
          </li>
        )
      })}
    </ol>
  </nav>
)

const FlowDiagram = ({ flow }) => (
  <div className='alv-diagram'>
    <div className='alv-diagram__top'>
      <span className='alv-diagram__label mono'>Workflow</span>
      <div className='alv-diagram__legend'>
        <span><span className='alv-legend alv-legend--you' /> You</span>
        <span><span className='alv-legend alv-legend--agent' /> Agent</span>
      </div>
    </div>
    <ol className='alv-flow'>
      {flow.map((node, i) => (
        <li key={node.t} className={node.h ? 'alv-node alv-node--you' : 'alv-node'}>
          {i > 0 && <Icon name='chevR' className='alv-flow__arrow' />}
          <span className='alv-node__circle'>
            <Icon name={node.i} />
            {node.h && <span className='alv-node__badge'>You</span>}
          </span>
          <span className='alv-node__text'>{node.t}</span>
        </li>
      ))}
    </ol>
  </div>
)

const InfoCards = ({ cards }) => (
  <div className='alv-cards'>
    {cards.map((card) => (
      <div key={card.t} className='alv-card'>
        <div className='alv-card__head'>
          <span className='alv-card__icon'><Icon name={card.i} /></span>
          <h3>{card.t}</h3>
        </div>
        <ul>
          {card.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    ))}
  </div>
)

const SkillChecklist = ({ level, checks, onToggle }) => {
  const { done, total, pct } = progress(level, checks)
  return (
    <div className='alv-checklist'>
      <div className='alv-checklist__top'>
        <h3 className='alv-checklist__label'><Icon name='school' /> Skills to master</h3>
        <span className='alv-checklist__pct mono' title={`${done} of ${total} skills checked`}>{pct}%</span>
      </div>
      <div
        className='alv-checklist__track'
        role='progressbar'
        aria-label={`Level ${level.id} skills`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className='alv-checklist__fill' style={{ width: `${pct}%` }} />
      </div>
      <ul>
        {level.skills.map((skill, i) => {
          const key = `${level.id}-${i}`
          const on = !!checks[key]
          return (
            <li key={key}>
              <label className={on ? 'alv-skill is-on' : 'alv-skill'}>
                <input type='checkbox' checked={on} onChange={() => onToggle(key)} />
                <span className='alv-skill__box' aria-hidden='true'><Icon name='check' /></span>
                <span className='alv-skill__text'>{skill}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const NextSteps = ({ level }) => (
  <div className='alv-next'>
    <h3 className='alv-next__title'>
      <Icon name='rocket' /> {level.id < 5 ? `How to reach level ${level.id + 1}` : 'What comes next'}
    </h3>
    <ol>
      {level.next.map((step) => (
        <li key={step.s}>
          <strong>{step.s}</strong>
          <span>{step.d}</span>
        </li>
      ))}
    </ol>
  </div>
)

const LevelSection = ({ level, next, checks, onToggle }) => (
  <section className='alv-level' id={`level-${level.id}`} style={levelStyle(level)}>
    <div className='alv-level__head'>
      <span className='alv-level__num mono' aria-hidden='true'>{level.id}</span>
      <div>
        <h2 data-toc={`L${level.id} · ${level.title}`}>
          <span className='visually-hidden'>Level {level.id}: </span>{level.title}
        </h2>
        <p>{level.desc}</p>
      </div>
    </div>

    <FlowDiagram flow={level.flow} />
    <InfoCards cards={level.cards} />
    <SkillChecklist level={level} checks={checks} onToggle={onToggle} />
    <NextSteps level={level} />

    {next && (
      <a
        href={`#level-${next.id}`}
        className='alv-go-next'
        style={levelStyle(next)}
        onClick={(e) => scrollToId(e, `level-${next.id}`)}
      >
        <span>
          <span className='alv-go-next__sub mono'>Next level · {pad(next.id)}</span>
          <span className='alv-go-next__name'>{next.title}</span>
        </span>
        <Icon name='arrowR' />
      </a>
    )}
  </section>
)

// "The Five Levels of AI Autonomy": five levels, each with a workflow diagram,
// what-to-do cards, a skills checklist (saved in this browser) and steps to the next level.
const AiAutonomyLevels = () => {
  const { checks, storage, toggle } = useChecklist()
  const [noticeDismissed, setNoticeDismissed] = useState(false)

  return (
    <div className='alv'>
      {!storage && !noticeDismissed && (
        <p className='alv-notice' role='status'>
          Checklist progress won’t be saved in this browser session.{' '}
          <button type='button' onClick={() => setNoticeDismissed(true)}>Dismiss</button>
        </p>
      )}

      <AutonomyScale checks={checks} />

      {DATA.map((level, i) => (
        <LevelSection key={level.id} level={level} next={DATA[i + 1]} checks={checks} onToggle={toggle} />
      ))}
    </div>
  )
}

export default AiAutonomyLevels
