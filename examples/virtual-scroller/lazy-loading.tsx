import { useEffect, useRef, useState } from "react"
import { VirtualScroller } from "@booleanpress/ui/virtual-scroller"

const PAGE = 30
const TOTAL = 150
const contact = (index: number) => ({ id: index + 1, email: `subscriber${index + 1}@example.com` })

export default function VirtualScrollerLazyLoading() {
  const [contacts, setContacts] = useState(() => Array.from({ length: PAGE }, (_, index) => contact(index)))
  const [loading, setLoading] = useState(false)
  const request = useRef<ReturnType<typeof setTimeout>>(undefined)
  // A request still on its way when the list goes away is dropped.
  useEffect(() => () => clearTimeout(request.current), [])

  // A pretend request: the next page arrives after 800 ms.
  const loadMore = () => {
    setLoading(true)
    request.current = setTimeout(() => {
      setContacts((previous) => [...previous, ...Array.from({ length: PAGE }, (_, index) => contact(previous.length + index))])
      setLoading(false)
    }, 800)
  }

  return (
    <VirtualScroller
      aria-label="Subscribers"
      items={contacts}
      itemSize={40}
      getItemKey={(subscriber) => subscriber.id}
      hasMore={contacts.length < TOTAL}
      loading={loading}
      onLoadMore={loadMore}
      className="h-60 w-full max-w-xs rounded-sm border"
      renderItem={(subscriber, index) => (
        <div className={`flex h-full items-center p-2 text-sm ${index % 2 ? "bg-muted" : ""}`}>{subscriber.email}</div>
      )}
    />
  )
}
