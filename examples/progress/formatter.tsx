import { Progress } from "@booleanpress/ui/progress"

const count = new Intl.NumberFormat("en-GB")

export default function ProgressFormatter() {
  return (
    <Progress
      value={512}
      max={1024}
      showValue
      getValueLabel={(value, max) => `${count.format(value)} of ${count.format(max)} sent`}
      aria-label="Newsletter sending"
      className="w-full max-w-sm"
    />
  )
}
