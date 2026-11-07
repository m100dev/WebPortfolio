import './about.css'
import ME from '../../assets/Marc Bastien About Casual.webp'
import AskMarc from './AskMarc'

// What Marc is working on right now (replaces the old stat cards, which repeated the hero metrics)
const now = [
  { label: 'Building', value: 'MyAutoTab, a multi-tenant SaaS' },
  { label: 'Studying', value: 'Applied Agentic AI (Virginia Tech)' },
  { label: 'Earning', value: 'CompTIA Security+' },
  { label: 'Experimenting', value: 'Local LLMs on a Mac mini M5 Pro' }
]

const certs = [
  { name: 'CCNA (2026)' },
  { name: 'Azure Fundamentals (2024)' },
  { name: 'AWS Solutions Architect – Associate (2023–2026)', status: 'renewal planned' },
  { name: 'AWS Cloud Practitioner (2022–2026)', status: 'expired' },
  { name: 'CIW JavaScript Specialist (2021)' },
  { name: 'CompTIA Security+', status: 'in progress' },
  { name: 'Virginia Tech Applied Agentic AI', status: 'in progress' }
]

const About = () => {
  return (
    <section id='about'>
      <h5 className='reveal'>04 — About</h5>
      <h2 className='reveal'>A bit about me</h2>
      <div className="container about__container">
        <div className="about__me">
          <div className="about__me-image">
            <img src={ME} loading="lazy" alt="Marc Bastien in a casual jacket, smiling" />
          </div>
        </div>

        <div className="about__content">
          <div className="about__now">
            <p className="about__now-title mono">Currently</p>
            <dl>
              {now.map(({ label, value }) => (
                <div key={label} className="about__now-row">
                  <dt className="mono">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <AskMarc />

          {/* Everything the chat says, readable (and crawlable) without clicking through it */}
          <details className="about__fullbio">
            <summary>Read full bio</summary>
            <div className="about__bio">
              <p>
                I’m a cloud, DevOps, and AI engineer in the DC/Maryland area, and I like building things that actually get used.
              </p>
              <p>
                Right now that’s MyAutoTab, a vehicle management app for owners of cars, boats, jet skis, and ATVs. I built it end to end with React, .NET, and PostgreSQL and set up CI/CD with GitHub Actions. I use a test-driven Claude Code workflow that took features from about a week to under a day. I share the build on YouTube, including <a href="https://www.youtube.com/watch?v=b7TRmFrNALg" target="_blank" rel="noreferrer">a walkthrough of how I debugged a race condition</a>.
              </p>
              <p>
                Before this, I spent six years keeping enterprise systems running for a city government, a healthcare company, and airline customers on AWS and Azure, including identity and device management for 3,000+ devices at the City of Miami Beach.
              </p>
              <p>
                I also run a sandboxed local AI agent on a Mac mini and publish hands-on lab guides, like my Hybrid Azure Virtual Desktop lab.
              </p>
              <p>
                CCNA and Azure Fundamentals certified, previously AWS Solutions Architect – Associate certified (renewal planned), and working toward Security+. U.S. citizen, eligible for a security clearance.
              </p>
            </div>
          </details>

          <ul className="tag-list about__certs">
            {certs.map(({ name, status }) => (
              <li key={name} className={status ? 'tag about__cert--pending' : 'tag'}>
                {name}{status && ` · ${status}`}
              </li>
            ))}
          </ul>

          <a href="#contact" className="btn btn-primary">Get In Touch</a>
        </div>
      </div>
    </section>
  )
}

export default About
