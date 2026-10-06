import { CopyButton } from "@booleanpress/ui/copy-button"

export default function CopyButtonIconOnly() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-mono">msg_01J9X4T2QZ</span>
      <CopyButton value="msg_01J9X4T2QZ" label="Copy message ID" size="sm" />
    </div>
  )
}
