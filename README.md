# BooleanPress UI

Accessible React components for Tailwind CSS 4, built on [Radix](https://www.radix-ui.com) (and [Base UI](https://base-ui.com) where Radix has no primitive). Every
component has a spec, an example of each state its page documents and a test file run with axe; every example is
checked with axe again in a real browser, in light and dark; motion stays out of the way, and every
built-in word can be translated. 114 components, from buttons and fields to a data table, a tree, date pickers, an editor and a chat thread,
each with three sizes where it is a control, typed for TypeScript and imported from its own entry.

**Documentation:** <https://ui.booleanpress.com> · **Package:** [`@booleanpress/ui`](https://www.npmjs.com/package/@booleanpress/ui)
· **Licence:** MIT

## Supported

- React 19 with Tailwind CSS 4.1 or later.
- Release checks build the packed package in a Vite app and a Next.js App Router app (rendered on the
  server, then hydrated). WordPress hosts must meet the integration requirements below.
- Chrome 111, Safari 16.4 and Firefox 128 or later, the oldest Tailwind CSS 4 supports. The automated tests run in
  Chromium.

## Install in a React app

```sh
pnpm add @booleanpress/ui radix-ui lucide-react
pnpm add -D tailwindcss @tailwindcss/vite
```

Add `tailwindcss()` to the plugins in `vite.config.ts`, then start your stylesheet with Tailwind CSS and the theme:

```css
@import "tailwindcss";
@import "@booleanpress/ui/theme.css";
```

Render the provider once, around the app:

```tsx
import { BooleanUIProvider } from "@booleanpress/ui/provider"

createRoot(document.getElementById("root")!).render(
  <BooleanUIProvider>
    <App />
  </BooleanUIProvider>,
)
```

Some components need one more package, an optional peer you install only if you use them: Chart (`recharts`), Calendar
and the date pickers (`react-day-picker`), Toast (`sonner`), the combobox family, Drawer, Input OTP and Input number
(`@base-ui/react`), Carousel, Splitter, Data table, Virtual scroller, the drag-and-drop lists and Editor. The
[Installation](https://ui.booleanpress.com/docs/installation) page has the table and the command for each.

## Install in a WordPress plugin

A plugin's admin screen shares the page with WordPress's own stylesheets. Tailwind CSS's important mode lets the
utilities win, and the `overrides` layer, declared first, keeps the theme's motion rules above them:

```css
@layer overrides;
@import "tailwindcss" important;
@import "@booleanpress/ui/theme.css";
@import "./brand.css";
```

Pass the plugin's translated strings, the page's direction and a sidebar storage key of its own to the provider:

```tsx
<BooleanUIProvider strings={uiStrings} dir={isRtl ? "rtl" : "ltr"} sidebarStorageKey="my-plugin:sidebar">
  <App />
</BooleanUIProvider>
```

Use one shared React 19 / React DOM 19 runtime for the plugin and any add-on rendering in the same React tree.
Do not map these imports to WordPress's `wp.element` without verifying its React version and that all bundles use the
same instance. Add-ons must also share the provider module when they consume the same context.

Body-portalled overlays use `z-50`; that alone does not place them above WordPress's admin bar and menu. The host
plugin must establish compatible stacking on its own admin screen, such as lowering that screen's WordPress chrome
beneath the overlays. Scope those styles to the plugin screen and verify dialogs, nested selects, tooltips and focus
against the admin bar in desktop and mobile layouts. The library does not change WordPress chrome globally.

## A short example

```tsx
import { Button } from "@booleanpress/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@booleanpress/ui/dialog"

export function EditMailer() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit mailer</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Edit mailer</DialogTitle>
          <DialogDescription>Change the name and the sender address.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
```

## Theme it

Components use semantic colour tokens (`--primary`, `--muted`, `--ring` …), shadcn/ui's names, plus the package's own:
hover and press steps, `--highlight` for a selection, the field tokens (`--field`, and `--control` for the edge of a form
control) and the status tokens. The defaults are slate greys with a near-black primary. Give the tokens your values in
`brand.css`, light in `:root` and dark in `.dark`, and check every text colour against its surface (4.5:1) and every
control's edge (3:1). The defaults have ten border pairs below 3:1 and three rendered text pairs below 4.5:1 (unpressed toggles, unmet inline password rules and attached InputGroup text). See the [contrast exceptions and overrides](https://ui.booleanpress.com/docs/accessibility#default-colours). Check registered token pairs with:

```sh
npx bui-contrast src/brand.css
```

The CLI remains strict and reports the default border failures. It does not inspect rendered CSS or opacity; also
check component states in the browser. The [Theming](https://ui.booleanpress.com/docs/theming) page builds a palette with you and shows the verdict live.

## AI assistants

The library has a plugin for Claude Code, Codex, GitHub Copilot, Cursor and Gemini CLI. Its skills read the Markdown
documentation shipped inside the package, so the assistant works from the version you installed. In Claude Code:

```sh
claude plugin marketplace add booleanpress/ui
claude plugin install booleanpress-ui@booleanpress
```

The [Installation](https://ui.booleanpress.com/docs/installation#ai-assistants) page has the other clients' commands.

## Develop

You need Node.js 24 and pnpm 10. Once, after cloning:

```sh
pnpm install
pnpm exec playwright install chromium   # the browser the documentation's checks use
```

| Command | What it does |
| --- | --- |
| `pnpm docs:dev` | Starts the documentation site at <http://127.0.0.1:5180/>, reloading as you edit the components, the examples or the pages. |
| `pnpm docs:build` | Builds the static site into `docs/build/client`. |
| `pnpm docs:preview` | Serves that build at <http://127.0.0.1:5181/>, the way the host serves it. |
| `pnpm test` | Runs the component tests, axe included. `pnpm test:watch` reruns them as you edit. |
| `pnpm lint` | ESLint, with the accessibility rules. |
| `pnpm typecheck` | TypeScript over the source, the examples and the docs. |
| `pnpm build` | Builds runtime modules and types into `dist/`. |
| `pnpm docs:markdown` | Generates the versioned Markdown documentation shipped in `dist/docs/`, after the runtime build. |
| `pnpm check:fast` | Runs lint, types and unit tests for development and ordinary pull requests. |
| `pnpm check` | Runs the full release gate, including package, consumer and documentation checks. Every line must be green before release. |
| `pnpm bundle:size` | Reports internal entry sizes for inspection; excludes external dependencies and consumer CSS. |
| `pnpm fixture` | Builds the Vite, Next.js and Button-only apps in `fixture/` from the packed package. |

Stop the server with `Ctrl+C` in its terminal. If port 5180 is already in use, inspect its listener before stopping
anything; another process may own that port.

## Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) for how a change is made. Questions go to
[Discussions](https://github.com/booleanpress/ui/discussions), bugs to
[Issues](https://github.com/booleanpress/ui/issues), and security reports through the **Security** tab
([SECURITY.md](SECURITY.md)). Everyone taking part follows the [code of conduct](CODE_OF_CONDUCT.md).

## Licence

MIT, © 2026 BooleanPress. Components generated with the shadcn/ui CLI keep their MIT notice ([NOTICE](NOTICE)); every
change from stock shadcn/ui is recorded in [PATCHES.md](PATCHES.md).
