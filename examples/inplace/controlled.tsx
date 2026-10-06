import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Inplace } from "@booleanpress/ui/inplace"

export default function InplaceControlled() {
  const [name, setName] = useState("Ana Ruiz")
  const [open, setOpen] = useState(false)

  return (
    <div className="flex w-full max-w-xs flex-col gap-2">
      <span className="ps-2.5 text-xs font-medium text-muted-foreground uppercase">Customer</span>
      <Inplace label="Customer name" value={name} onValueChange={setName} open={open} onOpenChange={setOpen} className="w-full" />
      <Button variant="outline" onClick={() => setOpen(!open)}>
        {open ? "Close the field" : "Edit name"}
      </Button>
    </div>
  )
}
