import { useState } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { Knob } from "@booleanpress/ui/knob"

export default function KnobControlled() {
  const [workers, setWorkers] = useState(0)

  return (
    <div className="flex flex-col items-center gap-2">
      <Knob value={workers} onValueChange={setWorkers} size="lg" aria-label="Queue workers" />
      <div className="flex gap-2">
        <Button size="icon-sm" aria-label="Add a worker" disabled={workers >= 100} onClick={() => setWorkers((n) => Math.min(100, n + 1))}>
          <PlusIcon />
        </Button>
        <Button size="icon-sm" variant="secondary" aria-label="Remove a worker" disabled={workers <= 0} onClick={() => setWorkers((n) => Math.max(0, n - 1))}>
          <MinusIcon />
        </Button>
      </div>
    </div>
  )
}
