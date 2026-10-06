import { VirtualScroller } from "@booleanpress/ui/virtual-scroller"

const TEMPLATES = Array.from({ length: 10_000 }, (_, index) => ({
  id: index + 1,
  name: `Template ${index + 1}`,
  kind: ["Welcome", "Receipt", "Digest", "Reminder"][index % 4],
}))

export default function VirtualScrollerGrid() {
  return (
    <VirtualScroller
      aria-label="Email templates"
      orientation="grid"
      columns={3}
      gap={8}
      items={TEMPLATES}
      itemSize={72}
      getItemKey={(template) => template.id}
      className="h-72 w-full max-w-md rounded-sm border p-2"
      renderItem={(template) => (
        <div className="flex h-full flex-col justify-center rounded-md border bg-card px-3 text-sm">
          <span className="truncate font-medium">{template.name}</span>
          <span className="text-xs text-muted-foreground">{template.kind}</span>
        </div>
      )}
    />
  )
}
