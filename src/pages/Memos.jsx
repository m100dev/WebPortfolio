import React from 'react'
import { Link } from 'react-router-dom'
import { formatMemoDate, visibleMemos } from '../content/memos'
import useDocumentTitle from '../hooks/useDocumentTitle'
import './pages.css'

const Memos = () => {
  useDocumentTitle('Memos')
  const list = visibleMemos()

  return (
    <div className='page'>
      <section className='page-intro'>
        <h5 className='reveal'>Memos</h5>
        <h2 className='reveal'>Short notes</h2>
        <p className='page-intro__lede reveal'>Brief, dated notes on what I’m building and learning.</p>
      </section>

      <div className='container memo-list'>
        {list.length === 0 && <p className='memo-list__empty'>Nothing published yet.</p>}
        <ol>
          {list.map(({ slug, title, date, summary, draft }) => (
            <li key={slug} className='memo-row'>
              <time className='memo-row__date mono' dateTime={date}>{formatMemoDate(date)}</time>
              <div>
                <h3>
                  <Link to={`/memos/${slug}`} className='memo-row__link'>{title}</Link>
                  {draft && <span className='memo-draft mono'>Draft</span>}
                </h3>
                <p className='memo-row__summary'>{summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

export default Memos
