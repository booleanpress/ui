import { SearchIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Kbd } from "@booleanpress/ui/kbd"

export default function KbdInButton() {
  return (
    <Button variant="outline">
      <SearchIcon />
      Search
      <Kbd className="ms-2">/</Kbd>
    </Button>
  )
}
