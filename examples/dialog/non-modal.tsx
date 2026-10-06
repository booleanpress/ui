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

export default function DialogNonModal() {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <Button>Edit sender</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit sender</DialogTitle>
          <DialogDescription>The page behind stays usable while this is open.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sender-name">Sender name</Label>
            <Input id="sender-name" defaultValue="Support team" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sender-email">Sender address</Label>
            <Input id="sender-email" type="email" defaultValue="support@example.com" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
