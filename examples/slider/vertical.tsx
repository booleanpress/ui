import { Slider } from "@booleanpress/ui/slider"

const QUEUES = [
  { id: "queue-transactional", label: "Orders", value: 70 },
  { id: "queue-marketing", label: "News", value: 20 },
  { id: "queue-alerts", label: "Alerts", value: 40 },
]

export default function SliderVertical() {
  return (
    <div className="flex gap-10">
      {QUEUES.map((queue) => (
        <div key={queue.id} className="flex flex-col items-center gap-3">
          <Slider
            orientation="vertical"
            defaultValue={[queue.value]}
            aria-labelledby={queue.id}
            className="h-28"
          />
          <span id={queue.id} className="text-xs/normal text-muted-foreground">
            {queue.label}
          </span>
        </div>
      ))}
    </div>
  )
}
