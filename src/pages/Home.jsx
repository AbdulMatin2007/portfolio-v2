import { Link } from 'react-router-dom'
import { usePrefs } from '../prefs'
import { Cta, Icon, useData, useTitle } from '../ui'
import { Socials } from '../Layout'
import { getPosts, getProjects } from '../lib/db'
import { ProjectCard } from './Projects'
import { PostCard } from './Blog'
import { info } from '../data/seed'

export default function Home() {
  const { t } = usePrefs()
  const h = t.home
  useTitle(`${t.name} | ${t.role}`)
  const posts = useData(() => getPosts(), [])
  const projs = useData(() => getProjects(), [])
  const [feat, ...rest] = posts.data || []
  const latest = rest.slice(0, 3)

  return (
    <>
      <section className="wrap hero">
        <div>
          <span className="pill dot">{t.loc}</span>
          <p className="hi">{h.hi}</p>
          <h1 className="grad big">{t.name}</h1>
          <p className="role mono">{t.role}</p>
          <p className="muted lead">{t.tagline}</p>
          <div className="btns">
            <Link className="btn pri" to="/projects">{h.view} →</Link>
            <a className="btn" href={`mailto:${info.email}`}><Icon n="mail" s={16} /> {h.email}</a>
          </div>
          <div style={{ marginTop: 22 }}><Socials /></div>
        </div>
        <div className="frame">
          <img src="/images/profile.webp" alt={t.photoAlt} />
          <span className="chip c1">React</span>
          <span className="chip c2">JavaScript</span>
          <span className="chip c3">CSS</span>
        </div>
      </section>

      <section className="wrap g3">
        {h.hl.map(([k, title, text]) => (
          <div key={k} className="card hl"><small>{k}</small><h3>{title}</h3><p className="muted">{text}</p></div>
        ))}
      </section>

      <section className="wrap block">
        <div className="rowhead">
          <div><h2 className="h2">{h.projects}</h2><p className="muted">{h.projectsSub}</p></div>
          <Link className="more" to="/projects">{h.allProjects}</Link>
        </div>
        <div className="g3">{(projs.data || []).slice(0, 3).map((p) => <ProjectCard key={p.id} p={p} compact />)}</div>
      </section>

      {feat && (
        <section className="wrap block">
          <span className="pill">{h.featured}</span>
          <div style={{ marginTop: 18 }}><PostCard p={feat} big /></div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="wrap block">
          <div className="rowhead">
            <div><h2 className="h2">{h.latest}</h2><p className="muted">{h.latestSub}</p></div>
            <Link className="more" to="/blog">{h.all}</Link>
          </div>
          <div className="g3">{latest.map((p) => <PostCard key={p.id} p={p} />)}</div>
        </section>
      )}

      <Cta title={h.cta} text={h.ctaText} />
    </>
  )
}
