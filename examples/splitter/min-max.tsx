import { Splitter, SplitterHandle, SplitterPanel } from "@booleanpress/ui/splitter"

function PanelLabel({ children }: { children: string }) {
  return <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">{children}</span>
}

export default function SplitterMinMax() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
      <Splitter className="min-h-32">
        <SplitterPanel minSize="30%" maxSize="70%" className="flex items-center justify-center">
          <PanelLabel>30–70 %</PanelLabel>
        </SplitterPanel>
        <SplitterHandle aria-label="Resize the first panel" />
        <SplitterPanel className="flex items-center justify-center">
          <PanelLabel>The rest</PanelLabel>
        </SplitterPanel>
      </Splitter>
      <Splitter className="min-h-32">
        <SplitterPanel minSize={120} className="flex items-center justify-center">
          <PanelLabel>Min 120 px</PanelLabel>
        </SplitterPanel>
        <SplitterHandle aria-label="Resize the first panel" />
        <SplitterPanel minSize="20%" className="flex items-center justify-center">
          <PanelLabel>Min 20 %</PanelLabel>
        </SplitterPanel>
        <SplitterHandle aria-label="Resize the second panel" />
        <SplitterPanel minSize="20%" className="flex items-center justify-center">
          <PanelLabel>Min 20 %</PanelLabel>
        </SplitterPanel>
      </Splitter>
    </div>
  )
}
