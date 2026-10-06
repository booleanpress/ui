import * as React from "react"

// Every example module, loaded on demand: a component page loads only its own examples.
const modules = import.meta.glob<{ default: React.ComponentType }>("../../../examples/*/*.tsx")
const loaders = Object.fromEntries(Object.entries(modules).map(([path, load]) => [path.replace(/^.*examples\/(.+)\.tsx$/, "$1"), load]))

/**
 * One component per example, keyed "<component>/<example>": lazy, so nothing loads until it renders, until
 * `preloadExamples` puts the loaded component in its place.
 */
export const EXAMPLES: Record<string, React.ComponentType | React.LazyExoticComponent<React.ComponentType>> = Object.fromEntries(
  Object.entries(loaders).map(([key, load]) => [key, React.lazy(load)])
)

/**
 * Loads the code of the examples a pre-rendered page shows (one on an example's own page, all of a component's on its
 * page) and swaps each lazy component for the loaded one. The browser entry waits for it before hydrating, so React finds
 * each example ready and keeps the pre-rendered markup; a lazy example still loading at hydration is swapped for its
 * loading spinner until its code arrives.
 */
export async function preloadExamples(pathname: string): Promise<void> {
  const [, section, slug, id] = pathname.split("/")
  const keys = Object.keys(loaders).filter((key) =>
    section === "examples" ? key === `${slug}/${id}` : section === "components" && Boolean(slug) && key.startsWith(`${slug}/`)
  )
  await Promise.all(keys.map(async (key) => (EXAMPLES[key] = (await loaders[key]()).default)))
}
