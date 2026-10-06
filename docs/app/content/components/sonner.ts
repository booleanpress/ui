import type { ComponentDoc } from "../types.ts"

export default {
  slug: "sonner",
  title: "Toast",
  category: "Messages",
  purpose: "Shows a short message that appears after an action and goes away by itself, such as \"Settings saved\".",
  links: {
    apg: { label: "APG Alert", href: "https://www.w3.org/WAI/ARIA/apg/patterns/alert/" },
    spec: "specs/003_moved-components.md#toast",
  },
  peers: ["sonner"],
  usage: `\`\`\`tsx
<Button onClick={() => toast.success("Settings saved")}>Save</Button>
<Toaster />
\`\`\`

Render \`Toaster\` once near the root of the app, inside \`BooleanUIProvider\`, and call \`toast\` from the \`sonner\` package.`,
  examples: [
    { id: "default", title: "Default", description: "A plain message with a close button." },
    { id: "status", title: "Status", description: "`toast.success`, `error`, `warning` and `info`, each with its own icon and colour." },
    { id: "promise", title: "Promise", description: "`toast.promise` shows a spinner while a request runs, then the result." },
    { id: "update", title: "Update", description: "Calling `toast` again with the same `id` turns a loading toast into its result." },
    { id: "sticky", title: "Sticky", description: "`duration: Infinity` keeps the toast until it is closed." },
    { id: "custom", title: "Custom", description: "`toast.custom` renders your own card in the same stack." },
    { id: "position", title: "Position", description: "`position` on `Toaster` moves the stack to any of six places." },
    { id: "expanded", title: "Expanded", description: "`expand` shows every toast open instead of stacked." },
    { id: "description-action", title: "Description and action", description: "A second line of text and an action button, such as Undo." },
  ],
  accessibility: {
    semantics:
      'Toasts sit in a named `section` as list items with live-region text. Each close button is a native `button`.',
    labels:
      "Write the message so it makes sense without the colour or icon, and give an action a label that names what it does, such as \"Undo\".",
    focus:
      "Toasts do not take focus when they appear. Alt+T moves focus into the list, and Tab then reaches each action and close button.",
    limits: [
      "A toast leaves after 4 seconds, which is too short to read for some people, and a screen reader may be reading something else. Never put the only copy of an error, or anything that needs a decision, in a toast: show it in the page too (an `Alert` or a field error).",
      "An action in a toast can disappear before it is reached by keyboard. Offer the same action somewhere permanent.",
      "At most 3 toasts are visible; the rest queue behind them and are not announced until they show.",
      "A sticky toast (`duration: Infinity`) stays until it is closed, which suits a state that lasts, such as a paused mailer; it still needs its close button or an action, and the same state shown in the page.",
      "A toast updated in place is announced again by most screen readers only when its text changes; keep the result's wording different from the loading text.",
      "A custom toast has no close button of its own and no icon: give it a named button that closes it, and say its kind in words.",
    ],
  },
  keyboard: [
    { keys: ["Alt", "T"], behaviour: "Moves focus to the list of notifications." },
    { keys: ["Tab"], behaviour: "Moves between the toasts, their action buttons and their close buttons." },
    { keys: ["Enter"], behaviour: "On the close button, closes the toast. On an action button it activates it, as for any button." },
    { keys: ["Space"], behaviour: "On the close button, closes the toast. On an action button it activates it, as for any button." },
  ],
  theming: `Each status type takes the status tokens (\`success\`, \`info\`, \`warning\`, \`destructive\`): the \`-subtle\` fill, the \`-border\` edge, the title and icon in \`-strong\`, the description in \`--foreground\`. The plain toast uses \`--popover\`, \`--popover-foreground\` and \`--border\`, with the description in \`--muted-foreground\`; the action button uses \`--primary\`. Override any of Sonner's CSS variables with \`style\`, and the part classes with \`toastOptions.classNames\`: a part you set replaces the package's classes for that part, and the other parts keep theirs. \`className\` adds classes to the toaster's lists.`,
  props: {
    Toaster: {
      id: "Names this toaster. Only toasts sent with the same `toasterId` appear in it; needed only when a page has more than one.",
      theme: "`light`, `dark` or `system` (the default). Pass the app's own theme.",
      position: "Where the stack sits: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center` or `bottom-right` (the default). Left and right are the window's, whatever the direction.",
      offset: "The distance from the edge of the window, as a number, a CSS length, or an object with `top`, `right`, `bottom`, `left`.",
      mobileOffset: "The same, below 600 px.",
      toastOptions: "Defaults for every toast, such as `duration` or `classNames`. The package's class names are kept unless you set the same part.",
      expand: "Shows every toast open, one above another, instead of stacked. `false` by default: the stack opens while the pointer is over it.",
      duration: "Milliseconds every toast stays, unless it sets its own. 4000 here; `Infinity` keeps toasts until they are closed.",
      hotkey: "The keys that focus the list. The default is Alt+T.",
      gap: "The space between open toasts, in pixels.",
    },
  },
} satisfies ComponentDoc
