import { Button } from "@booleanpress/ui/button"
import { ConfirmPopup, ConfirmPopupContent, ConfirmPopupTrigger } from "@booleanpress/ui/confirm-popup"

const SIDES = ["top", "right", "bottom", "left"] as const

export default function ConfirmPopupPlacement() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {SIDES.map((side) => (
        <ConfirmPopup key={side}>
          <ConfirmPopupTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </ConfirmPopupTrigger>
          <ConfirmPopupContent side={side} align="center" message="Resend the welcome email?" confirmLabel="Resend" />
        </ConfirmPopup>
      ))}
    </div>
  )
}
