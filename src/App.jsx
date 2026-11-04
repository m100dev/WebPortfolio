import React from 'react'
import Header from './components/header/Header'
import Nav from './components/nav/Nav'
import ScrollButton from './components/header/ScrollButton'
import About from './components/about/About'
import Experience from './components/experience/Experience'
import AiEngineering from './components/ai-engineering/AiEngineering'
import Portfolio from './components/portfolio/Portfolio'
import Testimonials from './components/testimonials/Testimonials'
import Contact from './components/contact/Contact'
import Footer from './components/footer/Footer'
import useReveal from './hooks/useReveal'

// Section order puts proof first: Work → How I Build → Experience → About → Endorsements → Contact
const App = () => {
  useReveal()

  return (
    <>
      <Header/>
      <Nav/>
      <ScrollButton/>
      <Portfolio/>
      <AiEngineering />
      <Experience />
      <About/>
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}

export default App;


