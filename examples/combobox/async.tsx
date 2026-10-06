import { useRef, useState } from "react"
import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
} from "@booleanpress/ui/combobox"

const ORGANISATIONS = ["Acme Logistics", "Blue Harbour Bank", "Cedar Health", "Delta Freight", "Evergreen Schools", "Fjord Energy"]

// Stands in for a request to the server: answers after 600 ms.
function searchOrganisations(query: string) {
  return new Promise<string[]>((resolve) =>
    setTimeout(() => resolve(ORGANISATIONS.filter((name) => name.toLowerCase().includes(query.toLowerCase()))), 600)
  )
}

export default function ComboboxAsync() {
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
      const found = await searchOrganisations(query)
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
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="combobox-organisation">Organisation</Label>
      <Combobox items={results} filter={null} onInputValueChange={(query, { reason }) => reason !== "item-press" && search(query)}>
        <ComboboxInput id="combobox-organisation" placeholder="Type to search" loading={loading} />
        <ComboboxContent>
          <ComboboxStatus loading={loading}>{failed ? "Could not load organisations. Try again." : null}</ComboboxStatus>
          {!loading && !failed && <ComboboxEmpty />}
          <ComboboxList>
            {(name: string) => (
              <ComboboxItem key={name} value={name}>
                {name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
