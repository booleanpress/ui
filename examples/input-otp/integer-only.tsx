import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPIntegerOnly() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-integer">Code from your authenticator app</Label>
      <InputOTP id="otp-integer" maxLength={6} validationType="numeric">
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
