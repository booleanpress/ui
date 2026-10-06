import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@booleanpress/ui/pagination"

export default function PaginationFirstAndLastPage() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious aria-disabled="true" tabIndex={-1} className="pointer-events-none opacity-60" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-1" isActive>
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#page-2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
