---
name: booleanpress-ui-accessibility
description: Make BooleanPress UI (@booleanpress/ui) screens accessible — accessible names, errors, dialog titles, keyboard behaviour, focus, translated built-in strings and right-to-left — as the installed component pages state them. Use for accessibility reviews, keyboard or screen-reader problems, translation and RTL.
---

# Accessibility with BooleanPress UI

The components follow the WAI-ARIA Authoring Practices and are built on Radix; what is left to the project is its
content. For each component in use, read the Accessibility section and the keyboard table of
`node_modules/@booleanpress/ui/dist/docs/components/<component>.md`, and the guides `accessibility.md`, `strings.md`
and `right-to-left.md`.

Check and fix, in this order:

1. **Names.** Every control has one: a `Label` tied by `htmlFor`/`id`, visible text, or `aria-label` on an icon-only
   button. A `Command`'s search field is named with `Command`'s `label` prop.
2. **Titles.** Every `Dialog`, `AlertDialog` and `Sheet` has its title part; keep it for screen readers with
   `className="sr-only"` when the design shows none.
3. **Errors.** An invalid field has `aria-invalid` and its message tied with `aria-describedby`.
4. **Keyboard.** Do not add `onKeyDown` handlers that duplicate or block what the keyboard table lists; do not put
   `tabIndex` on non-interactive elements, and never a positive one.
5. **Focus.** A dialog opened from code without a trigger returns focus to the element that had it; when that element
   disappears (a deleted row), pass `returnFocusTo`.
6. **Built-in text.** The words the components write themselves come from `BooleanUIProvider`'s `strings`; pass the
   project's translations there, never English props. The guide `strings.md` lists every key.
7. **Direction.** For right-to-left languages, set `dir="rtl"` on `<html>` and on the provider; use logical utilities
   (`ms-*`, `ps-*`, `start-*`, `text-start`) in the project's own layout.
8. **Contrast.** Run `npx bui-contrast <brand.css>` after any palette change. On the defaults alone it reports the pairs
   the package's look misses, listed in the guide `accessibility.md`; give those tokens passing values in `brand.css`.

Then run the project's tests; with Testing Library, query by role and name (`getByRole('button', { name: … })`), which
fails when a name is missing.
