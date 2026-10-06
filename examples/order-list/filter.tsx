import { OrderList } from "@booleanpress/ui/order-list"

const SITES = [
  "shop.example.com",
  "blog.example.com",
  "docs.example.com",
  "status.example.com",
  "help.example.com",
  "careers.example.com",
  "events.example.com",
  "partners.example.com",
]

export default function OrderListFilter() {
  return (
    <OrderList
      header="Sites, in sending order"
      defaultValue={SITES}
      filter
      filterPlaceholder="Search sites"
      listClassName="max-h-56"
      className="w-full max-w-xs"
    />
  )
}
