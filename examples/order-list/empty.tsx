import { OrderList } from "@booleanpress/ui/order-list"

export default function OrderListEmpty() {
  return (
    <OrderList
      header="Escalation steps"
      defaultValue={[]}
      empty="No escalation steps yet"
      listClassName="h-40"
      className="w-full max-w-xs"
    />
  )
}
