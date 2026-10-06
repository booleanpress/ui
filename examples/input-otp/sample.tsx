import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@booleanpress/ui/input-otp"

export default function InputOTPSample() {
  const [code, setCode] = useState("")

  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 id="verify-title" className="text-lg/normal font-semibold">
          Verify your email
        </h3>
        <p className="text-sm/normal text-muted-foreground">Enter the 6-digit code we sent to admin@example.com.</p>
      </div>
      <InputOTP
        maxLength={6}
        size="lg"
        validationType="numeric"
        value={code}
        onValueChange={setCode}
        aria-labelledby="verify-title"
        className="justify-between"
      >
        <InputOTPGroup className="w-full justify-between">
          {Array.from({ length: 6 }, (_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <div className="flex items-center justify-between gap-2 text-sm/normal">
        <span className="text-muted-foreground">Didn’t receive it?</span>
        <Button variant="link" className="h-auto p-0">
          Send again
        </Button>
      </div>
      <Button disabled={code.length < 6}>Verify</Button>
    </div>
  )
}
