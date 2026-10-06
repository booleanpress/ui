import { InputNumber } from "@booleanpress/ui/input-number"
import { Label } from "@booleanpress/ui/label"

export default function InputNumberButtons() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="seat-price">Seat price</Label>
        <InputNumber
          id="seat-price"
          fluid
          buttons="stacked"
          defaultValue={20}
          format={{ style: "currency", currency: "USD" }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="team-seats">Team seats, 0 to 100</Label>
        <InputNumber id="team-seats" fluid buttons="stacked" defaultValue={25} min={0} max={100} />
      </div>
    </div>
  )
}
