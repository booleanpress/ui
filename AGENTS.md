# BooleanPress UI — instructions for coding agents (Claude Code, Codex, others)

`CLAUDE.md` is a symlink to this file.

This repository is `@booleanpress/ui`: accessible React components for Tailwind CSS 4 on Radix (and Base UI where Radix
has no primitive), packaged for npm and documented at <https://ui.booleanpress.com>. Consumers, including WordPress
plugins, install a published version and pin it. A change here reaches them when they take the release.

## Rules

- **Contract first.** Read `specs/000_component-spec-standard.md` before changing or adding a component. Small changes
  need a concise contract and verification record; reserve the detailed template and API discussion for complex new
  interactions. Fixes restoring documented behaviour do not need a new full spec. Add features for a concrete consumer
  need, not catalogue parity.
- **Stock first, patches recorded.** Components come from the pinned shadcn CLI (`pnpm dlx shadcn@4.21.1 add <item>`,
  then `sed -i '' 's#from "cn"#from "@/lib/utils"#' src/components/*.tsx`; on Linux `sed -i` takes no `''`). Every
  deviation from stock carries a `// boolean-ui patch:` comment and a row in `PATCHES.md`.
- **No English inside components.** Built-in text comes from `useUiStrings()`; a new string is a new provider key with an
  English default (a minor version).
- **Tokens only.** Colours are the semantic tokens of `theme.css`; motion is the `--bui-*` tokens, set in `theme.css`, never
  per component. Ten default control-edge pairs fall below 3:1; unpressed toggle text (4.3439:1) and unmet inline
  password-rule text (4.34:1), plus attached InputGroup text (2.56:1), fall below 4.5:1 in light mode. The accessibility
  guide documents exact pairs and overrides.
  Token tests record the ten edge exceptions; the browser audit reports only the three exact text exceptions separately
  from unexpected failures. The contrast CLI stays strict for registered pairs. Do not claim all default colours meet AA.
- **Public entry points.** Examples, the docs and consumers import `@booleanpress/ui/<component>`; only the package's own
  source uses `@/…`.
- **No app names.** Nothing in this repository names an app built with the package: examples use the fictional Acme, and
  a spec counts the apps that use a component without naming them.
- **Checks.** Use `pnpm check:fast` for ordinary changes, plus checks relevant to the affected behaviour. Release
  readiness requires the full `pnpm check` gate. New states need documentation examples, keyboard contracts need tests,
  and `CHANGELOG.md` says what changed and what consumers must do.
- **Branches.** Work on a branch from `trunk`; pull requests target `trunk`. `main` holds released versions only: it
  receives `trunk` for a release and never a direct commit. Never add an AI tool's attribution to a commit or pull
  request.

## Map

- `src/components/` — one `.tsx` per component (and per extra entry: `data-table-reorder`, `tree-drag`).
  `src/provider.tsx` — `BooleanUIProvider`. `src/lib/` — `cn()` and `fillString()`, focus return, scroll focus, and
  helpers several components share (dates, segments, presence, file sizes, form reset). `src/hooks/` — internal hooks.
- `theme.css` — the token contract, motion, overlay and reduced-motion rules. `bin/bui-contrast.mjs` — the contrast check
  (`bin/contrast-core.mjs` holds its arithmetic).
- `docs/` — the documentation site (`pnpm docs:dev`, http://127.0.0.1:5180/); each page's content is a typed module in
  `docs/app/content/`. `examples/` — every live example, one file each: the preview, the code shown and a test target.
- `tests/` — Vitest, Testing Library, axe; `tests/types/` — the type tests.
- `fixture/vite`, `fixture/next`, `fixture/button-only` — consumer apps built from the packed tarball (`pnpm fixture`).
- `scripts/` — fast and release checks, runtime build, fixtures, docs generation and verification, informational
  bundle sizes and release.
- `plugin/` — the AI assistant plugin (skills and manifests); `.claude-plugin/`, `.agents/plugins/`, `.cursor-plugin/`
  and `.github/plugin/` hold its marketplace catalogs.
- `specs/` — the spec standard and one spec per component.

## Maintainers

If `MAINTAINERS.local.md` exists in this folder, read it before anything else. It is the maintainers' local file (never
committed): where the plans live, the local test sites, and how releases and pushes are ordered. `office` links to the
maintainers' private repository; in a clone without it the link is empty, and nothing in the build, the checks or the
documentation needs it.
