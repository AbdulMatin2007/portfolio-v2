import { createContext, useContext, useEffect, useState } from 'react'
import { T } from './text'

const Ctx = createContext()
const load = (k, f) => { try { return localStorage.getItem(k) || f } catch { return f } }
const save = (k, v) => { try { localStorage.setItem(k, v) } catch {} }

// language + theme live here, every component reads them with usePrefs()
export function Prefs({ children }) {
  const [lang, setLang] = useState(load('lang', 'en'))
  const [theme, setTheme] = useState(load('theme', 'dark'))
  useEffect(() => {
    const d = document.documentElement
    d.lang = lang
    d.dir = lang === 'fa' ? 'rtl' : 'ltr'
    save('lang', lang)
  }, [lang])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    save('theme', theme)
  }, [theme])
  return <Ctx.Provider value={{ lang, setLang, theme, setTheme, t: T[lang] }}>{children}</Ctx.Provider>
}
export const usePrefs = () => useContext(Ctx)
