import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import './portfolio.css'
import IMG_MYAUTOTAB from '../../assets/MyAutoTabProject.webp';
import IMG_AVD from '../../assets/Hybrid_Identity.webp';
import IMG_1101_SITE from '../../assets/1101-Brickell-Site.webp';
import IMG_1101_MAPS from '../../assets/1101-Maps-Api-Feature.webp';
import IMG_BOCA from '../../assets/bocadelraypc.webp';
import IMG_VILLA from '../../assets/villa-majorca-site.webp';
import IMG_LOCAL_LLM from '../../assets/Hello-LocalLLM-Project.webp';
import { Link } from 'react-router-dom';
import { BsCpu, BsArrowRight, BsArrowsAngleExpand, BsPauseFill, BsPlayFill } from 'react-icons/bs';
import ImageZoom, { ZOOM_TRANSITION_NAME, canMorph } from './ImageZoom';

// repo: a URL (GitHub button), 'private' (disabled Private Repo badge), or null (no repo button)
// video: optional YouTube URL (Debug Video button)
// fit: 'contain' shows the whole image (for diagrams) instead of cropping it to the frame
const data = [
  {
    id: 1,
    images: [{ src: IMG_MYAUTOTAB, caption: 'MyAutoTab dashboard' }],
    title: 'MyAutoTab',
    description: 'Multi-tenant vehicle management SaaS built end to end. Tenant data isolation with PostgreSQL Row-Level Security, automated backups, and a GitHub Actions CI/CD pipeline. In staging with 5 test users.',
    stack: ['React', '.NET / EF Core', 'PostgreSQL', 'GitHub Actions', 'Render', 'Cloudflare'],
    repo: 'private',
    video: 'https://www.youtube.com/watch?v=b7TRmFrNALg',
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

const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// A card's image frame. Multi-image cards crossfade every 3s; rotation pauses on hover, on
// keyboard focus, while the image is enlarged, or via the pause button (WCAG 2.2.2), and never
// starts for reduced-motion users. Clicking/tapping the image opens it enlarged (ImageZoom).
const ImageRotator = ({ images, fit, title }) => {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(prefersReducedMotion);
  const [zoomed, setZoomed] = useState(false);
  const [morph, setMorph] = useState(false);
  const imgRefs = useRef([]);
  const count = images.length;
  const current = images[index];

  const running = count > 1 && !hovered && !focused && !userPaused && !zoomed;

  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [running, count]);

  // The thumbnail and the enlarged image swap the shared view-transition name, so the
  // browser morphs one into the other; without view transitions the dialog just fades in.
  const openZoom = () => {
    const thumb = imgRefs.current[index];
    if (!canMorph() || !thumb) {
      setMorph(false);
      setZoomed(true);
      return;
    }
    setMorph(true);
    thumb.style.viewTransitionName = ZOOM_TRANSITION_NAME;
    document.startViewTransition(() => {
      thumb.style.viewTransitionName = '';
      flushSync(() => setZoomed(true));
    });
  };

  const closeZoom = () => {
    const thumb = imgRefs.current[index];
    if (!morph || !canMorph() || !thumb) {
      setZoomed(false);
      return;
    }
    const transition = document.startViewTransition(() => {
      flushSync(() => setZoomed(false));
      thumb.style.viewTransitionName = ZOOM_TRANSITION_NAME;
    });
    transition.finished.finally(() => { thumb.style.viewTransitionName = ''; });
  };

  return (
    <>
      <div
        className={fit === 'contain' ? 'portfolio__item-image portfolio__item-image--contain' : 'portfolio__item-image'}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setFocused(true)}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}
      >
        {count === 0 && <div className="portfolio__item-placeholder"><BsCpu /></div>}
        {images.map(({ src, caption }, i) => (
          <img
            key={src}
            ref={(el) => { imgRefs.current[i] = el; }}
            src={src}
            loading="lazy"
            alt={caption || `${title} screenshot`}
            className={i === index ? 'is-active' : ''}
            aria-hidden={i !== index}
          />
        ))}
        {count > 0 && (
          <button
            type="button"
            className="portfolio__item-zoom"
            aria-label={`Expand image: ${current.caption || title}`}
            onClick={openZoom}
          >
            <span className="portfolio__item-zoom-badge mono" aria-hidden="true">
              <BsArrowsAngleExpand /> Expand
            </span>
          </button>
        )}
        {count > 1 && (
          <>
            <span className="portfolio__item-caption">{current.caption}</span>
            <div className="portfolio__item-controls">
              <button
                type="button"
                className="portfolio__item-pause"
                aria-pressed={userPaused}
                aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
                onClick={() => setUserPaused((p) => !p)}
              >
                {userPaused ? <BsPlayFill aria-hidden="true" /> : <BsPauseFill aria-hidden="true" />}
              </button>
              <div className="portfolio__item-dots">
                {images.map(({ src, caption }, i) => (
                  <button
                    key={src}
                    type="button"
                    className={i === index ? 'is-active' : ''}
                    aria-label={`Show ${caption}`}
                    aria-current={i === index ? 'true' : undefined}
                    onClick={() => setIndex(i)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {count > 0 && (
        <ImageZoom open={zoomed} image={current} contain={fit === 'contain'} morph={morph} onClose={closeZoom} />
      )}
    </>
  );
};

function Portfolio() {
  return (
    <section id='portfolio'>
      <h5 className='reveal'>01 — Work</h5>
      <h2 className='reveal'>Selected projects</h2>
      <div className="container portfolio__container">
        {
          data.map(({id, images, fit, title, description, stack, repo, video, demo}, index) => {
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
                  {video && <a href={video} target='_blank' rel="noreferrer" className='btn'>Debug Video</a>}
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
