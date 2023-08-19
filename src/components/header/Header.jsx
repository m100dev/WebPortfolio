import React from 'react'
import CTA from './CTA'
import ME from '../../assets/me.jpg'
import './header.css'

const Header = () => {
  return (
    <header>
      <div className="container header__container">
        <h5>Hello I'm</h5>
        <h1>Marc Bastien</h1>
        <h5 className="text-light">Fullstack Cloud Developer</h5>

        <CTA/>

        <div className="me">
          <img src={ME} alt="" />
        </div>

        <a href="#contact" className="scroll__down">Scroll Down</a>
      </div>
    </header>
  )
}

export default Header