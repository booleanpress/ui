import { Button } from "@booleanpress/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@booleanpress/ui/dialog"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

export default function DialogResponsive() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New organisation</Button>
      </DialogTrigger>
      {/* The window's width less 2rem on a phone, 512 px from 640 px, 720 px from 1024 px. */}
      <DialogContent className="sm:max-w-lg lg:max-w-180">
        <DialogHeader>
          <DialogTitle>New organisation</DialogTitle>
          <DialogDescription className="sr-only">Add an organisation and its billing contact.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2 sm:col-span-2">
            <Label htmlFor="org-name">Name</Label>
            <Input id="org-name" placeholder="Northwind Studio" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="org-contact">Billing contact</Label>
            <Input id="org-contact" placeholder="Full name" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="org-email">Billing address</Label>
            <Input id="org-email" type="email" placeholder="billing@example.com" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Create organisation</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
