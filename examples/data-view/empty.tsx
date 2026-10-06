import { MailPlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { DataView } from "@booleanpress/ui/data-view"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"

export default function DataViewEmpty() {
  return (
    <DataView
      aria-label="Mailers"
      items={[]}
      layoutToggle
      className="w-full"
      renderItem={() => null}
      empty={
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MailPlusIcon />
            </EmptyMedia>
            <EmptyTitle>No mailers yet</EmptyTitle>
            <EmptyDescription>Add a mailer to start sending email from your site.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>Add a mailer</Button>
          </EmptyContent>
        </Empty>
      }
    />
  )
}
