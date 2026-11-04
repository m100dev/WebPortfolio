import React, { useEffect, useRef, useState } from 'react'
import './nav.css'
import { HiOutlineMenuAlt4, HiOutlineX } from 'react-icons/hi'
import useActiveSection from '../../hooks/useActiveSection'

const links = [
  { id: 'portfolio', label: 'Work' },
  { id: 'ai-engineering', label: 'How I Build' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
]

// Sticky top bar: transparent over the hero, frosted once scrolled.
// The active link follows the section in view; on small screens the links move into a menu sheet.
const Nav = () => {
  const active = useActiveSection()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav
      aria-label='Primary'
      className={`site-nav${scrolled || menuOpen ? ' site-nav--solid' : ''}${menuOpen ? ' site-nav--open' : ''}`}
    >
      <div className='site-nav__inner'>
        <a href='#home' className='site-nav__logo' aria-label='Marc Bastien, back to top' onClick={closeMenu}>
          MB
        </a>

        <ul id='site-nav-links' className='site-nav__links'>
          {links.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={active === id ? 'is-active' : ''}
                aria-current={active === id ? 'location' : undefined}
                onClick={closeMenu}
              >
                {label}
              </a>
            </li>
          ))}
          <li className='site-nav__cta'>
            <a href='#contact' className='btn btn-primary' onClick={closeMenu}>Let's talk</a>
          </li>
        </ul>

        <button
          ref={menuButton}
          type='button'
          className='site-nav__toggle'
          aria-expanded={menuOpen}
          aria-controls='site-nav-links'
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt4 />}
        </button>
      </div>
    </nav>
  )
}

export default Nav
