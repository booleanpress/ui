import type { GuideDoc } from "../types.ts"

export default {
  slug: "right-to-left",
  title: "Right-to-left",
  description: "Arabic, Hebrew, Persian and Urdu read from right to left; the components mirror for them.",
  sections: [
    {
      id: "set-the-direction",
      title: "Set the direction",
      markdown: `Set \`dir\` in two places: on \`<html>\`, for the page and your own layout, and on the provider, for the components' behaviour:

\`\`\`tsx
<html dir="rtl">
\`\`\`

\`\`\`tsx
<BooleanUIProvider dir="rtl">
  <App />
</BooleanUIProvider>
\`\`\`

In a WordPress plugin, take both from WordPress: \`is_rtl()\` in PHP, or the \`rtl\` class WordPress puts on \`<body>\`.`,
    },
    {
      id: "what-mirrors",
      title: "What mirrors",
      markdown: `- **Layout:** spacing, alignment and positions use the logical sides, *start* and *end*, so they swap in right-to-left. The sidebar's \`side="left"\` and a sheet's \`side="left"\` mean the start edge, which is the right in right-to-left; \`side="right"\` means the end.
- **Arrows:** chevrons that point along the reading direction turn round: pagination, breadcrumbs, sub-menus, the tree's expanders, the stepper's and the carousel's buttons, and the calendar's month buttons.
- **Keyboard:** in menus, tabs, radio groups, toggle groups, the tree and the stepper, the left and right arrow keys follow the reading direction. In the calendar, the right arrow key moves to the previous day.
- **Motion:** sheets and drawers slide in from the edge they sit on.
- **Toasts:** the close button moves to the top corner at the end.`,
    },
    {
      id: "components-that-differ",
      title: "Components that differ",
      markdown: `Some components mirror in their own way, or keep left to right on purpose:

- **Slider, Progress, Rating:** a slider fills from the right, and the left and right arrow keys move its handle the way they point. Progress bars fill from the right, and a half star is the right half.
- **Carousel:** the slides run from right to left, the previous button sits at the right, and the right arrow key goes to the previous slide.
- **Input OTP:** the first box is the rightmost, and typing fills the boxes towards the left.
- **Splitter:** a horizontal splitter keeps its panels in left-to-right order, with the first panel on the left, because its resizing library has no right-to-left mode: in a mirrored row, dragging and the arrow keys would move the handle the wrong way. The content of each panel still reads right to left. Order the panels as they should appear from the left.
- **Date field, Time field and the date pickers' fields:** the segments (day, month, year, hour, minute) come in the order of the provider's \`locale\` and are laid out left to right in both directions, as numbers are; the left and right arrow keys move between them the way they point.`,
    },
    {
      id: "your-code",
      title: "In your own code",
      markdown: `Use Tailwind CSS's logical utilities for your own layout: \`ms-*\` and \`me-*\` rather than \`ml-*\` and \`mr-*\`, \`ps-*\` and \`pe-*\`, \`start-*\` and \`end-*\`, \`text-start\` and \`text-end\`. For an icon that points along the reading direction, add \`rtl:rotate-180\`.

Try any page of this site in right-to-left with ⚙ → **Direction** → **RTL**.`,
    },
  ],
} satisfies GuideDoc
