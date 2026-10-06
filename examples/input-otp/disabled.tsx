import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPDisabled() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-disabled">Verification code</Label>
      <InputOTP id="otp-disabled" maxLength={4} disabled>
        <InputOTPGroup>
          {Array.from({ length: 4 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
