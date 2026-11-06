import { codePaths, context, flow, gates, graphify, quality, REPO, toolchain } from './workflow/data'
import './workflow/workflow.css'

// Every number comes from workflow/data.js, which cites the plan file it was measured in.
// Divs, not <section>: index.css gives bare sections a home-page margin and heading width.

const fmt = (n) => n.toLocaleString('en-US')
const pct = (value, max) => `${(value / max) * 100}%`

const OUTCOME = {
  refused: 'Refused',
  fixed: 'Fixed',
  blocked: 'Blocked',
  limit: 'Known limit'
}

// For results that are honestly near zero: framed as expected, not dressed up as a win
const Callout = ({ value, title, children }) => (
  <div className='wf-callout'>
    <p className='wf-callout__label mono'>Measured · expected at this size</p>
    <p className='wf-callout__title'><strong>{value}</strong> {title}</p>
    {children}
  </div>
)

const Bar = ({ value, max, label, shown, tone }) => (
  <div className='wf-bar'>
    <span className='wf-bar__label'>{label}</span>
    <span className='wf-bar__track' aria-hidden='true'>
      <span className={`wf-bar__fill wf-bar__fill--${tone}`} style={{ '--w': pct(value, max) }} />
    </span>
    <span className='wf-bar__value mono'>{shown}</span>
  </div>
)

const HowIBuildWithAiAgents = () => {
  const graphMax = 60000
  return (
    <div className='wf'>
      <div className='wf-section'>
        <h2>Why this much tooling</h2>
        <p>
          A static site doesn’t need checkpointed plans, commit hooks or security skills. This is
          more than the site needs, on purpose. It’s a public slice of how I work on MyAutoTab, the
          SaaS I’m building to production standards, where these tools carry real weight. Here
          they’re small enough to read in one sitting.
        </p>
        <p>
          The worked example is Claude Code, but the pattern works with any agentic coding tool:
          write down what done looks like, gate every step, and measure instead of claim. Some of
          the results below are close to zero. They’re here anyway, because a measured null result
          tells you more than a quoted number from someone else’s repo.
        </p>
      </div>

      <div className='wf-section'>
        <h2>How I build</h2>
        <ol className='wf-flow'>
          {flow.map(({ step, detail }, i) => (
            <li key={step} className='wf-flow__step'>
              <span className='wf-flow__num mono' aria-hidden='true'>{String(i + 1).padStart(2, '0')}</span>
              <span className='wf-flow__name'>{step}</span>
              <span className='wf-flow__detail'>{detail}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className='wf-section'>
        <h2>Context: a lean CLAUDE.md</h2>
        <p>
          Every session loads <code>CLAUDE.md</code> before doing anything. I split mine into a lean
          root file and three folder files that load only when the agent works in that folder.
        </p>
        <figure className='wf-figure'>
          <div className='wf-bars'>
            <Bar value={context.before.value} max={context.before.value} label={context.before.label} shown={`${context.before.value}k tokens`} tone='muted' />
            <Bar value={context.after.value} max={context.before.value} label={context.after.label} shown={`${context.after.value}k tokens`} tone='primary' />
          </div>
          <figcaption>
            Tokens loaded every session: {context.before.value}k before the split, {context.after.value}k
            after (<strong>{context.saving.value}</strong>).
          </figcaption>
        </figure>
        <table className='wf-table'>
          <caption className='visually-hidden'>Folder CLAUDE.md files and what they hold</caption>
          <thead>
            <tr><th scope='col'>Loads only in its folder</th><th scope='col'>Holds</th></tr>
          </thead>
          <tbody>
            {context.nested.map(({ file, holds }) => (
              <tr key={file}><td><code>{file}</code></td><td>{holds}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='wf-section'>
        <h2>Gates: hooks enforce, skills judge</h2>
        <p>
          A skill is instructions an agent can skip. A hook that exits non-zero blocks the commit
          unless something gets around it. So the checks a script can decide (secrets, unsafe code,
          the build, tests, the dependency audit) run as hooks on every commit, and skills cover the
          judgment calls. Then I tested the hooks against bypass attempts.
        </p>
        <div className='wf-stats'>
          <div className='wf-stat'>
            <p className='wf-stat__value mono'>{gates.testsBefore.value} → {gates.testsAfter.value}</p>
            <p className='wf-stat__label'>tests on the security tooling itself</p>
          </div>
        </div>
        <table className='wf-table wf-matrix'>
          <caption>Bypass attempts from the test matrix, plus the known limit</caption>
          <thead>
            <tr><th scope='col'>Attempt</th><th scope='col'>Result</th></tr>
          </thead>
          <tbody>
            {gates.matrix.map(({ attempt, outcome, result }) => (
              <tr key={attempt}>
                <td><code>{attempt}</code></td>
                <td>
                  <span className={`wf-outcome wf-outcome--${outcome} mono`}>{OUTCOME[outcome]}</span>
                  <span className='wf-outcome__text'>{result}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className='wf-note'>
          Two of these were found in testing and fixed. I accepted the nested shell as a limit for a
          local demo: a production gate would run server-side, where the agent can’t reach it.
        </p>
      </div>

      <div className='wf-section'>
        <h2>Quality: dedupe, measured</h2>
        <p>
          The dedupe skill sweeps the whole repo for duplication and reports a table. I approve rows
          one by one, and it proves each change with gzipped bundle sizes and screenshots.
        </p>
        <div className='wf-stats'>
          {[['JavaScript', quality.js], ['CSS', quality.css]].map(([name, m]) => (
            <div className='wf-stat' key={name}>
              <p className='wf-stat__value mono'>{m.before} → {m.after}</p>
              <p className='wf-stat__label'>{name}, {m.unit}</p>
            </div>
          ))}
          <div className='wf-stat'>
            <p className='wf-stat__value mono'>{quality.unusedAssets.value}</p>
            <p className='wf-stat__label'>of unused images deleted from the repo</p>
          </div>
        </div>
        <Callout value={quality.net.value} title='net. The bundle didn’t grow.'>
          <p>
            The site was already small, so the win is a cleaner codebase, not a smaller bundle.
            Screenshots of the sections the dedupe touched were {quality.visualDiff.value}, apart
            from the autoplaying carousel. The one visible change, a shared tag style, was on purpose.
          </p>
        </Callout>
      </div>

      <div className='wf-section'>
        <h2>graphify: a code graph, measured</h2>
        <p>
          graphify builds a knowledge graph of the code so an agent can query structure instead of
          reading files. I asked the same three questions with and without it, each in a fresh
          subagent, and checked every answer against a key written beforehand.
        </p>
        <figure className='wf-figure'>
          <div className='wf-legend mono' aria-hidden='true'>
            <span><span className='wf-swatch wf-swatch--muted' /> Without the graph</span>
            <span><span className='wf-swatch wf-swatch--primary' /> With the graph</span>
          </div>
          <div className='wf-groups' aria-hidden='true'>
            {graphify.questions.map((q) => (
              <div className='wf-group' key={q.id}>
                <p className='wf-group__title'>{q.text}</p>
                <Bar value={q.without} max={graphMax} label='Without' shown={fmt(q.without)} tone='muted' />
                <Bar value={q.with} max={graphMax} label='With' shown={`${fmt(q.with)} (${q.delta})`} tone='primary' />
              </div>
            ))}
          </div>
          {/* The hidden class goes on a wrapper: a <table> ignores width and overflow, so on its
              own it stretched a 390px phone to 608px */}
          <div className='visually-hidden'>
          <table>
            <caption>Tokens per question, without and with the graph</caption>
            <thead>
              <tr><th scope='col'>Question</th><th scope='col'>Without</th><th scope='col'>With</th><th scope='col'>Change</th></tr>
            </thead>
            <tbody>
              {graphify.questions.map((q) => (
                <tr key={q.id}><th scope='row'>{q.text}</th><td>{fmt(q.without)}</td><td>{fmt(q.with)}</td><td>{q.delta}</td></tr>
              ))}
              <tr><th scope='row'>Total</th><td>{fmt(graphify.total.without)}</td><td>{fmt(graphify.total.with)}</td><td>{graphify.total.delta}</td></tr>
            </tbody>
          </table>
          </div>
          <figcaption>
            Total tokens over the three questions: {fmt(graphify.total.without)} without the graph,{' '}
            {fmt(graphify.total.with)} with it. Every answer was correct both ways. One run per
            cell, so it’s a small sample.
          </figcaption>
        </figure>
        <Callout value={graphify.total.delta} title='tokens: no real saving on this repo.'>
          <p>
            Most of each run is fixed session overhead, and on a repo this size grep already finds the
            right file in 1–2 calls. A graph pays off on large codebases with agents working across
            them. I wouldn’t normally put one on a site this small. It’s here to show the install,
            my review of the hooks it adds, and an honest measurement.
          </p>
        </Callout>
      </div>

      <div className='wf-section'>
        <h2>What the toolchain did</h2>
        <div className='wf-aside'>
          <p className='wf-stat__value mono'>{toolchain.auditBefore.value} → {toolchain.auditAfter.value}</p>
          <p>
            npm audit advisories. That came from moving off Create React App to Vite, React 19 and
            React Router 7, not from this workflow, so I keep it separate. What the workflow adds is
            that every commit now runs the audit and blocks on a high or critical advisory.
          </p>
        </div>
      </div>

      <div className='wf-section'>
        <h2>See the code</h2>
        <p>All of it lives in the site’s <a href={REPO} target='_blank' rel='noreferrer'>public repo</a>:</p>
        <ul className='wf-paths'>
          {codePaths.map(({ path, holds, url }) => (
            <li key={path}>
              <a href={url} target='_blank' rel='noreferrer'><code>{path}</code></a> <span>{holds}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HowIBuildWithAiAgents
