import { PickList } from "@booleanpress/ui/pick-list"

const AVAILABLE = [
  { id: "anna", name: "Anna Fali" },
  { id: "bernardo", name: "Bernardo Dominic" },
  { id: "elwin", name: "Elwin Sharvill" },
]

const ASSIGNED = [
  { id: "amy", name: "Amy Elsner" },
  { id: "asiya", name: "Asiya Javayant" },
]

export default function PickListDisabled() {
  return (
    <PickList
      disabled
      sourceHeader="Available agents"
      targetHeader="Assigned to Billing"
      defaultSource={AVAILABLE}
      defaultTarget={ASSIGNED}
      className="w-full max-w-2xl"
    />
  )
}
