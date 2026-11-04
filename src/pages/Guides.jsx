import React from 'react'
import { Link } from 'react-router-dom'
import guides from '../content/guides'
import useDocumentTitle from '../hooks/useDocumentTitle'
import './pages.css'

const Guides = () => {
  useDocumentTitle('Guides')

  return (
    <div className='page'>
      <section className='page-intro'>
        <h5 className='reveal'>Guides</h5>
        <h2 className='reveal'>Hands-on guides &amp; frameworks</h2>
        <p className='page-intro__lede reveal'>
          Long-form write-ups from my labs and my AI workflow: what I built, the exact steps, and what I’d tell someone doing it next.
        </p>
      </section>

      <div className='container guide-cards'>
        {guides.map(({ slug, title, summary, tags, readingTime }, index) => (
          <article key={slug} className='guide-card reveal' style={{ '--i': index }}>
            <p className='guide-card__meta mono'>{readingTime}</p>
            <h3><Link to={`/guides/${slug}`} className='guide-card__link'>{title}</Link></h3>
            <p className='guide-card__summary'>{summary}</p>
            <ul className='tag-list'>
              {tags.map((tag) => <li key={tag} className='tag'>{tag}</li>)}
            </ul>
            <span className='guide-card__cta' aria-hidden='true'>Read guide →</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Guides
