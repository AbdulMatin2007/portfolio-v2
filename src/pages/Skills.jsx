import { usePrefs } from '../prefs'
import { Head, Cta, useTitle } from '../ui'
import { skillGroups, otherSkills, spokenLangs } from '../data/seed'

export default function Skills() {
  const { t, lang } = usePrefs()
  const s = t.skills
  useTitle(`${s.title} | ${t.name}`)
  return (
    <>
      <div className="wrap page">
        <Head label={s.label} title={s.title} sub={s.sub} />
        {skillGroups.map((g) => (
          <section key={g.key}>
            <div className="sub">{s.groups[g.key]}</div>
            <div className="g4">
              {g.items.map((it) => (
                <div key={it.n} className={`card skill l${it.l}`}>
                  <header><h3>{it.n}</h3><span className="lvl">{s.levels[it.l - 1]}</span></header>
                  <p className="muted">{it.d[lang]}</p>
                  <div className="bars">{[1, 2, 3].map((n) => <i key={n} className={n <= it.l ? 'on' : ''} />)}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="sub">{s.other}</div>
        <div className="chips2">{otherSkills.map((o) => <span key={o.en}>{o[lang]}</span>)}</div>
        <div className="sub">{s.spoken}</div>
        <div className="chips2">{spokenLangs.map((o) => <span key={o.en}>{o[lang]}</span>)}</div>
      </div>
      <Cta title={s.cta} text={s.ctaText} />
    </>
  )
}
