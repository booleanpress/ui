import { Textarea } from "@booleanpress/ui/textarea"

export default function TextareaFluid() {
  return <div className="w-full max-w-sm"><Textarea fluid rows={5} aria-label="Notes" placeholder="Write your notes" /></div>
}
