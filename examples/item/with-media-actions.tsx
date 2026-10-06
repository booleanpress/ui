import { MailIcon } from "lucide-react"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@booleanpress/ui/item"

export default function ItemWithMediaActions() {
  return (
    <Item variant="outline" className="w-full max-w-md">
      <ItemMedia variant="icon">
        <MailIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          Backup mailer <Badge variant="info">Standby</Badge>
        </ItemTitle>
        <ItemDescription>Used when the primary mailer fails.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </ItemActions>
    </Item>
  )
}
