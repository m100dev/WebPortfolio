import { act, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AskMarc, { prompts } from './AskMarc'

const setReducedMotion = (reduce) => {
  window.matchMedia = (query) => ({
    matches: query.includes('reduce') ? reduce : false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {}
  })
}

const renderChat = () => render(<MemoryRouter><AskMarc /></MemoryRouter>)

afterEach(() => {
  jest.useRealTimers()
})

test('a chip streams its answer in, then marks itself asked', () => {
  jest.useFakeTimers()
  setReducedMotion(false)
  renderChat()
  const [first] = prompts

  fireEvent.click(screen.getByRole('button', { name: first.question }))
  expect(screen.getByText(first.question, { selector: 'p' })).toBeInTheDocument()
  expect(screen.getByLabelText('Marc is typing')).toBeInTheDocument()

  act(() => { jest.advanceTimersByTime(20000) })

  expect(screen.getByText(first.answer)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: `${first.question} (asked)` })).toBeDisabled()
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
