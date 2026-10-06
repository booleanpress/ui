import { useState } from "react"
import { FileIcon, FolderIcon } from "lucide-react"
import { moveTreeNode, type TreeNode } from "@booleanpress/ui/tree"
import { DraggableTree } from "@booleanpress/ui/tree-drag"

const file = (id: string, label: string): TreeNode => ({ id, label, icon: <FileIcon />, leaf: true })

const INITIAL: TreeNode[] = [
  {
    id: "templates",
    label: "templates",
    icon: <FolderIcon />,
    children: [file("welcome", "welcome.html"), file("receipt", "receipt.html")],
  },
  { id: "partials", label: "partials", icon: <FolderIcon />, children: [file("header", "header.html"), file("footer", "footer.html")] },
  file("styles", "styles.css"),
  file("readme", "README.md"),
]

export default function TreeDragAndDrop() {
  const [nodes, setNodes] = useState(INITIAL)

  return (
    <DraggableTree
      aria-label="Theme files"
      nodes={nodes}
      defaultExpanded={["templates", "partials"]}
      onNodeMove={(move) => setNodes((current) => moveTreeNode(current, move))}
      className="w-full md:w-120"
    />
  )
}
