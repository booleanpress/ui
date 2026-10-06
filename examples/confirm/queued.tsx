import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { ConfirmProvider, useConfirm } from "@booleanpress/ui/confirm"

const MAILERS = ["Primary SMTP", "Transactional SES"]

function ImportMailers() {
  const confirm = useConfirm()
  const [result, setResult] = useState("")

  // Both questions are asked at once; the second dialog opens when the first is answered.
  const importMailers = async () => {
    const answers = await Promise.all(
      MAILERS.map((name) =>
        confirm({
          title: `Replace ${name}?`,
          description: `The imported file has settings for ${name}. Replacing them changes how its emails are sent.`,
          confirmLabel: "Replace",
          cancelLabel: "Skip",
        })
      )
    )
    const replaced = MAILERS.filter((_, index) => answers[index])
    setResult(replaced.length ? `Replaced: ${replaced.join(", ")}.` : "Nothing was replaced.")
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button variant="outline" onClick={importMailers}>
        Import 2 mailers
      </Button>
      <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
        {result}
      </p>
    </div>
  )
}

export default function ConfirmQueued() {
  return (
    <ConfirmProvider>
      <ImportMailers />
    </ConfirmProvider>
  )
}
