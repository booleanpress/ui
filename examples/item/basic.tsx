import { Item, ItemContent, ItemDescription, ItemTitle } from "@booleanpress/ui/item"

export default function ItemBasic() {
  return (
    <Item variant="outline" className="w-full max-w-md">
      <ItemContent>
        <ItemTitle>Primary mailer</ItemTitle>
        <ItemDescription>Sends through smtp.example.com on port 587.</ItemDescription>
      </ItemContent>
    </Item>
  )
}
