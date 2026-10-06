import * as React from "react"
import { Link } from "@booleanpress/ui/link"

// A stand-in for a router's link component: it moves within the app without loading the page.
function RouterLink({
  to,
  onNavigate,
  onClick,
  children,
  ...props
}: React.ComponentProps<"a"> & { to: string; onNavigate: (to: string) => void }) {
  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        event.preventDefault()
        onNavigate(to)
      }}
    >
      {children}
    </a>
  )
}

export default function LinkAsRouterLink() {
  const [path, setPath] = React.useState("/mailers")

  return (
    <div className="flex flex-col gap-2 text-sm">
      <nav aria-label="Settings" className="flex gap-4">
        {["/mailers", "/organisations", "/logs"].map((to) => (
          <Link key={to} asChild size="default" variant={path === to ? "default" : "muted"}>
            <RouterLink to={to} onNavigate={setPath} aria-current={path === to ? "page" : undefined}>
              {to.slice(1, 2).toUpperCase() + to.slice(2)}
            </RouterLink>
          </Link>
        ))}
      </nav>
      <p className="text-muted-foreground">Current route: {path}</p>
    </div>
  )
}
