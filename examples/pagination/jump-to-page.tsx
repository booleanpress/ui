import { useState } from "react"
import { Pagination, PaginationJump, PaginationPages } from "@booleanpress/ui/pagination"

export default function PaginationJumpToPage() {
  const [page, setPage] = useState(1)

  return (
    <Pagination className="flex-wrap items-center gap-4">
      <PaginationPages page={page} pageCount={20} onPageChange={setPage} />
      <PaginationJump page={page} pageCount={20} onPageChange={setPage} />
    </Pagination>
  )
}
