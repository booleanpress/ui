import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationRange,
} from "@booleanpress/ui/pagination"

const TOTAL = 100
const PAGE_SIZE = 5
const PAGE_COUNT = Math.ceil(TOTAL / PAGE_SIZE)
const OFF = { "aria-disabled": true, tabIndex: -1, className: "pointer-events-none opacity-60" } as const

export default function PaginationRangeText() {
  const [page, setPage] = useState(1)
  const go = (next: number) => (event: React.MouseEvent) => {
    event.preventDefault()
    setPage(next)
  }

  return (
    <Pagination className="items-center gap-2">
      <PaginationRange page={page} pageSize={PAGE_SIZE} total={TOTAL} />
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={go(page - 1)} {...(page === 1 ? OFF : {})} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" onClick={go(page + 1)} {...(page === PAGE_COUNT ? OFF : {})} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
