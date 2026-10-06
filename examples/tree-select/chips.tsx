import { Label } from "@booleanpress/ui/label"
import { TreeSelect } from "@booleanpress/ui/tree-select"
import type { TreeNode } from "@booleanpress/ui/tree"

const REGIONS: TreeNode[] = [
  { id: "europe", label: "Europe", children: [{ id: "de", label: "Germany" }, { id: "fr", label: "France" }, { id: "nl", label: "Netherlands" }] },
  { id: "americas", label: "Americas", children: [{ id: "us", label: "United States" }, { id: "br", label: "Brazil" }] },
  { id: "asia", label: "Asia", children: [{ id: "jp", label: "Japan" }, { id: "in", label: "India" }] },
]

export default function TreeSelectChips() {
  return (
    <div className="flex w-full flex-col gap-2 md:w-80">
      <Label htmlFor="send-regions">Send from servers in</Label>
      <TreeSelect
        id="send-regions"
        nodes={REGIONS}
        selectionMode="multiple"
        display="chip"
        maxSelectedLabels={2}
        defaultValue={["de", "fr", "us"]}
        placeholder="Choose countries"
        fluid
      />
    </div>
  )
}
