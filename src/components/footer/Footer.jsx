import React from 'react';
import './footer.css';
import {BsLinkedin} from 'react-icons/bs';
import {FaGithub} from 'react-icons/fa';

// Quiet one-row sign-off; navigation lives in the top bar
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id='footer'>
      <div className='footer__inner'>
        <small className='footer__copyright'>&copy; {year} Marc Bastien</small>

        <small className='footer__built mono'>Built with React · Hosted on AWS Amplify</small>

        <div className='footer__socials'>
          <a href="https://www.linkedin.com/in/marcbastien00/" target='_blank' rel="noreferrer" aria-label="LinkedIn"><BsLinkedin/></a>
          <a href="https://github.com/m100dev" target='_blank' rel="noreferrer" aria-label="GitHub"><FaGithub/></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
