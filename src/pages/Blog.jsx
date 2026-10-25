import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePrefs } from '../prefs'
import { Head, Icon, Md, fmtDate, pick, readMin, useData, useTitle } from '../ui'
import { getPosts } from '../lib/db'

export function PostCard({ p, big }) {
  const { t, lang } = usePrefs()
  return (
    <Link to={`/blog/${p.slug}`} className={'card post' + (big ? ' big' : '')}>
      <div className="cover">
        {p.cover_url ? <img src={p.cover_url} alt="" loading="lazy" /> : <div className="ph">{p.category || 'Blog'}</div>}
        {big && <span className="badge">{t.blog.featured}</span>}
      </div>
      <div className="pbody">
        <div className="meta"><b>{p.category}</b> · {fmtDate(p.created_at, lang)} · {readMin(pick(p, 'body', lang))} {t.blog.min}</div>
        <h3>{pick(p, 'title', lang)}</h3>
        <p>{pick(p, 'excerpt', lang)}</p>
        <div className="tags mono">{(p.tags || []).map((x) => <span key={x}>#{x}</span>)}</div>
        <span className="more">{t.blog.read}</span>
      </div>
    </Link>
  )
}

const PER = 6

export default function Blog() {
  const { t, lang } = usePrefs()
  useTitle(`${t.blog.title} | ${t.name}`)
  const { data, loading, error } = useData(() => getPosts(), [])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [page, setPage] = useState(1)

  const cats = useMemo(() => {
    const m = {}
    ;(data || []).forEach((p) => { if (p.category) m[p.category] = (m[p.category] || 0) + 1 })
    return Object.entries(m)
  }, [data])

  const list = (data || []).filter((p) => {
    if (cat !== 'all' && p.category !== cat) return false
    const hay = [p.title_en, p.title_fa, p.excerpt_en, p.excerpt_fa, p.category, ...(p.tags || [])].join(' ').toLowerCase()
    return hay.includes(q.trim().toLowerCase())
  })
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const cur = Math.min(page, pages)
  const shown = list.slice((cur - 1) * PER, cur * PER)

  return (
    <div className="wrap page">
      <Head label={t.blog.label} title={t.blog.title} sub={t.blog.sub} />
      <label className="search" style={{ marginTop: 28 }}>
        <Icon n="search" />
        <input value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} placeholder={t.blog.search} aria-label={t.blog.search} />
      </label>
      <div className="chips">
        <button className={cat === 'all' ? 'on' : ''} onClick={() => { setCat('all'); setPage(1) }}>{t.blog.all} <em>{(data || []).length}</em></button>
        {cats.map(([c, n]) => (
          <button key={c} className={cat === c ? 'on' : ''} onClick={() => { setCat(c); setPage(1) }}>{c} <em>{n}</em></button>
        ))}
      </div>
      {error && <p className="muted">{t.blog.error}</p>}
      {!loading && !error && <p className="count">{list.length === 0 ? t.blog.empty : t.blog.count(list.length)}</p>}
      <div className="g3">{shown.map((p) => <PostCard key={p.id} p={p} />)}</div>
      {pages > 1 && (
        <div className="pager">
          <button className="ico" disabled={cur === 1} onClick={() => setPage(cur - 1)} aria-label="Previous"><Icon n="left" /></button>
          {Array.from({ length: pages }, (_, i) => (
            <button key={i} className={'ico' + (cur === i + 1 ? ' on' : '')} onClick={() => setPage(i + 1)}>{i + 1}</button>
          ))}
          <button className="ico" disabled={cur === pages} onClick={() => setPage(cur + 1)} aria-label="Next"><Icon n="right" /></button>
        </div>
      )}
    </div>
  )
}

export function Post() {
  const { slug } = useParams()
  const { t, lang } = usePrefs()
  const { data, loading } = useData(() => getPosts(), [])
  const p = (data || []).find((x) => x.slug === slug)
  useTitle(p ? `${pick(p, 'title', lang)} | ${t.name}` : t.name)
  if (loading) return <div className="wrap page"><p className="muted">…</p></div>
  if (!p) return (
    <div className="wrap page">
      <h1>{t.blog.notfound}</h1>
      <Link className="btn" to="/blog">{t.blog.back}</Link>
    </div>
  )
  const body = pick(p, 'body', lang)
  return (
    <article className="wrap page article">
      <Link to="/blog" className="more">{t.blog.back}</Link>
      <div className="meta" style={{ marginTop: 22 }}><b>{p.category}</b> · {fmtDate(p.created_at, lang)} · {readMin(body)} {t.blog.min}</div>
      <h1 className="grad">{pick(p, 'title', lang)}</h1>
      {p.cover_url && <img className="pcover" src={p.cover_url} alt="" />}
      <Md text={body} />
      <div className="tags mono" style={{ marginTop: 32 }}>{(p.tags || []).map((x) => <span key={x}>#{x}</span>)}</div>
    </article>
  )
}
