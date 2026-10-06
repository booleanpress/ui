import * as React from "react"
import { CheckIcon, ChevronUpIcon, CodeXmlIcon, CopyIcon, EllipsisIcon, FileCodeIcon, FileTextIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@booleanpress/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@booleanpress/ui/popover"
import { cn } from "@booleanpress/ui/utils"
import type { TocEntry } from "~/content/types.ts"
import { GitHubIcon } from "./icons.tsx"
import { focusOutline } from "./styles.ts"

const flatten = (entries: TocEntry[]): TocEntry[] => entries.flatMap((e) => [e, ...flatten(e.children ?? [])])

/** The id of the section being read: the last heading above the reading line, a third of the way down the window. */
function useActiveSection(entries: TocEntry[]): string | undefined {
  const [active, setActive] = React.useState<string>()
  React.useEffect(() => {
    const ids = flatten(entries).map((e) => e.id)
    const update = () => {
      const line = Math.max(96, window.innerHeight / 3)
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= line) current = id
      }
      setActive(current)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [entries])
  return active
}

function TocList({ entries, active, onNavigate, depth = 0 }: { entries: TocEntry[]; active?: string; onNavigate?: () => void; depth?: number }) {
  return (
    <ul className="flex flex-col">
      {entries.map((entry) => (
        <li key={entry.id}>
          <a
            href={`#${entry.id}`}
            onClick={onNavigate}
            aria-current={active === entry.id ? "location" : undefined}
            style={{ paddingInlineStart: `${1 + depth}rem` }}
            className={cn(
              "relative block py-1 text-sm text-muted-foreground transition-colors hover:text-[var(--docs-heading)] aria-[current=location]:text-[var(--docs-heading)]",
              // The section being read: a dark bar over the column's rule.
              "aria-[current=location]:before:absolute aria-[current=location]:before:inset-y-1 aria-[current=location]:before:-start-px aria-[current=location]:before:w-px aria-[current=location]:before:bg-primary",
              focusOutline
            )}
          >
            {entry.title}
          </a>
          {entry.children?.length ? <TocList entries={entry.children} active={active} onNavigate={onNavigate} depth={depth + 1} /> : null}
        </li>
      ))}
    </ul>
  )
}

/** What a page offers beside its sections: its API reference, its source, its Markdown copy and its file on GitHub. */
export interface PageResources {
  /** The page's API reference: a section at its end. */
  apiHref?: string
  sourceHref?: string
  markdownHref?: string
  editHref: string
}

const resourceRow = cn(
  "flex w-full items-center gap-2 py-1 ps-4 text-start text-sm text-muted-foreground transition-colors hover:text-[var(--docs-heading)] [&_svg]:size-3.5 [&_svg]:shrink-0",
  focusOutline
)

/** Copies the page's Markdown, fetched from its `.md` address; says "Copied" for two seconds. */
function CopyMarkdown({ href }: { href: string }) {
  const [copied, setCopied] = React.useState(false)
  React.useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timer)
  }, [copied])
  const copy = async () => {
    const text = await (await fetch(href)).text()
    await navigator.clipboard.writeText(text)
    setCopied(true)
  }
  return (
    <button type="button" className={resourceRow} onClick={copy}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      <span>{copied ? "Copied" : "Copy Markdown"}</span>
      <span role="status" className="sr-only">
        {copied ? "Markdown copied" : ""}
      </span>
    </button>
  )
}

/** The page's own links, as the right column lists them: API Reference, Source, Copy Markdown and a menu of the rest. */
function ResourceList({ resources }: { resources: PageResources }) {
  const { apiHref, sourceHref, markdownHref, editHref } = resources
  return (
    <ul className="flex flex-col">
      {apiHref ? (
        <li>
          <a href={apiHref} className={resourceRow}>
            <CodeXmlIcon />
            API Reference
          </a>
        </li>
      ) : null}
      {sourceHref ? (
        <li>
          <a href={sourceHref} rel="noreferrer" className={resourceRow}>
            <FileCodeIcon />
            Source
          </a>
        </li>
      ) : null}
      <li className="flex items-center gap-2">
        {markdownHref ? <CopyMarkdown href={markdownHref} /> : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="ms-auto size-7 shrink-0 rounded-md p-0 text-muted-foreground hover:text-[var(--docs-heading)] [&_svg]:size-4" aria-label="More options">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {markdownHref ? (
              <DropdownMenuItem asChild>
                <a href={markdownHref}>
                  <FileTextIcon />
                  View as Markdown
                </a>
              </DropdownMenuItem>
            ) : null}
            <DropdownMenuItem asChild>
              <a href={editHref} rel="noreferrer">
                <GitHubIcon />
                Edit this page on GitHub
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  )
}

/** The right column on wide screens, along a 1px rule: the page's resources, then its sections, the one being read marked. */
export function OnThisPage({ entries, resources }: { entries: TocEntry[]; resources: PageResources }) {
  const active = useActiveSection(entries)
  return (
    <div className="flex flex-col gap-8 border-s">
      <nav aria-label="Resources" className="flex flex-col gap-2">
        <h2 className="ps-4 font-mono text-xs text-[var(--docs-heading)] uppercase">Resources</h2>
        <ResourceList resources={resources} />
      </nav>
      <nav aria-label="On this page" className="flex flex-col gap-2">
        <h2 className="ps-4 font-mono text-xs text-[var(--docs-heading)] uppercase">On this page</h2>
        <TocList entries={entries} active={active} />
      </nav>
    </div>
  )
}

/** A ring that fills as the reader moves down the page. */
function ProgressRing({ value }: { value: number }) {
  const r = 6.5
  const length = 2 * Math.PI * r
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 -rotate-90">
      <circle cx="8" cy="8" r={r} fill="none" strokeWidth="1.5" className="stroke-border" />
      <circle
        cx="8"
        cy="8"
        r={r}
        fill="none"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={length * (1 - value)}
        className="stroke-[var(--docs-heading)] transition-[stroke-dashoffset] duration-(--bui-duration-base)"
      />
    </svg>
  )
}

/**
 * Below the wide-screen breakpoint, where the right column is hidden: a pill at the foot of the window naming the
 * section being read and how far down the page it is, which opens the list of sections above it.
 */
export function OnThisPagePill({ entries }: { entries: TocEntry[] }) {
  const [open, setOpen] = React.useState(false)
  const active = useActiveSection(entries)
  const flat = flatten(entries)
  const index = Math.max(0, flat.findIndex((e) => e.id === active))
  const current = flat[index]
  return (
    <div className="fixed bottom-4 start-1/2 z-30 -translate-x-1/2 sm:bottom-6 xl:hidden rtl:translate-x-1/2" data-pagefind-ignore="">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={`On this page: ${current?.title ?? ""}, ${index + 1} of ${flat.length}`}
            className={cn(
              "flex h-10 w-[272px] max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full border bg-card ps-3 pe-3 text-sm shadow-[0_4px_12px_-2px_rgb(15_23_42/0.12),0_2px_4px_-2px_rgb(15_23_42/0.08)]",
              focusOutline
            )}
          >
            <ProgressRing value={(index + 1) / flat.length} />
            <span className="min-w-0 truncate font-medium text-[var(--docs-heading)]">{current?.title}</span>
            <span className="ms-auto text-xs text-muted-foreground tabular-nums">
              {index + 1}/{flat.length}
            </span>
            <ChevronUpIcon className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
          </button>
        </PopoverTrigger>
        <PopoverContent side="top" sideOffset={8} className="max-h-[min(60vh,28rem)] w-[272px] max-w-[calc(100vw-2rem)] overflow-y-auto p-2">
          <nav aria-label="On this page">
            <TocList entries={entries} active={active} onNavigate={() => setOpen(false)} />
          </nav>
        </PopoverContent>
      </Popover>
    </div>
  )
}
