# Pilot components — Boolean UI mini-specs

**Current form contracts:** [005 — Form controls](005_form-contract.md) supersedes only the form defaults,
geometry, styling and interactions it explicitly changes below. All other contracts in this file remain in force.

Mini-specs (spec standard §1): only the rows the pilot changed from stock shadcn, for every pilot component except the
Dialog family, which has its full spec in [`001_dialog.md`](001_dialog.md). A component without a changed row is stock;
its section says so and names the tests that hold it.

**Status:** built (0.1.0) · **Base:** shadcn 4.21.1 `new-york` · radix-ui 1.6.7 · imported 2026-10-02 ·
**Consumers:** the two pilot apps, App A (with its add-on) and App B · **Deviations:** `PATCHES.md`.

Every component below has a documentation page (`pnpm docs:dev`, one example per state listed), a test file in
`tests/components/<name>.test.jsx` with axe, and a `@since 0.1.0` JSDoc tag on each export.

## AlertDialog, Sheet

Covered by `001_dialog.md`: the floating-surface tokens, the 36 px round close (Sheet), `returnFocusTo`, the height limit
under the WordPress admin bar (AlertDialog) and logical text alignment. AlertDialog keeps stock's `size`
(`default`, `sm`).

## Select

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| States: open | the list covers the trigger, aligned to the selected item (`item-aligned`) | `position="popper"` by default: below the field, at least as wide, flips above when there is no room | `PATCHES.md` §1; APG select-only combobox, Fluent; keeps the field's label visible and behaves inside dialogs and under the admin bar |
| Keyboard | Radix | unchanged: Enter, Space, ↓ and ↑ open; ↑ ↓ Home End move; Enter selects; Escape closes without a change; type-ahead | tests: arrow keys and Enter, Escape, disabled |
| Motion | stock zoom and fade | `--bui-duration-base`, `--bui-ease-enter`; the close follows the exit policy (spec standard §6.3 rule 5) | spec standard §6.3 |
| Look | a 36 px trigger on a transparent fill, a 3 px ring, a 16 px chevron; 6 × 8 px options with no chosen fill | a 35 px trigger (`sm` 28 px) on `--field`, its edge `--ring` on focus and while open, with no ring; a 14 px chevron in `--control-hover`; options 29 px, 4 px radius, 2 px apart, the focused one `--accent`, the chosen one `--highlight` | The BooleanPress look (`PATCHES.md` §4) |
| Theming: trigger edge | `border-input`, about 1.3:1 on white | `border-control`, `--control-hover` on hover. The default `--control` keeps the target's value and misses WCAG 1.4.11's 3:1; a product that needs 3:1 sets it (`PATCHES.md` §2) | WCAG 1.4.11: the edge is what shows the field |

Gallery: Basic, Groups and long list, Disabled, Invalid.

## Popover

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| API | stock | stock; there is no per-instance animation switch (App A's `disableAnimation` is gone) | `PATCHES.md` §1: motion is system-wide |
| Motion | zoom and fade at 150 ms | `--bui-duration-base`, `--bui-ease-enter`; the close follows the exit policy (spec standard §6.3 rule 5) | spec standard §6.3 |
| Look | 6 px radius, `shadow-md` | 8 px radius, a soft 8 px shadow at 5 % black; stock's 16 px padding | The BooleanPress look (`PATCHES.md` §4) |

If a large popover (the date-range calendar) looks wrong zooming in, the popover motion changes for every popover
(fade and slide, no zoom), never for one instance.

Gallery: Basic. Tests: opens and moves focus inside, Escape returns focus, no switch prop.

## Tooltip

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Timing | `TooltipProvider delayDuration={0}` | the provider's timing: 500 ms delay, no skip window; `BooleanUIProvider` renders one at the root | a zero delay strobes tooltips across a row of icon buttons (register row 14) |
| Keyboard | Radix | unchanged: opens at once on focus, Escape closes | tests |
| Look | `bg-foreground text-background`, 12 px side padding, no shadow | a dark slate label in both themes (`--foreground`; `--secondary-hover` with `--foreground` text in dark), 12 px text on an 18 px line, 6 × 10 px padding, 6 px radius, `shadow-md`, at most 12.5 rem wide | The BooleanPress look (`PATCHES.md` §4) |

Gallery: Basic, Icon row (sweep the pointer across it).

## Tabs

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Inactive label | `text-foreground/60` (light), `text-muted-foreground` (dark) | `text-muted-foreground` in both themes | `PATCHES.md` §1: an opacity-derived colour changes with every palette; the token passes AA on the surfaces that hold the tabs (4.76:1 on the default white, 7.87:1 on the dark page) |
| List | a filled `bg-muted` bar, `w-fit` | no fill, the full width; `default` draws a 1 px `--border` line under it, `line` none | The BooleanPress underline look; the labels sit on whatever surface holds the tabs |
| Selected tab | a raised `bg-background` chip | `text-primary` over a `--primary` bar along the list's edge: 1 px in `default`, 2 px in `line`; tabs are 0.875 × 1 rem, 14 px semibold | The BooleanPress underline look |
| Panel | no padding | padded 0.75 rem 1 rem 1 rem, so its text lines up with the labels; a 1 px focus outline | Same |
| Keyboard | Radix | unchanged: ← → (mirrored in RTL), Home, End; a disabled tab is skipped | tests, including RTL from the provider's `dir` |

Built first with App A's look and changed in a later pre-release build, to prove that one release changes both apps alike.

Gallery: On the page, In a card, Line, Vertical.

## Button

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Sizes | fixed heights: `default` 36, `xs` 24, `sm` 32, `lg` 40 px; `icon` 36, `icon-xs` 24, `icon-sm` 32, `icon-lg` 40 px | heights from padding and line height: `default` 35 px (6 × 10 px, 14 px on a 21 px line, a 1 px edge), `xs` 24, `sm` 28, `lg` 42 px; `icon` 36 (every dialog and sheet close), `icon-xs` 24 (dense rows only), `icon-sm` 28, `icon-lg` 42 px square | The density of spec standard §6.2 |
| Variants | hover at 90 % or 80 % opacity; `outline` on the page fill with a shadow | each fill steps through its own hover and press tokens (`--primary-hover`, `--primary-active`, `--secondary-hover`, `--secondary-active`, `--destructive-hover`, `--destructive-active`); `outline` and `ghost` draw `--primary` text and take `--subtle` on hover | The BooleanPress look (`PATCHES.md` §4) |
| Focus, disabled, icons | a 3 px ring; 50 % opacity; 16 px icons | a 1 px outline 2 px off (`--ring`; `destructive` in `--destructive`, `secondary` in `--secondary-foreground`); 60 % opacity; 14 px icons, 8 px from the label | Spec standard §6.2 and §6.4 |

A loading button keeps its width: the product sets a `min-w-*` and swaps the label for `<Spinner/>`.

Gallery: Variants, Sizes, Icon buttons, Loading and disabled. Tests: Enter and Space, density classes, disabled,
`asChild`.

## Badge

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Variants | default, secondary, destructive, outline, ghost, link | adds `success`, `warning`, `info`; every tone is a pale tag fill with deep text of its hue (`--{tone}-tag`, `--{tone}-tag-foreground`), `destructive` included | status chips in both products; text pairs are in the contrast contract |
| Look | a pill, medium weight, 12 px icons, a 3 px ring; `default` on `--primary` | 22 px: 12 px bold on an 18 px line, a 6 px radius, 14 px icons, a 1 px focus outline 2 px off; `default` and `secondary` on `--secondary` | The BooleanPress look (`PATCHES.md` §4) |

Gallery: Variants.

## Card

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Elevation | `shadow-sm` and a border | `shadow-sm`, no border, 12 px radius | The BooleanPress look: a card lifts off the page |
| Spacing and type | `py-6`, `px-6`; title semibold, description `text-sm` | 1.125 rem padding; title 18 px medium, description 16 px muted | Same |

Gallery: Basic.

## Input, Label, Field, Separator, Skeleton

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Input | 36 px fixed, 16 px text below `md`, a transparent fill, `border-input`, a 3 px ring, 50 % opacity when disabled | 35 px from 6 × 10 px padding and a 21 px line, 14 px text at every width, a `--field` fill, the `--control` edge (`--control-hover` on hover) turning `--ring` on focus with no ring; disabled `--field-disabled` with `--field-disabled-foreground` text at full opacity; invalid an `--invalid` edge and a `--destructive-strong` placeholder | The BooleanPress look (`PATCHES.md` §4). The default `--control` keeps the target's value and misses WCAG 1.4.11's 3:1; a product that needs 3:1 sets it (`PATCHES.md` §2) |
| Label | line height 1, an 8 px gap, the inherited colour, 50 % | 14 px medium on a 21 px line in `--foreground`, a 6 px gap, 60 % when its control is disabled | Same |
| Field | 28 px between fields, 12 px inside a field, 14 px descriptions, errors in `--destructive` | 24 px between fields, 8 px inside, 12 px descriptions and errors, errors and an invalid label in `--destructive-strong` | Same |
| Skeleton | the `--accent` fill, pulsing | a `--border` block (`--foreground` at 6 % in dark), 6 px radius, a soft highlight sweeping across it every 1.2 s from the inline start | Same |

Input's invalid state is `aria-invalid` with the message tied by `aria-describedby` (Field's `FieldError` is announced,
`role="alert"`); read-only and disabled are covered by tests. Separator is stock, and decorative unless
`decorative={false}`. Skeleton shimmers on first load only (conventions), and the shimmer stops under reduced motion.

Gallery: Input States; Label Basic; Field Fieldset with errors, Horizontal; Separator Basic; Skeleton First load.

## Spinner

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Accessible name | `aria-label="Loading"` | `strings.loading` from the provider | no English inside components (register row 15) |
| Look | lucide's open loader arc, 16 px | a faint full ring and a round-capped arc, both in the current text colour, 14 px | The BooleanPress look (`PATCHES.md` §4) |

Gallery: Basic. Tests: named by the provider; English fallback.
