import { Splitter, SplitterHandle, SplitterPanel } from "@booleanpress/ui/splitter"

function PanelLabel({ children }: { children: string }) {
  return <span className="rounded-md bg-muted px-2 py-1 text-sm/normal font-semibold">{children}</span>
}

export default function SplitterNested() {
  return (
    <Splitter className="mx-auto min-h-80 max-w-lg">
      <SplitterPanel defaultSize="25%" className="flex items-center justify-center">
        <PanelLabel>Folders</PanelLabel>
      </SplitterPanel>
      <SplitterHandle aria-label="Resize folders" />
      <SplitterPanel defaultSize="75%">
        <Splitter orientation="vertical">
          <SplitterPanel defaultSize="50%" className="flex items-center justify-center">
            <PanelLabel>Messages</PanelLabel>
          </SplitterPanel>
          <SplitterHandle aria-label="Resize messages" />
          <SplitterPanel defaultSize="50%">
            <Splitter>
              <SplitterPanel defaultSize="25%" className="flex items-center justify-center">
                <PanelLabel>Tags</PanelLabel>
              </SplitterPanel>
              <SplitterHandle aria-label="Resize tags" />
              <SplitterPanel defaultSize="75%" className="flex items-center justify-center">
                <PanelLabel>Preview</PanelLabel>
              </SplitterPanel>
            </Splitter>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  )
}
