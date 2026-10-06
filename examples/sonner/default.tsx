import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

export default function SonnerDefault() {
  return (
    <>
      <Button variant="outline" onClick={() => toast("Settings saved", { toasterId: "sonner-default" })}>
        Save settings
      </Button>
      <Toaster id="sonner-default" />
    </>
  )
}
