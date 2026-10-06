import { useState } from "react"
import { CheckboxGroup, CheckboxGroupItem } from "@booleanpress/ui/checkbox-group"

export default function CheckboxGroupControlled() {
  const [channels, setChannels] = useState(["email"])

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="font-mono text-sm/normal text-muted-foreground">onValueChange: {JSON.stringify(channels)}</p>
      <CheckboxGroup value={channels} onValueChange={setChannels} orientation="horizontal" aria-label="Alert channels">
        <CheckboxGroupItem value="email" label="Email" />
        <CheckboxGroupItem value="sms" label="SMS" />
        <CheckboxGroupItem value="slack" label="Slack" />
        <CheckboxGroupItem value="webhook" label="Webhook" />
      </CheckboxGroup>
    </div>
  )
}
