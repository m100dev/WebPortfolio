import React from 'react'
import './portfolio.css'
import IMG1 from '../../assets/portfolio1.jpg';
import IMG2 from '../../assets/portfolio2.jpg';
import IMG3 from '../../assets/portfolio3.jpg';
import IMG4 from '../../assets/portfolio4.jpg';
import IMG5 from '../../assets/portfolio5.png';
import IMG6 from '../../assets/portfolio6.jpg';

const data = [
  {
    id: 1,
    image: IMG1,
    title: 'Expense Tracker',
    github: 'https://github.com',
    demo: 'https://s3.xyz.fake.com'
  },
  {
    id: 2,
    image: IMG2,
    title: 'Color Guessing Game',
    github: 'https://github.com',
    demo: 'https://s3.xyz.fake.com'
  },
  {
    id: 3,
    image: IMG3,
    title: 'Goal Track App',
    github: 'https://github.com',
    demo: 'https://s3.xyz.fake.com'
  },
  {
    id: 4,
    image: IMG4,
    title: 'XPS Xpress Pompano',
    github: 'https://github.com',
    demo: 'https://s3.xyz.fake.com'
  },
  {
    id: 5,
    image: IMG5,
    title: '1101 Brickell',
    github: 'https://github.com',
    demo: 'https://s3.xyz.fake.com'
  },
  {
    id: 6,
    image: IMG6,
    title: 'Garage Epoxy',
    github: 'https://github.com',
    demo: 'https://s3.xyz.fake.com'
  }
] 

function Portfolio() {
  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>
      <div className="container portfolio__container">
        {
          data.map(({id, image, title, github, demo}) => {
            return (
              <article key={id} className='portfolio__item'>
                <div className="portfolio__item-image">
                  <img src={image} alt="" />
                </div>
                <h3>{title}</h3>
                <div className="portfolio__item-cta">
                  <a href={github} target='_blank' rel="noreferrer" className='btn'>Github</a> 
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