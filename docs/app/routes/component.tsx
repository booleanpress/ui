import { useLoaderData, type MetaFunction } from "react-router"
import { SITE, canonicalLink } from "~/content/site.ts"
import { componentPage } from "~/lib/pages.server.ts"
import { DocsShell } from "~/shell/DocsShell.tsx"
import { CopyButton } from "~/page/CopyButton.tsx"
import { ApiReference } from "~/page/ApiReference.tsx"
import { ExampleBlock, ExampleFrame } from "~/page/ExampleBlock.tsx"
import { InstallCommand } from "~/page/InstallCommand.tsx"
import { InlineHtml, PageHeader, Prose, SectionHeading } from "~/page/Prose.tsx"
import { KeyboardTable } from "~/page/Tables.tsx"

export async function loader({ request }: { request: Request }) {
  // The page itself, or its data on a client-side navigation (/components/dialog.data).
  const slug = new URL(request.url).pathname.replace(/\.data$/, "").split("/").filter(Boolean)[1]
  const page = await componentPage(slug)
  if (!page) throw new Response("Not found", { status: 404 })
  return page
}

export const meta: MetaFunction<typeof loader> = ({ loaderData: data, location }) =>
  data ? [{ title: `${data.title} · ${SITE.name}` }, { name: "description", content: data.purpose }, canonicalLink(location.pathname)] : []

const referenceLink = "text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"

export default function ComponentPage() {
  const page = useLoaderData<typeof loader>()
  const [preview, ...examples] = page.examples
  return (
    <DocsShell
      version={page.version}
      toc={page.toc}
      resources={{ apiHref: "#api", sourceHref: page.sourceHref, markdownHref: page.markdownHref, editHref: page.editHref }}
      neighbours={page.neighbours}
    >
      <PageHeader eyebrow={["Components", page.category]} title={page.title} lead={page.purpose} />
      {/* Below 1280px the right column is hidden: its links sit under the title. */}
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm xl:hidden" aria-label="References">
        <li>
          <a href="#api" className={referenceLink}>
            API Reference
          </a>
        </li>
        <li>
          <a href={page.sourceHref} className={referenceLink} rel="noreferrer">
            Source
          </a>
        </li>
        <li>
          <a href={page.markdownHref} className={referenceLink}>
            Markdown
          </a>
        </li>
      </ul>

      <section aria-label="Preview" className="mt-3.75 mb-1.75">
        {/* Headings for the outline only: an example's own h3 or h4 then follows an h2 and an h3, as under Examples. */}
        <h2 className="sr-only">Preview</h2>
        <h3 className="sr-only">{preview.title}</h3>
        <ExampleFrame slug={page.slug} example={preview} preview />
      </section>

      <section aria-labelledby="installation">
        <SectionHeading id="installation">Installation</SectionHeading>
        <InstallCommand packages={page.install} />
      </section>

      <section aria-labelledby="usage">
        <SectionHeading id="usage">Usage</SectionHeading>
        <div className="relative">
          <div className="bui-code min-w-0 overflow-x-auto rounded-lg border pe-12" dangerouslySetInnerHTML={{ __html: page.importHtml }} />
          <div className="absolute end-1.5 top-1.5">
            <CopyButton code={page.importCode} label="Copy the import" />
          </div>
        </div>
        <Prose html={page.usageHtml} className="mt-4" />
      </section>

      {examples.length ? (
        <section aria-labelledby="examples">
          <SectionHeading id="examples">Examples</SectionHeading>
          {examples.map((example) => (
            <ExampleBlock key={example.id} slug={page.slug} example={example} />
          ))}
        </section>
      ) : null}

      <section aria-labelledby="accessibility">
        <SectionHeading id="accessibility">Accessibility</SectionHeading>
        <div className="bui-prose">
          {page.pattern ? (
            <p>
              It follows the WAI-ARIA{" "}
              <a href={page.pattern.href} rel="noreferrer">
                {page.pattern.label}
              </a>{" "}
              pattern.
            </p>
          ) : null}
          <p>
            <InlineHtml html={page.accessibility.semanticsHtml} />
          </p>
          <p>
            <InlineHtml html={page.accessibility.labelsHtml} />
          </p>
          <p>
            <InlineHtml html={page.accessibility.focusHtml} />
          </p>
        </div>
        <h3 className="mt-8 mb-3 text-lg font-medium text-[var(--docs-heading)]">Keyboard</h3>
        <KeyboardTable rows={page.keyboard} />
      </section>

      <section aria-labelledby="api">
        <SectionHeading id="api">API Reference</SectionHeading>
        <ApiReference page={page} />
      </section>
    </DocsShell>
  )
}
