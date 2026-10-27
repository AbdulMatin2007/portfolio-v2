import { useState } from 'react'
import { usePrefs } from '../prefs'
import { Head, Icon, useTitle } from '../ui'
import { Socials } from '../Layout'
import { info } from '../data/seed'

export default function Contact() {
  const { t } = usePrefs()
  const c = t.contact
  useTitle(`${c.title} | ${t.name}`)
  const [f, setF] = useState({ name: '', email: '', subject: '', message: '' })
  const [err, setErr] = useState({})
  const [st, setSt] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = c.eName
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = c.eEmail
    if (!f.subject.trim()) er.subject = c.eSubject
    if (f.message.trim().length < 10) er.message = c.eMsg
    setErr(er)
    if (Object.keys(er).length) return
    const key = import.meta.env.VITE_WEB3FORMS_KEY
    if (!key) return setSt('nokey')   // never fake success
    setSt('sending')
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: key, ...f }),
      })
      const j = await r.json()
      if (j.success) { setSt('ok'); setF({ name: '', email: '', subject: '', message: '' }) } else setSt('fail')
    } catch { setSt('fail') }
  }

  const field = (k, label, ph, type = 'text') => (
    <div className="f">
      <label htmlFor={k}>{label} <b>*</b></label>
      <input id={k} type={type} value={f[k]} onChange={set(k)} placeholder={ph} dir={k === 'email' ? 'ltr' : undefined} />
      {err[k] && <div className="err">{err[k]}</div>}
    </div>
  )

  return (
    <div className="wrap page">
      <Head label={c.label} title={c.title} sub={c.sub} />
      <div className="cgrid">
        <form className="card form" onSubmit={submit} noValidate>
          <h3>{c.send}</h3>
          <div className="two">{field('name', c.name, c.namePh)}{field('email', c.email, 'you@example.com', 'email')}</div>
          {field('subject', c.subject, c.subjectPh)}
          <div className="f">
            <label htmlFor="message">{c.message} <b>*</b></label>
            <textarea id="message" rows="7" maxLength={1000} value={f.message} onChange={set('message')} placeholder={c.messagePh} />
            <div className="counter">{f.message.length} / 1,000</div>
            {err.message && <div className="err">{err.message}</div>}
          </div>
          <div>
            <button className="btn pri" disabled={st === 'sending'}>{st === 'sending' ? c.sending : c.btn}</button>
            {st === 'ok' && <p className="ok" role="status">{c.ok}</p>}
            {st === 'fail' && <p className="err" role="alert">{c.fail}</p>}
            {st === 'nokey' && <p className="err" role="alert">{c.nokey}</p>}
          </div>
        </form>
        <aside className="card form">
          <h3>{c.other}</h3>
          <div><a className="btn pri" href={`mailto:${info.email}`}><Icon n="mail" s={16} /> {c.sendEmail}</a></div>
          <hr />
          <div><small className="cap">{c.location}</small><p>{t.loc}</p></div>
          <hr />
          <div><small className="cap">{c.phone}</small><p dir="ltr" style={{ textAlign: 'start' }}>{info.phone}</p></div>
          <div><small className="cap">Email</small><p dir="ltr" style={{ textAlign: 'start' }}>matintavakoli786@gmail.com</p></div>
          <hr />
          <div><small className="cap">{t.name}</small><Socials /></div>
        </aside>
      </div>
    </div>
  )
}
