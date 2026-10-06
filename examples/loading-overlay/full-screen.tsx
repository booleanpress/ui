import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { LoadingOverlay } from "@booleanpress/ui/loading-overlay"

export default function LoadingOverlayFullScreen() {
  const [importing, setImporting] = useState(false)

  // Stands in for the import; the overlay ends on its own after 2 seconds.
  const start = () => {
    setImporting(true)
    setTimeout(() => setImporting(false), 2000)
  }

  return (
    <>
      <Button variant="outline" onClick={start}>
        Import settings
      </Button>
      <LoadingOverlay fullScreen loading={importing} label="Importing settings…" />
    </>
  )
}
