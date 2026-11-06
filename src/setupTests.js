// jest-dom adds custom matchers like toBeInTheDocument()
import '@testing-library/jest-dom/vitest'

// jsdom lacks these browser APIs; components and hooks use them unguarded.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false
  })
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe () {}
    unobserve () {}
    disconnect () {}
    takeRecords () { return [] }
  }
}

if (!window.scrollTo || window.scrollTo.toString().includes('notImplemented')) {
  window.scrollTo = () => {}
}
