import { PlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"

export default function ButtonSizes() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="icon-xs" variant="outline" aria-label="Add a row">
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="outline" aria-label="Add a filter">
          <PlusIcon />
        </Button>
        <Button size="icon" variant="outline" aria-label="Add a mailer">
          <PlusIcon />
        </Button>
        <Button size="icon-lg" variant="outline" aria-label="Add a contact">
          <PlusIcon />
        </Button>
      </div>
    </div>
  )
}
