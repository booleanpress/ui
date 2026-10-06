---
name: booleanpress-ui-theming
description: Theme BooleanPress UI (@booleanpress/ui) — brand colours and radius through the theme tokens in brand.css, the dark theme, and the bui-contrast check. Use for branding, palette changes, dark mode or contrast failures.
---

# Theme BooleanPress UI

1. **Read** `node_modules/@booleanpress/ui/dist/docs/guides/theming.md` and `…/guides/dark-mode.md`. Each component
   page's Theming section lists the tokens it reads.
2. **Brand with tokens, not classes.** Put values for the token names in `brand.css`, imported after
   `@booleanpress/ui/theme.css`: light values in `:root`, dark values in `.dark`, nothing else. The shared names are
   shadcn/ui's (`--primary`, `--primary-foreground`, `--ring`, `--radius`, …), so a shadcn/ui theme applies; the guide
   `theming.md` lists the package's own tokens (hover and press steps, `--highlight`, the field and status tokens),
   which keep their slate defaults unless set. Never edit the package's files, and never hard-code a colour in a
   component's `className`.
3. **Pairs and steps.** Each surface token has its text token (`--primary` and `--primary-foreground`), and the primary
   colour has its steps (`--primary-hover`, `--primary-active`, `--highlight`, `--highlight-foreground`,
   `--highlight-focus`). Change them together.
4. **Dark mode** applies inside an element with the class `dark`; put it on `<html>`, so overlays rendered at the end of
   `<body>` follow. Pass the same theme to the toast region: `<Toaster theme={…} />`.
5. **Check contrast** with the package's command, which reads `brand.css` on top of the defaults and measures every
   text/surface pair the components draw, and every form control's edge (`--control`), in both themes:

   ```sh
   npx bui-contrast src/brand.css
   ```

   It must report every text pair at 4.5:1 or more and every control edge at 3:1 or more. The defaults pass every pair,
   so a failure comes from the palette's own values; the theming guide's Reference colours block is the one known way
   to bring 55 failures back on purpose. Fix a failing pair by changing the value it names, then run it again.
   Add it to the project's lint script so it stays green.
