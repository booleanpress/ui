import { Button } from "@booleanpress/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@booleanpress/ui/dialog"

const POSITIONS = [
  { position: "top", label: "Top" },
  { position: "start", label: "Start" },
  { position: "center", label: "Center" },
  { position: "end", label: "End" },
  { position: "bottom", label: "Bottom" },
] as const

export default function DialogPosition() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {POSITIONS.map(({ position, label }) => (
        <Dialog key={position}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="min-w-24">
              {label}
            </Button>
          </DialogTrigger>
          <DialogContent position={position} size="sm">
            <DialogHeader>
              <DialogTitle>Pause sending</DialogTitle>
              <DialogDescription>Queued emails wait until you resume. This dialog sits at the {position}.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Pause</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
