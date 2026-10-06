import type { GuideDoc } from "../types.ts"

export default {
  slug: "contributing",
  title: "Contributing",
  description: "Report a problem, propose a component, or send a change.",
  sections: [
    {
      id: "issues",
      title: "Issues and questions",
      markdown: `- **A bug:** open an [issue](https://github.com/booleanpress/ui/issues/new/choose) with a link to a reproduction, the browser and the package version.
- **A new component or substantial interaction:** discuss its need and public API in an issue first. A variant, prop or string needs a short contract note in the existing spec or pull request.
- **A question:** ask in [Discussions](https://github.com/booleanpress/ui/discussions).
- **A security problem:** report it privately through the repository's **Security** tab, never in a public issue.`,
    },
    {
      id: "set-up",
      title: "Set up",
      markdown: `You need Node.js 24 and pnpm 10.

\`\`\`sh
git clone https://github.com/booleanpress/ui.git
cd ui
git switch dev
pnpm install
pnpm docs:dev   # this site, at http://127.0.0.1:5180/
\`\`\`

Work on a branch from \`dev\`, and open your pull request against \`dev\`. \`main\` holds released versions only.`,
    },
    {
      id: "a-change",
      title: "Making a change",
      markdown: `1. **Record the contract.** Read \`specs/000_component-spec-standard.md\`. Keep small changes concise: need, changed API or behaviour, and verification. Use the detailed template for complex new interactions. A bug fix restoring documented behaviour needs a regression test, not another full spec.
2. **Stock first.** Components come from the shadcn/ui command-line tool at the version the repository pins. A deviation from stock carries a \`// boolean-ui patch:\` comment and a row in \`PATCHES.md\`.
3. **Examples and tests.** Each state gets an example in \`examples/<component>/\`, which is also its preview here, and each keyboard row gets a test in \`tests/components/\`.
4. **No English inside components.** Built-in text comes from the provider; a new string is a new provider key with an English default.
5. **Tokens only.** Colours come from the theme's tokens, and motion from its motion tokens.
6. **Changelog.** Add a line under \`## Unreleased\` in \`CHANGELOG.md\`: what changed, and what consumers must do.`,
    },
    {
      id: "checks",
      title: "Checks",
      markdown: `\`\`\`sh
pnpm check:fast   # lint, types and unit tests for ordinary changes
pnpm check        # full release gate
\`\`\`

Run checks relevant to the change as well: packed consumer checks for packaging changes and documentation checks for site infrastructure. Before release, the full gate must pass, including licences, build and versioned Markdown, package validation, Vite, Next.js and Button-only consumers, and the documentation build and browser audit. Review visual changes in light/dark and LTR/RTL.`,
    },
  ],
} satisfies GuideDoc
