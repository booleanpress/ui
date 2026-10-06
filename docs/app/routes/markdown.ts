import { findComponent, findGuide } from "~/content/registry.ts"
import { componentMarkdown, guideMarkdown } from "~/lib/markdown-copy.server.ts"

/** /components/<slug>.md and /docs/<slug>.md: the page as Markdown, for AI assistants and for reading as text. */
export function loader({ request }: { request: Request }) {
  const [section, file] = new URL(request.url).pathname.replace(/\.data$/, "").split("/").filter(Boolean)
  const slug = file.replace(/\.md$/, "")
  const component = section === "components" ? findComponent(slug) : undefined
  const guide = section === "docs" ? findGuide(slug) : undefined
  const body = component ? componentMarkdown(component) : guide ? guideMarkdown(guide) : null
  if (!body) return new Response("Not found", { status: 404 })
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
