import { Inplace } from "@booleanpress/ui/inplace"

export default function InplaceDisabled() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <span className="ps-2.5 text-xs font-medium text-muted-foreground uppercase">Sending domain</span>
      <Inplace label="Sending domain" defaultValue="mail.example.com" disabled className="w-full" />
    </div>
  )
}
