import React from 'react'
import { useParams } from 'react-router-dom'
import { findGuide } from '../content/guides'
import NotFound from './NotFound'
import useDocumentTitle from '../hooks/useDocumentTitle'
import './pages.css'

const Guide = () => {
  const { slug } = useParams()
  const guide = findGuide(slug)
  useDocumentTitle(guide?.title)

  if (!guide) return <NotFound/>

  return (
    <div className='page'>
      <section className='page-intro'>
        <h5>Guide</h5>
        <h2>{guide.title}</h2>
        <p className='page-intro__lede'>{guide.summary}</p>
      </section>
    </div>
  )
}

export default Guide
