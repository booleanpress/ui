import type { ComponentDoc } from "../types.ts"

export default {
  slug: "confirm",
  title: "Confirm",
  category: "Overlay",
  purpose: "Asks a yes-or-no question from code: confirm() opens a confirmation dialog and resolves to true or false.",
  links: {
    radix: { label: "Radix Alert Dialog", href: "https://www.radix-ui.com/primitives/docs/components/alert-dialog" },
    apg: { label: "APG Alert Dialog", href: "https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/" },
    spec: "specs/004_full-suite-components.md#confirm",
  },
  usage: `\`\`\`tsx
function DeleteMailer({ onDelete }: { onDelete: () => void }) {
  const confirm = useConfirm()
  const remove = async () => {
    if (await confirm({ title: "Delete the Staging mailer?", description: "This cannot be undone.", tone: "destructive" })) {
      onDelete()
    }
  }
  return <Button variant="destructive" onClick={remove}>Delete mailer</Button>
}

<ConfirmProvider>
  <DeleteMailer onDelete={onDelete} />
</ConfirmProvider>
\`\`\`

Render \`ConfirmProvider\` once, inside \`BooleanUIProvider\`, around any component that calls \`useConfirm()\`; the hook throws outside it.`,
  examples: [
    { id: "basic", title: "Basic", description: "`await confirm()` with a title, a description and a confirm label." },
    { id: "destructive", title: "Destructive", description: "`tone=\"destructive\"` gives a red Delete button and starts focus on Cancel." },
    { id: "custom", title: "Custom labels and icon", description: "Your own button labels and an icon, with focus starting on Cancel." },
    { id: "async", title: "Async confirm", description: "`onConfirm` can return a promise; the button shows a spinner until it finishes." },
    { id: "async-error", title: "Async error", description: "When the first attempt fails, the dialog stays open with the error so you can try again." },
    { id: "queued", title: "Queued", description: "Two confirmations asked at once open one after the other." },
  ],
  accessibility: {
    semantics:
      'An `alertdialog` named by the title and described by the description; the rest of the page is hidden from assistive technology while it is open.',
    labels:
      "The title names the dialog, so make it a question. An error from `onConfirm` is shown in a `role=\"alert\"` paragraph and read at once.",
    focus:
      "Focus starts on Confirm, or on Cancel when `tone` is `destructive`, and stays inside. When the last confirmation closes, focus returns to the element that asked.",
    limits: [
      "One confirmation at a time: the others wait, in the order they were asked.",
      "There is no text-input (prompt) variant. Ask for text in a [Dialog](/components/dialog) with a form.",
      "A click on the backdrop does nothing, as in every alert dialog: the person answers with a button or Escape.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "Activates the focused button: Confirm resolves `true`, Cancel and the × resolve `false`." },
    { keys: ["Escape"], behaviour: "Cancels: the dialog closes and `confirm()` resolves `false`. Ignored while `onConfirm` runs." },
    { keys: ["Tab"], behaviour: "Moves to the next button inside the dialog, wrapping from the last to the first." },
    { keys: ["Shift", "Tab"], behaviour: "Moves to the previous button inside the dialog, wrapping from the first to the last." },
  ],
  props: {
    ConfirmProvider: {
      children: "The part of the app that calls `useConfirm()`.",
    },
  },
  theming:
    "The dialog is the library's Alert dialog at 352 px: `--popover` and `--popover-foreground`, the `--mask` backdrop, the Button colours for its buttons (Cancel is `secondary`; Confirm `default`, or `destructive` with `tone=\"destructive\"`).",
} satisfies ComponentDoc
