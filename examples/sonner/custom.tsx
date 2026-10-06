import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-custom"

export default function SonnerCustom() {
  function show() {
    toast.custom(
      (id) => (
        <div className="flex w-(--width) flex-col gap-3 rounded-md border bg-popover p-3 text-popover-foreground shadow-md">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">Import finished</p>
            <p className="text-xs text-muted-foreground">700 people were added to the Newsletter list; 4 rows were skipped.</p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => toast.dismiss(id)}>
              Show the people
            </Button>
            <Button size="sm" variant="outline" onClick={() => toast.dismiss(id)}>
              Dismiss
            </Button>
          </div>
        </div>
      ),
      { toasterId, duration: 8000 }
    )
  }

  return (
    <>
      <Button variant="outline" onClick={show}>
        Finish the import
      </Button>
      <Toaster id={toasterId} />
    </>
  )
}
