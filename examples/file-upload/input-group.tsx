import { TagIcon, UploadIcon } from "lucide-react"
import { FileUpload, FileUploadTrigger, useFileUpload } from "@booleanpress/ui/file-upload"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@booleanpress/ui/input-group"

function ImportField() {
  const { files } = useFileUpload()
  return (
    <InputGroup>
      <InputGroupAddon>
        <TagIcon />
      </InputGroupAddon>
      <InputGroupInput aria-label="Contacts file" placeholder="No file chosen" readOnly value={files[0]?.file.name ?? ""} />
      <InputGroupAddon align="inline-end">
        <FileUploadTrigger asChild>
          <InputGroupButton>
            <UploadIcon />
            Browse
          </InputGroupButton>
        </FileUploadTrigger>
      </InputGroupAddon>
    </InputGroup>
  )
}

export default function FileUploadInputGroup() {
  return (
    <FileUpload accept=".csv,text/csv" className="w-full max-w-sm">
      <ImportField />
    </FileUpload>
  )
}
