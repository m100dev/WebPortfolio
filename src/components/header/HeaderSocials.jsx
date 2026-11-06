import {BsLinkedin} from 'react-icons/bs';
import {FaGithub} from 'react-icons/fa';

// Utilizing React Icons for the different social media links. Styled using the header__socials class
const HeaderSocials = () => {
  return (
    <div className='header__socials'>
        <a href="https://www.linkedin.com/in/marcbastien00/" target='_blank' rel="noreferrer" aria-label="LinkedIn"><BsLinkedin/></a>
        <a href="https://github.com/m100dev" target='_blank' rel="noreferrer" aria-label="GitHub"><FaGithub/></a>
    </div>
  )
}

export default HeaderSocials;
