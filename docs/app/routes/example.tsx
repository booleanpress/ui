import * as React from "react"
import { useLocation, type MetaFunction } from "react-router"
import wpCss from "~/docs-wp.css?url"
import { BLOCKS, findBlock, findComponent } from "~/content/registry.ts"
import { SITE } from "~/content/site.ts"
import { LiveExample } from "~/page/ExampleBlock.tsx"
import { useSettings } from "~/lib/settings.tsx"

export const meta: MetaFunction = ({ location }) => [
  { title: `${location.pathname.split("/").slice(2).join(" / ")} · ${SITE.name}` },
  { name: "description", content: SITE.description },
  { name: "robots", content: "noindex" },
]

/** Tells the page that framed this example how tall it is, so the frame fits it. */
function useReportHeight() {
  React.useEffect(() => {
    if (window.parent === window) return
    const report = () => window.parent.postMessage({ type: "bui-example-height", height: document.documentElement.scrollHeight }, "*")
    const observer = new ResizeObserver(report)
    observer.observe(document.body)
    report()
    return () => observer.disconnect()
  }, [])
}

/**
 * One example alone, for the tests and the WordPress frame. Takes the settings as a query string:
 * ?theme=dark&dir=rtl&frame=wp&strings=pseudo&exits=off&palette=indigo.
 */
export default function ExamplePage() {
  const [, , slug, id] = useLocation().pathname.split("/")
  const { settings } = useSettings()
  useReportHeight()
  const doc = findComponent(slug)
  const entry = doc?.examples.find((e) => e.id === id)
  // A block is a whole screen: it brings its own landmarks and its own h1.
  const block = slug === BLOCKS ? findBlock(id) : undefined
  // An example that positions itself against the window fills the page, uncentred and unpadded, and brings its own
  // main landmark (SidebarInset), so the page's root is a plain element. So does a block.
  const fills = Boolean(entry?.frameHeight || block)
  const layout = fills ? "min-h-screen" : "flex min-h-screen items-center justify-center p-8"
  const Root = fills ? "div" : "main"
  // The headings of the component page above an example (the component, Examples, the example's title), hidden, so a
  // heading inside the example sits at the same level here as on that page.
  const headings = (
    <>
      <h1 className="sr-only">{doc?.title ?? slug}</h1>
      <h2 className="sr-only">Examples</h2>
      <h3 className="sr-only">{entry?.title ?? id}</h3>
    </>
  )
  // An example with its own main landmark keeps the headings in a banner, so they too sit inside a landmark.
  const example = block ? (
    <LiveExample slug={slug} id={id} />
  ) : (
    <>
      {entry?.frameHeight ? <header>{headings}</header> : headings}
      <LiveExample slug={slug} id={id} />
    </>
  )
  const wp = settings.frame === "wp"

  React.useEffect(() => {
    document.documentElement.classList.toggle("bui-frame-wp", wp)
    for (const name of ["wp-admin", "wp-core-ui", "bui-frame-wp"]) document.body.classList.toggle(name, wp)
  }, [wp])

  if (wp) {
    return (
      <div>
        {/* WordPress core's admin stylesheets (GPL-2.0-or-later, docs/public/wp/), then the WordPress recipe's own. */}
        {["common", "forms", "admin-menu", "admin-bar"].map((name) => (
          <link key={name} rel="stylesheet" href={`/wp/${name}.css`} precedence="wordpress" />
        ))}
        <link rel="stylesheet" href={wpCss} precedence="recipe" />
        <div id="wpadminbar">WordPress</div>
        <div id="adminmenuback" />
        <div id="wpcontent">
          <div id="wpbody">
            <div id="wpbody-content">
              <div className="wrap">
                <Root
                  id="bui-example"
                  className={fills ? "bui-example-root" : "bui-example-root flex min-h-48 items-center justify-center p-8"}
                  data-example={`${slug}/${id}`}
                >
                  {example}
                </Root>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <Root id="bui-example" className={`bui-example-root bg-background text-foreground ${layout}`} data-example={`${slug}/${id}`}>
      {example}
    </Root>
  )
}
