import { VirtualScroller } from "@booleanpress/ui/virtual-scroller"

// Every hour of October 2026, with a made-up send count.
const HOURS = Array.from({ length: 31 * 24 }, (_, index) => ({
  label: `Oct ${Math.floor(index / 24) + 1}, ${String(index % 24).padStart(2, "0")}:00`,
  sent: (index * 37) % 100,
}))

export default function VirtualScrollerHorizontal() {
  return (
    <VirtualScroller
      aria-label="Emails sent each hour in October 2026"
      orientation="horizontal"
      items={HOURS}
      itemSize={50}
      className="h-50 w-full max-w-md rounded-sm border"
      renderItem={(hour, index) => (
        <div className={`flex h-full flex-col items-center justify-end gap-2 p-2 text-sm ${index % 2 ? "bg-muted" : ""}`}>
          <span className="w-4 rounded-sm bg-primary" style={{ height: `${hour.sent}%` }} />
          <span className="text-xs whitespace-nowrap text-muted-foreground [writing-mode:vertical-lr]">{hour.label}</span>
          <span className="sr-only">{hour.sent} sent</span>
        </div>
      )}
    />
  )
}
