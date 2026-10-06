import { InputMask } from "@booleanpress/ui/input-mask"

export default function InputMaskDisabled() {
  return (
    <div className="w-full max-w-xs">
      <InputMask disabled mask="(999) 999-9999" aria-label="Support phone" defaultValue="5551234567" />
    </div>
  )
}
