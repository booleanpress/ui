import { Button } from "@booleanpress/ui/button"
import { Spinner } from "@booleanpress/ui/spinner"

export default function SpinnerInButton() {
  return (
    <Button disabled>
      <Spinner />
      Sending
    </Button>
  )
}
