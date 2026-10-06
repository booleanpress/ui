# PATCHES — every deviation from stock shadcn/ui

**Stock** is what `pnpm dlx shadcn@4.21.1 add <item>` writes into a project configured like this repository's
`components.json` (style `new-york`, TypeScript, React Server Components on, right-to-left on, aliases `@/components`,
`@/lib/utils`), with radix-ui 1.6.7 and lucide-react 0.577.0, after the CLI's known `from "cn"` import is corrected to
`@/lib/utils`. Right-to-left on (`"rtl": true`, the same transform as `shadcn migrate rtl`) means logical classes
(`ms-*`, `ps-*`, `start-*`, `text-start`) in place of physical ones, and `rtl:` variants for directional icons and
offsets.

The 16 pilot components were imported as JSX on 2026-10-02 and converted to TypeScript on 2026-10-03: each kept its
source and took stock's parameter types. The other 27 came from the stock TypeScript the CLI writes, with the pilot apps'
deviations applied by hand. The right-to-left transform covers all 42 stock components. A code-only diff against stock
leaves exactly the rows below and the look of §4. Every row arrived in 0.1.0, the first public release.

Every deviation carries a `// boolean-ui patch:` comment in the source. A stock upgrade (`pnpm dlx shadcn@<version> add
<item> --overwrite` here, never in an app) is followed by re-applying the rows below and a diff against this file.

## 1. Register: what the pilot apps carried before the package

Found on 2026-10-02 (rows 1–15) and 2026-10-03 (rows 16–17, when the remaining components moved) by diffing the copies
the two pilot apps, App A and App B, carried in their `components/ui/*` against stock. Decisions: **keep** the
deviation in the package, **drop** it (back to stock), **converge** the two apps on one behaviour, **fix** a stock
defect, **restyle** it as part of the package's look (§4). Rows 1–5 and 11–12 were settled against public design systems (WAI-ARIA APG, Fluent 2, Primer,
Carbon); the row says which behaviour won.

| # | Component | Deviation from stock, per app | Marked in the app? | Decision | In the package |
| --- | --- | --- | --- | --- | --- |
| 1 | Dialog | The × close button. App A: the stock bare 16 px icon. App B: a hand-sized 24 × 24 px box (`top-3 right-3 size-6`). | App B only (`Project patch`) | converge | The system's ghost icon button, `Button variant="ghost" size="icon"`: 36 × 36 px, round, `--muted-foreground` with a 14 px icon, at `top-4.5 end-4.5`, named from `strings.close` — 0.1.0 |
| 2 | Sheet | The × close button, as row 1. | App B only | converge | The same 36 px round icon button, at `top-4.5 end-4.5` — 0.1.0 |
| 3 | Popover | App A: a `disableAnimation` prop (added 2026-09-17 for the date-range picker's large calendar). App B: stock. | no | drop | Popover's stock API, with no animation switch. Motion is set once, in `theme.css`; the date-range picker loses the prop — 0.1.0 |
| 4 | Select | `SelectContent` default `position`. App A: `"popper"` (below the field). App B: stock `"item-aligned"` (the list covers the field). | no | converge | `"popper"`: below the field, flipping above when there is no room, at least as wide as the field — 0.1.0 |
| 5 | Tabs | Inactive label colour. App A: stock `text-foreground/60`, `dark:text-muted-foreground`. App B: `text-muted-foreground`. | no | converge | `text-muted-foreground` in both themes, on whatever surface holds the tabs (the list has no fill, row 11): 4.76:1 on the default white, 7.87:1 on the default dark page — 0.1.0 |
| 6 | Badge | `success`, `warning`, `info` variants on the status tokens (both apps). | yes (`Project variants`) | keep | The three variants, on the status tag tokens (`--{tone}-tag`, `--{tone}-tag-foreground`). — 0.1.0 |
| 7 | Alert | `success`, `warning`, `info` variants on the status tokens (both apps). | yes (`Project variants`) | keep | The three variants, each a subtle fill, an edge and strong text of its hue (`--{tone}-subtle`, `--{tone}-border`, `--{tone}-strong`). — 0.1.0 |
| 8 | Card | Flat: no `shadow-sm`; blocks separate from the page by their border (both apps). | yes (`Project patch`) | restyle | Raised: `shadow-sm`, no border, a 12 px radius — 0.1.0 (§4) |
| 9 | Progress | Forwards `value` to the Radix root, so it emits `aria-valuenow` and `data-state` (both apps). | yes (`Project patch`) | keep | Same — 0.1.0 |
| 10 | Sonner | Reads the app's theme provider instead of `next-themes`; `richColors`, `closeButton`, 4 s duration, 3 visible toasts, 0.75 rem radius, `min(24rem, 100vw − 2rem)` width, close-button offsets and toast class names (both apps). | the import line only | keep | The same behaviour (`richColors`, `closeButton`, 4 s, 3 visible toasts), with the theme a `theme` prop (default `"system"`) rather than an app import — 0.1.0. The shape follows the look: a 6 px radius, `min(18.75rem, 100vw − 2rem)` wide, the close button inside the top corner at the inline end — 0.1.0 (§4). §2 has what the package adds. |
| 11 | Tabs | List fill `bg-border dark:bg-muted` instead of stock `bg-muted` (both apps). `--border` is a line colour, never tuned for text on top of it: the inactive labels measured 4.25–4.86:1 on it. | no | restyle | No list fill: an underlined row across the full width, with a 1 px `--border` line under it in `variant="default"` — 0.1.0 (§4) |
| 12 | Tabs | Selected tab `data-[state=active]:bg-card` instead of stock `bg-background` (both apps). App A's page background is grey (`--background`, lightness 0.963) and darker than `--muted` (0.97), so stock would draw the selected tab darker than the list around it. | no | restyle | No chip: the selected tab is `--primary` text over a `--primary` bar along the list's edge, 1 px in `default`, 2 px in `line` — 0.1.0 (§4) |
| 13 | Sidebar | Stock writes the collapsed state to a cookie `sidebar_state` on path `/`, shared by every app on the site; App A also reads it back at start (`getSidebarInitialState`) and defaults to collapsed. | App A's read-back: no | fix | Local storage under the provider's `sidebarStorageKey` (one per app), read at start; the server and the first hydrated render use `defaultOpen`. The default stays stock's (`true`); an app that starts collapsed passes `defaultOpen={false}` — 0.1.0 |
| 14 | Sidebar | Stock nests a `TooltipProvider delayDuration={0}`, so a sweep across the collapsed rail strobes tooltips (App A's sidebar wraps it again with 500 ms to hide this). | no (stock) | fix | No nested provider, so the provider's timing applies — 0.1.0 |
| 15 | Six primitives | 12 hard-coded English strings: `Close` ×3 (dialog ×2, sheet), `Previous`, `Next`, `Go to previous page`, `Go to next page`, `More pages` (pagination), `Loading` (spinner), `Toggle Sidebar` ×3, `Sidebar`, `Displays the mobile sidebar.` (sidebar), `Command Palette`, `Search for a command to run...` (command). | no (stock) | fix | `BooleanUIProvider` `strings` with English defaults: dialog, sheet, spinner, pagination, sidebar and command, with the further keys in §2 |
| 16 | Table | A selected row (`data-state="selected"`) is tinted `bg-primary/10` (stock: `bg-muted`, the colour of a hovered row), so a selection reads as one (both apps). | no | keep | A selected row differs from a hovered one: `--highlight` with `--highlight-foreground` text, against the `--accent` hover. — 0.1.0 |
| 17 | Item | `ItemGroup` without stock's `role="list"`: its `Item` children have no `role="listitem"`, so the list was an accessibility error (App A). | no | fix | Same — 0.1.0 |

Not deviations: the package keeps stock's `"use client"` directives (the built files keep them too, for React Server
Components); `password-input` is App A's composition, not a patched primitive (spec 003); and the internal
`src/lib/scroll-focus.tsx` is the package's own. Checkbox came from App A's copy on 2026-10-03 and was identical to
stock; so were the other components the register does not name.

## 2. Deviations the package adds, by spec

| Component | Deviation from stock | Source | Since |
| --- | --- | --- | --- |
| Dialog, AlertDialog, Sheet | The panel uses the floating-surface tokens, `bg-popover text-popover-foreground` (stock `bg-background`): the same surface as menus and popovers, white in an app whose page colour is grey, and readable in the dark theme when portalled outside the app root. | spec 001, Theming | 0.1.0 |
| Dialog, AlertDialog | Centred in the area below the WordPress admin bar, at most `100dvh − admin bar − 2rem` tall; Dialog is a flex column and its new `DialogBody` part scrolls while the header and footer stay visible. | spec 001, States (taller than the viewport) | 0.1.0 |
| Dialog | `size`: `sm` 384, `md` 512 (stock's `sm:max-w-lg`), `lg` 672 px. | spec 001, API | 0.1.0 |
| Dialog, AlertDialog, Sheet | Focus never falls to `<body>` on close: back to the element that had focus when the overlay opened when there is no trigger (a dialog opened from code), and to `returnFocusTo` when that element is gone too. | spec 001, Focus | 0.1.0 |
| Dialog, AlertDialog | Header aligned with `text-start` (stock `text-left`), for RTL; Dialog and Sheet headers keep room for the ×. | spec 001, i18n and RTL | 0.1.0 |
| Spinner | `aria-label` from `strings.loading`. | register row 15 | 0.1.0 |
| Tooltip | `TooltipProvider` defaults to the provider's timing (500 ms, no skip window) instead of 0 ms; `BooleanUIProvider` renders one at the root. | register row 14 | 0.1.0 |
| Spinner | `"use client"` (stock has none): it reads its name from the provider, which needs the client. | register row 15 | 0.1.0 |
| Checkbox | The mixed state (`checked="indeterminate"`) shows a dash (stock: the check mark), in `--foreground` on the unfilled box. | spec 003, Checkbox | 0.1.0 |
| Pagination, Breadcrumb, Command, Sidebar, Sonner, PasswordInput | Their built-in text comes from the provider. New keys: `pagination` (the landmark), `breadcrumb` and `more` (Breadcrumb), `suggestions` (Command's list), `showPassword`, `notifications` and `closeNotification` (the toast region and its close button). Pagination and Breadcrumb gain `"use client"`, which reading the provider needs. | register row 15; spec 003 | 0.1.0 |
| Pagination, Breadcrumb | Their chevrons turn round in right-to-left (`rtl:rotate-180`), the manual step of shadcn's RTL guide. | spec 003 | 0.1.0 |
| Command | `CommandDialog`'s hidden title and description sit inside the dialog they name (stock renders them in the page, outside the dialog, even while it is closed), and its search field is named by the title. `CommandSeparator` is `aria-hidden`: a listbox may hold only groups and options. | spec 003, Command | 0.1.0 |
| Calendar | DayPicker takes the provider's `dir`, so the arrow keys follow the reading direction. | spec 003, Calendar | 0.1.0 |
| Sheet | The panel slides in from the edge it sits on in either direction (`slide-in-from-start`/`-end`; stock, after the RTL transform, places `side="right"` at the inline end but still slides it from the physical right). | spec 003 | 0.1.0 |
| Sidebar | A menu button's tooltip stays closed unless the sidebar is collapsed to its icons on a wide window (stock only hides it, so it still opens on focus and takes the first Escape meant for the phone-width panel). | spec 003, Sidebar | 0.1.0 |
| Sidebar (`use-mobile`) | The window-width hook reads through `useSyncExternalStore` (stock sets state inside an effect, which renders twice on mount); it is `false` on the server and during hydration, as stock's is. | spec 003, Sidebar | 0.1.0 |
| Sonner | The status toasts take their colours from the status tokens, as Alert's variants do (stock leaves rich colours to sonner's palette): the subtle fill, the status edge, the title and icon in the strong colour; the direction and the names of the region and of the close button come from the provider; the close button sits inside the top corner at the inline end in both directions. | spec 003, Toast | 0.1.0 |
| ScrollArea, Table | A box that scrolls content with nothing focusable in it takes keyboard focus, so the arrow keys can scroll it (WCAG 2.1.1); otherwise it stays out of the tab order. | spec 003 | 0.1.0 |
| InputGroup | A click on an addon focuses the group's textarea as well as an input (stock looks for an input only). | spec 003, Input group | 0.1.0 |
| Checkbox, RadioGroup, Switch, Input, Textarea, Select, NativeSelect, InputGroup, ButtonGroupText | A control's edge (Switch: its off track) is the `--control` token, `--control-hover` on hover (stock: `--input`, about 1.3:1 on white). `theme.css` keeps `--input` at `--control`'s value, under the name earlier releases used; no component reads it. The default form palette uses subtle edges that do not meet 3:1 against every surface; the CLI still measures the unchanged WCAG threshold. See spec 005 for tokens and the explicit contrast exception. | spec 003, Theming | 0.1.0 |
| Kbd | A key's label takes its direction from its own first letter (`unicode-bidi: plaintext`), and a group's keys keep their order (`rtl:flex-row-reverse`), so a shortcut reads as written on a right-to-left page (stock shows "⌘K" as "K⌘" and Ctrl + K as K + Ctrl). | spec 003, Kbd | 0.1.0 |
| Chart | The chart draws once the page is hydrated; the server renders its box only (stock renders Recharts on the server, whose output differs from the browser's first render, so React discards the server HTML with a hydration error). | spec 003, Chart | 0.1.0 |

`theme.css` (not component source) carries the motion tokens, the exit policy, the reduced-motion rules and the
WordPress resets for portalled overlays that each pilot app's `index.css` used to carry, and the slate defaults and the
tokens the look of §4 reads.

## 3. Exit animation film

**Decision: exits on**, as a 100 ms opacity fade that holds its last keyframe until the overlay is removed (0.1.0).

Filmed with a maintainer diagnostic on a real plugin admin screen (a local WordPress site, the
0.1.0 build), 2026-10-03, in Chrome, Firefox and WebKit (Playwright 1.63, the engine of Safari), closing a Select (rows
per page), a Dropdown (a column chooser), a Popover (a date range) and a Dialog (a test form) with Escape. Each close is measured twice:

- **in the DOM:** the overlay's computed opacity, read once per frame until it is removed. Deterministic in every
  engine, and the measurement the decision rests on;
- **on screen:** Playwright's screencast. A positive control (a copy of the overlay painted again for two frames after
  each close) is caught in 47 of 48 closes in Chrome, 21 of 48 in Firefox and 27 of 48 in WebKit: Chrome's capture is
  complete, the other two skip frames.

A repaint is a rise of 0.3 or more after the overlay had faded at least halfway.

| Exit | Closes per browser | Repainted in the DOM — Chrome / Firefox / WebKit | Repainted on screen — Chrome / Firefox / WebKit |
| --- | ---: | --- | --- |
| 100 ms fade, no hold (`EXITS=nohold`) | 48 | **48 / 48 / 48** | 37 / 10 / 27 |
| 100 ms fade holding its last keyframe (shipped, `EXITS=on`) | 80 | **0 / 0 / 0** | 0 / 9 / 0 |
| Instant (`EXITS=off`, Firefox only) | 80 | 0 | 4 |

- **The cause of the flash** first seen in a pilot app's menus: tw-animate-css runs its exit with `animation-fill-mode: none`. When the
  fade ends, the overlay returns to full opacity for the frame between the end of the animation and Radix's removal of the
  element, and that frame is painted. Read frame by frame on a Quick Test dialog: opacity 0.92, 0.78, 0.62, 0.44, 0.25,
  then **1.00**, then removed. The same in all three engines, and in the gallery without WordPress.
- **The fix:** `--tw-animation-fill-mode: forwards` on closing overlays (`theme.css`), so the final keyframe (opacity 0)
  stays until removal: 0.92 … 0.25, 0.00, removed.
- **Firefox's on-screen flags are capture noise.** Its screencast tears frames (one flagged frame shows a band of
  backdrop across part of the page) and delivers them out of order (the dialog fully gone in one frame and back at 35 %
  in the next, while the DOM reads a steady 0.72, 0.55, 0.37). It flags closes just as often with exits off, when nothing
  animates (4 of 80).
- **The Dialog's on-screen count understates the no-hold flash:** the panel fades over a dark backdrop, so its box never
  reads as mostly gone before the snap-back. The DOM count is exact.

Recheck closing overlays after an upgrade of Radix, tw-animate-css or Tailwind, and whenever a closing overlay is
reported to flash. Reproduce in the documentation first, then in the affected host screen. The site-specific recording
tool and its setup belong to the maintainers' private tools; they are not required to build or use the package.

## 4. The BooleanPress look

Every component's classes are restyled to one look, copied from the maintainers' visual target and drawn with
`theme.css`'s tokens: slate greys with a near-black primary, 14 px body text on a 21 px line, 35 px buttons, 34 px text fields on a 20 px line,
36 px icon buttons, 18 px checkboxes and radios, and a 1 px focus outline 2 px from the part (a text field turns its
edge `--ring` instead). Radii come from `--radius` (0.5 rem): 4 px on small parts (checkboxes, options, menu items), 6 px
on controls and menus, 8 px on popovers, 12 px on dialogs and cards. A control's hover, press, focus and checked colours
change over `--bui-duration-control` (200 ms). Each restyled class list carries a `// boolean-ui patch:` comment that
names stock's values; `CHANGELOG.md` lists the tokens the look adds. Collapsible (it draws nothing) and Separator (a
1 px `--border` line) keep stock's classes.

| Component | Size and shape | Colours | Focus | Since |
| --- | --- | --- | --- | --- |
| Alert | 6 px radius, 1 px edge, 6 × 10 px padding, a 16 px icon 8 px from the text, a faint shadow of the variant's hue | `default`: `--secondary` fill, `--border` edge, `--secondary-foreground` text; each tone: `--{tone}-subtle` fill, `--{tone}-border` edge, `--{tone}-strong` text and icon | not focusable | 0.1.0 |
| Alert dialog | 12 px radius, 1 px edge, 18 px padding and gap, `shadow-xl`; title 18 px semibold; buttons 6 px apart; media a bare 24 px icon | `--popover` panel, `--mask` backdrop; media `--foreground` | its buttons' | 0.1.0 |
| Avatar | 28 px, `sm` 24 px, `lg` 42 px; in a group, neighbours overlap 10 px (14 px for `lg`) and each has a 2 px edge inside its box | fallback and count: `--secondary-hover` disc, `--foreground` initials at regular weight; group edge `--card` | not focusable | 0.1.0 |
| Badge | 22 px: 12 px bold on an 18 px line, 2 × 6 px padding with the edge; 6 px radius, 14 px icons | `default`, `secondary`: `--secondary` fill; tones: `--{tone}-tag` fill, `--{tone}-tag-foreground` text; `outline`: `--border` edge | 1 px `--ring` outline, 2 px off | 0.1.0 |
| Breadcrumb | 14 px text, 8 px gaps at every width, 14 px icons and separators | links `--muted-foreground`, `--foreground` on hover; icons, separators and ellipsis `--control-hover`; current page `--foreground` | 1 px `--ring` outline, 2 px off, 6 px radius | 0.1.0 |
| Button | 35 px (6 × 10 px padding, a 1 px edge); `xs` 24, `sm` 28, `lg` 42 px; `icon` 36, `icon-xs` 24, `icon-sm` 28, `icon-lg` 42 px square; 6 px radius; 14 px icons 8 px from the label; 60 % opacity when disabled | `default`: `--primary`, `--primary-hover`, `--primary-active`; `destructive`: `--destructive` with its `-hover` and `-active`; `secondary`: `--secondary`, `--secondary-hover`, `--secondary-active`; `outline`: `--border` edge, `--primary` text, `--subtle` hover; `ghost`: `--primary` text, `--subtle` hover, `--accent` press; `link`: `--primary` text | 1 px outline, 2 px off: `--ring`; `destructive` `--destructive`; `secondary` `--secondary-foreground` | 0.1.0 |
| Button group | `ButtonGroupText`: at least 36 px wide, 8 px padding, 6 px radius, regular 14 px text, 14 px icons | `ButtonGroupText`: `--field` fill, `--control` edge, `--muted-foreground` text; separator `--border` | each child's own | 0.1.0 |
| Calendar | 8 px padding and radius; 36 px day targets in 38 px rows; 12 px normal weekday labels; 30 px navigation/header row and 28 px titles | Primary selected endpoints, primary/10 range fill, today dot and 40% disabled days | Visible keyboard focus; provider-localized navigation | 0.1.0 |
| Card | 12 px radius, no border, `shadow-sm`, 18 px padding, 24 px between parts; title 18 px medium, description 16 px | `--card`, `--card-foreground`; description `--muted-foreground` | not focusable | 0.1.0 |
| Chart | tooltip: 6 px radius, 1 px edge, 10 px padding, `shadow-md`, a 14 px label over 12 px rows, 8 px between a name and its value, tabular figures in the body font | tooltip `--popover`, `--popover-foreground`, `--border` | Recharts' | 0.1.0 |
| Checkbox | 18 px box, 4 px radius, 1 px edge, a 12 px mark | `--field` fill, `--control` edge, `--control-hover` on hover; checked `--primary` (`--primary-hover` on hover), mark `--primary-foreground`; mixed: the unfilled box, a `--foreground` dash; disabled `--field-disabled`, mark `--field-disabled-foreground`, full opacity; invalid `--invalid` edge | 1 px `--ring` outline, 2 px off | 0.1.0 |
| Command | 6 px radius; a search row with 6 × 18 px padding over a 1 px rule, 16 px input text; list 10 px padding, rows 2 px apart; items as Dropdown menu's; headings 14 px semibold; `CommandDialog`'s × centred in the 48 px search row | `--popover`; highlighted item `--accent`; icons `--control-hover`, `--muted-foreground` when highlighted; headings `--muted-foreground` | the highlighted item's fill | 0.1.0 |
| Dialog | 12 px radius, 1 px edge, 18 px padding and gap, `shadow-xl`; title 18 px semibold on a 27 px line; × a 36 px round icon button at `top-4.5 end-4.5`, 14 px icon; buttons 6 px apart | `--popover` panel; `--mask` backdrop (40 % black, 60 % in dark); × `--muted-foreground`, `--subtle` hover, `--accent` press | the ×'s and the buttons' | 0.1.0 |
| Dropdown menu | 6 px radius, 1 px edge, 4 px padding, `shadow-md`, items 2 px apart; items 4 × 10 px, 4 px radius, 14 px icons; a 12 px submenu chevron | `--popover`; focused item `--accent`; icons `--control-hover`, `--muted-foreground` when focused; destructive item `--destructive-strong`, on `--destructive-subtle` when focused; labels semibold `--muted-foreground`; separator `--border` | the focused item's fill | 0.1.0 |
| Empty | 12 px radius, a dashed edge when a border is added; icon tile 40 px, 6 px radius, 20 px icon; title 18 px medium | edge `--border`; tile `--secondary`, `--secondary-foreground`; title `--foreground`; description `--muted-foreground` | not focusable | 0.1.0 |
| Field | 24 px between fields; 8 px between a label, its control and its text; descriptions and errors 12 px; a field card 12 px padding, 6 px radius | description `--muted-foreground`; error and invalid label `--destructive-strong`; field card `--border`, `--primary` when its control is chosen; disabled at 60 % | the control's | 0.1.0 |
| Input | 34 px (6 × 10 px padding), 14/20 px text, 6 px radius, 1 px edge, `shadow-xs` | `--field` fill, `--control` edge, `--control-hover` on hover; disabled `--field-disabled`, `--field-disabled-foreground`, full opacity; invalid `--invalid` edge, `--field-invalid-foreground` placeholder | the edge turns `--ring`, no ring | 0.1.0 |
| Input group | 34 px from the control's padding and line height; icons 14 px, 10 px from the edge; a text addon is a cell at least 36 px wide behind a divider; buttons `xs` 24, `sm` 28 px | as Input, round the whole group; icons `--field-icon` | the group's edge turns `--ring` | 0.1.0 |
| Item | 6 px radius; 10 × 14 px padding, `sm` 4 × 10 px; icon tile 32 px with a 14 px icon, image 40 px | `--foreground`; link hover `--accent`; `muted` `--muted`, `--secondary-hover` on link hover; icon tile `--secondary` | 1 px `--ring` outline, 2 px off | 0.1.0 |
| Kbd | 20 px tall, 4 px radius, 1 px edge, 12 px medium text | `--secondary` fill, `--border` edge, `--secondary-foreground` text | not focusable | 0.1.0 |
| Label | 14 px medium on a 21 px line, 6 px gap; 60 % opacity with a disabled control | `--foreground` | not focusable | 0.1.0 |
| Native select | 35 px, `sm` 28 px with 12 px text; 6 px radius, 1 px edge; a 14 px chevron (`sm` 12 px) in a 36 px end column | as Input; chevron `--control-hover` | the edge turns `--ring`, no ring | 0.1.0 |
| Pagination | round 36 px links, 14 px regular text; Previous and Next round chevron buttons whose words stay for screen readers; 14 px icons | `--muted-foreground`, `--accent` hover with `--secondary-foreground` text; current page `--highlight`, `--highlight-foreground` | 1 px `--ring` outline, 2 px off | 0.1.0 |
| Password input | Input group's; the optional eye a bare 14 px icon 10 px from the edge | eye `--field-icon`, `--muted-foreground` on hover | the group's edge for the input; the eye's outline, 1 px, 2 px off | 0.1.0 |
| Popover | 8 px radius, 1 px edge, 16 px padding, a soft shadow (`0 4px 8px`, 5 % black) | `--popover`, `--popover-foreground`, `--border`; description `--muted-foreground` | not focusable | 0.1.0 |
| Progress | 18 px tall, 6 px radius | track `--border`, fill `--primary` | not focusable | 0.1.0 |
| Radio group | 18 px circle, 1 px edge, a 10 px dot | `--field` fill, `--control` edge, `--control-hover` on hover; chosen: `--primary` circle (`--primary-hover` on hover), `--primary-foreground` dot; disabled `--field-disabled`, dot `--field-disabled-foreground`; invalid `--invalid` | 1 px `--ring` outline, 2 px off | 0.1.0 |
| Scroll area | a 4 px thumb inset 4 px in a 12 px track, 6 px radius | thumb `--border` | the whole area outlined, 1 px `--ring`, 2 px off | 0.1.0 |
| Select | trigger as Input, `sm` 26 px; a 14 px chevron; list 6 px radius, `shadow-md`, 2 px below and as wide as the field; options 28 px (4 × 10 px), 4 px radius, 2 px apart, a leading 14 px check; group labels 14 px semibold | trigger as Input, chevron `--field-icon`, edge `--ring` while open; focused option `--accent`; chosen option `--highlight` (`--highlight-focus` while focused) | the trigger's edge turns `--ring` | 0.1.0 |
| Sheet | no gap between parts; header and footer 18 px padding; side sheets at most 20 rem wide; `shadow-xl`; title 18 px semibold; × as Dialog's | `--popover`, `--mask` | as Dialog | 0.1.0 |
| Sidebar | menu buttons 4 × 10 px on a 4 px radius, 14 px icons, items 2 px apart; sub-buttons 32 px; group labels 12 px medium; floating panel and inset main area 6 px radius, `shadow-xs`; badge a framed count | icons `--control-hover`, `--muted-foreground` on hover; active item `--sidebar-accent` at the normal weight; labels `--muted-foreground`; badge `--sidebar-accent` fill, `--sidebar-border` edge, `--muted-foreground` text | 1 px `--sidebar-ring` outline, 2 px off | 0.1.0 |
| Skeleton | 6 px radius; a highlight sweeps across every 1.2 s from the inline start, and stops under reduced motion | `--border` (`--foreground` at 6 % in dark); highlight `--background` at 40 % (`--foreground` at 4 % in dark) | not focusable | 0.1.0 |
| Spinner | 14 px: a faint full ring and a round-capped arc | the current text colour | not focusable | 0.1.0 |
| Switch | 36 × 22 px track, `sm` 28 × 16 px; a 14 px knob (`sm` 10 px) 4 px (`sm` 3 px) from the ends | off `--control` (`--control-hover` on hover), on `--primary` (`--primary-hover`); knob `--card` (`--muted-foreground` off in dark); disabled track `--field-disabled`, knob `--field-disabled-foreground` (`--card` in dark); invalid `--invalid` edge | 1 px `--ring` outline, 2 px off | 0.1.0 |
| Table | cells 8 × 14 px padding; header 14 px semibold; 1 px row lines, the last row's kept; footer semibold between lines; caption muted, at the start | lines `--border` (`--muted` in dark); hover `--accent`; selected row `--highlight`, `--highlight-foreground` | the scroll box's browser outline | 0.1.0 |
| Tabs | an underlined list across the full width, no fill, no radius; tabs 14 × 16 px padding, 14 px semibold; the panel padded 12 px 16 px 16 px | labels `--muted-foreground`, `--foreground` on hover; selected `--primary` over a `--primary` bar, 1 px (`default`) or 2 px (`line`); `default`'s line under the list `--border` | 1 px `--ring` outline inside the tab; the panel's 2 px off | 0.1.0 |
| Textarea | 6 × 10 px padding, 14/20 px text, native rows/columns by default; optional `autoResize` and `fluid`, 6 px radius, `shadow-xs` | as Input | the edge turns `--ring`, no ring | 0.1.0 |
| Toast | `min(18.75rem, 100vw − 2rem)` wide, 6 px radius, 10 px padding, `shadow-md`, a blurred backdrop; title 14 px medium, detail 12 px medium; a 24 px round close button; 28 px actions | plain: `--popover`, `--border`; tones: `--{tone}-subtle` fill, `--{tone}-border` edge, title and icon `--{tone}-strong`, detail `--foreground`; close hover `--accent` (`--{tone}-tag` on a status toast) | 1 px `--ring` outline, 2 px off; the close button's in its own colour | 0.1.0 |
| Toggle | 34 px, `sm` 30, `lg` 38 px; a 4 px frame round the label; 6 px radius; 14 px icons | off: `--muted` pill (`--background` in dark), `--field-placeholder` text; on: a raised `--background` plate (`--muted` in dark) with `--bui-shadow-toggle`, `--foreground` text; `outline` adds a `--border` edge; disabled `--field-disabled` | 1 px `--ring` outline, 2 px off | 0.1.0 |
| Toggle group | joined items form one segmented pill: square inner corners, one edge between neighbours, no shadow | Toggle's | Toggle's; the focused item rises above its neighbours | 0.1.0 |
| Tooltip | 6 px radius, 6 × 10 px padding, 12 px text, at most 12.5 rem wide, `shadow-md`; the arrow takes the label's fill | `--foreground` fill, `--background` text; dark: `--secondary-hover` fill, `--foreground` text | not focusable | 0.1.0 |

## 5. Deviations added for the full suite

Every change from stock in the components taken from shadcn's registry for the full suite, and in the pilot components they extend. Components with no stock source (built on Radix, Base UI or from scratch) have no rows: their whole look is described in `specs/004_full-suite-components.md`.

| Component | Change | Why | Since |
| --- | --- | --- | --- |
| Accordion | Item: a rule under every panel, the last included; a disabled panel at 60 % opacity, header and content | The visual target's panels | 0.1.0 |
| Accordion | Header: `data-slot="accordion-header"` | Every element carries a data-slot | 0.1.0 |
| Accordion | Trigger: 16 px padding, 14 px semibold on 21 px in `--muted-foreground`, `--foreground` open or hovered, `--card` surface, 6 px outer corners, a 1 px `--ring` outline 1 px inside, colours over `--bui-duration-control`; no underline | The visual target's header | 0.1.0 |
| Accordion | Trigger: `indicator` prop replaces the chevron; the default chevron is 14 px in the header's colour and turns over `--bui-duration-control` | The visual target's indicator demo; motion tokens | 0.1.0 |
| Accordion | Content: `--card` surface and `--foreground` text, 16 px side padding | The visual target's content | 0.1.0 |
| Alert | `size` (`sm`, `default`, `lg`) and `appearance` (`default`, `outline`, `simple`), with `AlertDescription` following the size. | spec 004, Alert — additions | 0.1.0 |
| Alert | `duration` and `onDismiss`: the alert removes itself after `duration` ms, paused while the pointer is over it or focus is inside it; the component gains `"use client"`. | spec 004, Alert — additions | 0.1.0 |
| Avatar | AvatarFallback overflow-hidden | Text spilled out of the disc when a badge stops the root clipping | 0.1.0 |
| Badge | `"use client"`: a count reads the provider's `locale` and `badgeOverflow` string | No English and locale-formatted numbers inside components | 0.1.0 |
| Badge | `severity` variant (`primary` … `contrast`): solid fills that replace the variant's colours | The visual target's solid badge | 0.1.0 |
| Badge | `kind` variant from the props: `tag`, `solid` (20 px, 10 px text), `count` (round, 20 px minimum, 16 px inside a Button), `dot` (8 px) | The visual target's badge, count and dot | 0.1.0 |
| Badge | `size` variant (`sm`, `default`, `lg`) with compound sizes per kind | The visual target's badge sizes | 0.1.0 |
| Badge | `rounded` variant | The visual target's pill tag | 0.1.0 |
| Badge | `count`, `max`, `dot` props; a named dot is `role="img"`; dot props typed to need a name or `aria-hidden`; `data-severity`, `data-size`, `data-kind`, `data-count`, `data-rounded` | Counts and dots that are accessible by construction | 0.1.0 |
| Badge | max-w-full: never wider than its container | Long text broke out of narrow containers | 0.1.0 |
| Banner | With `BannerActions`, the icon, the title and description and the dismiss button share the centre of the 28 px row a small button sets; without actions they share the 21 px text line. | The icon sat 3.5 px above the text beside a button. | 0.1.0 |
| Button | `severity` variant (`success`, `info`, `warning`, `help`, `danger`, `contrast`), with compound variants colouring `default` (solid fill, hover, press, text, focus outline), `outline` (edge, text, hover and press backgrounds, their `dark:` forms replacing the plain outline's), `ghost` and `link` | The visual target's severities | 0.1.0 |
| Button | `raised` variant: the target's three-layer shadow | The visual target's raised button | 0.1.0 |
| Button | `rounded` variant: `rounded-full` | The visual target's rounded button | 0.1.0 |
| Button | `loading` prop: `Spinner` in place of the leading icon (`withSpinner`), or centred over the label when there is no icon (the label `opacity-0`, so the width holds); `aria-busy`, `aria-disabled`, `data-loading`, the press refused; not `disabled` (with `asChild`: the same on the child) | The visual target's loading button; keeps focus and width | 0.1.0 |
| Button | `data-severity`, `data-raised`, `data-rounded`, `data-loading` attributes | Styles (ButtonGroup reads `data-raised` and `data-rounded`) and tests | 0.1.0 |
| Button | With asChild, disabled sets aria-disabled, data-disabled, tabindex -1 and refuses the click | A link ignores disabled | 0.1.0 |
| Button group | `rounded-md` on the group; raised children give their shadow to the group (`has-[>[data-raised=true]]`); rounded children make the group a pill (`has-[>[data-rounded=true]]:rounded-full`) | The visual target's raised and rounded groups | 0.1.0 |
| Button group | ButtonGroupText gets data-slot="button-group-text" | Every part has a data-slot | 0.1.0 |
| Calendar | With a provider `locale` (and no DayPicker `locale` prop), the caption, weekday names, month and year dropdowns, day and week numbers and each day's name are written with `Intl` in that locale (English keeps two-letter weekdays and ordinal day names); `lang` is the locale; the first day of the week is the locale's where `Intl.Locale` knows it (stock: DayPicker's English and Sunday). | spec 004, Calendar — additions | 0.1.0 |
| Calendar | The labels' words come from the provider (`todayDate`, `selectedDate`, `previousMonth`, `nextMonth`, `month`, `year`, `monthNavigation`, `weekNumber`, `weekNumberHeader`) unless DayPicker's `locale` prop is given (stock: DayPicker's English labels). | spec 004, Calendar — additions | 0.1.0 |
| Calendar | The week number is a `th` (stock: a `td` with `scope="row"`) | `scope` is valid only on header cells; the week names its row | 0.1.0 |
| Calendar | Today's dot is the day button's only `::after`; no other day creates one. | An empty `::after` took the button's 8 px gap and pulled the chosen day's number 4 px off centre. | 0.1.0 |
| Carousel | Previous and next: 36 px round outline buttons in `--muted-foreground` with 16 px chevrons, at the logical edges (`-start-12`/`-end-12`), or in the row of the new `CarouselFooter` (stock: 32 px, arrow icons, `-left-12`/`-right-12`) | The visual target's demo buttons; RTL | 0.1.0 |
| Carousel | Vertical buttons use chevron up/down icons instead of the horizontal button turned 90° | The rotation broke RTL mirroring | 0.1.0 |
| Carousel | Button names, the slides' and the region's role descriptions come from the provider (`previousSlide`, `nextSlide`, `slideRole`, `carouselRole`) (stock: English) | No English inside components | 0.1.0 |
| Carousel | Each slide is named "Slide {index} of {count}" (`slideOf`), kept current on Embla's `slidesChanged`/`reInit` | APG Carousel | 0.1.0 |
| Carousel | Up/Down move a vertical carousel; Left/Right swap in RTL; the keys are ignored while focus is in a text field (stock: Left/Right only) | APG, RTL, fields in slides | 0.1.0 |
| Carousel | Embla gets `direction` from the provider for a horizontal carousel | Embla scrolls the wrong way in RTL without it | 0.1.0 |
| Carousel | Logical spacing `-ms-4`/`ps-4` (stock: `-ml-4`/`pl-4`) | RTL | 0.1.0 |
| Carousel | Can-scroll state read with `useSyncExternalStore` on `select` and `reInit` (stock: `setState` in an effect, only `select` unsubscribed) | React Compiler lint; listener leak | 0.1.0 |
| Carousel | New parts `CarouselFooter` and `CarouselDots` (28 × 8 px bars, "Go to slide {index}", `aria-current`) | The visual target's indicators and layout | 0.1.0 |
| Carousel | The arrow keys are read as they bubble (`onKeyDown`, after a consumer handler) and skipped when a control inside already handled them (stock: `onKeyDownCapture`, before any control inside) | A radio group, slider or tabs inside a slide keeps its arrow keys | 0.1.0 |
| Carousel | When Previous or Next disables at an end while focused, focus moves to the other button (stock: focus fell to the page) | Focus never lost to the page | 0.1.0 |
| Chart | The SVG is laid out left to right in a right-to-left page (`[&_.recharts-surface]:[direction:ltr]`) | stock inherits `rtl`, which flips each axis label's `text-anchor`, so the value axis's labels run into the plot | 0.1.0 |
| Chart | Tooltip values formatted with the provider's `locale` (`Intl.NumberFormat`) | stock uses `toLocaleString()`, the runtime's locale, unlike every other component | 0.1.0 |
| Chart | `data-slot="chart-tooltip"` and `data-slot="chart-legend"` | stock has none; every part of the library has a data-slot | 0.1.0 |
| Checkbox | `size`: `sm` 14 px box with a 10 px mark, `lg` 20 px with a 14 px mark; defaults to the provider's `controlSize`. | The visual target's sizes. | 0.1.0 |
| Checkbox | `variant="filled"`: `--field-filled` while not checked; defaults to the provider's `fieldVariant`. | The visual target's filled variant. | 0.1.0 |
| Checkbox | `icon` and `indeterminateIcon` replace the check and the dash, sized as the built-in marks. | The visual target's Indicator demo. | 0.1.0 |
| Choice card | The radio or checkbox is centred on the title's line: 2 px down beside an aside's 21 px row, 1 px up beside the title's 16 px line alone. | It sat 3 px below a title without an aside. | 0.1.0 |
| Color picker | The number cells of the channel row are centred, 6 px from their edges, without the browser's spin buttons. | Four values ("255", "0.75") were cut off beside the format select. | 0.1.0 |
| Combobox | Imports `@base-ui/react/combobox` instead of the package root. | One entry of the peer, as Drawer and InputOTP. | 0.1.0 |
| Combobox | `ComboboxTrigger`: a 36 px end cell (28 / 42 px by size) divided by a line in the field's edge colour, 14 px chevron (12 / 16 px) in `--control-hover`, named by `toggleOptions`. | The visual target's Trigger demo; stock's button is a 24 px ghost button with no name. | 0.1.0 |
| Combobox | `ComboboxClear`: a bare 14 px × in a 24 px box (20 / 28 px), `--field-icon`, `--foreground` on hover, named by `clear`; exported. | Input's clear button; stock's is unnamed and private. | 0.1.0 |
| Combobox | `ComboboxInput` renders the library's `InputGroup` with `size` and `variant` (provider defaults), full width, registered as Base UI's `InputGroup`. | The field look and sizes of Input; the list lines up with the whole field, not the input alone. | 0.1.0 |
| Combobox | `ComboboxInput` `loading`: a 14 px spinner in the clear button's place. | The visual target's Loading demo. | 0.1.0 |
| Combobox | `ComboboxContent`: 2 px below (stock 6 px); the field's width; 6 px radius, 1 px `--border` edge, `shadow-md`, at most 24rem or the room below, a flex column; `data-bui-motion="overlay"` and `data-bui-portal`. | Select's list; motion from `theme.css`. | 0.1.0 |
| Combobox | `ComboboxContent` positioner: `pointer-events: auto`, and `wheel`/`touchmove` propagation stopped. | A modal Radix dialog or sheet turns pointer events off on the page and its scroll lock cancels wheel events outside its content; stock's list could not be clicked or scrolled there. | 0.1.0 |
| Combobox | `ComboboxContent`: while the list is open, a window capture listener marks Escape handled. | Radix listens for Escape on the document first and would close the dialog with the list. | 0.1.0 |
| Combobox | `ComboboxContent` `container` prop, passed to the portal. | Lets a part built on it (MultiSelect) render inside an overlay. | 0.1.0 |
| Combobox | `ComboboxList`: 4 px padding, 2 px gap, takes the popup's remaining height and scrolls. | Select's list; a header and the list share the height. | 0.1.0 |
| Combobox | `ComboboxItem`: 4 × 10 px padding, 20 px line, 4 px radius, `--accent` highlighted, `--highlight` chosen (`--highlight-focus` both), 60 % disabled; `icon` and `description`. | Select's option and the visual target's selected fill and Custom Option demo. | 0.1.0 |
| Combobox | `ComboboxItem` indicator: a 14 px check 10 px from the end in the text colour. | Select's check. | 0.1.0 |
| Combobox | `ComboboxGroup` 2 px gap; `ComboboxLabel` 14 px semibold muted with 4 × 10 px padding; `ComboboxSeparator` 2 px margins. | Select's group, label and separator. | 0.1.0 |
| Combobox | `ComboboxEmpty` stays mounted and takes room only with text; its text defaults to `noResults`. | Base UI requires the live region to stay in the page; stock hides it with `display: none`; no English inside components. | 0.1.0 |
| Combobox | New part `ComboboxStatus` (`loading` shows a spinner and `loadingResults`). | Async lists announce loading politely. | 0.1.0 |
| Combobox | `ComboboxChips`: the field look (35 / 28 / 42 px for one row, chips 3 px from the edge, `--ring` while the input has focus, `--invalid`, `--field-disabled`), `size` and `variant`; registered as Base UI's `InputGroup`. | The visual target's Chips demo; `anchor` is no longer needed. | 0.1.0 |
| Combobox | `ComboboxChip`: the library Chip's look (a 28 px `--secondary` pill, 22 / 32 px by size, `--secondary-hover` focused); its remove button a round 22 px target with a 14 px ×, named `removeItem`; `label` prop for that name. | The library's chip; stock's is a 22 px muted chip with an unnamed half-opacity button. | 0.1.0 |
| Combobox | `ComboboxChipsInput`: a 29 px row (22 / 36 px), muted placeholder, red while invalid. | The chip field's content determines its height; see spec 005 for the single-line field scale. | 0.1.0 |
| Combobox | New export `useComboboxFilteredItems` (Base UI `useFilteredItems`). | A virtualised list renders the filtered items. | 0.1.0 |
| Combobox | The root resets with its form: an uncontrolled combobox (single or `multiple`) starts again from `defaultValue` (the input keeps its focus), a controlled one is given the value it started with through `onValueChange` (reason `"none"`), as Select. | Base UI keeps its value on a form reset; every other field of the library returns to its default, including after React 19's reset following a form action. | 0.1.0 |
| Combobox | `ComboboxInput` and `ComboboxChipsInput` give the input an `aria-label` from the text of its own labels (`<label for>`, a label round the field) unless it has `aria-label` or `aria-labelledby`. | While the list is open Base UI marks everything but the input and the list `aria-hidden`, the visible label included, and Chrome then computed the input's name as empty. No id is written onto the app's labels. | 0.1.0 |
| Combobox | The chip remove button keeps its 22 px circle (16 px in `sm`) and takes presses over a transparent 24 px square centred on it. | WCAG 2.2's 24 × 24 px minimum target (2.5.8), as Chip. | 0.1.0 |
| Combobox | `Combobox` renders Base UI's root inside Base UI's `DirectionProvider`, set from the provider's `dir` (stock: the root, re-exported). | Base UI's own keys flip on right-to-left pages, such as the arrows between the chips input and the chips (stock: always left to right). | 0.1.0 |
| Combobox | `ComboboxInput` and its group take Base UI's `disabled`, which joins the root's, a Field's and the part's own; the part's `disabled` goes to Base UI, not to the rendered input. | A `disabled` root left the input enabled and submitting its text. | 0.1.0 |
| Command | `CommandEmpty` inside `CommandList` renders in a `role="status"` region that `CommandList` adds after the listbox (`data-slot="command-status"`), not inside the listbox. | A listbox may hold only groups and options (axe `aria-required-children`, critical); the message is announced. | 0.1.0 |
| Command | `CommandEmpty` merges the caller's `className` with `cn`. | Stock let it replace the component's classes. | 0.1.0 |
| Command | `CommandInput` holds `defaultValue` as the first search. | cmdk ignores it, and React warns about a field with both a value and a default. | 0.1.0 |
| Command | `CommandItem` takes `wrap-anywhere`: a word longer than the row breaks. | Stock clips it (the list hides horizontal overflow). | 0.1.0 |
| Command | `CommandShortcut` takes `[unicode-bidi:plaintext]` and `shrink-0`, as Kbd. | "⌘L" keeps its order on a right-to-left page and its width beside a long label. | 0.1.0 |
| Context menu | Content and sub-content: the dropdown menu's surface (6 px radius, 0.25 rem padding, a column with 2 px gaps, `shadow-md`) and `data-bui-motion="overlay"` | The visual target's context menu; theme motion | 0.1.0 |
| Context menu | Item, checkbox item, radio item, sub-trigger: the dropdown menu's 29 px rows, 14 px icons in `--control-hover`, 14 px check, 6 px dot, destructive in `--destructive-strong` on `--destructive-subtle`, 60 % disabled | The visual target's items | 0.1.0 |
| Context menu | Sub-trigger chevron 12 px with `rtl:rotate-180` | The visual target's submenu icon; RTL | 0.1.0 |
| Context menu | Label: muted semibold, padded as the items; separator as wide as the items | The visual target's group label and separator | 0.1.0 |
| Context menu | `ContextMenuShortcut` takes `[unicode-bidi:plaintext]`, as Kbd and `CommandShortcut`. | "⌘L" keeps its order on a right-to-left page (stock: the page's direction shows "L⌘"). | 0.1.0 |
| Context menu | `ContextMenuSubContent`: as Dropdown menu's. | As Dropdown menu. | 0.1.0 |
| Data table | Each side of `DataTablePagination` keeps its content's width, so a narrow table wraps the footer. | "Rows per page" ran 11 px over the last-page button. | 0.1.0 |
| Date picker / Date range picker | The popup is no taller than the room the window leaves it and scrolls inside. | Two months stacked on a phone ran off the top of the screen. | 0.1.0 |
| Date range picker | Months that do not fit side by side wrap to the next row at their own 256 px width; inline, Clear sits at the start of the Cancel and Apply row. | Three months were cut off in a narrow container, and Clear hung below the presets. | 0.1.0 |
| Dialog | `Dialog` shares `modal` (default `true`) with `DialogContent` through a context (stock: Radix keeps it). | `DialogContent` needs it for the outside scroll and the non-modal behaviour. | 0.1.0 |
| Dialog | `position`: `center`, `top`, `bottom`, `start`, `end`, 1rem from the edge, `top` below the admin bar (stock: centred only). | The visual target's positions, reduced to what a modal dialog needs. | 0.1.0 |
| Dialog | `size="full"` and a maximised dialog fill the window below the admin bar with square corners; with `scroll="outside"` the panel sits in the mask's flow, in the middle row of a three-row grid (stock: neither). | Full screen, maximise and outside scroll. | 0.1.0 |
| Dialog | New part in `DialogContent`: the maximise button (`data-slot="dialog-maximize"`), a 36 px round ghost icon button 0.5rem before the × or in its place, named from `maximize` / `restore`; `maximizable`, `maximized`, `defaultMaximized`, `onMaximizedChange`. `DialogHeader` keeps room for it. | The visual target's maximisable dialog. | 0.1.0 |
| Dialog | `scroll="outside"`: the mask scrolls and holds the panel (stock: the panel is fixed beside the mask); a press on the mask's scrollbar does not close it. | The visual target's outside scroll, for long documents. | 0.1.0 |
| Dialog | With `scroll="outside"`, the panel itself takes focus on open (stock: the first control). | The first control may sit at the end of a long text; the reader starts at the title. | 0.1.0 |
| Dialog | Non-modal (`modal={false}`): a click or focus outside does not close it (stock: it closes, as a popover does). | A non-modal dialog is for working beside the page. | 0.1.0 |
| Dialog | Non-modal: Tab past the last control moves on to the page after the element that opened it; Shift+Tab before the first goes back to that element (stock: Tab loops inside). | Otherwise a keyboard cannot leave a non-modal dialog. | 0.1.0 |
| Drawer | Rebuilt on Base UI's Drawer instead of vaul, keeping shadcn's part names, `direction` and `asChild`; the BooleanPress look (`bg-card`, `shadow-xl`, `rounded-t-xl`, 4 × 40 px handle bar, `bg-mask`, Sheet's spacing and type, modal motion with the drag on `translate`) | vaul is not used; one primitive library beside Radix | 0.1.0 |
| Dropdown menu | `DropdownMenuContent` takes the same scroll fix, for a menu with `modal={false}` opened from a modal dialog or sheet; a modal menu, with its own lock, behaves as before. | A non-modal menu's long list could not be scrolled with the wheel inside a dialog. | 0.1.0 |
| Dropdown menu | `DropdownMenuShortcut` takes `[unicode-bidi:plaintext]`, as Kbd and `CommandShortcut`. | "⌘L" keeps its order on a right-to-left page (stock: the page's direction shows "L⌘"). | 0.1.0 |
| Dropdown menu | `DropdownMenuSubContent`: `max-h-(--radix-dropdown-menu-content-available-height)`, `overflow-y-auto` (stock: `overflow-hidden`, no maximum). | A long submenu was cut off, its last items out of reach of the pointer. | 0.1.0 |
| Dropdown menu | The sub-trigger's chevron turns in RTL (`rtl:rotate-180`) | It points the way the submenu opens | 0.1.0 |
| Hover card | Content: the popover's surface (8 px radius, 16 px padding, soft 8 px shadow at 5 %, 14 / 21 px) and `data-bui-motion="overlay"` | The visual target's popover surface; theme motion | 0.1.0 |
| Input | `keyFilter`: a preset (`int`, `num`, `money`, `hex`, `alpha`, `alphanum`) or a RegExp blocks refused characters on `beforeinput` and `paste`; number presets use the provider locale's separators; the input takes the merged ref whenever a filter is set | The visual target's key filter, for fields such as amounts, hex colours and usernames, without a second component | 0.1.0 |
| Input | A client module (`"use client"`): it reads the size and look from the provider. | spec 004, Input — additions | 0.1.0 |
| Input | `size` (`sm` 26 px: 4 × 8 px padding, 12 px text; `lg` 42 px: 8 × 12 px, 16 px text), carried as `data-size`; the native numeric `size` attribute is omitted from the props type. The file button's text follows. | spec 004, Input — additions | 0.1.0 |
| Input | `variant="filled"`: `--field-filled`, on hover and focus; disabled keeps `--field-disabled` (`data-variant`). | spec 004, Input — additions | 0.1.0 |
| Input | `clearable`: a × button (named by the `clear` string) after the input, pulled back over its end padding, which grows to 34 px (28 / 40 px); the pair is wrapped in `div data-slot="input-wrapper"`, or is two parts of an `InputGroup`. Clearing sets the value through the native setter, dispatches `input` (so `onChange` fires), and refocuses the input; a form reset updates it. | spec 004, Input — additions | 0.1.0 |
| Input OTP | Rebuilt on Base UI's OTP Field instead of the `input-otp` package, keeping shadcn's part names and `maxLength`; one real input per box, separate 36 × 34 px field boxes 8 px apart with sizes, `filled`, invalid and disabled field looks; `validationType` replaces `pattern`, with general characters by default and explicit numeric mode | Real per-box inputs with names; the visual target's boxes | 0.1.0 |
| InputGroup | `size` on the group (`data-size`), handed to `InputGroupInput` and `InputGroupTextarea` through context; addons, `InputGroupText` and `InputGroupButton` scale with it (12 / 16 px text and icons; icons and buttons 8 / 12 px from the edge; buttons 4 px smaller / larger). | spec 004, Input group — additions | 0.1.0 |
| InputGroup | `variant="filled"` on the group (`data-variant`): `--field-filled`, on hover and focus; a disabled control keeps `--field-disabled`. The control always takes the default look. | spec 004, Input group — additions | 0.1.0 |
| InputGroup | `InputGroupText` has `data-slot="input-group-text"`. | Every part has a `data-slot`. | 0.1.0 |
| InputGroup | A click on an addon focuses the group's control, an input or a textarea, never the hidden input a Checkbox or a RadioGroupItem in an addon keeps for its form (stock focuses the first input in the group). | spec 003, Input group | 0.1.0 |
| InputGroup | `InputGroupTextarea` is `w-full`. | Textarea keeps its native column width, which a group stacked over a block addon centred. | 0.1.0 |
| InputGroupAddon | A `Checkbox`, a radio or a `Select` trigger in an addon is a cell behind a divider; the trigger loses its edge, fill, radius and shadow, and the group's edge turns `--ring` while it has keyboard focus or is open. The icon-button margin applies to buttons without a role only. | spec 004, Input group — additions | 0.1.0 |
| InputGroupInput | Takes Input's `clearable`; the × is a part of the group after the input. | spec 004, Input group — additions | 0.1.0 |
| Menubar | `MenubarShortcut` takes `[unicode-bidi:plaintext]`, as Kbd and `CommandShortcut`. | "⌘L" keeps its order on a right-to-left page (stock: the page's direction shows "L⌘"). | 0.1.0 |
| Menubar | Bar: `--card`, 1 px edge, 6 px radius, 6 × 10 px padding, 8 px gap, no fixed height or shadow | The visual target's menubar | 0.1.0 |
| Menubar | Trigger: 0.25 × 0.625 rem padding, 6 px radius, `--accent` on hover / focus / open, 14 px icons in `--control-hover` | The visual target's root items | 0.1.0 |
| Menubar | Content: at least 12.5 rem, the dropdown menu's surface, the exit fade stock lacked, `data-bui-motion="overlay"`; sub-content likewise | The visual target's submenu; every overlay fades out | 0.1.0 |
| Menubar | Items, checkbox and radio items, label, separator, sub-trigger (12 px chevron, `rtl:rotate-180`): as the dropdown menu | The visual target's items; RTL | 0.1.0 |
| Menubar | `MenubarSubContent`: as Dropdown menu's. | As Dropdown menu. | 0.1.0 |
| NativeSelect | A client module (`"use client"`). | It reads the provider's size and look. | 0.1.0 |
| NativeSelect | `size` takes `lg` (42 px: 8 × 12 px, 16 px text, a 48 px end column, a 16 px chevron 11 px from the end) and defaults to the provider's `controlSize`. | The visual target's three sizes; one app-wide size. | 0.1.0 |
| NativeSelect | `variant="filled"`: `--field-filled`, kept on hover and focus; defaults to the provider's `fieldVariant`. | The visual target's filled variant. | 0.1.0 |
| NativeSelect | `fluid`: the wrapper `w-full`. | The visual target's fluid prop. | 0.1.0 |
| Navigation menu | `navigationMenuTriggerStyle`: 0.25 × 0.625 rem padding, 14 px medium on 21 px, no fill at rest, `--accent` on hover / focus / open, 1 px `--ring` outline on keyboard focus, a row also on a link, 60 % disabled | The visual target's trigger buttons | 0.1.0 |
| Navigation menu | Trigger: no chevron | The visual target's triggers have none (owner's decision pending) | 0.1.0 |
| Navigation menu | Content: `p-1`; without the viewport 4 px under its trigger with `shadow-md`; `start-0`; `data-bui-motion="overlay"` | The visual target's menu surface; RTL; theme motion | 0.1.0 |
| Navigation menu | Viewport: 4 px under the triggers, `shadow-md`, `data-bui-motion="overlay"`; its wrapper `start-0` with a data-slot | The visual target's surface; RTL; theme motion | 0.1.0 |
| Navigation menu | Link: a 29 px menu row, 4 px radius, 14 px icons in `--control-hover`, 1 px outline on keyboard focus | The visual target's menu items | 0.1.0 |
| Navigation menu | `NavigationMenuSub` exported (Radix's Sub) | The visual target's submenus demo | 0.1.0 |
| Order list / Pick list | Without a filter beside it, the select-all checkbox shows its "Select all" label (from `strings.selectAll`), which names it. | A lone box read as a blank row. | 0.1.0 |
| Pagination | New parts `PaginationFirst` and `PaginationLast`: round icon links with double chevrons, named by `firstPage` and `lastPage`. | The visual target's first and last page links. | 0.1.0 |
| Pagination | `PaginationPages` takes `showEdges`, adding First and Last round Previous and Next, dimmed and out of the tab order at the ends. | The visual target's default paginator template; DataTable's paginator uses it. | 0.1.0 |
| Pagination | New helper `getPaginationItems` (siblings and boundaries, gaps as ellipses, one length as the page moves). | The visual target's siblings; the window the parts below draw. | 0.1.0 |
| Pagination | New part `PaginationPages`: Previous, the numbers and Next from `page` and `pageCount`, the ends `aria-disabled` and out of the tab order, numbers in the provider locale. | A list's pages without writing each link. | 0.1.0 |
| Pagination | New part `PaginationRange`: "{start}–{end} of {total}" from `pageRange`, numbers in the provider locale, `role="status"`, `unicode-bidi: plaintext`. | The visual target's custom text; announces the page change. | 0.1.0 |
| Pagination | New part `PaginationRowsPerPage`: a 28 px `Select` of 10, 20 or 50, named by its visible `rowsPerPage` label. | The page size of a list's footer. | 0.1.0 |
| Pagination | New part `PaginationJump`: a 48 × 28 px number field labelled `goToPage`; Enter goes to the page, clamped; leaving it restores the current page. | The visual target's input paginator. | 0.1.0 |
| Popover | `PopoverContent` lets the wheel and touch scroll its content when the popover opens from a modal `Dialog` or `Sheet`: on the content, events that scroll something inside it are kept from the dialog's scroll lock; others still reach the lock. The app's `ref` still reaches the content. | The modal dialog's scroll lock cancels wheel and touch scrolling outside the dialog's element, which a portalled popover is, so a long list in a popover (a calendar's dropdown, a filter list) could not be scrolled there. TreeSelect drops its own copy of the fix. | 0.1.0 |
| Progress | `size` (`sm` 8 px, `default` 18 px, `lg` 24 px), `steps` (equal segments filled in turn), and the fill follows `value / max` (stock assumes 100). | spec 004, Progress — additions | 0.1.0 |
| Progress | The value's text is a percentage in the provider's locale unless `getValueLabel` is given; it is `aria-valuetext` and, with `showValue`, drawn inside the fill (stock: Radix's English percentage, read aloud only). | spec 004, Progress — additions | 0.1.0 |
| Progress | With no value, a bar slides across the track on `transform` (stock draws nothing); it rests centred under reduced motion. | spec 004, Progress — additions | 0.1.0 |
| Progress | value clamped to 0…max, a bad max falls back to 100, NaN indeterminate, before Radix | Radix logged an error and read the bar as indeterminate | 0.1.0 |
| RadioGroup | `size` on the group or a radio: `sm` 14 px with an 8 px dot, `lg` 20 px with a 12 px dot; a radio's own wins over the group's, then the provider's `controlSize`. | The visual target's sizes. | 0.1.0 |
| RadioGroup | `variant="filled"` on the group or a radio: `--field-filled` while not chosen; then the provider's `fieldVariant`. | The visual target's filled variant. | 0.1.0 |
| Scroll area | A `ScrollBar` among the children is rendered beside the viewport, not inside it (stock: inside the scrolled content) | `fade` masked the horizontal bar | 0.1.0 |
| Scroll area | `fade`: the viewport is marked `data-fade-top` / `-bottom` / `-start` / `-end` as it scrolls, and masks 40 px at each marked edge with two intersected gradients, turned round in RTL (stock: no fade). | The visual target's scroll fade. | 0.1.0 |
| Select | The value line keeps one line's height (`*:data-[slot=select-value]:min-h-lh`), so a trigger with no value and no placeholder stays 34 px (26, 42). | An empty trigger shrank to the chevron's 28 px; FloatLabel and InFieldLabel no longer need their own fix. | 0.1.0 |
| Select | `Select` keeps the value itself and hands it to Radix controlled, controlled or not by the app, and shares it with the trigger through a context. | A clearable trigger must reset the value to `""` in uncontrolled use too; Radix's value is private. | 0.1.0 |
| Select | `SelectTrigger` `size` takes `lg` (42 px: 8 × 12 px, 16 px text, 16 px chevron) and defaults to the provider's `controlSize`; `sm` gap 20 px. | The visual target's three sizes; one app-wide size. | 0.1.0 |
| Select | `SelectTrigger` `variant="filled"`: `--field-filled`, kept on hover and focus; defaults to the provider's `fieldVariant`. | The visual target's filled variant. | 0.1.0 |
| Select | `SelectTrigger` `fluid`: `w-full`. | The visual target's fluid prop. | 0.1.0 |
| Select | `SelectTrigger` `clearable`: a wrapper (`data-slot="select-control"`) holds the trigger and, while a value is chosen, a 24 px clear button with a 14 px × before the chevron column; the trigger reserves room for it and keeps its hover edge while the pointer is on it. | The visual target's Clear demo; the button sits beside the trigger because a button cannot contain a button. | 0.1.0 |
| Select | The chevron sizes from the trigger's own group (`group/select-trigger`), not any ancestor's `data-size`. | A select inside another sized part kept its own chevron size. | 0.1.0 |
| Select | `SelectItem` `icon` and `description`: leading media and a muted second line, in the list only; such an option has 8 px above and below and 12 px between media and text. | The visual target's Custom Option demo, without copying the media into the trigger. | 0.1.0 |
| Separator | `variant` (`solid`, `dashed`, `dotted`): a dashed or dotted line is a 1 px border instead of the 1 px fill; `data-variant` | The visual target's divider types | 0.1.0 |
| Separator | `children` and `align`: content between two `aria-hidden` lines (`separator-line`, `separator-content`), a 14 px line at the start or end, `data-align`; a real separator is named by its content (`aria-labelledby`) | The visual target's divider content and alignment | 0.1.0 |
| Sheet | Left, right and top panels start at `--wp-admin--admin-bar--height` (stock: the window's top edge); top and bottom panels are at most the window's height below the admin bar (stock: as tall as their content). | The admin bar (z-index 99999) covered the title and the ×; a tall top or bottom sheet left the window with its header or footer out of reach. | 0.1.0 |
| Sheet | `size?: "default" \ | "full"`: `full` covers the window below the WordPress admin bar, edged all round, still sliding from its side; `SheetContent` carries `data-side` and `data-size` (stock: no full size). | The visual target's full-screen drawer; the same API as Dialog's `size="full"`. | 0.1.0 |
| Slider | One handle at `[50]`, clamped to custom bounds, when no value is given | Stock rendered a second, hidden handle at `max` | 0.1.0 |
| Slider | `aria-label`, `aria-labelledby` and `aria-describedby` move from the root to the handles; a range's handles add the provider strings `sliderMinimum`, `sliderMaximum` (`sliderValue` for three or more) | The handles are the parts with a role (WCAG 4.1.2); replaces Radix's English names | 0.1.0 |
| Slider | `size` (`sm` / `default` / `lg`, from the provider's `controlSize`, `data-size`): handle, knob and track sizes as CSS variables; a handle-sized root footprint; vertical at least 100 px | Package size scale; the visual target's disabled and vertical rules | 0.1.0 |
| Slider | Track 3 px in `--border` | The visual target's track | 0.1.0 |
| Slider | Handle: a 20 px `--border` circle with a 16 px `--background` knob and hairline shadow, grab cursor, 1 px `--ring` outline 2 px away, colours over `--bui-duration-control` | The visual target's handle | 0.1.0 |
| Slider | No `name` reaches Radix while `disabled`. | Radix's hidden inputs take no `disabled`, so a disabled slider submitted its value; a disabled control submits nothing. | 0.1.0 |
| Sonner | The card, title and content classes apply to Sonner's own toasts only (`data-styled="true"`), and the status shadows are scoped to match; a `toast.custom()` or `unstyled` toast is left as its author draws it. | spec 004, Toast — additions | 0.1.0 |
| Spinner | data-slot="spinner" | Every part has a data-slot | 0.1.0 |
| Splitter | Renamed from shadcn's Resizable: `ResizablePanelGroup` → `Splitter`, `ResizablePanel` → `SplitterPanel`, `ResizableHandle` → `SplitterHandle`, slots `resizable-*` → `splitter-*` | The suite's name for the component | 0.1.0 |
| Splitter | A frame: 1 px `--border` edge, 6 px radius, `--card` surface; dropped on a splitter nested in a panel (stock: none) | The visual target | 0.1.0 |
| Splitter | `data-orientation` on the group replaces stock's `aria-[orientation=vertical]:flex-col`, which never matched in v4 | v4's group renders no `aria-orientation` | 0.1.0 |
| Splitter | Focus: a 1 px `--ring` outline 2 px around a 24 px handle in the bar's middle, always rendered (stock: a ring around the whole bar) | The visual target's handle focus | 0.1.0 |
| Splitter | `withHandle` grip: 24 × 12 px `--card` box, 1 px edge, `--muted-foreground` icon (stock: 16 × 12 px on `--border`) | The visual target's handle size | 0.1.0 |
| Splitter | A disabled splitter disables its handles (`aria-disabled`, out of the tab order, 60 % opacity) | The library left them focusable and announced as operable | 0.1.0 |
| Splitter | In an RTL page a horizontal splitter renders `dir="ltr"` and its panels `dir="rtl"` | react-resizable-panels has no RTL mode: drag and arrow keys moved the wrong way | 0.1.0 |
| Switch | `size` takes `lg` (a 44 × 26 px track, an 18 px knob 4 px from the ends) and defaults to the provider's `controlSize`. | Three sizes for every control. | 0.1.0 |
| Switch | `checkedIcon` and `uncheckedIcon`: an icon in the knob, `--muted-foreground` off (`--card` in dark), `--primary` on, the disabled field colours when disabled. | The visual target's Template demo. | 0.1.0 |
| Tabs | The scrollable list scrolls the selected and the focused tab wholly into view, clear of the scroll buttons, and composes a consumer `ref` with its own | A selected tab added at the end stayed out of view; a `ref` broke the buttons | 0.1.0 |
| Tabs | `Tabs` keeps the selected value in its own state and hands it to Radix, controlled or not, and shares a setter with the triggers (stock passes `value`, `defaultValue` and `onValueChange` straight through). | spec 004, Tabs — additions | 0.1.0 |
| Tabs | `TabsList` `scrollable`: the list scrolls inside a box carrying the variant's line, with previous and next buttons (named by `scrollTabsBackward` and `scrollTabsForward`, out of the tab order) over the ends while there is more; the list is `relative` for `TabsIndicator`. | spec 004, Tabs — additions | 0.1.0 |
| Tabs | `TabsTrigger` `onClose`: an × (`aria-hidden`, titled by `closeTab`), Delete and Backspace close the tab, `aria-keyshortcuts="Delete"`; the neighbour takes the selection and focus; the trigger carries `data-value`. Its bar hides while the list has a `TabsIndicator`. | spec 004, Tabs — additions | 0.1.0 |
| Tabs | `TabsIndicator`, a new part: one bar that slides to the selected tab with `transform` only. | spec 004, Tabs — additions | 0.1.0 |
| Textarea | A client module (`"use client"`): it reads the size and look from the provider. | spec 004, Textarea — additions | 0.1.0 |
| Textarea | `size` (`sm` 4 × 8 px padding, 12 px text; `lg` 8 × 12 px, 16 px text), carried as `data-size`. | spec 004, Textarea — additions | 0.1.0 |
| Textarea | `variant="filled"`: `--field-filled`, on hover and focus; disabled keeps `--field-disabled` (`data-variant`). | spec 004, Textarea — additions | 0.1.0 |
| Toast | `Toaster` merges the app's `className` with its own `toaster group` classes. | A class the app adds must not remove the classes the package's styles rely on. | 0.1.0 |
| Toggle | `size` defaults to the provider's `controlSize` and is set as `data-size`. | One app-wide size for every control. | 0.1.0 |
| Toggle | `fluid`: `w-full`. | The visual target's fluid prop. | 0.1.0 |
| Toggle group | `fluid`: the group `w-full`, the items `flex-1`; in a group narrower than its labels, a label wraps and a too-long word is clipped at the item's end, so no label spills into the next item. | The visual target's fluid prop; text never overlapping. | 0.1.0 |
| Toggle group | `size` defaults to the provider's `controlSize`; the group's `data-size` is always set, and an item's own `size` applies only when the group sets none. | One app-wide size for every control. | 0.1.0 |
| Toggle group | `aria-invalid` on the group: one `--invalid` frame round a joined bar (the group's `::after`), or the `--invalid` edge on each spaced item. | The visual target's invalid group. | 0.1.0 |
| Tooltip | `TooltipContent` `arrow` prop: the arrow is drawn by default as before, and `arrow={false}` leaves it out; the arrow carries `data-slot="tooltip-arrow"` (stock always draws it). | spec 004, Tooltip — additions | 0.1.0 |


## Current form contract (0.1.0 candidate)

[Spec 005](specs/005_form-contract.md) supersedes conflicting historical form rows above only for these changes.
The primitives, upstream notices and unaffected contracts remain intact.

| Component | Current package deviation / composition | Verification |
| --- | --- | --- |
| Form fields | 26/34/42 px sizing, semantic placeholder/icon/invalid text tokens, shared faint `--bui-shadow-field` shadow and explicit subtle-edge contrast exception. | Component tests, contrast tests; manual light/dark/RTL review. |
| Autocomplete / Select | Positioned popup arrows; forced-selection, focus policy, popup-filter and multiple/chip recipes using existing controlled APIs and Combobox. Autocomplete uses 150 ms native lifecycle opacity/0.93-scale transitions with `--bui-ease-popup`, available-height bounds and 48 px list scroll padding. Select check precedes its label; its trigger reserves a 40 px indicator column at every size. | `tests/components/form-recipes.test.jsx`; existing component tests. |
| CheckboxGroup | Horizontal wrapping default, explicit vertical layout; parent alternates enabled all/none, partial advances to all, disabled selections preserved. | CheckboxGroup tests. |
| DatePicker / DateRangePicker / Calendar | Inline range and ISO week configuration; field-triggered combobox semantics; year→month→day navigation without committing early; bidirectional range-hover preview; calendar popup/target spacing. DatePicker defaults to field triggering. Both date pickers disable displayed outside-month buttons unless calendarProps.selectOutsideDays=true; keyboard navigation still crosses months. Standalone Calendar preserves selectable outside days. | Date/calendar tests. |
| InputGroup / InputNumber | Attached addon/action cells; inset icons remain 14 px, 10 px from the outer edge at all sizes. Numeric vertical mode is 40 px wide; custom stepper icons and accessible noneditable affixes; disabled number groups dim through their data attribute. | InputGroup and InputNumber tests. |
| InputOTP | General characters by default; explicit numeric validation, field-size slots. | InputOTP tests. |
| PasswordInput | Opt-in eye, controlled mask, four-level default score, custom score percentages and weighted rule feedback, localized panel/arrow content. | PasswordInput tests. |
| Listbox | Focus/hover/select policies, optional modifier selection, controlled matching filters and external header/select-all composition. | Listbox tests. |
| ColorPicker | Alpha default; presentation formats and RGB/HSL/HSV/OKLCH channel parts; browser eyedropper; normalized sRGB hex callbacks/forms. | ColorPicker, colour conversion and API type tests. |
| Rating | Default half steps, per-position render function, vertical half clip/hit areas, primary marks with no gap, hover scale and 2 px focus. | Rating tests and templates/vertical examples. |
| Slider | Default `[50]` clamped to custom bounds, handle-sized root footprint, minimum-distance and change/commit examples; no disabled fade. | Slider tests and examples. |
| Textarea | Fixed native dimensions by default; explicit `fluid` and measured `autoResize`, including controlled updates, width changes and reset. | Textarea tests and examples. |
| Toggle / ToggleGroup / Toolbar | Actual framed content plate; Toggle function children; group buttons use `aria-pressed` and individual Tab stops by default, optional roving focus and `allowEmpty=false`. | Toggle, ToggleGroup and Toolbar tests; API type tests. |

### Default contrast exceptions

The current form palette has ten control-edge pairs below 3:1 (background, card, popover, muted and sidebar in each
theme). Three light text compositions are below 4.5:1: unpressed toggle text `#64748b` on `#f1f5f9` (4.3439:1),
unmet inline password-rule text composited to `#707a88` on white (4.34:1 in the browser audit), and attached InputGroup
addon text `#94a3b8` on white (2.56:1). Inset InputGroup text retains its separate muted-text colour. The browser audit
reports these exact text exceptions separately from unexpected failures; the CLI stays strict for registered pairs.
See the [accessibility overrides](https://ui.booleanpress.com/docs/accessibility#default-colours) for edge tokens and
component CSS. These defaults do not establish blanket WCAG AA conformance.

Select reserves a leading check column and only the trigger width as the minimum popup width. Its 150 ms opacity/93% scale entrance and exit use the shared popup easing; reduced motion removes scaling and the no-exit switch still closes immediately.
