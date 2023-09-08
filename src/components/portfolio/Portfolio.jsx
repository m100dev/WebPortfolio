import React from 'react'
import './portfolio.css'
import IMG1 from '../../assets/expense-tracker-project.png';
import IMG2 from '../../assets/rgb-color-guess-thumbnail.png';
import IMG3 from '../../assets/task-planner-project.png';
import IMG4 from '../../assets/xps-xpress.png';
import IMG5 from '../../assets/villa-majorca-site.png';
import IMG6 from '../../assets/garage-epoxy-shopify.png';

const data = [
  {
    id: 1,
    image: IMG1,
    title: 'Expense Tracker',
    github: 'https://github.com/m100dev/expense-tracker',
    demo: 'https://m100dev.github.io/expense-tracker/',
    isRepoPublic: true
  },
  {
    id: 2,
    image: IMG2,
    title: 'Color Guessing Game',
    github: 'https://github.com/m100dev/rgb-color-guesser',
    demo: 'https://m100dev.github.io/rgb-color-guesser/',
    isRepoPublic: true
  },
  {
    id: 3,
    image: IMG3,
    title: 'Task Planner',
    github: 'https://github.com/m100dev/task-planner',
    demo: 'https://m100dev.github.io/task-planner/',
    isRepoPublic: true
  },
  {
    id: 4,
    image: IMG4,
    title: 'XPS Xpress Pompano',
    github: 'https://github.com',
    demo: 'https://xpsxpresspompanobeach.com/',
    isRepoPublic: false
  },
  {
    id: 5,
    image: IMG5,
    title: 'Villa Majorca',
    github: 'https://github.com',
    demo: 'https://villamajorca.com/',
    isRepoPublic: false
  },
  {
    id: 6,
    image: IMG6,
    title: 'Garage Epoxy',
    github: 'https://github.com',
    demo: 'https://garageepoxy.com/',
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
                  <a href={demo} target='_blank' rel="noreferrer" className="btn btn-primary">Live Demo</a>
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