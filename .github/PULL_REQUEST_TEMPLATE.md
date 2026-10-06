## What changes

<!-- What the change does, for whom, and why. Link the issue: "Closes #123". -->

## Checklist

- [ ] The changed contract is recorded at the scope in `specs/000_component-spec-standard.md`; complex new interactions
      have their API and behaviour agreed.
- [ ] Every deviation from stock shadcn/ui has a `// boolean-ui patch:` comment and a row in `PATCHES.md`.
- [ ] Every new state has an example in `examples/`, and every keyboard row a test in `tests/components/`.
- [ ] `pnpm check:fast` and checks relevant to the change pass. A release also requires the full `pnpm check` gate.
- [ ] A visual change is described above, and I looked at it in light and dark and in both directions.
- [ ] `CHANGELOG.md` has a line under `## Unreleased`: what changed, and what consumers must do.
