import React from 'react'
import './Portfolio'

function Portfolio() {
  return (
    <section id='portfolio'>
      <h5>My Recent Work</h5>
      <h2>Portfolio</h2>

      <div className="container portfolio__container">
        <article className='Portfolio__item'>
          <div className="portfolio__item-image"></div>
          <h3>This is a portfolio item title</h3>
          <a href="https://github.com/m100dev" className='btn'>Github</a> 
          <a href="https://www.google.com" target='_blank' rel="noreferrer" className="btn btn-primary">Live Demo</a>
        </article>
      </div>
    </section>
  )
}

export default Portfolio