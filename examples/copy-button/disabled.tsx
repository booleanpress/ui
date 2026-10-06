import { CopyButton } from "@booleanpress/ui/copy-button"

export default function CopyButtonDisabled() {
  return (
    <div className="flex items-center gap-2">
      <CopyButton disabled value="bp_live_4f2a9c7e1d8b6053" label="Copy API key" />
      <CopyButton disabled showLabel value="bp_live_4f2a9c7e1d8b6053" />
    </div>
  )
}
