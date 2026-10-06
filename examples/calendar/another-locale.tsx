import { useState } from "react"
import { BooleanUIProvider } from "@booleanpress/ui/provider"
import { Calendar } from "@booleanpress/ui/calendar"

export default function CalendarAnotherLocale() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 14))

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <BooleanUIProvider locale="de-DE" strings={{ monthNavigation: "Monatsnavigation", previousMonth: "Vorheriger Monat", nextMonth: "Nächster Monat" }}>
        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 9)} today={new Date(2026, 9, 3)} />
      </BooleanUIProvider>
      <BooleanUIProvider locale="ar-EG" dir="rtl" strings={{ monthNavigation: "التنقل بين الأشهر", previousMonth: "الشهر السابق", nextMonth: "الشهر التالي" }}>
        <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={new Date(2026, 9)} today={new Date(2026, 9, 3)} />
      </BooleanUIProvider>
    </div>
  )
}
