import { CodeBlock } from "@booleanpress/ui/code-block"

const CODE = `const mailer = createMailer({
  host: "smtp.example.com",
  port: 587,
  secure: false,
  auth: { user: "apikey", pass: process.env.SMTP_KEY },
})`

export default function CodeBlockHighlightedLines() {
  return (
    <CodeBlock
      title="mailer.ts"
      code={CODE}
      language="ts"
      lineNumbers
      highlightLines={[3, 4]}
      className="w-full max-w-lg"
    />
  )
}
