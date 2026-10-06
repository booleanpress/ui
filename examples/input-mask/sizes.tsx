import { InputMask } from "@booleanpress/ui/input-mask"

export default function InputMaskSizes() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <InputMask size="sm" mask="99/99/9999" aria-label="Small" placeholder="Small" />
      <InputMask mask="99/99/9999" aria-label="Normal" placeholder="Normal" />
      <InputMask size="lg" mask="99/99/9999" aria-label="Large" placeholder="Large" />
    </div>
  )
}
