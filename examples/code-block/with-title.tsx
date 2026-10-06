import { CodeBlock } from "@booleanpress/ui/code-block"

const CODE = `{
  "mailer": "primary",
  "from": "hello@example.com",
  "retries": 3
}`

export default function CodeBlockWithTitle() {
  return <CodeBlock title="mailer.config.json" code={CODE} language="json" className="w-full max-w-lg" />
}
