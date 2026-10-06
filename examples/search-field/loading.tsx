import { useEffect, useRef, useState } from "react"
import { SearchField } from "@booleanpress/ui/search-field"

export default function SearchFieldLoading() {
  const [loading, setLoading] = useState(true)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="w-full max-w-sm">
      <SearchField
        aria-label="Search tickets"
        placeholder="Search tickets"
        defaultValue="invoice"
        loading={loading}
        onChange={() => {
          // A pretend lookup: the results arrive 800 ms after the last change.
          setLoading(true)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => setLoading(false), 800)
        }}
      />
    </div>
  )
}
