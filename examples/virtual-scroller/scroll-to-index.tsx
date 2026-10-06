import { useRef } from "react"
import { Button } from "@booleanpress/ui/button"
import { VirtualScroller, type VirtualScrollerHandle } from "@booleanpress/ui/virtual-scroller"

const number = new Intl.NumberFormat("en-US")
const EVENTS = Array.from({ length: 10_000 }, (_, index) => `Webhook event ${number.format(index + 1)}`)

export default function VirtualScrollerScrollToIndex() {
  const scroller = useRef<VirtualScrollerHandle>(null)

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => scroller.current?.scrollToIndex(4_999, { align: "start" })}>
          Go to event 5,000
        </Button>
        <Button variant="outline" size="sm" onClick={() => scroller.current?.scrollToIndex(0)}>
          Back to the first
        </Button>
      </div>
      <VirtualScroller
        ref={scroller}
        aria-label="Webhook events"
        items={EVENTS}
        itemSize={40}
        className="h-50 rounded-sm border"
        renderItem={(event, index) => (
          <div className={`flex h-full items-center p-2 text-sm ${index % 2 ? "bg-muted" : ""}`}>{event}</div>
        )}
      />
    </div>
  )
}
