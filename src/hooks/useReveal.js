import { useEffect } from 'react'

// Adds .is-visible to every .reveal element the first time it scrolls into view.
// The CSS only hides .reveal elements once <html> has .reveal-ready, so content
// is never stuck invisible if this hook doesn't run.
const useReveal = () => {
  useEffect(() => {
    const root = document.documentElement
    const elements = document.querySelectorAll('.reveal')

    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return undefined
    }

    root.classList.add('reveal-ready')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    )

    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}

export default useReveal
