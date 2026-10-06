import type { ComponentDoc } from "../types.ts"

export default {
  slug: "alert",
  title: "Alert",
  category: "Messages",
  purpose: "Shows a message inside the page that people should read, such as a result, a warning or a notice.",
  links: {
    apg: { label: "APG Alert", href: "https://www.w3.org/WAI/ARIA/apg/patterns/alert/" },
    spec: "specs/003_moved-components.md#alert",
  },
  usage: `\`\`\`tsx
<Alert variant="info">
  <InfoIcon />
  <AlertTitle>Logging is on</AlertTitle>
  <AlertDescription>Every email is kept for 30 days, then deleted.</AlertDescription>
</Alert>
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "An icon, a title and a description." },
    { id: "tones", title: "Tones", description: "Success, info, warning and destructive, each with its own icon." },
    { id: "without-icon", title: "Without an icon", description: "With no icon the text uses the full width." },
    { id: "outlined", title: "Outlined", description: "`appearance=\"outline\"` draws the edge only, with no fill." },
    { id: "simple", title: "Simple", description: "`appearance=\"simple\"` shows the coloured icon and text alone." },
    { id: "sizes", title: "Sizes", description: "Small, default and large." },
    { id: "dynamic", title: "Dynamic", description: "Alerts are added to a list and cleared; each is announced as it appears." },
    { id: "dismissible", title: "Dismissible", description: "A close button turns `open` off: the alert fades out, and fades back in when it returns." },
    {
      id: "auto-dismiss",
      title: "Auto-dismiss",
      description: "`duration` removes the alert after a delay; hovering it or focusing inside pauses the count.",
    },
    { id: "with-action", title: "With an action", description: "A small button inside the description answers the message." },
  ],
  accessibility: {
    semantics:
      'A `role="alert"` live region: a screen reader reads it as soon as it appears.',
    labels:
      "The alert's own text is read. Write a title that makes sense alone, and keep the icon decorative.",
    focus: "An alert takes no focus and is not in the tab order. A button or link inside it is.",
    limits: [
      'Every alert is `role="alert"`, so several alerts rendered together on page load are all announced at once. Show only what needs attention, and use a plain `div` with the same classes for a quiet note.',
      "An alert that is present when the page loads is not announced by every screen reader; one added later is. Do not rely on it for the only copy of important text.",
      "`AlertTitle` keeps one line (`line-clamp-1`) and cuts longer titles with an ellipsis, so keep titles short.",
      "An alert that removes itself (`duration`) can be gone before a person has read it, or before a screen reader reaches it. The pause on hover and focus helps people who use a pointer or a keyboard, not those who read slowly without one. Use it for confirmations whose content is also visible elsewhere (\"Settings saved\"), never for errors or anything that needs a decision.",
      "`appearance=\"simple\"` has no edge or fill, so nothing but the colour and the icon marks the tone. Keep the icon, and write the text so it says what happened.",
    ],
  },
  keyboard: [],
  theming: `Each variant is one hue: a subtle fill (\`--{tone}-subtle\`), a matching edge (\`--{tone}-border\`) and strong text and icon (\`--{tone}-strong\`), for \`success\`, \`info\`, \`warning\` and \`destructive\`, with a faint shadow tinted by the tone. \`default\` is neutral: \`--secondary\` with \`--secondary-foreground\` text and a \`--border\` edge. \`outline\` draws the edge in \`--{tone}-strong\` (\`--muted-foreground\` for \`default\`) on no fill, keeping the shadow; \`simple\` keeps only the text colour (\`--muted-foreground\` for \`default\`).`,
  props: {
    Alert: {
      variant: "The tone: `default`, `success`, `warning`, `info` or `destructive`.",
      appearance: "How much of the box is drawn: `default` (fill, edge and shadow), `outline` (the edge in the strong colour, no fill) or `simple` (text and icon only, no padding).",
      size: "`sm`, `default` or `lg`: 12, 14 or 16 px text, with the padding and the icon to match.",
      open: "Whether the alert shows; true by default. Turning it off fades the alert out before it leaves the page, and turning it on again fades it in. An alert that is open when it first renders appears at once, so a page load or a refetch never animates it.",
    },
  },
} satisfies ComponentDoc
