import { Rating } from "@booleanpress/ui/rating"

export default function RatingWholeStars() {
  return <Rating allowHalf={false} defaultValue={3} aria-label="Rate this reply" />
}
