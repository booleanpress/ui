import * as React from "react"
import { Link, useLocation } from "react-router"
import { MenuIcon, MoonIcon, SunIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@booleanpress/ui/sheet"
import { cn } from "@booleanpress/ui/utils"
import { components, componentHref } from "~/content/registry.ts"
import { SITE } from "~/content/site.ts"
import { useIsDark, useSettings } from "~/lib/settings.tsx"
import { GitHubIcon, LogoMark } from "./icons.tsx"
import { Nav } from "./Nav.tsx"
import { Search } from "./Search.tsx"
import { SettingsMenu } from "./SettingsMenu.tsx"
import { headerIconButton } from "./styles.ts"

function ThemeToggle() {
  const { update } = useSettings()
  const dark = useIsDark()
  return (
    <Button
      variant="ghost"
      className={headerIconButton}
      aria-label={dark ? "Switch to the light theme" : "Switch to the dark theme"}
      onClick={() => update({ theme: dark ? "light" : "dark" })}
    >
      {dark ? <MoonIcon /> : <SunIcon />}
    </Button>
  )
}

function MobileNav() {
  const [open, setOpen] = React.useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className={cn(headerIconButton, "lg:hidden")} aria-label="Open the component list">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{SITE.name}</SheetTitle>
          <SheetDescription className="sr-only">Guides and components</SheetDescription>
        </SheetHeader>
        <Nav className="px-3 pb-6" onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

/** The two sections, as pills: the current one filled in the primary colour. */
const pill = (active: boolean) =>
  cn(
    "flex h-7 items-center rounded-full px-3 text-sm font-semibold outline-none transition-colors focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring md:h-6 md:px-2.5",
    active ? "bg-primary text-primary-foreground" : "text-secondary-foreground hover:text-[var(--docs-heading)]"
  )

export function Header({ version }: { version: string }) {
  const { pathname } = useLocation()
  const inComponents = pathname.startsWith("/components/")
  return (
    <header className="sticky top-0 z-40 border-b bg-[var(--docs-ground)]/90 backdrop-blur supports-[backdrop-filter]:bg-[var(--docs-ground)]/75">
      <div className="relative mx-auto flex h-14 max-w-[108rem] items-center gap-2 px-4 xl:px-14">
        <MobileNav />
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-md text-lg font-medium tracking-tight text-[var(--docs-heading)] outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <LogoMark className="size-6" />
          <span>{SITE.name}</span>
        </Link>
        <Badge variant="secondary" className="hidden sm:inline-flex">
          {version}
        </Badge>
        {/* A build of any branch but main (Cloudflare Workers Builds' preview deployments). */}
        {import.meta.env.VITE_BUI_PREVIEW === "1" ? <Badge variant="warning">Preview</Badge> : null}
        <nav aria-label="Sections" className="absolute start-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex rtl:translate-x-1/2">
          <Link to="/docs/introduction" className={pill(pathname.startsWith("/docs/"))} aria-current={pathname.startsWith("/docs/") ? "page" : undefined}>
            Docs
          </Link>
          <Link to={componentHref(components[0].slug)} className={pill(inComponents)} aria-current={inComponents ? "page" : undefined}>
            Components
          </Link>
        </nav>
        <div className="ms-auto flex items-center gap-1">
          <Search />
          <ThemeToggle />
          <SettingsMenu />
          <Button asChild variant="ghost" className={headerIconButton}>
            <a href={SITE.repository} aria-label="GitHub repository">
              <GitHubIcon />
            </a>
          </Button>
          <Button asChild size="sm" className="ms-2 hidden h-7 px-3.5 text-sm font-semibold sm:inline-flex">
            <Link to="/docs/installation">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
