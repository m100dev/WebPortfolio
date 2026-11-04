import React, { useEffect, useState } from 'react'
import { BsArrowDown } from 'react-icons/bs'
import './scroll-button.css'

const isAtPageBottom = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

// Sections land ~80px from the top (scroll-margin-top clears the fixed nav),
// so anything starting below this line counts as "next".
const NEXT_THRESHOLD_PX = 100

// First header/section whose top is below the threshold line
const findNextSection = () =>
  Array.from(document.querySelectorAll('header, section'))
    .find((el) => el.getBoundingClientRect().top > NEXT_THRESHOLD_PX)

const scrollBehavior = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

// Floating button: scrolls to the next section, or back to the top once at the end
const ScrollButton = () => {
  const [atEnd, setAtEnd] = useState(false)

  useEffect(() => {
    let frame = null
    const update = () => {
      frame = null
      setAtEnd(isAtPageBottom() || !findNextSection())
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
  }, [])

  const handleClick = () => {
    const next = findNextSection()
    if (atEnd || !next) {
      window.scrollTo({ top: 0, behavior: scrollBehavior() })
    } else {
      next.scrollIntoView({ behavior: scrollBehavior() })
    }
  }

  const label = atEnd ? 'Back to Top' : 'Scroll Down'

  return (
    <button type='button' className='scroll__button' onClick={handleClick} aria-label={label} title={label}>
      <BsArrowDown className={atEnd ? 'scroll__button-icon scroll__button-icon--up' : 'scroll__button-icon'} />
    </button>
  )
}

export default ScrollButton
