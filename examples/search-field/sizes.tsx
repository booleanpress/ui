import { SearchField } from "@booleanpress/ui/search-field"

export default function SearchFieldSizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <SearchField size="sm" aria-label="Search customers, small" placeholder="Small" />
      <SearchField aria-label="Search customers, normal" placeholder="Normal" />
      <SearchField size="lg" aria-label="Search customers, large" placeholder="Large" />
    </div>
  )
}
