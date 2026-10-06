import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@booleanpress/ui/dropdown-menu"

export default function DropdownMenuCheckboxItems() {
  const [columns, setColumns] = useState({ status: true, recipient: true, mailer: false })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel inset>Show columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={columns.status}
          onCheckedChange={(checked) => setColumns((c) => ({ ...c, status: checked === true }))}
        >
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.recipient}
          onCheckedChange={(checked) => setColumns((c) => ({ ...c, recipient: checked === true }))}
        >
          Recipient
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.mailer}
          onCheckedChange={(checked) => setColumns((c) => ({ ...c, mailer: checked === true }))}
        >
          Mailer
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
