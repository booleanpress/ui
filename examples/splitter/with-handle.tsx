import { Splitter, SplitterHandle, SplitterPanel } from "@booleanpress/ui/splitter"

export default function SplitterWithHandle() {
  return (
    <Splitter className="mx-auto min-h-60 max-w-lg">
      <SplitterPanel defaultSize="40%" className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Contacts</span>
      </SplitterPanel>
      <SplitterHandle aria-label="Resize contacts" withHandle />
      <SplitterPanel defaultSize="60%" className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Contact details</span>
      </SplitterPanel>
    </Splitter>
  )
}
