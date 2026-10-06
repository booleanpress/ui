import { useState } from "react"
import { Pagination, PaginationPages } from "@booleanpress/ui/pagination"

export default function PaginationFirstAndLast() {
  const [page, setPage] = useState(1)

  return (
    <Pagination aria-label="Delivery log pages">
      <PaginationPages page={page} pageCount={20} onPageChange={setPage} showEdges />
    </Pagination>
  )
}
