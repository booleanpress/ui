import { useRef, useState } from "react"
import { Label } from "@booleanpress/ui/label"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteStatus,
} from "@booleanpress/ui/autocomplete"

const ARTICLES = [
  "Set up SPF for your domain",
  "Set up DKIM signing",
  "Read a bounce report",
  "Rotate an API key",
  "Route email per site",
  "Resend failed emails",
]

// Stands in for a request to the help centre: answers after 600 ms.
function searchArticles(query: string) {
  return new Promise<string[]>((resolve) =>
    setTimeout(() => resolve(ARTICLES.filter((title) => title.toLowerCase().includes(query.toLowerCase()))), 600)
  )
}

export default function AutocompleteAsync() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  // Only the latest request may update the list: an earlier, slower answer is dropped.
  const latest = useRef(0)

  async function search(query: string) {
    const request = ++latest.current
    setFailed(false)
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const found = await searchArticles(query)
      if (request === latest.current) setResults(found)
    } catch {
      if (request === latest.current) {
        setResults([])
        setFailed(true)
      }
    } finally {
      if (request === latest.current) setLoading(false)
    }
  }

  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="autocomplete-help">Search the help centre</Label>
      <Autocomplete items={results} filter={null} onValueChange={(query, { reason }) => reason !== "item-press" && search(query)}>
        <AutocompleteInput id="autocomplete-help" placeholder="e.g. bounce" loading={loading} />
        <AutocompleteContent>
          <AutocompleteStatus loading={loading}>{failed ? "Could not search the help centre. Try again." : null}</AutocompleteStatus>
          <AutocompleteList>
            {(title: string) => (
              <AutocompleteItem key={title} value={title}>
                {title}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}
