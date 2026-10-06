import { LogInIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"

export default function ButtonFluid() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Button fluid>
        <LogInIcon />
        Sign in
      </Button>
      <Button fluid variant="outline">
        Create an account
      </Button>
    </div>
  )
}
