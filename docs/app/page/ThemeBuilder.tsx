import * as React from "react"
import { MIN, MIN_EDGE, measure, readThemes, type Tokens } from "@bui-package/bin/contrast-core.mjs"
import themeCss from "@bui-package/theme.css?raw"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@booleanpress/ui/card"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"
import { Progress } from "@booleanpress/ui/progress"
import { Switch } from "@booleanpress/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"
import { useIsDark } from "~/lib/settings.tsx"
import { CopyButton } from "./CopyButton.tsx"

/** The primary colours on offer: a hue at a fixed lightness and chroma, or the package's neutral default. */
const PRESETS = [
  { id: "neutral", label: "Neutral", hue: null },
  { id: "blue", label: "Blue", hue: 262 },
  { id: "violet", label: "Violet", hue: 292 },
  { id: "teal", label: "Teal", hue: 190 },
  { id: "green", label: "Green", hue: 152 },
  { id: "orange", label: "Orange", hue: 45 },
  { id: "rose", label: "Rose", hue: 12 },
] as const

const RADII = ["0", "0.25rem", "0.5rem", "0.625rem", "0.75rem", "1rem"] as const

const DEFAULTS = readThemes(themeCss)
const WHITE = "oklch(0.985 0 0)"
const BLACK = "oklch(0.145 0 0)"

/** The text colour that reads best on a surface: near-white, unless near-black passes and white does not. */
function foregroundFor(surface: string, theme: "light" | "dark"): string {
  const passes = (text: string) => measure({ ...DEFAULTS.light, primary: surface, "primary-foreground": text }, theme).find((r) => r.surface === "bg-primary")?.ratio ?? 0
  return passes(WHITE) >= MIN || passes(WHITE) >= passes(BLACK) ? WHITE : BLACK
}

/**
 * The brand tokens for a hue (or the defaults, for neutral) and a radius, in the light and the dark theme: the primary
 * colour with its hover and press steps, and the highlight of selected options as a tint of it.
 */
function brandTokens(hue: number | null, radius: string): { light: Tokens; dark: Tokens } {
  if (hue === null) return { light: { radius }, dark: {} }
  const light = `oklch(0.55 0.2 ${hue})`
  const dark = `oklch(0.72 0.16 ${hue})`
  const lightText = foregroundFor(light, "light")
  const darkText = foregroundFor(dark, "dark")
  // Hover and press step away from the text colour, so the text stays readable on them: darker under white text,
  // lighter under near-black text (a green or teal primary).
  const lightSteps = lightText === WHITE ? ["0.5 0.2", "0.45 0.19"] : ["0.6 0.19", "0.65 0.17"]
  const darkSteps = darkText === WHITE ? ["0.66 0.16", "0.6 0.15"] : ["0.78 0.14", "0.84 0.12"]
  return {
    light: {
      primary: light,
      "primary-foreground": lightText,
      "primary-hover": `oklch(${lightSteps[0]} ${hue})`,
      "primary-active": `oklch(${lightSteps[1]} ${hue})`,
      highlight: `oklch(0.97 0.02 ${hue})`,
      "highlight-foreground": `oklch(0.45 0.19 ${hue})`,
      "highlight-focus": `oklch(0.93 0.04 ${hue})`,
      ring: "var(--primary)",
      "sidebar-primary": "var(--primary)",
      "sidebar-primary-foreground": "var(--primary-foreground)",
      radius,
    },
    dark: {
      primary: dark,
      "primary-foreground": darkText,
      "primary-hover": `oklch(${darkSteps[0]} ${hue})`,
      "primary-active": `oklch(${darkSteps[1]} ${hue})`,
      highlight: `oklch(0.72 0.16 ${hue} / 16%)`,
      "highlight-foreground": "#ffffff",
      "highlight-focus": `oklch(0.72 0.16 ${hue} / 24%)`,
    },
  }
}

const block = (selector: string, tokens: Tokens) =>
  Object.keys(tokens).length ? `${selector} {\n${Object.entries(tokens).map(([k, v]) => `  --${k}: ${v};`).join("\n")}\n}` : ""

/** What bui-contrast would report for the brand on top of the defaults: the failing pairs, in both themes. */
function verdict(brand: { light: Tokens; dark: Tokens }) {
  const light = { ...DEFAULTS.light, ...brand.light }
  const themes = { light, dark: { ...light, ...DEFAULTS.dark, ...brand.dark } }
  let pairs = 0
  const failures: string[] = []
  for (const [theme, tokens] of Object.entries(themes) as ["light" | "dark", Tokens][]) {
    for (const row of measure(tokens, theme)) {
      pairs += 1
      if (row.ratio === null || row.ratio < row.min) failures.push(`${theme}: ${row.text} on ${row.surface} ${row.ratio?.toFixed(2) ?? "?"}:1`)
    }
  }
  return { pairs, failures }
}

/** The theming page's builder: pick a primary colour and a radius, watch the components follow, copy brand.css. */
export function ThemeBuilder() {
  const [preset, setPreset] = React.useState<string>("blue")
  const [radius, setRadius] = React.useState<string>("0.5rem")
  const dark = useIsDark()
  const hue = PRESETS.find((p) => p.id === preset)?.hue ?? null
  const brand = brandTokens(hue, radius)
  const css = [`/* brand.css — after @import "@booleanpress/ui/theme.css"; */`, block(":root", brand.light), block(".dark", brand.dark)].filter(Boolean).join("\n\n")
  const { pairs, failures } = verdict(brand)
  const active = { ...brand.light, ...(dark ? brand.dark : {}) }
  const style = Object.fromEntries(Object.entries(active).map(([k, v]) => [`--${k}`, v])) as React.CSSProperties

  return (
    <div className="flex flex-col gap-5 rounded-lg border bg-card p-5">
      <div className="flex flex-col gap-2">
        <Label id="theme-primary">Primary colour</Label>
        <ToggleGroup type="single" variant="outline" value={preset} onValueChange={(v) => v && setPreset(v)} aria-labelledby="theme-primary" className="flex-wrap">
          {PRESETS.map((p) => (
            <ToggleGroupItem key={p.id} value={p.id} className="gap-2 px-3">
              <span aria-hidden className="size-3 rounded-full border" style={{ background: p.hue === null ? "#020617" : `oklch(0.55 0.2 ${p.hue})` }} />
              {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-2">
        <Label id="theme-radius">Radius</Label>
        <ToggleGroup type="single" variant="outline" value={radius} onValueChange={(v) => v && setRadius(v)} aria-labelledby="theme-radius" className="flex-wrap">
          {RADII.map((r) => (
            <ToggleGroupItem key={r} value={r} className="px-3 font-mono text-xs">
              {r}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div style={style} className="rounded-lg bg-background p-4" data-testid="theme-preview">
        <Card>
          <CardHeader>
            <CardTitle>Delivery</CardTitle>
            <CardDescription>The components below follow the tokens you pick.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button>Save changes</Button>
              <Button variant="outline">Cancel</Button>
              <Badge>Active</Badge>
              <Badge variant="secondary">Draft</Badge>
            </div>
            <Tabs defaultValue="mailers">
              <TabsList aria-label="Sections">
                <TabsTrigger value="mailers">Mailers</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>
              <TabsContent value="mailers" className="text-sm text-muted-foreground">
                Two mailers send this site's email.
              </TabsContent>
              <TabsContent value="logs" className="text-sm text-muted-foreground">
                1,284 messages this week.
              </TabsContent>
            </Tabs>
            <div className="flex flex-col gap-2">
              <Label htmlFor="theme-from">From address</Label>
              <Input id="theme-from" defaultValue="hello@example.com" />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="theme-track" defaultChecked />
                <Label htmlFor="theme-track">Track opens</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="theme-logs" defaultChecked />
                <Label htmlFor="theme-logs">Keep logs</Label>
              </div>
            </div>
            <Progress value={64} aria-label="Monthly quota used" />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">brand.css</span>
          <CopyButton code={css} label="Copy brand.css" />
        </div>
        <pre tabIndex={0} aria-label="brand.css" className="max-h-72 overflow-auto rounded-lg border bg-[var(--docs-ground)] p-4 font-mono text-sm focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <code>{css}</code>
        </pre>
        <p role="status" className={failures.length ? "text-sm text-destructive-strong" : "text-sm text-muted-foreground"}>
          {failures.length
            ? `bui-contrast: ${failures.length} of ${pairs} pairs below their minimum (text ${MIN}:1, control edges ${MIN_EDGE}:1) — ${failures.join("; ")}`
            : `bui-contrast: every text/surface pair ≥ ${MIN}:1 and every control edge ≥ ${MIN_EDGE}:1 (light and dark), ${pairs} pairs.`}
        </p>
      </div>
    </div>
  )
}
