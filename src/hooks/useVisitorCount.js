import { useEffect, useState } from 'react'

// Endpoint from infra/visitor-counter (terraform output api_url). Baked in at build time;
// when it's unset (local dev, or before the stack is deployed) the counter stays hidden.
const API_URL = process.env.REACT_APP_VISITOR_API_URL
const SESSION_KEY = 'visit-counted'
const POLL_MS = 60000

const readFlag = () => {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

const setFlag = () => {
  try {
    window.sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    // Storage blocked: worst case this tab counts again on reload
  }
}

// Returns the site's visit count, or null until known / when the counter is disabled.
// Counts one visit per browser session (POST), then refreshes with GET every minute
// while the tab is visible, and right away when it becomes visible again.
const useVisitorCount = (url = API_URL) => {
  const [count, setCount] = useState(null)

  useEffect(() => {
    if (!url) return undefined
    let cancelled = false

    // No custom headers, so these stay "simple" CORS requests (no preflight)
    const request = (method) =>
      fetch(url, { method, cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((data) => {
          if (!cancelled && Number.isFinite(data?.visits)) setCount(data.visits)
          return true
        })
        .catch(() => false)

    if (readFlag()) {
      request('GET')
    } else {
      request('POST').then((ok) => { if (ok) setFlag() })
    }

    const refresh = () => {
      if (document.visibilityState === 'visible') request('GET')
    }
    const timer = window.setInterval(refresh, POLL_MS)
    document.addEventListener('visibilitychange', refresh)

    return () => {
      cancelled = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [url])

  return count
}

export default useVisitorCount
