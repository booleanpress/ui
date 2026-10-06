import { CheckboxGroup, CheckboxGroupItem, CheckboxGroupParent } from "@booleanpress/ui/checkbox-group"
import { Separator } from "@booleanpress/ui/separator"

const SECTIONS = [
  { title: "Tickets", description: "Answer and route customer tickets", items: [["tickets.reply", "Reply to tickets"], ["tickets.assign", "Assign tickets"], ["tickets.delete", "Delete tickets"]] },
  { title: "Customers", description: "Manage customer records", items: [["customers.view", "View customers"], ["customers.merge", "Merge customers"]] },
  { title: "Billing", description: "See invoices and payment methods", items: [["billing.invoices", "View invoices"], ["billing.methods", "Change payment methods"]] },
]

export default function CheckboxGroupNested() {
  return (
    <CheckboxGroup orientation="vertical" defaultValue={["tickets.reply", "tickets.assign", "customers.view"]} aria-label="Agent permissions" className="w-full max-w-md">
      <CheckboxGroupParent label="All permissions" />
      {SECTIONS.map((section, index) => (
        <div key={section.title} className="flex flex-col gap-3 ps-6.5">
          {index > 0 ? <Separator /> : null}
          <CheckboxGroupParent label={section.title} description={section.description} values={section.items.map(([value]) => value)} />
          <div className="flex flex-col gap-3 ps-6.5">
            {section.items.map(([value, label]) => (
              <CheckboxGroupItem key={value} value={value} label={label} />
            ))}
          </div>
        </div>
      ))}
    </CheckboxGroup>
  )
}
