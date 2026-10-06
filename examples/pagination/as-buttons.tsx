import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@booleanpress/ui/pagination"

const PAGES = [1, 2, 3, 4]

export default function PaginationAsButtons() {
  const [page, setPage] = useState(2)
  const go = (next: number) => (event: React.MouseEvent) => {
    event.preventDefault()
    setPage(Math.min(PAGES.length, Math.max(1, next)))
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">Showing log page {page} of {PAGES.length}</p>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" onClick={go(page - 1)} />
          </PaginationItem>
          {PAGES.map((n) => (
            <PaginationItem key={n}>
              <PaginationLink href="#" isActive={n === page} onClick={go(n)}>
                {n}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext href="#" onClick={go(page + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
