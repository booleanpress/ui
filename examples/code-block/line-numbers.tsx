import { CodeBlock } from "@booleanpress/ui/code-block"

const CODE = `curl https://api.example.com/v1/messages \\
  -H "Authorization: Bearer $API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"to": "ada@example.com", "subject": "Welcome"}'`

export default function CodeBlockLineNumbers() {
  return <CodeBlock title="Send a message" code={CODE} language="bash" lineNumbers className="w-full max-w-lg" />
}
