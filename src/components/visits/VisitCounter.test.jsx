import { render, screen } from '@testing-library/react'
import VisitCounter from './VisitCounter'

test('renders nothing until the count is known', () => {
  const { container } = render(<VisitCounter count={null} />)
  expect(container).toBeEmptyDOMElement()
})

test('shows the live count with its source', () => {
  const { container } = render(<VisitCounter count={1234} className='extra' />)
  expect(container.querySelector('.visits.extra')).toBeInTheDocument()
  expect(screen.getByText(/visits$/)).toBeInTheDocument()
  expect(screen.getByText(/counted by AWS Lambda \+ DynamoDB/)).toBeInTheDocument()
})

test('later refreshes show the number plainly instead of counting up again', () => {
  const { rerender } = render(<VisitCounter count={1234} />)
  rerender(<VisitCounter count={1250} />)
  expect(screen.getByText('1,250 visits')).toBeInTheDocument()
})
