// Markdown to HTML for the site's prose, with Shiki for fenced code. Content is the site's own, so its HTML is trusted.
import { Marked, type Tokens } from "marked"
import { highlight } from "./highlight.server.ts"

const icon = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

/** Lucide's copy and check icons; CSS shows the check for two seconds after a copy. */
const COPY_BUTTON = `<button type="button" class="bui-copy" data-copy aria-label="Copy code">${icon(
  '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>'
)}${icon('<path d="M20 6 9 17l-5-5"/>')}</button>`

export async function renderMarkdown(markdown: string): Promise<string> {
  const marked = new Marked({
    async: true,
    gfm: true,
    async walkTokens(token) {
      if (token.type === "code") {
        const code = token as Tokens.Code & { html?: string }
        code.html = await highlight(code.text, code.lang ?? "text")
      }
    },
    renderer: {
      code(token) {
        // A copy button in the corner, as on the reference's code; Prose's click handler copies the code beside it.
        return `<div class="bui-code" data-lang="${token.lang ?? "text"}">${(token as Tokens.Code & { html?: string }).html ?? ""}${COPY_BUTTON}</div>`
      },
      link({ href, tokens }) {
        const text = this.parser.parseInline(tokens)
        const external = /^https?:/.test(href)
        return `<a href="${href}"${external ? ' rel="noreferrer"' : ""}>${text}</a>`
      },
    },
  })
  // Each table in a box of its own, which scrolls when the table is wider than the page: a region named by its column
  // headings, which takes keyboard focus so it can be scrolled without a mouse.
  const html = await marked.parse(markdown)
  let count = 0
  return html
    .replace(/<table>\s*<thead>\s*<tr>([\s\S]*?)<\/tr>/g, (table, row: string) => {
      const heads = [...row.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      count += 1
      return `<div class="bui-table" role="region" tabindex="0" aria-label="Table ${count}: ${heads.join(", ")}">${table}`
    })
    .replace(/<\/table>/g, "</table></div>")
}

export async function renderInline(markdown: string): Promise<string> {
  return new Marked({ gfm: true }).parseInline(markdown) as string
}
