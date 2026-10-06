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

const PARAGRAPHS = Array.from(
  { length: 24 },
  (_, i) => `${i + 1}. Imported contacts keep their subscription status. Contacts who unsubscribed stay unsubscribed, and no email is sent to them.`,
)

export default function DialogLongContent() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Review the import terms</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import terms</DialogTitle>
          <DialogDescription>Read them before you continue.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col gap-3 text-sm">
          {PARAGRAPHS.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Accept</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
