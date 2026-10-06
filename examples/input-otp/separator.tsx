import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPWithSeparator() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-separator">Recovery code</Label>
      <InputOTP id="otp-separator" maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
