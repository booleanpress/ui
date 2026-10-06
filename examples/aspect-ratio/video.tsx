import { PlayIcon } from "lucide-react"
import { AspectRatio } from "@booleanpress/ui/aspect-ratio"
import { Button } from "@booleanpress/ui/button"

export default function AspectRatioVideo() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="flex flex-col items-center justify-center gap-3 rounded-lg bg-muted">
        <Button size="icon-lg" className="rounded-full" aria-label="Play: connecting your first mail provider">
          <PlayIcon className="fill-current" />
        </Button>
        <span className="text-sm/normal text-muted-foreground">Connecting your first mail provider · 3:12</span>
      </AspectRatio>
    </div>
  )
}
