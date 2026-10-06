import type { GuideDoc } from "../types.ts"

export default {
  slug: "dark-mode",
  title: "Dark mode",
  description: "Turn on the dark theme with a class on the root element; every component and overlay follows.",
  sections: [
    {
      id: "the-class",
      title: "The dark class",
      markdown: `The dark theme applies inside any element with the class \`dark\`. Put it on \`<html>\`:

\`\`\`html
<html class="dark">
\`\`\`

Dialogs, drawers, menus, popovers, selects and the lists of comboboxes, autocompletes, multi-selects and tags inputs render at the end of \`<body>\`, outside your app's root, whether Radix or Base UI draws them. With the class on \`<html>\`, they turn dark with the rest of the page; on an inner element, they would stay light.

Set \`color-scheme\` too, so the browser draws scroll bars and native controls to match:

\`\`\`css
:root { color-scheme: light; }
:root.dark { color-scheme: dark; }
\`\`\``,
    },
    {
      id: "follow-the-system",
      title: "Follow the system setting",
      markdown: `To follow the reader's system setting, and keep their choice when they make one, set the class before the first paint with a small script in \`<head>\`:

\`\`\`html
<script>
  const choice = localStorage.getItem("theme") // "light", "dark" or null for the system's
  const dark = choice ? choice === "dark" : matchMedia("(prefers-color-scheme: dark)").matches
  document.documentElement.classList.toggle("dark", dark)
</script>
\`\`\`

Running it before your app's bundle avoids a flash of the light theme for a reader who chose dark.`,
    },
    {
      id: "your-dark-palette",
      title: "Your dark palette",
      markdown: `\`theme.css\` has dark values for every token. To brand the dark theme, give the tokens values in the \`.dark\` block of \`brand.css\`; a token you leave out there keeps its light brand value or the dark default. [Theming](/docs/theming) builds both blocks, and \`bui-contrast\` checks the dark theme as well as the light one.`,
    },
    {
      id: "components",
      title: "Components with their own dark look",
      markdown: `Every component reads the tokens, so the dark values reach it without a prop. A few look different in a way worth knowing:

- **Button severities:** in the dark theme the fills are lighter and the text on them dark, \`#052e16\` on the green success fill, for instance. Outlined and text buttons get deeper edges and fainter backgrounds. [Theming](/docs/theming#tokens) lists both sets.
- **Charts:** series take their colours from \`--chart-1\` to \`--chart-5\`, which have dark values. A colour you write into a chart's config as a value, rather than \`var(--chart-1)\`, stays the same in both themes.
- **Color picker:** the colour area and the hue and opacity strips show the colours themselves, the same in both themes; only the frame, the handles and the fields around them follow the theme.
- **Filled fields:** the grey \`--field-filled\` fill is \`#1e293b\` in dark, one step above the page, so a filled field still stands out from a card.`,
    },
    {
      id: "toasts",
      title: "Toasts",
      markdown: `The toast region draws its own close button. Pass the same theme to it, so the button matches: \`<Toaster theme={dark ? "dark" : "light"} />\`. Its default, \`"system"\`, follows the system setting rather than your class.`,
    },
  ],
} satisfies GuideDoc
