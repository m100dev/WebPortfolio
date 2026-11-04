import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Runs on route changes only (not on in-page #hash clicks, which the browser handles).
// With a hash, e.g. /#about from /guides, it scrolls to that section once the page has
// laid out; otherwise a new page starts at the top instead of inheriting the old scroll.
const useHashScroll = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    let frame = null
    let timer = null

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      return undefined
    }

    const id = decodeURIComponent(hash.slice(1))
    // Wait a frame plus a beat so images above the target have taken their space
    frame = window.requestAnimationFrame(() => {
      timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      }, 60)
    })

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame)
      if (timer !== null) window.clearTimeout(timer)
    }
    // Only re-run when the page changes; same-page hash links scroll natively.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
}

export default useHashScroll
