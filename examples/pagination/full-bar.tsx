import { useState } from "react"
import {
  Pagination,
  PaginationJump,
  PaginationPages,
  PaginationRange,
  PaginationRowsPerPage,
} from "@booleanpress/ui/pagination"

const TOTAL = 1284

export default function PaginationFullBar() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const pageCount = Math.ceil(TOTAL / pageSize)

  return (
    <Pagination aria-label="Email log pages" className="flex-wrap items-center justify-between gap-x-6 gap-y-3">
      <PaginationRange page={page} pageSize={pageSize} total={TOTAL} />
      <PaginationPages page={page} pageCount={pageCount} onPageChange={setPage} />
      <div className="ms-auto flex flex-wrap items-center gap-4">
        <PaginationRowsPerPage
          value={pageSize}
          onValueChange={(size) => {
            setPageSize(size)
            setPage(1)
          }}
        />
        <PaginationJump page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>
    </Pagination>
  )
}
