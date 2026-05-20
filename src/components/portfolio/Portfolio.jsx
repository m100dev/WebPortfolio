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
    </section>
  )
}

export default Portfolio
