import React from 'react'
import './about.css'
import ME from '../../assets/me-about-nature.jpg'
import { TbMilitaryAward, TbUsersGroup, TbFolderCode } from 'react-icons/tb'

const About = () => {
  return (
    <section id='about'>
      <h5>Get To Know</h5>
      <h2>Learn More</h2>
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
            Welcome and thanks for taking the time to learn about me! I'm a dynamic, results-driven Cloud Admin with a passion for coding, information system technologies and processes. I enjoy gaming, adventure, making music and spending time with my loved ones. Currently, I'm seeking opportunities to further my career and drive innovation in the Software Development and Cloud DevOps space.
          </p>

          <a href="#contact" className="btn btn-primary">Hire Me!</a>
        </div>
      </div>
    </section>
  )
}

export default About
