import { Splitter, SplitterHandle, SplitterPanel } from "@booleanpress/ui/splitter"

export default function SplitterBasic() {
  return (
    <Splitter className="mx-auto min-h-60 max-w-lg">
      <SplitterPanel className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Mailers</span>
      </SplitterPanel>
      <SplitterHandle aria-label="Resize mailers" />
      <SplitterPanel className="flex items-center justify-center">
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Settings</span>
      </SplitterPanel>
    </Splitter>
  )
}
