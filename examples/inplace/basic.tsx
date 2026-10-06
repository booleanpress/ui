import { Inplace } from "@booleanpress/ui/inplace"

export default function InplaceBasic() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <span className="ps-2.5 text-xs font-medium text-muted-foreground uppercase">Mailer name</span>
      <Inplace label="Mailer name" defaultValue="Primary SMTP" placeholder="Name this mailer" className="w-full" />
    </div>
  )
}
