import { CodeBlock } from "@booleanpress/ui/code-block"

const LINES = Array.from(
  { length: 24 },
  (_, index) =>
    `2026-10-0${(index % 9) + 1}T09:${String(10 + index).padStart(2, "0")}:00Z  delivered  msg_01J9X4T2Q${index}  to=customer${index}@example.com  mailer=primary  latency=${120 + index * 7}ms`
)

export default function CodeBlockLong() {
  return (
    <CodeBlock
      title="delivery.log"
      code={LINES.join("\n")}
      language="log"
      lineNumbers
      wrapToggle
      maxHeight={240}
      className="w-full max-w-lg"
    />
  )
}
