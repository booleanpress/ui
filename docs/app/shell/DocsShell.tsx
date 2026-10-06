import type * as React from "react"
import { Link } from "react-router"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { NavItem } from "~/content/registry.ts"
import type { TocEntry } from "~/content/types.ts"
import { Header } from "./Header.tsx"
import { Nav } from "./Nav.tsx"
import { OnThisPage, OnThisPagePill, type PageResources } from "./OnThisPage.tsx"

interface DocsShellProps {
  version: string
  toc?: TocEntry[]
  resources?: PageResources
  neighbours?: { previous?: NavItem; next?: NavItem }
  children: React.ReactNode
}

const neighbourLink =
  "flex items-center gap-2 rounded-md text-sm text-muted-foreground outline-none hover:text-[var(--docs-heading)] focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring"

/**
 * Three columns on a faint grey ground, in a frame at most 1728px wide: the guides and components (236px), the page,
 * which takes the rest, and the page's resources and sections (236px), 56px apart with 56px edges. Below 1280px the
 * right column gives way to a pill at the foot of the window, and the edges and gaps narrow to 16px and 32px; below
 * 1024px the left column moves behind the header's ☰.
 */
export function DocsShell({ version, toc, resources, neighbours, children }: DocsShellProps) {
  return (
    <div className="min-h-screen bg-[var(--docs-ground)] text-foreground">
      <a
        href="#content"
        className="sr-only z-50 rounded-md bg-card px-3 py-2 focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:outline-solid focus:outline-1 focus:outline-offset-2 focus:outline-ring"
      >
        Skip to the content
      </a>
      <Header version={version} />
      <div className="mx-auto flex max-w-[108rem] gap-8 px-4 xl:gap-14 xl:px-14">
        <div className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-[216px] shrink-0 overflow-y-auto py-8 lg:block xl:w-[236px]">
          <Nav />
        </div>
        <main id="content" tabIndex={-1} className="min-w-0 flex-1 py-8 outline-none">
          <div className="flex flex-col" data-pagefind-body="">
            {children}
          </div>
          {neighbours ? (
            <nav aria-label="Previous and next" className="mt-16 flex justify-between gap-4 border-t pt-6 pb-16 xl:pb-0">
              {neighbours.previous ? (
                <Link to={neighbours.previous.href} className={neighbourLink}>
                  <ArrowLeftIcon className="size-4 rtl:rotate-180" />
                  {neighbours.previous.title}
                </Link>
              ) : (
                <span />
              )}
              {neighbours.next ? (
                <Link to={neighbours.next.href} className={neighbourLink}>
                  {neighbours.next.title}
                  <ArrowRightIcon className="size-4 rtl:rotate-180" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </main>
        {toc?.length && resources ? (
          <div className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-[236px] shrink-0 overflow-y-auto py-8 xl:block">
            <OnThisPage entries={toc} resources={resources} />
          </div>
        ) : null}
      </div>
      {toc?.length ? <OnThisPagePill entries={toc} /> : null}
    </div>
  )
}
