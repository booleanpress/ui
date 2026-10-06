import { ExternalLinkIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"

export default function ButtonAsLink() {
  return (
    <Button asChild variant="outline">
      <a href="https://www.w3.org/WAI/ARIA/apg/patterns/button/">
        Read the button pattern
        <ExternalLinkIcon />
      </a>
    </Button>
  )
}
