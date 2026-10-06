// Typography: no primitive. `Prose` styles the raw HTML of a Markdown or rich-text renderer; `Heading`, `Text`,
// `Blockquote` and `InlineCode` set the same type scale on your own elements. The scale is the visual target's
// documentation: Inter, headings 30/36, 20/28, 18/28 and 16/24, running text 16/24, component text 14/21.

import * as React from "react"
import { cva } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

/**
 * A heading level, 1 to 6.
 *
 * @since 0.1.0
 */
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

/** @since 0.1.0 */
const headingVariants = cva("text-heading", {
  variants: {
    size: {
      // 30px on a 36px line, regular, drawn 0.75px tighter, as the visual target's page titles.
      1: "text-3xl/9 font-normal tracking-[-0.025em]",
      // 20px on 28px, medium: a section.
      2: "text-xl/7 font-medium",
      // 18px on 28px, medium.
      3: "text-lg/7 font-medium",
      // 16px on 24px, medium.
      4: "text-base/6 font-medium",
      // 14px on 21px, medium.
      5: "text-sm/normal font-medium",
      // 12px on 18px, medium.
      6: "text-xs/normal font-medium",
    },
  },
  defaultVariants: { size: 2 },
})

/** @since 0.1.0 */
function Heading({
  className,
  level = 2,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & {
  /** The heading's level in the page's outline: renders `h1` to `h6`. 2 by default. */
  level?: HeadingLevel
  /** The size of another level, when the look should differ from the outline (an `h2` drawn at size 3). */
  size?: HeadingLevel
  /** Render the child element instead (a `DialogTitle`, a link), with the heading's classes merged onto it. */
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : (`h${level}` as const)
  const resolved = size ?? level

  return (
    <Comp
      data-slot="heading"
      data-level={level}
      data-size={resolved}
      className={cn(headingVariants({ size: resolved }), className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
const textVariants = cva("", {
  variants: {
    size: {
      // 12px on 18px.
      xs: "text-xs/normal",
      // 14px on 21px: text in components.
      sm: "text-sm/normal",
      // 16px on 24px: running text.
      base: "text-base/6",
      // 18px on 28px: the lead paragraph under a page title.
      lg: "text-lg/7",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      // The heading colour, one step darker than body text.
      strong: "text-heading",
      destructive: "text-destructive-strong",
      // The tag text colour: the alerts' strong green is under 4.5:1 on white, and running text must pass.
      success: "text-success-tag-foreground",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: { size: "sm", tone: "default" },
})

/** @since 0.1.0 */
function Text({
  className,
  size = "sm",
  tone = "default",
  weight,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & {
  /** `xs` 12/18, `sm` 14/21 (default), `base` 16/24, `lg` 18/28. */
  size?: "xs" | "sm" | "base" | "lg"
  /** The colour: `default`, `muted`, `strong` (the heading colour), `destructive` or `success`. */
  tone?: "default" | "muted" | "strong" | "destructive" | "success"
  /** `normal`, `medium`, `semibold` or `bold`; inherited when left out. */
  weight?: "normal" | "medium" | "semibold" | "bold"
  /** Render the child element instead (a `span`, a `label`), with the text's classes merged onto it. */
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      data-slot="text"
      data-size={size}
      data-tone={tone}
      className={cn(textVariants({ size, tone, weight }), className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function Blockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-slot="blockquote"
      // A 2px edge at the inline start, 16px from the text, which is italic and muted.
      className={cn("border-s-2 border-border ps-4 italic text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function InlineCode({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="inline-code"
      // Code reads left to right, isolated from a right-to-left sentence around it.
      dir="ltr"
      // The visual target's inline code: 14px medium monospace on the edge colour's slate, 2px 4px padding, 4px radius;
      // a long name breaks anywhere rather than run out of its box.
      className={cn(
        "rounded-sm bg-border px-1 py-0.5 font-mono text-sm/normal font-medium text-foreground [overflow-wrap:anywhere]",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function Prose({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Render the child element instead (an `article`), with the prose classes merged onto it. */
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="prose"
      className={cn(
        // Running text: 16px on a 24px line; the first block starts flush and the last ends flush.
        "text-base/6 text-foreground [overflow-wrap:break-word] [&>:first-child]:mt-0 [&>:last-child]:mb-0",
        // Headings in the heading colour, 4px above the text they introduce, with the visual target's space above.
        "[&>:is(h1,h2,h3,h4,h5,h6)]:text-heading [&>:is(h2,h3,h4,h5,h6)]:mb-1",
        "[&>h1]:mt-8 [&>h1]:mb-4 [&>h1]:text-3xl/9 [&>h1]:font-normal [&>h1]:tracking-[-0.025em]",
        "[&>h2]:mt-14 [&>h2]:text-xl/7 [&>h2]:font-medium",
        "[&>h3]:mt-8 [&>h3]:text-lg/7 [&>h3]:font-medium",
        "[&>h4]:mt-6 [&>h4]:text-base/6 [&>h4]:font-medium",
        "[&>h5]:mt-6 [&>h5]:text-sm/normal [&>h5]:font-medium",
        "[&>h6]:mt-6 [&>h6]:text-xs/normal [&>h6]:font-medium",
        // Paragraphs 16px apart.
        "[&>p]:mb-4",
        // Lists: discs and numbers in the text colour, items 6px apart, a nested list 6px below its item.
        "[&>ul]:mb-4 [&>ul]:list-disc [&>ul]:ps-5 [&>ol]:mb-4 [&>ol]:list-decimal [&>ol]:ps-5 [&_li]:mb-1.5 [&_li>p]:mb-1.5",
        "[&_li>ul]:mt-1.5 [&_li>ul]:list-[circle] [&_li>ul]:ps-5 [&_li>ol]:mt-1.5 [&_li>ol]:list-decimal [&_li>ol]:ps-5",
        // Quotes: as Blockquote.
        "[&>blockquote]:mb-4 [&>blockquote]:border-s-2 [&>blockquote]:border-border [&>blockquote]:ps-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>blockquote>p]:mb-2 [&>blockquote>:last-child]:mb-0",
        // Code: left to right whatever the page's direction; inline as InlineCode; blocks in a bordered card panel, 14px
        // on a 24px line, scrolling sideways.
        "[&_code]:[direction:ltr] [&_code]:[unicode-bidi:isolate] [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-border [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-sm/normal [&_:not(pre)>code]:font-medium [&_:not(pre)>code]:[overflow-wrap:anywhere]",
        "[&>pre]:mb-4 [&>pre]:[direction:ltr] [&>pre]:overflow-x-auto [&>pre]:rounded-lg [&>pre]:border [&>pre]:bg-card [&>pre]:px-4 [&>pre]:py-3 [&>pre]:font-mono [&>pre]:text-sm/6",
        // Links: medium, in the primary colour, underlined at 40% (full on hover), so colour is not their only mark.
        "[&_a]:rounded-xs [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:decoration-primary/40 [&_a]:underline-offset-[0.2em] [&_a]:outline-none [&_a:hover]:decoration-primary [&_a:focus-visible]:outline-1 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-ring [&_a:focus-visible]:outline-solid",
        // Bold text in the heading colour.
        "[&_strong]:font-semibold [&_strong]:text-heading",
        // Rules, images and figures.
        "[&>hr]:my-8 [&>hr]:border-border [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-lg [&>figure]:mb-4 [&_figcaption]:mt-2 [&_figcaption]:text-sm/normal [&_figcaption]:text-muted-foreground",
        // Tables: full width, 14px on 20px, 10px by 12px cells, a rule under the header and under each row.
        "[&_table]:mb-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm/5 [&_tr]:border-b [&_tr]:border-border [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-start [&_th]:font-bold [&_td]:px-3 [&_td]:py-2.5 [&_td]:align-middle",
        className
      )}
      {...props}
    />
  )
}

export { Blockquote, Heading, headingVariants, InlineCode, Prose, Text, textVariants, type HeadingLevel }
