// The site's own server entry, used at build time to pre-render every page (and by `pnpm docs:dev`). The site is
// static, so every render waits for all content, lazy examples included, before the HTML is written. (With no entry of
// its own, React Router would add a bot-detection package to the library's runtime dependencies.)
import { PassThrough } from "node:stream"
import type { EntryContext } from "react-router"
import { createReadableStreamFromReadable } from "@react-router/node"
import { ServerRouter } from "react-router"
import { renderToPipeableStream } from "react-dom/server"

export const streamTimeout = 5_000

export default function handleRequest(request: Request, responseStatusCode: number, responseHeaders: Headers, routerContext: EntryContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, { status: responseStatusCode, headers: responseHeaders })
  }

  return new Promise((resolve, reject) => {
    let shellRendered = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(() => abort(), streamTimeout + 1000)

    const { pipe, abort } = renderToPipeableStream(<ServerRouter context={routerContext} url={request.url} />, {
      onAllReady() {
        shellRendered = true
        const body = new PassThrough({
          final(callback) {
            clearTimeout(timeoutId)
            timeoutId = undefined
            callback()
          },
        })
        responseHeaders.set("Content-Type", "text/html")
        pipe(body)
        resolve(new Response(createReadableStreamFromReadable(body), { headers: responseHeaders, status: responseStatusCode }))
      },
      onShellError(error: unknown) {
        reject(error)
      },
      onError(error: unknown) {
        responseStatusCode = 500
        if (shellRendered) console.error(error)
      },
    })
  })
}
