import React from 'react'
import './testimonials.css'
import AVTR1 from '../../assets/avatar1.jpg'
import AVTR2 from '../../assets/avatar2.jpg'
import AVTR3 from '../../assets/avatar3.jpg'
import AVTR4 from '../../assets/avatar4.jpg'
import { register } from 'swiper/element/bundle';

register();

const Testimonials = () => {
  const data = [
    {
      avatar: AVTR1,
      name: 'Lyrist',
      review: 'Marc was very helpful during the initial product launch of Lyrist on Product Hunt. His outreach to potential users made huge impact on amount of upvotes gained during launch.'
    },
    {
      avatar: AVTR2,
      name: 'GPX Films',
      review: 'He pays great attention to detail and designed my site based on the criteria I provided. Marc is my go to expert for all things tech, he is patient and listens to your needs.'
    },
    {
      avatar: AVTR3,
      name: 'Umba Daima',
      review: 'Marc is skilled in wireframing utilized Figma to bring our requests into vision. We appreciated his adherence to our deadlines. Will definitely work with him again!'
    },
    {
      avatar: AVTR4,
      name: 'Regroup Digital Solutions',
      review: 'Marc is very professional and I would recommend him for any javascript projects. He met our very tight timeline and was very communicative through the project.'
    }
  ]

  return (
    <section id='testimonials'>
      <h5>Review from clients</h5>
      <h2>Testimonials</h2>

      <div className='container testimonials__container'>
        <swiper-container slides-per-view='1' pagination='true' space-between={40}>
          {
            data.map(({avatar, name, review}, index) => {
              return (
                <swiper-slide key={index}>
                  <article className='testimonial'>
                    <div className="client__avatar">
                      <img src={avatar} alt="" />
                    </div>
                    <h5 className='client__name'>{name}</h5>
                    <small className="client__review">
                      {review}
                    </small>
                  </article>
                </swiper-slide>
              )
            })
          }
        </swiper-container>
      </div>
    </section>
  )
}

export default Testimonials