import { Kbd } from "@booleanpress/ui/kbd"

export default function KbdBasic() {
  return (
    <div className="flex items-center gap-2">
      <Kbd>Esc</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Tab</Kbd>
    </div>
  )
}
