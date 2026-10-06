import type { ComponentDoc } from "../types.ts"

export default {
  slug: "confirm-popup",
  title: "Confirm popup",
  category: "Overlay",
  purpose: "A small confirmation that opens beside the button that asked, with a message, Cancel and Confirm.",
  links: {
    radix: { label: "Radix Popover", href: "https://www.radix-ui.com/primitives/docs/components/popover" },
    apg: { label: "APG Alert Dialog", href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/" },
    spec: "specs/004_full-suite-components.md#confirm-popup",
  },
  usage: `\`\`\`tsx
<ConfirmPopup tone="destructive" onConfirm={onDelete}>
  <ConfirmPopupTrigger asChild>
    <Button variant="outline">Delete entry</Button>
  </ConfirmPopupTrigger>
  <ConfirmPopupContent message="Delete this log entry?" />
</ConfirmPopup>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "An icon, a message, Cancel and Save, opening below the trigger." },
    { id: "destructive", title: "Destructive", description: "`tone=\"destructive\"` gives a red Delete button and starts focus on Cancel." },
    { id: "custom-content", title: "Custom content", description: "Your own content in place of the message, with a confirm that waits for a request." },
    { id: "placement", title: "Placement", description: "The popup can open on any of the four sides of its trigger." },
    { id: "async-error", title: "Async error", description: "When the request fails, the popup stays open and shows the error." },
  ],
  accessibility: {
    semantics:
      'The popup is an `alertdialog`, named by its message, and the rest of the page is hidden from assistive technology while it is open.',
    labels:
      "Write the message as the question. An error from `onConfirm` is shown in a `role=\"alert\"` paragraph.",
    focus:
      "Focus moves to Confirm when it opens, or to Cancel when `tone` is `destructive`, and stays inside. It returns to the trigger on close.",
    limits: [
      "It is modal: while it is open, a click outside closes it (as Cancel) and does not reach what it lands on.",
      "Keep the message to a line or two; a longer explanation belongs in a dialog.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On the trigger, opens the popup; on a button, activates it." },
    { keys: ["Escape"], behaviour: "Cancels and closes the popup; focus returns to the trigger. Ignored while `onConfirm` runs." },
    { keys: ["Tab"], behaviour: "Moves between Cancel and Confirm, wrapping." },
    { keys: ["Shift", "Tab"], behaviour: "Moves between Confirm and Cancel, wrapping." },
  ],
  props: {
    ConfirmPopupTrigger: { asChild: "Render the child element instead, with this part's behaviour merged onto it." },
    ConfirmPopupContent: {
      side: "The side of the trigger it opens on: `top`, `right`, `bottom` (default) or `left`. It flips when there is no room.",
      align: "Its alignment along that side: `start` (default), `center` or `end`.",
      alignOffset: "Pixels to shift it along that side.",
      collisionPadding: "Pixels it keeps from the window's edges. 8 by default.",
      onEscapeKeyDown: "Called when Escape is pressed. Call `event.preventDefault()` to keep it open.",
      onInteractOutside: "Called on a pointer down or focus outside it. Call `event.preventDefault()` to keep it open.",
      onOpenAutoFocus: "Called when focus moves in. Call `event.preventDefault()` to choose the element yourself.",
      onCloseAutoFocus: "Called when focus leaves as it closes. Call `event.preventDefault()` to choose where focus goes.",
    },
  },
  theming:
    "A floating surface: `--popover`, `--popover-foreground` and `--border`, 6px radius, the overlay shadow; its arrow takes the same fill and edge. The buttons are the small Button: Cancel `outline` in the muted text colour, Confirm `default` or `destructive`.",
} satisfies ComponentDoc
