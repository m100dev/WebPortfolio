import { act, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'

const URL = 'https://api.example.test/visits'

beforeEach(() => {
  sessionStorage.clear()
  vi.stubEnv('REACT_APP_VISITOR_API_URL', URL)
  // The hook reads the URL at import time, so load App fresh with the stub in place
  vi.resetModules()
  globalThis.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ visits: 1234 }) }))
})

afterEach(() => {
  vi.unstubAllEnvs()
  delete globalThis.fetch
})

test('one visitor count feeds both the hero and the footer, with a single POST', async () => {
  const { default: App } = await import('./App')
  let view
  await act(async () => {
    view = render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>)
  })

  const { container } = view
  expect(container.querySelector('header .visits')).toBeInTheDocument()
  expect(container.querySelector('footer .visits')).toBeInTheDocument()
  expect(fetch.mock.calls.map(([, init]) => init.method)).toEqual(['POST'])
})
