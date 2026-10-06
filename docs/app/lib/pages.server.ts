// The data each page is pre-rendered from. Loaders call these at build time, so Markdown, highlighting and the API
// tables never reach the browser.
import { components, componentHref, findComponent, findGuide, guideHref, neighbours } from "../content/registry.ts"
import { editUrl, sourceUrl } from "../content/site.ts"
import type { TocEntry } from "../content/types.ts"
import { highlight } from "./highlight.server.ts"
import { introspect, packageVersion } from "./introspect.server.ts"
import { describeProp, exampleSource, importLine, partBasis, sectionMarkdown } from "./markdown-copy.server.ts"
import { renderInline, renderMarkdown } from "./render-markdown.server.ts"

export async function componentPage(slug: string) {
  const doc = findComponent(slug)
  if (!doc) return null
  const info = introspect(slug, components.map((c) => c.slug))
  const href = componentHref(slug)

  const examples = await Promise.all(
    doc.examples.map(async (example) => {
      const code = exampleSource(slug, example.id)
      return {
        id: example.id,
        title: example.title,
        descriptionHtml: await renderInline(example.description),
        code,
        codeHtml: await highlight(code, "tsx"),
        frameHeight: example.frameHeight,
      }
    })
  )

  const parts = await Promise.all(
    info.parts.map(async (part) => ({
      name: part.name,
      slot: part.slot,
      basisHtml: part.basedOn ? await renderInline(partBasis(part) ?? "") : undefined,
      props: await Promise.all(
        part.props.map(async (prop) => ({
          ...prop,
          descriptionHtml: await renderInline(describeProp(doc, part.name, prop.name, prop.description)),
        }))
      ),
    }))
  )

  // The first example is the preview at the top of the page; the Examples section holds the rest. The API, its styling
  // hooks and the theme tokens close the page.
  const toc: TocEntry[] = [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    ...(doc.examples.length > 1
      ? [{ id: "examples", title: "Examples", children: doc.examples.slice(1).map((e) => ({ id: `example-${e.id}`, title: e.title })) }]
      : []),
    { id: "accessibility", title: "Accessibility" },
    { id: "api", title: "API Reference" },
  ]

  return {
    kind: "component" as const,
    slug,
    title: doc.title,
    category: doc.category,
    purpose: doc.purpose,
    version: packageVersion(),
    sourceHref: sourceUrl(`src/components/${slug}.tsx`),
    pattern: doc.links.apg,
    /** The packages to install: the library, and the extra packages this entry needs. */
    install: ["@booleanpress/ui", ...(doc.peers ?? [])],
    importCode: importLine(info),
    importHtml: await highlight(importLine(info), "tsx"),
    usageHtml: await renderMarkdown(doc.usage),
    examples,
    accessibility: {
      semanticsHtml: await renderInline(doc.accessibility.semantics),
      labelsHtml: await renderInline(doc.accessibility.labels),
      focusHtml: await renderInline(doc.accessibility.focus),
      limitsHtml: await Promise.all((doc.accessibility.limits ?? []).map((l) => renderInline(l))),
    },
    keyboard: await Promise.all(doc.keyboard.map(async (row) => ({ keys: row.keys, behaviourHtml: await renderInline(row.behaviour) }))),
    parts,
    helpersHtml: info.helpers.length
      ? await renderInline(`**Also exported:** ${info.helpers.map((h) => `\`${h.name}\`, ${h.description}`).join("; ")}.`)
      : undefined,
    strings: info.strings,
    dataAttributes: info.dataAttributes,
    tokens: info.tokens,
    themingHtml: doc.theming ? await renderMarkdown(doc.theming) : undefined,
    toc,
    neighbours: neighbours(href),
    editHref: editUrl(`docs/app/content/components/${slug}.ts`),
    markdownHref: `${href}.md`,
  }
}

export async function guidePage(slug: string) {
  const doc = findGuide(slug)
  if (!doc) return null
  const href = guideHref(slug)
  const sections = await Promise.all(
    doc.sections.map(async (section) => ({
      id: section.id,
      title: section.title,
      html: sectionMarkdown(section) ? await renderMarkdown(sectionMarkdown(section)) : undefined,
      widget: section.widget,
      tabs: section.tabs
        ? await Promise.all(section.tabs.map(async (tab) => ({ id: tab.id, label: tab.label, html: await renderMarkdown(tab.markdown) })))
        : undefined,
    }))
  )
  return {
    kind: "guide" as const,
    slug,
    title: doc.title,
    description: doc.description,
    version: packageVersion(),
    sections,
    toc: doc.sections.map((s) => ({ id: s.id, title: s.title })) as TocEntry[],
    neighbours: neighbours(href),
    editHref: editUrl(`docs/app/content/guides/${slug}.ts`),
    markdownHref: `${href}.md`,
  }
}

export type ComponentPageData = NonNullable<Awaited<ReturnType<typeof componentPage>>>
export type GuidePageData = NonNullable<Awaited<ReturnType<typeof guidePage>>>
