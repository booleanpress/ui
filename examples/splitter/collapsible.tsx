import { Splitter, SplitterHandle, SplitterPanel } from "@booleanpress/ui/splitter"

export default function SplitterCollapsible() {
  return (
    <Splitter className="mx-auto min-h-60 max-w-lg">
      <SplitterPanel
        collapsible
        collapsedSize="0%"
        minSize="25%"
        defaultSize="35%"
        className="flex items-center justify-center"
      >
        <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">Filters</span>
      </SplitterPanel>
      <SplitterHandle aria-label="Resize filters. Enter collapses them." withHandle />
      <SplitterPanel className="flex items-center justify-center p-4 text-center">
        <p className="text-sm/normal text-muted-foreground">
          Drag the handle past the minimum to collapse the filters, or focus it and press Enter.
        </p>
      </SplitterPanel>
    </Splitter>
  )
}
