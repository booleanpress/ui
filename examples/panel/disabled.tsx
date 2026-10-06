import { Panel, PanelContent, PanelHeader, PanelTitle, PanelTrigger } from "@booleanpress/ui/panel"

export default function PanelDisabled() {
  return (
    <Panel toggleable disabled className="w-full max-w-xs">
      <PanelHeader>
        <PanelTitle>Billing details</PanelTitle>
        <PanelTrigger />
      </PanelHeader>
      <PanelContent>
        <p className="text-muted-foreground">Invoices go to billing@example.com. Your plan is managed by the account owner.</p>
      </PanelContent>
    </Panel>
  )
}
