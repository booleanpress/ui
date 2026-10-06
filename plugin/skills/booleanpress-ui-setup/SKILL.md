---
name: booleanpress-ui-setup
description: Install and set up BooleanPress UI (@booleanpress/ui) in a React app (Vite or Next.js) or a WordPress plugin's admin screen — the package and its peers, the stylesheet order, the provider, translated strings and direction. Use for a new installation or a broken one.
---

# Set up BooleanPress UI

1. **Read the recipe of the installed version** in `node_modules/@booleanpress/ui/dist/docs/guides/installation.md`
   (before installing: <https://ui.booleanpress.com/docs/installation.md>). Follow its tab for the project: Vite (any
   plain React app), or WordPress plugin. Do not mix the two.
2. **Install** with the project's package manager: `@booleanpress/ui` and its peers `radix-ui`, `lucide-react`, React 19
   and Tailwind CSS 4.1 or later. Add `recharts`, `react-day-picker` or `sonner` only if the project uses Chart, Calendar
   or Toast. In a product, pin the exact version (no `^` or `~`).
3. **Stylesheet.** The project's main CSS starts with Tailwind CSS, then the theme:
   - plain React app: `@import "tailwindcss";` then `@import "@booleanpress/ui/theme.css";`
   - WordPress plugin: `@layer overrides;` first, then `@import "tailwindcss" important;`, the theme, and the plugin's
     own `brand.css`.

   The theme brings the tokens, the motion rules and an `@source` that lets Tailwind CSS find the package's classes; do
   not add `node_modules` paths by hand.
4. **Provider.** Render `BooleanUIProvider` from `@booleanpress/ui/provider` once, around the whole app. Pass `dir`
   (`"rtl"` for right-to-left languages), `strings` built with the project's own translation function, and, in a product
   that uses the sidebar, its own `sidebarStorageKey`. Set `dir` and the `dark` class on `<html>` as well.
5. **Verify**: run the project's type check (`tsc --noEmit` or its `typecheck` script) and build, then render one
   component (the installation page's "Your first component") and open it. If the project has a `brand.css`, add
   `bui-contrast src/brand.css` to its lint script.

Import each component from its own entry, `@booleanpress/ui/<component>`; never from `dist/` or `src/` paths.
