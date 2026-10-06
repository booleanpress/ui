import * as React from "react"
import { Button } from "@booleanpress/ui/button"
import { CloseButton } from "@booleanpress/ui/close-button"

export default function CloseButtonInACard() {
  const [shown, setShown] = React.useState(true)

  if (!shown) {
    return (
      <Button variant="outline" onClick={() => setShown(true)}>
        Show the notice again
      </Button>
    )
  }

  return (
    <section aria-labelledby="dkim-title" className="relative w-full max-w-sm rounded-xl border bg-card p-4 pe-14 shadow-sm">
      <h3 id="dkim-title" className="font-semibold">
        DKIM is not set up
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Add the DKIM record to your domain so receiving servers trust mail from this mailer.
      </p>
      <CloseButton label="Dismiss the DKIM notice" size="sm" className="absolute end-3 top-3.5" onClick={() => setShown(false)} />
    </section>
  )
}
