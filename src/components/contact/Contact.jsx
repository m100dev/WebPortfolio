import React, { useRef, useState } from 'react';
import './contact.css';
import { MdOutlineMailOutline } from 'react-icons/md';
import { FaLinkedinIn } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_pqmsbzr';
const TEMPLATE_ID = 'template_e8nna57';
const PUBLIC_KEY = 'iAe9maex10yhKE02z';

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrorMessage('');

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(() => {
        setStatus('success');
        form.current?.reset();
      })
      .catch((error) => {
        const detail = error?.text || error?.message || 'Unknown error';
        console.error('EmailJS sendForm failed:', error);
        setStatus('error');
        setErrorMessage(detail);
      });
  };

  const closeModal = () => setStatus('idle');

  const isSending = status === 'sending';

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
        </div>
        {/* END OF CONTACT OPTIONS */}
        <form ref={form} onSubmit={sendEmail}>
          <input type="text" name='name' placeholder='Your Full Name' required disabled={isSending}/>
          <input type="email" name='email' placeholder='Your Email' required disabled={isSending}/>
          <textarea name="message" rows="10" placeholder='Your Message' required disabled={isSending}></textarea>
          {status === 'error' && (
            <p className="contact__error" role="alert">
              Sorry, your message couldn't be sent: {errorMessage}. Please try again or email me directly.
            </p>
          )}
          <button type='submit' className='btn btn-primary' disabled={isSending}>
            {isSending ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>

      {status === 'success' && (
        <div
          className="contact__modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
          onClick={closeModal}
        >
          <div className="contact__modal" onClick={(e) => e.stopPropagation()}>
            <h3 id="contact-success-title">Message Sent</h3>
            <p>Thanks for reaching out — I'll get back to you shortly.</p>
            <button type="button" className="btn btn-primary" onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Contact;
