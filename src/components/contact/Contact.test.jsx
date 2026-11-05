import { fireEvent, render, screen } from '@testing-library/react'
import emailjs from '@emailjs/browser'
import Contact from './Contact'

jest.mock('@emailjs/browser', () => ({
  __esModule: true,
  default: { sendForm: jest.fn() }
}))

const fillAndSubmit = ({ honeypot = '' } = {}) => {
  const { container } = render(<Contact />)
  fireEvent.change(screen.getByPlaceholderText('Your Full Name'), { target: { value: 'Ada Lovelace' } })
  fireEvent.change(screen.getByPlaceholderText('Your Email'), { target: { value: 'ada@example.com' } })
  fireEvent.change(screen.getByPlaceholderText('Your Message'), { target: { value: 'Hello' } })
  if (honeypot) {
    fireEvent.change(container.querySelector('input[name="website"]'), { target: { value: honeypot } })
  }
  fireEvent.submit(container.querySelector('form'))
}

beforeEach(() => {
  emailjs.sendForm.mockReset()
  emailjs.sendForm.mockResolvedValue({ status: 200 })
})

test('a filled honeypot shows success but never calls EmailJS', async () => {
  fillAndSubmit({ honeypot: 'https://spam.example' })

  expect(await screen.findByRole('dialog', { name: 'Message Sent' })).toBeInTheDocument()
  expect(emailjs.sendForm).not.toHaveBeenCalled()
})

test('an empty honeypot sends the message exactly once', async () => {
  fillAndSubmit()

  expect(await screen.findByRole('dialog', { name: 'Message Sent' })).toBeInTheDocument()
  expect(emailjs.sendForm).toHaveBeenCalledTimes(1)
})

test('the honeypot is hidden from assistive tech and the tab order', () => {
  const { container } = render(<Contact />)
  const field = container.querySelector('input[name="website"]')

  expect(field).toHaveAttribute('tabindex', '-1')
  expect(field).toHaveAttribute('autocomplete', 'off')
  expect(field.closest('[aria-hidden="true"]')).not.toBeNull()
  expect(screen.queryByRole('textbox', { name: 'Leave this field empty' })).toBeNull()
})
