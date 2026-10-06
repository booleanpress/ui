import { useState } from "react"
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

export default function TreeSingleSelection() {
  const [selected, setSelected] = useState(["password-reset"])

  return (
    <div className="flex w-full flex-col gap-2 md:w-120">
      <Tree
        aria-label="Email templates"
        nodes={TEMPLATES}
        selectionMode="single"
        selected={selected}
        onSelectedChange={setSelected}
        defaultExpanded={["transactional"]}
      />
      <p className="text-sm text-muted-foreground">Editing: {selected[0] ?? "nothing"}</p>
    </div>
  )
}
