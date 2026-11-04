import React from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Nav from './components/nav/Nav'
import Footer from './components/footer/Footer'
import Home from './pages/Home'
import Guides from './pages/Guides'
import Guide from './pages/Guide'
import Memos from './pages/Memos'
import Memo from './pages/Memo'
import NotFound from './pages/NotFound'
import useReveal from './hooks/useReveal'
import useHashScroll from './hooks/useHashScroll'

// Shared chrome for every route: top nav, the page, and the footer.
const Layout = () => {
  const { pathname } = useLocation()
  useHashScroll()
  // Re-scan for .reveal elements whenever the page changes
  useReveal(pathname)

  return (
    <>
      <Nav/>
      <main id='main'>
        <Outlet/>
      </main>
      <Footer/>
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
      <Route path='memos/:slug' element={<Memo/>}/>
      <Route path='*' element={<NotFound/>}/>
    </Route>
  </Routes>
)

export default App;
