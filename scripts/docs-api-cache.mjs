// Parses the props of every component once, before the docs are pre-rendered, and writes them to a JSON file the pages
// read (`BUI_API_CACHE`): parsing them all on the first page can outlast the time React Router gives a page.
//
// Usage: node --disable-warning=ExperimentalWarning scripts/docs-api-cache.mjs <docs folder> <out.json>
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [docsArg, out] = process.argv.slice(2);
const docs = resolve(docsArg);
const repo = resolve(docs, '..');
// The same roots as docs/vite.config.ts: the source, or the package installed from the tarball for the verification build.
process.env.BUI_SOURCE_ROOT ??= process.env.BUI_DOCS_PACKAGE === '1' ? resolve(repo, 'node_modules/@booleanpress/ui') : repo;
process.env.BUI_EXAMPLES_ROOT ??= resolve(repo, 'examples');

const { components } = await import(pathToFileURL(join(docs, 'app/content/registry.ts')).href);
const { writeApiCache } = await import(pathToFileURL(join(docs, 'app/lib/introspect.server.ts')).href);
writeApiCache(resolve(out), components.map((c) => c.slug));
