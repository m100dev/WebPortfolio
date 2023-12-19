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
            <h3>Software Development</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Application & Web Development</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Unit Testing</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Debugging</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Wordpress, Shopify</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Search Engine Optimization</p>
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
              <p>Automate with AWS CDK</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Develop REST APIs</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Serverless Solutions</p>
            </li>
          </ul>
        </article>
        {/* End of AWS Cloud */}
        <article className="service">
          <div className="service__head">
            <h3>Help Desk</h3>
          </div>

          <ul className="service__list">
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Remote Monitoring & Management</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Linux, Windnows & Mac OS</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Information & Network Security</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>Network, App & Hardware Troubleshooting</p>
            </li>
            <li>
              <BiCheckSquare className='service__list-icon'/>
              <p>End User Support & Training</p>
            </li>
          </ul>
        </article>
        {/* End of Content Creation */}
      </div>
    </section>
  )
}

export default Services
