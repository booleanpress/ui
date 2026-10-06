import { SearchIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"

export default function EmptyNoResults() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <SearchIcon className="size-8 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>No people match "grace"</EmptyTitle>
        <EmptyDescription>Check the spelling, or search by email address.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Clear the search</Button>
      </EmptyContent>
    </Empty>
  )
}
