import { useState } from "react"
import { Slider } from "@booleanpress/ui/slider"

export default function SliderValueChange() {
  const [value, setValue] = useState([50])
  const [committed, setCommitted] = useState([50])
  return <div className="flex w-56 flex-col gap-4">
    <Slider value={value} onValueChange={setValue} onValueCommit={setCommitted} aria-label="Level" />
    <p className="text-sm text-muted-foreground">Current: {value[0]}; committed: {committed[0]}</p>
  </div>
}
