import { PickList } from "@booleanpress/ui/pick-list"

const EVENTS = ["Delivered", "Opened", "Clicked", "Bounced", "Complained", "Unsubscribed", "Deferred", "Rejected"]

export default function PickListDragAndDrop() {
  return (
    <PickList
      sourceHeader="Webhook events"
      targetHeader="Sent to your endpoint"
      defaultSource={EVENTS.slice(2)}
      defaultTarget={EVENTS.slice(0, 2)}
      draggable
      className="w-full max-w-2xl"
    />
  )
}
