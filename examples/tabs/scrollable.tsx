import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function TabsScrollable() {
  return (
    <Tabs defaultValue="January" className="w-full max-w-md">
      <TabsList scrollable aria-label="Delivery reports by month">
        {MONTHS.map((month) => (
          <TabsTrigger key={month} value={month}>
            {month}
          </TabsTrigger>
        ))}
      </TabsList>
      {MONTHS.map((month) => (
        <TabsContent key={month} value={month} className="text-sm">
          Delivery report for {month} 2026.
        </TabsContent>
      ))}
    </Tabs>
  )
}
