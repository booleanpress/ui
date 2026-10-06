// What a component's source says about itself, read at build time: its exports and parts, the element or primitive
// each part renders, its props (types, defaults and descriptions, from react-docgen-typescript), the provider strings
// it reads, its data attributes and the theme tokens its classes use.
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { basename, join } from "node:path"
import { withCompilerOptions, type ComponentDoc as DocgenDoc, type PropItem } from "react-docgen-typescript"
import ts from "typescript"
import { roots } from "./roots.server.ts"

export interface PropRow {
  name: string
  type: string
  default?: string
  required: boolean
  description: string
}

export interface PartInfo {
  name: string
  slot?: string
  /** What the part renders and forwards its other props to: an element (`div`) or a primitive (`Radix Dialog.Content`). */
  basedOn?: string
  props: PropRow[]
}

export interface TokenUse {
  token: string
  uses: string[]
}

/** An export that is not a part: a variants helper, a hook, or a part of another library re-exported. */
export interface HelperInfo {
  name: string
  description: string
}

export interface ComponentInfo {
  slug: string
  file: string
  exports: string[]
  parts: PartInfo[]
  helpers: HelperInfo[]
  strings: string[]
  dataAttributes: string[]
  tokens: TokenUse[]
}

const UTILITY_USE: Record<string, string> = {
  bg: "background",
  text: "text",
  border: "border",
  ring: "focus ring",
  outline: "outline",
  fill: "fill",
  stroke: "stroke",
  shadow: "shadow",
  divide: "divider",
  placeholder: "placeholder",
  caret: "caret",
  accent: "accent",
  decoration: "underline",
  from: "gradient",
  to: "gradient",
  via: "gradient",
}

function themeTokens(pkg: string): Set<string> {
  const css = readFileSync(join(pkg, "theme.css"), "utf8")
  const root = css.slice(css.indexOf(":root {"), css.indexOf("}", css.indexOf(":root {")))
  return new Set([...root.matchAll(/--([a-z0-9-]+):/g)].map((m) => m[1]))
}

/** The bodies of a module's top-level components, by name: `function X(` or `const X = (`. */
function functionBodies(source: string): Map<string, string> {
  const bodies = new Map<string, string>()
  const starts = [...source.matchAll(/^(?:function (\w+)(?:<[^(]*>)?\(|const (\w+) = \()/gm)].map((m) => Object.assign(m, { 1: m[1] ?? m[2] }))
  starts.forEach((match, i) => {
    const end = i + 1 < starts.length ? starts[i + 1].index : source.length
    bodies.set(match[1], source.slice(match.index, end))
  })
  return bodies
}

/** The library each `<Name>Primitive` import comes from, as the API table names it. */
function primitiveSources(source: string): Map<string, string> {
  const names: Record<string, string> = {
    "radix-ui": "Radix",
    "@base-ui/react": "Base UI",
    cmdk: "cmdk",
    recharts: "Recharts",
    sonner: "Sonner",
    "react-day-picker": "React DayPicker",
    "embla-carousel-react": "Embla",
    "react-resizable-panels": "React Resizable Panels",
    "@tanstack/react-table": "TanStack Table",
    "@tanstack/react-virtual": "TanStack Virtual",
    "@dnd-kit/core": "dnd kit",
    "@dnd-kit/sortable": "dnd kit",
    "@tiptap/react": "Tiptap",
  }
  // "@base-ui/react/drawer" is Base UI's: a module is named by its package.
  const library = (module: string) => names[module] ?? names[module.split("/").slice(0, module.startsWith("@") ? 2 : 1).join("/")]
  const sources = new Map<string, string>()
  for (const m of source.matchAll(/import \{([^}]+)\} from "([^"]+)"/g)) {
    for (const spec of m[1].split(",")) {
      const alias = spec.trim().match(/(?:\w+ as )?(\w+)$/)?.[1]
      if (alias && library(m[2])) sources.set(alias, library(m[2]))
    }
  }
  for (const m of source.matchAll(/import \* as (\w+) from "([^"]+)"/g)) if (library(m[2])) sources.set(m[1], library(m[2]))
  return sources
}

function basedOn(body: string, sources: Map<string, string>): string | undefined {
  const element = body.match(/ComponentProps<"(\w+)">/)
  if (element) return element[1]
  const member = body.match(/ComponentProps<typeof (\w+)\.(\w+)>/)
  if (member && sources.has(member[1])) {
    const library = sources.get(member[1])
    const primitive = member[1].replace(/Primitive$/, "")
    return library === "Recharts" ? `Recharts ${member[2]}` : `${library} ${primitive}.${member[2]}`
  }
  const whole = body.match(/ComponentProps<typeof (\w+)>/)
  if (whole && sources.has(whole[1])) return `${sources.get(whole[1])} ${whole[1].replace(/Primitive$/, "")}`
  return undefined
}

// A prop declared only in React's DOM types. A prop with no declaration at all (a `cva` variant prop such as `variant` or
// `size`) is the component's own and stays.
const isReactDomProp = (prop: PropItem) => {
  const declarations = prop.declarations ?? (prop.parent ? [prop.parent] : [])
  return declarations.length > 0 && declarations.every((d) => d.fileName.includes("@types/react"))
}

let cache: Map<string, DocgenDoc[]> | undefined
/** When each file was parsed (its modification time then), so the dev server parses a component again once it changes. */
const parsedAt = new Map<string, number>()
/** True when the props came from the build's file, which is read once and never goes stale within a build. */
let fromBuildFile = false

const modified = (file: string) => (existsSync(file) ? statSync(file).mtimeMs : 0)

function parse(files: string[], pkg: string): DocgenDoc[] {
  const src = join(pkg, "src")
  const parser = withCompilerOptions(
    {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2022,
      strict: true,
      skipLibCheck: true,
      paths: {
        "@/*": [join(src, "*")],
        "@booleanpress/ui/provider": [join(src, "provider.tsx")],
      },
    },
    {
      savePropValueAsString: true,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !isReactDomProp(prop),
    }
  )
  return parser.parse(files)
}

function api(files: string[], pkg: string): Map<string, DocgenDoc[]> {
  if (cache) {
    if (fromBuildFile) return cache
    // The dev server keeps this module between requests: parse again only the components edited since.
    const stale = files.filter((file) => !cache?.has(file) || parsedAt.get(file) !== modified(file))
    if (stale.length) {
      const times = stale.map(modified)
      const parsed = parse(stale, pkg)
      stale.forEach((file, i) => {
        cache?.set(file, parsed.filter((doc) => doc.filePath === file))
        parsedAt.set(file, times[i])
      })
    }
    return cache
  }
  // The docs build parses every component once, before pre-rendering (scripts/docs-api-cache.mjs), and hands the result
  // over in this file: parsing them all can take longer than the time React Router gives one pre-rendered page.
  const saved = process.env.BUI_API_CACHE
  if (saved && existsSync(saved)) {
    const data = JSON.parse(readFileSync(saved, "utf8")) as Record<string, DocgenDoc[]>
    if (files.every((file) => basename(file) in data)) {
      cache = new Map(files.map((file) => [file, data[basename(file)]]))
      fromBuildFile = true
      return cache
    }
  }
  const times = files.map(modified)
  const parsed = parse(files, pkg)
  cache = new Map()
  files.forEach((file, i) => {
    cache?.set(file, parsed.filter((doc) => doc.filePath === file))
    parsedAt.set(file, times[i])
  })
  return cache
}

/**
 * Parses every component's props once and writes them to `path`, for `BUI_API_CACHE`: the docs build runs it before
 * pre-rendering.
 */
export function writeApiCache(path: string, slugs: string[]): void {
  const { pkg } = roots()
  const files = slugs.map((slug) => join(pkg, "src", "components", `${slug}.tsx`))
  const parsed = api(files, pkg)
  writeFileSync(path, JSON.stringify(Object.fromEntries(files.map((file) => [basename(file), parsed.get(file) ?? []]))))
}

/** Radix type names a reader would have to look up, written out. */
const TYPE_ALIASES: Record<string, string> = {
  CheckedState: 'boolean | "indeterminate"',
}

/**
 * A prop's description as Markdown the page can render inline: the prose before any JSDoc tag line (`@example`,
 * `@see` …), with `<` outside code spans escaped, so HTML in a dependency's comments stays text.
 */
function cleanDescription(text: string): string {
  // A prop typed as a union (Radix's single or multiple Accordion) carries each member's comment, one per line; a line
  // that opens as an earlier one does is the same sentence for the other member, and is left out.
  const opening = (line: string) => line.split(/\s+/).slice(0, 4).join(" ")
  const lines = text.split(/\n\s*@\w+/)[0].split("\n").map((line) => line.trim()).filter(Boolean)
  const prose = lines.filter((line, i) => !lines.slice(0, i).some((earlier) => opening(earlier) === opening(line))).join(" ")
  return prose
    .split(/(`[^`]*`)/)
    .map((part) => (part.startsWith("`") ? part : part.replace(/</g, "&lt;")))
    .join("")
}

function typeText(prop: PropItem): string {
  const { type } = prop
  if (type.name === "enum" && Array.isArray(type.value)) return type.value.map((v: { value: string }) => v.value).join(" | ")
  const text = type.raw ?? type.name
  return Object.entries(TYPE_ALIASES).reduce((out, [alias, full]) => out.replace(new RegExp(`\\b${alias}\\b`, "g"), full), text)
}

export function introspect(slug: string, allSlugs: string[]): ComponentInfo {
  const { pkg } = roots()
  const fileOf = (s: string) => join(pkg, "src", "components", `${s}.tsx`)
  const file = fileOf(slug)
  const source = readFileSync(file, "utf8")
  const exportList = source.match(/export \{([^}]+)\}/)
  const exports = exportList ? exportList[1].split(",").map((s) => s.trim()).filter(Boolean) : []
  const bodies = functionBodies(source)
  const sources = primitiveSources(source)
  const docs = api(allSlugs.map(fileOf), pkg).get(file) ?? []

  const isPart = (name: string) => bodies.has(name) && /^[A-Z]/.test(name)
  const helpers: HelperInfo[] = exports
    .filter((name) => !isPart(name))
    .map((name) => {
      // `export { …, type DataTableProps }`: a type, not a value.
      const typeOnly = name.match(/^type\s+(\w+)$/)
      if (typeOnly) return { name: typeOnly[1], description: "a TypeScript type" }
      const component = name.replace(/Variants$/, "").replace(/^\w/, (c) => c.toUpperCase())
      const reexport = source.match(new RegExp(`const ${name} = (\\w+)\\.(\\w+)`))
      const description = name.endsWith("Variants")
        ? `the class names of ${component}'s variants and sizes (\`cva\`), to give another element the same look`
        : name.startsWith("use")
          ? `a hook for the parts' shared state; call it inside the component's provider`
          : reexport && sources.has(reexport[1])
            ? `\`${reexport[2]}\` from ${sources.get(reexport[1])}, re-exported`
            : "a helper the parts use"
      return { name, description }
    })
  const parts: PartInfo[] = exports
    .filter(isPart)
    .map((name) => {
      const body = bodies.get(name) ?? ""
      const doc = docs.find((d) => d.displayName === name)
      const props = Object.values(doc?.props ?? {})
        .filter((prop) => prop.name !== "ref" && prop.name !== "key")
        .map((prop) => ({
          name: prop.name,
          type: typeText(prop),
          default: prop.defaultValue?.value != null ? String(prop.defaultValue.value) : undefined,
          required: prop.required,
          description: cleanDescription(prop.description),
        }))
        .sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
      return { name, slot: body.match(/data-slot="([^"]+)"/)?.[1], basedOn: basedOn(body, sources), props }
    })

  const strings = [...new Set([...source.matchAll(/strings\.(\w+)/g)].map((m) => m[1]))]
  const dataAttributes = [...new Set([...source.matchAll(/\b(data-(?!slot)[a-z-]+)=\{/g)].map((m) => m[1]))]

  const known = themeTokens(pkg)
  const uses = new Map<string, Set<string>>()
  for (const m of source.matchAll(/(?<![\w-])(?:[a-z0-9-]+:)*(bg|text|border|ring|outline|fill|stroke|shadow|divide|placeholder|caret|accent|decoration|from|to|via)-([a-z][a-z0-9-]*?)(?:\/\d+)?(?=[\s"'`)\]]|$)/g)) {
    const [, utility, name] = m
    if (!known.has(name)) continue
    if (!uses.has(name)) uses.set(name, new Set())
    uses.get(name)?.add(UTILITY_USE[utility])
  }
  const tokens = [...uses].map(([token, set]) => ({ token, uses: [...set] })).sort((a, b) => a.token.localeCompare(b.token))

  return { slug, file, exports, parts, helpers, strings, dataAttributes, tokens }
}

/** The package's version, as the docs show it. */
export function packageVersion(): string {
  const { pkg } = roots()
  return JSON.parse(readFileSync(join(pkg, "package.json"), "utf8")).version
}
