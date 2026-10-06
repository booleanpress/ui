import type { Config } from "@react-router/dev/config"
import { prerenderPaths } from "./app/content/registry.ts"

// A static site: every page is pre-rendered to HTML at build time, and its data with it, so the API tables, the
// highlighted code and the Markdown are computed once and never shipped to the browser.
export default {
  appDirectory: "app",
  buildDirectory: "build",
  ssr: false,
  prerender: prerenderPaths(),
  routeDiscovery: { mode: "initial" },
} satisfies Config
