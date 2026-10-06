import { OrderList } from "@booleanpress/ui/order-list"

const QUEUES = ["Billing", "Technical support", "Sales", "Partnerships"]

export default function OrderListDisabled() {
  return (
    <OrderList
      header="Ticket queues (locked by your plan)"
      defaultValue={QUEUES}
      defaultSelected={["Sales"]}
      disabled
      className="w-full max-w-xs"
    />
  )
}
