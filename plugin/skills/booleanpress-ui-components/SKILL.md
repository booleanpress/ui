---
name: booleanpress-ui-components
description: Choose and use BooleanPress UI (@booleanpress/ui) components — forms, buttons, overlays, menus, data, messages — with the exact parts, props and examples of the installed version, then check the result with the project's type check. Use when adding or changing UI built from @booleanpress/ui.
---

# Use BooleanPress UI components

1. **Find the component** in `node_modules/@booleanpress/ui/dist/docs/llms.txt`, by purpose: each line names a
   component and what it is for. Prefer the library's component over a hand-made one: a confirmation is an Alert
   dialog, a choice of one among a few is a Radio group, a long choice is a Select or a Command list.
2. **Read its page**, `node_modules/@booleanpress/ui/dist/docs/components/<component>.md`: the import line, the usage,
   the examples (start from the closest one and keep its structure), the Accessibility section, the keyboard table, the
   API and, if listed, the extra package to install.
3. **Write the code**:
   - import from `@booleanpress/ui/<component>`, exactly as the page's Import section shows;
   - compose the parts in the order the examples use (for example `Dialog` → `DialogTrigger` → `DialogContent` →
     `DialogHeader` → `DialogTitle`);
   - use only the props, variants and sizes the API table lists; style with Tailwind CSS utilities and the theme tokens
     (`bg-muted`, `text-muted-foreground`), never raw colours;
   - give every control a name (a `Label` with `htmlFor`, visible text, or `aria-label` for an icon-only button) and
     every dialog or sheet a title;
   - for text the components write themselves (the close button, pagination), do not pass English props: the provider
     supplies it, translated.
4. **Check**: run the project's type check; an invalid prop or variant fails there, because the package ships its
   types. Fix every error rather than casting it away. Then run the project's tests or build.

When a design needs something the page does not offer, compose it from the documented parts and `className`, and say
which part of the request the library does not cover.
