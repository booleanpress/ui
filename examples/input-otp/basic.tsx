import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPBasic() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Label htmlFor="otp-basic">Verification code</Label>
      <InputOTP id="otp-basic" maxLength={4}>
        <InputOTPGroup>
          {Array.from({ length: 4 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
