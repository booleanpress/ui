import { Link, useLoaderData, type MetaFunction } from "react-router"
import { BLOCKS } from "~/content/registry.ts"
import { SITE, canonicalLink } from "~/content/site.ts"
import { blockPage } from "~/lib/blocks.server.ts"
import { DocsShell } from "~/shell/DocsShell.tsx"
import { ExampleFrame } from "~/page/ExampleBlock.tsx"
import { PageHeader, Prose, SectionHeading } from "~/page/Prose.tsx"

export async function loader({ request }: { request: Request }) {
  // The page itself, or its data on a client-side navigation (/blocks/sign-in.data).
  const slug = new URL(request.url).pathname.replace(/\.data$/, "").split("/").filter(Boolean)[1]
  const page = await blockPage(slug)
  if (!page) throw new Response("Not found", { status: 404 })
  return page
}

export const meta: MetaFunction<typeof loader> = ({ loaderData: data, location }) =>
  data ? [{ title: `${data.title} block · ${SITE.name}` }, { name: "description", content: data.purpose }, canonicalLink(location.pathname)] : []

const link = "text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"

/**
 * A block: a whole screen, shown full width in a frame that switches between a desktop and a phone width, with its
 * code under it, then how to adapt it and the components it is built from. The page takes the width of both side
 * columns' worth of room, so the desktop frame is wide enough for a real layout.
 */
export default function BlockPage() {
  const page = useLoaderData<typeof loader>()
  return (
    <DocsShell version={page.version} neighbours={page.neighbours}>
      <div className="max-w-[744px]">
        <PageHeader eyebrow={["Blocks"]} title={page.title} lead={page.purpose} />
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm" aria-label="References">
          {page.links.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={link} rel={/^https?:/.test(item.href) ? "noreferrer" : undefined}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <section aria-labelledby="preview" className="mt-10">
        <h2 id="preview" className="sr-only">
          Preview and code
        </h2>
        <ExampleFrame slug={BLOCKS} example={page.example} widths className="mb-0" />
      </section>

      <div className="max-w-[744px]">
        <section aria-labelledby="usage">
          <SectionHeading id="usage">Usage</SectionHeading>
          <Prose html={page.usageHtml} />
        </section>

        <section aria-labelledby="built-with">
          <SectionHeading id="built-with">Built with</SectionHeading>
          <ul className="bui-inline-code flex flex-wrap gap-x-3 gap-y-1 text-base" aria-label="Components">
            {page.components.map((component) => (
              <li key={component.title}>
                {component.href ? (
                  <Link to={component.href} className={link}>
                    {component.title}
                  </Link>
                ) : (
                  component.title
                )}
              </li>
            ))}
          </ul>
          {page.peers.length ? (
            <p className="bui-inline-code mt-4 text-base">
              Also install {page.peers.map((p, i) => <code key={p}>{i ? `, ${p}` : p}</code>)}: <code>pnpm add {page.peers.join(" ")}</code>
            </p>
          ) : null}
        </section>
      </div>
    </DocsShell>
  )
}
