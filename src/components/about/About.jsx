import React from 'react'
import './about.css'
import ME from '../../assets/me-about-nature.jpg'
import { TbMilitaryAward, TbServer2, TbCertificate } from 'react-icons/tb'

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
              <small>5+ Years</small>
            </article>
            <article className="about__card">
              <TbServer2 className='about__card-icon'/>
              <h5>Environments</h5>
              <small>5+ Managed</small>
            </article>
            <article className="about__card">
              <TbCertificate className='about__card-icon'/>
              <h5>Certifications</h5>
              <small>6 Active</small>
            </article>
          </div>

          <p>
            Systems administrator and infrastructure engineer with 5+ years supporting enterprise environments across municipal government, healthcare, and cloud operations. Currently serving as Tier 2 IT Support at a South Florida municipality, managing Active Directory, Entra ID, endpoint security, network infrastructure, and IP telephony systems. CCNA and AWS Solutions Architect certified with hands-on experience in cloud infrastructure, scripting, automation, and change management. Independently building and maintaining a production-grade application project demonstrating database administration, CI/CD pipeline management, and structured deployment workflows.
          </p>

          <a href="#contact" className="btn btn-primary">Get In Touch</a>
        </div>
      </div>
    </section>
  )
}

export default About
