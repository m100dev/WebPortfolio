import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 1400

// Counts from 0 to `end` once, the first time it scrolls into view.
// Shows the final number immediately under reduced motion or without IntersectionObserver.
const CountUp = ({ end }) => {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !('IntersectionObserver' in window)) {
      setValue(end)
      return undefined
    }

    let frame = null
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const progress = Math.min((now - start) / DURATION_MS, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(end * eased))
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })

    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [end])

  return <span ref={ref}>{value.toLocaleString('en-US')}</span>
}

export default CountUp
