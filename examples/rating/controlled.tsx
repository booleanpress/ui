import { useState } from "react"
import { Button } from "@booleanpress/ui/button"
import { Rating } from "@booleanpress/ui/rating"

export default function RatingControlled() {
  const [score, setScore] = useState(4)

  return (
    <div className="flex flex-col items-center gap-4">
      <Rating value={score} onValueChange={setScore} allowHalf aria-label="Ticket satisfaction" size="lg" />
      <div className="flex gap-2">
        {[2.5, 3, 3.5].map((preset) => (
          <Button key={preset} size="sm" variant="outline" onClick={() => setScore(preset)}>
            {preset} stars
          </Button>
        ))}
      </div>
    </div>
  )
}
