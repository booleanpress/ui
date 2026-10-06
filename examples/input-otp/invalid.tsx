import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPInvalid() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-invalid">Verification code</Label>
      <InputOTP id="otp-invalid" maxLength={6} defaultValue="482913" aria-invalid aria-describedby="otp-invalid-error">
        <InputOTPGroup>
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <p id="otp-invalid-error" className="text-xs/normal text-destructive-strong">
        This code has expired. Ask for a new one.
      </p>
    </div>
  )
}
