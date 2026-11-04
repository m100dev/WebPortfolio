import React, { useEffect, useRef, useState } from 'react'
import './nav.css'
import { HiOutlineMenuAlt4, HiOutlineX, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useActiveSection from '../../hooks/useActiveSection'
import useTheme from '../../hooks/useTheme'

// Home sections, linked as #id on the home page and /#id from other pages
const links = [
  { id: 'portfolio', label: 'Work' },
  { id: 'ai-engineering', label: 'How I Build' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' }
]

// Separate pages, linked as routes
const pages = [
  { to: '/guides', label: 'Guides' }
]

// On home, plain anchors keep native smooth scrolling; elsewhere route back to /#id.
const SectionLink = ({ id, onHome, children, ...props }) =>
  onHome
    ? <a href={`#${id}`} {...props}>{children}</a>
    : <Link to={{ pathname: '/', hash: `#${id}` }} {...props}>{children}</Link>

// Sticky top bar: transparent over the hero, frosted once scrolled.
// The active link follows the section in view; on small screens the links move into a menu sheet.
const Nav = () => {
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const active = useActiveSection(onHome)
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
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
        <SectionLink id='home' onHome={onHome} className='site-nav__logo' aria-label='Marc Bastien, back to top' onClick={closeMenu}>
          MB
        </SectionLink>

        <ul id='site-nav-links' className='site-nav__links'>
          {links.map(({ id, label }) => (
            <li key={id}>
              <SectionLink
                id={id}
                onHome={onHome}
                className={active === id ? 'is-active' : ''}
                aria-current={active === id ? 'location' : undefined}
                onClick={closeMenu}
              >
                {label}
              </SectionLink>
            </li>
          ))}
          {pages.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} className={({ isActive }) => (isActive ? 'is-active' : '')} onClick={closeMenu}>
                {label}
              </NavLink>
            </li>
          ))}
          <li className='site-nav__cta'>
            <SectionLink id='contact' onHome={onHome} className='btn btn-primary' onClick={closeMenu}>Let's talk</SectionLink>
          </li>
        </ul>

        <div className='site-nav__actions'>
          <button
            type='button'
            className='site-nav__theme'
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
          </button>

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
      </div>
    </nav>
  )
}

export default Nav
