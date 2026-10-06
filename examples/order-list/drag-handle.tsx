import { OrderList } from "@booleanpress/ui/order-list"

const STEPS = [
  { id: "verify", label: "Verify the sender domain" },
  { id: "warm-up", label: "Warm up the dedicated IP" },
  { id: "import", label: "Import the contact list" },
  { id: "segment", label: "Build the first segment" },
  { id: "send", label: "Send the welcome series" },
]

export default function OrderListDragHandle() {
  return (
    <OrderList
      header="Onboarding checklist"
      defaultValue={STEPS}
      draggable
      dragHandle
      className="w-full max-w-sm"
    />
  )
}
