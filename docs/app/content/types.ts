// The documentation's content model. Component and guide pages are data, so the same source renders the HTML page and
// the Markdown copy that ships in the package for AI assistants (`dist/docs/`). Plain TypeScript with explicit `.ts`
// imports, so Node runs it directly (scripts/docs-markdown.mjs) as well as Vite.

/** The component categories, in the order the left column lists them. A category shows once it has a component. */
export const CATEGORIES = ["Form", "Button", "Data", "Panel", "Overlay", "File", "Menu", "Messages", "Media", "Misc"] as const

export type Category = (typeof CATEGORIES)[number]

/** One live example: `examples/<component>/<id>.tsx` is the preview, the code shown and a test target. */
export interface ExampleDoc {
  id: string
  title: string
  /** One sentence, Markdown: what the example shows. */
  description: string
  /**
   * Renders the example in its own page, inside a frame of this height in pixels, for a component that positions
   * itself against the window (Sidebar) and would otherwise cover the documentation.
   */
  frameHeight?: number
}

export interface KeyRow {
  /** Each key, as printed on the keyboard: "Space", "Shift", "Tab", "Escape". */
  keys: string[]
  behaviour: string
}

export interface ComponentDoc {
  slug: string
  title: string
  category: Category
  /** The one-line purpose under the title. */
  purpose: string
  links: {
    radix?: { label: string; href: string }
    apg?: { label: string; href: string }
    /** The spec, as a path in the repository, with its anchor. */
    spec: string
  }
  /** Extra packages the entry needs, beyond the package's peers. */
  peers?: string[]
  /** Markdown: how to use it, with a short code sample. */
  usage: string
  examples: ExampleDoc[]
  accessibility: {
    semantics: string
    labels: string
    focus: string
    limits?: string[]
  }
  keyboard: KeyRow[]
  /** Markdown, optional: what to know when theming it, beyond the token list. */
  theming?: string
  /** Descriptions for props whose type carries none (Radix's and the variant props), by part, then by prop. */
  props?: Record<string, Record<string, string>>
}

export interface GuideTab {
  id: string
  label: string
  markdown: string
}

export interface GuideSection {
  id: string
  title: string
  markdown?: string
  tabs?: GuideTab[]
  /** Markdown written at build time from the package itself: its changelog, or the table of every component. */
  generated?: "changelog" | "component-status"
  /** An interactive part of the HTML page, after the section's Markdown (the Markdown copy has the text only). */
  widget?: "theme-builder"
}

export interface GuideDoc {
  slug: string
  title: string
  description: string
  sections: GuideSection[]
}

/** An entry of a page's "On this page" list. */
export interface TocEntry {
  id: string
  title: string
  children?: TocEntry[]
}
