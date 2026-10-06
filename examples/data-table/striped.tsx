import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Customer = { name: string; organisation: string; plan: string; seats: number }

const CUSTOMERS: Customer[] = [
  { name: "Ana Ruiz", organisation: "Northwind Books", plan: "Agency", seats: 25 },
  { name: "Li Wei", organisation: "Blue Harbour", plan: "Pro", seats: 5 },
  { name: "Sam Okoye", organisation: "Acme Tools", plan: "Pro", seats: 8 },
  { name: "Kim Park", organisation: "Lumen Studio", plan: "Starter", seats: 1 },
  { name: "Noor Haddad", organisation: "Cedar Clinic", plan: "Agency", seats: 40 },
  { name: "Tom Becker", organisation: "Fjord Travel", plan: "Starter", seats: 2 },
  { name: "Ines Costa", organisation: "Porto Labs", plan: "Pro", seats: 12 },
]

const COLUMNS: DataTableColumnDef<Customer>[] = [
  { accessorKey: "name", header: "Customer" },
  { accessorKey: "organisation", header: "Organisation" },
  { accessorKey: "plan", header: "Plan" },
  { accessorKey: "seats", header: "Seats", meta: { align: "end" } },
]

export default function DataTableStriped() {
  return <DataTable aria-label="Customers" striped columns={COLUMNS} data={CUSTOMERS} />
}
