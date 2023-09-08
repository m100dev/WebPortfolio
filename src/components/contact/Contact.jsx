import React from 'react'
import './contact.css'
import { MdOutlineMailOutline } from 'react-icons/md'
import { FaLinkedinIn } from 'react-icons/fa'
import { FiPhoneCall } from 'react-icons/fi'

const Contact = () => {
  return (
    <section id='contact'>
      <h5>Get In Touch</h5>
      <h2>Contact Me</h2>
      <div className="container contact__container">
        <div className="contact__options">
          <article className="contact__option">
            <MdOutlineMailOutline className='contact__option-icon'/>
            <h4>Email</h4>
            <h5>mbastien.dev@gmail.com</h5>
            <a href='mailto:mbastien.dev@gmail.com' target='_blank' rel='noreferrer'>Send a message</a>
          </article>
          <article className="contact__option">
            <FaLinkedinIn className='contact__option-icon'/>
            <h4>LinkedIn</h4>
            <h5>Marc Bastien</h5>
            <a href='https://www.linkedin.com/in/mbastien001/' target='_blank' rel='noreferrer'>Reach out</a>
          </article>
          <article className="contact__option">
            <FiPhoneCall className='contact__option-icon'/>
            <h4>Google Voice</h4>
            <h5>+15619618623</h5>
            <a href="tel:+15619618623" target='_blank' rel='noreferrer'>Let's talk</a>
          </article>
        </div>
        {/* END OF CONTACT OPTIONS */}
        <form action="">
          <input type="text" name='name' placeholder='Your Full Name' required/>
          <input type="email" name='email' placeholder='Your Email' required/>
          <textarea name="message" rows="10" placeholder='Your Message' required></textarea>
          <button type='submit' className='btn btn-primary'>Send Message</button>
        </form>
      </div>
    </section>
  )
}

export default Contact