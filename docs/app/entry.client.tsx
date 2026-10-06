import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { HydratedRouter } from "react-router/dom"
import { preloadExamples } from "~/lib/examples.ts"

// React Router's default browser entry, which first loads the code of the examples the pre-rendered page shows: without
// it, each example would flash its loading spinner while its code arrives. A failed load still hydrates; the example
// then loads lazily, as on a page reached by a link.
preloadExamples(window.location.pathname)
  .catch(() => {})
  .then(() => {
    startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <HydratedRouter />
        </StrictMode>
      )
    })
  })
