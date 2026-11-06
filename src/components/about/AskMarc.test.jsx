import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import AskMarc, { prompts } from './AskMarc'

const setReducedMotion = (reduce) => {
  window.matchMedia = (query) => ({
    matches: query.includes('reduce') ? reduce : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {}
  })
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const renderChat = () => render(<MemoryRouter><AskMarc /></MemoryRouter>)

afterEach(() => {
  vi.useRealTimers()
})

test('a chip streams its answer in, then marks itself asked', () => {
  vi.useFakeTimers()
  setReducedMotion(false)
  renderChat()
  const [first] = prompts

  fireEvent.click(screen.getByRole('button', { name: first.question }))
  expect(screen.getByText(first.question, { selector: 'p' })).toBeInTheDocument()
  expect(screen.getByLabelText('Marc is typing')).toBeInTheDocument()

  act(() => { vi.advanceTimersByTime(20000) })

  expect(screen.getByText(first.answer)).toBeInTheDocument()
  // jsdom's accessible-name code drops the space inside <span> (asked)</span>; browsers keep it.
  const askedName = new RegExp(`^${escapeRegExp(first.question)} ?\\(asked\\)$`)
  expect(screen.getByRole('button', { name: askedName })).toBeDisabled()
  expect(screen.getByRole('link', { name: `${first.link.label} →` })).toBeInTheDocument()
})

test('reduced motion shows the whole answer immediately', () => {
  setReducedMotion(true)
  renderChat()
  const certs = prompts.find((p) => p.id === 'certs')

  fireEvent.click(screen.getByRole('button', { name: certs.question }))
  expect(screen.getByText(certs.answer)).toBeInTheDocument()
})

test('start over clears the transcript', () => {
  setReducedMotion(true)
  renderChat()
  fireEvent.click(screen.getByRole('button', { name: prompts[1].question }))
  fireEvent.click(screen.getByRole('button', { name: /start over/i }))
  expect(screen.queryByText(prompts[1].answer)).not.toBeInTheDocument()
  expect(screen.getByText('Pick a question below.')).toBeInTheDocument()
})
