import { BooleanUIProvider } from "@booleanpress/ui/provider"
import { DatePicker } from "@booleanpress/ui/date-picker"
import { Label } from "@booleanpress/ui/label"

export default function DatePickerAnotherLocale() {
  return (
    <div className="flex flex-col gap-4">
      <BooleanUIProvider locale="bn-BD">
        <div className="flex flex-col gap-2">
          <Label htmlFor="send-on-bn">পাঠানোর তারিখ</Label>
          <DatePicker id="send-on-bn" format="d MMMM yyyy" defaultValue={new Date(2026, 9, 5)} />
        </div>
      </BooleanUIProvider>
      <BooleanUIProvider locale="hi-IN">
        <div className="flex flex-col gap-2">
          <Label htmlFor="send-on-hi">भेजने की तारीख</Label>
          <DatePicker id="send-on-hi" format="d MMMM yyyy" defaultValue={new Date(2026, 9, 5)} />
        </div>
      </BooleanUIProvider>
    </div>
  )
}
