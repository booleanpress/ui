import { useState } from "react"
import { FileIcon, FolderIcon, MoreHorizontalIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@booleanpress/ui/dropdown-menu"
import { moveTreeNode, Tree, type TreeNode } from "@booleanpress/ui/tree"

const file = (id: string, label: string): TreeNode => ({ id, label, icon: <FileIcon />, leaf: true })

const INITIAL: TreeNode[] = [
  { id: "templates", label: "templates", icon: <FolderIcon />, children: [file("welcome", "welcome.html"), file("receipt", "receipt.html")] },
  { id: "partials", label: "partials", icon: <FolderIcon />, children: [file("header", "header.html"), file("footer", "footer.html")] },
  file("styles", "styles.css"),
  file("readme", "README.md"),
]

// The siblings of a node and the folder that holds it (`null` at the top).
function place(nodes: TreeNode[], id: string, parent: TreeNode | null = null): { siblings: TreeNode[]; parent: TreeNode | null } | undefined {
  if (nodes.some((node) => node.id === id)) return { siblings: nodes, parent }
  for (const node of nodes) {
    const found = node.children ? place(node.children, id, node) : undefined
    if (found) return found
  }
  return undefined
}

export default function TreeMoveWithoutDragging() {
  const [nodes, setNodes] = useState(INITIAL)
  const move = (id: string, targetId: string, position: "before" | "after" | "inside") =>
    setNodes((current) => moveTreeNode(current, { id, targetId, position }))

  return (
    <Tree
      aria-label="Theme files"
      nodes={nodes}
      // The keyboard moves the focused node with Alt and the arrows; the menu is the same moves for a pointer.
      onNodeMove={(next) => setNodes((current) => moveTreeNode(current, next))}
      defaultExpanded={["templates", "partials"]}
      className="w-full md:w-120"
      renderLabel={(node) => {
        const here = place(nodes, node.id)
        if (!here) return node.label
        const index = here.siblings.findIndex((sibling) => sibling.id === node.id)
        const previous = here.siblings[index - 1]
        const next = here.siblings[index + 1]
        const folders = nodes.filter((folder) => folder.children && folder.id !== node.id && folder.id !== here.parent?.id)
        return (
          <>
            <span className="min-w-0 flex-1 truncate">{node.label}</span>
            {/* The menu belongs to the row but not to its selection: its keys and clicks stay inside it. */}
            <span role="presentation" className="ms-auto" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Out of the tab order: the tree is one tab stop, and the keyboard has Alt and the arrows. */}
                  <Button variant="ghost" size="icon-xs" tabIndex={-1} aria-label={`Actions for ${node.label}`}>
                    <MoreHorizontalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem disabled={!previous} onSelect={() => previous && move(node.id, previous.id, "before")}>
                    Move up
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!next} onSelect={() => next && move(node.id, next.id, "after")}>
                    Move down
                  </DropdownMenuItem>
                  {folders.length > 0 ? <DropdownMenuSeparator /> : null}
                  {folders.map((folder) => (
                    <DropdownMenuItem key={folder.id} onSelect={() => move(node.id, folder.id, "inside")}>
                      Move into {folder.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </>
        )
      }}
    />
  )
}
