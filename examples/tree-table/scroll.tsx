import { useUiLocale } from "@booleanpress/ui/provider"
import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import { getExpandableIds, type TreeNode } from "@booleanpress/ui/tree"

type Folder = { messages: number; size: string }

const folder = (id: string, label: string, messages: number, size: string, children?: TreeNode<Folder>[]): TreeNode<Folder> => ({
  id,
  label,
  data: { messages, size },
  children,
})

const MAILBOX: TreeNode<Folder>[] = [
  folder("inbox", "Inbox", 1240, "84 MB", [
    folder("billing", "Billing", 310, "22 MB", [folder("invoices", "Invoices", 250, "18 MB"), folder("refunds", "Refunds", 60, "4 MB")]),
    folder("support", "Support", 930, "62 MB", [folder("open", "Open", 120, "9 MB"), folder("closed", "Closed", 810, "53 MB")]),
  ]),
  folder("sent", "Sent", 2100, "130 MB", [folder("receipts", "Receipts", 1800, "96 MB"), folder("newsletters", "Newsletters", 300, "34 MB")]),
  folder("archive", "Archive", 5400, "410 MB", [folder("archive-2025", "2025", 3100, "240 MB"), folder("archive-2026", "2026", 2300, "170 MB")]),
  folder("spam", "Spam", 85, "3 MB"),
]

export default function TreeTableScroll() {
  const { locale } = useUiLocale()
  const number = new Intl.NumberFormat(locale)
  const columns: TreeTableColumn<Folder>[] = [
    { id: "name", header: "Folder" },
    { id: "messages", header: "Messages", cell: (node) => number.format(node.data?.messages ?? 0) },
    { id: "size", header: "Size" },
  ]

  return (
    <TreeTable
      aria-label="Mailbox"
      nodes={MAILBOX}
      columns={columns}
      scrollHeight="16rem"
      expandAllButton
      defaultExpanded={getExpandableIds(MAILBOX)}
      className="max-w-3xl"
    />
  )
}
