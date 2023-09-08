import React from 'react'
import './nav.css'
import { RiHome2Line, RiUser6Line, RiBook2Line } from 'react-icons/ri';
import { MdOutlineHomeRepairService } from 'react-icons/md';
import { LuMessagesSquare } from 'react-icons/lu';
import { useState } from 'react';

// This component allows the user to navigate between the different sections of the website
const Nav = () => {
  const [activeNav, setActiveNav] = useState('#home'); // useState used to dynamically handle the the class which highlights the selected menu item

  return (
    <nav>
      <a href="#home" onClick={() => { setActiveNav('#home')}} className={ activeNav === '#home' ? 'active' : '' }><RiHome2Line/></a>
      <a href="#about" onClick={() => { setActiveNav('#about')}} className={ activeNav === '#about' ? 'active' : '' }><RiUser6Line/></a>
      <a href="#experience" onClick={() => { setActiveNav('#experience')}} className={ activeNav === '#experience' ? 'active' : '' }><RiBook2Line/></a>
      <a href="#services" onClick={() => { setActiveNav('#services')}} className={ activeNav === '#services'? 'active' : '' }><MdOutlineHomeRepairService/></a>
      <a href="#contact" onClick={() => { setActiveNav('#contact')}} className={ activeNav === '#contact'? 'active' : '' }><LuMessagesSquare/></a>
    </nav>
  )
}

export default Nav