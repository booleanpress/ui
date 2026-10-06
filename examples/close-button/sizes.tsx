import { CloseButton } from "@booleanpress/ui/close-button"

export default function CloseButtonSizes() {
  return (
    <div className="flex items-center gap-2">
      <CloseButton size="sm" />
      <CloseButton />
      <CloseButton size="lg" />
    </div>
  )
}
