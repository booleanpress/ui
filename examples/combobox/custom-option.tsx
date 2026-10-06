import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"
import { Label } from "@booleanpress/ui/label"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@booleanpress/ui/combobox"

const CUSTOMERS = [
  { id: "c1", name: "Northwind Traders", email: "billing@northwind.example" },
  { id: "c2", name: "Fabrikam Studio", email: "ops@fabrikam.example" },
  { id: "c3", name: "Contoso Clinics", email: "it@contoso.example" },
  { id: "c4", name: "Tailspin Toys", email: "hello@tailspin.example" },
]

const initials = (name: string) => name.split(" ").map((word) => word[0]).join("")

export default function ComboboxCustomOption() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2">
      <Label htmlFor="combobox-customer">Customer</Label>
      <Combobox items={CUSTOMERS} itemToStringLabel={(customer: (typeof CUSTOMERS)[number]) => customer.name}>
        <ComboboxInput id="combobox-customer" placeholder="Search customers" />
        <ComboboxContent>
          <ComboboxEmpty />
          <ComboboxList>
            {(customer: (typeof CUSTOMERS)[number]) => (
              <ComboboxItem
                key={customer.id}
                value={customer}
                description={customer.email}
                icon={
                  <Avatar>
                    <AvatarFallback className="text-xs">{initials(customer.name)}</AvatarFallback>
                  </Avatar>
                }
              >
                <span className="font-medium">{customer.name}</span>
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
