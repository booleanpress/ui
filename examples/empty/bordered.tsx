import { PlugIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"

export default function EmptyBordered() {
  return (
    <Empty className="w-full max-w-md border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PlugIcon />
        </EmptyMedia>
        <EmptyTitle>No mailers connected</EmptyTitle>
        <EmptyDescription>Connect a mailer to send your site's email through it.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Add a mailer</Button>
        <Button variant="outline">Read the guide</Button>
      </EmptyContent>
    </Empty>
  )
}
