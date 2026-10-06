import { useEffect, useRef, useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { VirtualScroller } from "@booleanpress/ui/virtual-scroller"

const contact = (index: number) => ({ id: index + 1, email: `subscriber${index + 1}@example.com` })

export default function VirtualScrollerEmptyAndRetry() {
  const [contacts, setContacts] = useState<ReturnType<typeof contact>[]>([])
  const [loading, setLoading] = useState(false)
  // The first request found nothing, so there is nothing more to ask for until the person tries again.
  const [loaded, setLoaded] = useState(false)
  const request = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(request.current), [])

  // A pretend request: rows arrive after 800 ms.
  const retry = () => {
    setLoading(true)
    request.current = setTimeout(() => {
      setContacts(Array.from({ length: 30 }, (_, index) => contact(index)))
      setLoaded(true)
      setLoading(false)
    }, 800)
  }

  return (
    <VirtualScroller
      aria-label="Subscribers"
      items={contacts}
      itemSize={40}
      getItemKey={(subscriber) => subscriber.id}
      loading={loading}
      hasMore={false}
      empty={
        loaded ? undefined : (
          <div className="flex flex-col items-start gap-2">
            <span>No subscribers came back.</span>
            <Button variant="outline" size="sm" onClick={retry}>
              Try again
            </Button>
          </div>
        )
      }
      className="h-60 w-full max-w-xs rounded-sm border"
      renderItem={(subscriber, index) => (
        <div className={`flex h-full items-center p-2 text-sm ${index % 2 ? "bg-muted" : ""}`}>{subscriber.email}</div>
      )}
    />
  )
}
