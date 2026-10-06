import { PickList } from "@booleanpress/ui/pick-list"

const TAGS = ["VIP", "Refund requested", "Bug report", "Feature request"]

export default function PickListEmpty() {
  return (
    <PickList
      sourceHeader="Ticket tags"
      targetHeader="Tags that page the on-call agent"
      defaultSource={TAGS}
      defaultTarget={[]}
      targetEmpty="No tags page anyone yet"
      listClassName="h-40"
      className="w-full max-w-2xl"
    />
  )
}
