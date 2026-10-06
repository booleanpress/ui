import type { ComponentDoc } from "../types.ts"

export default {
  slug: "stepper",
  title: "Stepper",
  category: "Panel",
  purpose: "Guides people through a task in numbered steps, showing where they are and what is done.",
  links: {
    apg: { label: "ARIA aria-current", href: "https://www.w3.org/TR/wai-aria-1.2/#aria-current" },
    spec: "specs/004_full-suite-components.md#stepper",
  },
  usage: `\`\`\`tsx
<Stepper defaultValue={1}>
  <StepperList>
    <StepperItem step={1}>
      <StepperTrigger>
        <StepperIndicator />
        <StepperTitle>Connection</StepperTitle>
      </StepperTrigger>
      <StepperSeparator />
    </StepperItem>
    <StepperItem step={2}>
      <StepperTrigger>
        <StepperIndicator />
        <StepperTitle>Sender</StepperTitle>
      </StepperTrigger>
    </StepperItem>
  </StepperList>
  <StepperContent step={1}>Host and port</StepperContent>
  <StepperContent step={2}>From name and address</StepperContent>
  <StepperPrevious />
  <StepperNext />
</Stepper>
\`\`\``,
  examples: [
    { id: "horizontal", title: "Horizontal", description: "Three steps in a row, with the current step's content below." },
    { id: "vertical", title: "Vertical", description: "Each step's content opens under it, beside the line." },
    { id: "linear", title: "Linear", description: "Later steps cannot be chosen from the list; Back and Next move one step." },
    { id: "steps-only", title: "Steps only", description: "The list without content panels, such as a ticket's status." },
    {
      id: "custom-indicator",
      title: "Custom indicator",
      description: "Icons in larger circles replace the numbers; the titles are hidden visually but still name the steps.",
    },
    { id: "with-descriptions", title: "With descriptions", description: "A line of detail under each title." },
    { id: "error-state", title: "Error state", description: "A step that needs attention shows a red cross and title." },
    {
      id: "wizard",
      title: "Wizard",
      description: "Next stays on the API key step until a key is pasted, then a review ends with Finish.",
    },
  ],
  accessibility: {
    semantics: "The steps are an ordered list (`ol`) of buttons, and the current one has `aria-current=\"step\"`. A step's content is a `group` named by its button.",
    labels: "Each button is named from its title and state, for example \"Step 2 of 3\" and \"Completed\". Name the list with `aria-label` when the page has more than one.",
    focus: "Every step that can be chosen is a tab stop, and the arrow keys also move between them. When Back or Next disables while focused, focus moves to the other button.",
    limits: [
      "A step's content is not announced when it changes: move focus into it yourself if the new step needs it, for example to its first field.",
      "Disabled steps are out of the tab order; their titles are still read in the list.",
      "Titles truncate with an ellipsis when the row is narrow; the full title stays in the button's name.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves to the next step that can be chosen, then into the content." },
    { keys: ["Enter", "Space"], behaviour: "Goes to the focused step." },
    { keys: ["→", "←"], behaviour: "Moves to the next or previous step, wrapping at the ends (↓ and ↑ when vertical). Reversed in a right-to-left page." },
    { keys: ["Home", "End"], behaviour: "Moves to the first or last step that can be chosen." },
  ],
  props: {
    Stepper: {
      value: "The current step's number, when you control it. Pair it with `onValueChange`.",
      defaultValue: "The step it starts on, when it controls itself. `1` by default.",
      onValueChange: "Called with the step's number when a step's button, `StepperPrevious` or `StepperNext` changes the step.",
      orientation: "`horizontal` (default) or `vertical`.",
      linear: "Steps after the current one cannot be chosen from the list.",
    },
    StepperItem: {
      step: "The step's number, counting from 1. Required.",
      completed: "Marks the step done. By default every step before the current one is.",
      error: "Marks the step as needing attention: a red cross and title.",
      disabled: "The step's button cannot be used.",
    },
    StepperContent: {
      step: "The step whose content this is. Inside a `StepperItem`, that item's step by default.",
      forceMount: "Keep the content in the page, hidden, while its step is not current.",
    },
    StepperPrevious: {
      variant: "Button's look; `secondary` by default.",
    },
  },
  theming:
    "The circle is `--card` with a 2px `--border` edge; its number is `--muted-foreground`, the current step's and the check `--primary`; an error is `--invalid` and `--destructive-strong`. Titles are 14px medium in `--muted-foreground`, the current one `--primary`. The line after a completed step is `--primary`, the others `--border`.",
} satisfies ComponentDoc
