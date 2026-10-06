import { Rating } from "@booleanpress/ui/rating"

const faces = ["😞", "😕", "😐", "🙂", "😄"]

export default function RatingEmoji() {
  return <Rating aria-label="How was your experience?" defaultValue={4} allowHalf={false} size="lg" className="gap-2"
    renderIcon={({ index, checked }) => <span className={checked ? "" : "opacity-40 grayscale"}>{faces[index]}</span>} />
}
