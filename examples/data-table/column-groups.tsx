import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Mailer = { name: string; sentLast: number; sentThis: number; bouncedLast: number; bouncedThis: number }

const MAILERS: Mailer[] = [
  { name: "Transactional", sentLast: 16210, sentThis: 18402, bouncedLast: 0.8, bouncedThis: 0.6 },
  { name: "Marketing", sentLast: 11050, sentThis: 9610, bouncedLast: 2.1, bouncedThis: 2.9 },
  { name: "Password resets", sentLast: 1980, sentThis: 2150, bouncedLast: 0.2, bouncedThis: 0.1 },
  { name: "Receipts", sentLast: 6830, sentThis: 7044, bouncedLast: 0.4, bouncedThis: 0.5 },
]

const total = (key: "sentLast" | "sentThis") => MAILERS.reduce((sum, row) => sum + row[key], 0).toLocaleString("en-GB")
const count = (value: number) => value.toLocaleString("en-GB")
const rate = (value: number) => `${value.toFixed(1)}%`

const COLUMNS: DataTableColumnDef<Mailer>[] = [
  { accessorKey: "name", header: "Mailer", footer: "Totals" },
  {
    id: "sent",
    header: "Sent",
    columns: [
      { accessorKey: "sentLast", header: "September", cell: ({ getValue }) => count(getValue<number>()), footer: () => total("sentLast") },
      { accessorKey: "sentThis", header: "October", cell: ({ getValue }) => count(getValue<number>()), footer: () => total("sentThis") },
    ],
  },
  {
    id: "bounced",
    header: "Bounce rate",
    columns: [
      { accessorKey: "bouncedLast", header: "September", cell: ({ getValue }) => rate(getValue<number>()) },
      { accessorKey: "bouncedThis", header: "October", cell: ({ getValue }) => rate(getValue<number>()) },
    ],
  },
]

export default function DataTableColumnGroups() {
  return <DataTable aria-label="Mailers by month" gridlines columns={COLUMNS} data={MAILERS} />
}
