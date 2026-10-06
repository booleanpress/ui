import { CheckboxGroup, CheckboxGroupItem, CheckboxGroupParent } from "@booleanpress/ui/checkbox-group"

export default function CheckboxGroupSelectAll() {
  return (
    <CheckboxGroup defaultValue={["orders"]} aria-label="Mailing lists">
      <CheckboxGroupParent />
      <div className="flex flex-col gap-3 ps-6.5">
        <CheckboxGroupItem value="orders" label="Order receipts" />
        <CheckboxGroupItem value="news" label="Product news" />
        <CheckboxGroupItem value="digest" label="Weekly digest" />
      </div>
    </CheckboxGroup>
  )
}
