import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPAlphanumeric() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-alphanumeric">Recovery code</Label>
      <InputOTP
        id="otp-alphanumeric"
        maxLength={6}
        validationType="alphanumeric"
        normalizeValue={(value) => value.toUpperCase()}
      >
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
