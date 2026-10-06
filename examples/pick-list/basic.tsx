import { useState } from "react"
import { PickList } from "@booleanpress/ui/pick-list"

const AGENTS = [
  { id: "amy", name: "Amy Elsner" },
  { id: "asiya", name: "Asiya Javayant" },
  { id: "onyama", name: "Onyama Limba" },
  { id: "anna", name: "Anna Fali" },
  { id: "bernardo", name: "Bernardo Dominic" },
  { id: "elwin", name: "Elwin Sharvill" },
  { id: "ioni", name: "Ioni Bowcher" },
  { id: "stephen", name: "Stephen Shaw" },
]

export default function PickListBasic() {
  const [available, setAvailable] = useState(AGENTS)
  const [assigned, setAssigned] = useState<typeof AGENTS>([])

  return (
    <PickList
      sourceHeader="Available agents"
      targetHeader="Assigned to Billing"
      source={available}
      onSourceChange={setAvailable}
      target={assigned}
      onTargetChange={setAssigned}
      className="w-full max-w-2xl"
    />
  )
}
