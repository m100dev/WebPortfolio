import React from 'react';
import {BsLinkedin} from 'react-icons/bs';
import {FaGithub} from 'react-icons/fa';

// Utilizing React Icons for the different social media links. Styled using the header__socials class
const HeaderSocials = () => {
  return (
    <div className='header__socials'>
        <a href="https://www.linkedin.com/in/mbastien001/" target='_blank' rel="noreferrer"><BsLinkedin/></a>
        <a href="https://github.com/m100dev" target='_blank' rel="noreferrer"><FaGithub/></a>
    </div>
  )
}

export default HeaderSocials;
