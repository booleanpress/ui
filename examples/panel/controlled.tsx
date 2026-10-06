import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Panel, PanelContent, PanelHeader, PanelTitle, PanelTrigger } from "@booleanpress/ui/panel"

const ROWS = [
  { label: "Host", value: "smtp.example.com" },
  { label: "Port", value: "587 (STARTTLS)" },
  { label: "Signed in as", value: "mailer@example.com" },
]

export default function PanelControlled() {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <div className="flex justify-center gap-2">
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Close
        </Button>
      </div>
      <Panel toggleable open={open} onOpenChange={setOpen}>
        <PanelHeader>
          <PanelTitle>SMTP connection</PanelTitle>
          <PanelTrigger />
        </PanelHeader>
        <PanelContent>
          <dl className="flex flex-col gap-3">
            {ROWS.map((row) => (
              <div key={row.label} className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </PanelContent>
      </Panel>
    </div>
  )
}
