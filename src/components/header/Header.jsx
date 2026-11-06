import CTA from './CTA'
import ME from '../../assets/Marc Bastien Professional Portrait.webp'
import HeaderSocials from './HeaderSocials'
import CountUp from './CountUp'
import './header.css'

const metrics = [
  { value: 6, suffix: '+', unit: 'yrs', label: 'supporting production systems' },
  { value: 3000, suffix: '+', label: 'devices managed' },
  { text: 'week → day', label: 'feature delivery with Claude Code' }
]

// Landing hero: value proposition + proof metrics on the left, portrait on the right
const Header = () => {
  return (
    <header id='home'>
      <div className="header__glow" aria-hidden="true" />
      <div className="container header__container">
        <div className="header__intro">
          <p className="header__eyebrow mono">Cloud, DevOps &amp; AI Engineer · DC/MD · Clearance-eligible</p>
          <h1 className="header__headline">
            I build production systems <span>— and the AI workflows that ship them.</span>
          </h1>
          <p className="header__lede">
            I'm Marc Bastien. Six years keeping enterprise systems running on AWS and Azure; now building MyAutoTab end to end with a test-driven, agentic workflow.
          </p>

          <CTA/>

          <ul className="header__metrics">
            {metrics.map(({ value, suffix, unit, text, label }) => (
              <li key={label}>
                <span className="header__metric-value mono">
                  {text || <><CountUp end={value} />{suffix}{unit && <small> {unit}</small>}</>}
                </span>
                <span className="header__metric-label">{label}</span>
              </li>
            ))}
          </ul>

          <HeaderSocials/>
        </div>

        <div className="header__portrait">
          <img src={ME} alt="Marc Bastien, professional portrait" />
        </div>
      </div>
    </header>
  )
}

export default Header
