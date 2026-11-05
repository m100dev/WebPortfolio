import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BsArrowLeft } from 'react-icons/bs'
import { findMemo, formatMemoDate, isScheduled } from '../content/memos'
import NotFound from './NotFound'
import useDocumentTitle from '../hooks/useDocumentTitle'
import './pages.css'

// External links open in a new tab; same-site links stay in place
const MarkdownLink = ({ href = '', children, node, ...props }) => {
  const external = /^https?:\/\//.test(href) && !href.includes('marcbastien.com')
  return external
    ? <a href={href} target='_blank' rel='noreferrer' {...props}>{children}</a>
    : <a href={href} {...props}>{children}</a>
}

const Memo = () => {
  const { slug } = useParams()
  const memo = findMemo(slug)
  const [body, setBody] = useState({ status: 'loading', text: '' })
  useDocumentTitle(memo ? memo.title : 'Page not found')

  useEffect(() => {
    if (!memo) return undefined
    let cancelled = false
    setBody({ status: 'loading', text: '' })
    fetch(memo.file)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => { if (!cancelled) setBody({ status: 'ready', text }) })
      .catch(() => { if (!cancelled) setBody({ status: 'error', text: '' }) })
    return () => { cancelled = true }
  }, [memo])

  if (!memo) return <NotFound/>

  return (
    <div className='page'>
      <article className='memo'>
        <Link to='/memos' className='memo__back'>
          <BsArrowLeft aria-hidden='true' /> All memos
        </Link>
        <div className='memo__head'>
          <time className='memo__date mono' dateTime={memo.date}>{formatMemoDate(memo.date)}</time>
          {memo.draft && <span className='memo-draft mono'>Draft · not published</span>}
          {isScheduled(memo) && <span className='memo-draft mono'>Scheduled · goes live {formatMemoDate(memo.date)}</span>}
          <h1>{memo.title}</h1>
          <p className='memo__summary'>{memo.summary}</p>
        </div>

        {body.status === 'loading' && <p className='memo__status mono' role='status'>Loading…</p>}
        {body.status === 'error' && <p className='memo__status' role='alert'>This memo couldn’t be loaded. Try refreshing the page.</p>}
        {body.status === 'ready' && (
          <div className='prose'>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ a: MarkdownLink }}>
              {body.text}
            </ReactMarkdown>
          </div>
        )}
      </article>
    </div>
  )
}

export default Memo
