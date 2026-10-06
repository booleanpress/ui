import { index, route, type RouteConfig } from "@react-router/dev/routes"
import { BLOCKS, blockHref, blocks, components, componentHref, exampleHref, guideHref, guides } from "./content/registry.ts"

// Every route is listed explicitly, so each one is pre-rendered and any other address reaches the "not found" page.
const path = (href: string) => href.replace(/^\//, "")

export default [
  index("routes/home.tsx"),
  route("llms.txt", "routes/llms.ts"),
  ...guides.flatMap((g) => [
    route(path(guideHref(g.slug)), "routes/guide.tsx", { id: `guide-${g.slug}` }),
    route(`${path(guideHref(g.slug))}.md`, "routes/markdown.ts", { id: `guide-md-${g.slug}` }),
  ]),
  ...blocks.flatMap((b) => [
    route(path(blockHref(b.slug)), "routes/block-page.tsx", { id: `block-${b.slug}` }),
    route(`${path(blockHref(b.slug))}.md`, "routes/block-page-markdown.ts", { id: `block-md-${b.slug}` }),
    route(path(exampleHref(BLOCKS, b.slug)), "routes/example.tsx", { id: `example-${BLOCKS}-${b.slug}` }),
  ]),
  ...components.flatMap((c) => [
    route(path(componentHref(c.slug)), "routes/component.tsx", { id: `component-${c.slug}` }),
    route(`${path(componentHref(c.slug))}.md`, "routes/markdown.ts", { id: `component-md-${c.slug}` }),
    ...c.examples.map((e) =>
      route(path(exampleHref(c.slug, e.id)), "routes/example.tsx", { id: `example-${c.slug}-${e.id}` })
    ),
  ]),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig
