import { useState } from "react"
import { Pagination, PaginationPages } from "@booleanpress/ui/pagination"

export default function PaginationSiblings() {
  const [page, setPage] = useState(6)

  return (
    <Pagination>
      <PaginationPages page={page} pageCount={20} siblings={2} onPageChange={setPage} />
    </Pagination>
  )
}
