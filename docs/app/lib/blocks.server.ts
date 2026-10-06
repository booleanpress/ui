// The data a block's page is pre-rendered from, and its Markdown copy. A block's code is an example file,
// examples/blocks/<slug>.tsx, read and highlighted at build time like any example's.
import { BLOCKS, blockHref, componentHref, components, findBlock, neighbours } from "../content/registry.ts"
import type { BlockDoc } from "../content/blocks/types.ts"
import { SITE, sourceUrl } from "../content/site.ts"
import { highlight } from "./highlight.server.ts"
import { packageVersion } from "./introspect.server.ts"
import { exampleSource } from "./markdown-copy.server.ts"
import { renderMarkdown } from "./render-markdown.server.ts"

/** The package's components a block imports, by title, each with its page (when it has one) and its extra packages. */
export function blockComponents(code: string) {
  const entries = new Set([...code.matchAll(/from "@booleanpress\/ui\/([a-z-]+)"/g)].map((match) => match[1]))
  entries.delete("provider")
  entries.delete("utils")
  return [...entries]
    .map((slug) => {
      const doc = components.find((c) => c.slug === slug)
      return { title: doc?.title ?? slug, href: doc ? componentHref(slug) : undefined, peers: doc?.peers ?? [] }
    })
    .sort((a, b) => a.title.localeCompare(b.title))
}

const blockPeers = (used: ReturnType<typeof blockComponents>) => [...new Set(used.flatMap((c) => c.peers))].sort()

export async function blockPage(slug: string) {
  const doc = findBlock(slug)
  if (!doc) return null
  const code = exampleSource(BLOCKS, slug)
  const used = blockComponents(code)
  const href = blockHref(slug)
  return {
    kind: "block" as const,
    slug,
    title: doc.title,
    purpose: doc.purpose,
    version: packageVersion(),
    usageHtml: await renderMarkdown(doc.usage),
    example: {
      id: slug,
      title: doc.title,
      descriptionHtml: "",
      code,
      codeHtml: await highlight(code, "tsx"),
      frameHeight: doc.frameHeight,
    },
    components: used.map(({ title, href: page }) => ({ title, href: page })),
    peers: blockPeers(used),
    links: [
      { label: "Markdown", href: `${href}.md` },
      { label: "Source", href: sourceUrl(`examples/${BLOCKS}/${slug}.tsx`) },
    ],
    neighbours: neighbours(href),
  }
}

export type BlockPageData = NonNullable<Awaited<ReturnType<typeof blockPage>>>

/** The block as Markdown: what it is, what it is built with, how to adapt it, and its code. */
export function blockMarkdown(doc: BlockDoc, version: string = packageVersion()): string {
  const code = exampleSource(BLOCKS, doc.slug)
  const used = blockComponents(code)
  const peers = blockPeers(used)
  const out = [
    `# ${doc.title}`,
    "",
    doc.purpose,
    "",
    `- **Built with:** ${used.map((c) => (c.href ? `[${c.title}](${SITE.url}${c.href}.md)` : c.title)).join(", ")}`,
    ...(peers.length ? [`- **Also install:** ${peers.map((p) => `\`${p}\``).join(", ")}`] : []),
    `- **Page:** <${SITE.url}${blockHref(doc.slug)}> · ${SITE.package} ${version}`,
    "",
    "## Usage",
    "",
    doc.usage,
    "",
    "## Code",
    "",
    "```tsx",
    code.trimEnd(),
    "```",
  ]
  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`
}
