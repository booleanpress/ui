import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadErrors,
  FileUploadList,
  FileUploadSubmit,
  type FileUploadHelpers,
} from "@booleanpress/ui/file-upload"

// Stands in for the app's request: progress in fixed steps, every 200 ms.
function upload(files: File[], { onProgress, signal }: FileUploadHelpers) {
  return new Promise<void>((resolve) => {
    let percent = 0
    const timer = setInterval(() => {
      percent += 20
      files.forEach((file) => onProgress(file, percent))
      if (percent >= 100) {
        clearInterval(timer)
        resolve()
      }
    }, 200)
    signal.addEventListener("abort", () => clearInterval(timer))
  })
}

export default function FileUploadDropzoneExample() {
  return (
    <FileUpload accept="image/*,application/pdf" multiple maxSize={5_000_000} onUpload={upload} className="w-full max-w-xl">
      <FileUploadDropzone />
      <FileUploadErrors />
      <FileUploadList />
      <div className="flex justify-end gap-2">
        <FileUploadClear variant="ghost" />
        <FileUploadSubmit variant="default" />
      </div>
    </FileUpload>
  )
}
