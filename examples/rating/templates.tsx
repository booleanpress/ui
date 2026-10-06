import { HeartIcon, StarIcon, ThumbsUpIcon } from "lucide-react"
import { Rating } from "@booleanpress/ui/rating"

const icons = [HeartIcon, StarIcon, ThumbsUpIcon, StarIcon, HeartIcon]

export default function RatingTemplates() {
  return <Rating aria-label="Feedback" defaultValue={3} allowHalf={false} renderIcon={({ index, active }) => {
    const Icon = icons[index]
    return <Icon className={active ? "fill-current" : undefined} />
  }} />
}
