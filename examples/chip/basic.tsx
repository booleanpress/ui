import { Chip } from "@booleanpress/ui/chip"

export default function ChipBasic() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Chip label="Transactional" />
      <Chip label="Marketing" />
      <Chip label="Password resets" />
    </div>
  )
}
