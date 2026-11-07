import { Suspense, lazy } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router'
import Nav from './components/nav/Nav'
import Footer from './components/footer/Footer'
import Home from './pages/Home'
import Guides from './pages/Guides'
import Guide from './pages/Guide'
import Memos from './pages/Memos'
import NotFound from './pages/NotFound'
import useReveal from './hooks/useReveal'
import useHashScroll from './hooks/useHashScroll'
import useVisitorCount from './hooks/useVisitorCount'

// react-markdown is ~60 kB; keep it out of the home bundle
const Memo = lazy(() => import('./pages/Memo'))

// Shared chrome for every route: top nav, the page, and the footer.
const Layout = () => {
  const { pathname } = useLocation()
  useHashScroll()
  // Re-scan for .reveal elements whenever the page changes
  useReveal(pathname)
  // One counter for the whole site: the hero (via outlet context) and the footer share it,
  // so a first visit sends one POST and polling isn't doubled
  const visits = useVisitorCount()

  return (
    <>
      <Nav/>
      <main id='main'>
        <Outlet context={{ visits }}/>
      </main>
      <Footer visits={visits}/>
    </>
  )
}

const App = () => (
  <Routes>
    <Route element={<Layout/>}>
      <Route index element={<Home/>}/>
      <Route path='guides' element={<Guides/>}/>
      <Route path='guides/:slug' element={<Guide/>}/>
      <Route path='memos' element={<Memos/>}/>
      <Route
        path='memos/:slug'
        element={<Suspense fallback={<div className='page'/>}><Memo/></Suspense>}
      />
      <Route path='*' element={<NotFound/>}/>
    </Route>
  </Routes>
)

export default App;
