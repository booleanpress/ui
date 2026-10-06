import { Badge } from "@booleanpress/ui/badge"

export default function BadgeSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Badge severity="primary" size="sm">Small</Badge>
        <Badge severity="primary">Default</Badge>
        <Badge severity="primary" size="lg">Large</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge size="sm">Small</Badge>
        <Badge>Default</Badge>
        <Badge size="lg">Large</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge count={3} size="sm" />
        <Badge count={3} />
        <Badge count={3} size="lg" />
      </div>
    </div>
  )
}
