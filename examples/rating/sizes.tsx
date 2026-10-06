import { Rating } from "@booleanpress/ui/rating"

export default function RatingSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Rating size="sm" defaultValue={3} aria-label="Small" />
      <Rating defaultValue={3} aria-label="Default" />
      <Rating size="lg" defaultValue={3} aria-label="Large" />
    </div>
  )
}
