import { useRef, useState } from 'react';
import './contact.css';
import { BsLinkedin } from 'react-icons/bs';
import { FaGithub } from 'react-icons/fa';
import { MdContentCopy, MdCheck } from 'react-icons/md';
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_pqmsbzr';
const TEMPLATE_ID = 'template_e8nna57';
const PUBLIC_KEY = 'iAe9maex10yhKE02z';
const EMAIL = 'mbastien.dev@gmail.com';
// Spam filter: a honeypot (how it works, for readers: ./README.md).
// The form has a hidden fourth field that people never see, but simple spam bots
// fill in every field they find. If it comes back filled in, I know it's a bot.
//
// I named it "website" because bots happily fill that in, but browsers don't
// autofill it. I avoided names like "company": a browser could autofill those
// for a real visitor, and their message would be silently dropped. Tested with
// Chrome autofill on 2026-11-05: the field stayed empty.
const HONEYPOT = 'website';

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Copies the email; falls back to a hidden textarea + execCommand where the Clipboard API is unavailable
  const copyEmail = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    const legacyCopy = () => {
      const area = document.createElement('textarea');
      area.value = EMAIL;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      if (ok) done();
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(EMAIL).then(done).catch(legacyCopy);
    } else {
      legacyCopy();
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    // Honeypot check, before anything is sent. If the hidden field has anything in
    // it, this is a bot: I show the normal "Message Sent" dialog but never call
    // EmailJS. Faking success means the bot thinks it worked and moves on, instead
    // of retrying or trying something smarter.
    if (form.current?.elements.namedItem(HONEYPOT)?.value) {
      setStatus('success');
      form.current.reset();
      return;
    }

    setStatus('sending');
    setErrorMessage('');

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, { publicKey: PUBLIC_KEY })
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
      <h5 className='reveal'>06 — Contact</h5>
      <h2 className='reveal'>Let's build something</h2>
      <div className="container contact__container">
        <div className="contact__intro reveal">
          <p className="contact__status mono">
            <span className="contact__status-dot" aria-hidden="true" />
            Open to Cloud, DevOps &amp; AI engineering roles · DC/MD · Remote
          </p>
          <a href={`mailto:${EMAIL}`} className="contact__email">{EMAIL}</a>
          <div className="contact__actions">
            <button type="button" className="btn contact__copy" onClick={copyEmail}>
              {copied ? <MdCheck aria-hidden="true" /> : <MdContentCopy aria-hidden="true" />}
              {copied ? 'Copied' : 'Copy email'}
            </button>
            <span className="contact__sr" role="status">{copied ? 'Email address copied' : ''}</span>
          </div>
          <ul className="contact__links">
            <li>
              <a href="https://www.linkedin.com/in/marcbastien00/" target="_blank" rel="noreferrer"><BsLinkedin aria-hidden="true" /> LinkedIn</a>
            </li>
            <li>
              <a href="https://github.com/m100dev" target="_blank" rel="noreferrer"><FaGithub aria-hidden="true" /> GitHub</a>
            </li>
          </ul>
        </div>
        <form ref={form} onSubmit={sendEmail} className="contact__form reveal" style={{ '--i': 1 }}>
          <input type="text" name='name' placeholder='Your Full Name' autoComplete="name" required disabled={isSending}/>
          <input type="email" name='email' placeholder='Your Email' autoComplete="email" required disabled={isSending}/>
          <textarea name="message" rows="10" placeholder='Your Message' required disabled={isSending}></textarea>
          {/* The honeypot field, hidden from people in three ways: pushed off-screen by
              .contact__hp, skipped by screen readers (aria-hidden), and skipped by the
              Tab key (tabIndex -1). The label is there for bots that read labels. */}
          <div className="contact__hp" aria-hidden="true">
            <label htmlFor="contact-website">Leave this field empty</label>
            <input id="contact-website" type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" />
          </div>
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
