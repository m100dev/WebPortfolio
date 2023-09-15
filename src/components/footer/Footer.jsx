import React from 'react';
import './footer.css';
import {BsLinkedin} from 'react-icons/bs';
import {FaGithub} from 'react-icons/fa';

const Footer = () => {
  const date = new Date();
  
  return (
    <footer id='footer'>
      <a href="#home" className="footer__logo">Marc Bastien</a>

      <ul className='footer__permalinks'>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#portfolio" >Portfolio</a></li>
        <li><a href="#testimonials" >Testimonials</a></li>
        <li><a href="#contact" >Contact</a></li>
      </ul>

      <div className='footer__socials'>
        <a href="https://www.linkedin.com/in/mbastien001/" target='_blank' rel="noreferrer"><BsLinkedin/></a>
        <a href="https://github.com/m100dev" target='_blank' rel="noreferrer"><FaGithub/></a>
      </div>

      <div className="footer__copyright">
        <small>{`&copy;${date.getFullYear()} Marc Bastien. All rights reserved.`}</small>
      </div>
    
    </footer>
  )
}

export default Footer
