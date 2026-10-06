---
name: booleanpress-ui-audit
description: Audit a project's use of BooleanPress UI (@booleanpress/ui) and fix it — deep imports, local copies of components, a missing or duplicated provider, stylesheet order, missing optional packages, raw colours, English strings, invalid props. Use for code review, troubleshooting or "it renders unstyled / looks wrong".
---

# Audit a project's use of BooleanPress UI

Work through the list; for each finding, show the file and line, fix it, and say why.

1. **Imports.** Every import is `@booleanpress/ui/<component>`, `/provider`, `/utils` or `/theme.css`. Replace deep
   imports (`@booleanpress/ui/dist/…`, `…/src/…`) with the entry; the package's `exports` map refuses them anyway.
2. **Local copies.** A `components/ui/<component>` file that duplicates a package component is replaced by the package's
   entry; its imports are moved. Behaviour the copy changed belongs in an issue on the library, not in a copy.
3. **Provider.** `BooleanUIProvider` is rendered once, around the whole app. Two copies of the package (check
   `npm ls @booleanpress/ui`) split its context: dedupe them.
4. **Stylesheet.** The main CSS imports Tailwind CSS first and `@booleanpress/ui/theme.css` after it; in a WordPress
   plugin, `@layer overrides;` comes first and Tailwind CSS is imported with `important`. Components that render
   unstyled usually mean the theme is missing or Tailwind CSS is not set up.
5. **Optional packages.** Chart needs `recharts`, Calendar `react-day-picker` and Toast `sonner`: installed if imported.
6. **Tokens.** No raw colours (`#…`, `rgb(…)`, `text-gray-500`) on or around components; use the theme tokens. Run
   `npx bui-contrast <brand.css>` if the project has one.
7. **Strings.** No English passed where the provider supplies the text (close buttons, pagination, sidebar toggle); the
   project's translations go to the provider's `strings`.
8. **API.** Every prop, variant and size exists on the installed version's API table
   (`node_modules/@booleanpress/ui/dist/docs/components/<component>.md`); run the project's type check and fix every
   error it reports.
9. **Accessibility.** Names, dialog titles and error descriptions, as the `booleanpress-ui-accessibility` skill lists.

Finish with the type check, the tests and the build, and a short list of what was fixed and what was left, with the
reason.
