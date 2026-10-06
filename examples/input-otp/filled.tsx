import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPFilled() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-filled">Verification code</Label>
      <InputOTP id="otp-filled" maxLength={4} variant="filled">
        <InputOTPGroup>
          {Array.from({ length: 4 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
