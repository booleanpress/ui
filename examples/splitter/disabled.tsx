import { Splitter, SplitterHandle, SplitterPanel } from "@booleanpress/ui/splitter"

export default function SplitterDisabled() {
  return (
    <Splitter disabled className="mx-auto min-h-32 max-w-lg">
      <SplitterPanel className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Sent</span>
      </SplitterPanel>
      <SplitterHandle aria-label="Resize sent" />
      <SplitterPanel className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Failed</span>
      </SplitterPanel>
      <SplitterHandle aria-label="Resize failed" />
      <SplitterPanel className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Queued</span>
      </SplitterPanel>
    </Splitter>
  )
}
