import { VirtualScroller } from "@booleanpress/ui/virtual-scroller"

const LINES = [
  "Thanks, that fixed it.",
  "The invoice for October shows the old company address. Could you send a corrected copy to our accounts team?",
  "Can we move the call to Thursday?",
  "Our sending domain fails the DKIM check since we changed DNS provider on 2 October. We have copied the record from the dashboard twice and it still says pending. Screenshots attached.",
  "Please close this ticket.",
]
const REPLIES = Array.from({ length: 5_000 }, (_, index) => ({ id: index + 1, text: LINES[(index * 3) % LINES.length] }))

export default function VirtualScrollerVariableHeights() {
  return (
    <VirtualScroller
      aria-label="Ticket replies"
      items={REPLIES}
      estimatedItemSize={60}
      getItemKey={(reply) => reply.id}
      className="h-72 w-full max-w-sm rounded-sm border"
      renderItem={(reply, index) => (
        <div className={`flex flex-col gap-1 p-2 text-sm ${index % 2 ? "bg-muted" : ""}`}>
          <span className="text-xs text-muted-foreground">Reply {reply.id}</span>
          <span>{reply.text}</span>
        </div>
      )}
    />
  )
}
