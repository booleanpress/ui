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

export default function DialogBasic() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit mailer</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit mailer</DialogTitle>
          <DialogDescription>Change the name and the sender address.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="mailer-name">Name</Label>
            <Input id="mailer-name" defaultValue="Primary mailer" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="mailer-from">Sender address</Label>
            <Input id="mailer-from" type="email" defaultValue="hello@example.com" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
