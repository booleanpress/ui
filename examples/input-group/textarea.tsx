import { SendIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from "@booleanpress/ui/input-group"

export default function InputGroupTextareaExample() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea aria-label="Reply" placeholder="Write a reply" rows={3} />
      <InputGroupAddon align="block-end">
        <InputGroupText>0 / 2000</InputGroupText>
        <InputGroupButton variant="default" size="sm" className="ms-auto">
          <SendIcon />
          Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
