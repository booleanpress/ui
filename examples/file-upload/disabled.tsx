import { FileUpload, FileUploadDropzone, FileUploadList } from "@booleanpress/ui/file-upload"

const ATTACHED = [new File([new Uint8Array(48_200)], "delivery-log-october.csv", { type: "text/csv" })]

export default function FileUploadDisabled() {
  return (
    <FileUpload disabled multiple defaultFiles={ATTACHED} className="w-full max-w-xl">
      <FileUploadDropzone description="Uploads are paused while the archive is moved" />
      <FileUploadList />
    </FileUpload>
  )
}
