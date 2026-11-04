import React, { useEffect, useState } from 'react'
import './portfolio.css'
import IMG_MYAUTOTAB from '../../assets/MyAutoTabProject.webp';
import IMG_AVD from '../../assets/Hybrid_Identity.webp';
import IMG_1101_SITE from '../../assets/1101-Brickell-Site.webp';
import IMG_1101_MAPS from '../../assets/1101-Maps-Api-Feature.webp';
import IMG_BOCA from '../../assets/bocadelray.webp';
import IMG_VILLA from '../../assets/villa-majorca-site.webp';
import IMG_LOCAL_LLM from '../../assets/Hello-LocalLLM-Project.webp';
import { Link } from 'react-router-dom';
import { BsCpu, BsArrowRight } from 'react-icons/bs';

// repo: a URL (GitHub button), 'private' (disabled Private Repo badge), or null (no repo button)
// fit: 'contain' shows the whole image (for diagrams) instead of cropping it to the frame
const data = [
  {
    id: 1,
    images: [{ src: IMG_MYAUTOTAB, caption: 'MyAutoTab dashboard' }],
    title: 'MyAutoTab',
    description: 'Multi-tenant vehicle management SaaS built end to end. Tenant data isolation with PostgreSQL Row-Level Security, automated backups, and a GitHub Actions CI/CD pipeline. In staging with 5 test users.',
    stack: ['React', '.NET / EF Core', 'PostgreSQL', 'GitHub Actions', 'Render', 'Cloudflare'],
    repo: 'private',
    demo: 'https://web.staging.myautotab.com'
  },
  {
    id: 6,
    images: [{ src: IMG_LOCAL_LLM, caption: 'Hermes Agent running Qwen3.6-35B-A3B locally' }],
    title: 'Self-Hosted AI Agent (Mac mini M5 Pro)',
    description: 'Running Hermes Agent with local models, so prompts and data never leave the machine. Tool calls run only in a Docker sandbox, with access limited to specific folders through volume mounts. Using the setup to compare open-source LLMs on inference speed and output quality across quantization levels, and ran LTX-Video from the CLI to generate short clips locally. Now building an Obsidian knowledge base the agent uses for long-term context.',
    stack: ['Docker', 'Local LLMs', 'AI Agents', 'llama.cpp', 'Python', 'CLI'],
    repo: null,
    demo: null
  },
  {
    id: 2,
    images: [{ src: IMG_AVD, caption: 'Hybrid identity, AVD and Microsoft 365 architecture' }],
    fit: 'contain',
    title: 'Hybrid Azure Virtual Desktop Lab',
    description: 'Hybrid identity and AVD environment for a simulated 200-person firm: on-prem AD synced to Entra ID, Conditional Access and MFA, plus an Intune-deployed PowerShell remediation that auto-fixes Microsoft 365 activation failures.',
    stack: ['Azure Virtual Desktop', 'Entra ID', 'Intune', 'PowerShell', 'FSLogix', 'Hyper-V'],
    repo: 'https://github.com/m100dev/AVD-Enterprise-Lab-Portfolio',
    demo: null
  },
  {
    id: 3,
    images: [
      { src: IMG_1101_SITE, caption: '1101 Brickell home page' },
      { src: IMG_1101_MAPS, caption: 'Google Maps listings feature' }
    ],
    title: '1101 Brickell',
    description: 'Property website for a Brickell office tower, built at Florida East Coast Realty and still in production. Includes a custom map-based listings feature built with the Google Maps API.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Google Maps API', 'Git'],
    repo: null,
    demo: 'https://www.1101brickell.com'
  },
  {
    id: 4,
    images: [{ src: IMG_BOCA, caption: 'Boca Delray Polished Concrete website' }],
    title: 'Boca Delray Polished Concrete',
    description: 'Client website for a South Florida concrete polishing company.',
    stack: ['Client Work', 'Web Design'],
    repo: null,
    demo: 'https://bocadelraypolishedconcrete.com/'
  },
  {
    id: 5,
    images: [{ src: IMG_VILLA, caption: 'Villa Majorca website' }],
    title: 'Villa Majorca',
    description: 'Client website for a residential property.',
    stack: ['Client Work', 'Web Design'],
    repo: null,
    demo: 'https://villamajorca.com/'
  }
]

const ROTATE_MS = 3000;

// Crossfades through a card's images every 3s and pauses while hovered. Single images render statically.
const ImageRotator = ({ images, fit, title }) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  return (
    <div
      className={fit === 'contain' ? 'portfolio__item-image portfolio__item-image--contain' : 'portfolio__item-image'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {count === 0 && <div className="portfolio__item-placeholder"><BsCpu /></div>}
      {images.map(({ src, caption }, i) => (
        <img
          key={src}
          src={src}
          loading="lazy"
          alt={caption || `${title} screenshot`}
          className={i === index ? 'is-active' : ''}
          aria-hidden={i !== index}
        />
      ))}
      {count > 1 && (
        <>
          <span className="portfolio__item-caption">{images[index].caption}</span>
          <div className="portfolio__item-dots">
            {images.map(({ src, caption }, i) => (
              <button
                key={src}
                type="button"
                className={i === index ? 'is-active' : ''}
                aria-label={`Show ${caption}`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function Portfolio() {
  return (
    <section id='portfolio'>
      <h5 className='reveal'>01 — Work</h5>
      <h2 className='reveal'>Selected projects</h2>
      <div className="container portfolio__container">
        {
          data.map(({id, images, fit, title, description, stack, repo, demo}, index) => {
            return (
              <article key={id} className='portfolio__item reveal' style={{ '--i': index % 3 }}>
                <ImageRotator images={images} fit={fit} title={title} />
                <h3>{title}</h3>
                <p className="portfolio__item-desc">{description}</p>
                <ul className="tag-list portfolio__item-stack">
                  {stack.map((tech) => <li key={tech} className="tag">{tech}</li>)}
                </ul>
                <div className="portfolio__item-cta">
                  {repo === 'private' && <span className='btn gh__inactive'>Private Repo</span>}
                  {repo && repo !== 'private' && <a href={repo} target='_blank' rel="noreferrer" className='btn'>GitHub</a>}
                  {demo && <a href={demo} target='_blank' rel="noreferrer" className="btn btn-primary">Live Site</a>}
                </div>
              </article>
            )
          })
        }
      </div>

      <div className="container">
        <Link to="/guides" className="portfolio__guides reveal">
          <span className="portfolio__guides-eyebrow mono">Guides &amp; write-ups</span>
          <span className="portfolio__guides-title">
            Step-by-step lab guides and my AI autonomy framework
          </span>
          <span className="portfolio__guides-cta">Browse guides <BsArrowRight aria-hidden="true" /></span>
        </Link>
      </div>
    </section>
  )
}

export default Portfolio
