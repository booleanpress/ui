# Components moved from the pilot apps — Boolean UI mini-specs

**Current form contracts:** [005 — Form controls](005_form-contract.md) supersedes only the form defaults,
geometry, styling and interactions it explicitly changes below. All other contracts in this file remain in force.

Mini-specs (spec standard §1) for the components the two pilot apps, App A and App B, carried as local copies before the
package. Each was stock shadcn, or stock plus the deviations in `PATCHES.md` §1. Only the rows the package changes from
stock are listed, beside the package's look, which restyles every component (`PATCHES.md` §4) and which the state tables
describe. A component without a changed row is stock in its behaviour, and its section names the tests that hold it.
Each **Consumers** line names the apps that used the component on 2026-10-03; the maintainers keep the call sites.

**Base:** shadcn 4.21.1 `new-york` (TypeScript, right-to-left on) · radix-ui 1.6.7 · **Deviations:** `PATCHES.md`.

Every component below has a documentation page with one example per state listed, a test file in
`tests/components/<name>.test.jsx` with axe, and a `@since` JSDoc tag on each export. Each **Migration** line covers
behaviour and code; what the look changes on screen, for every component, is in `CHANGELOG.md`.

## Checkbox

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which is identical to stock.

**Consumers** (2026-10-03): App A and its add-on, and App B.

**Pattern:** WAI-ARIA APG Checkbox <https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/> · **Completeness references:**
Base UI Checkbox <https://base-ui.com/react/components/checkbox> · React Aria Checkbox
<https://react-aria.adobe.com/Checkbox>

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| States: mixed (`checked="indeterminate"`) | the check mark, on an unfilled box | a dash in `--foreground`, on the unfilled box | A check mark reads as "all chosen". The dash is the convention of every major design system for a partly chosen group; the unfilled box is the visual target's (see the owner's decision below). |
| Look | a 16 px transparent box, a 3 px ring, 50 % opacity when disabled | the visual target's box: the built rows of the mini-spec below | The BooleanPress look (`PATCHES.md` §4). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| unchecked | an 18 px box with a 4 px radius: a `--field` fill and the `--control` edge, `--control-hover` on hover | `role="checkbox"`, `aria-checked="false"`, `data-state="unchecked"` | Basic | toggles with Space |
| checked | the box filled `--primary` (`--primary-hover` on hover), a 12 px check in `--primary-foreground` | `aria-checked="true"`, `data-state="checked"` | Basic | toggles with Space |
| mixed | the unfilled box with a 12 px dash in `--foreground` | `aria-checked="mixed"`, `data-state="indeterminate"` | Indeterminate | reads mixed when indeterminate, shows the dash, and becomes checked with Space |
| focus-visible | a 1 px `--ring` outline, 2 px outside the box | — | Basic | — |
| disabled | full opacity: a `--field-disabled` fill, the `--control` edge, the mark in `--field-disabled-foreground`, checked or not; the not-allowed cursor | `disabled` | Disabled | ignores clicks and Space while disabled |
| invalid | the `--invalid` edge, checked or not, with no ring | `aria-invalid="true"`, with the error message in `aria-describedby` | Invalid | announces an invalid box with its error message |

| Key | Behaviour | Source |
| --- | --- | --- |
| Space | Toggles between checked and unchecked; from mixed, it becomes checked | APG Checkbox, keyboard interaction |

The label is the consumer's: a `Label htmlFor` or a horizontal `Field`. Clicking the label toggles the box. The box is
18 px; with its label it meets WCAG 2.5.8's 24 px target through the label's line height and the gap.

**Migration:** App A's log table shows a dash on the unfilled box when some rows are chosen, where its copy showed a
check mark. The box is 18 px with no ring: look once at layouts that count on 16 px, such as a table's select column. No
code changes beyond the import.

### Mini-spec: the box matches the visual target

**Status:** built in part (Unreleased): the size, mark, fill, edge, hover, focus, mixed, disabled, invalid and motion
rows; not built: the `sm` and `lg` sizes, `variant="filled"` and the compound anatomy · **Measured:** 2026-10-04 on the
visual target's styled checkbox page, headless Chromium, light and dark, with a click sampled frame by frame. Every target
value below is a measurement, not a memory. A comparison page with the screenshots is in `office/reports/`.

| Row | Stock | Target | In the package | Why |
| --- | --- | --- | --- | --- |
| Size | 16 px, one size | `size="md"` (default) 18 px, `sm` 14 px, `lg` 20 px; the mark is 12, 10 and 14 px | built at `md`: an 18 px box with a 12 px mark; `sm` and `lg` not built | The target has three sizes; the larger box also meets WCAG 2.5.8 more easily. |
| Mark | lucide `Check`, 14 px, 2 px stroke, for both states | the same glyphs drawn lighter: 12 px at `md`, the stroke as thin as the target's | built: lucide `Check` and `Minus` at 12 px, where their 2-unit stroke draws 1 px | The 2 px stroke at 14 px reads heavy beside the 1 px edge. |
| Fill at rest | transparent in light, `input/30` in dark | `--field` (white / slate 950) | built | A solid fill is what the target shows; transparent shows the surface through the box. |
| Edge at rest | `--input` | `--control` | built | The edge token of every form control. |
| Hover | none | edge `--control-hover`; checked: fill and edge `--primary-hover` | built | The target answers the pointer on every enabled state. |
| Focus-visible | a 3 px ring at 50 % | a 1 px solid `--ring` outline 2 px outside the box, and the edge turns `--ring`; no ring | built: the outline, with no ring; the edge keeps `--control` | The target's focus indicator; it clears WCAG 2.4.7 and 2.4.13 with a 1 px, 2 px-offset outline of the highest-contrast token. |
| Mixed | the check mark on an unfilled box | an unfilled box (`--field`), a dash in `--foreground` | built | The target's look; see the owner's decision below. |
| Disabled | 50 % opacity on the whole control | opacity 1; fill `--field-disabled`, edge unchanged, the mark `--field-disabled-foreground` | built | The target's look. The mark is 3.86:1 on its fill in light and 4.04:1 in dark: above the 3:1 WCAG 1.4.11 asks of a graphic, and a disabled control is exempt. |
| Invalid | `--destructive` edge, `--destructive/20` ring | edge `--invalid`, no ring | built | The target marks the edge only. |
| Filled variant | none | `variant="filled"`: unchecked fill `--field-filled` (slate 50 / slate 800); checked and hover as the default | not built: it needs the token `--field-filled` | A prop of the target. |
| Motion | `transition-shadow` | the fill, edge, outline and shadow colours fade over about 200 ms; the mark appears with the checked state, with no fade or scale of its own | built: colour, fill, edge, outline and shadow over `--bui-duration-control` (200 ms); the indicator has no transition | Measured: the fill fades over about 200 ms and the mark does not animate. |
| Reduced motion | not covered | no transition | built: `theme.css` ends every transition at once | Spec standard §6.3. |
| Touch target | label's line height and gap | the box is 18 px, the label brings the target to 24 px | built | WCAG 2.5.8. |

The built rows are the state table above. The rows not built would add:

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 14, 18 and 20 px boxes | `data-size` on the root | Sizes | sets the size as data-size on the root |
| filled | the filled fill at rest | `data-variant="filled"` | Filled | has a different fill at rest than the default |

No key changes: Space toggles, and from mixed it becomes checked.

**API, not built:** `size` (`"sm" | "md" | "lg"`, default `"md"`) and `variant` (`"default" | "filled"`), with the docs
examples **Sizes** and **Filled**. The invalid state stays `aria-invalid`, which Radix and every form library already set;
a separate `invalid` prop would duplicate it.

**Contrast.** The edge at rest (`--control`, `#7c8ca2` light, `#64748b` dark) is at least 3:1 on every surface in both
themes (WCAG 1.4.11), and `tests/contrast.test.js` holds it there. The visual target's lighter slate is an opt-in for a
product's `brand.css` (the theming guide's Reference colours); the docs' Palette setting shows it as Reference colours.

**For the owner's decision** (a copied value that conflicts with a standing rule is listed, never changed silently):

1. **Mixed state.** The package draws the target's unfilled box with a dash. A box filled like the checked state would keep
   the mixed state as visible as checked. The target stays unless the owner chooses the filled box.
2. **Motion rule.** The target fades colours. Spec standard §6.3 rule 1 is written as built: controls change colour over
   `--bui-duration-control`, beside the overlays' opacity and transform. Confirm the colour transitions for every form
   control, or keep the stricter rule (opacity and transform only) and animate only the outline and shadow.
3. **Compound anatomy** (`Root` / `Box` / `Indicator`) and the `match` prop of the target's indicator. Not copied: the
   single `Checkbox` stays, because the compound form is a new API for every consumer. Say so if you want it.

## Alert

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which is stock plus `PATCHES.md` row 7 (the `success`, `warning` and `info` variants).

**Consumers** (2026-10-03): App A and its add-on, and App B.

**Pattern:** WAI-ARIA APG Alert <https://www.w3.org/WAI/ARIA/apg/patterns/alert/> · **Completeness references:** Base UI has no Alert; React Aria has no Alert (its closest are Toast <https://react-aria.adobe.com/Toast> and the `role="alert"` pattern).

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Variants | `default`, `destructive` | adds `success`, `warning`, `info`. Every tone is one hue: a subtle fill, a matching edge and strong text and icon (`--{tone}-subtle`, `--{tone}-border`, `--{tone}-strong`); `default` is `--secondary` | Both apps show status messages; the pairs are in the contrast contract (`PATCHES.md` row 7). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | `--secondary` fill, `--border` edge, `--secondary-foreground` text | `role="alert"`, `data-slot="alert"` | Basic | is a live region named by its title and described by its text |
| success, warning, info | the tone's subtle fill, edge and strong text and icon | same | Tones | has the status variants on the status tokens |
| destructive | `--destructive-subtle` fill, `--destructive-border` edge, `--destructive-strong` text and icon | same | Tones | has the status variants on the status tokens |
| without icon | text across the full width | — | Without an icon | — |
| with action | a `Button` inside the description | the button is in the tab order | With an action | keeps interactive content reachable with Tab |
| dismissed | the page removes the alert | the page owns the state and the close button's name | Dismissible | — |
| focus-visible, disabled, read-only, invalid, loading | not applicable: an alert is not a control | | | |

No keys: an alert takes no focus; a button inside it is a `Button`'s.

An alert is always `role="alert"` (stock). Alerts present when the page loads are not announced by every screen reader, and several together are all announced. A quiet note should be a `div` with the same classes.

**Migration:** No change beyond the import.

## Avatar

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): App A and App B.

**Pattern:** none in the APG (an image with a text alternative) · **Completeness references:** Base UI Avatar <https://base-ui.com/react/components/avatar> · React Aria has no Avatar.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| image loaded | the picture in a round mask | `img` with `alt` | Image | — (jsdom never loads images) |
| loading, error, no source | the fallback: `--foreground` initials at regular weight on a `--secondary-hover` disc | no `img` | Fallback | shows the fallback while the image has not loaded; shows the fallback when there is no image |
| sizes | 28 px (`default`), 24 px (`sm`), 42 px (`lg`); initials 14, 12 and 20 px | `data-size` | Sizes | sets the size as data-size on the root |
| with badge | a dot or icon at the bottom inline-end corner | the badge's own text | With a badge | names a badge and a count for assistive technology |
| group | neighbours overlap by 10 px (14 px for `lg`), each with a 2 px `--card` edge inside its box; the count chip sized and coloured like them | the count chip's own text | Group | names a badge and a count for assistive technology |
| focus-visible, disabled, read-only, invalid | not applicable: an avatar is not a control | | | |

No keys: an avatar takes no focus; wrap it in a link or button when it acts.

**Migration:** No change beyond the import. The badge sits at the inline end, which is the right-hand corner in left-to-right pages, where App A's copy placed it.

## Breadcrumb

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock. The package adds the provider strings, `"use client"` and the mirrored chevron below.

**Consumers** (2026-10-03): none: no screen uses it yet.

**Pattern:** WAI-ARIA APG Breadcrumb <https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/> · **Completeness references:**
Base UI has no Breadcrumb page · React Aria Breadcrumbs <https://react-aria.adobe.com/Breadcrumbs>

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Landmark name | `aria-label="breadcrumb"` (English, lower case) | `strings.breadcrumb` from the provider (default "Breadcrumb") | No English inside components (`PATCHES.md` row 15). |
| Ellipsis label | `<span class="sr-only">More</span>` | `strings.more` from the provider | Same. |
| Directive | no `"use client"` | `"use client"` | Reading the provider needs the client. |
| Separator in right-to-left | a chevron that points right | `rtl:rotate-180`: the chevron points along the reading direction | The trail reads right to left in a right-to-left page. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | links in `--muted-foreground`, the current page in `--foreground`, 14 px chevron separators in `--control-hover`, 8 px apart | `nav[aria-label]` > `ol` > `li`; separators `role="presentation"`, `aria-hidden` | Basic | is a navigation landmark named from the provider |
| link hover / focus-visible | text turns `--foreground` and an icon `--muted-foreground`; a 1 px `--ring` outline, 2 px out, on a 6 px radius | native `a` | Basic | moves between the links with Tab |
| current page | `--foreground`, not a link | `aria-current="page"`, `role="link"`, `aria-disabled="true"` | Basic | marks the current page and hides the separators |
| collapsed levels | a 14 px ellipsis icon in `--control-hover` | `aria-hidden` icon with a visually hidden label from the provider | Collapsed levels | takes the landmark name and the ellipsis label from the provider strings |
| with a menu | a dropdown trigger as an item | the trigger is a `button` | With a menu | — (covered by the dropdown menu tests) |
| custom separator | children replace the chevron | unchanged | Custom separator | — |
| right-to-left | the chevron is mirrored | — | Basic (set the docs direction to RTL) | mirrors the separator chevron in right-to-left pages |
| router link | the child element carries the classes | `asChild` | Basic | lets a link render the router's element with asChild |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves between the links; the current page and the ellipsis are not focusable | APG Breadcrumb, keyboard interaction (links only) |

Known limits (carried from stock): the current page is a `span` with `role="link"` and `aria-disabled="true"`, so a screen
reader announces a disabled link; the ellipsis is `aria-hidden`, so its visually hidden label is never read. Wrap the
ellipsis in a link or a menu trigger that has a name.

**Migration:** The landmark and the ellipsis take their names from the provider ("Breadcrumb" and "More" by default). A product that translates them passes `breadcrumb` and `more` to `BooleanUIProvider`.

## Button group

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): none: no screen uses it yet.

**Pattern:** none in the APG (a layout wrapper with `role="group"`; the nearest pattern, Toolbar <https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/>, adds arrow-key navigation this component does not) · **Completeness references:** Base UI Toolbar <https://base-ui.com/react/components/toolbar> · React Aria ToggleButtonGroup <https://react-aria.adobe.com/ToggleButtonGroup>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| horizontal | children side by side; inner borders and corners removed | `role="group"`, `data-orientation` when passed | Basic | is a named group of buttons |
| vertical | children stacked; inner borders and corners removed | `data-orientation="vertical"` | Vertical | joins the buttons |
| focus-visible | the focused child is raised (`z-10`) so its outline is not covered | — | Basic | — |
| disabled child | that child at 60 % opacity (Button's disabled state); the others unchanged | `disabled` on the child | Disabled | lets a disabled button leave the tab order |
| with text, input, separator | `ButtonGroupText` drawn as a field addon: a `--field` fill, the `--control` edge, regular `--muted-foreground` text, at least 36 px wide; the input fills the row; a `--border` divider between two buttons | separator is decorative (no role) | Split button, With text and input | renders text, an input and a split-button separator |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Each child keeps its own tab stop; the group adds no arrow-key navigation | — (not a Toolbar) |

Notes: `data-orientation` is absent until `orientation` is passed (the variant default is not forwarded to the attribute). The group does not track a selected child; use a toggle group for a choice.

**Migration:** No change beyond the import.

## Calendar

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy and App B's copy, which were identical to each other and stock. The package's copy adds the row below.

**Consumers** (2026-10-03): App A and App B.

**Pattern:** WAI-ARIA APG Date picker dialog (the date grid)
<https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/> · **Completeness references:** Base UI
(no calendar) · React Aria Calendar <https://react-aria.adobe.com/Calendar>

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Direction | no `dir` is passed, so DayPicker uses its default (left-to-right) | `dir` is passed from `BooleanUIProvider` to DayPicker | In a right-to-left page the arrow keys follow the reading direction (`PATCHES.md` §2). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | a `--card` panel with 10 px padding, a 1 px edge and a 6 px radius; a 29 px header over a 1 px divider; 36 px cells with 28 px round days, `--accent` on hover; today on `--secondary-hover` | `role="grid"` named by the caption; day buttons named by full date | Single date | renders a grid of October 2026 |
| selected (single) | the day filled `--primary` | `aria-selected="true"` on the cell; the day's name ends ", selected" | Single date | selects the focused day with Enter |
| range | start and end `--primary`, the days between `--highlight` | `aria-selected` on each day of the range | Date range | selects a range |
| disabled days | 60 % opacity; not selectable; the arrows skip them | `disabled` on the day button | Disabled dates | disables days |
| dropdown caption | month and year as plain 14 px buttons over native selects, `--accent` on hover | selects named "Month" and "Year" | Month and year dropdowns | shows month and year dropdowns |
| in a popover | no edge and a transparent fill inside a `Popover` or a card's content | the popover content needs its own `aria-label` | Date picker in a popover | works inside a popover |
| month arrows | 28 px round buttons in `--muted-foreground`, `--subtle` on hover | named from the provider's `previousMonth` / `nextMonth` ("Previous month" / "Next month") | Single date | goes to the next and previous month |
| right-to-left | arrows and keys mirror | `dir="rtl"` on the root | — | lets the arrow keys follow the reading direction in RTL |
| focus-visible | a 1 px `--ring` outline, 2 px out, on the day or the month and year menus | — | Single date | — |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowRight, ArrowLeft | Next, previous day (reversed in right-to-left) | APG date grid |
| ArrowDown, ArrowUp | Same weekday in the next, previous week | APG date grid |
| Home, End | First, last day of the week | APG date grid |
| PageDown, PageUp | Same day of the next, previous month | APG date grid |
| Shift+PageDown, Shift+PageUp | Same day of the next, previous year | APG date grid |
| Enter, Space | Chooses the focused day | APG date grid |

Notes: every key above is tested in jsdom. The calendar's words come from the provider's strings (`monthNavigation`,
`previousMonth`, `nextMonth`, `todayDate`, `selectedDate`, `weekNumber`, `weekNumberHeader`, `month`, `year`), and its
month names, day names, digits and first day of the week from `Intl` in the provider's `locale` (spec 004, Calendar —
additions); a DayPicker `locale` passed to the Calendar still wins. The calendar is a `grid`, not a `table`; it has no heading of its own, and the popover
or card around it must be named. The grid is one tab stop (the chosen day, else today, else the first day).

**Migration:** On the page the calendar draws its own edge, so drop `rounded-md border` from its `className`; inside a `Popover` or a card's content it draws none. Its cells are 36 px. In right-to-left pages the arrow keys follow the reading direction. A product that translates the calendar passes `locale`. No other code changes beyond the import and the `react-day-picker` peer.

## Chart

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock (shadcn's Recharts wrapper). The package's copy adds the row below.

**Consumers** (2026-10-03): App A.

**Pattern:** none in the APG for charts; WCAG 1.1.1 (a text alternative) governs · **Completeness references:** Base UI: no chart component · React Aria: no chart component.

Peer dependency: `recharts` (3.x), imported by the consumer for the chart types, axes and series.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Server render | Recharts renders on the server | the chart draws once the page is hydrated; the server renders its box only | Stock's server output differs from the browser's first render, so React discards the server HTML with a hydration error (`PATCHES.md` §2). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| before hydration | the empty chart box, at its aspect ratio | — | — | — (the server render; the browser checks it in the Next fixture) |
| default | series drawn in `--color-<key>`, which the config sets from `--chart-1`…`--chart-5` or a per-theme pair | SVG `role="application"`, `tabindex="0"` (Recharts' accessibility layer) | Bar chart | defines a CSS variable per series; draws the chart |
| per-theme colour | `theme: { light, dark }` writes one variable per theme | — | Area chart | writes a separate colour for each theme |
| tooltip | a `--popover` box with a 1 px edge, a 6 px radius, 10 px padding and `shadow-md`: a 14 px heading over 12 px rows, each a marker, a name and its value in tabular figures | shown on hover, or from the keyboard | Bar chart | renders the tooltip content |
| legend | a coloured square and the config label per series | — | Area chart | draws the legend |
| focus | the chart takes focus; the tooltip shows at the first point | `tabindex="0"` | Bar chart | makes the chart a tab stop |
| text alternative | the chart named as one image, a table beside it | `role="img"` + `aria-label` on the container | Text alternative | is named as one image |
| outside a container | throws | — | — | throws when used outside a chart container |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Focuses the chart; the tooltip shows at the first data point | Recharts accessibility layer |
| Left Arrow, Right Arrow | Moves the tooltip to the previous or next data point | Recharts accessibility layer |
| Enter | Shows or hides the tooltip at the current point | Recharts accessibility layer |

Limits: a chart's numbers are not readable from the SVG; the consumer supplies a table or a sentence. `role="img"` names the chart but makes the SVG presentational, so the keyboard tooltip is then not exposed. jsdom has no layout: tests give the container a 320 × 200 box through a stub `ResizeObserver`.

**Migration:** The chart appears when the page has hydrated; until then its box is empty. App A's client-only page sees no difference. No code changes beyond the import.

## Collapsible

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): App A and its add-on.

**Pattern:** WAI-ARIA APG Disclosure <https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/> · **Completeness references:** Base UI Collapsible <https://base-ui.com/react/components/collapsible> · React Aria Disclosure <https://react-aria.adobe.com/Disclosure>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | content removed from the page | trigger `aria-expanded="false"`, `data-state="closed"` | Basic | opens and closes with Enter |
| open | content shown | `aria-expanded="true"`, `aria-controls` = the content's id | Basic | opens and closes with Enter |
| default open | starts open | `defaultOpen` | — | starts open with defaultOpen |
| controlled | the consumer's state | `open`, `onOpenChange` | Controlled | follows `open` |
| disabled | trigger disabled | `disabled`, `data-disabled` | Disabled | ignores the trigger while disabled |
| forceMount | content stays in the page, marked closed (still shown unless the consumer hides it) | `data-state="closed"` | — | keeps closed content in the page |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter | Opens or closes the content | APG Disclosure |
| Space | Opens or closes the content | APG Disclosure |

Notes: the component draws nothing; trigger look and any animation (`--radix-collapsible-content-height`) are the consumer's.

**Migration:** No change beyond the import.

## Command

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock plus `PATCHES.md` row 15 (the two hard-coded English strings, as `title` and `description` defaults). The package's copy adds the rows below.

**Consumers** (2026-10-03): App A and App B.

**Pattern:** WAI-ARIA APG Combobox <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/> (cmdk implements an
always-open list box with `aria-activedescendant`) · **Completeness references:** Base UI Combobox
<https://base-ui.com/react/components/combobox> · React Aria ComboBox <https://react-aria.adobe.com/ComboBox>

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Dialog title and description | rendered in the page, outside the dialog, in English, even while it is closed | inside `DialogContent`, defaulting to `strings.commandTitle` and `strings.commandDescription` | A title outside the dialog it names is not read with it; no English inside components (`PATCHES.md` row 15). |
| Search field name (dialog) | none | the dialog title, through cmdk's `label` | An unnamed combobox fails axe. |
| List name | cmdk's English default | `strings.suggestions` | No English inside components. |
| `CommandSeparator` | `role="separator"` inside the listbox | `aria-hidden="true"` | A listbox may hold only groups and options. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | search field above a list of items in groups | input `role="combobox"`, `aria-expanded="true"`; list `role="listbox"` named from the provider; items `role="option"` | Basic | renders a combobox named by the label, a named list, and grouped options |
| highlighted item | `--accent` fill; the icon turns from `--control-hover` to `--muted-foreground` | `aria-selected="true"`, `data-selected="true"` | Basic | highlights the first item and moves with ArrowDown and ArrowUp |
| filtered | only matching items and groups | — | Basic | filters as you type and shows the empty message when nothing matches |
| empty | the `CommandEmpty` message | the list holds only the empty message (see the limit below) | Empty result | filters as you type and shows the empty message when nothing matches |
| disabled item | 60 % opacity, skipped | `aria-disabled="true"`, `data-disabled="true"` | Disabled item | skips a disabled item |
| dialog | the dialog with the command inside | `role="dialog"` named and described by the provider; field named by the title | In a dialog | opens as a dialog named and described by the provider, with the field named by the title |
| translated | provider strings | — | — | takes the title, description and list name from the provider strings |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowDown | Highlights the next enabled item (wraps with `loop`) | APG Combobox, listbox popup |
| ArrowUp | Highlights the previous enabled item | APG Combobox |
| Home | Highlights the first item | APG Combobox (cmdk) |
| End | Highlights the last item | APG Combobox (cmdk) |
| Enter | Runs the highlighted item's `onSelect` | APG Combobox |
| Escape | In `CommandDialog`, closes it and returns focus to the opener | APG Dialog (Modal) |
| Ctrl+N, Ctrl+J, Ctrl+P, Ctrl+K | cmdk's vim bindings: next and previous; off with `vimBindings={false}` | cmdk |

Known limit: an empty result leaves the list with only the empty message and no option, which a listbox should not be
(axe's `aria-required-children` can report it). cmdk renders it so; the package does not change it.

Notes: a product that opens `CommandDialog` with Ctrl+J must open it only (not toggle), because cmdk also uses Ctrl+J while
the field has focus.

**Migration:** `CommandDialog` shows its title and description inside the dialog and in the provider's language, and a
translated product passes `commandTitle`, `commandDescription` and `suggestions`. The search field of an inline `Command`
needs cmdk's `label` prop. A `CommandSeparator` is hidden from assistive technology.

## Dropdown menu

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy and App B's copy, which were identical and stock.

**Consumers** (2026-10-03): App A and App B.

**Pattern:** WAI-ARIA APG Menu Button <https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/> · **Completeness references:**
Base UI Menu <https://base-ui.com/react/components/menu> · React Aria Menu <https://react-aria.adobe.com/Menu>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | the trigger only | trigger `aria-haspopup="menu"`, `aria-expanded="false"` | Actions | opens from the trigger as a menu with the right attributes |
| open | a floating list under the trigger | `role="menu"`; trigger `aria-expanded="true"` | Actions | opens from the trigger as a menu with the right attributes |
| highlighted item | `--accent` fill; the icon turns from `--control-hover` to `--muted-foreground` | focus on the item, `data-highlighted` | Actions | moves with the arrow keys, skips a disabled item, and wraps |
| disabled item | 60 % opacity, skipped | `aria-disabled="true"`, `data-disabled` | Actions | ignores a disabled item and marks it |
| destructive item | `--destructive-strong` text and icon, on `--destructive-subtle` when highlighted | `data-variant="destructive"` | Destructive item | marks a destructive item |
| checkbox item | a check mark at the start when checked | `role="menuitemcheckbox"`, `aria-checked` | Checkbox items | toggles checkbox items and reports the state |
| radio item | a dot at the start for the chosen one | `role="menuitemradio"`, `aria-checked` | Radio items | chooses one radio item |
| submenu | a chevron at the end; the list opens beside | `aria-haspopup="menu"`, `aria-expanded` | Submenu | opens a submenu with ArrowRight and closes it with ArrowLeft |
| shortcut hint | muted text at the end of the row | none (visual only) | With shortcuts | — |
| right-to-left | the submenu opens to the left; its keys swap | — | Submenu (RTL docs direction) | mirrors the submenu keys in right-to-left pages |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space (trigger) | Opens the menu and focuses the first item | APG Menu Button |
| ArrowDown (trigger) | Opens the menu and focuses the first item | APG Menu Button |
| ArrowDown, ArrowUp | Next or previous item; skips a disabled item | APG Menu |
| Home, End | First or last item | APG Menu |
| A–Z | Type-ahead to the next item that starts with the letters | APG Menu |
| Enter, Space (item) | Chooses the item and closes the menu | APG Menu |
| ArrowRight (ArrowLeft in right-to-left) | Opens the submenu from its trigger | APG Menu |
| ArrowLeft (ArrowRight in right-to-left) | Closes the submenu | APG Menu |
| Escape | Closes the menu and returns focus to the trigger | APG Menu Button |
| Tab | Does nothing while the menu is open; focus stays in it | Radix (APG: Tab closes the menu) |

Notes: Radix keeps Tab inside an open menu; APG lets Tab close it. Not changed here.

**Migration:** No change beyond the import. In right-to-left pages the check mark, the indents and the shortcut sit on the reading side.

## Empty

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): App A and its add-on, and App B.

**Pattern:** none in the APG (static content) · **Completeness references:** Base UI and React Aria have no Empty.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| first run, with action | optional icon tile, title, description, actions, centred | no roles; `data-slot` per part | Basic | renders its parts with their slots; keeps its action reachable with Tab |
| icon tile | a 40 px `--secondary` tile | `data-variant="icon"` on the media | Basic | marks the media variant |
| framed | a dashed border (`className="border"`) | — | Bordered | takes a className for the border |
| no results | a bare icon, the way back out | — | No results | — |
| focus-visible, disabled, read-only, invalid | not applicable: the buttons inside carry them | | | |

No keys: the component has none of its own.

`EmptyTitle` and `EmptyDescription` are `div`s (stock), so the page's heading levels are the consumer's. A change in the list's contents is not announced; the page announces the result count.

**Migration:** No change beyond the import.

## Input group

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock. The package's copy adds the row below.

**Consumers** (2026-10-03): App A and its add-on.

**Pattern:** native `input` or `textarea` with decorative addons (no APG pattern) · **Completeness references:** Base UI
Input <https://base-ui.com/react/components/input> · React Aria TextField <https://react-aria.adobe.com/TextField>

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Click on an addon | focuses the group's `input` only | focuses the group's `input` or `textarea` | A group around an `InputGroupTextarea` should take focus from its addon too (`PATCHES.md` §2). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rest | one `--control` edge round the whole group on a `--field` fill, `--control-hover` on hover, 35 px high; icons 14 px in `--control-hover`, 10 px from the edge; a text addon a cell at least 36 px wide behind a divider | group `role="group"`, `data-slot="input-group"`; control `data-slot="input-group-control"` | Icon, Prefix and suffix | focuses the input when a text addon is clicked, and takes typing |
| addon alignment | `inline-start`, `inline-end`, `block-start`, `block-end` | `data-align` on the addon | Prefix and suffix, Textarea with a toolbar | records the alignment of an addon, defaulting to the start |
| button | a ghost button inside the border | native `button`, `type="button"` | Button | Tab, Enter and Space; click does not move focus; `type=button` |
| textarea | the group grows with the text, the addon below | `InputGroupTextarea` | Textarea with a toolbar | works with a textarea |
| focus-visible | the group's edge turns `--ring`, with no ring, when the control has keyboard focus | — | Icon | — |
| disabled | a disabled control fills the group `--field-disabled` at full opacity; addons at 60 % when the group has `data-disabled="true"` | `disabled` on the control | Disabled | cannot be edited when its input is disabled |
| invalid | the `--invalid` edge on the group; `--ring` while the control has focus | `aria-invalid="true"` on the control, message in `aria-describedby` | Invalid | announces an invalid input with its message |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves between the control and the buttons in the addons, in document order | Native focus order |
| Enter, Space | Press the focused button | APG Button |

Name the control, not the group or an addon. Clicking an addon that is not a button focuses the group's `input` or
`textarea`.

**Migration:** A click on an addon in a group with a textarea focuses the textarea. No code changes beyond the import.

## Item

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock plus `PATCHES.md` row 17 (no `role="list"` on the group); App B has no copy.

**Consumers** (2026-10-03): App A and its add-on.

**Pattern:** none in the APG (a layout row; a link item follows the Link pattern) · **Completeness references:** Base UI and React Aria have no Item.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| `ItemGroup` role | `role="list"` | none | A list needs `role="listitem"` children, which `Item` lacks; axe reports the mismatch (`PATCHES.md` row 17). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default, outline, muted | no frame, a border, a tinted fill | `data-variant` | Variants | marks the variant and the size |
| sizes | `default` 10 × 14 px padding, `sm` 4 × 10 px | `data-size` | — | marks the variant and the size |
| with media and actions | a 32 px `--secondary` icon tile or a 40 px picture, 6 px radius; actions at the inline end | the actions' own controls | With media and actions | keeps actions reachable with Tab |
| group | stacked, with separators | no role on the group | Group | has no list role on the group, so axe finds no list-item violation |
| link (`asChild`) | the whole row takes `--accent` on hover; a 1 px `--ring` outline, 2 px out, on focus | the link's role, focusable | As a link | renders a link with asChild and leaves it in the tab order |
| disabled, read-only, invalid, loading | not applicable: an item is not a control | | | |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Reaches a link item or a control inside | native |
| Enter | Follows a link item | native link |

**Migration:** No change beyond the import.

## Kbd

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): App A and App B.

**Pattern:** none in the APG (the native `kbd` element) · **Completeness references:** Base UI and React Aria have no Kbd.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| single key | 20 px tall, a 4 px radius, a `--secondary` fill with the `--border` edge, 12 px medium `--secondary-foreground` text | `kbd`, `data-slot="kbd"` | Basic | renders a kbd element |
| combination | keys in a row, 4 px apart | the group is a `kbd` of `kbd`s | Group | nests keys in a group, which is a kbd too |
| in a tooltip | `--background` at 20 % on `--background` text | — | — | — |
| in text, in a button | inline with the surrounding text | — | In text, In a button | — |
| on a right-to-left page | a shortcut keeps its written order (⌘K, Ctrl + K); a right-to-left key name reads right to left | the label's first letter sets its direction (`unicode-bidi: plaintext`); a group's keys keep their order | Basic, Group (RTL) | keeps a shortcut in its written order on a right-to-left page |
| focus-visible, disabled, read-only, invalid | not applicable: not interactive (`pointer-events-none`) | | | |

No keys: not focusable. Test: is not focusable and takes no part in the tab order.

Kbd shows a shortcut and registers nothing. Key names (Ctrl or Command) are the product's.

**Migration:** No change beyond the import.

## Native select

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): App A's add-on.

**Pattern:** the platform `select` (APG Combobox, select-only, is the closest pattern)
<https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/> · **Completeness references:** Base UI
has no native select page (its Select is a custom listbox) · React Aria Picker/Select <https://react-aria.adobe.com/Select>
(a custom listbox; this component deliberately uses the platform's)

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rest | 35 px high, a `--field` fill, the `--control` edge (`--control-hover` on hover), a 14 px chevron in `--control-hover` centred in a 36 px end column | native `select`, role `combobox`, named by a label; chevron `aria-hidden` | Basic | named by its label, changes its value; chevron out of the accessibility tree |
| small | 28 px high, 12 px text, a 12 px chevron | `data-size="sm"` | Sizes | sets the size on the select |
| grouped | native option groups | `optgroup` with `label` | Groups | groups options |
| focus-visible | the edge turns `--ring`, with no ring | — | Basic | — |
| disabled | a `--field-disabled` fill and `--field-disabled-foreground` text at full opacity, the not-allowed cursor | `disabled` | Disabled | cannot be changed when disabled |
| invalid | the `--invalid` edge; `--ring` while focused | `aria-invalid="true"`, message in `aria-describedby` | Invalid | announces an invalid select with its message |

| Key | Behaviour | Source |
| --- | --- | --- |
| Arrow Down, Arrow Up | Change the option, or move in the open list (browser-defined) | Native `select` |
| Letters | Jump to the next option starting with the typed text | Native `select` |

The open list is drawn by the browser; the option classes only set `Canvas` and `CanvasText` so it follows the colour
scheme.

**Migration:** No change beyond the import. The chevron sits at the inline end and mirrors in a right-to-left page.

## Pagination

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock with the six English strings hard-coded (`PATCHES.md` row 15). The package reads them from the provider and adds the rows below.

**Consumers** (2026-10-03): App A.

**Pattern:** WAI-ARIA APG Landmarks, navigation <https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html> · **Completeness references:** Base UI: no pagination component · React Aria: no pagination component (its GridList and Table paging is app-defined).

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Landmark name | `aria-label="pagination"` | `strings.pagination` | No English inside components. |
| Previous, Next, their labels, the ellipsis text | `Previous`, `Next`, `Go to previous page`, `Go to next page`, `More pages` | `strings.previous`, `strings.next`, `strings.previousPage`, `strings.nextPage`, `strings.morePages` | Same. |
| Directive | no `"use client"` | `"use client"` | Reading the provider needs the client. |
| Chevrons in right-to-left | a chevron that points one way | `rtl:rotate-180` | The arrow points the way a reader goes. |
| Look | ghost-button pages, an outline-button current page, Previous and Next with a label from `sm` | round 2.25 rem pages in `--muted-foreground`, the current page in `--highlight`; Previous and Next are round chevron buttons whose label stays for screen readers | The BooleanPress look. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | round links in `--muted-foreground`, `bg-accent` on hover | `nav` named by `strings.pagination`, a `ul` of links | Basic | is a navigation landmark |
| current page | a round link in `--highlight` | `aria-current="page"`, `data-active` | Basic | is a navigation landmark |
| ellipsis | three dots | `aria-hidden`, text from `strings.morePages` | With ellipsis | hides the ellipsis from assistive technology, and mirrors the chevrons in a right-to-left page |
| first or last page | consumer-dimmed Previous or Next | consumer sets `aria-disabled`, `tabIndex={-1}` | First page | — (consumer-owned) |
| focus-visible | a 1 px outline, 2 px out | — | Basic | moves focus through the links |
| translated | names from the provider | `aria-label` from `previousPage`, `nextPage` | — | reads the landmark name and the link names from the provider strings |
| right-to-left | chevrons turned | `rtl:rotate-180` | — | hides the ellipsis from assistive technology, and mirrors the chevrons in a right-to-left page |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab, Shift+Tab | Moves between the links | APG Landmarks |
| Enter | Follows the focused link | native link |

**Migration:** The landmark is named "Pagination" by default (the apps' copies: "pagination"). Products that translate set the six strings on `BooleanUIProvider`.

## Password input

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's `password-input`, which is not stock shadcn: it is App A's own composition of `InputGroup` and a toggle button, and not a `PATCHES.md` row. The package reads the button's name from the provider string `showPassword` instead of App A's translation hook.

**Consumers** (2026-10-03): App A.

**Pattern:** a text input with a show/hide toggle button (APG Button, toggle) <https://www.w3.org/WAI/ARIA/apg/patterns/button/>
· **Completeness references:** Base UI has no password page · React Aria TextField <https://react-aria.adobe.com/TextField>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| hidden | dots; a bare 14 px eye in `--control-hover`, `--muted-foreground` on hover | `type="password"`; button named `strings.showPassword` ("Show password"), `aria-pressed="false"` | Basic | starts hidden, shows on click and hides again, reporting the state with aria-pressed |
| shown | the value; a struck-out eye | `type="text"`; the same button name, `aria-pressed="true"` | Basic | starts hidden, shows on click and hides again, reporting the state with aria-pressed |
| autofill opt-out | — | `autocomplete="new-password"`, `data-1p-ignore`, `data-lpignore="true"`; a caller's `autoComplete` wins | Basic | opts out of password-manager autofill, and a caller can override autocomplete |
| translated | the provider's word | `strings.showPassword` | — | reads the button names from the provider strings |
| focus-visible | the group's edge turns `--ring` for the input; the button shows a 1 px `--ring` outline, 2 px out | — | Basic | — |
| disabled | the group fills `--field-disabled`; the button at 60 % | `disabled` on both | Disabled | cannot be edited when disabled |
| invalid | the `--invalid` edge on the group | `aria-invalid="true"`, message in `aria-describedby` | Invalid | announces an invalid input with its message |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Input, then the show/hide button (the button is never removed from the tab order) | Native focus order |
| Enter, Space | Switch between shown and hidden | APG Button |

The button keeps one name and reports its state with `aria-pressed`, so a screen reader says the state once (APG: do not change a toggle's label when its state changes).

For a provider secret, not a sign-in field: the autofill opt-out stops a password manager from filling the saved site login.

**Migration:** The button's name comes from the provider ("Show password" by default); a translated product passes `showPassword`. The button has this one name in both states and reports the state with `aria-pressed`. `disabled` disables the input and the button.

## Progress

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which is stock plus `PATCHES.md` row 9 (`value` forwarded to the Radix root).

**Consumers** (2026-10-03): App A and App B.

**Pattern:** WAI-ARIA `progressbar` role <https://www.w3.org/TR/wai-aria-1.2/#progressbar> (the APG has no progress pattern; Meter is for a gauge) · **Completeness references:** Base UI Progress <https://base-ui.com/react/components/progress> · React Aria ProgressBar <https://react-aria.adobe.com/ProgressBar>

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| `value` | to the indicator only, so the root has no `aria-valuenow` and reads as indeterminate | also to the Radix root: `aria-valuenow`, `data-state`, `data-value` | A screen reader must hear the value (`PATCHES.md` row 9). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| determinate | an 18 px bar with a 6 px radius: the `--primary` indicator fills the `--border` track from the inline start | `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`, `data-state="loading"` | Basic, With a label | emits aria-valuenow and data-state="loading" for a value |
| controlled | follows `value` | | Controlled | follows a controlled value |
| complete | full | `data-state="complete"` | Complete | is complete at 100 |
| named | | `aria-label` or `aria-labelledby` | With a label | is named by a label element |
| indeterminate (no `value`) | an empty bar: the indicator sits at -100 % and nothing animates | no `aria-valuenow`, `data-state="indeterminate"` | — (not shown: it looks like 0 %) | has no aria-valuenow without a value, and reads as indeterminate |
| focus-visible, disabled, read-only, invalid | not applicable: not interactive | | | |

No keys: not focusable.

The indicator's position uses `value` out of 100; `max` is not honoured visually. Progress is not a live region: the page announces milestones.

**Migration:** No change beyond the import.

## Radio group

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): App A.

**Pattern:** WAI-ARIA APG Radio Group <https://www.w3.org/WAI/ARIA/apg/patterns/radio/> · **Completeness references:**
Base UI Radio Group <https://base-ui.com/react/components/radio> · React Aria RadioGroup
<https://react-aria.adobe.com/RadioGroup>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| unchecked | an 18 px circle: a `--field` fill and the `--control` edge, `--control-hover` on hover | `role="radio"`, `aria-checked="false"`, `data-state="unchecked"` | Basic | renders a radiogroup of radios, one checked |
| checked | the circle filled `--primary` (`--primary-hover` on hover) around a 10 px `--primary-foreground` dot | `aria-checked="true"`, `data-state="checked"` | Basic | renders a radiogroup of radios, one checked |
| controlled | as checked, from `value` | `value`, `onValueChange` | Controlled | is controlled by value |
| horizontal | a row, set by the consumer's `className` | `aria-orientation="horizontal"` | Horizontal | follows the reading direction in RTL |
| focus-visible | a 1 px `--ring` outline, 2 px outside the circle | — | Basic | — |
| disabled (group) | full opacity: a `--field-disabled` fill, the dot in `--field-disabled-foreground`; the not-allowed cursor | `disabled` on every radio | Disabled | ignores clicks and arrows while the whole group is disabled |
| disabled (item) | the same, on one radio; the arrows skip it | `disabled` | Disabled | skips a disabled radio when moving with the arrows |
| invalid | the `--invalid` edge on the radio, chosen or not, with no ring | `aria-invalid="true"` on the group and each radio, with the message in `aria-describedby` | Invalid | announces an invalid group |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves focus into the group, to the chosen radio, or to the first when none is chosen; a second Tab leaves | APG Radio Group, keyboard interaction |
| ArrowDown, ArrowRight | Focuses and chooses the next radio, wrapping to the first; in right-to-left, ArrowLeft goes forward | APG Radio Group |
| ArrowUp, ArrowLeft | Focuses and chooses the previous radio, wrapping to the last; in right-to-left, ArrowRight goes back | APG Radio Group |
| Space | Chooses the focused radio | APG Radio Group |

Notes: Radix chooses the radio an arrow key focuses only while the key is still held down (it listens for the key on the
document and clicks the radio on focus). The test holds the key with `{ArrowDown>}` and releases it after. The group has
no layout orientation of its own (`grid gap-3`); a horizontal group needs `className="flex gap-6"` and
`orientation="horizontal"`.

**Migration:** No change beyond the import.

## Scroll area

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock. The package's copy adds the row below.

**Consumers** (2026-10-03): App A.

**Pattern:** none in the APG; WCAG 2.1.1 (keyboard) governs · **Completeness references:** Base UI Scroll Area <https://base-ui.com/react/components/scroll-area> · React Aria: no scroll area component.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Keyboard focus | the viewport is never focusable | the viewport takes `tabIndex={0}` while it scrolls content with nothing focusable in it; otherwise it stays out of the tab order | A keyboard user can then scroll it with the arrow keys (WCAG 2.1.1; `PATCHES.md` §2). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| vertical | content scrolls in the box; a 4 px `--border` thumb with a 6 px radius, in a 12 px track at the end | `data-slot="scroll-area-viewport"` | Vertical | renders its content inside a viewport |
| horizontal | `ScrollBar orientation="horizontal"` | — | Horizontal | accepts a horizontal scrollbar as a child |
| region | named when the consumer sets it | `role="region"`, `aria-label` on the area | — | takes a region role and a name from the consumer |
| overflowing, nothing focusable inside | while the viewport has focus, the whole area shows a 1 px `--ring` outline, 2 px out | viewport `tabindex="0"` | — | — (jsdom has no layout) |
| fits, or holds a focusable control | the viewport is not a tab stop; the control inside is | no `tabindex` on the viewport | — | is not a tab stop by itself; a focusable control inside it is |

| Key | Behaviour | Source |
| --- | --- | --- |
| Arrow keys, Page Up, Page Down, Home, End | Scroll the focused viewport (the browser's own scrolling) | WCAG 2.1.1 |

Notes: a focused control inside scrolls into view as usual.

**Migration:** A scroll area with long text and no control in it is a tab stop, so a keyboard user can scroll it. No code changes beyond the import.

## Sidebar

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock plus `PATCHES.md` rows 13 (the `sidebar_state` cookie and its read-back, default collapsed), 14 (a nested tooltip provider) and 15 (the three English strings). The package's copy resolves those rows and adds the rows below.

**Consumers** (2026-10-03): App A.

**Pattern:** no APG pattern; it is a landmark navigation with a disclosure button (APG Disclosure Navigation Menu
<https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/>) and, on narrow windows, a modal
dialog (APG Dialog (Modal)) · **Completeness references:** Base UI has no Sidebar page · React Aria has no Sidebar page.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Persisted state | writes cookie `sidebar_state` on path `/` (shared by every app on the site), never reads it in the browser | local storage under the provider's `sidebarStorageKey` (default `booleanpress-ui:sidebar`), read at start; no cookie | `PATCHES.md` row 13. |
| Default | `defaultOpen = true` | `true`, unchanged; a saved choice wins; `defaultOpen={false}` starts collapsed (App A's copy defaulted to collapsed) | `PATCHES.md` row 13. |
| Tooltips | nested `TooltipProvider delayDuration={0}` | none; the provider's 500 ms applies | A sweep across the collapsed rail strobed tooltips (`PATCHES.md` row 14). |
| Strings | "Toggle Sidebar", "Sidebar", "Displays the mobile sidebar." | `strings.toggleSidebar`, `sidebarTitle`, `sidebarDescription` | No English inside components (`PATCHES.md` row 15). |
| Menu button tooltip | hidden only visually when the sidebar is expanded or narrow, so it still opens on focus and takes the first Escape meant for the narrow-window panel | stays closed unless the sidebar is collapsed to icons on a wide window | Escape and focus behave as the user expects. |
| Window-width hook | sets state in an effect, which renders twice on mount | reads through `useSyncExternalStore`; `false` on the server and during hydration, as stock | One render at mount. |
| Look | `p-2` menu buttons on a 6 px radius, 16 px icons in the text colour, a medium-weight active item, a 2 px ring; group labels at 70 % of the text colour | menu buttons 4 × 10 px on a 4 px radius, 14 px icons in `--control-hover` (`--muted-foreground` on hover), the active item at the normal weight, items 2 px apart, 32 px sub-buttons; 12 px group labels in `--muted-foreground`; a 1 px `--sidebar-ring` outline, 2 px out; the floating panel and the inset main area with a 6 px radius and `shadow-xs` | The BooleanPress look (`PATCHES.md` §4). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| expanded | full width (16 rem) | `data-state="expanded"` | Admin layout | starts expanded when no preference exists |
| collapsed to icons | a 3 rem rail; labels hidden; tooltips on hover and focus | `data-state="collapsed"`, `data-collapsible="icon"` | Starting collapsed | marks the collapsed state for icon mode |
| offcanvas | slides out of view | `data-collapsible="offcanvas"` | On the right | — (layout only, jsdom has no layout) |
| active item | `--sidebar-accent` fill, at the normal weight | `data-active="true"` (no `aria-current`) | Admin layout | renders the groups, the active item and the badge |
| badge | a framed count at the end of the row: a `--sidebar-accent` fill, the `--sidebar-border` edge, 12 px `--muted-foreground` text | none | Admin layout | renders the groups, the active item and the badge |
| collapsible submenu | indented list under an item | Radix Collapsible: `aria-expanded` on the trigger | Admin layout | — (covered by Collapsible) |
| saved choice | the state of the last visit | local storage | Starting collapsed | toggles with the trigger, keeps the choice in local storage and restores it on the next visit |
| controlled | the parent decides | `open`, `onOpenChange` | — | can be controlled with open and onOpenChange |
| storage blocked | works until reload | in-memory fallback | — | keeps working when local storage is blocked |
| narrow window (< 768 px) | a sheet from the sidebar's side | `role="dialog"`, `data-mobile="true"`, named from the provider | Admin layout (narrow frame) | becomes a sheet named and described by the provider, opened by the trigger |
| translated | provider strings | — | — | takes the trigger and rail names from the provider strings |

| Key | Behaviour | Source |
| --- | --- | --- |
| Ctrl+B, ⌘B | Toggles the sidebar (the sheet on narrow windows) | shadcn/ui; the common editor shortcut |
| Enter, Space | Presses the trigger or a menu button | APG Button |
| Tab | Moves through the trigger and the menu buttons; the rail is skipped | APG Disclosure |
| Escape | Closes the sheet on narrow windows and returns focus to the trigger | APG Dialog (Modal) |

Notes: `isActive` does not set `aria-current`; the consumer sets it on the link. The sidebar positions itself against the
window, so its examples render alone in a frame.

**Migration:** The stored state moves from the `sidebar_state` cookie to local storage, so each user's saved choice resets
once. A product passes its own `sidebarStorageKey` (for example `acme:sidebar`) to `BooleanUIProvider` and
removes its `getSidebarInitialState`. With no saved choice the sidebar starts expanded: pass `defaultOpen={false}` to
keep starting collapsed. Tooltips use the provider's timing, so the product's own wrapper provider can go.
`app-sidebar.test.jsx` keeps working against the package's `sidebar`; its cookie assertions become local-storage ones.

## Switch

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy and App B's copy, which were identical to each other and stock.

**Consumers** (2026-10-03): App A and its add-on, and App B.

**Pattern:** WAI-ARIA APG Switch <https://www.w3.org/WAI/ARIA/apg/patterns/switch/> · **Completeness references:**
Base UI Switch <https://base-ui.com/react/components/switch> · React Aria Switch <https://react-aria.adobe.com/Switch>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| off | a `--control` track (`--control-hover` on hover), the `--card` knob at the start (`--muted-foreground` in dark) | `role="switch"`, `aria-checked="false"`, `data-state="unchecked"` | Basic | renders role switch, named by its label |
| on | a `--primary` track (`--primary-hover` on hover), the `--card` knob at the end | `aria-checked="true"`, `data-state="checked"` | Basic | starts on with defaultChecked and reports changes |
| controlled | as on or off, from `checked` | `checked`, `onCheckedChange` | Controlled | is controlled by checked |
| sizes | 36 × 22 px with a 14 px knob 4 px from the ends (`default`); 28 × 16 px with a 10 px knob 3 px from the ends (`sm`) | `data-size` | Sizes | sets the size attribute: default and sm |
| focus-visible | a 1 px `--ring` outline, 2 px outside the track | — | Basic | — |
| disabled | full opacity: the track `--field-disabled`, the knob `--field-disabled-foreground` (`--card` in dark); the not-allowed cursor | `disabled` | Disabled | ignores clicks and keys while disabled |
| invalid | the `--invalid` edge round the track; the consumer shows the message | `aria-invalid="true"`, the message in `aria-describedby` | Invalid | announces an invalid switch with its error message |

| Key | Behaviour | Source |
| --- | --- | --- |
| Space | Flips the switch | APG Switch, keyboard interaction |
| Enter | Flips the switch (optional in APG) | APG Switch |

Notes: clicking the label flips the switch. The track is 22 px high at the default size and 16 px at `sm`; with its
label it meets WCAG 2.5.8's 24 px through the label's line height and the gap.

**Migration:** No change beyond the import.

## Table

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's and App B's copies, which were stock plus `PATCHES.md` row 16 (the selected-row tint). The package's copy adds the scroll box below.

**Consumers** (2026-10-03): App A and its add-on, and App B.

**Pattern:** WAI-ARIA APG Table <https://www.w3.org/WAI/ARIA/apg/patterns/table/> · **Completeness references:** Base UI: no table component · React Aria Table <https://react-aria.adobe.com/Table>

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Selected row (`data-state="selected"`) | `bg-muted`, the hover colour | `bg-highlight` with `text-highlight-foreground` | A selected row must differ from a hovered one (`PATCHES.md` row 16). |
| Look | `h-10 px-2` header cells, `p-2` cells, a `bg-muted/50` footer, no line under the last row | 0.5 × 0.875 rem cell padding, semibold header and footer cells, 1 px row lines (`--muted` in the dark theme), the last row keeps its line, a muted caption at the start | The BooleanPress look. |
| Scroll box | a plain `div`, unreachable by keyboard | a table wider than its container scrolls in a box that takes keyboard focus when the table has nothing focusable in it | A keyboard user can scroll it with the arrow keys (WCAG 2.1.1; `PATCHES.md` §2). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | native table; rows divided by a border | native `table`, `th`, `td`, `caption` | Basic | renders native table semantics, named by its caption |
| caption, footer | muted caption below, at the start; semibold footer on the table's own surface | `caption` names the table | Caption and footer | renders native table semantics, named by its caption |
| hover | row `bg-accent` | — | Basic | — |
| selected | row `bg-highlight` | `data-state="selected"` on the row; the checkbox carries `aria-checked` | Selectable rows | fills a selected row with the highlight colour, not the hover colour; selects rows with checkboxes |
| mixed select-all | the header checkbox shows a dash | `aria-checked="mixed"` | Selectable rows | selects rows with checkboxes; the select-all box is mixed while some rows are chosen |
| empty | one cell spanning the columns | `colSpan` | Empty | shows an empty state in one cell that spans the columns |
| narrow, nothing focusable in the table | the container scrolls sideways; cells do not wrap; the box shows the browser's focus outline when focused | container `tabindex="0"` | Horizontal scroll | — (jsdom has no layout) |
| focusable controls in the cells | the container is not a tab stop; the controls are | no `tabindex` on the container | Selectable rows | gives the table no tab stop of its own: only controls inside cells take focus |

| Key | Behaviour | Source |
| --- | --- | --- |
| Arrow keys | Scroll the focused scroll box (the browser's own scrolling) | WCAG 2.1.1 |

Notes: no sorting, paging or selection model; the consumer holds them. A static table has no keyboard model of its own;
controls in cells take Tab.

**Migration:** A table wider than its container, with nothing focusable in it, is a tab stop so a keyboard user can scroll it. No code changes beyond the import.

## Textarea

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock.

**Consumers** (2026-10-03): App A and App B.

**Pattern:** native `textarea` (no APG pattern) · **Completeness references:** Base UI has no Textarea page (it uses a
`Field.Control` on a native `textarea`) · React Aria TextArea <https://react-aria.adobe.com/TextField>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rest | a `--field` fill and the `--control` edge (`--control-hover` on hover), 6 × 10 px padding, 14 px text on a 21 px line, 64 px minimum | `role="textbox"`, named by a label | Basic | is named by its label and takes typing, including new lines |
| content grows | the box is as tall as its text (`field-sizing: content`) | — | Grows with its text | — (needs layout) |
| controlled | the given value | `value`, `onChange` | Basic | shows a controlled value |
| focus-visible | the edge turns `--ring`, with no ring | — | Basic | — |
| disabled | a `--field-disabled` fill and `--field-disabled-foreground` text at full opacity, the not-allowed cursor | `disabled` | Disabled | cannot be edited or focused when disabled |
| read-only | the rest look; the text can be selected and copied | `readonly`, still in the tab order | Read-only | can be focused but not edited when read-only |
| invalid | the `--invalid` edge and a `--destructive-strong` placeholder; `--ring` while focused | `aria-invalid="true"`, message in `aria-describedby` | Invalid | announces an invalid textarea with its message |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves focus on; it does not insert a tab character | Native `textarea` |
| Enter | Inserts a new line | Native `textarea` |

The label is the consumer's: a `Label htmlFor` or a `Field`. A browser without `field-sizing` shows the 64 px box and
scrolls.

**Migration:** No change beyond the import.

## Toast

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy, which was stock plus `PATCHES.md` row 10 (rich colours, close button, 4 s, 3 visible, radius, width, class names) and read the app's own theme provider. The package's copy adds the rows below.

**Consumers** (2026-10-03): App A and App B.

**Pattern:** WAI-ARIA APG Alert <https://www.w3.org/WAI/ARIA/apg/patterns/alert/> · **Completeness references:** Base UI Toast <https://base-ui.com/react/components/toast> · React Aria Toast <https://react-aria.adobe.com/Toast>

The entry is the package's `Toaster` around the `sonner` peer (2.0.8). Consumers import `toast` from `sonner` directly.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Theme | reads `next-themes` | `theme` prop, default `"system"`; the app passes its own | The apps have no `next-themes` (`PATCHES.md` row 10). |
| Direction | not set | `dir` from the provider | Right-to-left pages. |
| Names | Sonner's English "Notifications" and "Close toast" | the region from `strings.notifications`, the close button from `strings.closeNotification` | No English inside components. |
| Close button | astride the corner at the inline start | a 24 px round button inside the top corner at the inline end, in both directions, `--accent` on hover (`--{tone}-tag` on a status toast) | The BooleanPress look; it also keeps it clear of the text. |
| Behaviour | Sonner's defaults | `richColors`, `closeButton`, 4 s, 3 visible | `PATCHES.md` row 10. |
| Colours | Sonner's palette | a plain toast on `--popover` with the `--border` edge; each status type on its tone's subtle fill and edge, with the title and icon in its strong colour and the detail in `--foreground` (`--success-*`, `--info-*`, `--warning-*`; error `--destructive-*`) | Tokens only, as Alert's variants. |
| Shape | Sonner's | a 6 px radius, `min(18.75rem, 100vw − 2rem)` wide, 0.75 rem between toasts, 10 px padding, `shadow-md` and a blurred backdrop; a 14 px medium title over a 12 px medium detail; 28 px action buttons | The BooleanPress look (`PATCHES.md` §4). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| region | no box | `section` named from `strings.notifications` plus Sonner's hotkey label | Default | names the region from the provider, with Sonner’s hotkey, and the English default |
| default toast | `--popover` fill, `--border` border, close button | `li[data-sonner-toast]`, `data-type="normal"` | Default | shows a toast with its description and an action that runs |
| success, error, warning, info | the tone's subtle fill and edge, the title and icon in its strong colour | `data-type` of the type | Status | marks the status types, which carry the status colours |
| description and action | a second line; an `--primary` button | the action is a `button` | Description and action | shows a toast with its description and an action that runs |
| loading, then result | a spinner icon, then the type's icon | `data-type="loading"`, then the result | Promise | — (timer-driven; checked in the browser) |
| stacked | the newest three are visible, the rest queue | `data-visible="true"` on three | — | marks only the three newest toasts as visible |
| timeout | leaves after 4 s | the toast is removed | — | removes a toast after 4 seconds, and not before |
| right-to-left | the close button stays on the top corner at the inline end | `dir="rtl"` on the list | — | sets the direction from the provider |
| focus-visible | a 1 px `--ring` outline, 2 px out, on the toast; the close button outlines in its own colour | | Default | — |
| disabled, read-only, invalid | not applicable | | | |

| Key | Behaviour | Source |
| --- | --- | --- |
| Alt+T | Moves focus to the notification list | Sonner (`hotkey`) |
| Tab | Moves between toasts, actions and close buttons | native |
| Enter, Space | Closes the toast from its close button; runs an action | native button |

Tests: focuses the region with Alt+T, then Tab reaches the close button, named by the provider; closes a toast with Enter on its close button; closes a toast with Space on its close button.

A toast is a transient message: people cannot read it at their own pace, so nothing that needs a decision or is the only copy of an error may live in one (WCAG 2.2.1). Sonner's Escape handling is not tested, because jsdom has no layout for its expanded state.

**Migration:** Each product passes its theme to `Toaster` (`theme={theme}`) and its translated `notifications` and `closeNotification` strings to `BooleanUIProvider`, and imports `Toaster` from the package. The product's `position` and offsets stay as props. Status toasts take their colours from the status tokens.

## Toggle

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy and App B's copy, which were identical to each other and stock.

**Consumers** (2026-10-03): none: no screen uses it yet. `ToggleGroup` imports its `toggleVariants`.

**Pattern:** WAI-ARIA APG Button, toggle button <https://www.w3.org/WAI/ARIA/apg/patterns/button/> · **Completeness
references:** Base UI Toggle <https://base-ui.com/react/components/toggle> · React Aria ToggleButton
<https://react-aria.adobe.com/ToggleButton>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| off | a `--muted` pill (`--background` in dark) with `--muted-foreground` text; `outline` adds a `--border` edge | `aria-pressed="false"`, `data-state="off"` | Basic | renders a button with aria-pressed, named by aria-label |
| on | a raised `--background` plate (`--muted` in dark) with `shadow-xs` inside a 4 px frame, `--accent-foreground` text | `aria-pressed="true"`, `data-state="on"` | Basic | starts pressed with defaultPressed and reports changes |
| controlled | as on or off, from `pressed` | `pressed`, `onPressedChange` | Controlled | is controlled by pressed |
| hover | off and enabled: the text and icon turn `--secondary-hover-foreground` over `--bui-duration-control`; on and disabled: no change | `data-state="off"` | Basic | — (checked by eye in light and dark) |
| variants and sizes | `default` or `outline`; `sm` 32 px, `default` 35 px, `lg` 38 px | — | Variants and sizes | applies the variant and size classes |
| focus-visible | a 1 px `--ring` outline, 2 px out | — | Basic | — |
| disabled | a `--field-disabled` fill and `--field-disabled-foreground` text at full opacity, no pointer events | `disabled` | Disabled | ignores clicks and keys while disabled |

| Key | Behaviour | Source |
| --- | --- | --- |
| Space | Presses or releases | APG Button |
| Enter | Presses or releases | APG Button |

Notes: the accessible name stays the same in both states (APG: do not change the label when the state changes). An
icon-only toggle needs `aria-label`.

**Migration:** No change beyond the import.

## Toggle group

**Status:** built (0.1.1) · **Imported:** 2026-10-03, from App A's copy and App B's copy, which were identical to each other and stock.

**Consumers** (2026-10-03): App A's add-on and App B.

**Pattern:** WAI-ARIA APG Radio Group (single) <https://www.w3.org/WAI/ARIA/apg/patterns/radio/>; toggle buttons (multiple)
<https://www.w3.org/WAI/ARIA/apg/patterns/button/> · **Completeness references:** Base UI Toggle Group
<https://base-ui.com/react/components/toggle-group> · React Aria ToggleButtonGroup
<https://react-aria.adobe.com/ToggleButtonGroup>

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| single | one segmented pill: square inner corners, one edge between neighbours; the chosen item's raised plate | group `role="radiogroup"`, items `role="radio"`, `aria-checked` | Single | single: renders a group of radios |
| multiple | the same pill; any items raised | group `role="group"`, items `aria-pressed` | Multiple | multiple: renders a group of toggle buttons |
| controlled | from `value` | `value`, `onValueChange` | — | is controlled by value |
| variant, size, spacing | set on the group, passed to the items; `spacing` 0 joins, more separates | `data-variant`, `data-size`, `data-spacing` | Spacing and size | passes variant, size and spacing down |
| focus-visible | a 1 px `--ring` outline, 2 px out; the focused item rises above its neighbours (`z-10`) | — | Single | — |
| disabled (group) | every item in the disabled colours (`--field-disabled`, `--field-disabled-foreground`) | `disabled` | Disabled | disables the whole group |
| disabled (item) | the same on one item; the arrows skip it | `disabled` | Disabled | skips a disabled item |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves focus into the group, to the pressed item or the first; a second Tab leaves | APG Radio Group |
| ArrowRight, ArrowDown | Focuses the next item, wrapping; in right-to-left, ArrowLeft goes forward. The value does not change | Radix roving focus |
| ArrowLeft, ArrowUp | Focuses the previous item, wrapping; in right-to-left, ArrowRight goes back. The value does not change | Radix roving focus |
| Home, End | Focuses the first, the last item | APG Radio Group (Radix) |
| Space, Enter | Presses the focused item; pressing the pressed item in a single group clears it | Radix |

Notes: `type` is required. In `single` mode the items read as radios but can be cleared, which a radio group cannot do;
the doc page says so. Unlike Radio group, the arrow keys move focus only; Space or Enter chooses.

**Migration:** No change beyond the import.
