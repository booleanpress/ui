import * as React from "react"
import { CheckCheckIcon, DownloadIcon, LifeBuoyIcon, PlusIcon, Trash2Icon, UserRoundCheckIcon } from "lucide-react"
import { ActionBar, ActionBarButton } from "@booleanpress/ui/action-bar"
import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { Badge } from "@booleanpress/ui/badge"
import { DataTable, type DataTableColumnDef, type DataTableState } from "@booleanpress/ui/data-table"
import {
  PageHeader,
  PageHeaderAction,
  PageHeaderActions,
  PageHeaderDescription,
  PageHeaderHeading,
  PageHeaderMeta,
  PageHeaderTitle,
} from "@booleanpress/ui/page-header"
import { useUiLocale } from "@booleanpress/ui/provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

type Status = "Open" | "Pending" | "Solved"
type Priority = "Urgent" | "High" | "Normal" | "Low"
type Ticket = { id: string; subject: string; requester: string; status: Status; priority: Priority; assignee: string | null; updated: string }

const TICKETS: Ticket[] = [
  { id: "2081", subject: "Cannot connect to Amazon SES", requester: "Ana Ruiz", status: "Open", priority: "Urgent", assignee: null, updated: "2026-10-05T09:40:00Z" },
  { id: "2080", subject: "Invoice is missing our VAT number", requester: "Li Wei", status: "Pending", priority: "Normal", assignee: "Priya Shah", updated: "2026-10-05T08:15:00Z" },
  { id: "2079", subject: "Import stops at row 200", requester: "Sam Okoye", status: "Open", priority: "High", assignee: "Tom Becker", updated: "2026-10-04T16:20:00Z" },
  { id: "2078", subject: "Change the sender name on receipts", requester: "Kim Park", status: "Solved", priority: "Low", assignee: "Priya Shah", updated: "2026-10-04T11:05:00Z" },
  { id: "2077", subject: "Webhook is called twice", requester: "Noor Haddad", status: "Pending", priority: "High", assignee: "Lena Ortiz", updated: "2026-10-03T15:30:00Z" },
  { id: "2076", subject: "Export to CSV is empty", requester: "Tom Hale", status: "Open", priority: "Normal", assignee: null, updated: "2026-10-03T10:10:00Z" },
  { id: "2075", subject: "Add a second administrator", requester: "Ines Costa", status: "Solved", priority: "Low", assignee: "Tom Becker", updated: "2026-10-02T14:45:00Z" },
  { id: "2074", subject: "Bounce emails go to an old address", requester: "Omar Farouk", status: "Open", priority: "High", assignee: "Lena Ortiz", updated: "2026-10-02T09:00:00Z" },
  { id: "2073", subject: "Refund for a duplicate order", requester: "Mia Jensen", status: "Pending", priority: "Urgent", assignee: "Priya Shah", updated: "2026-10-01T17:25:00Z" },
  { id: "2072", subject: "Password reset link has expired", requester: "Raj Patel", status: "Solved", priority: "Normal", assignee: "Tom Becker", updated: "2026-10-01T12:00:00Z" },
  { id: "2071", subject: "Logo is blurry in the email header", requester: "Eva Novak", status: "Open", priority: "Low", assignee: null, updated: "2026-09-30T13:35:00Z" },
  { id: "2070", subject: "API returns 429 at night", requester: "Leo Martin", status: "Pending", priority: "High", assignee: "Lena Ortiz", updated: "2026-09-30T08:50:00Z" },
]

const STATUS_TONE = { Open: "info", Pending: "warning", Solved: "success" } as const
const PRIORITY_TONE = { Urgent: "destructive", High: "warning", Normal: "secondary", Low: "outline" } as const
const initials = (name: string) => name.split(" ").map((part) => part[0]).join("")

export default function TablePageBlock() {
  const { locale, timeZone } = useUiLocale()
  const [tickets, setTickets] = React.useState(TICKETS)
  const [status, setStatus] = React.useState("all")
  const [priority, setPriority] = React.useState("all")
  const [selection, setSelection] = React.useState<DataTableState["rowSelection"]>({})
  const selected = Object.keys(selection).filter((id) => selection[id]).length

  // The selects filter the rows before the table; the table's own search then looks through what is left.
  const rows = React.useMemo(
    () => tickets.filter((t) => (status === "all" || t.status === status) && (priority === "all" || t.priority === priority)),
    [tickets, status, priority]
  )

  const columns = React.useMemo<DataTableColumnDef<Ticket>[]>(() => {
    const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", timeZone })
    return [
      { accessorKey: "id", header: "Ticket", cell: ({ row }) => <span className="text-muted-foreground tabular-nums">#{row.original.id}</span> },
      {
        id: "subject",
        accessorFn: (t) => `${t.subject} ${t.requester}`,
        header: "Subject",
        meta: { label: "Subject" },
        cell: ({ row }) => (
          <div className="flex min-w-48 flex-col">
            <span className="font-medium">{row.original.subject}</span>
            <span className="text-xs text-muted-foreground">{row.original.requester}</span>
          </div>
        ),
      },
      { accessorKey: "status", header: "Status", cell: ({ row }) => <Badge variant={STATUS_TONE[row.original.status]}>{row.original.status}</Badge> },
      { accessorKey: "priority", header: "Priority", cell: ({ row }) => <Badge variant={PRIORITY_TONE[row.original.priority]}>{row.original.priority}</Badge> },
      {
        accessorKey: "assignee",
        header: "Assignee",
        cell: ({ row }) =>
          row.original.assignee ? (
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Avatar className="size-6 text-xs">
                <AvatarFallback>{initials(row.original.assignee)}</AvatarFallback>
              </Avatar>
              {row.original.assignee}
            </span>
          ) : (
            <span className="text-muted-foreground">Unassigned</span>
          ),
      },
      {
        accessorKey: "updated",
        header: "Updated",
        meta: { align: "end" },
        cell: ({ row }) => <time dateTime={row.original.updated}>{date.format(new Date(row.original.updated))}</time>,
      },
    ]
  }, [locale, timeZone])

  // An action changes the selected tickets, then clears the selection, which closes the bar.
  const update = (change: (ticket: Ticket) => Ticket | null) => {
    setTickets((all) => all.flatMap((t) => (selection[t.id] ? (change(t) ?? []) : [t])))
    setSelection({})
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 font-semibold sm:px-6">
          <LifeBuoyIcon className="size-4" aria-hidden="true" />
          Acme
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <PageHeader className="mb-6">
          <PageHeaderHeading>
            <PageHeaderTitle>Tickets</PageHeaderTitle>
            <PageHeaderMeta>
              <Badge variant="info">{tickets.filter((t) => t.status === "Open").length} open</Badge>
            </PageHeaderMeta>
          </PageHeaderHeading>
          <PageHeaderDescription>Every conversation with your customers, the latest first.</PageHeaderDescription>
          <PageHeaderActions>
            <PageHeaderAction icon={<DownloadIcon />}>Export</PageHeaderAction>
            <PageHeaderAction icon={<PlusIcon />} pinned>
              New ticket
            </PageHeaderAction>
          </PageHeaderActions>
        </PageHeader>

        <div className="relative pb-16">
          <DataTable
            aria-label="Tickets"
            columns={columns}
            data={rows}
            getRowId={(t) => t.id}
            filtering="global"
            sorting
            selection="multiple"
            pagination={{ pageSizes: [8, 20, 50], range: true }}
            initialState={{ pagination: { pageIndex: 0, pageSize: 8 } }}
            state={{ rowSelection: selection }}
            onRowSelectionChange={setSelection}
            empty="No tickets match these filters."
            toolbar={
              <>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger aria-label="Status" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Every status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Solved">Solved</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger aria-label="Priority" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Every priority</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </>
            }
          />
          <ActionBar count={selected} onClear={() => setSelection({})} aria-label="Selected tickets">
            <ActionBarButton onClick={() => update((t) => ({ ...t, assignee: "Priya Shah" }))}>
              <UserRoundCheckIcon aria-hidden="true" />
              Assign to me
            </ActionBarButton>
            <ActionBarButton onClick={() => update((t) => ({ ...t, status: "Solved" }))}>
              <CheckCheckIcon aria-hidden="true" />
              Mark as solved
            </ActionBarButton>
            <ActionBarButton severity="danger" onClick={() => update(() => null)}>
              <Trash2Icon aria-hidden="true" />
              Delete
            </ActionBarButton>
          </ActionBar>
        </div>
      </main>
    </div>
  )
}
