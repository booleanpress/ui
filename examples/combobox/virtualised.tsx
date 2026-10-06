import { useImperativeHandle, useRef, useState, type RefObject } from "react"
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual"
import { Label } from "@booleanpress/ui/label"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, useComboboxFilteredItems } from "@booleanpress/ui/combobox"

const LISTS = Array.from({ length: 1000 }, (_, index) => `Contact list ${String(index + 1).padStart(4, "0")}`)

function VirtualOptions({ open, virtualizer }: { open: boolean; virtualizer: RefObject<Virtualizer<HTMLDivElement, Element> | null> }) {
  const items = useComboboxFilteredItems<string>()
  const scroller = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Virtual returns functions the compiler cannot memoise
  const rows = useVirtualizer({ enabled: open, count: items.length, getScrollElement: () => scroller.current, estimateSize: () => 31, overscan: 10, paddingStart: 4, paddingEnd: 4 })
  useImperativeHandle(virtualizer, () => rows)
  if (!items.length) return null

  return (
    <div ref={scroller} role="presentation" className="max-h-[min(18rem,var(--available-height))] overflow-y-auto overscroll-contain">
      <div role="presentation" className="relative" style={{ height: rows.getTotalSize() }}>
        {rows.getVirtualItems().map((row) => (
          <ComboboxItem
            key={row.key}
            index={row.index}
            value={items[row.index]}
            aria-setsize={items.length}
            aria-posinset={row.index + 1}
            className="absolute inset-x-1 w-auto"
            style={{ top: 0, height: 29, transform: `translateY(${row.start}px)` }}
          >
            {items[row.index]}
          </ComboboxItem>
        ))}
      </div>
    </div>
  )
}

export default function ComboboxVirtualised() {
  const [open, setOpen] = useState(false)
  const virtualizer = useRef<Virtualizer<HTMLDivElement, Element> | null>(null)

  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-list">Contact list</Label>
      <Combobox
        items={LISTS}
        virtualized
        open={open}
        onOpenChange={setOpen}
        onItemHighlighted={(item, { reason, index }) => {
          if (item && reason === "keyboard") queueMicrotask(() => virtualizer.current?.scrollToIndex(index, { align: "auto" }))
        }}
      >
        <ComboboxInput id="combobox-list" placeholder="Search 1,000 lists" />
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList className="overflow-visible p-0">
            <VirtualOptions open={open} virtualizer={virtualizer} />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
