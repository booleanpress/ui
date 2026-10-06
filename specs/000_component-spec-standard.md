# Boolean UI — component specification standard

**What this is:** a practical contract for component changes built on shadcn/ui, Radix and Tailwind 4. Record enough to implement and verify the change without duplicating the same evidence across documents.
**Where decisions live:** the existing component spec, an issue or the pull request. Complex components keep a dedicated `specs/NNN_<component>.md`.
**Upstream provenance:** `PATCHES.md` and source patch comments.
**Form contract:** [`005_form-contract.md`](005_form-contract.md) defines the current form defaults, including the deliberate subtle-border contrast exception.
**Detailed example:** [`001_dialog.md`](001_dialog.md).

## 1. Choose the smallest useful record

| Change | Record and verification |
| --- | --- |
| Typo, tooling maintenance or fix restoring documented behaviour | Explain the change in the pull request; add a regression test when behaviour was broken. No new component spec. |
| Upstream sync without a behaviour change | Update provenance and affected patches in `PATCHES.md`; run relevant checks. |
| Variant, prop or string | A short note in the existing spec or pull request: need, API/defaults, affected states and compatibility, and how it is verified. |
| Simple new component or composition | Agree the need and public API in its issue; document purpose, API, applicable states, accessibility and tests. |
| Complex new interaction or substantial behaviour change | Agree the contract in its issue, using the relevant sections of §3 for state, keyboard, focus, async and host behaviour. |

Do not fill unrelated tables or create duplicate approval sheets. A maintenance fix within an agreed contract does not need a separate API approval. Resolve new API and visual decisions before building them.

## 2. Implementation workflow

1. **Establish the need.** Start with a concrete consumer requirement or a reproduced defect. Keep consumer names and call sites in the maintainers' records. There is no minimum consumer count; another library's catalogue alone is not a reason to add an API.
2. **Check the contract.** Read the existing spec, stock shadcn source and applicable primitive or WAI-ARIA APG guidance. Use design references for relevant states and interactions, not an obligation to copy every feature.
3. **Record what changes.** Choose the scope of record from §1. Keep existing decisions intact and describe compatibility or migration when it matters.
4. **Build and document.** Use the pinned shadcn CLI for stock source. Preserve upstream provenance and explain deviations in `PATCHES.md` and `// boolean-ui patch:` comments. Add examples for new public states and tests for changed keyboard or state logic.
5. **Verify.** Run `pnpm check:fast` and checks relevant to the change. Review visual changes in the docs in light/dark and LTR/RTL. The full `pnpm check` gate runs before release.
6. **Release.** Record consumer-facing changes in `CHANGELOG.md`; version according to §8. Consumers pin and adopt the published version independently.

## 3. The template

Use the relevant sections below for a complex component. Omit sections that do not apply; a short change does not need this whole template.

````markdown
# <Component> — Boolean UI spec

| | |
| --- | --- |
| **Status** | draft · approved · built (version) |
| **Need** | the concrete consumer requirement or defect; never app names |
| **Base** | shadcn `<style>/<item>` as of <date> · Radix `<Primitive>` (radix-ui <version>) |
| **Pattern** | WAI-ARIA APG: <pattern + URL> |
| **Completeness references** | Base UI <URL> · React Aria <URL> |

## Purpose and non-goals
One paragraph: what the component is for. A bulleted list of what it deliberately does not do.

## Anatomy
Parts and slots, each with its `data-slot` name, and which parts are optional.

## API
| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
Controlled and uncontrolled forms; `className` on every part as the escape hatch; the ref target. Only props with a consumer.

## Variants and sizes
Only those a consumer uses. For each: the visual difference and the token(s) it uses.

## States matrix
| State | Visual | Attributes / ARIA | Gallery story | Test |
| --- | --- | --- | --- | --- |
| default | | | | |
| hover | | | | |
| focus-visible | | | | |
| active / pressed | | | | |
| open / expanded | | | | |
| selected / checked / indeterminate | | | | |
| disabled | | | | |
| read-only | | | | |
| invalid | | `aria-invalid`, error message id | | |
| loading / busy | | `aria-busy` | | |
| empty | | | | |
| error | | | | |
Delete the rows that cannot apply, with the reason.

## Keyboard
| Key | Behaviour | Source (APG section) |
| --- | --- | --- |

## Focus
Initial focus · trap (yes/no) · where focus returns, including when the trigger no longer exists · focus ring · not hidden behind the WordPress admin bar or sticky headers.

## Accessibility
Role · accessible name source · description · live announcements · minimum target 24 × 24 px · contrast of every text and non-text state (4.5:1 text, 3:1 boundaries and focus) · zoom 200 % and 400 % · screen-reader notes.

## Content, i18n and RTL
Every built-in string, with its `BooleanUIProvider` key and English default · long text (wrap or truncate, and where the full text is available) · RTL: logical properties, which icons mirror · who formats numbers and dates (the product, never the component).

## Motion
Which motion tokens (§6.3) for enter, exit and state changes · what moves (opacity, transform) · reduced-motion behaviour.

## Responsive and density
Behaviour below 640 px and at WordPress admin's 782 px breakpoint · minimum and maximum widths · touch targets.

## Theming
Tokens used · dark-mode notes · nothing outside the token contract.

## Host (WordPress admin)
Portal target · stacking (`z-50`; WordPress chrome lowered by the product) · admin CSS that could leak in · scroll lock alongside the admin bar.

## Edge cases
A list. Always consider: very long labels and translations · 0, 1 and 1,000 items · nested overlays · rapid open/close · unmount while open · async content arriving late · the triggering row being deleted · a slow network · double submit.

## Tests
Behaviour tests (one per keyboard row and per state with logic) · axe on every documentation example · any product-level check the consumers need.

## Migration
For an app that uses it today: what changes visibly, and what changes in code.

## Decisions
Plain-words questions for the owner, each with options and a recommendation.
````

## 4. Component classes and their mandatory states

| Class | Examples | States that must be specified |
| --- | --- | --- |
| Action | Button, Toggle, icon button | default, hover, focus-visible, active, disabled, loading (button keeps its width; spinner inside) |
| Text input | Input, Textarea, PasswordInput, InputGroup | default, hover, focus-visible, disabled, read-only, invalid (with message), placeholder, filled, autofill |
| Choice | Checkbox, Radio, Switch, Select, Combobox, MultiSelect | the action/input states, plus checked, indeterminate (checkbox), open, selected option, no options, no search results |
| Overlay | Dialog, AlertDialog, Sheet, Popover, Dropdown, Tooltip | closed, opening, open, nested overlay open, closing, content longer than the viewport |
| Data display | Table, Card, Badge, Stat, Empty | default, empty, loading (first load only), refreshing (rows stay, dimmed), error with retry, very long content |
| Feedback | Alert, Toast, Progress, Skeleton, Spinner | each tone (info, success, warning, destructive), dismissible, with action, stacked toasts, determinate and indeterminate progress |

## 5. References

**The goal is professional completeness and a consistent, polished look.**

- **Behaviour:** the WAI-ARIA Authoring Practices are the source of truth, with the Radix, Base UI and React Aria docs beside them.
- **Completeness and look:** the docs and live demos of mature component libraries, read as checklists of states, options and keyboard behaviour, and the maintainers' design references and samples.
- **Source:** stock shadcn through its pinned CLI, with its notice in `NOTICE` and every deviation in `PATCHES.md`.
- **In the spec:** the target is described in words, tokens and states, with links to public references. Design samples and screenshots stay with the maintainers.

## 6. Quality bars (every component)

### 6.1 Accessibility

- WCAG 2.2 AA is the acceptance target; WAI-ARIA APG is the interaction guide; native semantics before ARIA. For example, a table with links and checkboxes stays a `<table>`; a `grid` keyboard model is added only when a spec justifies it and tests it fully.
- 24 × 24 px minimum target (2.5.8). A focus ring is visible on every interactive part and never hidden behind the WordPress admin bar (2.4.11).
- Zero serious or critical axe findings in every documentation example. Automated checks support the manual keyboard and screen-reader pass in the spec's *Tests*; they do not replace it.
- No interactive element nested inside another, such as a `role="button"` span inside a `<button>`.

### 6.2 Density and shape

The package's look: slate greys, a near-black primary, 14 px text. The values are tokens in `theme.css` and classes in
each component:

- **Type sizes:** body text `text-sm/normal` (14 px on a 21 px line); form fields use `text-sm` (14 px on a 20 px line),
  meta `text-xs` (12 px), block title
  `text-lg` (18 px: medium on cards and empty states, semibold on dialogs and sheets); a figure may use `text-2xl`. Use
  `tabular-nums` for numbers in tables and stats. On a touch screen every field's text is 16 px
  (`--bui-field-text-touch`), so Safari does not zoom into it: `theme.css` sets it on any text field, select or segment
  that carries a `data-slot`, and a single-line field keeps the line of the `data-size` on itself or on its group, so a
  new field needs both.
- **Controls:** buttons remain 35 px tall, small 28 px and large 42 px. Single-line form fields are 34 px tall
  (6 px × 10 px padding, a 1 px edge), small 26 px and large 42 px; see [the form contract](005_form-contract.md). Icon-only buttons are square: 36 px, small 28 px, large 42 px, never smaller than 24 px. Checkboxes and radios
  are 18 px.
- **Radii:** 4 px for small parts (checkboxes, list options, menu items), 6 px for controls and menus, 8 px for popovers,
  12 px for dialogs and cards; `rounded-full` for round parts. Always from the token scale (`rounded-sm … xl`, `full`).
- **Spacing:** the 4 px Tailwind grid, `gap-*` over `space-*`; icons in controls are 14 px, 8 px from their label.
- **Surfaces:** cards carry a faint shadow (`shadow-sm`); menus, selects, tooltips and toasts a medium one (`shadow-md`);
  popovers a soft 8 px one; dialogs and sheets a large one (`shadow-xl`). Form fields have a 1 px edge and the faintest
  shadow (`shadow-xs`).

### 6.3 Motion standard

Admin tools use *productive* motion: short, subtle, task-focused (IBM Carbon's term). The values follow Carbon, Material 3 and Nielsen Norman Group, and sit inside shadcn's own defaults (tw-animate-css: 150 ms; accordion 200 ms). They are tokens in the package's `theme.css`:

| Token | Value | Used for | Industry basis |
| --- | --- | --- | --- |
| `--bui-duration-fast` | 100 ms | overlays' fade under reduced motion | NN/g ≈100 ms for simple feedback; M3 `short2` |
| `--bui-duration-base` | 150 ms | popover, dropdown, select, tooltip enter | tw-animate-css default; M3 `short3`; Carbon `moderate-01` |
| `--bui-duration-slow` | 200 ms | dialog, sheet, collapsible enter | NN/g 200–300 ms for modals; M3 `short4` |
| `--bui-duration-exit` | 100 ms | every exit (shorter than its enter) | NN/g, M3: exits are faster than entrances |
| `--bui-duration-control` | 200 ms | hover, press, focus and checked colour changes of controls, and the switch's knob | the visual target's measured fade (spec 003, Checkbox mini-spec); M3 `short4` |
| `--bui-ease-enter` | `cubic-bezier(0, 0, 0.38, 0.9)` | things appearing | Carbon productive entrance |
| `--bui-ease-exit` | `cubic-bezier(0.2, 0, 1, 0.9)` | things leaving | Carbon productive exit |
| `--bui-ease-standard` | `cubic-bezier(0.2, 0, 0.38, 0.9)` | in-place changes | Carbon productive standard |

Rules:

1. **Animate only opacity, transform and colour.** Overlays fade, with a 95 % → 100 % zoom or an 8 px slide from their side, as shadcn does. A control's fill, edge, text, outline and shadow colours change over `--bui-duration-control` on hover, press, focus and check, and the switch's knob slides over it. Never animate width, height or top/left; the collapsible's height uses Radix's measured CSS variable. The one exception is stock's: the Sidebar collapses by changing its width over 200 ms. The colour transitions copy the visual target and are open for the owner's confirmation (spec 003, Checkbox, *For the owner's decision* 2).
2. **Nothing exceeds 300 ms.** "At 500 ms animations start to feel like a drag" (NN/g).
3. **Never animate:** page wrappers, route changes, cards, table rows, or a refetch. A refresh dims (`opacity-60`) and never re-animates (conventions §8).
4. **Reduced motion** (`prefers-reduced-motion: reduce`): remove every zoom and slide; keep opacity fades at no more than `--bui-duration-fast`. WCAG 2.3.3 is AAA; we meet it anyway.
5. **Exit animations — on: a 100 ms opacity fade that holds its last keyframe.** Every closing overlay fades out over `--bui-duration-exit` with `--bui-ease-exit`, opacity only, and keeps its final keyframe (`animation-fill-mode: forwards`) until it is removed. The hold is what makes the exit safe. Without it, the element returns to full opacity in the frame between the end of its animation and its removal, and that frame is painted. That was the one-frame flash that had kept exits off in the products. Measured with a maintainer diagnostic on the real admin screen in Chrome, Firefox and WebKit, 20 closes per overlay: the fade without the hold repaints on every close in all three engines; with the hold, none does (`PATCHES.md` §3). `<html data-bui-exits="off">` closes overlays at once, for comparison. Re-film after an upgrade of Radix, tw-animate-css or Tailwind, and whenever a closing overlay is reported to flash.
6. **Loading motion:** a spinner in a button keeps the button's width. Skeletons appear on the first load only. Shimmer is off under reduced motion.

### 6.4 Professional-finish checklist

This is what makes a suite *feel* professional. Use these when reviewing affected states; do not duplicate the checklist for an unrelated fix.

- [ ] Every interactive state from §4 is visibly distinct, and hover feedback starts at once and settles within `--bui-duration-control`.
- [ ] No layout shift when a state changes: loading buttons keep their width, error messages reserve space or push content predictably, and opening an overlay does not move the page.
- [ ] Icons are 14 px, optically centred on the text line, with consistent gaps (`gap-2` in controls).
- [ ] Long text has a rule: it wraps, or it truncates with the full text reachable (tooltip or detail view).
- [ ] Empty and error states say what happened and offer the next action.
- [ ] Disabled controls stay readable, and say why when the reason is not obvious (tooltip or description).
- [ ] Focus is the same on every component: a 1 px outline 2 px away from the part, in `--ring` (`--sidebar-ring` in the
      sidebar; a destructive or secondary button outlines in its own colour). Text fields show focus by turning their edge
      `--ring` instead; a tab draws its outline 1 px inside itself; menu items and list options show it with the `--accent`
      fill.
- [ ] Dark mode is checked story by story, not assumed.
- [ ] Copy is sentence case, with no uppercase or letter-spaced labels (conventions §4).
- [ ] Numbers in tables and stats use `tabular-nums`; units and dates come pre-formatted by the product.

### 6.5 i18n and RTL

- **Components contain no English of their own.** Every built-in string is a key in `BooleanUIProvider`'s `strings` with an English default. Each product passes its translated map once at the root, using its own translation function and text domain.
- Use logical properties (`ms-*`, `pe-*`, `start-*`, `end-*`); directional icons (chevrons, arrows) mirror under `dir="rtl"`. The provider takes `dir` from the product.

### 6.6 Performance

- No new runtime dependency without the owner's approval. Heavy dependencies (charts, calendar, command palette, toasts) live behind their own entry point, so a product that does not import them does not ship them.
- No re-render on hover for components that do not need it; memoise context values.

## 7. Definition of done

- [ ] The changed contract is recorded at the scope in §1, with API decisions resolved.
- [ ] New public states have documentation examples; changed visuals are reviewed in light/dark and LTR/RTL. Check long translations, reduced motion and host layouts where affected.
- [ ] Changed keyboard and state logic have tests; relevant accessibility checks pass.
- [ ] `pnpm check:fast` and affected integration checks pass. The full `pnpm check` gate passes before release.
- [ ] `PATCHES.md` lists provenance (shadcn item, date, Radix version) and every deviation from stock with its reason; each deviation carries a `// boolean-ui patch:` comment in the source.
- [ ] JSDoc summary and `@since <package version>` on every export.
- [ ] `CHANGELOG.md` entry stating what changed, why, and what consumers must do.
- [ ] Migration instructions identify consumer work. Adoption and host-level checks happen in each consumer repository; a library release does not require every consumer to upgrade together.

## 8. Versioning

| Change | Version bump |
| --- | --- |
| Fix, no API change | patch (0.1.0 → 0.1.1) |
| New component, variant, optional prop, or string key (with an English default) | minor (0.2.x → 0.3.0) |
| Removed or renamed prop, token, part or component | major (after 1.0.0); before 1.0.0, a minor with a migration note |

A renamed prop keeps the old name for one minor release with a development-only console warning. Products pin exact versions and upgrade deliberately; a package release never reaches a product by itself.

## 9. Where this standard came from

This standard keeps the useful core of the design discussion that started the package:

- its 20-point component contract, condensed into the template (§3) and the definition of done (§7);
- its visual-implementation process, condensed into §2;
- its approach to references (§5).

The process scales to the change. Automated checks cover repeatable contracts; manual review covers visual intent, assistive technology and the real host screen.
