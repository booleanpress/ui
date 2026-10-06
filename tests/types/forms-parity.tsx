import { Rating } from "@booleanpress/ui/rating"
import { Slider } from "@booleanpress/ui/slider"
import { Textarea } from "@booleanpress/ui/textarea"
import { Toggle } from "@booleanpress/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@booleanpress/ui/toggle-group"

export function FormStates() {
  return <>
    <Rating renderIcon={({ index, active, checked, value }) => <span>{index + value}{active && checked ? "chosen" : ""}</span>} />
    <Slider defaultValue={[20, 80]} minStepsBetweenThumbs={2} />
    <Textarea autoResize fluid rows={5} />
    <Toggle>{({ pressed }) => pressed ? "Enabled" : "Disabled"}</Toggle>
    <ToggleGroup type="single" allowEmpty={false} value="a" onValueChange={(value) => value.toUpperCase()}><ToggleGroupItem value="a">A</ToggleGroupItem></ToggleGroup>
    <ToggleGroup type="multiple" allowEmpty={false} value={["a"]} onValueChange={(values) => values.map(String)} />
    {/* @ts-expect-error single groups require scalar values */}
    <ToggleGroup type="single" value={["a"]} />
    {/* @ts-expect-error multiple groups require arrays */}
    <ToggleGroup type="multiple" value="a" />
  </>
}
