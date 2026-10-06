import { VirtualScroller } from "@booleanpress/ui/virtual-scroller"

const number = new Intl.NumberFormat("en-US")
const DELIVERIES = Array.from({ length: 100_000 }, (_, index) => ({ id: index + 1, to: `customer${(index * 7919) % 5000}@example.com` }))

export default function VirtualScrollerBasic() {
  return (
    <VirtualScroller
      aria-label="Delivery log, 100,000 messages"
      items={DELIVERIES}
      itemSize={50}
      getItemKey={(delivery) => delivery.id}
      className="h-50 w-full max-w-xs rounded-sm border"
      renderItem={(delivery, index) => (
        <div className={`flex h-full flex-col justify-center p-2 text-sm ${index % 2 ? "bg-muted" : ""}`}>
          <span>Message #{number.format(delivery.id)}</span>
          <span className="truncate text-xs text-muted-foreground">{delivery.to}</span>
        </div>
      )}
    />
  )
}
