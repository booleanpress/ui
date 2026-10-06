import { Link, type MetaFunction } from "react-router"
import { Button } from "@booleanpress/ui/button"
import { components, componentHref } from "~/content/registry.ts"
import { SITE, canonicalLink } from "~/content/site.ts"
import { VERSION } from "~/lib/version.ts"
import { DocsShell } from "~/shell/DocsShell.tsx"

export const meta: MetaFunction = () => [{ title: SITE.name }, { name: "description", content: SITE.description }, canonicalLink("/")]

export default function Home() {
  return (
    <DocsShell version={VERSION}>
      <section className="flex flex-col items-start gap-5 py-10">
        <p className="font-mono text-xs tracking-[0.3px] text-muted-foreground uppercase">React · Tailwind CSS 4 · Radix · Base UI</p>
        <h1 className="text-5xl font-normal tracking-[-1.2px] text-[var(--docs-heading)]">{SITE.name}</h1>
        <p className="max-w-xl text-lg text-[var(--docs-lead)]">{SITE.description} Every example tested with axe, in light and dark. Ready to translate, and to read right to left.</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/docs/installation">Get started</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={componentHref(components[0].slug)}>Browse components</Link>
          </Button>
        </div>
      </section>
    </DocsShell>
  )
}
