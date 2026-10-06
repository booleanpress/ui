import { FileUpload, FileUploadList, FileUploadSubmit } from "@booleanpress/ui/file-upload"

const REPORT = new File([new Uint8Array(210_000)], "bounce-report-october.csv", { type: "text/csv" })

// The server refuses the whole batch after a moment: the rejection marks every file of it as failed.
function upload() {
  return new Promise<void>((_, reject) => {
    setTimeout(() => reject(new Error("Acme Archive answered with 503")), 800)
  })
}

export default function FileUploadUploadError() {
  return (
    <FileUpload defaultFiles={[REPORT]} onUpload={upload} className="w-full max-w-xl">
      <FileUploadList />
      <div className="flex justify-end">
        <FileUploadSubmit variant="default">Send to the archive</FileUploadSubmit>
      </div>
    </FileUpload>
  )
}
