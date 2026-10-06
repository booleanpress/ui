import { FolderIcon, PlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"
import { Tree } from "@booleanpress/ui/tree"

export default function TreeEmpty() {
  return (
    <Tree
      aria-label="Mail folders"
      nodes={[]}
      className="w-full md:w-120"
      empty={
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderIcon />
            </EmptyMedia>
            <EmptyTitle>No folders yet</EmptyTitle>
            <EmptyDescription>Create a folder to start sorting incoming email.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">
              <PlusIcon />
              New folder
            </Button>
          </EmptyContent>
        </Empty>
      }
    />
  )
}
