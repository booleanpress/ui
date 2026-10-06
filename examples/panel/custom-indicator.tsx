import { MinusIcon, PlusIcon } from "lucide-react"
import { Panel, PanelContent, PanelHeader, PanelTitle, PanelTrigger } from "@booleanpress/ui/panel"

// The trigger is the Tailwind group `panel-trigger`: each icon shows in one state.
const indicator = (
  <>
    <MinusIcon className="size-3.5 group-data-[state=closed]/panel-trigger:hidden" />
    <PlusIcon className="size-3.5 group-data-[state=open]/panel-trigger:hidden" />
  </>
)

export default function PanelCustomIndicator() {
  return (
    <Panel toggleable className="w-full max-w-xs">
      <PanelHeader>
        <PanelTitle>Retry policy</PanelTitle>
        <PanelTrigger indicator={indicator} />
      </PanelHeader>
      <PanelContent>
        <p>
          A failed email is retried after 5 minutes, 30 minutes and 2 hours. After the third failure it is marked failed in
          the delivery log and an alert goes to ops@example.com.
        </p>
      </PanelContent>
    </Panel>
  )
}
