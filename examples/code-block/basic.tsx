import { CodeBlock } from "@booleanpress/ui/code-block"

const CODE = `import { createMailer } from "@example/mail"

const mailer = createMailer({
  host: "smtp.example.com",
  port: 587,
})`

export default function CodeBlockBasic() {
  return <CodeBlock code={CODE} language="ts" className="w-full max-w-lg" />
}
