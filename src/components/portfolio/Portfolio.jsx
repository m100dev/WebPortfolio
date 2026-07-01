import React from 'react'
import './portfolio.css'
import IMG1 from '../../assets/MyAutoTabProject.jpg';
import IMG2 from '../../assets/expense-tracker-project.png';
import IMG3 from '../../assets/bocadelray.jpg';
import IMG4 from '../../assets/villa-majorca-site.png';

const data = [
  {
    id: 1,
    image: IMG1,
    title: 'MyAutoTab',
    github: 'https://github.com',
    demo: 'https://web.staging.myautotab.com',
    isRepoPublic: false
  },
  {
    id: 2,
    image: IMG2,
    title: 'Expense Tracker',
    github: 'https://github.com/m100dev/expense-tracker',
    demo: 'https://m100dev.github.io/expense-tracker/',
    isRepoPublic: true
  },
  {
    id: 3,
    image: IMG3,
    title: 'Boca Delray Polished Concrete',
    github: 'https://github.com',
    demo: 'https://bocadelraypolishedconcrete.com/',
    isRepoPublic: false
  },
  {
    id: 4,
    image: IMG4,
    title: 'Villa Majorca',
    github: 'https://github.com',
    demo: 'https://villamajorca.com/',
    isRepoPublic: false
  }
]

// Guides data — kept intact; re-enable alongside the guides JSX below once redirects work.
// const guides = [
//   {
//     id: 1,
//     title: 'AVD Enterprise Workspace — Project Guide',
//     description: 'Hybrid identity, Microsoft 365, AVD, and Intune lab — including production-grade PowerShell auto-remediation for AVD activation failures.',
//     url: process.env.PUBLIC_URL + '/guides/AVD_Enterprise_Project_Guide.html',
//     repo: 'https://github.com/m100dev/AVD-Enterprise-Lab-Portfolio'
//   },
//   {
//     id: 2,
//     title: 'The Five Levels of AI Autonomy',
//     description: 'A practical framework for measuring growth from AI-assisted coding to fully autonomous multi-agent orchestration.',
//     url: process.env.PUBLIC_URL + '/guides/Marc-Bastien-AI-Autonomy-Levels.html'
//   }
// ]

function Portfolio() {
  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>
      <div className="container portfolio__container">
        {
          data.map(({id, image, title, github, demo, isRepoPublic}) => {
            return (
              <article key={id} className='portfolio__item'>
                <div className="portfolio__item-image">
                  <img src={image} alt="" />
                </div>
                <h3>{title}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} target='_blank' rel="noreferrer" className={isRepoPublic ? 'btn' : 'btn gh__inactive'}>{isRepoPublic ? 'Github' : 'Private Repo'}</a>
                  <a href={demo} target='_blank' rel="noreferrer" className="btn btn-primary">{isRepoPublic ? 'Live Demo' : 'Live Site'}</a>
                </div>
              </article>
            )
          })
        }
      </div>

      {/* Guides section hidden until Amplify redirects serve the /guides/*.html files correctly.
          Re-enable by uncommenting this block (guides data array above is left intact). */}
      {/* <div className="container portfolio__guides">
        <h3 className="portfolio__guides-title">Guides &amp; Write-ups</h3>
        <div className="portfolio__guides-list">
          {
            guides.map(({ id, title, description, url, repo }) => (
              <article key={id} className="portfolio__guide">
                <h4 className="portfolio__guide-title">{title}</h4>
                <p className="portfolio__guide-desc">{description}</p>
                <div className="portfolio__guide-cta">
                  <a href={url} target='_blank' rel="noreferrer" className="btn btn-primary">Read Guide &rarr;</a>
                  {repo && (
                    <a href={repo} target='_blank' rel="noreferrer" className="btn">GitHub</a>
                  )}
                </div>
              </article>
            ))
          }
        </div>
      </div> */}
    </section>
  )
}

export default Portfolio
