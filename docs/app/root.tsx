import * as React from "react"
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration, useNavigation, useRouteError, type LinksFunction } from "react-router"
import { Progress } from "@booleanpress/ui/progress"
import { BooleanUIProvider } from "@booleanpress/ui/provider"
// A plain import, so React Router links the client build's stylesheet in both the pre-rendered HTML and the browser.
import "./docs.css"
import { SITE } from "./content/site.ts"
import { isLiveSettings, PREPAINT_SCRIPT, SettingsProvider, useSettings } from "./lib/settings.tsx"
import { PSEUDO_STRINGS } from "./lib/pseudo.ts"

export const links: LinksFunction = () => [{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" }]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_SCRIPT }} />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function UiRoot({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings()
  // Marks the page ready once it has hydrated with the reader's settings (theme, direction, palette), so the browser
  // tests never catch the pre-rendered defaults or a component before its first effects.
  React.useEffect(() => {
    if (isLiveSettings(settings)) document.documentElement.dataset.ready = ""
  }, [settings])
  return (
    <BooleanUIProvider strings={settings.strings === "pseudo" ? PSEUDO_STRINGS : undefined} dir={settings.dir} locale="en-US" sidebarStorageKey="bui-docs:sidebar">
      {children}
    </BooleanUIProvider>
  )
}

/** A thin bar along the top of the window while the next page loads, so a click never looks ignored. */
function PageLoading() {
  const loading = useNavigation().state === "loading"
  return loading ? <Progress aria-label="Loading the page" className="fixed inset-x-0 top-0 z-[100] h-0.5 rounded-none bg-transparent" /> : null
}

export default function App() {
  return (
    <SettingsProvider>
      <UiRoot>
        <PageLoading />
        <Outlet />
      </UiRoot>
    </SettingsProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : "Something went wrong"
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-3 p-6">
      <h1 className="text-xl font-semibold">{message}</h1>
      <p className="text-muted-foreground">
        <a className="underline underline-offset-4" href="/">
          Back to the documentation
        </a>
      </p>
    </main>
  )
}
