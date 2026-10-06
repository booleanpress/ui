import { FileTextIcon, FolderIcon } from "lucide-react"
import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const TEMPLATES: TreeNode[] = [
  {
    id: "transactional",
    label: "Transactional",
    icon: <FolderIcon />,
    children: [
      { id: "welcome", label: "Welcome", icon: <FileTextIcon /> },
      { id: "password-reset", label: "Password reset", icon: <FileTextIcon /> },
    ],
  },
  { id: "marketing", label: "Marketing", icon: <FolderIcon />, children: [{ id: "launch", label: "Product launch", icon: <FileTextIcon /> }] },
  { id: "receipts", label: "Receipts", icon: <FolderIcon />, children: [{ id: "order", label: "Order receipt", icon: <FileTextIcon /> }] },
]

export default function TreeMultipleSelection() {
  return (
    <Tree
      aria-label="Templates to export"
      nodes={TEMPLATES}
      selectionMode="multiple"
      defaultExpanded={["transactional"]}
      defaultSelected={["welcome", "password-reset"]}
      className="w-full md:w-120"
    />
  )
}
