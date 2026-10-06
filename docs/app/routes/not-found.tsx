import { Link, type MetaFunction } from "react-router"
import { Button } from "@booleanpress/ui/button"
import { SITE } from "~/content/site.ts"
import { VERSION } from "~/lib/version.ts"
import { DocsShell } from "~/shell/DocsShell.tsx"

export const meta: MetaFunction = () => [{ title: `Page not found · ${SITE.name}` }, { name: "robots", content: "noindex" }]

export default function NotFound() {
  return (
    <DocsShell version={VERSION}>
      <section className="flex flex-col items-start gap-4 py-10">
        <h1 className="text-3xl font-normal tracking-[-0.75px] text-[var(--docs-heading)]">Page not found</h1>
        <p className="text-lg text-[var(--docs-lead)]">There is no page at this address. It may have moved; the list on the left has every page.</p>
        <Button asChild variant="outline">
          <Link to="/docs/introduction">Go to the introduction</Link>
        </Button>
      </section>
    </DocsShell>
  )
}
