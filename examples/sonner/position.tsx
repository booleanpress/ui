import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@booleanpress/ui/button"
import { Toaster } from "@booleanpress/ui/sonner"

const toasterId = "sonner-position"

const POSITIONS = [
  { position: "top-left", label: "Top left" },
  { position: "top-center", label: "Top centre" },
  { position: "top-right", label: "Top right" },
  { position: "bottom-left", label: "Bottom left" },
  { position: "bottom-center", label: "Bottom centre" },
  { position: "bottom-right", label: "Bottom right" },
] as const

type Position = (typeof POSITIONS)[number]["position"]

export default function SonnerPosition() {
  const [position, setPosition] = useState<Position>("bottom-right")

  function show(next: Position, label: string) {
    setPosition(next)
    toast(`Shown ${label.toLowerCase()}`, { toasterId })
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        {POSITIONS.map(({ position: value, label }) => (
          <Button key={value} variant="outline" onClick={() => show(value, label)}>
            {label}
          </Button>
        ))}
      </div>
      <Toaster id={toasterId} position={position} />
    </>
  )
}
