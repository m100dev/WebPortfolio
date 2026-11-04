import React, { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import { findGuide } from '../content/guides'
import GuideLayout from '../components/guides/GuideLayout'
import NotFound from './NotFound'
import useDocumentTitle from '../hooks/useDocumentTitle'

const Guide = () => {
  const { slug } = useParams()
  const guide = findGuide(slug)
  useDocumentTitle(guide?.Component ? guide.title : 'Page not found')

  if (!guide?.Component) return <NotFound/>

  const { Component } = guide

  return (
    <Suspense fallback={<p className='guide__loading mono'>Loading guide…</p>}>
      <GuideLayout guide={guide}>
        <Component/>
      </GuideLayout>
    </Suspense>
  )
}

export default Guide
