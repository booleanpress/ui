import { Panel, PanelContent, PanelHeader, PanelTitle } from "@booleanpress/ui/panel"
import { Separator } from "@booleanpress/ui/separator"

const LINES = [
  { label: "Growth plan", amount: "$29.00" },
  { label: "10,000 extra emails", amount: "$8.00" },
  { label: "Dedicated IP", amount: "$5.99" },
]

export default function PanelBasic() {
  return (
    <Panel className="w-full max-w-xs">
      <PanelHeader>
        <PanelTitle>October invoice</PanelTitle>
      </PanelHeader>
      <PanelContent>
        <div className="flex flex-col gap-3">
          {LINES.map((line) => (
            <div key={line.label} className="flex justify-between">
              <span className="text-muted-foreground">{line.label}</span>
              <span className="font-medium">{line.amount}</span>
            </div>
          ))}
        </div>
        <Separator className="my-3.5" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>$42.99</span>
        </div>
      </PanelContent>
    </Panel>
  )
}
