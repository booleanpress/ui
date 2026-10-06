import { TagsInput } from "@booleanpress/ui/tags-input"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export default function TagsInputSizes() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      {SIZES.map(({ size, label }) => (
        <TagsInput key={size} size={size} defaultValue={["billing"]} placeholder={label} aria-label={`Labels, ${label.toLowerCase()} size`} />
      ))}
    </div>
  )
}
