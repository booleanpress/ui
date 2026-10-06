import { useState } from "react"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@booleanpress/ui/context-menu"

export default function ContextMenuCheckboxRadio() {
  const [columns, setColumns] = useState({ status: true, recipient: true, opens: false })
  const [density, setDensity] = useState("comfortable")

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-40 w-full max-w-md items-center justify-center rounded-md border border-dashed px-4 text-center text-sm/normal text-muted-foreground outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid" tabIndex={0}>
        Right-click here, or focus and press Shift + F10
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuLabel>Columns</ContextMenuLabel>
        <ContextMenuCheckboxItem checked={columns.status} onCheckedChange={(status) => setColumns({ ...columns, status })}>
          Status
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={columns.recipient} onCheckedChange={(recipient) => setColumns({ ...columns, recipient })}>
          Recipient
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem checked={columns.opens} onCheckedChange={(opens) => setColumns({ ...columns, opens })}>
          Opens
        </ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuLabel>Density</ContextMenuLabel>
        <ContextMenuRadioGroup value={density} onValueChange={setDensity}>
          <ContextMenuRadioItem value="comfortable">Comfortable</ContextMenuRadioItem>
          <ContextMenuRadioItem value="compact">Compact</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  )
}
