import { useLoaderData, type MetaFunction } from "react-router"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@booleanpress/ui/tabs"
import { SITE, canonicalLink } from "~/content/site.ts"
import { guidePage } from "~/lib/pages.server.ts"
import { DocsShell } from "~/shell/DocsShell.tsx"
import { PageHeader, Prose, SectionHeading } from "~/page/Prose.tsx"
import { ThemeBuilder } from "~/page/ThemeBuilder.tsx"

export async function loader({ request }: { request: Request }) {
  // The page itself, or its data on a client-side navigation (/components/dialog.data).
  const slug = new URL(request.url).pathname.replace(/\.data$/, "").split("/").filter(Boolean)[1]
  const page = await guidePage(slug)
  if (!page) throw new Response("Not found", { status: 404 })
  return page
}

export const meta: MetaFunction<typeof loader> = ({ loaderData: data, location }) =>
  data ? [{ title: `${data.title} · ${SITE.name}` }, { name: "description", content: data.description }, canonicalLink(location.pathname)] : []

export default function GuidePage() {
  const page = useLoaderData<typeof loader>()
  return (
    <DocsShell version={page.version} toc={page.toc} resources={{ markdownHref: page.markdownHref, editHref: page.editHref }} neighbours={page.neighbours}>
      <PageHeader eyebrow={["Guides"]} title={page.title} lead={page.description} />
      {page.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="space-y-4">
          <SectionHeading id={section.id}>{section.title}</SectionHeading>
          {section.html ? <Prose html={section.html} /> : null}
          {section.widget === "theme-builder" ? <ThemeBuilder /> : null}
          {section.tabs ? (
            <Tabs defaultValue={section.tabs[0].id}>
              <TabsList aria-label={section.title}>
                {section.tabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {section.tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="px-0 pt-4 pb-0">
                  <Prose html={tab.html} />
                </TabsContent>
              ))}
            </Tabs>
          ) : null}
        </section>
      ))}
    </DocsShell>
  )
}
