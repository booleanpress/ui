import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"

const SIZES = [
  { size: "sm", label: "Small code" },
  { size: "default", label: "Default code" },
  { size: "lg", label: "Large code" },
] as const

export default function InputOTPSizes() {
  return (
    <div className="flex flex-col items-center gap-3">
      {SIZES.map(({ size, label }) => (
        <InputOTP key={size} maxLength={4} size={size} aria-label={label}>
          <InputOTPGroup>
            {Array.from({ length: 4 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      ))}
    </div>
  )
}
