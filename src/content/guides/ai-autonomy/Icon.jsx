import ICONS from './icons'

// Static, trusted SVG bodies from icons.js (never user input), so innerHTML is safe here.
const Icon = ({ name, className }) => {
  const icon = ICONS[name]
  if (!icon) return null
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={icon.sw || 1.6}
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
      focusable='false'
      dangerouslySetInnerHTML={{ __html: icon.d }}
    />
  )
}

export default Icon
