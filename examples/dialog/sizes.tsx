import { Button } from "@booleanpress/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@booleanpress/ui/dialog"

const SIZES = [
  { size: "sm", label: "Small", width: "384 px" },
  { size: "md", label: "Medium", width: "512 px" },
  { size: "lg", label: "Large", width: "672 px" },
] as const

export default function DialogSizes() {
  return (
    <div className="flex flex-wrap gap-3">
      {SIZES.map(({ size, label, width }) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{label}</Button>
          </DialogTrigger>
          <DialogContent size={size}>
            <DialogHeader>
              <DialogTitle>{label} dialog</DialogTitle>
              <DialogDescription>At most {width} wide, and never wider than the window.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  )
}
