import { useState } from "react"
import { OrderList } from "@booleanpress/ui/order-list"

const RULES = [
  { id: "password-resets", name: "Password resets → Postmark" },
  { id: "receipts", name: "Receipts → Amazon SES" },
  { id: "invoices", name: "Invoices → Amazon SES" },
  { id: "sign-in-codes", name: "Sign-in codes → Postmark" },
  { id: "newsletters", name: "Newsletters → Mailgun" },
  { id: "digests", name: "Weekly digests → Mailgun" },
  { id: "staff-alerts", name: "Staff alerts → SMTP relay" },
  { id: "fallback", name: "Everything else → SMTP relay" },
]

export default function OrderListBasic() {
  const [rules, setRules] = useState(RULES)

  return (
    <OrderList
      header="Routing rules, first match wins"
      value={rules}
      onValueChange={setRules}
      renderItem={(rule, { index }) => (
        <span className="flex min-w-0 items-center gap-3 text-sm">
          <span className="w-4 shrink-0 text-end text-muted-foreground tabular-nums in-data-selected:text-current">{index + 1}</span>
          <span className="truncate">{rule.name}</span>
        </span>
      )}
      className="w-full max-w-sm"
    />
  )
}
