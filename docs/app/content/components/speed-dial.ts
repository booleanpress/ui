import type { ComponentDoc } from "../types.ts"

export default {
  slug: "speed-dial",
  title: "Speed dial",
  category: "Button",
  purpose: "A floating action button that opens a set of actions in a line or on an arc.",
  links: {
    apg: { label: "APG Menu button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
    spec: "specs/004_full-suite-components.md#speed-dial",
  },
  usage: `\`\`\`tsx
<SpeedDial className="absolute end-4 bottom-4">
  <SpeedDialTrigger />
  <SpeedDialContent>
    <SpeedDialAction label="Edit template"><PencilIcon /></SpeedDialAction>
    <SpeedDialAction label="Delete template"><Trash2Icon /></SpeedDialAction>
  </SpeedDialContent>
</SpeedDial>
\`\`\``,
  examples: [
    { id: "linear", title: "Linear", description: "Five actions above the trigger, each with a tooltip." },
    { id: "directions", title: "Directions", description: "`direction` sends the line up, down, left or right." },
    { id: "circle", title: "Circle", description: "`type=\"circle\"` sets the actions all round the trigger." },
    { id: "semi-circle", title: "Semicircle", description: "`type=\"semi-circle\"` sets them on half a circle." },
    { id: "quarter-circle", title: "Quarter circle", description: "`type=\"quarter-circle\"` sets them on a quarter circle." },
    { id: "transition-delay", title: "Transition delay", description: "`transitionDelay` sets the pause between one action appearing and the next." },
    { id: "labelled-actions", title: "Labelled actions", description: "Actions that show their label as text instead of a tooltip." },
    { id: "with-tooltips", title: "With tooltips", description: "`tooltipSide` puts each label on the side with room." },
    { id: "with-mask", title: "With mask", description: "`mask` dims the container while the actions are open." },
  ],
  accessibility: {
    semantics:
      'The trigger is a menu button, and the actions are a `menu` of `menuitem` buttons. Closed, the menu is out of the focus order and the accessibility tree.',
    labels:
      "The trigger is named \"Actions\" unless you pass `aria-label`. Each action is named by its `label`, which its tooltip also shows.",
    focus:
      "The trigger is the only tab stop. Opening with the keyboard moves focus to the first action, and the arrow keys move between actions.",
    limits: [
      "The actions are commands: a menu, not a disclosure of buttons, so they share one tab stop and keep the page's tab order short. Use a toolbar or plain buttons for actions people need to tab through.",
      "Actions are icons: the tooltip shows the label to sighted pointer and keyboard users, the accessible name to screen readers. With `tooltip={false}`, show the label as text.",
      "Directions are physical and do not flip in a right-to-left page; place the speed dial for the page's direction.",
      "The 28 px actions meet WCAG 2.5.8's 24 px target size, with 8 px between them in a line.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On the trigger: opens the actions with focus on the first, or closes them. On an action: runs it and closes the menu." },
    { keys: ["↓", "↑", "→", "←"], behaviour: "On the trigger: opens the actions with focus on the first (on the last with ↑ or ← when open)." },
    {
      keys: ["↑", "↓"],
      behaviour: "In a vertical line: the arrow pointing away from the trigger moves to the next action, the other to the previous, wrapping. On an arc, ↓ and → move on, ↑ and ← back.",
    },
    { keys: ["←", "→"], behaviour: "In a horizontal line: the arrow pointing away from the trigger moves to the next action, the other to the previous." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last action." },
    { keys: ["Escape"], behaviour: "Closes the actions and returns focus to the trigger." },
    { keys: ["Tab"], behaviour: "Closes the actions and moves on." },
  ],
  props: {
    SpeedDial: {
      type: "`linear` (default), `circle`, `semi-circle` or `quarter-circle`.",
      direction: "Where the actions go: `up` (default), `down`, `left`, `right`; for a quarter circle `up-left` (default), `up-right`, `down-left`, `down-right`.",
      radius: "The arc's radius in px, centre to centre: 80 by default, 120 for a quarter circle.",
      transitionDelay: "Milliseconds between one action's entrance and the next. 30 by default.",
      tooltipSide: "The side every action's tooltip opens on. Beside a vertical line, above anything else, by default.",
      mask: "Dims the positioned container behind the open actions; a click on it closes them.",
      open: "Whether the actions show, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether the actions show at the start.",
      onOpenChange: "Called with the new state when the actions open or close.",
    },
    SpeedDialAction: {
      label: "The action's name and tooltip. Required.",
      tooltip: "Shows the label in a tooltip on hover and focus. `true` by default.",
      variant: "Button's look; `secondary` by default.",
      size: "Button's size; `icon-sm` (28 px) by default.",
    },
  },
  theming:
    "The trigger is a primary button (`--primary`), or a severity's fill; the actions are secondary buttons (`--secondary`). They grow from nothing with `transform` and `opacity` over `--bui-duration-slow`, with no stagger and no movement under reduced motion. The mask is `--mask`.",
} satisfies ComponentDoc
