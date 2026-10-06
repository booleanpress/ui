import { OrderList } from "@booleanpress/ui/order-list"

const MAILERS = ["Amazon SES", "Postmark", "Mailgun", "SendGrid", "Brevo", "SMTP relay"]

export default function OrderListDragAndDrop() {
  return (
    <OrderList
      header="Mailer fallback order"
      defaultValue={MAILERS}
      draggable
      className="w-full max-w-xs"
    />
  )
}
