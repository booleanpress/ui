import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const ROLES: TreeNode[] = [
  {
    id: "administrators",
    label: "Administrators",
    children: [
      { id: "owner", label: "Site owner", disabled: true },
      { id: "admins", label: "Admins" },
    ],
  },
  { id: "editors", label: "Editors", children: [{ id: "authors", label: "Authors" }, { id: "contributors", label: "Contributors" }] },
  { id: "subscribers", label: "Subscribers", disabled: true },
]

export default function TreeDisabled() {
  return (
    <Tree
      aria-label="Roles that get the report"
      nodes={ROLES}
      selectionMode="checkbox"
      defaultSelected={["owner"]}
      defaultExpanded={["administrators"]}
      className="w-full md:w-120"
    />
  )
}
