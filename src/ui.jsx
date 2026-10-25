import { useEffect, useState } from 'react'
import { usePrefs } from './prefs'
import { info } from './data/seed'

const P = {
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  github: <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  ext: <><path d="M15 3h6v6M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
}
export const Icon = ({ n, s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
)

// pick the text of the current language, fall back to the other one
export const pick = (r, k, lang) => r[`${k}_${lang}`] || r[`${k}_en`] || r[`${k}_fa`] || ''
export const fmtDate = (d, lang) => {
  try { return new Date(d).toLocaleDateString(lang === 'fa' ? 'fa-AF-u-ca-persian' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) } catch { return '' }
}
export const readMin = (s) => Math.max(1, Math.round((s || '').split(/\s+/).length / 200))
export const useTitle = (s) => useEffect(() => { document.title = s }, [s])

export function useData(fn, deps = []) {
  const [s, set] = useState({ data: null, loading: true, error: null })
  useEffect(() => {
    let ok = true
    set((x) => ({ ...x, loading: true }))
    fn().then((data) => ok && set({ data, loading: false, error: null })).catch((error) => ok && set({ data: null, loading: false, error }))
    return () => { ok = false }
  }, deps)
  return s
}

export const Head = ({ label, title, sub }) => (
  <>
    <span className="pill">{label}</span>
    <h1 className="grad">{title}</h1>
    {sub && <p className="lead">{sub}</p>}
  </>
)

export function Cta({ title, text }) {
  const { t } = usePrefs()
  return (
    <section className="wrap">
      <div className="cta">
        <h2>{title}</h2>
        <p>{text}</p>
        <a className="btn pri" href={`mailto:${info.email}`}><Icon n="mail" s={16} />{t.home.email}</a>
      </div>
    </section>
  )
}

// tiny Markdown renderer: ## headings, - lists, ``` code, **bold**, `code`. No HTML is injected.
const inline = (s) => s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((p, i) =>
  p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : p.startsWith('`') && p.length > 1 ? <code key={i}>{p.slice(1, -1)}</code> : p)

export function Md({ text = '' }) {
  const out = []
  const L = text.split('\n')
  let i = 0, k = 0
  const block = /^(```|#{1,3} |[-*] )/
  while (i < L.length) {
    const l = L[i]
    if (l.startsWith('```')) {
      const buf = []
      i++
      while (i < L.length && !L[i].startsWith('```')) buf.push(L[i++])
      i++
      out.push(<pre key={k++} dir="ltr"><code>{buf.join('\n')}</code></pre>)
    } else if (/^#{1,3} /.test(l)) {
      out.push(<h3 key={k++}>{inline(l.replace(/^#+ /, ''))}</h3>)
      i++
    } else if (/^[-*] /.test(l)) {
      const it = []
      while (i < L.length && /^[-*] /.test(L[i])) it.push(L[i++].slice(2))
      out.push(<ul key={k++}>{it.map((x, j) => <li key={j}>{inline(x)}</li>)}</ul>)
    } else if (!l.trim()) {
      i++
    } else {
      const p = []
      while (i < L.length && L[i].trim() && !block.test(L[i])) p.push(L[i++])
      out.push(<p key={k++}>{inline(p.join(' '))}</p>)
    }
  }
  return <div className="md">{out}</div>
}
