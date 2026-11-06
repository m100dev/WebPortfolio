import { useCallback, useEffect, useRef } from 'react'

const RESET_MS = 2000

const legacyCopy = (text) => {
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let ok
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  document.body.removeChild(area)
  return ok
}

// Click handler for a container of `.code` blocks: a `.code-copy` button copies the
// <code> in its block and shows "Copied!" for two seconds (same approach as Contact.jsx).
const useCodeCopy = () => {
  const timers = useRef(new Set())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => clearTimeout(t))
  }, [])

  return useCallback((event) => {
    const button = event.target.closest('.code-copy')
    if (!button) return
    const code = button.closest('.code')?.querySelector('code')
    if (!code) return
    const text = code.innerText || code.textContent

    const done = () => {
      button.textContent = 'Copied!'
      button.classList.add('ok')
      const t = setTimeout(() => {
        button.textContent = 'Copy'
        button.classList.remove('ok')
        timers.current.delete(t)
      }, RESET_MS)
      timers.current.add(t)
    }

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => {
        if (legacyCopy(text)) done()
      })
    } else if (legacyCopy(text)) {
      done()
    }
  }, [])
}

export default useCodeCopy
