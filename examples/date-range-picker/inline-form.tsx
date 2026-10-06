import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { DateRangePicker } from "@booleanpress/ui/date-range-picker"

export default function DateRangePickerInlineForm() {
  const [submitted, setSubmitted] = useState("")
  return (
    <form className="flex flex-col items-start gap-3" onSubmit={(event) => {
      event.preventDefault()
      setSubmitted(String(new FormData(event.currentTarget).get("period") ?? ""))
    }}>
      <DateRangePicker inline showActions clearable name="period" aria-label="Export period" numberOfMonths={1}
        defaultValue={{ from: new Date(2026, 9, 5), to: new Date(2026, 9, 9) }} today={new Date(2026, 9, 14)} />
      <div className="flex gap-2"><Button type="submit">Export</Button><Button type="reset" variant="secondary">Reset</Button></div>
      <p role="status" className="text-sm text-muted-foreground">{submitted ? `Submitted: ${submitted}` : "Choose a range and apply it before exporting."}</p>
    </form>
  )
}
