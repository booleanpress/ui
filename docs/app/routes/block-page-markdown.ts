import { findBlock } from "~/content/registry.ts"
import { blockMarkdown } from "~/lib/blocks.server.ts"

/** /blocks/<slug>.md: the block as Markdown, its code included, for AI assistants and for reading as text. */
export function loader({ request }: { request: Request }) {
  const file = new URL(request.url).pathname.replace(/\.data$/, "").split("/").filter(Boolean)[1] ?? ""
  const block = findBlock(file.replace(/\.md$/, ""))
  if (!block) return new Response("Not found", { status: 404 })
  return new Response(blockMarkdown(block), { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
