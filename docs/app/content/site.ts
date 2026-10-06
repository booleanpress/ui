// The site's fixed facts: its name, its public addresses and the package it documents.
export const SITE = {
  name: "BooleanPress UI",
  description: "Accessible React components for Tailwind CSS 4, built on Radix.",
  url: "https://ui.booleanpress.com",
  repository: "https://github.com/booleanpress/ui",
  package: "@booleanpress/ui",
}

/** A file in the public repository, on the branch the live site is built from. */
export const sourceUrl = (path: string) => `${SITE.repository}/blob/main/${path}`

/** The edit page of a file in the public repository, on the branch contributors work on. */
export const editUrl = (path: string) => `${SITE.repository}/edit/dev/${path}`

/** The page's address for search engines: the live site's, without a trailing slash, as the site links to it. */
export const canonicalLink = (pathname: string) =>
  ({ tagName: "link", rel: "canonical", href: `${SITE.url}${pathname.replace(/\/+$/, "") || "/"}` }) as const
