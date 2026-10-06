import { Rating } from "@booleanpress/ui/rating"

export default function RatingReadOnly() {
  return (
    <div className="flex items-center gap-2">
      <Rating readOnly allowHalf value={4.5} aria-label="Average rating" />
      <span className="text-sm/normal text-muted-foreground">from 128 reviews</span>
    </div>
  )
}
