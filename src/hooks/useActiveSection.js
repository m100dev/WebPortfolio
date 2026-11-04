import { useEffect, useState } from 'react'

// Section ids that have a nav icon. Must match the anchors in components/nav/Nav.jsx.
export const SECTION_IDS = ['home', 'portfolio', 'ai-engineering', 'experience', 'about', 'contact']

const isAtPageBottom = () =>
  window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2

// Returns the id of the section currently crossing the middle of the viewport.
// Only tracks while `enabled` (the home page); returns null elsewhere.
const useActiveSection = (enabled = true) => {
  const [active, setActive] = useState('home')

  useEffect(() => {
    if (!enabled) return undefined
    setActive('home')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAtPageBottom()) setActive(entry.target.id)
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    // Contact may be too short to ever cross the middle of the screen.
    const onScroll = () => {
      if (isAtPageBottom()) setActive('contact')
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled])

  return enabled ? active : null
}

export default useActiveSection
