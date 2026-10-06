// The example settings: theme, palette (the reference colours among them), text direction, the WordPress admin frame,
// the pseudo-locale and exit motion.
// Saved per browser; a query string (?theme=dark&dir=rtl&frame=wp&strings=pseudo&exits=off&palette=indigo) overrides them
// for one page, which the single-example routes and the tests use.
import * as React from "react"

export const SETTINGS = {
  theme: { label: "Theme", options: [["light", "Light"], ["dark", "Dark"], ["system", "System"]] },
  palette: { label: "Palette", options: [["neutral", "Neutral"], ["reference", "Reference colours"], ["indigo", "Indigo"], ["teal", "Teal"]] },
  dir: { label: "Direction", options: [["ltr", "LTR"], ["rtl", "RTL"]] },
  frame: { label: "Frame", options: [["plain", "Plain"], ["wp", "WordPress admin"]] },
  exits: { label: "Motion", options: [["on", "Exits fade"], ["off", "Exits instant"]] },
  strings: { label: "Strings", options: [["english", "English"], ["pseudo", "Pseudo-locale"]] },
} as const

export type SettingKey = keyof typeof SETTINGS
export type Settings = { [K in SettingKey]: (typeof SETTINGS)[K]["options"][number][0] }

export const DEFAULT_SETTINGS: Settings = { theme: "light", palette: "neutral", dir: "ltr", frame: "plain", exits: "on", strings: "english" }
export const STORAGE_KEY = "bui-docs:settings"

const valid = (key: SettingKey, value: unknown) => SETTINGS[key].options.some(([v]) => v === value)

export function readSettings(search: string): { settings: Settings; fromQuery: boolean } {
  let saved: Partial<Settings> = {}
  try {
    saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}")
  } catch {
    /* storage blocked: the defaults apply */
  }
  const query = Object.fromEntries(new URLSearchParams(search)) as Partial<Settings>
  const fromQuery = (Object.keys(SETTINGS) as SettingKey[]).some((key) => key in query)
  const merged = { ...DEFAULT_SETTINGS, ...saved, ...query } as Record<SettingKey, string>
  const settings = Object.fromEntries(
    (Object.keys(SETTINGS) as SettingKey[]).map((key) => [key, valid(key, merged[key]) ? merged[key] : DEFAULT_SETTINGS[key]])
  ) as Settings
  return { settings, fromQuery }
}

/** Applies the settings to <html>, where the theme, the palettes and the exit rules read them. */
export function applySettings(settings: Settings) {
  const html = document.documentElement
  const dark = settings.theme === "dark" || (settings.theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  html.classList.toggle("dark", dark)
  html.style.colorScheme = dark ? "dark" : "light"
  html.dataset.palette = settings.palette
  html.dataset.buiExits = settings.exits
  html.setAttribute("dir", settings.dir)
}

/**
 * The same, inlined in <head> so it runs before the first paint: no flash of the light theme for a reader who chose
 * dark.
 */
export const PREPAINT_SCRIPT = `(function(){try{var s={};try{s=JSON.parse(localStorage.getItem(${JSON.stringify(STORAGE_KEY)})||"{}")}catch(e){}
var q=new URLSearchParams(location.search);["theme","palette","dir","frame","exits","strings"].forEach(function(k){if(q.has(k))s[k]=q.get(k)});
var h=document.documentElement,t=s.theme||"light",d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);
h.classList.toggle("dark",d);h.style.colorScheme=d?"dark":"light";h.dataset.palette=s.palette||"neutral";h.dataset.buiExits=s.exits||"on";
h.setAttribute("dir",s.dir==="rtl"?"rtl":"ltr");
if(s.frame==="wp"&&location.pathname.indexOf("/examples/")===0)h.classList.add("bui-frame-wp")}catch(e){}})()`

interface SettingsContextValue {
  settings: Settings
  update: (patch: Partial<Settings>) => void
}

const SettingsContext = React.createContext<SettingsContextValue>({ settings: DEFAULT_SETTINGS, update: () => {} })

// The settings live outside React: read from storage and the query string once, in the browser, and changed by update().
const store = {
  current: null as Settings | null,
  persist: true,
  listeners: new Set<() => void>(),
  read(): Settings {
    if (!store.current) {
      const { settings, fromQuery } = readSettings(window.location.search)
      store.current = settings
      store.persist = !fromQuery
    }
    return store.current
  },
  write(patch: Partial<Settings>) {
    store.current = { ...store.read(), ...patch }
    if (store.persist) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store.current))
      } catch {
        /* storage blocked: the settings last for this visit */
      }
    }
    store.listeners.forEach((listener) => listener())
  },
  subscribe(listener: () => void) {
    store.listeners.add(listener)
    return () => store.listeners.delete(listener)
  },
}

const serverSettings = () => DEFAULT_SETTINGS

/** Whether these are the reader's settings, not the defaults the hydration render starts from. */
export const isLiveSettings = (settings: Settings) => store.current !== null && settings === store.current

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Hydration renders the defaults, as the pre-rendered HTML did; the saved settings follow at once.
  const settings = React.useSyncExternalStore(store.subscribe, store.read, serverSettings)

  // The stored settings, never the hydration render's defaults: applying those would turn a dark page light for a moment.
  React.useEffect(() => {
    const current = store.read()
    applySettings(current)
    if (current.theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = () => applySettings(store.read())
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [settings])

  const update = React.useCallback((patch: Partial<Settings>) => store.write(patch), [])

  const value = React.useMemo(() => ({ settings, update }), [settings, update])
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export const useSettings = () => React.useContext(SettingsContext)

const DARK_QUERY = "(prefers-color-scheme: dark)"
const subscribeToScheme = (listener: () => void) => {
  const media = window.matchMedia(DARK_QUERY)
  media.addEventListener("change", listener)
  return () => media.removeEventListener("change", listener)
}

/** Whether the page shows dark right now (the theme setting, with "system" resolved). */
export function useIsDark(): boolean {
  const { settings } = useSettings()
  const systemDark = React.useSyncExternalStore(subscribeToScheme, () => window.matchMedia(DARK_QUERY).matches, () => false)
  return settings.theme === "dark" || (settings.theme === "system" && systemDark)
}
