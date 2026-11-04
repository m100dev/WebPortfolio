import React, { useRef } from 'react';
import './footer.css';
import {BsLinkedin} from 'react-icons/bs';
import {FaGithub} from 'react-icons/fa';
import CountUp from '../header/CountUp';
import useVisitorCount from '../../hooks/useVisitorCount';

// Quiet live counter from infra/visitor-counter. The first number counts up once;
// later refreshes show plainly instead of re-animating from zero every minute.
const VisitCounter = () => {
  const count = useVisitorCount();
  const first = useRef(null);
  if (count === null) return null;
  if (first.current === null) first.current = count;

  return (
    <small className='footer__visits mono'>
      <span className='footer__visits-dot' aria-hidden='true' />
      {count === first.current ? <CountUp end={count} /> : count.toLocaleString('en-US')} visits
      <span className='footer__visits-via'> · counted by AWS Lambda + DynamoDB</span>
    </small>
  );
};

// Quiet one-row sign-off; navigation lives in the top bar
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id='footer'>
      <div className='footer__inner'>
        <small className='footer__copyright'>&copy; {year} Marc Bastien</small>

        <div className='footer__meta'>
          <small className='footer__built mono'>Built with React · Hosted on AWS Amplify</small>
          <VisitCounter />
        </div>

        <div className='footer__socials'>
          <a href="https://www.linkedin.com/in/marcbastien00/" target='_blank' rel="noreferrer" aria-label="LinkedIn"><BsLinkedin/></a>
          <a href="https://github.com/m100dev" target='_blank' rel="noreferrer" aria-label="GitHub"><FaGithub/></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
