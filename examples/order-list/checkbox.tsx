import { OrderList } from "@booleanpress/ui/order-list"

const COLUMNS = [
  { id: "recipient", label: "Recipient" },
  { id: "subject", label: "Subject" },
  { id: "status", label: "Status" },
  { id: "mailer", label: "Mailer" },
  { id: "opened", label: "Opened" },
  { id: "clicked", label: "Clicked" },
  { id: "sent-at", label: "Sent at" },
]

export default function OrderListCheckbox() {
  return (
    <OrderList
      header="Delivery log columns"
      defaultValue={COLUMNS}
      defaultSelected={["status", "mailer"]}
      indicator="checkbox"
      draggable
      className="w-full max-w-xs"
    />
  )
}
