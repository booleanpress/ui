import { FileUpload, FileUploadList, FileUploadSubmit, type FileUploadHelpers } from "@booleanpress/ui/file-upload"

const LOGS = [
  new File([new Uint8Array(48_200)], "delivery-log-october.csv", { type: "text/csv" }),
  new File([new Uint8Array(1_250_000)], "bounce-report-october.pdf", { type: "application/pdf" }),
]

// The app's own upload, faked with fixed timers: each file moves at its own pace and the batch ends when all are done.
function upload(files: File[], { onProgress, signal }: FileUploadHelpers) {
  return new Promise<void>((resolve) => {
    const progress = files.map(() => 0)
    const timer = setInterval(() => {
      files.forEach((file, index) => {
        progress[index] = Math.min(100, progress[index] + 10 + index * 15)
        onProgress(file, progress[index])
      })
      if (progress.every((percent) => percent === 100)) {
        clearInterval(timer)
        resolve()
      }
    }, 300)
    signal.addEventListener("abort", () => clearInterval(timer))
  })
}

export default function FileUploadCustomUpload() {
  return (
    <FileUpload multiple defaultFiles={LOGS} onUpload={upload} className="w-full max-w-xl">
      <FileUploadList />
      <div className="flex justify-end">
        <FileUploadSubmit variant="default">Send to the archive</FileUploadSubmit>
      </div>
    </FileUpload>
  )
}
