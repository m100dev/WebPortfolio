import { act, renderHook } from '@testing-library/react'
import useVisitorCount from './useVisitorCount'

const URL = 'https://api.example.test/visits'
let visible = true

const okResponse = (visits) => Promise.resolve({ ok: true, json: () => Promise.resolve({ visits }) })
const methods = () => fetch.mock.calls.map(([, init]) => init.method)

// Let the fetch promise chain settle (fetch → json → setCount → setFlag)
const flush = () => act(() => vi.advanceTimersByTimeAsync(0))

beforeEach(() => {
  vi.useFakeTimers()
  sessionStorage.clear()
  visible = true
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => (visible ? 'visible' : 'hidden') })
  globalThis.fetch = vi.fn(() => okResponse(42))
})

afterEach(() => {
  vi.useRealTimers()
  delete globalThis.fetch
})

test('stays hidden and calls nothing without an API URL', async () => {
  const { result } = renderHook(() => useVisitorCount(undefined))
  await flush()
  expect(result.current).toBeNull()
  expect(fetch).not.toHaveBeenCalled()
})

test('counts the first visit in a session with a POST and remembers it', async () => {
  const { result } = renderHook(() => useVisitorCount(URL))
  await flush()
  expect(methods()).toEqual(['POST'])
  expect(result.current).toBe(42)
  expect(sessionStorage.getItem('visit-counted')).toBe('1')
})

test('only reads the count when this session was already counted (a reload)', async () => {
  sessionStorage.setItem('visit-counted', '1')
  renderHook(() => useVisitorCount(URL))
  await flush()
  expect(methods()).toEqual(['GET'])
})

test('a failed POST leaves the session uncounted so the next load tries again', async () => {
  fetch.mockImplementationOnce(() => Promise.resolve({ ok: false, status: 503 }))
  const { result } = renderHook(() => useVisitorCount(URL))
  await flush()
  expect(result.current).toBeNull()
  expect(sessionStorage.getItem('visit-counted')).toBeNull()
})

test('polls with GET every minute while visible, and skips the poll while hidden', async () => {
  renderHook(() => useVisitorCount(URL))
  await flush()

  await act(() => vi.advanceTimersByTimeAsync(60000))
  expect(methods()).toEqual(['POST', 'GET'])

  visible = false
  await act(() => vi.advanceTimersByTimeAsync(60000))
  expect(methods()).toEqual(['POST', 'GET'])
})

test('refreshes right away when the tab becomes visible again', async () => {
  renderHook(() => useVisitorCount(URL))
  await flush()

  visible = true
  fetch.mockImplementationOnce(() => okResponse(43))
  await act(async () => {
    document.dispatchEvent(new Event('visibilitychange'))
    await vi.advanceTimersByTimeAsync(0)
  })
  expect(methods()).toEqual(['POST', 'GET'])
})

test('stops polling after unmount', async () => {
  const { unmount } = renderHook(() => useVisitorCount(URL))
  await flush()
  unmount()
  await act(() => vi.advanceTimersByTimeAsync(120000))
  expect(methods()).toEqual(['POST'])
})
