import type { ComponentDoc } from "../types.ts"

export default {
  slug: "select",
  title: "Select",
  category: "Form",
  purpose: "Lets people choose one option from a list that opens below the field.",
  links: {
    radix: { label: "Radix Select", href: "https://www.radix-ui.com/primitives/docs/components/select" },
    apg: {
      label: "APG Select-only combobox",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/",
    },
    spec: "specs/002_pilot-mini-specs.md#select",
  },
  usage: `\`\`\`tsx
<Label htmlFor="mailer">Mailer</Label>
<Select defaultValue="ses">
  <SelectTrigger id="mailer">
    <SelectValue placeholder="Choose a mailer" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="ses">Amazon SES</SelectItem>
    <SelectItem value="postmark">Postmark</SelectItem>
  </SelectContent>
</Select>
\`\`\``,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description: "A named field with one option preselected.",
    },
    { id: "filter", title: "Filter", description: "A searchable list built from Combobox, with the search field inside the popup." },
    { id: "multiple", title: "Multiple", description: "Several options can be chosen, and the trigger shows them." },
    { id: "arrow", title: "Arrow", description: "An arrow points from the list to the field." },

    {
      id: "clear",
      title: "Clear",
      description: "`clearable` adds a button that resets the field to its placeholder.",
    },
    {
      id: "custom-option",
      title: "Custom option",
      description: "Options with an avatar and a second line in the list.",
    },
    {
      id: "groups",
      title: "Groups and long list",
      description: "Labelled groups with a separator; a long list scrolls.",
    },
    { id: "fluid", title: "Fluid", description: "`fluid` makes the field as wide as its container." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "filled", title: "Filled", description: "A filled field instead of an outlined one." },
    {
      id: "disabled",
      title: "Disabled",
      description: "A disabled select keeps its value and does not open; a disabled item cannot be chosen.",
    },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
  ],
  accessibility: {
    semantics:
      'The trigger is a `combobox` that opens a `listbox` of `option` items. Inside a form, the chosen value is submitted with it.',
    labels:
      "Name every select with a `Label` whose `htmlFor` is the trigger's `id`, or with `aria-label` when no visible text fits.",
    focus:
      "The trigger is a tab stop. Opening moves focus to the chosen option, and closing returns it to the trigger.",
    limits: [
      "The list is a portal, outside the trigger's container, so CSS that targets the container does not reach it.",
      "There is no search box. Typing selects by the first letters of the labels (type-ahead) and nothing else; for a list people search, use Combobox.",
      "A clearable trigger sits in a wrapper (`data-slot=\"select-control\"`) with its clear button beside it, since a button cannot hold another. Width classes such as `w-48` and `w-full` still work on the trigger; a layout class that must reach the outer box, such as `flex-1`, goes on a wrapper of your own.",
      "The clear button is a 24 px target with a 14 px icon, in the tab order after the trigger, and only while a value is chosen.",
    ],
  },
  keyboard: [
    { keys: ["Enter"], behaviour: "On the trigger, opens the list. In the list, chooses the focused option and closes it." },
    { keys: ["Space"], behaviour: "On the trigger, opens the list. In the list, chooses the focused option." },
    { keys: ["ArrowDown"], behaviour: "On the trigger, opens the list. In the list, moves focus to the next option." },
    { keys: ["ArrowUp"], behaviour: "On the trigger, opens the list. In the list, moves focus to the previous option." },
    { keys: ["Home"], behaviour: "In the list, moves focus to the first option." },
    { keys: ["End"], behaviour: "In the list, moves focus to the last option." },
    { keys: ["A–Z"], behaviour: "Type-ahead: moves focus to the next option whose label starts with the letters typed." },
    { keys: ["Escape"], behaviour: "Closes the list without changing the value, and returns focus to the trigger." },
    { keys: ["Tab"], behaviour: "With `clearable` and a value chosen, moves from the trigger to the clear button." },
    { keys: ["Enter", "Space"], behaviour: "On the clear button, empties the field to its placeholder and returns focus to the trigger." },
  ],
  theming:
    "The trigger takes `--field` for the fill (`--field-filled` with `variant=\"filled\"`) and `--control` for the border (`--control-hover` under the pointer), `--ring` for focus and while the list is open, and `--invalid` for the invalid state; the clear button's icon is `--control-hover`, `--foreground` under the pointer. The list uses `--popover` and `--popover-foreground`, `--accent` for the focused option and `--highlight` for the chosen one (`--highlight-focus` while it has focus). Its 150 ms opacity/93% scale entrance and exit use the tokens in `theme.css`, without sliding; reduced motion removes the scale.",
  props: {
    Select: {
      value: "The chosen value, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The value it starts with, when it controls itself.",
      onValueChange: "Called with the new value when an option is chosen.",
      open: "Whether the list is open, when you control it. Pair it with `onOpenChange`.",
      defaultOpen: "Whether the list starts open.",
      onOpenChange: "Called when the list opens or closes.",
      disabled: "Stops the select from opening and takes it out of the tab order.",
      required: "The form cannot be submitted until a value is chosen.",
      name: "The field name, for the value the form submits.",
      dir: "Reading direction of the list. Defaults to the provider's.",
    },
    SelectTrigger: {
      size: "`sm` is 26 px high, `default` 34 px, `lg` 42 px. Defaults to the provider's `controlSize`.",
      variant: "`default` is the white field; `filled` the grey `--field-filled` one. Defaults to the provider's `fieldVariant`.",
      fluid: "Makes the field as wide as its container.",
      clearable: "Shows a clear button inside the field while a value is chosen. It sets the value to `\"\"`, calls `onValueChange` and returns focus to the trigger.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
    SelectValue: {
      placeholder: "Shown while no value is chosen, in the muted colour.",
    },
    SelectContent: {
      arrow: "Draws a positioned arrow between the popup and trigger; use sideOffset={8}. Only available in popper positioning.",
      position: '`popper` (the default here) opens below the field and flips above when there is no room; `item-aligned` is stock: the list covers the field and aligns the chosen option with it.',
      align: "How the list lines up with the trigger on the cross axis in `popper` mode: `start`, `center` or `end`.",
      side: "Which side of the trigger the list prefers in `popper` mode. It flips when there is no room.",
      sideOffset: "Distance in pixels between the trigger and the list in `popper` mode.",
      onCloseAutoFocus: "Called when focus returns to the trigger after closing. Call `preventDefault()` to stop that.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `preventDefault()` to keep the list open.",
    },
    SelectItem: {
      value: "The value chosen by this item. It cannot be an empty string.",
      icon: "Leading media in the list, beside both lines, such as an avatar or a flag. The trigger does not show it.",
      description: "A second, muted line under the label in the list. The trigger does not show it.",
      disabled: "The item cannot be chosen or focused.",
      textValue: "Text used for type-ahead and for the trigger's display, when the children are not plain text.",
    },
    SelectGroup: {
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
  },
} satisfies ComponentDoc
