import { ImageIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@booleanpress/ui/dialog"

const TEMPLATES = Array.from({ length: 18 }, (_, i) => `Template ${i + 1}`)

export default function DialogFullScreen() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Browse templates</Button>
      </DialogTrigger>
      <DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Email templates</DialogTitle>
          <DialogDescription className="sr-only">Pick a starting point for a new email.</DialogDescription>
        </DialogHeader>
        <DialogBody className="grid grid-cols-2 content-start gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {TEMPLATES.map((name) => (
            <div key={name} className="flex aspect-square items-center justify-center rounded-lg bg-muted" aria-label={name} role="img">
              <ImageIcon className="size-4 text-control-hover" aria-hidden="true" />
            </div>
          ))}
        </DialogBody>
        <p className="text-sm text-muted-foreground">Showing 18 of 64 templates</p>
      </DialogContent>
    </Dialog>
  )
}
