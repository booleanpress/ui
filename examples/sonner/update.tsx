import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-update"

export default function SonnerUpdate() {
  function upload() {
    const id = toast.loading("Uploading the logo…", { toasterId })
    window.setTimeout(() => {
      toast.success("Logo uploaded", { id, toasterId, description: "It shows in every email from now on." })
    }, 2000)
  }

  return (
    <>
      <Button variant="outline" onClick={upload}>
        Upload a logo
      </Button>
      <Toaster id={toasterId} />
    </>
  )
}
