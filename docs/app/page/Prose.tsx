import * as React from "react"
import { cn } from "@booleanpress/ui/utils"

/** Copies the code beside a code block's copy button, and marks the button copied for two seconds. */
async function copyFrom(button: HTMLButtonElement) {
  await navigator.clipboard.writeText(button.parentElement?.querySelector("pre")?.textContent ?? "")
  button.dataset.copied = ""
  button.setAttribute("aria-label", "Copied")
  window.setTimeout(() => {
    delete button.dataset.copied
    button.setAttribute("aria-label", "Copy code")
  }, 2000)
}

/** HTML rendered at build time from the site's own Markdown; its code blocks' copy buttons work through one listener. */
export function Prose({ html, className }: { html: string; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const onClick = (event: MouseEvent) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-copy]")
      if (button && element.contains(button)) void copyFrom(button)
    }
    element.addEventListener("click", onClick)
    return () => element.removeEventListener("click", onClick)
  }, [])
  return <div ref={ref} className={cn("bui-prose", className)} dangerouslySetInnerHTML={{ __html: html }} />
}

export function InlineHtml({ html, className }: { html: string; className?: string }) {
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

export function SectionHeading({ id, children, level = 2 }: { id: string; children: React.ReactNode; level?: 2 | 3 }) {
  const Tag = level === 2 ? "h2" : "h3"
  return (
    <Tag id={id} className={cn("scroll-mt-20 font-medium text-[var(--docs-heading)]", level === 2 ? "mt-14 mb-2 text-xl" : "mt-8 mb-1 text-lg")}>
      {children}
    </Tag>
  )
}

/** A page's title block: the path above it in small capitals, the title, and one line on what the page is for. */
export function PageHeader({ eyebrow, title, lead }: { eyebrow?: string[]; title: string; lead: string }) {
  return (
    <header>
      {eyebrow?.length ? (
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.3px] text-muted-foreground uppercase">
          {eyebrow.map((part, i) => (
            <span key={part} className="flex items-center gap-2">
              {i ? (
                <svg aria-hidden="true" viewBox="0 0 8 8" className="size-2 rtl:rotate-180">
                  <path d="M2 1 6 4 2 7Z" fill="none" stroke="currentColor" strokeLinejoin="round" />
                </svg>
              ) : null}
              <span className={i === eyebrow.length - 1 ? "text-[var(--docs-heading)]" : undefined}>{part}</span>
            </span>
          ))}
        </p>
      ) : null}
      <h1 className="mt-3 text-3xl font-normal tracking-[-0.75px] text-[var(--docs-heading)]">{title}</h1>
      <p className="mt-3 text-lg text-[var(--docs-lead)]">{lead}</p>
    </header>
  )
}
