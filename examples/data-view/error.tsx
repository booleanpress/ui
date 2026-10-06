import { useState } from "react"
import { CircleAlertIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { DataView } from "@booleanpress/ui/data-view"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"

export default function DataViewError() {
  const [loading, setLoading] = useState(false)

  const retry = () => {
    setLoading(true)
    // A stand-in for a request that fails again after a second.
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <DataView
      aria-label="Mailers"
      items={[]}
      loading={loading}
      className="w-full"
      renderItem={() => null}
      empty={
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon" className="bg-destructive-subtle text-destructive-strong">
              <CircleAlertIcon />
            </EmptyMedia>
            <EmptyTitle>The mailers could not be loaded</EmptyTitle>
            <EmptyDescription>The server did not answer. Check your connection, then try again.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          </EmptyContent>
        </Empty>
      }
    />
  )
}
