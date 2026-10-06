import { NativeSelect, NativeSelectOption } from "@booleanpress/ui/native-select"

export default function NativeSelectSizes() {
  return (
    <div className="flex flex-col items-start gap-4">
      <NativeSelect size="sm" aria-label="Status, small size" defaultValue="all">
        <NativeSelectOption value="all">All statuses</NativeSelectOption>
        <NativeSelectOption value="delivered">Delivered</NativeSelectOption>
      </NativeSelect>
      <NativeSelect aria-label="Status, default size" defaultValue="all">
        <NativeSelectOption value="all">All statuses</NativeSelectOption>
        <NativeSelectOption value="delivered">Delivered</NativeSelectOption>
      </NativeSelect>
      <NativeSelect size="lg" aria-label="Status, large size" defaultValue="all">
        <NativeSelectOption value="all">All statuses</NativeSelectOption>
        <NativeSelectOption value="delivered">Delivered</NativeSelectOption>
      </NativeSelect>
    </div>
  )
}
