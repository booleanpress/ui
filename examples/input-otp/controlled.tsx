import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"
import { Label } from "@booleanpress/ui/label"

export default function InputOTPControlled() {
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center gap-2">
        <Label htmlFor="otp-controlled">Two-step code</Label>
        <InputOTP id="otp-controlled" maxLength={4} value={value} onValueChange={setValue}>
          <InputOTPGroup>
            {Array.from({ length: 4 }, (_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="flex items-center gap-3 text-sm/normal text-muted-foreground">
        <span>
          Value: <output className="font-medium text-foreground">{value || "empty"}</output>
        </span>
        <Button size="sm" variant="secondary" onClick={() => setValue("")}>
          Reset
        </Button>
      </div>
    </div>
  )
}
