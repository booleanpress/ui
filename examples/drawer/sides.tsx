import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
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

const SIDES = [
  { direction: "top", label: "Top", icon: ArrowDownIcon },
  { direction: "left", label: "Start", icon: ArrowRightIcon },
  { direction: "right", label: "End", icon: ArrowLeftIcon },
] as const

export default function DrawerSides() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {SIDES.map(({ direction, label, icon: Icon }) => (
        <Drawer key={direction} direction={direction}>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <Icon className="rtl:rotate-180" />
              {label}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notifications</DrawerTitle>
              <DrawerDescription>Three mailers need your attention.</DrawerDescription>
            </DrawerHeader>
            <ul className="flex flex-col gap-2 px-4.5 text-sm/normal">
              <li>Backup: the password was rejected.</li>
              <li>Marketing: 37 bounces since midnight.</li>
              <li>Receipts: the daily limit is 90 % used.</li>
            </ul>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}
