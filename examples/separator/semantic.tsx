import { Separator } from "@booleanpress/ui/separator"

export default function SeparatorSemantic() {
  return (
    <div className="w-full max-w-xs text-sm">
      <p>Failed emails</p>
      <Separator decorative={false} className="my-3.5" />
      <p>Delivered emails</p>
    </div>
  )
}
