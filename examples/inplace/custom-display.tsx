import { Badge } from "@booleanpress/ui/badge"
import { Inplace } from "@booleanpress/ui/inplace"
import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"

const STATUSES = { active: "Active", paused: "Paused", archived: "Archived" } as const
type Status = keyof typeof STATUSES

const VARIANTS = { active: "success", paused: "warning", archived: "secondary" } as const

export default function InplaceCustomDisplay() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-1">
      <span className="ps-2.5 text-xs font-medium text-muted-foreground uppercase">Status</span>
      <Inplace
        label="Mailer status"
        defaultValue="active"
        showButtons={false}
        renderDisplay={(value) => <Badge variant={VARIANTS[value as Status]}>{STATUSES[value as Status]}</Badge>}
        renderEditor={({ value, onValueChange, fieldProps }) => (
          <NativeSelect {...fieldProps} value={value} onChange={(event) => onValueChange(event.target.value)}>
            {Object.entries(STATUSES).map(([key, text]) => (
              <NativeSelectOption key={key} value={key}>
                {text}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        )}
      />
    </div>
  )
}
