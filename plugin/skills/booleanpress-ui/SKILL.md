---
name: booleanpress-ui
description: Route any request about BooleanPress UI (@booleanpress/ui) — React components for Tailwind CSS 4 on Radix — to the one focused skill that owns it. Use first for setup, components, theming, accessibility, upgrades or audits in a project that uses or adds @booleanpress/ui.
---

# BooleanPress UI

Confirm the project uses or is adding `@booleanpress/ui` (its `package.json`, or the user says so). This plugin is for
that package only; for another component library, say so and stop.

Choose exactly one skill, the one that owns the outcome the user asked for:

- `booleanpress-ui-setup`: install the package, the stylesheet, the provider; a plain React app (Vite, Next.js) or a
  WordPress plugin's admin screen.
- `booleanpress-ui-components`: choose, compose and use components; forms, overlays, menus, tables, charts.
- `booleanpress-ui-theming`: brand colours, `brand.css`, the tokens, dark mode, radius, contrast.
- `booleanpress-ui-accessibility`: names, keyboard behaviour, focus, screen readers, translated strings, right-to-left.
- `booleanpress-ui-upgrade`: move to a newer version of the package.
- `booleanpress-ui-audit`: review a project's use of the package and fix what is wrong.

## Where the facts come from

The installed package carries its own documentation, matched to its version:

- `node_modules/@booleanpress/ui/dist/docs/llms.txt` lists every page;
- `node_modules/@booleanpress/ui/dist/docs/guides/<guide>.md` and `…/components/<component>.md` are the pages: import,
  usage, examples with their code, the accessibility notes, the keyboard table, the API (props, types, defaults), the
  provider strings and the theme tokens;
- `node_modules/@booleanpress/ui/dist/components/<component>.d.ts` are the types;
- `node_modules/@booleanpress/ui/CHANGELOG.md` and `PATCHES.md` say what changed and why.

Read them before writing code. When the package is not installed yet, the same pages are at
<https://ui.booleanpress.com/llms.txt> for the latest version. Never invent a component, part, prop, variant, token or
string key: if the installed documentation does not have it, it does not exist in that version.
