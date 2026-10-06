import { Rating } from "@booleanpress/ui/rating"

export default function RatingNumberOfStars() {
  return <Rating max={10} defaultValue={5} aria-label="Rate the onboarding from 1 to 10" />
}
