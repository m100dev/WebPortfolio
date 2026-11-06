import { Link } from 'react-router'
import useDocumentTitle from '../hooks/useDocumentTitle'
import './pages.css'

const NotFound = () => {
  useDocumentTitle('Page not found')

  return (
    <div className='page'>
      <section className='page-intro'>
        <h5>404 — Not found</h5>
        <h2>This page doesn’t exist.</h2>
        <div className='page-intro__body'>
          <p className='text-light'>The link may be old, or the page may have moved.</p>
          <div className='page-intro__actions'>
            <Link to='/' className='btn btn-primary'>Back home</Link>
            <Link to='/guides' className='btn'>Browse guides</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NotFound
