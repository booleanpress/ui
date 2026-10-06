import type { ComponentDoc } from "../types.ts"

export default {
  slug: "tour",
  title: "Tour",
  category: "Overlay",
  purpose: "Walks a person through a screen, one element at a time, with a card beside each element and the rest dimmed.",
  links: {
    radix: { label: "Radix Popover", href: "https://www.radix-ui.com/primitives/docs/components/popover" },
    apg: { label: "APG Dialog (Modal)", href: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" },
    spec: "specs/004_full-suite-components.md#tour",
  },
  usage: `\`\`\`tsx
const [open, setOpen] = useState(false)
const create = useRef<HTMLButtonElement>(null)
const steps: TourStep[] = [
  { target: create, title: "Add a mailer", description: "Connect an SMTP server or an email API." },
  { target: "#delivery-log", title: "Read the log", description: "Every message, with its status.", placement: "top" },
]

<Button onClick={() => setOpen(true)}>Start tour</Button>
<Button ref={create}>New mailer</Button>
<Tour steps={steps} open={open} onOpenChange={setOpen} />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "Three steps over a small dashboard, with the rest of the page dimmed." },
    { id: "without-mask", title: "Without mask", description: "With `mask={false}` the card points at each button and the page stays usable." },
    { id: "custom-content", title: "Custom content", description: "A first step without a target, centred, and a second with custom `content`." },
    { id: "controlled", title: "Controlled", description: "`step` and `onStepChange` let the page set the current step; `onFinish` marks the end." },
  ],
  accessibility: {
    semantics: "The card is a `dialog` named by the step's title and described by its description. With the mask it is modal.",
    labels: "The buttons and the step count (\"2 of 3\") come from the provider's strings.",
    focus: "Focus moves to the card on each step, and Tab stays inside it while the mask shows. When the tour ends, focus returns to where it was.",
    limits: [
      "Without the mask the page stays reachable, but a screen reader is not told which element the card points at; say it in the description.",
      "The target cannot be used while the mask shows. Use `mask={false}` for a step that asks the person to press it.",
      "A target that moves after the card opens (a layout change, not a scroll) is followed on the next scroll, resize or step.",
    ],
  },
  keyboard: [
    { keys: ["Tab"], behaviour: "Moves between the card's buttons; Shift+Tab goes back. With the mask it wraps within the card." },
    { keys: ["Enter", "Space"], behaviour: "Presses the focused button: Skip tour, Back, Next or Finish." },
    { keys: ["ArrowRight"], behaviour: "From the card or one of its buttons, goes to the next step (ArrowLeft on a right-to-left page)." },
    { keys: ["ArrowLeft"], behaviour: "From the card or one of its buttons, goes back a step (ArrowRight on a right-to-left page)." },
    { keys: ["Escape"], behaviour: "Ends the tour and returns focus to where it was." },
  ],
  props: {
    Tour: {
      className: "Classes for the card.",
    },
  },
  theming:
    "The card is the floating surface (`--popover`, `--popover-foreground`, the border token); the mask is `--mask`, as Dialog's backdrop. Motion comes from `theme.css`: the card enters as a popover, the mask as a backdrop.",
} satisfies ComponentDoc
