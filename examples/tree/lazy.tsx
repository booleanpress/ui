import { FileTextIcon, FolderIcon, FolderOpenIcon } from "lucide-react"
import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const folder = (id: string, label: string): TreeNode => ({ id, label, icon: <FolderIcon />, expandedIcon: <FolderOpenIcon /> })

const SITES: TreeNode[] = [folder("shop", "shop.example.com"), folder("blog", "blog.example.com"), folder("docs", "docs.example.com")]

// A fake request: the children of any folder arrive after 1.2 seconds.
function loadChildren(node: TreeNode): Promise<TreeNode[]> {
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          folder(`${node.id}-forms`, "Contact forms"),
          folder(`${node.id}-orders`, "Order emails"),
          { id: `${node.id}-log`, label: "error.log", icon: <FileTextIcon />, leaf: true },
        ]),
      1200
    )
  )
}

export default function TreeLazy() {
  return <Tree aria-label="Sites" nodes={SITES} loadChildren={loadChildren} className="w-full md:w-120" />
}
