import './experience.css'

const data = [
  {
    id: 1,
    company: 'MyAutoTab',
    title: 'Founder & Software Engineer',
    note: 'MyAutoTab is a product of Eximula LLC; early development began as a side project in 2026.',
    location: 'Remote',
    dates: "Sep '26 – Present",
    highlights: [
      'Designed and built a multi-tenant vehicle management SaaS end to end: React, .NET/EF Core, PostgreSQL with Row-Level Security, GitHub Actions, Render, Cloudflare.',
      'Built a semi-autonomous, test-driven coding agent workflow with Claude Code that cut feature delivery from about a week to under a day.',
      'Added security and database audits to the CI/CD pipeline to catch issues in agent-written code before release.'
    ],
    tags: ['Agentic AI Development', 'Claude Code', 'Full-Stack Development', 'React', '.NET', 'PostgreSQL']
  },
  {
    id: 2,
    company: 'City of Miami Beach',
    title: 'IT Support Specialist II',
    location: 'Miami, FL',
    dates: "Dec '24 – Sep '26",
    highlights: [
      'Administered identity and device management across Active Directory, Entra ID, and Intune with Autopilot for 3,000+ devices in a public-sector security environment.',
      'Proposed and prototyped a group-based license management model in Entra ID after budget cuts ruled out third-party tools; the project manager endorsed it as the preferred approach.',
      'Built a proof-of-concept ARM template, deployed with PowerShell, to provision VMs, network security groups, and storage in the city’s Azure environment under change control.'
    ],
    tags: ['Entra ID', 'Intune', 'Autopilot', 'Azure', 'PowerShell', 'Zscaler', 'VoIP']
  },
  {
    id: 3,
    company: 'Vitas Healthcare',
    title: 'Business Systems Analyst',
    location: 'Pembroke Pines, FL',
    dates: "Mar '24 – Sep '24",
    highlights: [
      'Reconciled a $1.5M outstanding vendor bill during an ITAM restructuring, working with the vendor, accounting, and management.',
      'Wrote a 9-page proposal that led ServiceNow developers to automate manual ITAM workflows in Flow Designer; administered 1,000+ mobile devices in Workspace ONE.'
    ],
    tags: ['ServiceNow', 'ITAM', 'Workspace ONE', 'Excel VBA']
  },
  {
    id: 4,
    company: 'Trax Corp USA',
    title: 'Cloud Systems Operations Engineer',
    location: 'Coral Gables, FL',
    dates: "Jan '23 – Sep '23",
    highlights: [
      'Configured and maintained AWS infrastructure (VPC, EC2, S3, EBS, security groups) for Java deployments across airline customer production environments.',
      'Automated CloudWatch Agent, AWS WAF, CrushFTP, and WildFly deployment with Bash, cutting about 4 hours of manual provisioning per deployment.'
    ],
    tags: ['AWS', 'Bash', 'CloudWatch', 'AWS WAF', 'Linux']
  },
  {
    id: 5,
    company: 'Xtreme Polishing Systems',
    title: 'Lead Frontend Web Developer',
    location: 'Pompano Beach, FL',
    dates: "May '22 – Dec '22",
    highlights: [
      'Built and launched 10+ WordPress sites as the company’s only WordPress developer, and a Shopify store prototype managing about 150 products.'
    ],
    tags: ['WordPress', 'Shopify', 'SEO']
  },
  {
    id: 6,
    company: 'Wiretap Telecom',
    title: 'Lead Frontend Developer / Helpdesk Engineer',
    location: 'Brickell, FL',
    dates: "Nov '21 – Apr '22",
    highlights: [
      'Built a fax tracking interface, still in production, that helped uncover a major backend bug and cut related support tickets by 72%.',
      'Provisioned and administered 3CX PBX telephony on VMware and Amazon EC2.'
    ],
    tags: ['JavaScript', 'Bootstrap', '3CX', 'Amazon EC2']
  },
  {
    id: 7,
    company: 'Lyrist',
    title: 'React Native Developer Intern',
    location: 'Seattle, WA (Remote)',
    dates: "Jun '21 – Oct '21, Jul '23",
    highlights: [
      'Built React Native features with TypeScript, Redux, and Firebase, including a YouTube Data API integration, and fixed failing Azure DevOps builds.'
    ],
    tags: ['React Native', 'TypeScript', 'Firebase', 'Azure DevOps']
  }
]

const earlier = 'Microsoft (Services Advisor) · Florida East Coast Realty (IT Technician / Web Developer — cut workstation deployment time 31% with WDS/MDT) · Best Buy Geek Squad'

const Experience = () => {
  return (
    <section id='experience'>
      <h5 className='reveal'>03 — Experience</h5>
      <h2 className='reveal'>Where I've worked</h2>

      <div className='container experience__timeline'>
        {data.map(({ id, company, title, note, location, dates, highlights, tags }) => (
          <article key={id} className='experience__item reveal'>
            <div className='experience__item-head'>
              <div>
                <h3 className='experience__company'>{company}</h3>
                <h4 className='experience__title'>{title}</h4>
                {note && <small className='experience__note'>{note}</small>}
              </div>
              <div className='experience__meta'>
                <small>{dates}</small>
                <small className='text-light'>{location}</small>
              </div>
            </div>
            <ul className='experience__highlights'>
              {highlights.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <ul className='tag-list'>
              {tags.map((tag) => (
                <li key={tag} className='tag'>{tag}</li>
              ))}
            </ul>
          </article>
        ))}

        <p className='experience__earlier'>
          <strong>Earlier:</strong> {earlier}
        </p>
      </div>
    </section>
  )
}

export default Experience
