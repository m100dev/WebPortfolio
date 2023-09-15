import React from 'react'
import './services.css'
import { BiCheckSquare } from 'react-icons/bi'

const Services = () => {
  return (
    <section id='services'>
      <h5>Things I Can Accomplish</h5>
      <h2>Services</h2>

      <div className="container services__container">
        <article className="service">
          <div className="service__head">
            <h3>Web Development</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Mobile First Web Development</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Design in Figma</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Search Engine Optimization</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Custom Features & Components</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Debugging</p>
            </li>
          </ul>
        </article>
        {/* End of Web Development */}
        <article className="service">
          <div className="service__head">
            <h3>AWS Cloud</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Deploy services on Amazon EC2</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Troubleshooting Errors</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Automate with AWS SDK</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>CloudWatch Monitoring</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Optimize Savings</p>
            </li>
          </ul>
        </article>
        {/* End of AWS Cloud */}
        <article className="service">
          <div className="service__head">
            <h3>Audio Engineering</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Custom Audio Assets</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Mix & Balance Tracks</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Add Audio to Video</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Audio Recording</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Video Game Composition</p>
            </li>
          </ul>
        </article>
        {/* End of Content Creation */}
      </div>
    </section>
  )
}

export default Services
