import { Button } from "@booleanpress/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@booleanpress/ui/sheet"

export default function SheetNoCloseButton() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Review the changes</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Review the changes</SheetTitle>
          <SheetDescription>The × is off here: the footer holds the only ways out, and Escape also closes it.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Apply</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline">Discard</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
