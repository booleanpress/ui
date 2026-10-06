import type { GuideDoc } from "../types.ts"

export default {
  slug: "accessibility",
  title: "Accessibility",
  description: "What the components promise, how that is tested, and what is still yours to do.",
  sections: [
    {
      id: "the-target",
      title: "The target",
      markdown: `The interaction target is WCAG 2.2 level AA in the [supported environments](/docs/browser-support). The default palette has ten control-edge pairs below 3:1 and three rendered text pairs below 4.5:1. See [Default colours](#default-colours) for the exact exceptions and higher-contrast overrides; the defaults are not a blanket AA guarantee. Each component follows the matching pattern of the WAI-ARIA Authoring Practices Guide, linked from its page, and is built on a Radix primitive, or a Base UI one where Radix has none, so roles, focus management and keyboard behaviour come from a widely used base; those with no primitive in either (the tree, the listbox, the date and time fields, the knob) implement the pattern themselves, and their tests cover every key.`,
    },
    {
      id: "how-it-is-tested",
      title: "How it is tested",
      markdown: `- **Keyboard:** the component tests press the keys of each component's keyboard table and check the result; a new row comes with its test.
- **Automated checks:** component tests use axe, and the documentation browser audit checks pages and examples in light and dark themes, including colour contrast. The browser audit reports the three documented text pairs below separately from unexpected violations; only those exact measured colours on the relevant component parts are accepted. Any other finding fails the audit.
- **Contrast:** \`bui-contrast\` checks its registered token/surface pairs at 4.5:1 for text and 3:1 for control edges in both themes. It does not inspect rendered CSS, opacity or every component composition. Token tests record the ten default border exceptions; the CLI remains strict and reports them. Rendered text contrast also needs browser checks.
- **Screen readers:** a manual pass with VoiceOver and Safari, recorded below with the versions used.`,
    },
    {
      id: "screen-readers",
      title: "Screen-reader pass",
      markdown: `| Component | What was checked | VoiceOver and Safari |
| --- | --- | --- |
| Checkbox | Its name and state are read; Space toggles it and the new state is read | Recorded at the launch review |
| Select | The field's name and value; the open list's options and the chosen one | Recorded at the launch review |
| Tabs | The tab list, each tab's name, position and selection | Recorded at the launch review |
| Dialog | Its title and role on opening; focus back on the opener after Escape | Recorded at the launch review |`,
    },
    {
      id: "default-colours",
      title: "Default colours",
      markdown: `The default palette has these known exceptions:

| Part | Measured pair | Contrast |
| --- | --- | --- |
| Control edges | \`#cbd5e1\` light / \`#334155\` dark on each of \`background\`, \`card\`, \`popover\`, \`muted\` and \`sidebar\` | Ten pairs below 3:1; 1.48:1 light and 1.95:1 dark on the page background |
| Unpressed toggle text, including group and toolbar items | \`#64748b\` on \`#f1f5f9\` in light mode | 4.3439:1, below 4.5:1 |
| Unmet inline password-rule text | Opacity produces \`#707a88\` on \`#ffffff\` in light mode | 4.34:1 in the browser audit, below 4.5:1 |
| Attached InputGroup addon text | \`#94a3b8\` on \`#ffffff\` in light mode | 2.56:1, below 4.5:1 |

For higher contrast on the standard surfaces, add the edge tokens to \`brand.css\` and the component overrides below to your stylesheet. Declare \`@layer overrides;\` before the Tailwind imports, as in the installation stylesheet, so these important rules also work with Tailwind's important mode.

\`\`\`css
:root { --control: #7c8ca2; --control-hover: #64748b; }
.dark { --control: #64748b; --control-hover: #94a3b8; }

@layer overrides {
  @media (forced-colors: none) {
    [data-state="off"]:not(:disabled) > [data-slot="toggle-indicator"] {
      color: var(--foreground) !important;
    }
    [data-slot="password-input-rule"]:not([data-met]) > span[aria-hidden="true"] {
      opacity: 1 !important;
    }
    [data-attached="true"] > [data-slot="input-group-addon"],
    [data-attached="true"] [data-slot="input-group-text"] {
      color: var(--foreground) !important;
    }
  }
}
\`\`\`

The edge overrides pass the registered token checks on the standard surfaces. Run \`bui-contrast src/brand.css\` for those pairs and audit the rendered toggles, password rules and attached addons in both themes: the CLI cannot verify these component CSS overrides. Recheck custom surfaces, decorative icons and disabled states in context. [Theming → Reference colours](/docs/theming#reference-colours) describes the optional lighter severity palette separately.`,
    },
    {
      id: "forced-colours",
      title: "Forced colours",
      markdown: `Windows contrast themes, and the forced-colours mode some people set in their browser, replace every colour on the page with a few system colours of the person's choosing. The browser draws no box-shadow and no background colour of the page's own, so anything drawn with a fill or a shadow alone disappears: a switch's thumb, a slider, a progress bar, the chosen tab.

\`theme.css\` draws those parts again with system colours, under \`@media (forced-colors: active)\`:

| What | In forced colours |
| --- | --- |
| Keyboard focus, on every element | a 2 px \`Highlight\` outline; fields, menu items and options otherwise show focus by colour alone |
| Checked checkbox, radio, switch; pressed toggle; chosen segment | \`Highlight\` (with \`HighlightText\` on it), as the system's own controls |
| Chosen tab | its line and its text in \`Highlight\` |
| Highlighted menu item or option, chosen option, selected table or tree row, current page, the sidebar's current item, chosen days | \`Highlight\` with \`HighlightText\` |
| Today in the calendar | a ring; the other days lose the ring this mode would draw round every one |
| Progress bar, meter, password strength, slider | an edged track with the fill in \`Highlight\`; the slider's thumb in \`ButtonText\` |
| Separators, timeline and stepper lines, scroll thumbs, dot badges | \`CanvasText\` |
| Tooltips, badges, chips | an edge in \`CanvasText\` |
| Carousel dots | an edge in \`ButtonText\`; the current one filled with \`Highlight\` |
| Placeholders, and a select showing its placeholder | \`GrayText\`, so they read as empty |
| Disabled parts that are not native controls | \`GrayText\` (the browser greys native ones itself) |
| Skeletons | a \`GrayText\` outline |

The colour picker's areas and swatches keep their own colours (\`forced-color-adjust: none\`), because the colour is their content. Charts, the knob and the progress circle are drawn in SVG, which the browser leaves in the page's colours, so their contrast against a contrast theme's background is not guaranteed. Status colours (success, warning, danger) are gone in this mode; the components already say the status in words or with an icon.

To check a page, open Chrome DevTools → **Rendering** → **Emulate CSS media feature forced-colors** → \`active\`, with \`prefers-color-scheme\` light and then dark for the two palettes; or turn on a contrast theme in Windows Settings → **Accessibility** → **Contrast themes**. The components were checked this way, in Chromium's light and dark palettes.

For your own parts: draw edges with a border or an outline, not a shadow; give a fill that carries meaning a system colour under \`@media (forced-colors: active)\`; and put \`forced-color-adjust: none\` only on an element whose colour is the content, as a swatch's is.`,
    },
    {
      id: "your-part",
      title: "Your part",
      markdown: `The components cannot know your content. Each page's **Accessibility** section says what you must provide; most often:

- **Names.** Every control needs a name: a \`Label\` tied to it, visible text, or \`aria-label\` for an icon-only button.
- **Errors.** Mark an invalid field with \`aria-invalid\` and tie its message to it with \`aria-describedby\`.
- **Titles.** Every dialog and sheet needs a title, visible or kept for screen readers with \`className="sr-only"\`.
- **Translations.** Pass your translated strings to the provider ([Strings and translation](/docs/strings)).
- **Contrast.** Run \`bui-contrast\` on your palette and check rendered text, opacity and component states in the browser.`,
    },
    {
      id: "report",
      title: "Report a problem",
      markdown: `If a component is hard to use with a keyboard, a screen reader, zoom or another assistive technology, open an issue on [GitHub](https://github.com/booleanpress/ui/issues) with the component, the browser and assistive technology with their versions, and what happened. Accessibility problems are fixed before new features.`,
    },
  ],
} satisfies GuideDoc
