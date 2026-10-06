import { Toggle } from "@booleanpress/ui/toggle"

export default function ToggleSizes() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Toggle size="sm" className="min-w-16">
        Small
      </Toggle>
      <Toggle className="min-w-20">Default</Toggle>
      <Toggle size="lg" className="min-w-28">
        Large
      </Toggle>
    </div>
  )
}
