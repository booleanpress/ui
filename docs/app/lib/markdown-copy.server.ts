// Every page as Markdown: the copy that ships in the package for AI assistants (dist/docs/) and that the site serves
// beside each page (/components/<slug>.md, /docs/<slug>.md, /llms.txt). Built from the same data as the HTML pages.
import { readFileSync } from "node:fs"
import { keysText } from "./keys.ts"
import { join } from "node:path"
import { SITE, sourceUrl } from "../content/site.ts"
import { blockHref, blocks, components, componentHref, guideHref, guides } from "../content/registry.ts"
import type { ComponentDoc, GuideDoc, GuideSection } from "../content/types.ts"
import { introspect, packageVersion, type ComponentInfo, type PartInfo } from "./introspect.server.ts"
import { roots } from "./roots.server.ts"

const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\n+/g, " ")

export function exampleSource(slug: string, id: string): string {
  return readFileSync(join(roots().examples, slug, `${id}.tsx`), "utf8")
}

export function importLine(info: ComponentInfo): string {
  return `import { ${info.exports.filter((name) => /^[A-Z]/.test(name)).join(", ")} } from "${SITE.package}/${info.slug}"`
}

/** One sentence per part: what it renders and forwards its other props to. */
export function partBasis(part: PartInfo): string | undefined {
  if (!part.basedOn) return undefined
  return part.basedOn.includes(" ")
    ? `Renders ${part.basedOn} and passes it every other prop.`
    : `Renders a \`${part.basedOn}\` and passes it every other prop.`
}

export function describeProp(doc: ComponentDoc, part: string, name: string, own: string): string {
  return own || doc.props?.[part]?.[name] || ""
}

function apiMarkdown(doc: ComponentDoc, info: ComponentInfo): string {
  const out: string[] = []
  for (const part of info.parts) {
    out.push(`### ${part.name}`, "")
    const basis = partBasis(part)
    if (basis) out.push(basis, "")
    if (part.props.length) {
      out.push("| Prop | Type | Default | Description |", "| --- | --- | --- | --- |")
      for (const prop of part.props) {
        const description = describeProp(doc, part.name, prop.name, prop.description)
        out.push(
          `| \`${prop.name}\`${prop.required ? " (required)" : ""} | \`${cell(prop.type)}\` | ${prop.default ? `\`${cell(prop.default)}\`` : ""} | ${cell(description)} |`
        )
      }
      out.push("")
    }
  }
  if (info.helpers.length) out.push(`**Also exported:** ${info.helpers.map((h) => `\`${h.name}\`, ${h.description}`).join("; ")}.`, "")
  out.push("Every part takes `className`, merged with its defaults by `cn()`, and `ref`, which reaches the element it renders.", "")
  const slots = info.parts.filter((p) => p.slot).map((p) => `\`data-slot="${p.slot}"\` (${p.name})`)
  if (slots.length) out.push(`**Data attributes:** ${slots.join(", ")}${info.dataAttributes.length ? `, and ${info.dataAttributes.map((a) => `\`${a}\``).join(", ")}` : ""}.`, "")
  if (info.strings.length) out.push(`**Provider strings:** ${info.strings.map((s) => `\`${s}\``).join(", ")} (\`BooleanUIProvider\`'s \`strings\`).`, "")
  return out.join("\n")
}

export function componentMarkdown(doc: ComponentDoc, version: string = packageVersion()): string {
  const info = introspect(doc.slug, components.map((c) => c.slug))
  const out = [
    `# ${doc.title}`,
    "",
    doc.purpose,
    "",
    `- **Import:** \`${importLine(info)}\``,
    ...(doc.peers?.length ? [`- **Also install:** ${doc.peers.map((p) => `\`${p}\``).join(", ")}`] : []),
    ...(doc.links.radix ? [`- **${doc.links.radix.label}:** <${doc.links.radix.href}>`] : []),
    ...(doc.links.apg ? [`- **${doc.links.apg.label}:** <${doc.links.apg.href}>`] : []),
    `- **Page:** <${SITE.url}${componentHref(doc.slug)}> · ${SITE.package} ${version}`,
    "",
    "## Usage",
    "",
    doc.usage,
    "",
    "## Examples",
    "",
  ]
  for (const example of doc.examples) {
    out.push(`### ${example.title}`, "", example.description, "", "```tsx", exampleSource(doc.slug, example.id).trimEnd(), "```", "")
  }
  out.push("## Accessibility", "", `**Semantics.** ${doc.accessibility.semantics}`, "", `**Labels.** ${doc.accessibility.labels}`, "", `**Focus.** ${doc.accessibility.focus}`, "")
  if (doc.accessibility.limits?.length) out.push("**Known limits.**", "", ...doc.accessibility.limits.map((l) => `- ${l}`), "")
  out.push("### Keyboard", "", "| Key | Behaviour |", "| --- | --- |", ...doc.keyboard.map((row) => `| ${keysText(row.keys)} | ${cell(row.behaviour)} |`), "")
  out.push("## API", "", apiMarkdown(doc, info))
  out.push("## Theming", "")
  if (doc.theming) out.push(doc.theming, "")
  if (info.tokens.length) out.push("| Token | Used for |", "| --- | --- |", ...info.tokens.map((t) => `| \`--${t.token}\` | ${t.uses.join(", ")} |`), "")
  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`
}

/** The earliest `@since` version among a component's exports. */
function sinceVersion(slug: string): string {
  const source = readFileSync(join(roots().pkg, "src", "components", `${slug}.tsx`), "utf8")
  const versions = [...source.matchAll(/@since (\d+)\.(\d+)\.(\d+)/g)].map((m) => [Number(m[1]), Number(m[2]), Number(m[3])])
  versions.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
  return versions.length ? versions[0].join(".") : ""
}

/** Markdown written from the package at build time: its changelog, or the table of every component. */
export function generatedMarkdown(kind: NonNullable<GuideSection["generated"]>): string {
  if (kind === "changelog") {
    const changelog = readFileSync(join(roots().pkg, "CHANGELOG.md"), "utf8")
    // The releases only, each a level below the section that holds them.
    return changelog.slice(changelog.indexOf("\n## ") + 1).replace(/^## /gm, "### ").trim()
  }
  const rows = components.map((c) => {
    const spec = `[${c.links.spec.replace(/^specs\//, "").replace(/#.*$/, "")}](${sourceUrl(c.links.spec)})`
    return `| [${c.title}](${componentHref(c.slug)}) | ${c.category} | ${sinceVersion(c.slug)} | ${c.examples.length} | ${c.keyboard.length || "none"} | ${spec} |`
  })
  return [
    `${components.length} components. Each has a spec, a test file with axe, and an example of each state its page documents; every example is checked with axe again in a real browser, in both themes.`,
    "",
    "| Component | Category | Since | Examples | Keyboard rows | Spec |",
    "| --- | --- | --- | ---: | ---: | --- |",
    ...rows,
  ].join("\n")
}

/** A section's Markdown: what it was written with, then what is generated for it. */
export function sectionMarkdown(section: GuideSection): string {
  return [section.markdown, section.generated ? generatedMarkdown(section.generated) : undefined].filter(Boolean).join("\n\n")
}

export function guideMarkdown(doc: GuideDoc): string {
  const out = [`# ${doc.title}`, "", doc.description, ""]
  for (const section of doc.sections) {
    out.push(`## ${section.title}`, "")
    const markdown = sectionMarkdown(section)
    if (markdown) out.push(markdown, "")
    for (const tab of section.tabs ?? []) out.push(`### ${tab.label}`, "", tab.markdown, "")
  }
  return `${out.join("\n").replace(/\n{3,}/g, "\n\n").trim()}\n`
}

/**
 * The index, in the llms.txt format. `base` turns a page into its Markdown address: the site's or the package's. The
 * blocks are listed when `base` has an address for them (the site's).
 */
export function llmsIndex(
  base: { guide: (slug: string) => string; component: (slug: string) => string; block?: (slug: string) => string },
  version: string = packageVersion()
): string {
  const blockAddress = base.block
  const out = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    `Package \`${SITE.package}\`, version ${version}. Import each component from its own entry, \`${SITE.package}/<component>\`; render \`BooleanUIProvider\` from \`${SITE.package}/provider\` once around the app; start the stylesheet with \`@import "tailwindcss";\` and \`@import "${SITE.package}/theme.css";\`.`,
    "",
    "## Get started",
    "",
    ...guides.map((g) => `- [${g.title}](${base.guide(g.slug)}): ${g.description}`),
    "",
    "## Components",
    "",
    ...components.map((c) => `- [${c.title}](${base.component(c.slug)}): ${c.purpose}`),
    ...(blockAddress ? ["", "## Blocks", "", ...blocks.map((b) => `- [${b.title}](${blockAddress(b.slug)}): ${b.purpose}`)] : []),
  ]
  return `${out.join("\n")}\n`
}

export const siteMarkdownBase = {
  guide: (slug: string) => `${SITE.url}${guideHref(slug)}.md`,
  component: (slug: string) => `${SITE.url}${componentHref(slug)}.md`,
  block: (slug: string) => `${SITE.url}${blockHref(slug)}.md`,
}

export const packageMarkdownBase = {
  guide: (slug: string) => `guides/${slug}.md`,
  component: (slug: string) => `components/${slug}.md`,
  block: (slug: string) => `blocks/${slug}.md`,
}
