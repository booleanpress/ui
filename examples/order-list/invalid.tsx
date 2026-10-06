import { useState } from "react"
import { OrderList } from "@booleanpress/ui/order-list"

const QUEUES = ["Billing", "Technical support", "Sales", "Partnerships"]

export default function OrderListInvalid() {
  const [moved, setMoved] = useState(false)

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <OrderList
        header="Ticket queues, first to last"
        defaultValue={QUEUES}
        onValueChange={() => setMoved(true)}
        aria-invalid={!moved}
        aria-describedby="order-list-invalid-error"
        className="w-full"
      />
      <p id="order-list-invalid-error" className="min-h-4 text-xs text-destructive-strong">
        {moved ? "" : "Put Billing last before you save the routing."}
      </p>
    </div>
  )
}
