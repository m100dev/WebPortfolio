import React from 'react'
import './testimonials.css'
import AVTR1 from '../../assets/avatar1.jpg'
import AVTR2 from '../../assets/avatar2.png'
import AVTR3 from '../../assets/avatar3.jpg'
import AVTR4 from '../../assets/avatar4.png'

const data = [
  {
    avatar: AVTR1,
    name: 'Lyrist',
    review: 'Marc was very helpful during the initial product launch of Lyrist on Product Hunt. His outreach to potential users made a huge impact on the amount of upvotes gained during launch.'
  },
  {
    avatar: AVTR2,
    name: 'GPX Films',
    review: 'He pays great attention to detail and designed my site based on the criteria I provided. Marc is my go to guy for all things tech, he is patient and listens to your needs.'
  },
  {
    avatar: AVTR3,
    name: 'Umba Daima',
    review: 'Marc helped with wireframing our idea in Figma to help in bringing our vision into reality. We appreciated his adherence to our deadlines.'
  },
  {
    avatar: AVTR4,
    name: 'Regroup Digital Solutions',
    review: 'Marc is very professional and I would recommend him for any javascript projects. He met our very tight timeline and was very communicative through the project.'
  }
]

// All endorsements visible at once as a quote grid (no carousel hiding 3 of 4)
const Testimonials = () => {
  return (
    <section id='testimonials'>
      <h5 className='reveal'>05 — Endorsements</h5>
      <h2 className='reveal'>From people I've worked with</h2>

      <div className='container testimonials__container'>
        {data.map(({ avatar, name, review }, index) => (
          <figure key={name} className='testimonial reveal' style={{ '--i': index % 2 }}>
            <blockquote className='client__review'>{review}</blockquote>
            <figcaption className='client__meta'>
              <div className='client__avatar'>
                <img src={avatar} alt='' loading='lazy' />
              </div>
              <span className='client__name'>{name}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default Testimonials
