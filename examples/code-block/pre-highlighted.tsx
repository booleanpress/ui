import { CodeBlock } from "@booleanpress/ui/code-block"

const CODE = `// Retry a failed delivery
const result = await mailer.retry("msg_01J9X4T2QZ")
console.log(result.status)`

// What a highlighter returns, written by hand here: Shiki's or Prism's HTML goes in the same prop.
const HTML = [
  `<span class="text-muted-foreground italic">// Retry a failed delivery</span>`,
  `<span class="text-destructive-strong">const</span> result = <span class="text-destructive-strong">await</span> mailer.<span class="text-info-strong">retry</span>(<span class="text-success-tag-foreground">"msg_01J9X4T2QZ"</span>)`,
  `console.<span class="text-info-strong">log</span>(result.status)`,
].join("\n")

export default function CodeBlockPreHighlighted() {
  return <CodeBlock title="retry.ts" code={CODE} html={HTML} language="ts" lineNumbers className="w-full max-w-lg" />
}
