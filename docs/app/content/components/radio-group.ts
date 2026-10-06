import type { ComponentDoc } from "../types.ts"

export default {
  slug: "radio-group",
  title: "Radio group",
  category: "Form",
  purpose: "Lets people choose exactly one option from a short list that stays visible.",
  links: {
    radix: { label: "Radix Radio Group", href: "https://www.radix-ui.com/primitives/docs/components/radio-group" },
    apg: { label: "APG Radio Group", href: "https://www.w3.org/WAI/ARIA/apg/patterns/radio/" },
    spec: "specs/003_moved-components.md#radio-group",
  },
  usage: `\`\`\`tsx
<RadioGroup defaultValue="queue" aria-label="Sending mode">
  <div className="flex items-center gap-2">
    <RadioGroupItem id="mode-instant" value="instant" />
    <Label htmlFor="mode-instant">Send at once</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem id="mode-queue" value="queue" />
    <Label htmlFor="mode-queue">Send through the queue</Label>
  </div>
</RadioGroup>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Three options, one chosen, each named by its label." },
    {
      id: "dynamic",
      title: "Dynamic",
      description: "Radios rendered from an array of options.",
    },
    {
      id: "controlled",
      title: "Controlled",
      description: "`value` and `onValueChange` keep the choice in your state.",
    },
    {
      id: "horizontal",
      title: "Horizontal",
      description: "A row of short options with `orientation=\"horizontal\"`.",
    },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    {
      id: "filled",
      title: "Filled",
      description: "`variant=\"filled\"` fills every unchosen circle.",
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "`disabled` on the group stops every radio; on one item it stops only that radio.",
    },
    {
      id: "invalid",
      title: "Invalid",
      description: "`aria-invalid` shows the error state, and `aria-describedby` reads the message.",
    },
  ],
  accessibility: {
    semantics:
      'The group is a `radiogroup` and each item a `radio`. Inside a form, the chosen value is submitted with it.',
    labels:
      "Name the group with `aria-label` or `aria-labelledby`, and every radio with a `Label` whose `htmlFor` is its `id`.",
    focus:
      "The group is one tab stop: Tab lands on the chosen radio, or the first. The arrow keys move focus and choose together.",
    limits: [
      "The radio is 18 px (14 px small, 20 px large). Keep its label beside it, so the label adds to the target and the pair meets WCAG 2.5.8's 24 px.",
      "`aria-invalid` is not inherited: put it on the group (so the group reads as invalid) and on each radio (for the red border).",
    ],
  },
  theming:
    "Each radio fills with `--field` (`--field-filled` with `variant=\"filled\"`) and its edge is `--control` (`--control-hover` under the pointer); the chosen radio fills with `--primary` (`--primary-hover` under the pointer) around a `--primary-foreground` dot; focus is a 1 px `--ring` outline 2 px away; invalid is `--invalid`; disabled fills `--field-disabled`, the dot `--field-disabled-foreground`.",
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves focus into the group, to the chosen radio, or to the first radio when none is chosen. A second Tab leaves the group." },
    { keys: ["ArrowDown", "ArrowRight"], behaviour: "Moves focus to the next radio and chooses it. From the last radio, it wraps to the first. In right-to-left, ArrowLeft moves forward instead of ArrowRight." },
    { keys: ["ArrowUp", "ArrowLeft"], behaviour: "Moves focus to the previous radio and chooses it. From the first radio, it wraps to the last. In right-to-left, ArrowRight moves back instead of ArrowLeft." },
    { keys: ["Space"], behaviour: "Chooses the focused radio, if it is not already chosen." },
  ],
  props: {
    RadioGroup: {
      value: "The chosen value, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The value it starts with, when it controls itself.",
      onValueChange: "Called with the new value when a radio is chosen.",
      disabled: "Stops every radio in the group.",
      required: "The form cannot be submitted until a radio is chosen.",
      name: "The field name, for the value the form submits.",
      orientation: "`horizontal` or `vertical`, for the arrow keys and `aria-orientation`. It does not change the layout: set that with `className`.",
      size: "The size of every radio: `sm` 14 px, `default` 18 px, `lg` 20 px. Defaults to the provider's `controlSize`.",
      variant: "`filled` fills every unchosen circle with `--field-filled`. Defaults to the provider's `fieldVariant`.",
      dir: "Reading direction for the arrow keys. Defaults to the provider's.",
      loop: "Whether the arrow keys wrap from the last radio to the first. Defaults to `true`.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
    RadioGroupItem: {
      value: "The value this radio chooses.",
      size: "This radio's size, over the group's.",
      variant: "This radio's look, over the group's.",
      disabled: "Stops this radio. The arrow keys skip it.",
      required: "The form cannot be submitted until this radio is chosen.",
      asChild: "Render the child element instead, with this part's behaviour and classes merged onto it.",
    },
  },
} satisfies ComponentDoc
