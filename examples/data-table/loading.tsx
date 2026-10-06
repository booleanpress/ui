import { useEffect, useState } from "react"
import { RefreshCwIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { DataTable, type DataTableColumnDef } from "@booleanpress/ui/data-table"

type Delivery = { id: string; recipient: string; subject: string; mailer: string }

const DELIVERIES: Delivery[] = [
  { id: "d-1042", recipient: "ana@example.com", subject: "Your October invoice", mailer: "Amazon SES" },
  { id: "d-1041", recipient: "li.wei@example.com", subject: "Password reset", mailer: "Postmark" },
  { id: "d-1040", recipient: "sam@example.com", subject: "Welcome aboard", mailer: "Amazon SES" },
  { id: "d-1039", recipient: "kim@example.com", subject: "Weekly digest", mailer: "SMTP relay" },
]

const NONE: Delivery[] = []

const COLUMNS: DataTableColumnDef<Delivery>[] = [
  { accessorKey: "recipient", header: "Recipient" },
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "mailer", header: "Mailer" },
]

export default function DataTableLoading() {
  const [request, setRequest] = useState(0)
  const [answered, setAnswered] = useState(0)
  const refreshing = answered !== request

  // A fake refresh that answers after 1.5 s: a spinner covers the rows meanwhile.
  useEffect(() => {
    if (!refreshing) return
    const timer = setTimeout(() => setAnswered(request), 1500)
    return () => clearTimeout(timer)
  }, [refreshing, request])

  return (
    <div className="flex w-full flex-col gap-6">
      <DataTable
        aria-label="Deliveries"
        loading={refreshing}
        toolbar={
          <Button variant="outline" size="sm" onClick={() => setRequest((count) => count + 1)} disabled={refreshing} className="ms-auto">
            <RefreshCwIcon />
            Refresh
          </Button>
        }
        columns={COLUMNS}
        data={DELIVERIES}
        getRowId={(row) => row.id}
      />
      {/* Before the first rows arrive: skeleton rows. */}
      <DataTable aria-label="Deliveries, first load" loading columns={COLUMNS} data={NONE} />
    </div>
  )
}
