import { CopyButton } from "@booleanpress/ui/copy-button"

export default function CopyButtonWithLabel() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <CopyButton value="smtp.example.com" showLabel />
      <CopyButton value="smtp.example.com" showLabel variant="secondary" size="sm" />
    </div>
  )
}
