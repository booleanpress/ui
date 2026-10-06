import { HeartIcon } from "lucide-react"
import { Rating } from "@booleanpress/ui/rating"

export default function RatingCustomIcon() {
  return (
    <Rating
      defaultValue={4}
      icon={<HeartIcon className="fill-current" />}
      emptyIcon={<HeartIcon />}
      aria-label="How much do you like the new editor"
    />
  )
}
