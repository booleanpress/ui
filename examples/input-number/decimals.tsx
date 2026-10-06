import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberDecimals() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="batch-size">Batch size</Label>
        <InputNumber id="batch-size" fluid defaultValue={42723} format={{ maximumFractionDigits: 0 }} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="ticket-number">Ticket number, without grouping</Label>
        <InputNumber id="ticket-number" fluid defaultValue={58151} format={{ useGrouping: false }} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="response-hours">Average response, in hours</Label>
        <InputNumber
          id="response-hours"
          fluid
          defaultValue={2351.35}
          format={{ minimumFractionDigits: 2, maximumFractionDigits: 5 }}
        />
      </div>
    </div>
  )
}
