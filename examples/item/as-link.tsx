import { ChevronRightIcon } from "lucide-react"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "@booleanpress/ui/item"

export default function ItemAsLink() {
  return (
    <Item asChild variant="outline" className="w-full max-w-md">
      <a href="#email-log">
        <ItemContent>
          <ItemTitle>Email log</ItemTitle>
          <ItemDescription>Every email your site sent this month.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRightIcon className="size-4 rtl:rotate-180" aria-hidden="true" />
        </ItemActions>
      </a>
    </Item>
  )
}
