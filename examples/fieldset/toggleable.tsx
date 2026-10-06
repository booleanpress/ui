import { Fieldset, FieldsetContent, FieldsetLegend } from "@booleanpress/ui/fieldset"
import { Separator } from "@booleanpress/ui/separator"

export default function FieldsetToggleable() {
  return (
    <Fieldset toggleable className="w-full max-w-xs">
      <FieldsetLegend>Invoice #1024</FieldsetLegend>
      <FieldsetContent>
        <div className="flex flex-col p-2">
          <div className="flex justify-between">
            <span>Growth plan</span>
            <span className="text-muted-foreground">$29.00</span>
          </div>
          <div className="mt-3 flex justify-between">
            <span>Dedicated IP</span>
            <span className="text-muted-foreground">$5.99</span>
          </div>
          <Separator className="my-3.5" />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>$34.99</span>
          </div>
        </div>
      </FieldsetContent>
    </Fieldset>
  )
}
