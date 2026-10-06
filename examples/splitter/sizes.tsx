import { Splitter, SplitterHandle, SplitterPanel } from "@booleanpress/ui/splitter"

export default function SplitterSizes() {
  return (
    <Splitter className="mx-auto min-h-60 max-w-lg">
      <SplitterPanel defaultSize="25%" className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Folders</span>
      </SplitterPanel>
      <SplitterHandle aria-label="Resize folders" />
      <SplitterPanel defaultSize="75%" className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Messages</span>
      </SplitterPanel>
    </Splitter>
  )
}
