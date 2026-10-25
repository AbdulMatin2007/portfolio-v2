import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { usePrefs } from './prefs'
import { Icon } from './ui'
import { info } from './data/seed'

const keys = ['home', 'projects', 'skills', 'about', 'blog', 'contact']
const path = (k) => (k === 'home' ? '/' : '/' + k)

function Logo() {
  const { t } = usePrefs()
  return (
    <Link to="/" className="logo">
      <i>AM</i>
      <b>{t.brand}<span>.dev</span></b>
    </Link>
  )
}

export function Socials() {
  return (
    <div className="socials">
      <a className="ico" href={info.github} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon n="github" /></a>
      <a className="ico" href={`mailto:${info.email}`} aria-label="Email"><Icon n="mail" /></a>
    </div>
  )
}

export default function Layout() {
  const { t, lang, setLang, theme, setTheme } = usePrefs()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [loc.pathname])

  return (
    <>
      <a className="skip" href="#main">{t.skip}</a>
      <header className="nav">
        <div className="wrap">
          <Logo />
          <nav className={'links' + (open ? ' open' : '')} aria-label="Main">
            {keys.map((k) => (
              <NavLink key={k} to={path(k)} end={k === 'home'} className={({ isActive }) => (isActive ? 'active' : '')}>{t.nav[k]}</NavLink>
            ))}
          </nav>
          <div className="tools">
            <button className="ico" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
              <Icon n={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <div className="seg" role="group" aria-label="Language">
              {['en', 'fa'].map((l) => (
                <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button className="ico burger" onClick={() => setOpen(!open)} aria-label="Menu"><Icon n={open ? 'x' : 'menu'} /></button>
          </div>
        </div>
      </header>

      <main id="main"><Outlet /></main>

      <footer className="foot">
        <div className="wrap">
          <div className="fgrid">
            <div>
              <Logo />
              <p className="muted">{t.footer.tagline}</p>
            </div>
            <div>
              <h5>{t.footer.explore}</h5>
              <div className="flinks">{keys.map((k) => <Link key={k} to={path(k)}>{t.nav[k]}</Link>)}</div>
            </div>
            <div>
              <h5>{t.footer.connect}</h5>
              <Socials />
            </div>
          </div>
          <div className="fbot">
            <span>© {new Date().getFullYear()} {t.name}. {t.footer.rights}</span>
            <span>{t.footer.built} · <Link to="/admin">Admin</Link></span>
          </div>
        </div>
      </footer>
    </>
  )
}
