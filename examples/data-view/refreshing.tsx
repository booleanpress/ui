import { useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { DataView } from "@booleanpress/ui/data-view"

const LOGS = [
  { id: "l1", to: "ana@example.com", subject: "Your receipt", result: "Delivered" },
  { id: "l2", to: "ben@example.com", subject: "Reset your password", result: "Delivered" },
  { id: "l3", to: "chen@example.org", subject: "Welcome aboard", result: "Bounced" },
]

export default function DataViewRefreshing() {
  const [loading, setLoading] = useState(false)

  const refresh = () => {
    setLoading(true)
    // A stand-in for a request: new rows arrive after a second.
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <DataView
      aria-label="Delivery log"
      items={LOGS}
      getItemKey={(log) => log.id}
      loading={loading}
      className="w-full"
      header={
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
          <RefreshCwIcon />
          Refresh
        </Button>
      }
      renderItem={(log) => (
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_5.5rem] items-center gap-4 text-sm">
          <span className="truncate">{log.to}</span>
          <span className="truncate text-muted-foreground">{log.subject}</span>
          <span className="text-end">{log.result}</span>
        </div>
      )}
    />
  )
}
