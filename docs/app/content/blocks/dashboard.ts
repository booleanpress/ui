import type { BlockDoc } from "./types.ts"

export default {
  slug: "dashboard",
  title: "Dashboard",
  purpose: "An overview screen: a sidebar, the week's statistics, a chart, a timeline of recent activity and a table of mailers.",
  usage: `The sidebar holds the product's pages and folds to its icons (Ctrl+B or ⌘B); at phone width it opens as a sheet from its trigger. Under the page header, four statistics with their change since last week, then the week's deliveries as a chart beside the latest activity, and a table of the mailers that sent them.

When you copy it, give the sidebar your product's \`sidebarStorageKey\` on the provider, feed the chart and the statistics from your reporting endpoint, and format every number and date with the provider's \`locale\` and \`timeZone\`, as the block does, so a server-rendered page reads the same after hydration.`,
  frameHeight: 900,
} satisfies BlockDoc
