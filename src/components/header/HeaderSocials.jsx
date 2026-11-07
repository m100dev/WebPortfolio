import {BsLinkedin} from 'react-icons/bs';
import {FaGithub} from 'react-icons/fa';
import VisitCounter from '../visits/VisitCounter';

// Utilizing React Icons for the different social media links. Styled using the header__socials class.
// The live visit count sits on this row so it's seen on landing, not only in the footer.
const HeaderSocials = ({ visits }) => {
  return (
    <div className='header__socials'>
        <a href="https://www.linkedin.com/in/marcbastien00/" target='_blank' rel="noreferrer" aria-label="LinkedIn"><BsLinkedin/></a>
        <a href="https://github.com/m100dev" target='_blank' rel="noreferrer" aria-label="GitHub"><FaGithub/></a>
        <VisitCounter count={visits} className='header__visits' />
    </div>
  )
}

export default HeaderSocials;
