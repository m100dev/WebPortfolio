import React from 'react'
import './about.css'
import ME from '../../assets/me-about-nature.jpg'
import { TbMilitaryAward, TbUsersGroup, TbFolderCode } from 'react-icons/tb'

const About = () => {
  return (
    <section id='about'>
      <h5>Learn More</h5>
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
              <small>4+ Years</small>
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
            Welcome and thanks for taking the time to learn about me! I'm a dedicated, results-driven leader with a passion for improving existing processes and solving problems. I enjoy unconvering the needs of customers, providing the best solutions, and also work hard to maintain a high level of technical excellence. I aim to become the best technology professional that I can be, futhering my knowledge in customer service, software development, computer networking & engineering, and cloud technologies.
          </p>

          <a href="#contact" className="btn btn-primary">Hire Me!</a>
        </div>
      </div>
    </section>
  )
}

export default About
