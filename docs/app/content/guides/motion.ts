import type { GuideDoc } from "../types.ts"

export default {
  slug: "motion",
  title: "Motion",
  description: "Overlays fade in and out quickly and controls change colour smoothly, by one set of timings, and nothing moves for readers who ask for less motion.",
  sections: [
    {
      id: "the-policy",
      title: "The policy",
      markdown: `Motion tells the reader where something came from; it never makes them wait. So:

- **Entrances:** menus, popovers, lists and tooltips appear over 150 ms; dialogs, sheets and drawers, which cover more of the page, over 200 ms. They fade and grow slightly, or slide in from the edge they sit on.
- **Exits:** most animation-based overlays fade out over 100 ms, opacity only, and hold their last frame until removed, preventing a flash before they disappear. Select and Autocomplete use 150 ms opacity/scale motion in both directions, without sliding; Autocomplete follows its primitive's native start/end lifecycle.
- **Controls:** a button's, field's, checkbox's or switch's hover, press, focus and checked colours change over 200 ms, and a switch's knob slides over the same time. Rating marks scale to 110% on hover; password requirement icons scale as their state changes. These transforms do not move the layout.
- **Indicators:** the selected tab's bar and a segmented control's highlight slide to the new choice.
- **Nothing else animates** on its own, apart from the loading indicators: the spinner, the skeleton's shimmer and indeterminate progress.

The timings are set once, in \`theme.css\`, not in each component.`,
    },
    {
      id: "what-animates",
      title: "What animates",
      markdown: `| Motion | Components | Timing |
| --- | --- | --- |
| Overlays appear and fade out | Dropdown menu, Context menu, Menubar, Navigation menu, Popover, Hover card, Tooltip, Combobox, Multi-select, Cascade select, Tree select, Tags input, the date pickers' and colour picker's popovers, Confirm popup, Action bar, Scroll top, Loading overlay, the Tour's card | 150 ms in, 100 ms out |
| Popup fades/scales without sliding | Select and Autocomplete, from/to scale 0.93 | 150 ms in and out |
| Feedback scales | Rating hover; password requirement icons | 150 ms; 300 ms |
| Modals appear and fade out | Dialog, Alert dialog, Confirm, Sheet, Drawer, the phone-width Sidebar, the Tour's mask | 200 ms in, 100 ms out |
| Content opens and closes | Accordion, Panel and Fieldset (when they can be toggled) | 200 ms, by height |
| Indicators slide | Tabs (the selected tab's bar), Segmented control (the highlight) | 200 ms and 150 ms |
| Colours change | Every control: buttons, fields, checkboxes, radios, switches, sliders, the knob, the stepper, the carousel's dots | 200 ms |
| Small movements | Switch (the knob), Accordion (the chevron turns), Speed dial (its actions grow in one after another, its icon turns) | 200 ms |
| Loading | Spinner, Skeleton, indeterminate Progress and Progress circle, a loading button | until it stops |

The carousel scrolls its slides with Embla's own easing, as far as the reader drags or one slide for an arrow.`,
    },
    {
      id: "tokens",
      title: "The tokens",
      markdown: `| Token | Value | Used for |
| --- | --- | --- |
| \`--bui-duration-fast\` | 100 ms | Overlays under reduced motion |
| \`--bui-duration-base\` | 150 ms | Menus, popovers, lists and tooltips appearing; the segmented control's highlight |
| \`--bui-duration-slow\` | 200 ms | Dialogs, sheets, drawers and the phone-width sidebar appearing; the selected tab's bar; the speed dial's actions |
| \`--bui-duration-exit\` | 100 ms | Most animation-based overlays closing |
| \`--bui-duration-control\` | 200 ms | A control's hover, press, focus and checked colours, and a switch's knob |
| \`--bui-duration-feedback\` | 300 ms | Password strength and requirement feedback |
| \`--bui-ease-enter\` | \`cubic-bezier(0, 0, 0.38, 0.9)\` | Appearing: fast, then settling |
| \`--bui-ease-exit\` | \`cubic-bezier(0.2, 0, 1, 0.9)\` | Closing: quick to leave |
| \`--bui-ease-popup\` | \`cubic-bezier(0, 0, 0.2, 1)\` | Select animations and Autocomplete native lifecycle transitions |
| \`--bui-ease-standard\` | \`cubic-bezier(0.2, 0, 0.38, 0.9)\` | Indicators that slide, and your own transitions |

Override them in \`brand.css\` like any other token.`,
    },
    {
      id: "your-overlays",
      title: "Overlays of your own",
      markdown: `The theme times animation-based overlays that carry \`data-bui-motion\` on its animated element: \`data-bui-motion="overlay"\` for a menu, popover, list or hover card, \`data-bui-motion="modal"\` for a dialog or drawer. It works with either primitive library: Radix marks the state with \`data-state="open"\` and \`"closed"\`, Base UI with \`data-open\` and \`data-closed\`, and the theme reads both. Give the element the entrance and exit classes of \`tw-animate-css\`, which the theme imports, and leave the timing to the theme:

\`\`\`tsx
// Radix
<PopoverPrimitive.Content
  data-bui-motion="overlay"
  className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out"
/>

// Base UI
<Popover.Popup
  data-bui-motion="overlay"
  className="data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out"
/>
\`\`\`

The theme then sets the duration and easing, turns every exit into the 100 ms fade that holds its last frame, and applies reduced motion. The same attribute shields the overlay from the WordPress admin's element styles, as the library's own overlays are; a Base UI popup that does not animate takes \`data-bui-portal\` for that.`,
    },
    {
      id: "reduced-motion",
      title: "Reduced motion",
      markdown: `When the reader's system asks for reduced motion (\`prefers-reduced-motion: reduce\`), nothing moves or scales. Overlays keep a 100 ms fade, so they do not appear abruptly; Autocomplete explicitly uses scale 1 and the same 100 ms opacity transition; every other animation and transition ends at once: the spinner, the skeleton's shimmer, the controls' colour changes, the sliding indicators and the speed dial's actions, which appear together.`,
    },
    {
      id: "css-order",
      title: "Stylesheet order",
      markdown: `The motion rules live in a CSS layer named \`overrides\`. In a WordPress plugin, where Tailwind CSS runs in important mode, declare that layer before Tailwind CSS, so the rules outrank the utilities' own durations:

\`\`\`css
@layer overrides;
@import "tailwindcss" important;
@import "@booleanpress/ui/theme.css";
\`\`\`

In a plain React app the default order needs nothing more. To turn exits off while you compare, set \`data-bui-exits="off"\` on \`<html>\`: overlays then close at once.`,
    },
  ],
} satisfies GuideDoc
