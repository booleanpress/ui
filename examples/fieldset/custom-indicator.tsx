import { ChevronDownIcon } from "lucide-react"
import { Fieldset, FieldsetContent, FieldsetLegend } from "@booleanpress/ui/fieldset"

// The legend's button is the Tailwind group `fieldset-trigger`: the chevron turns when the content opens.
const indicator = (
  <ChevronDownIcon className="size-3.5 transition-transform duration-(--bui-duration-control) group-data-[state=open]/fieldset-trigger:rotate-180" />
)

export default function FieldsetCustomIndicator() {
  return (
    <Fieldset toggleable className="w-full max-w-xs">
      <FieldsetLegend indicator={indicator}>Tracking</FieldsetLegend>
      <FieldsetContent>
        <p className="p-2">
          Open and click tracking add a pixel and rewrite links. Both are off for transactional emails such as password
          resets and receipts.
        </p>
      </FieldsetContent>
    </Fieldset>
  )
}
