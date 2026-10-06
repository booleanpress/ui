---
name: booleanpress-ui-upgrade
description: Upgrade BooleanPress UI (@booleanpress/ui) to a newer version, following the changelog's notes for every version in between. Use when updating the package or when a new version changed behaviour.
---

# Upgrade BooleanPress UI

1. **Find the versions**: the installed one (`npm ls @booleanpress/ui`) and the target (`npm view @booleanpress/ui
   version` for the latest).
2. **Read the changelog for every version after the installed one, up to the target.** Before installing, it is at
   <https://ui.booleanpress.com/docs/changelog.md>; after, in `node_modules/@booleanpress/ui/CHANGELOG.md`. Each version
   ends with a "Consumers:" note: what to change. Before 1.0.0, a minor version may change behaviour; a patch only fixes.
3. **Install the target**, pinned exactly in a product (`pnpm add -E @booleanpress/ui@<version>`), and any new peer the
   notes name (for example `recharts` for Chart).
4. **Apply each note**, oldest first: renamed props, new provider string keys (add them to the strings map, translated),
   moved storage keys, changed defaults. Search the project for each affected component's import.
5. **Check**: the project's type check, tests and build; `bui-contrast` if the theme's tokens changed; then open the
   screens that use the changed components, in both themes.

Report what changed for the project's users, version by version, as the changelog states it.
