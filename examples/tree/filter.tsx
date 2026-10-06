import { Tree, type TreeNode } from "@booleanpress/ui/tree"

const HELP: TreeNode[] = [
  {
    id: "getting-started",
    label: "Getting started",
    children: [
      { id: "install", label: "Install the plugin" },
      { id: "connect", label: "Connect a mailer" },
    ],
  },
  {
    id: "mailers",
    label: "Mailers",
    children: [
      { id: "smtp", label: "Other SMTP" },
      { id: "api", label: "API mailers", children: [{ id: "api-keys", label: "Create an API key" }, { id: "domains", label: "Verify a domain" }] },
    ],
  },
  { id: "logs", label: "Delivery logs", children: [{ id: "retention", label: "Log retention" }, { id: "resend", label: "Resend an email" }] },
]

export default function TreeFilter() {
  return <Tree aria-label="Help articles" nodes={HELP} filter filterPlaceholder="Search articles" className="w-full md:w-120" />
}
