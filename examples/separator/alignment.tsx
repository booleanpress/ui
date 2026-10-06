import { Separator } from "@booleanpress/ui/separator"

export default function SeparatorAlignment() {
  return (
    <div className="w-full max-w-md text-sm">
      <p>Choose a provider and paste its credentials.</p>
      <Separator align="start" className="my-3.5">
        <span className="font-mono text-xs uppercase">Getting started</span>
      </Separator>
      <p>Send a test email to check the connection.</p>
      <Separator variant="dotted" className="my-3.5">
        <span className="font-mono text-xs uppercase">Testing</span>
      </Separator>
      <p>Failed emails are retried, then logged.</p>
      <Separator variant="dashed" align="end" className="my-3.5">
        <span className="font-mono text-xs uppercase">Monitoring</span>
      </Separator>
      <p>Alerts reach your team when a domain fails.</p>
    </div>
  )
}
