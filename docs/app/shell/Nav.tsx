import * as React from "react"
import { Link, useLocation } from "react-router"
import { BlocksIcon, BookTextIcon, LayoutGridIcon } from "lucide-react"
import { cn } from "@booleanpress/ui/utils"
import { blockHref, blocks, components, componentHref, navigation, sectionOf } from "~/content/registry.ts"
import { focusOutline } from "./styles.ts"

/** The three sections at the top: an icon in a small tile, the current section on a white card with a dark bar at its edge. */
function SectionLink({ to, active, icon, children, onNavigate }: { to: string; active: boolean; icon: React.ReactNode; children: React.ReactNode; onNavigate?: () => void }) {
  return (
    <Link
      to={to}
      prefetch="intent"
      onClick={onNavigate}
      className={cn(
        "relative flex h-[38px] items-center gap-2.5 rounded-[10px] border border-transparent px-2.5 text-sm/[21px] font-medium text-[var(--docs-heading)]",
        focusOutline,
        active ? "border-border bg-card shadow-[0_1px_0_0_rgb(226_232_240/0.7)] dark:shadow-none" : "hover:bg-secondary-hover/50"
      )}
    >
      {/* Always in the markup, so the pre-rendered "not found" page hydrates at any address. */}
      <span aria-hidden="true" className={cn("absolute -start-px top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary", !active && "hidden")} />
      <span aria-hidden="true" className={cn("flex size-5 items-center justify-center rounded-md text-muted-foreground [&_svg]:size-3", active ? "bg-secondary-hover" : "bg-secondary")}>
        {icon}
      </span>
      {children}
    </Link>
  )
}

/** The left column: the three sections, then the groups of the current one, the current page highlighted and kept in view. */
export function Nav({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const location = useLocation()
  // Pre-rendering sees /components/checkbox/ and the browser /components/checkbox: compare without the slash.
  const current = location.pathname.replace(/\/+$/, "") || "/"
  const section = sectionOf(current)
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    listRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" })
  }, [location.pathname])

  return (
    <nav aria-label="Components and guides" className={cn("px-3", className)}>
      <div className="flex flex-col gap-1.5 border-b pb-5">
        <SectionLink to="/docs/introduction" active={section === "docs"} icon={<BookTextIcon />} onNavigate={onNavigate}>
          Guides
        </SectionLink>
        <SectionLink to={componentHref(components[0].slug)} active={current.startsWith("/components/")} icon={<LayoutGridIcon />} onNavigate={onNavigate}>
          Components
        </SectionLink>
        <SectionLink to={blockHref(blocks[0].slug)} active={section === "blocks"} icon={<BlocksIcon />} onNavigate={onNavigate}>
          Blocks
        </SectionLink>
      </div>
      <div ref={listRef} className="flex flex-col gap-6 pt-6">
        {navigation(section).map((group) => (
          <div key={group.title} className="flex flex-col gap-2">
            <h2 className="ps-2.5 font-mono text-xs text-muted-foreground uppercase">{group.title}</h2>
            <ul className="flex flex-col gap-px">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    // Hovering or focusing a link starts loading its page, so the click has less to wait for.
                    prefetch="intent"
                    onClick={onNavigate}
                    aria-current={item.href === current ? "page" : undefined}
                    className={cn(
                      "flex h-8 items-center rounded-lg px-2.5 text-sm text-[var(--docs-heading)] hover:bg-secondary-hover/50",
                      focusOutline,
                      item.href === current && "bg-secondary-hover/50"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  )
}
