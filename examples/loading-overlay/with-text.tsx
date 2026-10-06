import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { LoadingOverlay } from "@booleanpress/ui/loading-overlay"

const STATS = [
  { label: "Sent", value: "12,480" },
  { label: "Delivered", value: "12,301" },
  { label: "Bounced", value: "179" },
]

export default function LoadingOverlayWithText() {
  const [refreshing, setRefreshing] = useState(true)

  return (
    <div className="flex w-full max-w-md flex-col items-end gap-3">
      <LoadingOverlay loading={refreshing} label="Refreshing statistics…" className="w-full">
        <dl className="grid grid-cols-3 gap-3 rounded-md border p-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="text-lg font-semibold tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </LoadingOverlay>
      <Button variant="outline" size="sm" onClick={() => setRefreshing((value) => !value)}>
        {refreshing ? "Stop" : "Refresh"}
      </Button>
    </div>
  )
}
