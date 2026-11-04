import React from 'react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import './pages.css'

const Memos = () => {
  useDocumentTitle('Memos')

  return (
    <div className='page'>
      <section className='page-intro'>
        <h5>Memos</h5>
        <h2>Short notes</h2>
        <p className='page-intro__lede'>Nothing published yet.</p>
      </section>
    </div>
  )
}

export default Memos
