import { useEffect, useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { LoadingOverlay } from "@booleanpress/ui/loading-overlay"
import { ProgressCircle } from "@booleanpress/ui/progress-circle"

export default function LoadingOverlayCustomIndicator() {
  const [progress, setProgress] = useState<number | null>(null)

  // Stands in for an upload that reports its progress: 10 steps of 300 ms.
  useEffect(() => {
    if (progress === null) return
    const timer = setTimeout(() => setProgress(progress >= 100 ? null : progress + 10), 300)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className="flex w-full max-w-sm flex-col items-end gap-3">
      <LoadingOverlay
        loading={progress !== null}
        label="Uploading the template…"
        indicator={<ProgressCircle value={progress ?? 0} size="sm" aria-label="Upload progress" />}
        className="w-full"
      >
        <div className="rounded-md border p-4 text-sm">
          <p className="font-medium">Welcome email</p>
          <p className="text-muted-foreground">welcome-2026.html, 48 KB</p>
        </div>
      </LoadingOverlay>
      <Button variant="outline" size="sm" onClick={() => setProgress(0)} disabled={progress !== null}>
        Upload template
      </Button>
    </div>
  )
}
