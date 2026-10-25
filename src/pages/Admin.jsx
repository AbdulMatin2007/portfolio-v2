import { useEffect, useState } from 'react'
import { sb, cmsOn, getPosts, getProjects, saveRow, delRow, uploadImage } from '../lib/db'
import { useTitle } from '../ui'

const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// field = [key, label, type, rows]   types: text (default), area, csv, lines, image, check, num
const CFG = {
  posts: {
    label: 'Articles', load: () => getPosts(true), name: (r) => r.title_en || r.title_fa || r.slug, blank: { published: true },
    fields: [
      ['title_en', 'Title (English)'], ['title_fa', 'Title (Persian)'],
      ['slug', 'URL slug (English letters, leave empty to auto-create)'], ['category', 'Category (for example React)'],
      ['tags', 'Tags (comma separated)', 'csv'], ['cover_url', 'Cover image', 'image'],
      ['excerpt_en', 'Short summary (English)', 'area', 3], ['excerpt_fa', 'Short summary (Persian)', 'area', 3],
      ['body_en', 'Article (English), Markdown: ## heading, - list, **bold**', 'area', 14],
      ['body_fa', 'Article (Persian), Markdown', 'area', 14], ['published', 'Published (untick to keep as draft)', 'check'],
    ],
  },
  projects: {
    label: 'Projects', load: () => getProjects(true), name: (r) => r.title, blank: { sort_order: 0 },
    fields: [
      ['title', 'Project name'], ['image_url', 'Screenshot', 'image'], ['live_url', 'Live demo link'],
      ['code_url', 'Source code link (GitHub)'], ['tech', 'Technologies (comma separated)', 'csv'],
      ['desc_en', 'Description (English)', 'area', 4], ['desc_fa', 'Description (Persian)', 'area', 4],
      ['features_en', 'Features (English), one per line', 'lines'], ['features_fa', 'Features (Persian), one per line', 'lines'],
      ['sort_order', 'Order (small number shows first)', 'num'],
    ],
  },
}

const toDraft = (row, fields) => {
  const d = {}
  fields.forEach(([k, , type]) => {
    const v = row[k]
    d[k] = type === 'csv' ? (v || []).join(', ') : type === 'lines' ? (v || []).join('\n') : type === 'check' ? !!v : v ?? ''
  })
  return d
}
const fromDraft = (d, fields) => {
  const o = {}
  fields.forEach(([k, , type]) => {
    const v = d[k]
    o[k] = type === 'csv' ? v.split(',').map((x) => x.trim()).filter(Boolean)
      : type === 'lines' ? v.split('\n').map((x) => x.trim()).filter(Boolean)
      : type === 'num' ? Number(v) || 0 : v
  })
  return o
}

function Editor({ table, row, onDone }) {
  const c = CFG[table]
  const [d, setD] = useState(() => toDraft(row, c.fields))
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }))

  const up = async (k, file) => {
    if (!file) return
    setMsg('Uploading image...')
    try { set(k, await uploadImage(file)); setMsg('') } catch (e) { setMsg(e.message) }
  }
  const save = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      const out = fromDraft(d, c.fields)
      if (table === 'posts' && !out.slug) out.slug = slugify(out.title_en || '') || 'post-' + Date.now()
      await saveRow(table, { ...out, id: row.id })
      onDone(true)
    } catch (err) { setMsg(err.message) }
    setBusy(false)
  }

  return (
    <form className="card form" onSubmit={save}>
      <h3>{row.id ? 'Edit' : 'New'} · {c.label}</h3>
      {c.fields.map(([k, label, type, rows]) => (
        <div className="f" key={k}>
          {type === 'check' ? (
            <label><input type="checkbox" checked={d[k]} onChange={(e) => set(k, e.target.checked)} /> {label}</label>
          ) : (
            <>
              <label htmlFor={k}>{label}</label>
              {type === 'area' || type === 'lines' ? (
                <textarea id={k} rows={rows || 5} value={d[k]} onChange={(e) => set(k, e.target.value)} />
              ) : (
                <input id={k} type={type === 'num' ? 'number' : 'text'} value={d[k]} onChange={(e) => set(k, e.target.value)} dir={['slug', 'tags', 'tech', 'cover_url', 'image_url', 'live_url', 'code_url'].includes(k) ? 'ltr' : undefined} />
              )}
              {type === 'image' && (
                <div className="imgrow">
                  <input type="file" accept="image/*" onChange={(e) => up(k, e.target.files[0])} />
                  {d[k] && <img src={d[k]} alt="" />}
                </div>
              )}
            </>
          )}
        </div>
      ))}
      {msg && <p className="err">{msg}</p>}
      <div className="btns">
        <button className="btn pri" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        <button type="button" className="btn" onClick={() => onDone(false)}>Cancel</button>
      </div>
    </form>
  )
}

function Dashboard() {
  const [tab, setTab] = useState('posts')
  const [rows, setRows] = useState(null)
  const [edit, setEdit] = useState(null)
  const [err, setErr] = useState('')
  const load = () => { setRows(null); setErr(''); CFG[tab].load().then(setRows).catch((e) => { setRows([]); setErr(e.message) }) }
  useEffect(() => { setEdit(null); load() }, [tab])

  const del = async (r) => {
    if (!window.confirm('Delete "' + CFG[tab].name(r) + '"? This cannot be undone.')) return
    try { await delRow(tab, r.id); load() } catch (e) { setErr(e.message) }
  }
  if (edit) return <Editor table={tab} row={edit} onDone={(ok) => { setEdit(null); if (ok) load() }} />

  return (
    <>
      <div className="chips">
        {Object.entries(CFG).map(([k, v]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{v.label}</button>)}
        <button className="btn pri" style={{ marginInlineStart: 'auto' }} onClick={() => setEdit({ ...CFG[tab].blank })}>+ New</button>
      </div>
      {err && <p className="err">{err} (did you run supabase.sql?)</p>}
      {rows === null && <p className="muted">Loading...</p>}
      {rows && rows.length === 0 && !err && <p className="muted">Nothing here yet. Click “+ New”.</p>}
      <div className="alist">
        {(rows || []).map((r) => (
          <div key={r.id} className="card arow">
            <div><b>{CFG[tab].name(r)}</b>{tab === 'posts' && !r.published && <span className="lvl l1" style={{ marginInlineStart: 10 }}>Draft</span>}</div>
            <div className="btns">
              <button className="btn" onClick={() => setEdit(r)}>Edit</button>
              <button className="btn" onClick={() => del(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Login() {
  const [f, setF] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const go = async (e) => {
    e.preventDefault()
    const { error } = await sb.auth.signInWithPassword(f)
    if (error) setMsg(error.message)
  }
  return (
    <form className="card form" onSubmit={go} style={{ maxWidth: 440 }}>
      <h3>Sign in</h3>
      <div className="f"><label htmlFor="em">Email</label><input id="em" type="email" dir="ltr" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
      <div className="f"><label htmlFor="pw">Password</label><input id="pw" type="password" dir="ltr" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></div>
      {msg && <p className="err">{msg}</p>}
      <div><button className="btn pri">Sign in</button></div>
    </form>
  )
}

export default function Admin() {
  useTitle('Admin')
  const [s, setS] = useState(undefined)
  useEffect(() => {
    if (!sb) return
    sb.auth.getSession().then(({ data }) => setS(data.session))
    const { data } = sb.auth.onAuthStateChange((_e, x) => setS(x))
    return () => data.subscription.unsubscribe()
  }, [])

  return (
    <div className="wrap page admin" dir="ltr">
      <span className="pill">Admin</span>
      <h1 className="grad">Content manager</h1>
      {!cmsOn && (
        <p className="muted">
          The CMS is not connected yet. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> (see README), then reload this page.
        </p>
      )}
      {cmsOn && s === undefined && <p className="muted">Loading...</p>}
      {cmsOn && s === null && <Login />}
      {cmsOn && s && (
        <>
          <p className="muted">Signed in as {s.user.email} · <button className="linkbtn" onClick={() => sb.auth.signOut()}>Sign out</button></p>
          <Dashboard />
        </>
      )}
    </div>
  )
}
