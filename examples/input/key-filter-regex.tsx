import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function InputKeyFilterRegex() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex flex-col gap-2">
        <Label htmlFor="kf-no-space">Username, no spaces</Label>
        <Input id="kf-no-space" keyFilter={/\S/} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="kf-no-markup">Sender name, no &lt; &gt; * !</Label>
        <Input id="kf-no-markup" keyFilter={/[^<>*!]/} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="kf-phone">Phone, + only at the start</Label>
        <Input id="kf-phone" type="tel" keyFilter={/^\+?\d{0,15}$/} />
      </div>
    </div>
  )
}
