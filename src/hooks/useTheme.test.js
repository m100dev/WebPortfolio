import { act, renderHook } from '@testing-library/react'
import useTheme, { THEME_KEY } from './useTheme'

const setSystemLight = (matches) => {
  window.matchMedia = (query) => ({
    matches: query.includes('light') ? matches : !matches,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {}
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  setSystemLight(false)
})

test('defaults to dark when nothing is stored and the OS prefers dark', () => {
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('dark')
  expect(document.documentElement.dataset.theme).toBe('dark')
})

test('follows an OS light preference when nothing is stored', () => {
  setSystemLight(true)
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
})

test('uses the theme the inline script already applied', () => {
  document.documentElement.setAttribute('data-theme', 'light')
  const { result } = renderHook(() => useTheme())
  expect(result.current.theme).toBe('light')
})

test('toggle switches the theme, applies it, and saves the choice', () => {
  const { result } = renderHook(() => useTheme())
  act(() => result.current.toggleTheme())
  expect(result.current.theme).toBe('light')
  expect(document.documentElement.dataset.theme).toBe('light')
  expect(localStorage.getItem(THEME_KEY)).toBe('light')

  act(() => result.current.toggleTheme())
  expect(result.current.theme).toBe('dark')
  expect(localStorage.getItem(THEME_KEY)).toBe('dark')
})
