import { AspectRatio } from "@booleanpress/ui/aspect-ratio"

const LOGOS = ["Acme", "Globex", "Initech"]

export default function AspectRatioSquare() {
  return (
    <div className="grid w-full max-w-sm grid-cols-3 gap-3">
      {LOGOS.map((name) => (
        <AspectRatio key={name} ratio={1} className="flex items-center justify-center rounded-lg border bg-subtle">
          <span className="text-sm/normal font-semibold text-muted-foreground">{name}</span>
        </AspectRatio>
      ))}
    </div>
  )
}
