import type { GuideDoc } from "../types.ts"

export default {
  slug: "theming",
  title: "Theming",
  description: "Brand the components by giving the colour tokens your own values; the components follow.",
  sections: [
    {
      id: "how-it-works",
      title: "How it works",
      markdown: `Components never name a colour. They use semantic tokens, such as \`bg-primary\` or \`text-muted-foreground\`, and \`theme.css\` gives each token a default for the light theme (\`:root\`) and the dark theme (\`.dark\`): slate greys with a near-black primary.

To brand them, write a \`brand.css\` that gives the tokens your values, and import it after the theme:

\`\`\`css
@import "tailwindcss";
@import "@booleanpress/ui/theme.css";
@import "./brand.css";
\`\`\`

\`brand.css\` holds values for token names in \`:root\` and \`.dark\`, nothing else. A token you leave out keeps its default. The shared names are shadcn/ui's, so a shadcn/ui theme applies; give the package's own tokens values beside it (the hover and press steps, \`--highlight\`, the field, status and button severity tokens), or they keep their slate defaults.`,
    },
    {
      id: "build-a-palette",
      title: "Build a palette",
      markdown: `Pick a primary colour and a radius. The components below change as you pick, and the contrast check runs on every change. Copy the result into \`brand.css\`.`,
      widget: "theme-builder",
    },
    {
      id: "tokens",
      title: "The tokens",
      markdown: `Every token in \`theme.css\`, with its light and dark defaults.

**Surfaces and text**

| Token | Light | Dark | What it paints |
| --- | --- | --- | --- |
| \`--background\`, \`--foreground\` | \`#ffffff\`, \`#334155\` | \`#020617\`, \`#ffffff\` | The page and its text. |
| \`--heading\` | \`#0f172a\` | \`#ffffff\` | Headings and strong text in Typography, and the Tour's title. |
| \`--card\`, \`--card-foreground\` | \`#ffffff\`, \`#334155\` | \`#0f172a\`, \`#ffffff\` | Cards, the calendar and other raised blocks. |
| \`--popover\`, \`--popover-foreground\` | \`#ffffff\`, \`#334155\` | \`#0f172a\`, \`#ffffff\` | Floating surfaces: menus, popovers, selects, dialogs, sheets, toasts and chart tooltips. |
| \`--muted\`, \`--muted-foreground\` | \`#f1f5f9\`, \`#607089\` | \`#1e293b\`, \`#94a3b8\` | Quiet surfaces (a toggle, a muted item) and secondary text. |
| \`--accent\`, \`--accent-foreground\` | \`#f1f5f9\`, \`#1e293b\` | \`#1e293b\`, \`#ffffff\` | A hovered or focused menu item, list option, table row or calendar day. |
| \`--subtle\` | \`#f8fafc\` | \`#1e293b\` | The lightest hover: outline and ghost buttons, the × of dialogs and sheets, the calendar's arrows. |
| \`--border\` | \`#e2e8f0\` | \`#334155\` | Lines and edges; the progress track, the skeleton and the scroll thumb. |

**Actions and selection**

| Token | Light | Dark | What it paints |
| --- | --- | --- | --- |
| \`--primary\`, \`--primary-foreground\` | \`#020617\`, \`#ffffff\` | \`#f8fafc\`, \`#020617\` | The main button, checked checkboxes, radios and switches, the selected day, the selected tab, progress. |
| \`--primary-hover\`, \`--primary-active\` | \`#1e293b\`, \`#334155\` | \`#e2e8f0\`, \`#cbd5e1\` | The primary fill on hover and on press. |
| \`--secondary\`, \`--secondary-foreground\` | \`#f1f5f9\`, \`#475569\` | \`#1e293b\`, \`#cbd5e1\` | Secondary buttons, badges, the default alert, keys. |
| \`--secondary-hover\`, \`--secondary-hover-foreground\` | \`#e2e8f0\`, \`#334155\` | \`#334155\`, \`#e2e8f0\` | The secondary fill and text on hover; an avatar's fallback, today in the calendar. |
| \`--secondary-active\` | \`#cbd5e1\` | \`#475569\` | The secondary fill on press. |
| \`--highlight\`, \`--highlight-foreground\` | \`#020617\`, \`#ffffff\` | \`#f8fafc\`, \`#020617\` | A chosen option, the current page, a selected table row, the days inside a range. |
| \`--highlight-focus\` | \`#334155\` | \`#cbd5e1\` | A chosen option while it has focus. |

**Form fields and focus**

| Token | Light | Dark | What it paints |
| --- | --- | --- | --- |
| \`--field\` | \`#ffffff\` | \`#020617\` | The fill of text fields, selects, checkboxes and radios. |
| \`--field-filled\` | \`#f8fafc\` | \`#1e293b\` | The fill of a filled field, at rest, on hover and with focus: see [Sizes and the filled look](#sizes-and-filled). |
| \`--field-disabled\`, \`--field-disabled-foreground\` | \`#e2e8f0\`, \`#64748b\` | \`#334155\`, \`#94a3b8\` | A disabled control's fill, and its text or mark. |
| \`--control\` | \`#cbd5e1\` | \`#334155\` | Subtle form borders and switch off tracks. Below 3:1; see [accessible overrides](/docs/accessibility#default-colours). |
| \`--control-hover\` | \`#94a3b8\` | \`#475569\` | Form edges on hover. |
| \`--field-placeholder\`, \`--field-icon\` | \`#64748b\`, \`#94a3b8\` | \`#94a3b8\`, \`#64748b\` | Empty-field text and decorative field icons. |
| \`--field-invalid-foreground\` | \`#dc2626\` | \`#f87171\` | Invalid placeholders. |
| \`--input\` | \`var(--control)\` | \`var(--control)\` | \`--control\`'s value, under the name earlier releases used; no component reads it. |
| \`--invalid\` | \`#f87171\` | \`#fca5a5\` | The edge of an invalid field. |
| \`--ring\` | \`#020617\` | \`#f8fafc\` | The focus outline, and a text field's edge while it has focus. |
| \`--mask\` | \`rgba(0, 0, 0, 0.4)\` | \`rgba(0, 0, 0, 0.6)\` | The backdrop behind dialogs and sheets. |

**Status colours, light**

| Token | What it paints | \`destructive\` | \`success\` | \`warning\` | \`info\` |
| --- | --- | --- | --- | --- | --- |
| \`--{tone}\` | The destructive button; the tint of an alert's or a status toast's shadow | \`#c81e1e\` | \`#15803d\` | \`#eab308\` | \`#3b82f6\` |
| \`--{tone}-foreground\` | Text on that fill | \`#ffffff\` | \`#ffffff\` | \`#ffffff\` | \`#ffffff\` |
| \`--destructive-hover\`, \`--destructive-active\` | The destructive button on hover and on press | \`#b91c1c\`, \`#991b1b\` | — | — | — |
| \`--{tone}-strong\` | The text and icon of an alert and a status toast; error text | \`#b91c1c\` | \`#15803d\` | \`#a16207\` | \`#2563eb\` |
| \`--{tone}-subtle\` | The fill of an alert and a status toast | \`#fef2f2\` | \`#f0fdf4\` | \`#fefce8\` | \`#eff6ff\` |
| \`--{tone}-border\` | Their edge | \`#fecaca\` | \`#bbf7d0\` | \`#fef08a\` | \`#bfdbfe\` |
| \`--{tone}-tag\`, \`--{tone}-tag-foreground\` | A badge | \`#fee2e2\`, \`#b91c1c\` | \`#dcfce7\`, \`#15803d\` | \`#ffedd5\`, \`#c2410c\` | \`#e0f2fe\`, \`#0369a1\` |

**Status colours, dark**

| Token | \`destructive\` | \`success\` | \`warning\` | \`info\` |
| --- | --- | --- | --- | --- |
| \`--{tone}\` | \`#f87171\` | \`#4ade80\` | \`#facc15\` | \`#60a5fa\` |
| \`--{tone}-foreground\` | \`#450a0a\` | \`#052e16\` | \`#422006\` | \`#172554\` |
| \`--destructive-hover\`, \`--destructive-active\` | \`#fca5a5\`, \`#fecaca\` | — | — | — |
| \`--{tone}-strong\` | \`#f87171\` | \`#22c55e\` | \`#eab308\` | \`#60a5fa\` |
| \`--{tone}-subtle\` | \`rgba(239, 68, 68, 0.16)\` | \`rgba(34, 197, 94, 0.16)\` | \`rgba(234, 179, 8, 0.16)\` | \`rgba(59, 130, 246, 0.16)\` |
| \`--{tone}-border\` | \`rgba(185, 28, 28, 0.36)\` | \`rgba(21, 128, 61, 0.36)\` | \`rgba(161, 98, 7, 0.36)\` | \`rgba(29, 78, 216, 0.36)\` |
| \`--{tone}-tag\` | \`#331e2e\` | \`#123332\` | \`#342627\` | \`#0f2e49\` |
| \`--{tone}-tag-foreground\` | \`#fca5a5\` | \`#86efac\` | \`#fdba74\` | \`#7dd3fc\` |

**Button severities**

A button's \`severity\` (\`success\`, \`info\`, \`warning\`, \`help\`, \`danger\` or \`contrast\`) colours it from a family of tokens, which solid badges share. A family is a fill token and the same six suffixes. Success takes its fill and text from the status colours \`--success\` and \`--success-foreground\`, and danger is the whole \`--destructive\` family. Info and warning have families of their own, \`--info-solid\` and \`--warning-solid\`, sky and orange, so \`--info\` and \`--warning\` stay the blue and yellow of alerts.

| Token | What it paints | \`success\` | \`info-solid\` | \`warning-solid\` | \`help\` | \`destructive\` | \`contrast\` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| \`--{family}\` | A solid button's fill; the text of an outlined, text or link button | \`#15803d\` | \`#0369a1\` | \`#c2410c\` | \`#9333ea\` | \`#c81e1e\` | \`#020617\` |
| \`--{family}-foreground\` | Text on that fill | \`#ffffff\` | \`#ffffff\` | \`#ffffff\` | \`#ffffff\` | \`#ffffff\` | \`#ffffff\` |
| \`--{family}-hover\`, \`--{family}-active\` | The solid fill on hover and on press | \`#166534\`, \`#14532d\` | \`#075985\`, \`#0c4a6e\` | \`#9a3412\`, \`#7c2d12\` | \`#7e22ce\`, \`#6b21a8\` | \`#b91c1c\`, \`#991b1b\` | \`#0f172a\`, \`#1e293b\` |
| \`--{family}-edge\` | An outlined button's edge | \`#bbf7d0\` | \`#bae6fd\` | \`#fed7aa\` | \`#e9d5ff\` | \`#fecaca\` | \`#334155\` |
| \`--{family}-ghost-hover\`, \`--{family}-ghost-active\` | The soft background of an outlined or text button on hover and on press | \`#f0fdf4\`, \`#dcfce7\` | \`#f0f9ff\`, \`#e0f2fe\` | \`#fff7ed\`, \`#ffedd5\` | \`#faf5ff\`, \`#f3e8ff\` | \`#fef2f2\`, \`#fee2e2\` | \`#f8fafc\`, \`#f1f5f9\` |

**Button severities, dark**

| Token | \`success\` | \`info-solid\` | \`warning-solid\` | \`help\` | \`destructive\` | \`contrast\` |
| --- | --- | --- | --- | --- | --- | --- |
| \`--{family}\` | \`#4ade80\` | \`#38bdf8\` | \`#fb923c\` | \`#c084fc\` | \`#f87171\` | \`#ffffff\` |
| \`--{family}-foreground\` | \`#052e16\` | \`#082f49\` | \`#431407\` | \`#3b0764\` | \`#450a0a\` | \`#020617\` |
| \`--{family}-hover\`, \`--{family}-active\` | \`#86efac\`, \`#bbf7d0\` | \`#7dd3fc\`, \`#bae6fd\` | \`#fdba74\`, \`#fed7aa\` | \`#d8b4fe\`, \`#e9d5ff\` | \`#fca5a5\`, \`#fecaca\` | \`#f1f5f9\`, \`#e2e8f0\` |
| \`--{family}-edge\` | \`#15803d\` | \`#0369a1\` | \`#c2410c\` | \`#7e22ce\` | \`#b91c1c\` | \`#64748b\` |
| \`--{family}-ghost-hover\`, \`--{family}-ghost-active\` | \`rgba(74, 222, 128, 0.04)\`, \`0.16\` | \`rgba(56, 189, 248, 0.04)\`, \`0.16\` | \`rgba(251, 146, 60, 0.04)\`, \`0.16\` | \`rgba(192, 132, 252, 0.04)\`, \`0.16\` | \`rgba(248, 113, 113, 0.04)\`, \`0.16\` | \`#1e293b\`, \`#334155\` |

The dark soft backgrounds are the fill colour at 4% (hover) and 16% (press) opacity. The dark tags above are opaque: the visual target's 16% tint (red, green, orange and sky) mixed over \`--card\`, so a tag stays legible on any surface, a selected table row included.

**Charts, sidebar, shape and motion**

| Token | Light | Dark | What it paints |
| --- | --- | --- | --- |
| \`--chart-1\` … \`--chart-5\` | \`#020617\`, \`#10b981\`, \`#3b82f6\`, \`#f59e0b\`, \`#8b5cf6\` | \`#f8fafc\`, \`#34d399\`, \`#60a5fa\`, \`#fbbf24\`, \`#a78bfa\` | The series colours of charts, through each chart's config. |
| \`--sidebar\`, \`--sidebar-foreground\` | \`#ffffff\`, \`#334155\` | \`#0f172a\`, \`#ffffff\` | The sidebar, which may differ from the page. |
| \`--sidebar-accent\`, \`--sidebar-accent-foreground\` | \`#f1f5f9\`, \`#1e293b\` | \`#1e293b\`, \`#ffffff\` | A hovered or active menu item, and a menu badge's fill. |
| \`--sidebar-border\`, \`--sidebar-ring\` | \`#e2e8f0\`, \`#020617\` | \`#334155\`, \`#f8fafc\` | The sidebar's lines, and its focus outline. |
| \`--sidebar-primary\`, \`--sidebar-primary-foreground\` | \`#020617\`, \`#ffffff\` | \`#f8fafc\`, \`#020617\` | Solid parts you add to the sidebar, such as a logo tile; no component reads them. |
| \`--radius\` | \`0.5rem\` | — | Corner rounding: \`rounded-sm\` 4 px (checkboxes, options, menu items), \`rounded-md\` 6 px (controls, menus), \`rounded-lg\` 8 px (popovers), \`rounded-xl\` 12 px (dialogs, cards). |
| \`--bui-shadow-field\` | \`0 1px 2px 0 rgb(18 18 23 / 5%)\` | same | The faint shadow shared by form fields. |
| \`--bui-duration-*\`, \`--bui-ease-*\` | — | — | The timings of overlays and controls: see [Motion](/docs/motion). |

Each component page lists the tokens it reads under **Theming**.`,
    },
    {
      id: "reference-colours",
      title: "Reference colours",
      markdown: `Default form edges already use the subtle palette. They fall below 3:1; [Accessibility → Default colours](/docs/accessibility#default-colours) gives stronger edge overrides. Body text and severity fills retain their stronger defaults.

This optional block also lightens severity fills and status text. It introduces additional contrast failures. Apply it only with an explicit palette decision and run the contrast command on the result:

\`\`\`css
:root {
  --muted-foreground: #64748b;
  --control: #cbd5e1;
  --control-hover: #94a3b8;
  --input: #cbd5e1;
  --destructive: #ef4444;
  --destructive-hover: #dc2626;
  --destructive-active: #b91c1c;
  --destructive-strong: #dc2626;
  --success: #22c55e;
  --success-hover: #16a34a;
  --success-active: #15803d;
  --success-strong: #16a34a;
  --warning-strong: #ca8a04;
  --info-solid: #0ea5e9;
  --info-solid-hover: #0284c7;
  --info-solid-active: #0369a1;
  --warning-solid: #f97316;
  --warning-solid-hover: #ea580c;
  --warning-solid-active: #c2410c;
  --help: #a855f7;
  --help-hover: #9333ea;
  --help-active: #7e22ce;
  --info-strong: #2563eb;
}

.dark {
  --muted-foreground: #94a3b8;
  --control: #475569;
  --control-hover: #64748b;
  --input: #475569;
  --destructive: #f87171;
  --destructive-hover: #fca5a5;
  --destructive-active: #fecaca;
  --destructive-strong: #ef4444;
  --success: #4ade80;
  --success-hover: #86efac;
  --success-active: #bbf7d0;
  --success-strong: #22c55e;
  --warning-strong: #eab308;
  --info-solid: #38bdf8;
  --info-solid-hover: #7dd3fc;
  --info-solid-active: #bae6fd;
  --warning-solid: #fb923c;
  --warning-solid-hover: #fdba74;
  --warning-solid-active: #fed7aa;
  --help: #c084fc;
  --help-hover: #d8b4fe;
  --help-active: #e9d5ff;
  --info-strong: #3b82f6;
}
\`\`\`

With it, additional pairs fall below AA: white on the five severity fills and those fills as button text, the strong status text on its tint and on the page, secondary text on \`--muted\`, and every control edge. Run \`bui-contrast src/brand.css\` to list them. See it on any page of this site with ⚙ → **Palette** → **Reference colours**.`,
    },
    {
      id: "sizes-and-filled",
      title: "Sizes and the filled look",
      markdown: `Controls come in three sizes, \`sm\`, \`default\` and \`lg\`. A text field is 26, 34 or 42 px tall, its 1 px edge included, with 12, 14 or 16 px text; its icons, gaps, checkmarks and handles scale with it. A control given no \`size\` takes the provider's \`controlSize\`, whose default is \`"default"\`, so one prop makes a whole app compact or roomy. Buttons are the exception: they take their own \`size\` only (\`xs\`, \`sm\`, \`default\`, \`lg\` and the square \`icon\` sizes), so set it where a row of buttons sits beside small fields.

Fields have two looks: \`default\`, on the white \`--field\` fill, and \`filled\`, on the grey \`--field-filled\` fill, which stays on hover and with focus while the edge changes. Choose it per field with \`variant="filled"\`, or for every field with the provider's \`fieldVariant\`, whose default is \`"default"\`. Text fields, selects, multi-selects, comboboxes, date and time fields, number and code inputs, tags inputs, text areas, checkboxes and radios take it.

\`\`\`tsx
<BooleanUIProvider controlSize="sm" fieldVariant="filled">
  <App />
</BooleanUIProvider>
\`\`\`

A prop on the control always wins over the provider. The resolved values are on the element, as \`data-size\` and \`data-variant\`, for your own styles: \`data-[size=sm]:gap-1\`. Change the filled colour with the \`--field-filled\` token, in \`:root\` and \`.dark\`. Every provider prop is listed under [Installation](/docs/installation#the-provider).`,
    },
    {
      id: "contrast",
      title: "Check contrast",
      markdown: `The package ships a strict command that checks your palette. Its default subtle borders fail the 3:1 edge threshold; apply the accessible overrides above before requiring a passing result. Add it to your lint script:

\`\`\`json
{
  "scripts": {
    "lint": "eslint src && bui-contrast src/brand.css"
  }
}
\`\`\`

\`bui-contrast\` reads \`brand.css\` on top of the defaults and measures every text colour the components draw against each surface it is drawn on, and every form control's edge against the surfaces it sits on, in the light and the dark theme. It measures the text on the hover and press steps of the primary and destructive fills, and on a chosen option with focus, as well as at rest. It exits with an error when a pair falls below WCAG 2.2 AA (4.5:1 for normal text, 3:1 for a control's edge, so an unchecked checkbox stays visible) and names the pair:

\`\`\`text
FAIL  light text-primary-foreground            on bg-primary            3.12:1
[contrast] src/brand.css — 1 of 220 pairs below their minimum (text 4.5:1, control edges 3:1)
\`\`\`

On the defaults alone it reports none. With the [Reference colours](#reference-colours) block it reports the 55 pairs that block puts below AA.`,
    },
    {
      id: "per-component",
      title: "Changing one component",
      markdown: `Every part accepts \`className\`, merged after its own classes, so a utility you pass wins over the component's: \`<Button className="rounded-full">\`. Prefer a token change when the same change should apply everywhere, and \`className\` for a single place.`,
    },
  ],
} satisfies GuideDoc
