import type { ComponentDoc } from "../types.ts"

export default {
  slug: "splitter",
  title: "Splitter",
  category: "Panel",
  purpose: "Panels side by side or stacked, with handles between them that people drag, or move with the keyboard, to resize them.",
  links: {
    apg: { label: "APG Window splitter", href: "https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/" },
    spec: "specs/004_full-suite-components.md#splitter",
  },
  peers: ["react-resizable-panels"],
  usage: `\`\`\`tsx
<Splitter className="min-h-80">
  <SplitterPanel defaultSize="30%" minSize="20%">Folders</SplitterPanel>
  <SplitterHandle aria-label="Resize folders" />
  <SplitterPanel>Messages</SplitterPanel>
</Splitter>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Two panels sharing the width equally, with a handle between them." },
    { id: "vertical", title: "Vertical", description: "`orientation=\"vertical\"` stacks the panels." },
    { id: "sizes", title: "Sizes", description: "`defaultSize` sets where each panel starts." },
    {
      id: "min-max",
      title: "Min and max",
      description: "`minSize` and `maxSize` limit how far a panel can be resized.",
    },
    {
      id: "collapsible",
      title: "Collapsible",
      description: "`collapsible` folds a panel away when it is dragged small enough.",
    },
    {
      id: "nested",
      title: "Nested",
      description: "Splitters inside panels, with only the outer one framed.",
    },
    { id: "with-handle", title: "With handle grip", description: "`withHandle` draws a grip on the bar." },
    {
      id: "disabled",
      title: "Disabled",
      description: "`disabled` fixes the sizes and stops the handles being used.",
    },
  ],
  accessibility: {
    semantics:
      'Each handle is a focusable `separator` that reports the size of the panel before it, in percent.',
    labels:
      "Name every handle with `aria-label` or `aria-labelledby`, such as \"Resize folders\". The panels are plain containers.",
    focus:
      "Each handle is a tab stop, and the arrow keys resize the panel. A disabled splitter's handles leave the tab order.",
    limits: [
      "react-resizable-panels has no right-to-left mode: in a right-to-left row its pointer drag and arrow keys would move the handle the wrong way. In a right-to-left page a horizontal splitter therefore keeps its panels in source order from left to right, with right-to-left content inside them. A vertical splitter is unaffected.",
      "Each step of an arrow key is 5 % of the splitter. The step is the library's and cannot be changed.",
      "The bar is 1 px; the library makes its grab area at least 10 px wide for a mouse and 20 px for touch (`resizeTargetMinimumSize`).",
      "Sizes in percent may shift slightly as a server-rendered page hydrates; pixel sizes do not.",
    ],
  },
  keyboard: [
    { keys: ["ArrowLeft"], behaviour: "Between side-by-side panels, moves the handle left: the panel before it shrinks by 5 %." },
    { keys: ["ArrowRight"], behaviour: "Between side-by-side panels, moves the handle right: the panel before it grows by 5 %." },
    { keys: ["ArrowUp"], behaviour: "Between stacked panels, moves the handle up by 5 %." },
    { keys: ["ArrowDown"], behaviour: "Between stacked panels, moves the handle down by 5 %." },
    { keys: ["Home"], behaviour: "Gives the panel before the handle its smallest size." },
    { keys: ["End"], behaviour: "Gives the panel before the handle its largest size." },
    { keys: ["Enter"], behaviour: "Collapses the panel before the handle when it is `collapsible`, or restores it when it is collapsed." },
    { keys: ["F6"], behaviour: "Moves focus to the next handle in the splitter; with Shift, to the previous one." },
  ],
  theming:
    "The frame is `--card` with the `--border` edge; the bar is `--border`. The grip is `--card` with the `--border` edge and a `--muted-foreground` icon. Focus is the `--ring` outline around the 24 px handle.",
  props: {
    Splitter: {
      orientation: "`horizontal` (the default) puts the panels side by side; `vertical` stacks them.",
      disabled: "Fixes the sizes: the handles fade, leave the tab order and ignore the pointer.",
      defaultLayout: "The sizes to start with, by panel `id`, in percent; for a layout saved from `onLayoutChanged`.",
      onLayoutChange: "Called on every change of the sizes, during a drag too.",
      onLayoutChanged: "Called once a change of the sizes ends: after a drag, or a key press. Save the layout here.",
      groupRef: "Gives `getLayout()` and `setLayout()`.",
      disableCursor: "Stops the library from setting the resize cursor on the page during a drag.",
      resizeTargetMinimumSize: "The smallest grab area of a handle, in pixels, for a fine (mouse) and a coarse (touch) pointer.",
    },
    SplitterPanel: {
      defaultSize: "Where the panel starts: a string in percent (`\"30%\"`) or a CSS unit (`\"240px\"`); a number is pixels.",
      minSize: "The smallest the panel can be. Same units as `defaultSize`.",
      maxSize: "The largest the panel can be. Same units as `defaultSize`.",
      collapsible: "The panel folds to `collapsedSize` when it is dragged past its minimum, or when Enter is pressed on the handle that follows it.",
      collapsedSize: "The panel's size when collapsed; 0 % by default.",
      collapsedThreshold: "How far past its minimum a panel is dragged before it collapses.",
      id: "Identifies the panel in a saved layout.",
      onResize: "Called with the panel's new size, in percent and in pixels.",
      panelRef: "Gives `collapse()`, `expand()`, `getSize()`, `isCollapsed()` and `resize()`.",
      groupResizeBehavior: "When the splitter itself resizes: keep this panel's share (`preserve-relative-size`, the default) or its pixels.",
    },
    SplitterHandle: {
      withHandle: "Draws a grip on the bar.",
      disabled: "This handle cannot be dragged or moved with the keys.",
      disableDoubleClick: "Stops a double click on the handle from resetting the panel before it to its default size.",
    },
  },
} satisfies ComponentDoc
