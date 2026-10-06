import { InlineCode } from "@booleanpress/ui/typography"

export default function CodeBlockInline() {
  return (
    <p className="max-w-md text-sm/normal">
      Set <InlineCode>SMTP_KEY</InlineCode> in your environment, then call <InlineCode>createMailer()</InlineCode> with the
      host and port your provider gives you.
    </p>
  )
}
