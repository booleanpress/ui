import { PickList } from "@booleanpress/ui/pick-list"

const COUNTRIES = [
  "Austria", "Bangladesh", "Belgium", "Canada", "Denmark", "Finland", "France", "Germany",
  "Ireland", "Italy", "Japan", "Netherlands", "Norway", "Portugal", "Spain", "Sweden",
]

export default function PickListFilter() {
  return (
    <PickList
      sourceHeader="Countries"
      targetHeader="Allowed to sign up"
      defaultSource={COUNTRIES}
      defaultTarget={[]}
      filter
      filterPlaceholder="Search countries"
      className="w-full max-w-2xl"
    />
  )
}
