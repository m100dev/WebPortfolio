import { createElement } from 'react'
import { act, renderHook } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router'
import useHashScroll from './useHashScroll'

let scrollIntoView

const renderAt = (path) =>
  renderHook(() => {
    useHashScroll()
    return useNavigate()
  }, { wrapper: ({ children }) => createElement(MemoryRouter, { initialEntries: [path] }, children) })

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 16))
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => clearTimeout(id))
  scrollIntoView = vi.fn()
  Element.prototype.scrollIntoView = scrollIntoView
  const section = document.createElement('section')
  section.id = 'about'
  document.body.replaceChildren(section)
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  delete Element.prototype.scrollIntoView
  document.body.replaceChildren()
})

test('a new page without a hash starts at the top', () => {
  renderAt('/guides')
  expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  expect(scrollIntoView).not.toHaveBeenCalled()
})

test('with a hash, scrolls to the section only after a frame plus 60 ms', () => {
  renderAt('/#about')
  expect(window.scrollTo).not.toHaveBeenCalled()

  act(() => vi.advanceTimersByTime(16 + 59))
  expect(scrollIntoView).not.toHaveBeenCalled()

  act(() => vi.advanceTimersByTime(1))
  expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' })
})

test('runs again when the route changes', () => {
  const { result } = renderAt('/guides')
  window.scrollTo.mockClear()

  act(() => result.current('/#about'))
  act(() => vi.advanceTimersByTime(100))
  expect(scrollIntoView).toHaveBeenCalledTimes(1)
})

test('leaves in-page hash changes to the browser', () => {
  const { result } = renderAt('/')
  window.scrollTo.mockClear()

  act(() => result.current('/#about'))
  act(() => vi.advanceTimersByTime(100))
  expect(window.scrollTo).not.toHaveBeenCalled()
  expect(scrollIntoView).not.toHaveBeenCalled()
})
