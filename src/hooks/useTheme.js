import { useCallback, useEffect, useState } from 'react'

// Must match the inline script in public/index.html, which applies the theme before first paint.
export const THEME_KEY = 'theme'
const THEME_COLORS = { dark: '#0F172A', light: '#F2F3F5' }
const LIGHT_QUERY = '(prefers-color-scheme: light)'

const readStored = () => {
  try {
    const value = window.localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const systemTheme = () =>
  window.matchMedia && window.matchMedia(LIGHT_QUERY).matches ? 'light' : 'dark'

export const getInitialTheme = () => {
  const applied = document.documentElement.getAttribute('data-theme')
  if (applied === 'light' || applied === 'dark') return applied
  return readStored() || systemTheme()
}

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme])
}

// Light/dark theme. An explicit choice is saved; until then the OS preference is followed live.
const useTheme = () => {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!window.matchMedia) return undefined
    const query = window.matchMedia(LIGHT_QUERY)
    const onChange = () => {
      if (!readStored()) setTheme(query.matches ? 'light' : 'dark')
    }
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        window.localStorage.setItem(THEME_KEY, next)
      } catch {
        // Storage blocked (private mode): the choice lasts for this page view only
      }
      return next
    })
  }, [])

  return { theme, toggleTheme }
}

export default useTheme
