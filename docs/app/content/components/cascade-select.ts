import type { ComponentDoc } from "../types.ts"

export default {
  slug: "cascade-select",
  title: "Cascade select",
  category: "Form",
  purpose: "Lets people choose one option from a tree, one level at a time, in menus that open beside each other.",
  links: {
    radix: { label: "Radix Dropdown Menu", href: "https://www.radix-ui.com/primitives/docs/components/dropdown-menu" },
    apg: { label: "APG Menu Button", href: "https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/" },
    spec: "specs/004_full-suite-components.md#cascade-select",
  },
  usage: `\`\`\`tsx
const OFFICES: CascadeSelectOption[] = [
  {
    value: "us",
    label: "United States",
    children: [{ value: "us-ca", label: "California", children: [{ value: "los-angeles", label: "Los Angeles" }] }],
  },
]

<Label htmlFor="office">Office</Label>
<CascadeSelect id="office" options={OFFICES} placeholder="Select a city" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Country, then state, then city: each group opens the next level beside it." },
    { id: "show-path", title: "Show the path", description: "`showPath` shows every level of the choice in the field." },
    { id: "groups-with-icons", title: "Groups with icons", description: "Icons before the labels of groups and options." },
    {
      id: "clear",
      title: "Clear",
      description: "`clearable` adds a button that empties the field.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    { id: "fluid", title: "Fluid", description: "`fluid` makes the field as wide as its container." },
    {
      id: "disabled",
      title: "Disabled",
      description: "A disabled field keeps its value; a disabled option stays in the menu but cannot be chosen.",
    },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
    {
      id: "loading",
      title: "Loading options",
      description: "Groups marked `hasChildren` load their options the first time they open.",
    },
  ],
  accessibility: {
    semantics:
      'The field is a menu `button`. Each level is a `role="menu"`, a group is a `menuitem`, and a leaf is a `menuitemradio`.',
    labels:
      "Name the field with a `Label`, `aria-labelledby` or `aria-label`; its value is read with the name, as \"Office, Los Angeles\".",
    focus:
      "The field is in the tab order. Opening moves focus into the menu, to the chosen option when there is one; closing returns focus to the field.",
    limits: [
      "Every level is a portal, outside the field's container, so CSS that targets the container does not reach it.",
      "There is no search box. Typing moves to the next option of the open level whose label starts with the letters typed.",
      "A group cannot be chosen itself; only leaves set the value.",
      "A value inside a level that has not been loaded yet shows as the raw value until that level loads.",
      "A long label is cut short with an ellipsis, in the field and in its level; the whole label stays the option's accessible name.",
      "Levels open side by side and flip to the other side at the window's edge; on a narrow phone screen a deep tree may need horizontal room it does not have.",
      "A clearable field sits in a wrapper (`data-slot=\"cascade-select-control\"`) with its clear button beside it, since a button cannot hold another.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space", "↓"], behaviour: "On the field, opens the menu and moves focus to the first option, or to the chosen one." },
    { keys: ["↓", "↑"], behaviour: "Moves to the next or previous option of the level, wrapping at its ends." },
    { keys: ["→"], behaviour: "On a group, opens its level and moves focus to its first option (← in right-to-left pages)." },
    { keys: ["←"], behaviour: "Closes the current level and returns focus to its group (→ in right-to-left pages)." },
    { keys: ["Enter", "Space"], behaviour: "On a group, opens its level. On an option, chooses it, closes the menu and returns focus to the field." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last option of the level." },
    { keys: ["A–Z"], behaviour: "Type-ahead: moves to the next option of the level whose label starts with the letters typed." },
    { keys: ["Escape"], behaviour: "Closes every level without changing the value, and returns focus to the field." },
    { keys: ["Enter", "Space"], behaviour: "On the clear button, empties the field and returns focus to it." },
  ],
  theming:
    "The field is the select field: `--field` (`--field-filled` with `variant=\"filled\"`), the `--control` edge (`--control-hover` under the pointer), `--ring` on focus and while open, `--invalid` when invalid. Each level uses `--popover` and `--popover-foreground`, `--accent` for the focused option and for a group whose level is open, and `--highlight` for the chosen option (`--highlight-focus` while it has focus). Group chevrons are `--control-hover`. The levels' enter and exit motion is set once in `theme.css`.",
  props: {
    CascadeSelect: {
      id: "The field's id, for a `Label htmlFor`.",
      disabled: "Stops the field from opening and takes it out of the tab order.",
      className: "Classes for the field (the trigger button). Width classes such as `w-64` and `w-full` go here.",
      "aria-invalid": "Draws the error edge and a red placeholder.",
    },
  },
} satisfies ComponentDoc
