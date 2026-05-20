import React from 'react'
import './services.css'
import { BsPatchCheckFill } from 'react-icons/bs'

const Services = () => {
  return (
    <section id='services'>
      <h5>Things I Can Accomplish</h5>
      <h2>Services</h2>

      <div className="container services__container">
        <article className="service">
          <div className="service__head">
            <h3>System Administration</h3>
          </div>

          <ul className="service__list">
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Active Directory & Entra ID Management</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Endpoint Deployment & Intune MDM</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>IP Telephony (3CX / Amazon Chime)</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Microsoft 365 / SharePoint / OneDrive</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>User Account & Access Control</p>
            </li>
          </ul>
        </article>
        {/* End of System Administration */}
        <article className="service">
          <div className="service__head">
            <h3>Cloud & Infrastructure</h3>
          </div>

          <ul className="service__list">
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>AWS VPC, EC2, S3, IAM Architecture</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Azure VMs, VNet, Entra ID</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Network Infrastructure & Troubleshooting</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Server Maintenance & Patch Management</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Monitoring, Alerting & Incident Response</p>
            </li>
          </ul>
        </article>
        {/* End of Cloud & Infrastructure */}
        <article className="service">
          <div className="service__head">
            <h3>Automation & Development</h3>
          </div>

          <ul className="service__list">
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Bash / PowerShell / JavaScript Scripting</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>CI/CD Pipeline Design & Management</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Database Administration (PostgreSQL)</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>REST API Development (.NET / Node.js)</p>
            </li>
            <li>
              <BsPatchCheckFill className='service__list-icon'/>
              <p>Technical Documentation & Change Control</p>
            </li>
          </ul>
        </article>
        {/* End of Automation & Development */}
      </div>
    </section>
  )
}

export default Services
