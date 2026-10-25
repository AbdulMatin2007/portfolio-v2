import { usePrefs } from '../prefs'
import { Head, Cta, Icon, pick, useData, useTitle } from '../ui'
import { getProjects } from '../lib/db'

export function ProjectCard({ p, compact }) {
  const { t, lang } = usePrefs()
  const list = (Array.isArray(p[`features_${lang}`]) && p[`features_${lang}`].length ? p[`features_${lang}`] : p.features_en) || []
  return (
    <article className="card proj">
      {p.image_url && <img src={p.image_url} alt={p.title} loading="lazy" />}
      <div className="pb">
        <h3>{p.title}</h3>
        <p className="muted">{pick(p, 'desc', lang)}</p>
        {!compact && list.length > 0 && (
          <div className="feat">
            <h4>{t.projects.features}</h4>
            <ul>{list.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
        )}
        {(p.tech || []).length > 0 && <div className="tags mono">{p.tech.map((x) => <span key={x}>{x}</span>)}</div>}
        <div className="btns">
          {p.live_url && <a className="btn pri" href={p.live_url} target="_blank" rel="noreferrer">{t.projects.live} <Icon n="ext" s={15} /></a>}
          {p.code_url && <a className="btn" href={p.code_url} target="_blank" rel="noreferrer"><Icon n="github" s={15} /> {t.projects.code}</a>}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { t } = usePrefs()
  useTitle(`${t.projects.title} | ${t.name}`)
  const { data, loading } = useData(() => getProjects(), [])
  const list = data || []
  return (
    <>
      <div className="wrap page">
        <Head label={t.projects.label} title={t.projects.title} sub={t.projects.sub} />
        {!loading && <p className="count">{t.projects.count(list.length)}</p>}
        <div className="g2">{list.map((p) => <ProjectCard key={p.id} p={p} />)}</div>
      </div>
      <Cta title={t.projects.cta} text={t.projects.ctaText} />
    </>
  )
}
