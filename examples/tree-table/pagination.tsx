import { useUiLocale } from "@booleanpress/ui/provider"
import { TreeTable, type TreeTableColumn } from "@booleanpress/ui/tree-table"
import type { TreeNode } from "@booleanpress/ui/tree"

type Site = { plan: string; emails: number }

const site = (id: string, label: string, plan: string, emails: number): TreeNode<Site> => ({
  id,
  label,
  data: { plan, emails },
  children: [
    { id: `${id}-forms`, label: "Contact forms", data: { plan: "", emails: Math.round(emails * 0.3) } },
    { id: `${id}-orders`, label: "Order emails", data: { plan: "", emails: Math.round(emails * 0.7) } },
  ],
})

const SITES: TreeNode<Site>[] = [
  site("shop", "shop.example.com", "Agency", 12400),
  site("blog", "blog.example.com", "Starter", 860),
  site("docs", "docs.example.com", "Starter", 120),
  site("events", "events.example.com", "Pro", 3200),
  site("store", "store.example.org", "Pro", 5100),
  site("news", "news.example.org", "Starter", 940),
  site("jobs", "jobs.example.org", "Starter", 310),
]

export default function TreeTablePagination() {
  const { locale } = useUiLocale()
  const number = new Intl.NumberFormat(locale)
  const columns: TreeTableColumn<Site>[] = [
    { id: "name", header: "Site" },
    { id: "plan", header: "Plan" },
    { id: "emails", header: "Emails this month", cell: (node) => number.format(node.data?.emails ?? 0) },
  ]

  return <TreeTable aria-label="Sites" nodes={SITES} columns={columns} pageSize={3} className="max-w-3xl" />
}
