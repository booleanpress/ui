import { SearchField } from "@booleanpress/ui/search-field"

export default function SearchFieldDisabled() {
  return (
    <div className="w-full max-w-sm">
      <SearchField disabled aria-label="Search API keys" defaultValue="live" />
    </div>
  )
}
