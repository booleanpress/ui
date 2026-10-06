import { SearchField } from "@booleanpress/ui/search-field"

export default function SearchFieldBasic() {
  return (
    <div className="w-full max-w-sm">
      <SearchField aria-label="Search delivery logs" placeholder="Search delivery logs" />
    </div>
  )
}
