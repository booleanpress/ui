import { Separator } from "@booleanpress/ui/separator"

export default function SeparatorDashedAndDotted() {
  return (
    <div className="w-full max-w-md text-sm">
      <p>Connect a sending domain in two minutes</p>
      <Separator className="my-3.5" />
      <p>Retries run for 24 hours</p>
      <Separator variant="dashed" className="my-3.5" />
      <p>Logs are kept for 30 days</p>
      <Separator variant="dotted" className="my-3.5" />
      <p>Webhooks report every bounce</p>
    </div>
  )
}
