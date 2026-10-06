import {
  FileUpload,
  FileUploadErrors,
  FileUploadSubmit,
  FileUploadTrigger,
  useFileUpload,
  type FileUploadHelpers,
} from "@booleanpress/ui/file-upload"

// Stands in for the app's request: every file finishes after a fixed delay.
function upload(files: File[], { onProgress }: FileUploadHelpers) {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      files.forEach((file) => onProgress(file, 100))
      resolve()
    }, 600)
  )
}

function ChosenFiles() {
  const { files } = useFileUpload()
  return <span>{files.length > 0 ? files.map((entry) => entry.file.name).join(", ") : "No file chosen"}</span>
}

export default function FileUploadBasic() {
  return (
    <FileUpload accept="image/*" multiple maxSize={1_000_000} onUpload={upload} className="w-full max-w-xl">
      <FileUploadErrors />
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <FileUploadTrigger />
          <ChosenFiles />
        </div>
        <FileUploadSubmit />
      </div>
    </FileUpload>
  )
}
