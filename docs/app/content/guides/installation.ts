import { componentHref, components } from "../registry.ts"
import type { GuideDoc } from "../types.ts"


/**
 * The optional packages: one row per set of packages, with the components that need it and the command that adds it.
 * Written from each component page's `peers` when the page is rendered, so a new component's packages join the table
 * with its page.
 */
function optionalPackages(): string {
  const rows = new Map<string, string[]>()
  for (const component of components) {
    const peers = component.peers ?? []
    if (!peers.length) continue
    const command = `pnpm add ${peers.join(" ")}`
    rows.set(command, [...(rows.get(command) ?? []), `[${component.title}](${componentHref(component.slug)})`])
  }
  return [
    "| Components | Install |",
    "| --- | --- |",
    ...[...rows.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([command, links]) => `| ${links.join(", ")} | \`${command}\` |`),
  ].join("\n")
}

export default {
  slug: "installation",
  title: "Installation",
  description: "Add the package to a React app or a WordPress plugin, and render your first component.",
  sections: [
    {
      id: "requirements",
      title: "Requirements",
      markdown: `React 19 and Tailwind CSS 4.1 or later. The package's own dependencies install with it; React, Radix, the icons and Tailwind CSS are peers, so your app keeps one copy of each. Some components need one more package, which you add only if you use them: see [Optional packages](#optional-packages). Their pages say so under **Import**.`,
    },
    {
      id: "set-up",
      title: "Set up",
      tabs: [
        {
          id: "vite",
          label: "Vite",
          markdown: `Create the app, then add the package, its peers and Tailwind CSS:

\`\`\`sh
pnpm create vite my-app --template react-ts --no-interactive
cd my-app
pnpm add @booleanpress/ui radix-ui lucide-react
pnpm add -D tailwindcss @tailwindcss/vite
\`\`\`

Add Tailwind CSS to \`vite.config.ts\`:

\`\`\`ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
\`\`\`

Replace \`src/index.css\` with Tailwind CSS and the theme. The theme brings the colour tokens, the motion and the overlay rules, and tells Tailwind CSS to find the package's classes:

\`\`\`css
@import "tailwindcss";
@import "@booleanpress/ui/theme.css";
\`\`\`

Render the provider once, around the app, in \`src/main.tsx\`:

\`\`\`tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BooleanUIProvider } from "@booleanpress/ui/provider"
import App from "./App"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BooleanUIProvider>
      <App />
    </BooleanUIProvider>
  </StrictMode>,
)
\`\`\``,
        },
        {
          id: "wordpress",
          label: "WordPress plugin",
          markdown: `A plugin's admin screen shares the page with WordPress's own stylesheets, which are not in a CSS layer. Tailwind CSS's important mode lets the utilities win, and the \`overrides\` layer, declared first, keeps the theme's motion rules above them:

\`\`\`sh
pnpm add @booleanpress/ui radix-ui lucide-react react@^19 react-dom@^19
pnpm add -D tailwindcss @tailwindcss/vite
\`\`\`

\`\`\`css
@layer overrides;
@import "tailwindcss" important;
@import "@booleanpress/ui/theme.css";
@import "./brand.css";
\`\`\`

\`brand.css\` holds your colours: values for the token names in \`:root\` and \`.dark\`, nothing else. Pass your translated strings, built with your plugin's own translation function, to the provider, and give the sidebar a storage key of its own:

\`\`\`tsx
<BooleanUIProvider strings={uiStrings} dir={isRtl ? "rtl" : "ltr"} sidebarStorageKey="my-plugin:sidebar">
  <App />
</BooleanUIProvider>
\`\`\`

**React runtime.** Use one shared React 19 and React DOM 19 instance for the plugin and any add-on rendering in its React tree. Installing peers does not ensure independently compiled bundles share a runtime. Do not alias React to WordPress's \`wp.element\` without verifying its version and that every participating bundle resolves the same instance. Add-ons that consume the same provider context must also share the provider module.

**Overlay stacking.** Overlays normally portal to \`<body>\` and use \`z-50\`. This does not automatically place them above WordPress's admin bar or menu. The host plugin must establish compatible stacking on its own screen, for example by lowering that screen's WordPress chrome below the overlays. Scope any host CSS to the plugin's admin page; the library does not globally restyle WordPress chrome. Verify a dialog, a select inside it, a dropdown and a tooltip against the admin bar/menu at desktop and mobile widths, including keyboard focus and Escape.

Check your palette with the contrast check in your lint script: \`bui-contrast src/brand.css\`.`,
        },
      ],
    },
    {
      id: "first-component",
      title: "Your first component",
      markdown: `Import each component from its own entry. Replace \`src/App.tsx\` with a button that opens a dialog:

\`\`\`tsx
import { Button } from "@booleanpress/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@booleanpress/ui/dialog"

export default function App() {
  return (
    <main className="p-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>It works</DialogTitle>
            <DialogDescription>Press Escape to close this dialog.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  )
}
\`\`\`

Run \`pnpm dev\` and open the address it prints. The button opens the dialog, and Escape closes it.`,
    },
    {
      id: "the-provider",
      title: "The provider",
      markdown: `\`BooleanUIProvider\` holds what every component shares. Render it once, around the whole app; every prop is optional, and a component outside a provider uses the defaults.

| Prop | Default | What it sets |
| --- | --- | --- |
| \`strings\` | English | The components' built-in text, translated: see [Strings](/docs/strings). A missing key keeps its English default. |
| \`dir\` | \`"ltr"\` | \`"ltr"\` or \`"rtl"\`: the direction the components behave in (arrow keys, sliders, the carousel). See [Right-to-left](/docs/right-to-left), and set \`dir\` on \`<html>\` as well. |
| \`controlSize\` | \`"default"\` | \`"sm"\`, \`"default"\` or \`"lg"\`: the size of every control given no \`size\`, fields 28, 35 or 42 px tall. See [Sizes and the filled look](/docs/theming#sizes-and-filled). |
| \`fieldVariant\` | \`"default"\` | \`"default"\` or \`"filled"\`: the look of every field given no \`variant\`; \`filled\` puts them on the grey \`--field-filled\` fill. |
| \`locale\` | the runtime's | The BCP 47 locale numbers and dates are formatted in, such as \`"de-DE"\` (WordPress's \`"de_DE"\` works too): usually the site's. |
| \`timeZone\` | the browser's | The IANA time zone dates and times are shown in, such as \`"Europe/Berlin"\`: usually the site's. |
| \`tooltipDelay\` | \`500\` | Milliseconds before a tooltip opens. |
| \`tooltipSkipDelay\` | \`0\` | Milliseconds after a tooltip closes during which the next one opens at once. |
| \`sidebarStorageKey\` | \`"booleanpress-ui:sidebar"\` | The local-storage key of the sidebar's collapsed state. Give each product its own. |

**Server rendering.** A server-rendered app (Next.js, React Router or Remix with server rendering) should pass \`locale\`, and \`timeZone\` when it shows dates or times. Without them, \`Intl\` formats in the server's locale and zone on the server and in the reader's in the browser; where the two differ, the text differs and React's hydration fails. Components read nothing from the page while they render, so with both props set the server and the browser write the same text.

\`\`\`tsx
<BooleanUIProvider locale="de-DE" timeZone="Europe/Berlin" controlSize="sm">
  <App />
</BooleanUIProvider>
\`\`\`

**A provider inside another** changes only the props it is given and inherits the rest from the one above, strings key by key. Wrap a part of the page to format it in another locale while it keeps the app's direction, strings and sizes:

\`\`\`tsx
<BooleanUIProvider locale="de-DE">
  <InvoiceTotals />
</BooleanUIProvider>
\`\`\`

In a WordPress plugin, pass the user's locale from \`get_user_locale()\` and the site's time zone from \`wp_timezone_string()\` as they come: the provider turns \`de_DE\` and \`de_DE_formal\` into \`de-DE\`, and a site set to a whole-hour offset (\`+02:00\`) into the matching zone. A locale or zone \`Intl\` cannot read falls back to the browser's, so a bad value never breaks a page. Read them in your own code with \`useUiLocale()\` from \`@booleanpress/ui/provider\`, and give them to \`Intl\`: \`new Intl.NumberFormat(locale)\`.`,
    },
    {
      id: "optional-packages",
      title: "Optional packages",
      // A getter, so the table is written when the page renders, from the component pages the registry holds by then.
      get markdown() {
        return `React, React DOM, Radix, the icons and Tailwind CSS are the peers every app installs. The packages below are optional peers: add one only when you use a component that needs it. Each component's page names its packages under **Import**.

${optionalPackages()}

The table counts the packages a component needs through another it builds on: Date picker is there for its calendar. An app that uses none of these components installs none of them, and its bundle holds none of their code.`
      },
    },
    {
      id: "ai-assistants",
      title: "AI assistants",
      markdown: `The library has a plugin for AI coding assistants. Its seven skills set the package up, choose and compose components, theme them, check accessibility, upgrade between versions and audit a project. They read the Markdown documentation that ships inside the package, so the assistant works from the version you installed, offline. The repository is the plugin's marketplace.`,
      tabs: [
        {
          id: "claude-code",
          label: "Claude Code",
          markdown: `\`\`\`sh
claude plugin marketplace add booleanpress/ui
claude plugin install booleanpress-ui@booleanpress
\`\`\`

Update it with \`claude plugin marketplace update booleanpress\`, then \`claude plugin update booleanpress-ui@booleanpress\`.`,
        },
        {
          id: "codex",
          label: "Codex",
          markdown: `\`\`\`sh
codex plugin marketplace add booleanpress/ui
codex plugin add booleanpress-ui@booleanpress
\`\`\``,
        },
        {
          id: "copilot",
          label: "GitHub Copilot",
          markdown: `\`\`\`sh
copilot plugin marketplace add booleanpress/ui
copilot plugin install booleanpress-ui@booleanpress
\`\`\`

VS Code finds plugins installed by the Copilot CLI.`,
        },
        {
          id: "cursor",
          label: "Cursor",
          markdown: `Clone the repository and link the plugin into Cursor's local plugins, then reload the window:

\`\`\`sh
git clone https://github.com/booleanpress/ui.git booleanpress-ui
ln -s "$PWD/booleanpress-ui/plugin" ~/.cursor/plugins/local/booleanpress-ui
\`\`\``,
        },
        {
          id: "gemini",
          label: "Gemini CLI",
          markdown: `\`\`\`sh
git clone https://github.com/booleanpress/ui.git booleanpress-ui
gemini extensions install ./booleanpress-ui/plugin --consent
\`\`\``,
        },
        {
          id: "any",
          label: "Any assistant",
          markdown: `Point it at \`node_modules/@booleanpress/ui/dist/docs/llms.txt\`, the index of every page for the installed version, or at [llms.txt](/llms.txt) on this site for the latest.`,
        },
      ],
    },
  ],
} satisfies GuideDoc
