import { useState } from "react"
import { Pagination, PaginationPages, PaginationRowsPerPage } from "@booleanpress/ui/pagination"

const TOTAL = 240

export default function PaginationRowsPerPageExample() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <Pagination className="flex-wrap items-center gap-4">
      <PaginationPages page={page} pageCount={Math.ceil(TOTAL / pageSize)} onPageChange={setPage} />
      <PaginationRowsPerPage
        value={pageSize}
        onValueChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </Pagination>
  )
}
