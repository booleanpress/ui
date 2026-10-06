// Writes the documentation as Markdown into dist/docs/ for AI assistants: llms.txt (the index), guides/<slug>.md,
// components/<slug>.md and blocks/<slug>.md, for the version being built. The site serves the same pages, from the same
// code.
//
// Usage: node --disable-warning=ExperimentalWarning scripts/docs-markdown.mjs
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
process.env.BUI_SOURCE_ROOT ??= root;
process.env.BUI_EXAMPLES_ROOT ??= join(root, 'examples');

const { blocks, components, guides } = await import('../docs/app/content/registry.ts');
const { componentMarkdown, guideMarkdown, llmsIndex, packageMarkdownBase } = await import('../docs/app/lib/markdown-copy.server.ts');
const { blockMarkdown } = await import('../docs/app/lib/blocks.server.ts');

const out = join(root, 'dist', 'docs');
rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'guides'), { recursive: true });
mkdirSync(join(out, 'components'), { recursive: true });
mkdirSync(join(out, 'blocks'), { recursive: true });
writeFileSync(join(out, 'llms.txt'), llmsIndex(packageMarkdownBase));
for (const guide of guides) writeFileSync(join(out, 'guides', `${guide.slug}.md`), guideMarkdown(guide));
for (const component of components) writeFileSync(join(out, 'components', `${component.slug}.md`), componentMarkdown(component));
for (const block of blocks) writeFileSync(join(out, 'blocks', `${block.slug}.md`), blockMarkdown(block));
console.log(`[docs-markdown] dist/docs: llms.txt, ${guides.length} guides, ${components.length} components, ${blocks.length} blocks`);
