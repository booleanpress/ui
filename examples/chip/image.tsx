import { Chip } from "@booleanpress/ui/chip"

function portrait(fill: string, face: string) {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${fill}"/><circle cx="32" cy="25" r="11" fill="${face}"/><path d="M10 64c2-16 12-24 22-24s20 8 22 24z" fill="${face}"/></svg>`
    )
  )
}

export default function ChipImage() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Chip image={portrait("#6366f1", "#e0e7ff")} label="Ada Lovelace" />
      <Chip image={portrait("#0ea5e9", "#e0f2fe")} label="Grace Hopper" />
      <Chip image={portrait("#f97316", "#ffedd5")} label="Alan Turing" />
    </div>
  )
}
