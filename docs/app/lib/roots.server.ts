// Where the build-time helpers read from. The source build reads the repository; the verification build reads the
// package installed from the packed tarball (its shipped `src/` and `theme.css`), so the API tables prove the package.
import { resolve } from "node:path"

export interface Roots {
  /** The package root: the repository, or node_modules/@booleanpress/ui. Holds src/, theme.css and package.json. */
  pkg: string
  /** The examples folder. */
  examples: string
}

export function roots(): Roots {
  const pkg = process.env.BUI_SOURCE_ROOT
  const examples = process.env.BUI_EXAMPLES_ROOT
  if (!pkg || !examples) throw new Error("BUI_SOURCE_ROOT and BUI_EXAMPLES_ROOT are set by docs/vite.config.ts or the Markdown script")
  return { pkg: resolve(pkg), examples: resolve(examples) }
}
