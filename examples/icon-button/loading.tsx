import * as React from "react"
import { RefreshCwIcon } from "lucide-react"
import { IconButton } from "@booleanpress/ui/icon-button"

export default function IconButtonLoading() {
  const [loading, setLoading] = React.useState(false)

  const refresh = () => {
    setLoading(true)
    window.setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="flex gap-2">
      <IconButton label="Refresh the log" variant="outline" loading={loading} onClick={refresh}>
        <RefreshCwIcon />
      </IconButton>
      <IconButton label="Refreshing" variant="default" loading>
        <RefreshCwIcon />
      </IconButton>
    </div>
  )
}
