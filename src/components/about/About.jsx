import React from 'react'
import './about.css'
import ME from '../../assets/me-about-nature.jpg'
import { TbMilitaryAward, TbUsersGroup, TbFolderCode } from 'react-icons/tb'

const About = () => {
  return (
    <section id='about'>
      <h5>Get To Know</h5>
      <h2>About Me</h2>
      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} alt="Marc Bastien standing in a park surrounded by nature" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__cards">
            <article className="about__card">
              <TbMilitaryAward className='about__card-icon'/>
              <h5>Experience</h5>
              <small>3+ Years Working</small>
            </article>
            <article className="about__card">
              <TbUsersGroup className='about__card-icon'/>
              <h5>Clients</h5>
              <small>5+ Worldwide</small>
            </article>
            <article className="about__card">
              <TbFolderCode className='about__card-icon'/>
              <h5>Projects</h5>
              <small>10+ Completed</small>
            </article>
          </div>

          <p>
            Dynamic and results-driven Front-End Web Developer and Cloud Admin with hands-on experience in Web technologies, AWS, and software development. Proficient in logical analysis, and problem-solving. Seeking opportunities to contribute technical expertise and drive innovation in a software development role, while leveraging cloud services.
          </p>

          <a href="#contact" className="btn btn-primary">Let's Talk</a>
        </div>
      </div>
    </section>
  )
}

export default About