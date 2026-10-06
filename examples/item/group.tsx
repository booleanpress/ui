import { Fragment } from "react"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@booleanpress/ui/item"

const RULES = [
  { name: "Order emails", detail: "Subject contains “Order”" },
  { name: "Support replies", detail: "Sender is support@example.com" },
  { name: "Everything else", detail: "No condition" },
]

export default function ItemGroupExample() {
  return (
    <ItemGroup className="w-full max-w-md rounded-md border">
      {RULES.map((rule, index) => (
        <Fragment key={rule.name}>
          {index > 0 && <ItemSeparator />}
          <Item>
            <ItemContent>
              <ItemTitle>{rule.name}</ItemTitle>
              <ItemDescription>{rule.detail}</ItemDescription>
            </ItemContent>
          </Item>
        </Fragment>
      ))}
    </ItemGroup>
  )
}
