import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@booleanpress/ui/dropdown-menu"

export default function DropdownMenuRadioItems() {
  const [range, setRange] = useState("7d")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Date range</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuLabel inset>Show emails from</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={range} onValueChange={setRange}>
          <DropdownMenuRadioItem value="24h">The last 24 hours</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="7d">The last 7 days</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="30d">The last 30 days</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
