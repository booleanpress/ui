import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const ROLES = ["Administrator", "Editor", "Author", "Contributor", "Shop manager", "Customer"]

export default function MultiSelectFluid() {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label htmlFor="multi-select-roles">Roles that may see delivery logs</Label>
      <MultiSelect items={ROLES} defaultValue={["Administrator", "Shop manager"]}>
        <MultiSelectTrigger id="multi-select-roles" fluid>
          <MultiSelectValue placeholder="Choose roles" />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectList>
            {(role: string) => (
              <MultiSelectItem key={role} value={role}>
                {role}
              </MultiSelectItem>
            )}
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
