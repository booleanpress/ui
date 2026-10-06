import { FileUpload, FileUploadDropzone, FileUploadErrors, FileUploadList } from "@booleanpress/ui/file-upload"

// Five files offered at once: two pass, and one fails each rule.
const OFFERED = [
  new File([new Uint8Array(84_000)], "logo.png", { type: "image/png" }),
  new File(["Call notes, 3 October"], "notes.txt", { type: "text/plain" }),
  new File([new Uint8Array(2_400_000)], "office-photo.jpg", { type: "image/jpeg" }),
  new File([new Uint8Array(120_000)], "header.jpg", { type: "image/jpeg" }),
  new File([new Uint8Array(96_000)], "footer.png", { type: "image/png" }),
]

export default function FileUploadValidation() {
  return (
    <FileUpload
      accept="image/png,image/jpeg"
      multiple
      maxSize={1_000_000}
      maxFiles={2}
      defaultFiles={OFFERED}
      className="w-full max-w-xl"
    >
      <FileUploadDropzone description="PNG or JPG, up to 1 MB each, 2 files at most" />
      <FileUploadErrors />
      <FileUploadList />
    </FileUpload>
  )
}
