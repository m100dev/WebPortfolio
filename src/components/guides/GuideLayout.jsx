import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BsArrowLeft, BsGithub } from 'react-icons/bs'
import formatDate from '../../utils/formatDate'
import './guide.css'

const slugify = (text) =>
  text.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Builds the table of contents: the guide's explicit `toc` list when it has one
// ([{ id, text, sub }]), otherwise the content's h2s (given ids if needed).
const useHeadings = (contentRef, toc) => {
  const [headings, setHeadings] = useState([])

  useEffect(() => {
    const root = contentRef.current
    if (!root) return
    if (toc) {
      setHeadings(toc.filter(({ id }) => document.getElementById(id)))
      return
    }
    const used = new Set()
    const found = Array.from(root.querySelectorAll('h2')).map((h) => {
      if (!h.id) {
        let id = slugify(h.textContent) || 'section'
        while (used.has(id) || document.getElementById(id)) id += '-x'
        h.id = id
      }
      used.add(h.id)
      return { id: h.id, text: h.dataset.toc || h.textContent.trim() }
    })
    setHeadings(found)
  }, [contentRef, toc])

  return headings
}

// The heading most recently scrolled past the top third of the viewport is "current".
const useScrollSpy = (headings) => {
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (!headings.length) return undefined
    const elements = headings.map(({ id }) => document.getElementById(id)).filter(Boolean)
    let frame = null
    const update = () => {
      frame = null
      const line = window.innerHeight * 0.3
      let active = elements[0]?.id ?? null
      elements.forEach((el) => {
        if (el.getBoundingClientRect().top <= line) active = el.id
      })
      setCurrent(active)
    }
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame !== null) window.cancelAnimationFrame(frame)
    }
  }, [headings])

  return current
}

const TocList = ({ headings, current, onPick }) => (
  <ol className='guide-toc__list'>
    {headings.map(({ id, text, sub }) => (
      <li key={id} className={sub ? 'guide-toc__sub' : undefined}>
        <a
          href={`#${id}`}
          className={current === id ? 'is-current' : ''}
          aria-current={current === id ? 'location' : undefined}
          onClick={(e) => {
            // Keep the route clean (no #hash) and avoid the router treating it as navigation
            e.preventDefault()
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            onPick?.()
          }}
        >
          {text}
        </a>
      </li>
    ))}
  </ol>
)

// header.css / footer.css style the bare <header>/<footer> elements, so the hero and
// footer here are divs.
// Shared shell for every guide: hero, sticky table of contents with scroll-spy, content, license line.
const GuideLayout = ({ guide, children }) => {
  const contentRef = useRef(null)
  const headings = useHeadings(contentRef, guide.toc)
  const current = useScrollSpy(headings)
  const mobileToc = useRef(null)

  return (
    <article className='guide'>
      <div className='guide__hero'>
        <Link to='/guides' className='guide__back'>
          <BsArrowLeft aria-hidden='true' /> All guides
        </Link>
        <p className='guide__eyebrow mono'>{guide.eyebrow || 'Guide'} · {guide.readingTime}</p>
        <h1 className='guide__title'>{guide.title}</h1>
        <p className='guide__summary'>{guide.summary}</p>
        {guide.version && (
          <p className='guide__version mono'>
            v{guide.version} · Updated <time dateTime={guide.updated}>{formatDate(guide.updated)}</time>
          </p>
        )}
        {guide.facts && (
          <ul className='guide__facts mono'>
            {guide.facts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
        )}
        <div className='guide__meta'>
          <ul className='tag-list'>
            {guide.tags.map((tag) => <li key={tag} className='tag'>{tag}</li>)}
          </ul>
          {guide.repo && (
            <a href={guide.repo} target='_blank' rel='noreferrer' className='btn guide__repo'>
              <BsGithub aria-hidden='true' /> Lab repo
            </a>
          )}
        </div>
      </div>

      <div className='guide__body'>
        {headings.length > 1 && (
          <nav className='guide-toc' aria-label='On this page'>
            <p className='guide-toc__title mono'>On this page</p>
            <TocList headings={headings} current={current} />
          </nav>
        )}

        {headings.length > 1 && (
          <details className='guide-toc-mobile' ref={mobileToc}>
            <summary className='mono'>
              On this page
              {current && (
                <span className='guide-toc-mobile__current'>
                  {headings.find((h) => h.id === current)?.text}
                </span>
              )}
            </summary>
            <TocList
              headings={headings}
              current={current}
              onPick={() => mobileToc.current?.removeAttribute('open')}
            />
          </details>
        )}

        <div className='guide__content' ref={contentRef}>
          {children}
        </div>
      </div>

      <div className='guide__footer'>
        <Link to='/guides' className='guide__back'>
          <BsArrowLeft aria-hidden='true' /> Back to Guides
        </Link>
        {guide.footnote && <p className='guide__footnote'>{guide.footnote}</p>}
        {guide.changes?.length > 0 && (
          <details className='guide__changelog'>
            <summary className='mono'>Version history</summary>
            <ol>
              {guide.changes.map((change) => (
                <li key={change.version}>
                  <span className='guide__changelog-meta mono'>
                    v{change.version} · <time dateTime={change.date}>{formatDate(change.date)}</time>
                  </span>
                  <span>{change.note}</span>
                </li>
              ))}
            </ol>
          </details>
        )}
        {guide.license && (
          <p className='guide__license'>
            © {guide.year} Marc Bastien · Licensed{' '}
            <a href='https://creativecommons.org/licenses/by/4.0/' target='_blank' rel='noreferrer license'>CC BY 4.0</a>
          </p>
        )}
      </div>
    </article>
  )
}

export default GuideLayout
