import { Badge } from "@booleanpress/ui/badge"

export default function BadgeDot() {
  return (
    <div className="flex items-center justify-center gap-4">
      <Badge dot aria-label="New" />
      <Badge dot severity="success" aria-label="Connected" />
      <Badge dot severity="warning" aria-label="Needs attention" />
      <Badge dot severity="danger" aria-label="Disconnected" />
    </div>
  )
}
