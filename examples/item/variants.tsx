import { Item, ItemContent, ItemDescription, ItemTitle } from "@booleanpress/ui/item"

export default function ItemVariants() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      {(["default", "outline", "muted"] as const).map((variant) => (
        <Item key={variant} variant={variant}>
          <ItemContent>
            <ItemTitle>The {variant} variant</ItemTitle>
            <ItemDescription>Delivery is checked every five minutes.</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  )
}
