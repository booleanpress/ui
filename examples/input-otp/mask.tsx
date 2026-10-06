import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPMask() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-mask">Account PIN</Label>
      <InputOTP id="otp-mask" maxLength={4} mask validationType="numeric">
        <InputOTPGroup>
          {Array.from({ length: 4 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
