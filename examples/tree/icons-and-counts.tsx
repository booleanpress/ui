import { ArchiveIcon, FolderIcon, FolderOpenIcon, InboxIcon, MailIcon, SendIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Tree, type TreeNode } from "@booleanpress/ui/tree"

type Folder = { unread?: number }

const folder = (id: string, label: string, unread: number, children?: TreeNode<Folder>[]): TreeNode<Folder> => ({
  id,
  label,
  icon: children ? <FolderIcon /> : <MailIcon />,
  expandedIcon: children ? <FolderOpenIcon /> : undefined,
  children,
  data: { unread },
})

const FOLDERS: TreeNode<Folder>[] = [
  {
    id: "inbox",
    label: "Inbox",
    icon: <InboxIcon />,
    data: { unread: 12 },
    children: [folder("billing", "Billing", 4, [folder("invoices", "Invoices", 3), folder("refunds", "Refunds", 1)]), folder("support", "Support", 8)],
  },
  { id: "sent", label: "Sent", icon: <SendIcon />, children: [folder("receipts", "Receipts", 0), folder("newsletters", "Newsletters", 0)] },
  { id: "archive", label: "Archive", icon: <ArchiveIcon />, children: [folder("archive-2026", "2026", 0)] },
]

export default function TreeIconsAndCounts() {
  return (
    <Tree
      aria-label="Mail folders"
      nodes={FOLDERS}
      selectionMode="single"
      defaultExpanded={["inbox"]}
      defaultSelected={["support"]}
      className="w-full md:w-120"
      renderLabel={(node) => (
        <>
          <span className="flex-1">{node.label}</span>
          {node.data?.unread ? <Badge count={node.data.unread} severity="secondary" /> : null}
        </>
      )}
    />
  )
}
