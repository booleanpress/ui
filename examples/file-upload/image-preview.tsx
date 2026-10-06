import { PlusIcon, UploadIcon } from "lucide-react"
import { FileUpload, FileUploadList, FileUploadSubmit, FileUploadTrigger, type FileUploadHelpers } from "@booleanpress/ui/file-upload"

// Pictures drawn here, as SVG, so the example needs no network.
function picture(name: string, from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200"><defs><linearGradient id="g" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="320" height="200" fill="url(#g)"/><circle cx="244" cy="58" r="26" fill="#fff" fill-opacity=".75"/><path d="M0 200 110 92l80 66 52-40 78 72v10z" fill="#fff" fill-opacity=".4"/></svg>`
  return new File([svg], name, { type: "image/svg+xml" })
}

const PICTURES = [
  picture("newsletter-header.svg", "#0ea5e9", "#6366f1"),
  picture("welcome-banner.svg", "#f59e0b", "#ef4444"),
  picture("team-offsite.svg", "#10b981", "#0f766e"),
]

// Stands in for the app's request: every file finishes after a fixed delay.
function upload(files: File[], { onProgress }: FileUploadHelpers) {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      files.forEach((file) => onProgress(file, 100))
      resolve()
    }, 700)
  )
}

export default function FileUploadImagePreview() {
  return (
    <FileUpload accept="image/*" multiple defaultFiles={PICTURES} onUpload={upload} className="w-full max-w-xl">
      <div className="flex flex-wrap gap-2">
        <FileUploadTrigger variant="outline">
          <PlusIcon />
          Add images
        </FileUploadTrigger>
        <FileUploadSubmit variant="default">
          <UploadIcon />
          Upload all
        </FileUploadSubmit>
      </div>
      <FileUploadList
        layout="grid"
        empty={
          <p className="rounded-lg border border-dashed border-border p-10 text-center text-muted-foreground">
            No images chosen. Add images to see them here.
          </p>
        }
      />
    </FileUpload>
  )
}
