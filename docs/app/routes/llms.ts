import { llmsIndex, siteMarkdownBase } from "~/lib/markdown-copy.server.ts"

/** /llms.txt: the index of every page's Markdown, in the llms.txt format. */
export function loader() {
  return new Response(llmsIndex(siteMarkdownBase), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
