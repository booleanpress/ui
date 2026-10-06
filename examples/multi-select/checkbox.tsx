import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const SITES = ["shop.example.com", "blog.example.com", "docs.example.com", "status.example.com", "help.example.com"]

export default function MultiSelectCheckbox() {
  return (
    <div className="flex w-full max-w-56 flex-col gap-2">
      <Label htmlFor="multi-select-sites">Send from these sites</Label>
      <MultiSelect items={SITES} defaultValue={["shop.example.com"]}>
        <MultiSelectTrigger id="multi-select-sites" className="w-full">
          <MultiSelectValue placeholder="Choose sites" />
        </MultiSelectTrigger>
        <MultiSelectContent selectAll>
          <MultiSelectList>
            {(site: string) => (
              <MultiSelectItem key={site} value={site} indicator="checkbox">
                {site}
              </MultiSelectItem>
            )}
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
