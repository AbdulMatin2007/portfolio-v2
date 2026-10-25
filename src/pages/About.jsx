import { usePrefs } from '../prefs'
import { Head, Cta, useTitle } from '../ui'
import { Socials } from '../Layout'

export default function About() {
  const { t } = usePrefs()
  const a = t.about
  useTitle(`${a.label} | ${t.name}`)
  return (
    <>
      <div className="wrap page">
        <Head label={a.label} title={a.title} sub={a.sub} />
        <div className="prof">
          <div className="frame sm"><img src="/images/profile.webp" alt={t.photoAlt} /></div>
          <div className="card pad">
            <h2>{t.name}</h2>
            <p className="role mono">{t.role}</p>
            <p className="muted">{a.bio}</p>
            <dl>{a.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
            <Socials />
          </div>
        </div>

        <h2 className="h2">{a.journey}</h2>
        <p className="muted">{a.journeySub}</p>
        <div className="tl">
          {a.steps.map(([h, p]) => <div key={h} className="card"><h4>{h}</h4><p>{p}</p></div>)}
        </div>

        <h2 className="h2">{a.goals}</h2>
        <p className="muted">{a.goalsSub}</p>
        <div className="g3">
          {a.goalItems.map(([h, p]) => <div key={h} className="card pad goal"><h4>{h}</h4><p className="muted">{p}</p></div>)}
        </div>
      </div>
      <Cta title={a.cta} text={a.ctaText} />
    </>
  )
}
