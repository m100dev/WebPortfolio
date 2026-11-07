import { useRef } from 'react'
import CountUp from '../header/CountUp'
import './visits.css'

// Live counter from infra/visitor-counter, shown in the hero and the footer.
// The count comes in as a prop because useVisitorCount runs once in Layout: two hook
// calls would send two POSTs on a first visit and double the polling.
// The first number counts up once; later refreshes show plainly instead of re-animating.
const VisitCounter = ({ count, className = '' }) => {
  const first = useRef(null)
  if (count == null) return null
  if (first.current === null) first.current = count

  return (
    <small className={`visits mono ${className}`.trim()}>
      <span className='visits__dot' aria-hidden='true' />
      <span>{count === first.current ? <CountUp end={count} /> : count.toLocaleString('en-US')} visits</span>
      <span className='visits__via'> · counted by AWS Lambda + DynamoDB</span>
    </small>
  )
}

export default VisitCounter
