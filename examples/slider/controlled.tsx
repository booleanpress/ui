import { useState } from "react"
import { useUiLocale } from "@booleanpress/ui/provider"
import { Label } from "@booleanpress/ui/label"
import { Slider } from "@booleanpress/ui/slider"

export default function SliderControlled() {
  const [limit, setLimit] = useState([2500])
  const { locale } = useUiLocale()
  const formatted = new Intl.NumberFormat(locale).format(limit[0])

  return (
    <div className="flex w-64 flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <Label id="daily-limit">Daily sending limit</Label>
        <span className="text-sm/normal text-muted-foreground tabular-nums">{formatted} emails</span>
      </div>
      <Slider value={limit} onValueChange={setLimit} min={0} max={10000} step={500} aria-labelledby="daily-limit" />
    </div>
  )
}
