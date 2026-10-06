import { reactRouter } from "@react-router/dev/vite"
import tailwindcss from "@tailwindcss/vite"
import { resolve } from "node:path"
import { defineConfig, normalizePath } from "vite"

const docs = import.meta.dirname
const repo = resolve(docs, "..")

// `pnpm docs:dev` and `pnpm docs:build` read the package's source; the verification build (`pnpm docs:verify`) sets
// BUI_DOCS_PACKAGE=1 and resolves `@booleanpress/ui/*` from the packed tarball installed beside a copy of the site, so
// the site proves the package rather than the source tree.
const fromPackage = process.env.BUI_DOCS_PACKAGE === "1"

// The build-time helpers (docs/app/lib/*.server.ts) read the components' source and the examples from here.
process.env.BUI_SOURCE_ROOT ??= fromPackage ? resolve(repo, "node_modules/@booleanpress/ui") : repo
process.env.BUI_EXAMPLES_ROOT ??= resolve(repo, "examples")

const buildDir = normalizePath(resolve(docs, "build"))
const isBuildOutput = (file: string) => {
  const path = normalizePath(file)
  return path === buildDir || path.startsWith(`${buildDir}/`)
}

const sourceAliases = [
  { find: "@booleanpress/ui/provider", replacement: resolve(repo, "src/provider.tsx") },
  { find: "@booleanpress/ui/utils", replacement: resolve(repo, "src/lib/utils.ts") },
  { find: "@booleanpress/ui/theme.css", replacement: resolve(repo, "theme.css") },
  { find: "@booleanpress/ui/package.json", replacement: resolve(repo, "package.json") },
  { find: /^@booleanpress\/ui\/(.+)$/, replacement: resolve(repo, "src/components/$1") },
  { find: /^@\/(.+)$/, replacement: resolve(repo, "src/$1") },
]

export default defineConfig({
  root: docs,
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    alias: [
      { find: /^~\/(.+)$/, replacement: resolve(docs, "app/$1") },
      // Files the package ships outside its entries (bin/contrast-core.mjs), from the source or the installed package.
      { find: /^@bui-package\/(.+)$/, replacement: `${process.env.BUI_SOURCE_ROOT}/$1` },
      ...(fromPackage ? [] : sourceAliases),
    ],
  },
  // `pnpm docs:build` writes the built site into docs/build; the dev server must not reload on it.
  // A function rather than a glob, so a Windows path (backslashes) or a folder name with glob characters still matches.
  server: { host: "127.0.0.1", port: 5180, strictPort: true, fs: { allow: [repo] }, watch: { ignored: [isBuildOutput] } },
  preview: { host: "127.0.0.1", port: 5181, strictPort: true },
})
