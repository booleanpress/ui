import { PlusIcon } from "lucide-react"
import { FileUpload, FileUploadErrors, FileUploadList, FileUploadTrigger, type FileUploadHelpers } from "@booleanpress/ui/file-upload"

// Stands in for the app's request: progress in fixed steps, every 250 ms.
function upload(files: File[], { onProgress, signal }: FileUploadHelpers) {
  return new Promise<void>((resolve) => {
    let percent = 0
    const timer = setInterval(() => {
      percent += 25
      files.forEach((file) => onProgress(file, percent))
      if (percent >= 100) {
        clearInterval(timer)
        resolve()
      }
    }, 250)
    signal.addEventListener("abort", () => clearInterval(timer))
  })
}

export default function FileUploadAuto() {
  return (
    <FileUpload accept="image/*" maxSize={1_000_000} auto onUpload={upload} className="w-full max-w-md items-center">
      <FileUploadTrigger>
        <PlusIcon />
        Browse
      </FileUploadTrigger>
      <FileUploadErrors className="w-full" />
      <FileUploadList className="w-full" />
    </FileUpload>
  )
}
