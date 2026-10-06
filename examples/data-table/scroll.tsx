import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Customer = { id: string; name: string; organisation: string; plan: string; country: string; seats: number; mrr: number; renews: string }

const NAMES = ["Ana Ruiz", "Li Wei", "Sam Okoye", "Kim Park", "Noor Haddad", "Tom Becker", "Ines Costa", "Omar Aziz", "Eva Novak", "Raj Mehta"]
const ORGS = ["Northwind Books", "Blue Harbour", "Acme Tools", "Lumen Studio", "Cedar Clinic", "Fjord Travel", "Porto Labs", "Atlas Freight", "Vltava Press", "Saffron Foods"]
const COUNTRIES = ["Spain", "Singapore", "Nigeria", "South Korea", "Jordan", "Norway", "Portugal", "Egypt", "Czechia", "India"]

const CUSTOMERS: Customer[] = Array.from({ length: 20 }, (_, index) => ({
  id: `c-${300 + index}`,
  name: NAMES[index % 10],
  organisation: ORGS[(index * 3) % 10],
  plan: ["Starter", "Pro", "Agency"][index % 3],
  country: COUNTRIES[(index * 7) % 10],
  seats: 1 + ((index * 13) % 40),
  mrr: 19 + ((index * 37) % 400),
  renews: `2026-${String(1 + (index % 12)).padStart(2, "0")}-15`,
}))

const COLUMNS: DataTableColumnDef<Customer>[] = [
  { accessorKey: "name", header: "Customer", size: 160, meta: { cellClassName: "font-semibold" } },
  { accessorKey: "id", header: "Id", meta: { cellClassName: "min-w-24" } },
  { accessorKey: "organisation", header: "Organisation", meta: { cellClassName: "min-w-44" } },
  { accessorKey: "plan", header: "Plan", meta: { cellClassName: "min-w-28" } },
  { accessorKey: "country", header: "Country", meta: { cellClassName: "min-w-36" } },
  { accessorKey: "seats", header: "Seats", meta: { align: "end", cellClassName: "min-w-24" } },
  { accessorKey: "mrr", header: "MRR", meta: { align: "end", cellClassName: "min-w-28" }, cell: ({ getValue }) => `$${getValue<number>()}` },
  { accessorKey: "renews", header: "Renews", meta: { cellClassName: "min-w-32" } },
]

export default function DataTableScroll() {
  return (
    <div className="w-full max-w-2xl">
      <DataTable
        aria-label="Customers"
        stickyHeader
        maxHeight={360}
        columns={COLUMNS}
        data={CUSTOMERS}
        getRowId={(row) => row.id}
        initialState={{ columnPinning: { start: ["name"], end: [] } }}
      />
    </div>
  )
}
