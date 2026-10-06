import { MailIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@booleanpress/ui/empty"

export default function EmptyBasic() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MailIcon />
        </EmptyMedia>
        <EmptyTitle>No emails yet</EmptyTitle>
        <EmptyDescription>Emails appear here as soon as your site sends one.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Send a test email</Button>
      </EmptyContent>
    </Empty>
  )
}
