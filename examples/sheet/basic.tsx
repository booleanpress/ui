import { Button } from "@booleanpress/ui/button"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@booleanpress/ui/sheet"

export default function SheetBasic() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Edit connection</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit connection</SheetTitle>
          <SheetDescription>Change how this mailer signs in to the mail server.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 px-4.5">
          <Label htmlFor="sheet-host">Server</Label>
          <Input id="sheet-host" defaultValue="smtp.example.com" />
          <Label htmlFor="sheet-port" className="mt-2">
            Port
          </Label>
          <Input id="sheet-port" defaultValue="587" inputMode="numeric" />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Save</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
