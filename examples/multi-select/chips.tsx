import { Label } from "@booleanpress/ui/label"
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectList,
  MultiSelectTrigger,
  MultiSelectValue,
} from "@booleanpress/ui/multi-select"

const AGENTS = [
  { value: "sc", label: "Sara Chowdhury" },
  { value: "ar", label: "Arif Rahman" },
  { value: "jk", label: "Jonas Keller" },
  { value: "tm", label: "Tamsin Moore" },
  { value: "lb", label: "Lena Brandt" },
]

export default function MultiSelectChips() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <Label htmlFor="multi-select-agents">Notify these agents</Label>
      <MultiSelect items={AGENTS} defaultValue={[AGENTS[0], AGENTS[2]]}>
        <MultiSelectTrigger id="multi-select-agents" fluid>
          <MultiSelectValue display="chips" placeholder="Choose agents" />
        </MultiSelectTrigger>
        <MultiSelectContent>
          <MultiSelectList>
            {(agent: (typeof AGENTS)[number]) => (
              <MultiSelectItem key={agent.value} value={agent}>
                {agent.label}
              </MultiSelectItem>
            )}
          </MultiSelectList>
        </MultiSelectContent>
      </MultiSelect>
    </div>
  )
}
