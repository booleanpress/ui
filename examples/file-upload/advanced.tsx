import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadErrors,
  FileUploadList,
  FileUploadProgress,
  FileUploadSubmit,
  FileUploadTrigger,
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

export default function FileUploadAdvanced() {
  return (
    <FileUpload accept="image/*" multiple maxSize={1_000_000} onUpload={upload} className="w-full max-w-xl">
      <FileUploadDropzone className="rounded-md border-solid p-0 data-[dragging]:border-dashed">
        <div className="flex flex-wrap items-center gap-2 p-5">
          <FileUploadTrigger />
          <FileUploadSubmit />
          <FileUploadClear />
        </div>
        <div className="flex flex-col gap-3.5 px-4 pb-4">
          <FileUploadErrors />
          <FileUploadProgress />
          <FileUploadList empty={<p>Drag and drop files here to upload.</p>} />
        </div>
      </FileUploadDropzone>
    </FileUpload>
  )
}
