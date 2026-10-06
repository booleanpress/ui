import { useEffect, useState } from "react"
import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Delivery = { id: string; recipient: string; mailer: string; opens: number }
type Query = { sorting: { id: string; desc: boolean }[]; pagination: { pageIndex: number; pageSize: number }; globalFilter: string }

// The "server": 240 deliveries it sorts, filters and pages, answering after a fixed 600 ms.
const ALL: Delivery[] = Array.from({ length: 240 }, (_, index) => ({
  id: `d-${2000 + index}`,
  recipient: `customer${index + 1}@example.com`,
  mailer: ["Amazon SES", "Postmark", "SMTP relay"][index % 3],
  opens: (index * 7) % 23,
}))

function fetchPage({ sorting, pagination, globalFilter }: Query) {
  const term = globalFilter.toLowerCase()
  const rows = ALL.filter((row) => !term || `${row.id} ${row.recipient} ${row.mailer}`.toLowerCase().includes(term))
  const [sort] = sorting
  if (sort) rows.sort((a, b) => String(a[sort.id as keyof Delivery]).localeCompare(String(b[sort.id as keyof Delivery]), "en", { numeric: true }) * (sort.desc ? -1 : 1))
  const start = pagination.pageIndex * pagination.pageSize
  return { rows: rows.slice(start, start + pagination.pageSize), total: rows.length }
}

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "id", header: "Delivery" },
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "mailer", header: "Mailer" },
  { accessorKey: "opens", header: "Opens", meta: { align: "end" } },
]

// The first page comes with the page, as a server-rendered page would bring it; every change after that asks the server.
const FIRST: Query = { sorting: [], pagination: { pageIndex: 0, pageSize: 10 }, globalFilter: "" }

export default function DataTableServerMode() {
  const [query, setQuery] = useState(FIRST)
  const [result, setResult] = useState(() => ({ query: FIRST, ...fetchPage(FIRST) }))

  useEffect(() => {
    if (query === FIRST) return
    // A newer query cancels the answer to an older one, so a slow answer never replaces a newer page.
    const timer = setTimeout(() => setResult({ query, ...fetchPage(query) }), 600)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <DataTable
      aria-label="Deliveries"
      sorting
      filtering="global"
      pagination
      manualSorting
      manualFiltering
      manualPagination
      loading={result.query !== query}
      columns={COLUMNS}
      data={result.rows}
      rowCount={result.total}
      getRowId={(row) => row.id}
      state={query}
      onSortingChange={(next) => setQuery((old) => ({ ...old, sorting: typeof next === "function" ? next(old.sorting) : next }))}
      onPaginationChange={(next) => setQuery((old) => ({ ...old, pagination: typeof next === "function" ? next(old.pagination) : next }))}
      onGlobalFilterChange={(next) =>
        setQuery((old) => ({ ...old, globalFilter: typeof next === "function" ? next(old.globalFilter) : next, pagination: { ...old.pagination, pageIndex: 0 } }))
      }
    />
  )
}
