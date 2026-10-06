import { AspectRatio } from "@booleanpress/ui/aspect-ratio"

// A drawn chart stands in for a screenshot, so the example needs no network.
const SCREENSHOT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 90"><rect width="160" height="90" fill="#f1f5f9"/><rect x="10" y="10" width="60" height="6" rx="2" fill="#cbd5e1"/><path d="M10 74 L40 52 L64 60 L92 34 L120 42 L150 20" fill="none" stroke="#020617" stroke-width="2"/><path d="M10 74 L40 52 L64 60 L92 34 L120 42 L150 20 L150 80 L10 80 Z" fill="#020617" fill-opacity="0.08"/></svg>'
  )

export default function AspectRatioImage() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border">
        <img src={SCREENSHOT} alt="Deliveries per day over the last week, rising" className="size-full object-cover" />
      </AspectRatio>
    </div>
  )
}
