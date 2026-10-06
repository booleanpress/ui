"use client"

// CodeBlock: no primitive. A `<figure>` holding a `<pre>` that scrolls as a named, focusable region: plain text with
// optional line numbers, highlighted lines, a title bar, a wrap toggle and a copy button. It highlights nothing itself;
// pass the HTML Shiki or Prism made as `html`.

import * as React from "react"
import { WrapTextIcon } from "lucide-react"
import { cn, fillString } from "@/lib/utils"

import { CopyButton } from "@/components/copy-button"
import { IconButton } from "@/components/icon-button"
import { useUiStrings } from "@booleanpress/ui/provider"

const VOID_ELEMENTS = new Set(["area", "br", "col", "embed", "hr", "img", "input", "source", "wbr"])

const tagName = (tag: string) => /^<\/?([a-zA-Z][\w-]*)/.exec(tag)?.[1]?.toLowerCase()

/**
 * Splits highlighted HTML into one string per line. A highlighter's own `<pre><code>` wrapper is dropped, and an element
 * that runs over several lines (Prism's multi-line comment) is closed at the end of each line and opened again at the
 * start of the next, so every line is well-formed on its own.
 */
function splitHtmlLines(html: string): string[] {
  const inner = /<code\b[^>]*>([\s\S]*)<\/code>/i.exec(html)?.[1] ?? html
  const open: string[] = []
  return inner
    .replace(/\r\n?/g, "\n")
    .replace(/\n$/, "")
    .split("\n")
    .map((line) => {
      const prefix = open.join("")
      for (const [tag] of line.matchAll(/<\/?[a-zA-Z][^>]*>/g)) {
        const name = tagName(tag)
        if (!name || VOID_ELEMENTS.has(name) || tag.endsWith("/>")) continue
        if (tag.startsWith("</")) {
          const index = open.map(tagName).lastIndexOf(name)
          if (index >= 0) open.splice(index, 1)
        } else {
          open.push(tag)
        }
      }
      const suffix = [...open].reverse().map((tag) => `</${tagName(tag)}>`).join("")
      return prefix + line + suffix
    })
}

const splitTextLines = (code: string) => code.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n")

// The 32 px buttons of the visual target's code panels: muted until hovered, on the panel's own fill so code passing
// under them stays hidden.
const ACTION_CLASSES =
  "size-8 rounded-md bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent active:bg-accent dark:active:bg-accent"

/** @since 0.1.1 */
function CodeBlock({
  className,
  code,
  html,
  language,
  title,
  lineNumbers = false,
  highlightLines,
  wrap: wrapProp,
  defaultWrap = false,
  onWrapChange,
  wrapToggle = false,
  copyable = true,
  maxHeight,
  "aria-label": ariaLabel,
  ...props
}: Omit<React.ComponentProps<"figure">, "title" | "children"> & {
  /** The code as plain text: what it shows (unless `html` is given) and what the copy button copies. */
  code: string
  /**
   * The same code, highlighted, as HTML: what Shiki's `codeToHtml` or Prism's `highlight` returns. It is inserted as HTML
   * without any cleaning, so it must be trusted: a highlighter's output is (it escapes the code it colours); HTML from
   * anywhere else, above all from what a person typed, must be sanitised before it gets here.
   */
  html?: string
  /** The language, set as `data-language` and a `language-*` class on the `<code>`, and naming the region without a title. */
  language?: string
  /** A file name or caption, shown in a bar above the code. */
  title?: string
  /** Numbers each line, in a gutter that is not selected or copied with the code. */
  lineNumbers?: boolean
  /** Line numbers, from 1, to mark with the hovered-surface fill. */
  highlightLines?: number[]
  /** Whether long lines wrap, when you control it. Pair it with `onWrapChange`. */
  wrap?: boolean
  /** Whether long lines start wrapped, when it controls itself. */
  defaultWrap?: boolean
  /** Called with `true` or `false` when the wrap toggle is pressed. */
  onWrapChange?: (wrap: boolean) => void
  /** Shows a toggle button that wraps and unwraps long lines. */
  wrapToggle?: boolean
  /** Shows the copy button. `true` by default. */
  copyable?: boolean
  /** The tallest the code area grows before it scrolls: px as a number, or any CSS length. */
  maxHeight?: number | string
}) {
  const strings = useUiStrings()
  const [wrapState, setWrapState] = React.useState(defaultWrap)
  const wrap = wrapProp ?? wrapState
  const lines = React.useMemo(() => (html === undefined ? splitTextLines(code) : splitHtmlLines(html)), [code, html])
  const highlighted = React.useMemo(() => new Set(highlightLines ?? []), [highlightLines])
  const gutter = `${String(lines.length).length}ch`
  const name = ariaLabel ?? fillString(strings.codeBlock, { title: title ?? language ?? "" }).trim()

  const toggleWrap = () => {
    if (wrapProp === undefined) setWrapState(!wrap)
    onWrapChange?.(!wrap)
  }

  const actionCount = Number(wrapToggle) + Number(copyable)
  // The buttons sit in the top corner: centred in the title bar when there is one, over the code when not. They come
  // before the code in the tab order, as they do on screen. In the title bar they follow the page's direction; over the
  // code, which always reads left to right, they keep to its right-hand end, so on a right-to-left page they never cover
  // the start of the first line.
  const actions =
    actionCount > 0 ? (
      <div
        data-slot="code-block-actions"
        className={cn("absolute z-[2] flex items-center gap-1", title ? "end-1.75 top-1" : "top-1.75 right-1.75")}
      >
        {wrapToggle ? (
          <IconButton
            data-slot="code-block-wrap"
            label={strings.wrapLines}
            tooltip
            aria-pressed={wrap}
            onClick={toggleWrap}
            className={cn(ACTION_CLASSES, "aria-pressed:bg-accent aria-pressed:text-accent-foreground")}
          >
            <WrapTextIcon />
          </IconButton>
        ) : null}
        {copyable ? <CopyButton value={code} className={ACTION_CLASSES} /> : null}
      </div>
    ) : null

  return (
    <figure
      data-slot="code-block"
      data-wrap={wrap || undefined}
      // The visual target's code panel: the card fill, a 1px edge, 8px radius; the outline goes round the whole panel
      // while its code area has keyboard focus.
      className={cn(
        "relative overflow-hidden rounded-lg border bg-card text-card-foreground has-[[data-slot=code-block-content]:focus-visible]:outline-1 has-[[data-slot=code-block-content]:focus-visible]:outline-offset-2 has-[[data-slot=code-block-content]:focus-visible]:outline-ring has-[[data-slot=code-block-content]:focus-visible]:outline-solid",
        className
      )}
      {...props}
    >
      {title ? (
        // The caption holds the title alone, so the figure's name is the file name, not the buttons' names too; it
        // keeps room at its end for the buttons drawn over it.
        <figcaption
          data-slot="code-block-header"
          className={cn(
            "flex min-h-10 items-center border-b ps-4 text-sm/normal font-medium text-foreground",
            actionCount === 2 ? "pe-21" : actionCount === 1 ? "pe-12" : "pe-4"
          )}
        >
          <span data-slot="code-block-title" className="min-w-0 truncate">
            {title}
          </span>
        </figcaption>
      ) : null}
      {actions}
      <pre
        data-slot="code-block-content"
        // Code reads left to right on a right-to-left page too; the title bar and the buttons follow the page.
        dir="ltr"
        // A region in the tab order, so a keyboard can scroll code that runs past the panel.
        role="region"
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region takes focus so the arrow keys can scroll it.
        tabIndex={0}
        aria-label={name}
        style={maxHeight === undefined ? undefined : { maxHeight }}
        className="overflow-auto py-3 font-mono text-sm/5 outline-none"
      >
        <code
          data-slot="code-block-code"
          data-language={language}
          className={cn(
            "block w-fit min-w-full",
            language && `language-${language}`,
            wrap ? "whitespace-pre-wrap [overflow-wrap:anywhere]" : "whitespace-pre"
          )}
        >
          {lines.map((line, index) => (
            <span
              // Lines are positional: the same line number is the same row.
              key={index}
              data-slot="code-block-line"
              data-highlighted={highlighted.has(index + 1) || undefined}
              // Each line is 24px: a 20px line and 2px above and below, as the visual target's; a highlighted line takes
              // the hovered-surface fill from edge to edge. With numbers, each line carries the panel's fill, for its
              // number to take.
              className={cn("flex px-4 py-0.5 data-highlighted:bg-accent", lineNumbers && "bg-card")}
            >
              {lineNumbers ? (
                // The number stays at the start edge while long lines scroll sideways under it.
                <span
                  data-slot="code-block-line-number"
                  aria-hidden="true"
                  className="sticky start-0 -ms-4 box-content shrink-0 bg-inherit ps-4 pe-4 text-end text-muted-foreground select-none"
                  style={{ width: gutter }}
                >
                  {index + 1}
                </span>
              ) : null}
              {html === undefined ? (
                <span data-slot="code-block-line-content" className="min-h-5 min-w-0 flex-1">
                  {line}
                </span>
              ) : (
                <span
                  data-slot="code-block-line-content"
                  className="min-h-5 min-w-0 flex-1"
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              )}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  )
}

export { CodeBlock }
