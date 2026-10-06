import { SearchField } from "@booleanpress/ui/search-field"

export default function SearchFieldFilled() {
  return (
    <div className="w-full max-w-sm">
      <SearchField variant="filled" aria-label="Search organisations" placeholder="Search organisations" />
    </div>
  )
}
