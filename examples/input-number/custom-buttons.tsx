import { MinusIcon, PlusIcon } from "lucide-react"
import { InputNumber } from "@booleanpress/ui/input-number"

export default function CustomNumberButtons() {
  return <InputNumber aria-label="Quantity" defaultValue={1} min={0} max={10} buttons="horizontal" incrementIcon={<PlusIcon />} decrementIcon={<MinusIcon />} />
}
