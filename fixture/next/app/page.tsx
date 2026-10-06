// A server component: no "use client" here. Each package component is a client module (its built file keeps the
// directive), so Next renders it on the server and hydrates it in the browser.
import { Button } from "@booleanpress/ui/button"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@booleanpress/ui/dialog"
import { Label } from "@booleanpress/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"
import { TrafficChart } from "./traffic-chart"

export default function Page() {
  return (
    <main className="flex flex-col items-start gap-6 p-8">
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Rendered on the server</DialogTitle>
            <DialogDescription>Opened in the browser, after hydration.</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-2">
        <Checkbox id="server" defaultChecked />
        <Label htmlFor="server">Checked on the server</Label>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover for a tooltip</Button>
        </TooltipTrigger>
        <TooltipContent>The tooltip, after hydration</TooltipContent>
      </Tooltip>
      <TrafficChart />
    </main>
  )
}
