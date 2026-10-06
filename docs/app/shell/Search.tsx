import * as React from "react"
import { useNavigate } from "react-router"
import { SearchIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@booleanpress/ui/dialog"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@booleanpress/ui/command"
import { cn } from "@booleanpress/ui/utils"
import { blockHref, blocks, components, componentHref, guideHref, guides } from "~/content/registry.ts"
import { headerIconButton } from "./styles.ts"

interface Result {
  href: string
  title: string
  context: string
}

interface PagefindResult {
  data: () => Promise<{ url: string; meta: { title?: string }; excerpt: string }>
}

interface Pagefind {
  search: (query: string) => Promise<{ results: PagefindResult[] }>
}

/** Page titles and purposes, for the dev server, where the built Pagefind index does not exist yet. */
const LOCAL_INDEX: Result[] = [
  ...guides.map((g) => ({ href: guideHref(g.slug), title: g.title, context: g.description })),
  ...blocks.map((b) => ({ href: blockHref(b.slug), title: b.title, context: b.purpose })),
  ...components.map((c) => ({ href: componentHref(c.slug), title: c.title, context: c.purpose })),
]

async function loadPagefind(): Promise<Pagefind | null> {
  if (import.meta.env.DEV) return null
  try {
    const url = "/pagefind/pagefind.js"
    return (await import(/* @vite-ignore */ url)) as Pagefind
  } catch {
    return null
  }
}

const strip = (html: string) => html.replace(/<[^>]+>/g, "")

/**
 * A page whose title is what was typed comes first, then titles that start with it, then those that contain it, each
 * group in the index's own order: typing "date picker" opens on Date picker, not Date range picker.
 */
function byTitle(results: Result[], term: string): Result[] {
  const fold = (text: string) => text.toLowerCase().replace(/[\s-]+/g, "")
  const typed = fold(term)
  const rank = (title: string) => {
    const t = fold(title)
    return t === typed ? 0 : t.startsWith(typed) ? 1 : t.includes(typed) ? 2 : 3
  }
  return results.map((result, i) => ({ result, i, r: rank(result.title) })).sort((a, b) => a.r - b.r || a.i - b.i).map(({ result }) => result)
}

/** ⌘K: the library's Command component over the Pagefind index of every page; the arrow keys move through the results. */
export function Search() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<Result[]>([])
  const pagefind = React.useRef<Promise<Pagefind | null> | undefined>(undefined)
  const navigate = useNavigate()

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const term = query.trim()
  const shown = term ? results : []

  React.useEffect(() => {
    let cancelled = false
    if (!term) return
    pagefind.current ??= loadPagefind()
    pagefind.current.then(async (index) => {
      let found: Result[]
      if (index) {
        const { results: hits } = await index.search(term)
        found = await Promise.all(
          hits.slice(0, 12).map(async (hit) => {
            const data = await hit.data()
            return { href: data.url.replace(/\/index\.html$|\.html$/, "").replace(/\/$/, "") || "/", title: data.meta.title ?? data.url, context: strip(data.excerpt) }
          })
        )
      } else {
        const t = term.toLowerCase()
        const inTitle = LOCAL_INDEX.filter((r) => r.title.toLowerCase().includes(t))
        found = [...inTitle, ...LOCAL_INDEX.filter((r) => !inTitle.includes(r) && r.context.toLowerCase().includes(t))]
      }
      if (!cancelled) setResults(byTitle(found, term).slice(0, 8))
    })
    return () => {
      cancelled = true
    }
  }, [term])

  const go = (result: Result) => {
    setOpen(false)
    setQuery("")
    navigate(result.href)
  }

  return (
    <>
      <Button variant="ghost" className={headerIconButton} aria-label="Search" aria-keyshortcuts="Meta+K Control+K" onClick={() => setOpen(true)}>
        <SearchIcon />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-[20%] translate-y-0 overflow-hidden p-0" showCloseButton={false}>
          <DialogHeader className="sr-only">
            <DialogTitle>Search the documentation</DialogTitle>
            <DialogDescription>Type to search; use the arrow keys to choose a result and Enter to open it.</DialogDescription>
          </DialogHeader>
          {/* The results come from Pagefind, title matches first (byTitle): Command shows them in that order. */}
          <Command shouldFilter={false} label="Search the documentation" className="[&_[cmdk-input]]:h-12">
            <CommandInput placeholder="Search components and guides" value={query} onValueChange={setQuery} />
            <CommandList className={cn(!term && "hidden")}>
              {term ? <CommandEmpty>No results for “{term}”.</CommandEmpty> : null}
              {shown.map((result) => (
                <CommandItem key={result.href} value={result.href} onSelect={() => go(result)} className="flex-col items-start gap-0.5 px-3 py-2">
                  <span className="text-sm font-medium">{result.title}</span>
                  <span className="w-full truncate text-xs text-muted-foreground">{result.context}</span>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  )
}
