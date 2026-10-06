import { Kbd, KbdGroup } from "@booleanpress/ui/kbd"

export default function KbdGroupExample() {
  return (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <span aria-hidden="true" className="text-muted-foreground">
        +
      </span>
      <Kbd>K</Kbd>
    </KbdGroup>
  )
}
