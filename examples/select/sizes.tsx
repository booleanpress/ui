import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@booleanpress/ui/select"

const SIZES = [
  { size: "sm", label: "Small" },
  { size: "default", label: "Default" },
  { size: "lg", label: "Large" },
] as const

export default function SelectSizes() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-4">
      {SIZES.map(({ size, label }) => (
        <Select key={size}>
          <SelectTrigger size={size} aria-label={`Region, ${label.toLowerCase()} size`} className="w-full">
            <SelectValue placeholder={label} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
            <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
            <SelectItem value="ap-south-1">Asia Pacific (Mumbai)</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </div>
  )
}
