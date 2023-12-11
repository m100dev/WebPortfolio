import React from 'react'
import CTA from './CTA'
import ME from '../../assets/marc-bastien-portrait.png'
import HeaderSocials from './HeaderSocials'
import './header.css'

// Header component which serves as the portfolio landing page
const Header = () => {
  return (
    <header id='home'>
      <div className="container header__container">
        <h5>Hello I'm</h5>
        <h1>Marc Bastien</h1>
        <h5 className="text-light">IT Professional</h5>

        <CTA/>
        <HeaderSocials/>

        <div className="me">
          <img src={ME} alt="" />
        </div> 

        <a href="#contact" className="scroll__down">Scroll Down</a>
      </div>
    </header>
  )
}

export default Header
