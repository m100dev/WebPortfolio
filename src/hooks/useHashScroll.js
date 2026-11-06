import { useEffect } from 'react'
import { useLocation } from 'react-router'

// The browser only jumps to a #hash if that element is already on the page. Going from
// /guides to /#about, it isn't: React renders Home after the URL changes, so the native
// jump finds nothing. That's why I scroll here, after the route change. Without a hash I
// go to the top, because otherwise the new page keeps the old page's scroll position.
// In-page #hash clicks don't change the pathname, so the browser still handles those.
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
    // I wait a frame plus 60 ms so the images above the target have taken their space.
    // Scroll any sooner and the layout shifts afterwards, leaving the section off target.
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
