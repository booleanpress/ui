# Contributing to BooleanPress UI

Thank you for helping. This file says how to set up, how a change is made, and what a pull request needs.

## Before you start

- **A bug:** open an [issue](https://github.com/booleanpress/ui/issues/new/choose) with a link to a small
  reproduction.
- **A new component or substantial interaction:** discuss the API and behaviour in an issue first. A short decision
  record is enough for a small component; complex interactions need the relevant sections of the spec template.
- **A variant, prop or string:** describe the need and contract in the existing spec or pull request.
- **A small fix** (a typo, a broken link, a failing check): a pull request is enough.

## Set up

You need Node.js 24 (`.nvmrc` and `.node-version`) and pnpm 10.

```sh
git clone https://github.com/booleanpress/ui.git
cd ui
git switch trunk
pnpm install
pnpm exec playwright install chromium
pnpm docs:dev        # the documentation site, at http://127.0.0.1:5180/
```

Stop the server with `Ctrl+C` in its terminal. The [README](README.md#develop) lists the development commands. Work on a branch from `trunk`, and open the pull request against `trunk`. `main` holds released versions only.

## How a change is made

1. **Record the contract.** Read [`specs/000_component-spec-standard.md`](specs/000_component-spec-standard.md). Keep
   small changes concise: state the need, changed API or behaviour, and verification. Use the detailed template for
   complex new interactions. A bug fix restoring an existing contract needs a regression test, not another full spec.
2. **Stock first.** Components come from the shadcn/ui CLI at the version the repository pins:

   ```sh
   pnpm dlx shadcn@4.21.1 add <item>
   sed -i '' 's#from "cn"#from "@/lib/utils"#' src/components/*.tsx
   ```

   (On Linux, `sed -i` takes no `''`.) Every deviation from stock carries a `// boolean-ui patch:` comment and a row in
   [`PATCHES.md`](PATCHES.md).
3. **No English inside components.** Text a component writes itself comes from `useUiStrings()`; a new string is a new
   key in `src/provider.tsx` with an English default, a row in the strings guide's table
   (`docs/app/content/guides/strings.ts`) and its place in the key list of `tests/provider.test.jsx`.
4. **Tokens only.** Colours are the semantic tokens of `theme.css`; motion is the `--bui-*` tokens, set in `theme.css`.
5. **Examples.** Every state in the spec has an example in `examples/<component>/<example>.tsx`. The same file is the
   live preview and the code shown on the documentation page, and a test target.
6. **Documentation.** The page's content is `docs/app/content/components/<component>.ts`; register a new page in
   `docs/app/content/registry.ts`.
7. **Tests.** Every keyboard row has a test in `tests/components/<component>.test.jsx`, with axe on every state.
8. **Changelog.** Add a line under `## Unreleased` in [`CHANGELOG.md`](CHANGELOG.md): what changed, and what consumers
   must do.

## Checks

```sh
pnpm check:fast   # lint, types and unit tests for ordinary changes
pnpm check        # full release gate
```

Run the targeted checks for the behaviour you change as well. Changes to packaging, exports or dependencies need the
packed consumer checks; documentation infrastructure changes need the documentation checks. Before a release,
`pnpm check` must pass in full: licences, package build and versioned Markdown, package validation, Vite, Next.js and
Button-only consumers, and the documentation build and browser audit, alongside the fast checks.

A change to how a component looks is reviewed by eye: open its page with `pnpm docs:dev`, in light and dark and in
both directions (⚙ → Direction), and say in the pull request what changed.

`pnpm bundle:size` reports internal entry sizes for inspection. It is informational: external dependencies and
consumer CSS are excluded, so use an actual consumer build to assess a performance regression.

## Pull requests

Keep one change per pull request, fill in the template's checklist, and link the issue. A maintainer reviews it; once
merged, it ships in the next release.

By contributing, you agree that your contribution is licensed under the [MIT licence](LICENSE) and that you follow the
[code of conduct](CODE_OF_CONDUCT.md).
