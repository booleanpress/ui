import { Button } from "@booleanpress/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@booleanpress/ui/drawer"

const RESULTS = [
  { label: "Delivered", value: "12,431" },
  { label: "Bounced", value: "37" },
  { label: "Complaints", value: "2" },
]

export default function DrawerBasic() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">View today’s deliveries</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Today’s deliveries</DrawerTitle>
            <DrawerDescription>Primary mailer, 4 October 2026. Drag the bar down to close.</DrawerDescription>
          </DrawerHeader>
          <dl className="grid grid-cols-3 gap-3 px-4.5">
            {RESULTS.map((result) => (
              <div key={result.label} className="rounded-lg border p-3 text-center">
                <dt className="text-xs/normal text-muted-foreground">{result.label}</dt>
                <dd className="text-xl font-semibold tabular-nums">{result.value}</dd>
              </div>
            ))}
          </dl>
          <DrawerFooter>
            <Button>Open the delivery log</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
