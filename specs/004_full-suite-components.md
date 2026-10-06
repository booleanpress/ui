# The full suite — Boolean UI component specs

**Current form contracts:** [005 — Form controls](005_form-contract.md) supersedes only the form defaults,
geometry, styling and interactions it explicitly changes below. All other contracts in this file remain in force.

Specs (spec standard §1) for the components added to make the library a complete suite, and for the sizes, variants and
states added to the components that were already in it. A component built from a shadcn stock item lists only the rows
it changes from stock, beside the package's look (`PATCHES.md` §4); a component with no stock item is described whole.

**Base:** shadcn 4.21.1 `new-york` (TypeScript, right-to-left on) · radix-ui 1.6.7 · Base UI 1.8.0 where Radix has no
primitive · **Deviations:** `PATCHES.md`.

**Shared API** (every control and field below):

- `size?: "sm" | "default" | "lg"`: a field is 28, 35 or 42 px tall (12, 14 or 16 px text on 4 × 8, 6 × 10 or 8 × 12 px
  padding). Without the prop, the provider's `controlSize` applies (default `"default"`).
- `variant?: "default" | "filled"` on fields: the white `--field` fill or the grey `--field-filled` one. Without the prop,
  the provider's `fieldVariant` applies.
- `fluid` makes a control fill its container; `clearable` adds an × that empties a field and keeps focus in it.
- Invalid is `aria-invalid`, never a separate prop. Built-in text comes from the provider's strings; a value inside a
  string is a `{name}` placeholder (`fillString()` from `@booleanpress/ui/utils`).
- Numbers and dates are formatted with `Intl` in the provider's `locale` and `timeZone`. The provider hands over values
  `Intl` accepts: `de_DE` and `de_DE_formal` become `de-DE` (underscores to hyphens, WordPress's `formal` / `informal`
  dropped, then trailing subtags dropped until `Intl.getCanonicalLocales` accepts the tag); a whole-hour UTC offset
  (`+02:00`) becomes its `Etc/GMT` zone; anything still refused is `undefined`, the runtime's default.
- A `BooleanUIProvider` inside another changes only the props it is given and inherits the rest from the one above,
  strings key by key (a key given as `undefined` counts as left out); without `tooltipDelay` or `tooltipSkipDelay` it
  keeps the outer tooltip provider. Tests: `tests/provider.test.jsx`.

Every component below has a documentation page with one example per state listed, a test file in
`tests/components/<name>.test.jsx` with axe, and a `@since` JSDoc tag on each export.

**Additions to the components of 0.1.1:** Alert dialog, Alert, Badge, Button group, Button, Calendar, Chart, Checkbox, Command, Dialog, Dropdown menu, Input group, Input, Native select, Pagination, Password input, Popover, Progress, Radio group, Scroll area, Select, Separator, Sheet, Sidebar, Switch, Table, Tabs, Textarea, Toast, Toggle group, Toggle, Tooltip.

**New components:** Accordion, Action bar, Aspect ratio, Autocomplete, Banner, Carousel, Cascade select, Chat, Checkbox group, Chip, Choice card, Close button, Code block, Color picker, Combobox, Confirm, Confirm popup, Context menu, Copy button, Data table, Data view, Date field, Date picker, Date range picker, Description list, Drawer, Editor, Fieldset, File upload, Float label, Format, Hover card, Icon button, In-field label, Inplace, Input mask, Input number, Input OTP, Knob, Link, Listbox, Loading overlay, Menubar, Meter group, Multi-select, Navigation menu, Order list, Overlay badge, Page header, Panel, Pick list, Progress circle, Rating, Scroll top, Search field, Segmented control, Slider, Speed dial, Splitter, Statistic, Stepper, Tags input, Time field, Timeline, Toolbar, Tour, Tree, Tree select, Tree table, Typography, Virtual scroller. The last sections cover what several share: form behaviour, menu shortcuts and the date code.

## Alert dialog — additions

### Behaviour details

Focus on close as Dialog's (menu item → the menu's trigger). Test: "returns focus to the menu button when a menu item
opened it, since the item leaves with its menu" (keyboard: Enter on the trigger, Enter on the item, Enter on Cancel).

## Alert — additions

**Status:** built (0.1.1) · **Stock:** `alert` · **Pattern:** WAI-ARIA APG Alert
<https://www.w3.org/WAI/ARIA/apg/patterns/alert/> · **Completeness references:** React Aria and Base UI have no
inline alert; their toasts cover the timed case: React Aria Toast <https://react-aria.adobe.com/Toast> · Base UI Toast
<https://base-ui.com/react/components/toast>

**API added:**

- `appearance?: "default" | "outline" | "simple"`. Named `appearance`, not `variant`, because `variant` already sets the
  tone (`default`, `success`, `info`, `warning`, `destructive`) and both combine: `variant="warning" appearance="outline"`.
- `size?: "sm" | "default" | "lg"`: 12/14/16 px text, 4×8 / 6×10 / 8×12 px padding, 14/16/18 px icon; `AlertDescription`
  follows. Explicit only (an alert is not a control, so it does not follow the provider's `controlSize`).
- `duration?: number` and `onDismiss?: () => void`: the alert removes itself after `duration` ms and calls `onDismiss`.
  The count pauses while the pointer is over it (pointerenter/pointerleave) or focus is inside it (focus/blur, ignoring
  moves between its own controls), and resumes with the time that was left.
- `open?: boolean` (0.2.0, default `true`): turning it off fades the alert out at `--bui-duration-exit` before it leaves
  the page (`data-state="closed"`, held by `usePresence`); turning it on again, also after `duration` removed it, fades it
  in with a 4 px slide at `--bui-duration-base` (`data-entering`). An alert open on its first render appears at once, so
  a page load or a refetch never animates it (spec standard §6.3 rule 3). `data-bui-motion="inline"` puts it under
  theme.css's exit, exits switch and reduced-motion rules. The ref is passed on.
- The component now has `"use client"` (it keeps state). Dismissible stays the consumer's: a button that turns `open` off.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Appearance | one look | `outline`: no fill, the edge in `--{tone}-strong` (`--muted-foreground` for `default`), the shadow kept; `simple`: no fill, edge, shadow or padding, text in the tone (`--muted-foreground` for `default`) | The visual target's outlined and simple messages. |
| Sizes | one size | `sm`, `default`, `lg` as above | The visual target's message sizes. |
| Auto-dismiss | none | `duration` + `onDismiss`, paused on hover and focus | The visual target's message life; WCAG 2.2.1 asks for a way to pause. |
| Entrance and exit | none | a fade (and 4 px slide) in when it appears after being closed; a fade out on close | The visual target's message enters and leaves; the timing is the library's (§6.3). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| outline | the tone's strong edge, no fill | `data-appearance="outline"` | Outlined | draws the outline appearance: the edge in the strong colour, no fill |
| simple | icon and text only | `data-appearance="simple"` | Simple | draws the simple appearance: text and icon only, with no edge, fill, shadow or padding |
| sizes | 12 / 14 / 16 px | `data-size` | Sizes | takes the sm, default and lg sizes, and the description follows |
| auto-dismiss | fades out after `duration` | removed from the page after its exit; `onDismiss` called once | Auto-dismiss | removes itself after its duration and calls onDismiss, and not before |
| first render | shown at once | `data-state="open"`, no `data-entering` | every example | appears at once on its first render, with no entrance |
| closing / reopening | fades out, then leaves; fades in on return | `data-state="closed"` while leaving; `data-entering` on return | Dismissible | stays on the page while its exit runs, then leaves; opening it again plays the entrance; comes back when it is opened again after its duration removed it |
| paused by pointer | stays while hovered | — | Auto-dismiss | pauses while the pointer is over it, and goes on with the time that was left |
| paused by focus | stays while focus is inside | — | — | pauses while focus is inside it, including moves between its controls |
| many | alerts added and cleared by the page | each `role="alert"` | Dynamic | (rendering only; covered by the tone and live-region tests) |

No keys: an alert takes no focus.

## Badge — additions

**Status:** built (0.1.1) · **Stock:** shadcn `badge`, with the patches in `PATCHES.md`. The file is now a client module
(`"use client"`): a count reads the provider's locale and strings.
**Completeness references:** React Aria has none; Base UI has none; the visual target's badge (count) and tag (label).

**API added:** `severity?: "primary" | "secondary" | "success" | "info" | "warning" | "help" | "danger" | "contrast"`
(solid fill; replaces the variant's colours), `count?: number`, `max?: number`, `dot?: boolean`,
`size?: "sm" | "default" | "lg"`, `rounded?: boolean`. A dot's props are typed to require `aria-label` or
`aria-labelledby`, or `aria-hidden`. New string: `badgeOverflow` = `"{max}+"`. Exported type: `BadgeProps`.
What it draws (`data-kind`): `tag` (the pale label, as before), `solid` (with a severity), `count`, `dot`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Solid label | the primary fill as the default variant | `severity`: the visual target's badge, 20 px tall, 10 px bold, 6 px padding | The target has both a solid badge and a pale tag. |
| Count | none | round, 20 px, at least 20 px wide, 10 px bold; formatted with `Intl.NumberFormat(locale)`; `max` caps it with `badgeOverflow`; 16 px inside a `Button` | The target's count badge. |
| Dot | none | 8 px, no text; `role="img"` when named | The target's dot. |
| Sizes | one | `sm` / `default` / `lg`: tag 18 / 22 / 26 px; solid and count 18 / 20 / 24 px (8 / 10 / 12 px text) | The target's badge sizes; the tag keeps 22 px as its default. |
| Pill | none | `rounded` | The target's pill tag. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| solid | a severity fill, 20 px | `data-kind="solid"`, `data-severity` | Severities | makes a solid label with a severity, sized and rounded by its props |
| sizes | see above | `data-size` | Sizes | makes a solid label with a severity, sized and rounded by its props |
| pill | `rounded-full` | `data-rounded="true"` | Pill | makes a solid label with a severity, sized and rounded by its props |
| count | a round number; the primary fill unless a severity is given | `data-kind="count"`, `data-count` | Count | draws a count in the provider locale and caps it at max |
| capped count | `{max}+` from the provider | `data-count` keeps the real number | Count | writes the capped count with the provider string |
| dot | an 8 px dot | named: `role="img"` + `aria-label`; else `aria-hidden` | Dot, Status | names a dot as an image, or hides it when the words beside it say the same |
| in a button | 16 px count | joins the button's name | In a button | joins a button name as its count |

No keys: a badge is not focusable (a badge made a link with `asChild` takes the link's keys).

**Notes.** The measured text is 10 px (the visual target's `0.625rem`), not 12 px. White text on the light theme's
success, sky, orange and violet fills is below 4.5:1, listed in `tests/contrast.test.js`.

### Behaviour details

`max-w-full`: a badge is never wider than its container; long text can end with an ellipsis inside a `<span className="truncate">` (docs).

## Button group — additions

**Status:** built (0.1.1) · **Stock:** shadcn `button-group`, with the patches in `PATCHES.md`.

The group sets nothing on its buttons: each `Button` keeps its own `variant`, `severity`, `size`, `raised` and
`rounded`. The group reads `data-raised` and `data-rounded` from its children.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Raised children | each button its own shadow | the group carries the raised shadow; its buttons drop theirs | The visual target lifts the joined row as one. |
| Rounded children | — | the group is a pill; only the outer ends of the row are round (the inner corners stay square) | The target's rounded group. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| severities | solid buttons joined with no line; outlined ones share one edge in the severity's colour; text ones with no edge | each child's `data-severity` | Severities, Outlined, Text | passes each button its severity, size, raised and rounded flags, and gives the shadow to the group |
| raised | one shadow under the whole row | children `data-raised="true"` | Raised | passes each button its severity, size, raised and rounded flags, and gives the shadow to the group |
| rounded | a pill row | children `data-rounded="true"` | Rounded | passes each button its severity, size, raised and rounded flags, and gives the shadow to the group |
| icon only | square icon buttons joined | — | Icon only | — |
| sizes | `sm`, default, `lg` buttons joined | children `data-size` | Sizes | passes each button its severity, size, raised and rounded flags, and gives the shadow to the group |

No key changes.

## Button — additions

**Status:** built (0.1.1) · **Stock:** shadcn `button` (new-york-v4), with the patches in `PATCHES.md`.
**Pattern:** WAI-ARIA APG Button <https://www.w3.org/WAI/ARIA/apg/patterns/button/> · **Completeness references:**
Base UI Button <https://base-ui.com/react/components/button> · React Aria Button <https://react-aria.adobe.com/Button>

**API added:** `severity?: "success" | "info" | "warning" | "help" | "danger" | "contrast"` (colours the `default`,
`outline`, `ghost` and `link` variants; `secondary` and `destructive` keep their own colours; `variant="destructive"`
equals `severity="danger"` on `default`), `raised?: boolean`, `rounded?: boolean`, `fluid?: boolean` (0.2.0: the container's width, as on every field, also
with `asChild`), `loading?: boolean`. Every existing variant and size is unchanged. Attributes: `data-severity`,
`data-raised`, `data-rounded`, `data-fluid`, `data-loading`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Severities | none | six severities on four variants, through compound variants on new tokens | The visual target's severity buttons. |
| Raised | none | the target's three-layer shadow | The target's raised button. |
| Rounded | none | `rounded-full`: a pill, a circle on an icon size | The target's rounded button. |
| Fluid | none | `w-full` | The target's fluid button; every field has `fluid`. |
| Loading | none | `Spinner` replaces the leading icon (or goes before the text), `aria-busy`, `disabled`; with `asChild`, `aria-busy` only | The target's loading button, without each product swapping icons by hand. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| solid severity | the severity's fill (`--success`, `--info-solid`, `--warning-solid`, `--help`, `--destructive`, `--contrast`), its `-hover` and `-active` steps, its `-foreground` text; the focus outline in the fill colour | `data-severity` | Severities | sets the severity, raised and rounded flags as data attributes |
| outlined severity | the `-edge` edge, the fill colour as text, `-ghost-hover` and `-ghost-active` backgrounds | `data-variant="outline"`, `data-severity` | Outlined severities | sets the severity, raised and rounded flags as data attributes |
| text severity | the fill colour as text on the `-ghost-hover` and `-ghost-active` backgrounds | `data-variant="ghost"`, `data-severity` | Text severities, Raised text | sets the severity, raised and rounded flags as data attributes |
| link severity | the fill colour as text, underlined on hover | `data-variant="link"`, `data-severity` | — | sets the severity, raised and rounded flags as data attributes |
| raised | `0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.14), 0 1px 5px rgba(0,0,0,.12)` | `data-raised="true"` | Raised, Raised text | sets the severity, raised and rounded flags as data attributes |
| rounded | a pill; a circle on an icon size | `data-rounded="true"` | Rounded, Icon only | sets the severity, raised and rounded flags as data attributes |
| loading | the 14 px spinner in place of the leading icon; 60 % opacity (disabled) | `disabled`, `aria-busy="true"`, `data-loading`; the spinner `role="status"` named `strings.loading` | Loading | shows the spinner in place of the leading icon while loading, is busy and ignores clicks; puts the spinner before the text when there is no icon, named from the provider; only marks a loading link busy |
| with a count | a `Badge count` inside the button is 16 px | the count joins the button's name | With a badge | (Badge) joins a button name as its count |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | Activate the button; a loading button is disabled and ignores both | APG Button |

**Contrast.** The defaults copy the visual target's colours: in the light theme, white text on the success, sky, orange
and violet fills (and on the first three's hover step), and the success, sky, orange, violet and danger colours as text on
white and on their pale hover and press backgrounds, fall below 4.5:1. `tests/contrast.test.js` lists each pair; the dark
theme and contrast pass.

**Notes.** Severity tokens (light / dark): `--success-hover` `#16a34a`/`#86efac`, `--success-active` `#15803d`/`#bbf7d0`,
`--success-edge` `#bbf7d0`/`#15803d`; `--info-solid` `#0ea5e9`/`#38bdf8` with `-hover`, `-active`, `-foreground`,
`-edge`; `--warning-solid` `#f97316`/`#fb923c` likewise; `--help` `#a855f7`/`#c084fc` likewise; `--contrast`
`#020617`/`#ffffff` likewise; `--destructive-edge`; and for each family `-ghost-hover` (light: the 50 step; dark: the fill
at 4 %) and `-ghost-active` (light: the 100 step; dark: the fill at 16 %). `--info` and `--warning` keep their blue and
yellow for alerts, hence the `-solid` families.

### Behaviour details

Replaces the Loading rows of the Button section (changed-from-stock, states and keys):

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Loading | none | `Spinner` replaces the leading icon (an icon before the label, or the only child of an `icon` size); with none, it sits centred over the label, which turns invisible (`opacity-0`) but keeps its room and stays in the name. `aria-busy`, `aria-disabled`, `data-loading`, 60 % opacity; the press is refused (`preventDefault`), the button keeps focus and its tab stop. With `asChild` the child gets the same. | The target's loading button; the spec standard's "a loading button keeps its width"; `disabled` dropped focus to `<body>` in Chromium and Firefox. |
| Disabled with `asChild` | passes `disabled` on (a link ignores it) | `aria-disabled`, `data-disabled`, `tabindex="-1"`, 60 % opacity, the click refused | A link cannot be disabled. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| loading | the 14 px spinner in place of the leading icon, or centred over the hidden label; 60 % opacity | `aria-disabled="true"`, `aria-busy="true"`, `data-loading`; not `disabled`; the spinner `role="status"` named `strings.loading` | Loading | shows the spinner in place of the leading icon while loading, is busy and ignores clicks; keeps focus and its tab stop while loading, and ignores Enter and Space; does not submit its form twice while loading; lays the spinner over the label when there is no icon; keeps a label wrapped in an element while loading; marks a loading link busy and refuses to follow it |
| disabled link (`asChild`) | 60 % opacity, no pointer | `aria-disabled="true"`, `data-disabled`, `tabindex="-1"` | — | takes a disabled link out of the tab order and refuses to follow it |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | Activate the button; a loading button keeps focus and ignores both | APG Button |

## Calendar — additions

**Status:** built (0.1.1) · **Stock:** `calendar` (react-day-picker 10)

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Locale | DayPicker's English (date-fns `enUS`); the month dropdown in the runtime's locale | with a provider `locale` (and no DayPicker `locale` prop): the caption, weekday names, month and year dropdowns, day numbers, week numbers and each day's name written with `Intl.DateTimeFormat` (Gregorian, read in UTC from the grid date's own day, so DayPicker's `timeZone` dates stay on their day); `lang` is the locale; `numerals` reaches `Intl` as `numberingSystem` | The provider's `locale` is the one switch for every date the package writes. |
| Weekday names | "Su", "Mo" (date-fns `cccccc`) | English keeps two letters (the look and the baselines); other languages take `Intl`'s short name, or the narrow one when any short name is longer than 4 characters (Arabic's are whole words, wider than a 36 px cell) | `Intl` has no two-letter width. |
| Day names | "Wednesday, October 14th, 2026" | the same in English (an ordinal day, from `Intl.PluralRules`); `Intl`'s full date elsewhere ("Mittwoch, 14. Oktober 2026") | Keeps the English names, and the tests that read them, unchanged. |
| First day of the week | Sunday | the locale's, from `Intl.Locale#getWeekInfo()` (or `weekInfo`) where the browser has it: Monday in `de-DE`, Saturday in `ar-EG`; Sunday where it does not; `weekStartsOn` still wins | Weeks start where the reader expects. |
| Label words | DayPicker's English: "Today, …", "…, selected", "Go to the Previous Month", "Choose the Month", "Navigation bar", "Week 40", "Week Number" | provider strings (always, unless DayPicker's `locale` prop is given): `todayDate`, `selectedDate`, `previousMonth` ("Previous month"), `nextMonth` ("Next month"), `month` and `year` for the dropdowns ("Month", "Year"), `monthNavigation` ("Month navigation"), `weekNumber` ("Week {week}"), `weekNumberHeader` | No English inside components. |
| DayPicker's `locale` prop | — | when given, DayPicker's locale and its translated labels win, as before | The documented `react-day-picker/locale` path keeps working. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| another locale | "Oktober 2026", Mo–So, Monday first; ar-EG Arabic-Indic digits, narrow names, Saturday first | `lang` = the locale; day names in the locale | Another locale | writes the caption, weekday names, digits and day names in the provider’s locale; starts the week on the locale’s first day, unless weekStartsOn says otherwise; writes the locale’s digits, and narrow weekday names where the short ones are too wide |
| English | unchanged ("Su", "Wednesday, October 14th, 2026"; en-GB "Wednesday, 14th October 2026", Monday first) | — | Single date | keeps English’s two-letter weekday names and ordinal day names in an English locale |
| translated words | — | "Heute, …", "…, ausgewählt", "Vorheriger Monat", "Monat", "Jahr", "Woche ٤٠" | — | names the days, arrows, dropdowns and week numbers with the provider’s strings |
| no locale | DayPicker's English dates | the provider's words | — | uses the provider’s words in English without a locale, and DayPicker’s English dates |
| DayPicker locale | `fr`: "octobre 2026" | `lang="fr"` | — | lets DayPicker’s own locale prop win over the provider’s locale and strings |
| time zone | each day named by its own date | — | — | writes each day by its own date in DayPicker’s time zone |

Notes: the en-US look is unchanged (the calendar's five baselines match on the dev server). The stock `WeekNumber`
component renders a `td` that DayPicker gives `scope="row"`, which axe reports (`scope-attr-valid`) when
`showWeekNumber` is on; a `th` would fix it (not changed here: outside the locale work).

### Behaviour details

**First day of the week.** From `Intl.Locale`'s `getWeekInfo()` / `weekInfo` where the browser has them; otherwise (Firefox)
from a `-u-fw-` extension in the locale, else CLDR's week data by the locale's likely region (Sunday: AG AS BD BR BS BT BW
BZ CA CO DM DO ET GT GU HK HN ID IL IN JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT PY SA SG SV TH TT TW UM
US VE VI WS YE ZA ZW; Saturday: AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY; Friday: MV; Monday elsewhere), so Firefox
starts the week where the server and the other browsers do.

**Time zone.** A bare `Calendar` works in the browser's zone and does not read the provider's `timeZone`; DayPicker's
`timeZone` prop changes that (DatePicker and DateRangePicker pass the provider's). Documented on the page.

**Docs corrections.** A day is a 28 px round button in a 36 px cell (`--cell-size`); today is `--secondary-hover`, the days
inside a range `--highlight`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| no week information | week from the locale's first day | first `th` names that day | Another locale | starts the week on the locale's first day in a browser without Intl.Locale week information |

## Chart — additions

### Behaviour details

| Change | Why | Test |
| --- | --- | --- |
| Tooltip values formatted with `Intl.NumberFormat(locale)` from the provider | numbers follow the provider's locale like every other component | writes the tooltip values in the provider's locale |
| `[&_.recharts-surface]:[direction:ltr]` on the container | in RTL the SVG inherited `direction: rtl`, flipping `text-anchor`, so the Y axis's labels overlapped the bars | lays the SVG out left to right in a right-to-left page |
| `data-slot="chart-tooltip"` and `data-slot="chart-legend"` | every part has a data-slot | (same tests) |
| Text alternative: `accessibilityLayer={false}` with `role="img"` | a focusable `role="application"` SVG inside a presentational `img` was a tab stop with nothing to announce | has no tab stop inside the picture |

## Checkbox — additions

**Status:** built (0.1.1) · **Stock:** shadcn `checkbox` · **Pattern:** WAI-ARIA APG Checkbox
<https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/> · **Completeness references:** Base UI Checkbox
<https://base-ui.com/react/components/checkbox> · React Aria Checkbox <https://react-aria.adobe.com/Checkbox>

This builds the rows the mini-spec "the box matches the visual target" left unbuilt: the sizes and the filled variant.

**API added.** `size?: "sm" | "default" | "lg"` (defaults to the provider's `controlSize`; the mini-spec's `md` is
`default`, the name every control uses), `variant?: "default" | "filled"` (defaults to the provider's `fieldVariant`),
`icon?: ReactNode` (the checked mark), `indeterminateIcon?: ReactNode` (the mixed mark).

**Why `icon` props, not a `CheckboxIndicator` part.** The checkbox stays one part, as it is today, and a custom mark
takes the box's size without the consumer knowing the internal group names. Children are not used, so they cannot be
mistaken for a label. Radix renders the indicator only when checked or mixed, so there is no unchecked mark (the visual
target's demo draws a × when unchecked; that is left out).

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Sizes | one 16 px box | `sm` 14 px box with a 10 px mark, `default` 18 px / 12 px, `lg` 20 px / 14 px, the 4 px radius at every size | The visual target's sizes (its resolved CSS: 0.875, 1.125 and 1.25 rem). |
| Filled | none | `--field-filled` while not checked (mixed included); checked stays `--primary` | The visual target's filled variant. |
| Custom marks | none | `icon` / `indeterminateIcon`, sized as the built-in marks | The visual target's Indicator demo. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 14, 18 and 20 px boxes | `data-size` | Sizes | sets data-size and data-variant, from its props or the provider |
| provider size and look | the provider's values when none is given | `data-size`, `data-variant` | — | takes the provider controlSize and fieldVariant when given none |
| filled | `--field-filled` while not checked | `data-variant="filled"` | Filled | sets data-size and data-variant, from its props or the provider |
| custom marks | the given icon when checked, or mixed | `aria-checked` unchanged | Custom indicator | draws a custom icon when checked and a custom mixed icon when indeterminate |

| Key | Behaviour | Source |
| --- | --- | --- |
| Space | Toggles a box with a custom mark, as any checkbox | APG Checkbox (test: toggles a box with a custom icon with Space, as any checkbox) |

## Command — additions

### Behaviour details

- **Changed from stock**, five rows to add:

  | Part | Stock | Package | Why |
  | --- | --- | --- | --- |
  | `CommandEmpty` | rendered where it is placed, inside the listbox when inside `CommandList` | inside `CommandList`, portalled into a `role="status"` region (`data-slot="command-status"`) that `CommandList` renders after the listbox; placed outside the list, rendered where it is | A listbox may hold only groups and options (axe `aria-required-children`, critical), and the message is announced. |
  | `CommandEmpty` | the caller's `className` replaced the classes | merged with `cn` | Every part merges `className`. |
  | `CommandInput` | `defaultValue` passed on and ignored by cmdk, with React's "both value and defaultValue" warning | held as the first search, then the field holds its own value | The prop is in the type; it must work. |
  | `CommandItem` | a word longer than the row overflows and is clipped | `wrap-anywhere`: it breaks | Long ids and addresses stay readable. |
  | `CommandShortcut` | the page's direction ("L⌘" on a right-to-left page); shrinks beside a long label | `[unicode-bidi:plaintext]` and `shrink-0`, as Kbd | Key hints keep their written order and width. |

- **States**, the `empty` row becomes: the `CommandEmpty` message after the list · in the list's `role="status"` region, the listbox empty · Empty result · "shows the empty message in a status region after the listbox, not inside it", "filters as you type and shows the empty message when nothing matches" (now with axe).
- **Known limit** about the empty listbox and `aria-required-children`: removed; the package now fixes it.
- New tests: "renders CommandEmpty where it is when it sits outside the list, and merges its className", "starts with the search given as defaultValue on CommandInput, and keeps filtering as you type", "keeps a separator between groups out of the accessibility tree", "keeps a shortcut hint in its written order on a right-to-left page".

## Dialog — additions

**Status:** built (0.1.1) · **Stock:** shadcn `dialog`, with the patches in `PATCHES.md`.
**Pattern:** [APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) · **Completeness references:**
[Base UI Dialog](https://base-ui.com/react/components/dialog) (modal / non-modal), [React Aria Modal](https://react-spectrum.adobe.com/react-aria/Modal.html)
(scroll behaviour); the visual target's dialog (position, maximisable, full screen, without modal, inside and outside scroll,
responsive).

**API added.**

- `DialogContent`
  - `size?: "sm" | "md" | "lg" | "full"` — `full` fills the window below the WordPress admin bar, square corners, 1 px edge.
    Chosen over a `fullScreen` boolean: one prop for one dimension, no contradictory pair (`fullScreen` with `size="sm"`),
    and Sheet takes the same `size="full"`.
  - `position?: "center" | "top" | "bottom" | "start" | "end"` (default `center`) — 1rem from the edge; `top` below the
    admin bar; `start`/`end` follow the reading direction. The visual target's four corners are left out: a corner is
    where toasts and popovers live, and a modal dialog in a corner reads as one of them.
  - `scroll?: "inside" | "outside"` (default `inside`) — `outside`: the mask scrolls and holds the panel (the Radix
    scrollable-overlay pattern, with a three-row grid so a tall panel's top stays reachable and its end clears the window
    by 2rem). A non-modal dialog has no mask and always scrolls inside.
  - `maximizable?: boolean`, `maximized?: boolean`, `defaultMaximized?: boolean`, `onMaximizedChange?: (maximized) => void`
    — a 36 px round icon button 0.5rem before the × (in its place without one), named from `maximize` / `restore`. Not
    drawn with `size="full"`.
- `Dialog`: `modal` defaults to `true` and is shared with `DialogContent` through a context.
- New strings: `maximize` = "Maximize", `restore` = "Restore".
- Responsive widths: no new prop; `max-w-*` classes with breakpoints on `DialogContent` (they win over `size`'s class).

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Position | centred only | `position`, five places | The target's positions, reduced to what a modal dialog needs. |
| Full screen | none | `size="full"` | The target's full-screen dialog. |
| Maximise | none | `maximizable` and its state props; `DialogHeader` keeps room for both buttons | The target's maximisable dialog. |
| Outside scroll | none | `scroll="outside"` | The target's outside scroll, for long documents. |
| Focus on open, outside scroll | the first control | the panel itself | The first control can sit at the end of a long text; the reader starts at the title. |
| Non-modal, outside click or Tab | closes the dialog | stays open | A non-modal dialog is for working beside the page. |
| Non-modal, Tab at the ends | loops inside (Radix `FocusScope loop`) | moves on to the page after the opener; Shift+Tab goes back to the opener | Otherwise a keyboard can never leave a non-modal dialog. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| position | 1rem from an edge, or centred | `data-position` | Position | places the dialog by position, centred by default |
| full | the window below the admin bar, square corners | `data-size="full"` | Full screen | fills the window with size="full", and draws no maximise button there |
| maximisable | a second round button before the × | `data-maximized="false"`; button `data-slot="dialog-maximize"`, named `maximize` | Maximisable | maximises and restores with its header button, named from the provider |
| maximised | as full | `data-maximized="true"`, `data-size="full"`; button named `restore` | Maximisable | maximises and restores with its header button, named from the provider |
| maximised, controlled | as full | — | — | reports a controlled maximised state and leaves it to the consumer |
| maximise without × | the button at the ×'s place | — | — | puts the maximise button beside the ×, or in its place without one |
| non-modal | no mask; page usable | no `aria-modal`; no overlay element | Non-modal | as a non-modal dialog, has no mask, lets Tab leave it and stays open while the page is used |
| outside scroll | the panel in the scrolling mask, 2rem from the top | `data-scroll="outside"`; focus on the panel | Outside scroll | with scroll="outside", sits in the scrolling mask and takes focus itself; a non-modal dialog scrolls inside |
| outside scroll, click on mask | closes | — | Outside scroll | with scroll="outside", closes on a click on the mask |
| responsive | width by breakpoint | — | Responsive | — (classes only) |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On the maximise button, fills the window or restores it. | native button; test "toggles the maximised size with Enter and Space on the maximise button" |
| Tab | Non-modal: from the last control, to the page after the element that opened the dialog. | patch; test "as a non-modal dialog, …" |
| Shift+Tab | Non-modal: from the first control, back to the element that opened the dialog. | patch; same test |

**Not built: dragging.** The visual target's dialog can be dragged by its header. An accessible version needs a focusable
move handle with arrow-key steps, a new string, limits at the window edges and on resize, and RTL arrows; a modal dialog
covers the page with its mask, so moving it reveals nothing usable. `position` and the non-modal dialog cover the need to
see the page. A behaviour of that size would need its own spec.

**Notes.** On systems with overlay scrollbars (macOS default) a press on the mask's scrollbar strip in `scroll="outside"`
counts as a press on the mask and closes the dialog; with classic scrollbars the press is recognised and ignored.

### Behaviour details

**Focus on close, opened from a menu item.** `useReturnFocus` (shared by Dialog, AlertDialog, Sheet, ConfirmPopup and
Tour) records, while the overlay is open, where the page tries to move focus outside it: a menu that closed as its item
opened the overlay sends focus back to its own trigger, which the overlay's trap turns away (seen as the `relatedTarget`
of a `focusout`, since the element never receives `focusin`). On close, focus goes to the first of: the element that had
focus when the overlay opened, if still on the page; that recorded element, if still on the page; `returnFocusTo`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| opened from a menu item, closed | — | focus on the menu's trigger | — | returns focus to the menu button when a menu item opened it, since the item leaves with its menu |

`position` applies to a dialog that scrolls inside; with `scroll="outside"` the panel is centred in the mask's flow.

## Dropdown menu — additions

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Long menu in a modal Dialog, `modal` true or false | scrolls with the wheel | a non-modal menu takes Popover's scroll fix; a modal menu has its own lock | — | "scrolls a long menu with the wheel inside a modal dialog, modal or not" |

### Behaviour details

- ↓ and ↑ stop at the last and first item; they wrap only with `loop` (Radix's default, and the visual target's). The
  page said they wrap. Tests: "moves with the arrow keys, skips a disabled item, and stops at the ends", "wraps from the
  last item to the first with loop".
- `DropdownMenuSubContent` takes the content's available height and scrolls (stock: `overflow-hidden`, cut off).

## Input group — additions

**Status:** built (0.1.1) · **Stock:** shadcn `input-group`, with the patches in `PATCHES.md`.
**Completeness references:** the visual target's input group and icon field.

**API added:** `InputGroup` `size?: ControlSize` and `variant?: FieldVariant` (provider fallbacks), carried as
`data-size` / `data-variant` on the group; the group hands its size to `InputGroupInput` and `InputGroupTextarea`
through context, and they always take the default look (the group draws the fill). `InputGroupInput` takes Input's
`clearable`: the × is then a part of the group after the input. New addon contents: a `Checkbox`, a `RadioGroupItem`
(or a `RadioGroup`) and a `Select` trigger.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Sizes | one size | `sm` 28 px: 12 px text and icons, icons and buttons 8 px from the edge, buttons 4 px smaller; `lg` 42 px: 16 px text and icons, 12 px from the edge, buttons 4 px larger | The visual target's sizes, applied to the whole group. |
| Filled | none | `variant="filled"`: `--field-filled` round the whole group, on hover and focus; a disabled control keeps `--field-disabled` | The visual target's filled variant. |
| Checkbox and radio addons | none | a cell at least 36 px wide behind a divider, like a text addon, the 18 px control centred | The visual target's checkbox and radio addons. |
| Select addon | none | a cell behind a divider; the trigger loses its own edge, fill, radius and shadow; the group's edge turns `--ring` while the trigger has keyboard focus or its list is open | The visual target's select addon. |
| Button margin | `has-[>button]` | `has-[>button:not([role])]`, so a checkbox, radio or select trigger is not pulled toward the edge like an icon button | Those controls are buttons with a role. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 28 / 35 / 42 px | `data-size` on the group and its control | Sizes | sets its size as data-size and hands it to its input and textarea, the provider size when it has none |
| filled | `--field-filled` group | `data-variant="filled"` on the group; the control keeps `default` | Filled | sets the filled look as data-variant on the group only, the provider look when it has none |
| multiple addons | two cells on one side | — | Multiple addons | — |
| checkbox / radio addon | 36 px cell | the control's own role | Checkbox and radio | holds a checkbox and a radio in addons, reached with Tab and toggled with Space |
| select addon | borderless cell | `role="combobox"` | Select | holds a select in an addon that opens with Enter and chooses with the arrow keys |
| clearable input | × after the text | `button` named by `clear` | (Password input's Clear) | empties a clearable input and moves the focus back with Enter on its clear button |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On the clear button of a clearable input: empties the input and moves the focus back to it | native button |
| Space | On a checkbox addon: toggles it (the checkbox's own key) | APG Checkbox |

**Notes.** A `Select` trigger in an `sm` group keeps its own size; give it `size="sm"`. The group's look keeps the icon
inside the edge with no divider (the package's look since 0.1.1), where the visual target draws an icon addon as a cell.

### Behaviour details

**Addon click.** A click on an addon focuses `[data-slot=input-group-control]` (then any visible input or textarea). It
used to focus the first `input`, which in a form is the hidden input a Radix Checkbox or RadioGroupItem in an addon
keeps, so the focus went to an invisible element. `InputGroupText` has `data-slot="input-group-text"`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| checkbox cell clicked, in a form | the text input has focus | — | Checkbox and radio | focuses the text input, not the checkbox’s hidden form input, when a checkbox cell is clicked in a form |
| text addon | — | `data-slot="input-group-text"` | Prefix and suffix | gives InputGroupText its data-slot |

## Input — additions

### Key filter

**Status:** built (0.1.1) · **Completeness references:** the visual target's key filter.

**API added:** `keyFilter?: "int" | "num" | "money" | "hex" | "alpha" | "alphanum" | RegExp` (exported type
`InputKeyFilter`). Presets test each typed or pasted character: `int` digits and `-`; `num` digits, `-` and the provider
locale's decimal separator; `money` digits with the locale's decimal and group separators (a space when the group is
space-like); `hex` 0–9 a–f; `alpha` any Unicode letter; `alphanum` letters and digits. A RegExp is tested per character,
or, written `^…$`, against the whole value the edit would leave. No strings. Works on `InputGroupInput` too.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| preset | refused characters never appear | — | Key filter | types only the characters its preset takes |
| locale separators | `,` takes the decimal place in German | — | Key filter | takes the provider locale's separators in the number presets |
| per-character RegExp | — | — | Key filter regex | tests a regular expression against each character |
| whole-value RegExp | — | — | Key filter regex | tests a ^…$ regular expression against the whole value the edit would leave |
| in a group, deleting, clearing | unaffected | — | — | filters inside an input group too, and leaves deleting and clearing alone |

| Key | Behaviour | Source |
| --- | --- | --- |
| characters | typed only when the filter takes them | the visual target's key filter |
| Ctrl/Cmd+V | pasted only when the filter takes all of it | the visual target |

**Notes.** Filtering is on `beforeinput` and `paste`; composition (IME) and autofill are not filtered, and a refused key is
not announced: name the accepted characters in the label or a hint.

**Status:** built (0.1.1) · **Stock:** shadcn `input`, with the patches in `PATCHES.md`. The file is now a client module
(`"use client"`): the size and look come from the provider, and the clear button keeps state.
**Completeness references:** Base UI Input <https://base-ui.com/react/components/input> · React Aria TextField
<https://react-aria.adobe.com/TextField> · the visual target's input text and icon field.

**API added:** `size?: ControlSize` (`"sm" | "default" | "lg"`; the native numeric `size` attribute is omitted from the
props type), `variant?: FieldVariant` (`"default" | "filled"`), `clearable?: boolean`. `size` and `variant` fall back to
the provider's `controlSize` and `fieldVariant`. No new string: the clear button reads the existing `clear` key. Without
`clearable` the DOM is still one bare `input`; with it, the input and a `button data-slot="input-clear"` sit in a
`div data-slot="input-wrapper"` (inside an `InputGroup`, the button is a part of the group instead). `className` stays on
the input. Icons go in through `InputGroup` (the **With icon** example), which already draws the visual target's icon
field: a 14 px icon in `--control-hover`, 10 px from the edge, the text 34 px in.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Sizes | one size | `sm` 28 px (4 × 8 px padding, 12 px text), `default` 35 px, `lg` 42 px (8 × 12 px, 16 px text); the file button's text follows | The visual target's sizes. |
| Filled | none | `variant="filled"`: `--field-filled`, unchanged on hover and focus; disabled keeps `--field-disabled` | The visual target's filled variant. |
| Clear | none | a 14 px × (12 / 16 px in `sm` / `lg`) in a 24 px button, 10 px from the end, `--control-hover`, `--foreground` on hover; the input's end padding grows to 34 px (28 / 40 px) while it can be cleared | The visual target's clear icon. The padding stays while the input is empty, so the text never moves when the × appears. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 28 / 35 / 42 px | `data-size` on the input | Sizes | sets its size as data-size, the provider size when it has none |
| filled | `--field-filled` fill | `data-variant="filled"` | Filled | sets the filled look as data-variant, the provider look when it has none |
| clearable, with a value | the × at the end | `button` named by `clear` | Clear | shows the clear button only while there is a value |
| cleared | empty input, focus in it, no × | `onChange` called with `""` | Clear | empties the input, calls onChange and puts the focus back when the clear button is clicked |
| clearable, disabled or read-only | no × | — | — | has no clear button when disabled or read-only |
| form reset | the × follows the reset value | — | — | hides the clear button when its form is reset to an empty default |
| with icon | icon inside, text clear of it | via `InputGroup` | With icon | (InputGroup's tests) |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves from a clearable input with a value to its clear button | native tab order |
| Enter, Space | On the clear button: empties the input and moves the focus back to it | native button; the visual target's clear icon |

**Notes.** Clearing sets the value through the native setter and dispatches an `input` event, so React's `onChange` sees
an ordinary change, for controlled and uncontrolled inputs alike. The pointer never takes the focus out of the field:
the button prevents its `mousedown`. Keyboard users reach the button with Tab, unlike the visual target's icon, which only
the pointer can use.

## Native select — additions

**Status:** built (0.1.1) · **Stock:** shadcn `native-select` · **Pattern:** WAI-ARIA APG Select-only combobox
<https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>

**API added.** `size?: "sm" | "default" | "lg"` (adds `lg`; defaults to the provider's `controlSize`),
`variant?: "default" | "filled"` (defaults to the provider's `fieldVariant`), `fluid?: boolean` (on the wrapper). The
module is now a client module (`"use client"`), as it reads the provider.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| lg | none | 42 px: 8 × 12 px, 16 px text, a 48 px end column, a 16 px chevron 11 px from the end | The visual target's large field. |
| Filled | none | `--field-filled`, kept on hover and focus | The visual target's filled variant. |
| Fluid | none | the wrapper `w-full` | The visual target's fluid prop. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| lg | 42 px field | `data-size="lg"` | Sizes | sets lg and filled on the select, and fluid on the wrapper |
| filled | `--field-filled` fill | `data-variant="filled"` | Filled | sets lg and filled on the select, and fluid on the wrapper |
| fluid | full width | — | Fluid | sets lg and filled on the select, and fluid on the wrapper |
| provider size and look | the provider's values when none is given | `data-size`, `data-variant` | — | takes the provider controlSize and fieldVariant when given none |

No key changes.

## Pagination — additions

- `PaginationFirst`, `PaginationLast`: `PaginationLink` props; `aria-label` from `firstPage` / `lastPage`;
  `ChevronsLeftIcon` / `ChevronsRightIcon` with `rtl:rotate-180`; `data-slot="pagination-first"` / `"pagination-last"`.
- `PaginationPages` `showEdges?: boolean` (default `false`): First before Previous, Last after Next, dimmed,
  `aria-disabled` and `tabIndex={-1}` at the ends.
- Strings `firstPage` = "Go to first page", `lastPage` = "Go to last page".

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| first and last | « ‹ 1 2 3 4 5 … 20 › » | named links | First and last | adds First and Last with showEdges, named from the provider, going to the first and last page |
| at an end | First / Last at 60 % | `aria-disabled="true"`, `tabindex="-1"` | First and last | dims First on the first page and Last on the last, out of the tab order |

**Status:** built (0.1.1) · **Stock:** shadcn `pagination`, with the patches in `PATCHES.md`. New parts compose the
package's `Select` and `Input`.
**Pattern:** [APG Landmarks: navigation](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/navigation.html) ·
**Completeness references:** [React Aria](https://react-spectrum.adobe.com/react-aria/) has none; MUI `usePagination`
(siblings and boundaries); the visual target's paginator (siblings, template, custom text, with input).

**API added** (flat parts, each fed the list's state; no `PaginationBar`: a bar with every part's props would duplicate
them and fix one layout, while products lay their table footers out differently — the Full bar example composes it in
five lines):

- `getPaginationItems({ page, pageCount, siblings = 1, boundaries = 1 })` → `(number | "ellipsis-start" | "ellipsis-end")[]`;
  type `PaginationItemValue`. A gap of one page shows the page, so the list keeps one length.
- `PaginationPages` — `page`, `pageCount`, `onPageChange?`, `getHref?`, `siblings?`, `boundaries?`; renders
  `PaginationContent` with Previous, the numbers (formatted in the provider locale), ellipses and Next. Previous / Next at
  the ends: `aria-disabled`, `tabIndex={-1}`, dimmed.
- `PaginationRange` — `page`, `pageSize`, `total`; `role="status"`; text from `pageRange` with `fillString`, numbers by
  `Intl.NumberFormat(locale)` from `useUiLocale()`; `unicode-bidi: plaintext`.
- `PaginationRowsPerPage` — `value`, `onValueChange`, `options = [10, 20, 50]`, `size = "sm"`; a `Select` named by its
  visible `rowsPerPage` label (`aria-labelledby`).
- `PaginationJump` — `page`, `pageCount`, `onPageChange`; a 48 × 28 px `type="number"` field labelled `goToPage`, `min` 1,
  `max` `pageCount`; Enter commits (clamped), blur restores the current page, follows `page` when it changes.
- New strings: `rowsPerPage` = "Rows per page", `pageRange` = "{start}–{end} of {total}", `goToPage` = "Go to page".

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| siblings | pages around the current, gaps as ellipses | `aria-current="page"` on the current | Siblings | draws the pages from page and pageCount, siblings either side, and changes page on a click |
| page window | — | — | — | computes the pages around the current one, with gaps, keeping one length |
| first / last page | Previous / Next dimmed | `aria-disabled="true"`, `tabindex="-1"` | Full bar | dims Previous on the first page and Next on the last, out of the tab order |
| range | "21–30 of 120", muted 14 px | `role="status"` | Range text | writes the range of rows from the provider string, numbers in the provider locale |
| empty range | "0–0 of 0" | — | — | writes an empty range as 0–0 |
| rows per page | label + 28 px select | `combobox` named by the label, `data-size="sm"` | Rows per page | changes the rows per page from its labelled select, with Enter and the arrow keys |
| jump | label + 48 × 28 px field | `spinbutton`, `min`, `max` | Jump to page | goes to the page typed when Enter is pressed, kept within the pages |
| jump, left without Enter | the current page back | — | Jump to page | puts the current page back in the jump field when it is left without Enter, and follows the page |
| translated jump | — | name from `goToPage` | — | names the jump field from the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter | In the jump field, goes to the page typed (clamped to 1…pageCount). | patch; test "goes to the page typed when Enter is pressed, …" |
| Enter | On the rows-per-page select, opens the list; in the list, chooses. | Radix Select; test "changes the rows per page …" |
| ArrowDown | In the open rows-per-page list, moves to the next number. | Radix Select; same test |

**Notes.** The entry now imports `select` and `input`, so its size grows (request filed).

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| one page | page 1 current; First, Previous, Next and Last dimmed | `aria-disabled`, `tabIndex=-1` | — | draws one page, or none, with every way to move dimmed, when pageCount is 1 or 0 |
| no pages (`pageCount` 0) | no numbers; Previous and Next dimmed | as above | — | as above |
| page size not among `options` | the size in use is listed in order among the options | select shows it | — | shows a page size that is not among the options, as a choice in its place |

## Password input — additions

Medium strength: `bg-warning-solid` (was `bg-warning`). Test: the meter carries `bg-warning-solid` at medium.

### Rules and strength

**Status:** built (0.1.1) · **Completeness references:** the visual target's password requirements, strength meter and
popover; Polaris and Carbon password guidance.

**API added:** `rules?: { label: string; test(value): boolean }[]` (type `PasswordRule`), `strength?: boolean`,
`scoreStrength?(value): "weak" | "medium" | "strong" | null` (type `PasswordStrength`; default the exported
`scorePasswordStrength`: strong from 12 characters with three of lower, upper, digit, symbol; medium from 8 with two;
weak otherwise; null when empty), `feedback?: "inline" | "popover"`. With rules or a meter the group and its feedback sit in
`div data-slot="password-input"`; `className` stays on the group. Parts: `password-input-feedback`,
`password-input-strength` (`data-level`), `password-input-meter`, `password-input-rules`, `password-input-rule`
(`data-met`), `password-input-status`, `password-input-popover`. Strings: `passwordStrength` ("Password strength:
{level}"), `strengthWeak`, `strengthMedium`, `strengthStrong`, `ruleMet` ("{label}: met"), `ruleNotMet` ("{label}: not met").

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rule not met | 14 px × in `--control-hover`, label `--muted-foreground` | sr-only "{label}: not met" | Rules | lists the rules, each read as met or not met, and ticks them as the value meets them |
| rule met | 14 px ✓ in `--success`, label `--success-tag-foreground`, struck through | sr-only "{label}: met", `data-met` | Rules | (same) |
| change announced | — | polite `role="status"` region, one line per change | Rules | announces a rule met or lost politely |
| described | — | the input's `aria-describedby` includes the feedback | Rules | describes the field with its checklist |
| meter weak / medium / strong | 6 px track `--border`; a third `--destructive`, two thirds `--warning`, all `--success`; the level as a Badge tag | `data-level`; sr-only "Password strength: …" | Strength | shows the meter only while there is a value, with the level read and announced |
| empty value | no meter | — | Strength | (same) |
| custom score | — | — | — | takes its own score through scoreStrength |
| popover | the feedback in a 288 px panel (at least the field's width) below the field while it has focus; Escape hides it until the next change | panel `role="group"`, focus stays in the input | Rules in a popover | shows the feedback in a panel while the field has focus, and Escape hides it until the next change |
| translated | — | the six strings | — | reads its rule and strength words from the provider strings |
| none | unchanged DOM | — | Basic | keeps its look and behaviour without rules or a meter |

| Key | Behaviour | Source |
| --- | --- | --- |
| Escape | with `feedback="popover"`: hides the panel until the value changes | Radix Popover dismiss |

**Notes.** The panel is Radix Popover anchored to the group (`role` overridden from `dialog` to `group`: it holds no
controls); it never takes focus, and a press on it keeps the focus in the field. The score is a guide, not a check against
leaked passwords; rules and meter do not set `aria-invalid`.

**Status:** built (0.1.1) · **Stock:** none (the products' composition of `InputGroup`, `InputGroupInput` and `Button`).
**Completeness references:** the visual target's input password (its toggle mask, clear icon, sizes and filled demos).
Its rules list and strength meter come with a later batch.

**API added:** `size?: ControlSize` (the group, the input and the eye scale together: a 20 / 24 / 28 px button round a
12 / 14 / 16 px eye, 8 / 10 / 12 px from the edge), `variant?: FieldVariant` (on the group), `clearable?: boolean`
(passed to `InputGroupInput`). The props type is now `InputGroupInput`'s without `type`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 28 / 35 / 42 px | `data-size` on the group and the input | Sizes | sets its size as data-size on the group and the input, the provider size when it has none |
| filled | `--field-filled` on the group | `data-variant="filled"` on the group | Filled | sets the filled look as data-variant on the group, the provider look when it has none |
| clearable, with a value | a × 34 px from the end, before the eye (10 px apart), the text clear of both (58 px) | `button` named by `clear` | Clear | puts the clear button between the input and the eye in the tab order |
| cleared | empty, focus in the field | `onChange` with `""` | Clear | empties the field, calls onChange and moves the focus back with Enter on the clear button |
| disabled | no × | — | Disabled | has no clear button when disabled |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On the clear button: empties the field and moves the focus back to it | native button |

### Behaviour details

**Form reset.** An uncontrolled field reads its input again after a form reset, so the checklist and the meter follow.
**Escape** in the `popover` feedback hides the panel until the next change; the keys table on the page now lists it
(tested by "shows the feedback in a panel while the field has focus, and Escape hides it until the next change").

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| after a form reset | checklist and meter of the reset value | `data-met` | — | follows a form reset with its checklist and meter |

| Key | Behaviour | Source |
| --- | --- | --- |
| Escape | with `feedback="popover"`: hides the panel, the focus stays in the field | Radix DismissableLayer |

## Popover — additions

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Opened from a modal Dialog or Sheet | a long list in the content scrolls with the wheel and touch | events that scroll something inside stop on the content; others reach the dialog's lock, which cancels them | — | "scrolls with the wheel and touch when opened from a modal dialog, whose scroll lock still holds the page" |

## Progress — additions

**Status:** built (0.1.1) · **Stock:** `progress` · **Pattern:** ARIA `progressbar`
<https://www.w3.org/TR/wai-aria-1.2/#progressbar> · **Completeness references:** Base UI Progress
<https://base-ui.com/react/components/progress> · React Aria ProgressBar <https://react-aria.adobe.com/ProgressBar>

**API added:** `size?: "sm" | "default" | "lg"` (8, 18, 24 px; explicit only, an indicator rather than a control, so it
does not follow the provider's `controlSize`), `steps?: number` (equal segments filled in turn from one value),
`showValue?: boolean` (the value inside the fill; not at `sm`, in segments or indeterminate). `max` now drives the fill
(`value / max`); before, the indicator assumed 100. `getValueLabel` defaults to a percentage formatted with `Intl` in the
provider's `locale` and is both `aria-valuetext` and the text drawn with `showValue`. No value now draws a sliding bar.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| No value | an empty track | a 40 %-wide bar sweeping the track (tw-animate's `enter` keyframes on `transform`, 2 s, `--bui-ease-standard`); under reduced motion it rests centred (30–70 %) | The visual target's indeterminate bar, without animating layout. |
| Value text | Radix's English "60%", read aloud only | `Intl` percent in the provider's locale, or `getValueLabel`; drawn inside the fill with `showValue` (10 px semibold, 12 px at `lg`, `--primary-foreground`, centred on the fill by a transform that follows the fill's, `aria-hidden`) | The visual target's label inside the bar; one text for eyes and ears. |
| `max` | the indicator assumes 100 | the fill is `value / max` | A count such as 512 of 1,024. |
| Sizes | one height | `sm` 8 px, `default` 18 px, `lg` 24 px | Suite completeness. |
| Segments | none | `steps={n}`: n segments 4 px apart, each its own `--border` track with a 6 px radius | The visual target's "as steps". |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| value shown | "50%" centred in the fill | `aria-valuetext="50%"`; the label `aria-hidden` | Value | writes the value inside the bar with showValue, hidden from assistive technology, matching aria-valuetext |
| locale | "50 %" in French | `aria-valuetext` in the provider's locale | — | formats the percentage in the provider’s locale |
| formatter | "512 of 1,024 sent" | `aria-valuemax="1024"`, `aria-valuetext` = the label | Formatter | fills value out of max, and shows getValueLabel’s text inside the bar and to screen readers |
| indeterminate | a sweeping bar; centred and still under reduced motion | no `aria-valuenow`/`aria-valuetext`, `data-state="indeterminate"` | Indeterminate | slides an indeterminate bar with no value, without aria-valuenow or a value label |
| steps | segments filled in turn | one `progressbar`; `[data-slot=progress-step]` with `data-state` complete/partial/empty | Steps | draws segments that fill in turn from one value |
| sizes | 8 / 18 / 24 px | `data-size` | Sizes | takes the sm, default and lg sizes, and draws no value at sm |

No keys: a progress bar takes no focus.

### Behaviour details

A `max` that is not a positive finite number falls back to 100; a value outside 0…`max` is clamped before it reaches Radix; `NaN` is indeterminate. Tests: clamps a value outside the range and repairs a bad max, without a console error or an indeterminate bar; labels a value out of a max other than 100 as its share of the max. Each segment's fill has `data-slot="progress-step-indicator"`.

## Radio group — additions

**Status:** built (0.1.1) · **Stock:** shadcn `radio-group` · **Pattern:** WAI-ARIA APG Radio Group
<https://www.w3.org/WAI/ARIA/apg/patterns/radio/> · **Completeness references:** Base UI Radio Group
<https://base-ui.com/react/components/radio-group> · React Aria RadioGroup <https://react-aria.adobe.com/RadioGroup>

**API added.** On `RadioGroup` and on `RadioGroupItem`: `size?: "sm" | "default" | "lg"` and
`variant?: "default" | "filled"`. An item's own prop wins over the group's, which wins over the provider's
`controlSize` / `fieldVariant`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Sizes | one 16 px circle | `sm` 14 px with an 8 px dot, `default` 18 px / 10 px, `lg` 20 px / 12 px | The visual target's sizes (its resolved CSS). |
| Filled | none | `--field-filled` while not chosen; chosen stays `--primary` | The visual target's filled variant. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 14, 18 and 20 px circles | `data-size` on each radio | Sizes | passes the group size and variant to its radios, and a radio keeps its own |
| provider size and look | the provider's values | `data-size`, `data-variant` | — | takes the provider controlSize and fieldVariant when given none |
| filled | `--field-filled` while not chosen | `data-variant="filled"` | Filled | passes the group size and variant to its radios, and a radio keeps its own |
| dynamic | radios rendered from an array | — | Dynamic | renders radios from an array and moves through them with the arrows |

No key changes.

## Scroll area — additions

**Status:** built (0.1.1) · **Stock:** shadcn `scroll-area`, with the patches in `PATCHES.md`.
**Completeness references:** [Radix Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area),
[Base UI Scroll Area](https://base-ui.com/react/components/scroll-area); the visual target's scroll area (both scrollbars,
scroll fade, variant).

**API added:** `ScrollArea` `fade?: boolean` — the viewport gets `data-fade` and, as it scrolls or resizes,
`data-fade-top` / `-bottom` / `-start` / `-end` (set on the element directly, no re-render); a `mask-image` of two
intersected linear gradients fades 40 px at each marked edge (the inline gradient turns round in RTL). No layout animation.

Both scrollbars and the visibility variants need no new API: `<ScrollBar orientation="horizontal" />` beside the built-in
vertical bar, and Radix `type` (`auto`, `hover`, `scroll`, `always`). The visual target's `hidden` variant is left out: a
box with no sign that it scrolls loses people; `fade` is the quiet hint instead.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Fade | none | `fade` | The target's scroll fade. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| both bars | a bar on each axis and the corner | two `scroll-area-scrollbar`s, `data-orientation` vertical and horizontal | Both scrollbars | renders a vertical and a horizontal bar together, with the corner between them |
| fade | the content fades at hidden edges | `data-fade`, `data-fade-top/-bottom/-start/-end` | Fade | marks the edges that hide content for the fade, and follows the scroll |
| no fade | unchanged | no `data-fade`, no mask | Vertical | has no fade unless asked |
| variant | bars by `type` | Radix `type` | Variant | — (visibility depends on hover and layout) |

No new keys.

**Notes.** The page's `focus` text and first limit were out of date since 0.1.1 (the viewport has been focusable when it
must be, through `useScrollFocus`); the docs page now says so.

### Behaviour details

A `ScrollBar` among the children is rendered after the viewport, beside the built-in vertical bar, so the viewport's
`fade` mask does not cover it. Test: draws a horizontal bar given as a child beside the viewport.

## Select — additions

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| empty, no placeholder | 35 px (28, 42) | — | Float label With a select | keeps an empty value line one line tall when there is no value and no placeholder |

**Status:** built (0.1.1) · **Stock:** shadcn `select` · **Pattern:** WAI-ARIA APG Select-only combobox
<https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/> · **Completeness references:** Base UI
Select <https://base-ui.com/react/components/select> · React Aria Select <https://react-aria.adobe.com/Select>

**API added.**

- `SelectTrigger`: `size?: "sm" | "default" | "lg"` (adds `lg`; defaults to the provider's `controlSize`),
  `variant?: "default" | "filled"` (defaults to the provider's `fieldVariant`), `fluid?: boolean`, `clearable?: boolean`.
- `SelectItem`: `icon?: ReactNode` (leading media beside both lines, list only), `description?: ReactNode` (a second,
  muted line, list only). An item's children stay what the trigger shows when it is chosen.
- `Select` keeps the value itself and hands it to Radix controlled, so a clearable trigger can set it to `""`; its API
  (`value`, `defaultValue`, `onValueChange`) is unchanged.
- A clearable trigger renders in a wrapper, `data-slot="select-control"`, with the clear button beside the trigger
  (`data-slot="select-clear"`), not inside it: a button cannot contain a button. The wrapper is as wide as the trigger;
  `fluid`, or `w-full` on the trigger, widens both.
- The selected-option check mark is the default (no prop); the Basic example says so.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Sizes | `sm` 32 px, `default` 36 px | `sm` 28 px (4 × 8 px, 12 px text, 12 px chevron), `default` 35 px, `lg` 42 px (8 × 12 px, 16 px text, 16 px chevron); the chevron centred in a 36 px column at every size | The visual target's three sizes. |
| Filled | none | `variant="filled"`: `--field-filled`, kept on hover and focus | The visual target's filled variant. |
| Fluid | none | `fluid`: `w-full` | The visual target's fluid prop. |
| Clear | none | `clearable`: a 24 px button with a 14 px × in `--control-hover` (`--foreground` on hover) just before the chevron column, shown while a value is chosen | The visual target's Clear demo; a 24 px target meets WCAG 2.5.8. |
| Custom option | children only, all copied to the trigger | `icon` and `description`, shown in the list only; the option is 8 px taller with 12 px between media and text | The visual target's Custom Option demo, without the trigger repeating the media. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 28, 35 and 42 px triggers | `data-size` on the trigger | Sizes | sets data-size and data-variant on the trigger, from its props or the provider |
| provider size and look | the provider's `controlSize` and `fieldVariant` when the trigger sets none | `data-size`, `data-variant` | — | takes the provider controlSize and fieldVariant when given none |
| filled | `--field-filled` fill | `data-variant="filled"` | Filled | sets data-size and data-variant on the trigger, from its props or the provider |
| fluid | full width | — | Fluid | fills its container with fluid |
| clearable, nothing chosen | no clear button | — | Clear | shows no clear button while nothing is chosen |
| clearable, a value chosen | the × before the chevron | `button`, named by the `clear` string | Clear | clear (uncontrolled) …; clear (controlled) …; names the clear button from the provider string |
| clearable, disabled | no clear button | — | — | hides the clear button while the select is disabled |
| option with icon and description | media beside two lines; the trigger shows the label only | `role="option"`, the description inside the option's name | Custom option | shows an item icon and description in the list, and only the label in the trigger |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | With `clearable` and a value chosen, moves from the trigger to the clear button | native tab order |
| Enter, Space | On the clear button: sets the value to `""`, calls `onValueChange("")`, returns focus to the trigger | native button |

**Strings:** `clear` ("Clear"), the clear button's name; shared with every clearable field.

**Notes.** Width classes on a clearable trigger (`w-48`, `w-full`) still size it; a layout class that must reach the
outer box (`flex-1`) goes on a wrapper of the consumer's. The clear icon is `--control-hover` by the package's clear
convention; the visual target draws it in the text colour.

## Separator — additions

**Status:** built (0.1.1) · **Stock:** shadcn `separator`, with the patches in `PATCHES.md`.

**API added:** `variant?: "solid" | "dashed" | "dotted"`; `children` (content inside the line);
`align?: "start" | "center" | "end" | "top" | "bottom"` (`top` and `bottom` are `start` and `end` on a vertical line).
Parts with content: `separator-line` (twice, `aria-hidden`) and `separator-content`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Dashed, dotted | solid only | a 1 px `--border` border, dashed or dotted | The visual target's divider types. |
| Content | none | lines either side of the content, 6 px from it; a 14 px line before it (`start`) or after it (`end`), or lines filling both sides (`center`); 6 px on a vertical line | The target's divider content and alignment, drawn without a background patch so it works on any surface. |
| Name | — | a real separator (`decorative={false}`) with content is named by it (`aria-labelledby`) | A separator's children are presentational, so its text would otherwise be lost. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| dashed / dotted | a dashed or dotted 1 px line | `data-variant` | Dashed and dotted | draws a dashed or dotted line, solid by default |
| with content | the content between two lines | `data-align`; decorative: `role="none"`, the text read in the flow | With text | puts content inside the line, read in the flow when decorative |
| real, with content | as above | `role="separator"`, `aria-labelledby` → the content, `aria-orientation` when vertical | Vertical with text | names a real separator after its content |
| alignment | start, centre, end | `data-align`: `start`, `center` or `end` | Alignment | aligns the content at the start, the centre or the end |

No keys: it is not a window splitter.

## Sheet — additions

**Status:** built (0.1.1) · **Stock:** shadcn `sheet`, with the patches in `PATCHES.md`.
**Pattern:** [APG Dialog (Modal)](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) · **Completeness references:**
[Base UI Drawer](https://base-ui.com/react/components/drawer); the visual target's drawer (full screen).

**API added:** `SheetContent` `size?: "default" | "full"` — `full` covers the window below the WordPress admin bar, edged
all round, still sliding from its `side` (the same prop name and value as Dialog's `size="full"`). `SheetContent` now also
carries `data-side` and `data-size`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Full screen | none | `size="full"` | The target's full-screen drawer. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| full | the whole window below the admin bar, slides from its side | `data-size="full"`, `data-side` | Full screen | covers the window with size="full", still sliding from its edge |
| default | unchanged | `data-size="default"` | Basic | keeps the panel size by default |

No new keys.

**Notes.** The visual target's full drawer fades and zooms in; ours keeps the slide of its side, so every sheet moves the
same way.

### Behaviour details

Left, right and top panels start below the WordPress admin bar (`top: var(--wp-admin--admin-bar--height, 0px)`); top and
bottom panels are at most `100dvh` less the admin bar. Focus on close as Dialog's. Test: "returns focus to the menu
button when a menu item opened it, since the item leaves with its menu".

## Sidebar — additions

**Status:** built (0.1.1) · **Stock:** shadcn `sidebar`, unchanged in this batch: examples and documentation only.
**Completeness references:** the visual target's sidebar (variants, dual sidebar, nested menu); shadcn's sidebar blocks
(a fixed second sidebar with `collapsible="none"`).

No API change. New examples: **Floating** (`variant="floating"`), **Inset** (`variant="inset"`), **Dual sidebar** (a
collapsible left sidebar and a fixed right one, `collapsible="none"`, from 768 px), **Nested menu** (`Collapsible` around
`SidebarMenuSubItem`s, a `SidebarMenuSub` inside a sub-item for each deeper level; each chevron turns by its own heading's
`data-state`, so a closed level inside an open one stays closed).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| floating / inset | card with a margin / page in a card | `data-variant` | Floating, Inset | reaches the floating and inset variants through data-variant |
| dual | a fixed second sidebar | two `data-slot="sidebar"` | Dual sidebar | keeps a second, fixed sidebar while Ctrl+B collapses the first |
| nested | sub-menus inside sub-menus | `aria-expanded` on each heading | Nested menu | opens and closes each level of a nested menu with Enter and Space |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On a menu heading that opens a sub-menu, opens or closes it. | Radix Collapsible; test "opens and closes each level of a nested menu with Enter and Space" |

**Notes.** Two sidebars that collapse on their own are not possible with the stock provider: it holds one open state, and
two providers would both answer Ctrl+B and share the saved state (`sidebarStorageKey`). The second sidebar is fixed, as in
shadcn's own two-sidebar block. Multi sidebar (the target's icon rail beside a panel) is not built.

## Switch — additions

**Status:** built (0.1.1) · **Stock:** shadcn `switch` · **Pattern:** WAI-ARIA APG Switch
<https://www.w3.org/WAI/ARIA/apg/patterns/switch/> · **Completeness references:** Base UI Switch
<https://base-ui.com/react/components/switch> · React Aria Switch <https://react-aria.adobe.com/Switch>

**API added.** `size` takes `lg` and defaults to the provider's `controlSize`; `checkedIcon?: ReactNode` and
`uncheckedIcon?: ReactNode` draw an icon in the thumb for each state.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| lg | none | a 44 × 26 px track, an 18 px knob 4 px from the ends | The visual target has one size; lg follows the default's proportions for the suite's three sizes. |
| Thumb icons | none | an icon as large as the knob: `--muted-foreground` off (`--card` in dark), `--primary` on, `--field-disabled` (dark: `--field-disabled-foreground`) when disabled | The visual target's Template demo and its handle colours. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| lg | 44 × 26 px | `data-size="lg"` | Sizes | sets the size attribute to lg, and takes the provider controlSize when given none |
| provider size | the provider's `controlSize` | `data-size` | — | sets the size attribute to lg, and takes the provider controlSize when given none |
| with icons | a check in the knob when on, a cross when off | the icons are decorative; `aria-checked` carries the state | With icons | renders the thumb icons, both decorative, and still toggles with Space |

| Key | Behaviour | Source |
| --- | --- | --- |
| Space | Flips a switch with thumb icons, as any switch | APG Switch (test: renders the thumb icons, both decorative, and still toggles with Space) |

## Table — additions

### Behaviour details

Notes. The scroll container (`table-container`) becomes a tab stop while the table overflows and holds nothing
focusable (`useScrollFocus`); the documentation's focus and limits text now says so. Test: makes a table wider than its
box a tab stop while nothing inside it can take focus.

## Tabs — additions

**Status:** built (0.1.1) · **Stock:** `tabs` · **Pattern:** WAI-ARIA APG Tabs
<https://www.w3.org/WAI/ARIA/apg/patterns/tabs/> (Delete: the pattern's optional deletion key) ·
**Completeness references:** Base UI Tabs <https://base-ui.com/react/components/tabs> · React Aria Tabs
<https://react-aria.adobe.com/Tabs>

**API added:**

- `TabsList` `scrollable?: boolean`: the list scrolls sideways inside a box that carries the variant's line, with a
  previous and a next button over the ends that show only while there is more that way. With it, `className` styles that
  box. Horizontal lists only.
- `TabsTrigger` `onClose?: () => void`: an × after the label and Delete or Backspace on the focused tab. The consumer
  removes the tab in it; a closed tab that was selected hands the selection and focus to its neighbour (the next enabled
  tab, else the previous); one that only had focus hands focus. The trigger now carries `data-value`.
- `TabsIndicator` (new part): one bar, last inside `TabsList`, that slides to the selected tab with `transform` only
  (`translateX` + `scaleX`, vertical: `translateY` + `scaleY`), at `--bui-duration-slow` with `--bui-ease-standard`, after
  the first position is drawn. The tabs' own bars are hidden while it is present.
- `Tabs` keeps the selected value in its own state as well as handing it to Radix (controlled or not), so a trigger can
  select its neighbour on close. `value`, `defaultValue` and `onValueChange` behave as before.
- Strings: `scrollTabsBackward` ("Scroll tabs backward"), `scrollTabsForward` ("Scroll tabs forward"), `closeTab`
  ("Close {label}").

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Long lists | wrap or overflow the box | `scrollable`: one scrolling row, a 36 px previous/next button over each end while there is more, `--background` with a soft glow of it over the tabs they cover | The visual target's scrollable tabs. |
| Closing | none | `onClose`: an × (a 20 px round target, 12 px icon, `--accent` on hover) and Delete/Backspace; neighbour selected and focused | Closable tabs, with the APG's Delete key. |
| Indicator | each tab draws its own bar | `TabsIndicator`: one sliding bar | The visual target's line indicator, without animating layout. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| scrollable, more after | the next button over the inline end | `button` named `scrollTabsForward`, `tabindex="-1"` | Scrollable | shows the next button only while there is more, scrolls with it, then shows the previous one |
| scrollable, RTL | the buttons swap ends; forward scrolls toward the inline end | `dir="rtl"` | Scrollable (RTL) | scrolls toward the inline end in RTL, and names the buttons from the provider |
| closable | an × after the label | `aria-keyshortcuts="Delete"` on the tab; the × is `aria-hidden` with `title` "Close {label}" | Closable | names the × from the provider, hides it from assistive technology, and announces the Delete key |
| closed by pointer, background tab | the tab goes; the selection stays | — | Closable | closes a background tab with its × and keeps the selection where it was |
| closed by pointer, selected tab | the neighbour is selected and focused | — | Closable | closes the selected tab with its × and selects the neighbour |
| manual activation | arrows move focus only; the selection stays until Enter/Space | Radix `activationMode="manual"` | Manual activation | with manual activation, moves focus with the arrow keys and selects with Enter |
| controlled | follows `value` set from outside | — | Controlled | follows a controlled value set from outside the tabs |
| sliding indicator | one bar under the selected tab | `[data-slot=tabs-indicator]`, `aria-hidden`, `data-ready` after the first frame | Custom indicator | hides the tabs’ own bars and moves to the selected tab with a transform |

| Key | Behaviour | Source |
| --- | --- | --- |
| Right / Left Arrow (scrollable) | Moves to the next or previous tab, which scrolls into view | APG Tabs; the browser scrolls the focused tab into view |
| Enter / Space (manual activation) | Selects the focused tab | APG Tabs, manual activation; Radix |
| Delete / Backspace (closable tab) | Closes the focused tab; the neighbour takes focus, and the selection when the closed tab had it | APG Tabs, optional Delete |

Notes:

- The scroll buttons sit outside the `tablist` (a button inside it breaks `aria-required-children`) and out of the tab
  order: the list stays one tab stop, and the arrow keys already bring every tab into view. Screen readers can still
  reach them by name.
- A button cannot sit inside a tab (`nested-interactive`), so the × is a pointer target hidden from assistive technology;
  keyboard users close with Delete, announced by `aria-keyshortcuts`. The docs advise a close action in the panel too.
- The indicator measures the selected tab's `offsetLeft`/`offsetWidth` (ResizeObserver and MutationObserver keep it
  current) and is positioned with physical `left-0`/`origin-left`, since `offsetLeft` is physical in both directions.
- Closing the last tab leaves nothing to focus; the consumer decides.

### Behaviour details

**Scrollable list.** The selected tab is scrolled wholly into view on mount (instantly), whenever the selected tab
changes (an attribute or child mutation: a value set from outside, a new tab added selected) and the focused tab on
`focusin` (smoothly), each clear of the 36 px scroll buttons, clamped to the list's scroll range, in both directions. A
consumer `ref` on a scrollable `TabsList` is composed with the list's own. Tests: scrolls the selected tab into view
clear of the buttons, on load and when the selection changes; hands a ref to the scrollable list and keeps its buttons
working.

## Textarea — additions

**Status:** built (0.1.1) · **Stock:** shadcn `textarea`, with the patches in `PATCHES.md`. The file is now a client
module (`"use client"`): the size and look come from the provider.
**Completeness references:** React Aria TextField <https://react-aria.adobe.com/TextField> · the visual target's textarea.

**API added:** `size?: ControlSize`, `variant?: FieldVariant`, both falling back to the provider's `controlSize` and
`fieldVariant`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Sizes | one size | `sm` 4 × 8 px padding and 12 px text, `default` 6 × 10 px and 14 px, `lg` 8 × 12 px and 16 px; the 64 px minimum stays | The visual target's sizes. |
| Filled | none | `variant="filled"`: `--field-filled`, unchanged on hover and focus; disabled keeps `--field-disabled` | The visual target's filled variant. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 12 / 14 / 16 px text | `data-size` | Sizes | sets its size as data-size, the provider size when it has none |
| filled | `--field-filled` fill | `data-variant="filled"` | Filled | sets the filled look as data-variant, the provider look when it has none |

No key changes.

## Toast — additions

**Status:** built (0.1.1) · **Stock:** `sonner` · **Pattern:** WAI-ARIA APG Alert
<https://www.w3.org/WAI/ARIA/apg/patterns/alert/> · **Completeness references:** Base UI Toast
<https://base-ui.com/react/components/toast> · React Aria Toast <https://react-aria.adobe.com/Toast>

**API:** unchanged; Sonner's own options, now with examples: `position` on `Toaster` (six places), `duration: Infinity`
(sticky), `toast(…, { id })` (update in place), `toast.custom((id) => …)` (rich content), `expand` on `Toaster`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Custom and unstyled toasts | — (stock themes nothing) | the package's card, title and content rules apply only to Sonner's own toasts (`data-styled="true"`); a `toast.custom()` or `unstyled` toast is left as its author draws it (no padding, shadow, end padding or medium title forced onto it) | Before, the card's padding, shadow and the title's medium weight landed on custom content, around a box with no fill. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sticky | stays until closed | `duration: Infinity` | Sticky | keeps a sticky toast past the timeout, then closes it with toast.dismiss(id) |
| updated | the same toast changes type and text | one `[data-sonner-toast]`, `data-type` changes | Update | updates a toast in place by its id |
| custom | the author's card in the stack; no close button | `data-styled="false"` | Custom | leaves a custom toast as its author draws it: no card rules, no close button |
| expanded | every toast open | `data-expanded="true"` | Expanded | shows every toast open with expand |
| position | the stack at the chosen place | `data-x-position`, `data-y-position` on the list | Position | places the stack with position |

No new keys.

### Behaviour details

`Toaster` merges `className` with its own `toaster group` classes (stock replaces them). The page now says what pauses
the timers: the pointer over the stack, or Alt+T until the pointer leaves or Escape; a toast reached with Tab alone keeps
counting.

## Toggle group — additions

**Status:** built (0.1.1) · **Stock:** shadcn `toggle-group` · **Pattern:** WAI-ARIA APG Radio Group (single)
<https://www.w3.org/WAI/ARIA/apg/patterns/radio/>

**API added.** `size` defaults to the provider's `controlSize` (the group's `data-size` is always set; an item's own
`size` still applies only when the group sets none); `fluid?: boolean`. `aria-invalid` on the group draws the error edge.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Fluid | none | the group `w-full`, each item `flex-1` | The visual target's fluid prop: the items share the width. |
| Invalid | none | joined (`spacing={0}`): one 1 px `--invalid` frame round the bar, drawn by the group's `::after` above the items; spaced: the `--invalid` edge on each item | The visual target's invalid group; a frame avoids notches where joined items meet. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 32, 35 and 38 px items | `data-size` on the group and items | Sizes | sets the provider controlSize on the group and its items when none is given |
| fluid | full width, equal items | — | Fluid | fluid: the group fills its container and the items share it |
| invalid | the `--invalid` frame | `aria-invalid="true"` on the group, the message in `aria-describedby` | Invalid | announces an invalid group with its message |
| controlled, required | one item always pressed | — | Controlled | controlled: a handler that ignores the empty value keeps one item pressed |

No key changes.

**Note.** `aria-invalid` on a `type="multiple"` group (role `group`) is announced by fewer screen readers than on a
radio group; the message in `aria-describedby` carries it.

### Behaviour details

`fluid` items stay equal (`flex-1`); when the group is narrower than its labels, a label of several words wraps, centred,
and a single word too long for its item is clipped at the item's end (`overflow-hidden justify-center-safe text-center
whitespace-normal wrap-break-word`), so no label runs over the next item. With room the group is unchanged. Test: fluid:
the group fills its container and the items share it.

## Toggle — additions

**Status:** built (0.1.1) · **Stock:** shadcn `toggle` · **Pattern:** WAI-ARIA APG Button (toggle button)
<https://www.w3.org/WAI/ARIA/apg/patterns/button/>

**API added.** `size` defaults to the provider's `controlSize` and is set as `data-size`; `fluid?: boolean`. Invalid
(`aria-invalid`, the `--invalid` edge) was already styled and is now documented and tested.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Fluid | none | `w-full` | The visual target's fluid prop. |
| Provider size | the variant default | the provider's `controlSize` | One app-wide size for every control. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| sizes | 32, 35 and 38 px | `data-size` | Sizes | sets data-size from its prop or the provider, with the matching classes |
| fluid | full width | — | Fluid | fills its container with fluid |
| invalid | the `--invalid` edge | `aria-invalid="true"`, the message in `aria-describedby` | Invalid | announces an invalid toggle with its message |

No key changes.

## Tooltip — additions

**Status:** built (0.1.1) · **Stock:** `tooltip` · **Pattern:** WAI-ARIA APG Tooltip
<https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/> · **Completeness references:** Base UI Tooltip
<https://base-ui.com/react/components/tooltip> · React Aria Tooltip <https://react-aria.adobe.com/Tooltip>

**API added:** `TooltipContent` `arrow?: boolean` (default `true`; `false` leaves the arrow out). Already there and now
documented with examples: `sideOffset` and `alignOffset` on `TooltipContent`, `delayDuration`, `open` and `onOpenChange`
on `Tooltip`. Radix has no closing delay, so none is offered.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Arrow | always drawn | drawn by default; `arrow={false}` leaves it out; it carries `data-slot="tooltip-arrow"` | The visual target shows tooltips with and without an arrow. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| without arrow | the label alone, no arrow | no `[data-slot=tooltip-arrow]` | Arrow | draws the arrow by default and leaves it out with arrow={false} |
| own delay | opens after its own `delayDuration` | — | Delay | waits for its own delayDuration instead of the provider’s |
| offset | moved by `sideOffset`, shifted by `alignOffset` from `align="start"`/`"end"` | `data-align` on the content | Offset | places the content with sideOffset and alignOffset without breaking it |
| controlled | follows `open`; Escape and a press outside report through `onOpenChange` | — | Controlled | follows a controlled open state and reports Escape through onOpenChange |
| on a non-button | a focusable element (`tabIndex={0}`) carries the tooltip | `aria-describedby` on the element while open | Standalone | opens on keyboard focus on a focusable element that is not a button |

No new keys: Tab (focus opens) and Escape (closes) as before.

Notes: the Standalone example puts a status tag in the tab order so keyboard users reach its explanation; the docs say
to prefer a real button whenever the element also acts. The Controlled example prevents `onPointerDownOutside` so the
switch that controls the tooltip does not close it first.

## Accordion

**Status:** built (0.1.1) · **Stock:** shadcn `accordion` (Radix Accordion), with the patches in `PATCHES.md`.
**Pattern:** WAI-ARIA APG Accordion <https://www.w3.org/WAI/ARIA/apg/patterns/accordion/> · **Completeness references:**
Base UI Accordion <https://base-ui.com/react/components/accordion> · React Aria Disclosure group
<https://react-aria.adobe.com/DisclosureGroup>

**API:** `Accordion` (Radix Root: `type` `single` | `multiple`, `collapsible`, `value` / `defaultValue` /
`onValueChange`, `disabled`, `orientation`, `dir`), `AccordionItem` (`value`, `disabled`), `AccordionTrigger`
(`indicator?: ReactNode` replaces the chevron; the trigger is the Tailwind group `accordion-trigger`), `AccordionContent`
(`forceMount`). Data slots: `accordion`, `accordion-item`, `accordion-header`, `accordion-trigger`, `accordion-indicator`,
`accordion-content`. No sizes or variants (the visual target has none).

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Header | no side padding, medium weight, underline on hover, text colour | 16 px padding, 14 px semibold on a 21 px line, `--muted-foreground`; `--foreground` when open or hovered; `--card` surface; 6 px outer corners on the first and last panel | The visual target's header (resolved CSS). |
| Rule | under every panel but the last | under every panel, the last included | The target. |
| Indicator | 16 px chevron, muted, turning over 200 ms | 14 px chevron in the header's colour, turning over `--bui-duration-control`; `indicator` replaces it | The target's chevron; its *Indicator* demo (plus / minus). |
| Focus | 3 px ring | 1 px `--ring` outline 1 px inside the header | The target (`outline-offset: -1px`). |
| Disabled | trigger at 50 % | the whole panel at 60 % | The target (`opacity: .6` on the panel). |
| Content | no padding, no colour | 0 16 px 16 px, `--card`, `--foreground` | The target. |
| Header slot | none | `data-slot="accordion-header"` | Every element carries a data-slot. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | muted semibold header, chevron down | `aria-expanded="false"`, `data-state="closed"` | Basic | renders headings with buttons that control their panels |
| open | header in `--foreground`, chevron up, content shown with the measured-height animation | `aria-expanded="true"`, region `aria-labelledby` its trigger | Basic, Multiple | opens and closes a panel with Enter |
| hover | header in `--foreground` | — | Basic | — |
| focus-visible | 1 px `--ring` outline inside the header | — | Basic | — |
| multiple open | several panels open | `type="multiple"` | Multiple | keeps several panels open in multiple mode |
| controlled | follows `value` | — | Controlled | follows a controlled value and reports changes |
| disabled item | panel at 60 %, trigger ignores input, skipped by arrows | `disabled`, `data-disabled` on the item | Disabled | ignores a disabled item and skips it with the arrow keys |
| disabled root | every panel disabled | `disabled` on every trigger | Disabled | disables every panel from the root |
| custom indicator | the given icon, `aria-hidden` | `data-slot="accordion-indicator"` | Custom indicator | draws the chevron by default and a custom indicator when given |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | Opens or closes the focused trigger's panel | APG Accordion |
| Tab | Next trigger, or into the open panel's controls | APG Accordion |
| ↓ / ↑ | Next / previous trigger, wrapping, skipping disabled ones | APG Accordion (optional keys), Radix |
| Home, End | First / last trigger | APG Accordion (optional keys), Radix |

**Motion:** the content keeps stock's `animate-accordion-down` / `-up` (Radix's measured
`--radix-accordion-content-height`, 200 ms, the one height animation §6.3 allows); reduced motion ends it at once through
`theme.css`. **Notes:** the heading level is Radix's `h3`. The live visual target leaves an open header in the muted
colour (its active class no longer applies); the package follows its resolved CSS, where an open header is `--foreground`.

## Action bar

**Status:** built (0.1.1) · **Stock:** none: built on Radix Toolbar and the package's presence hook (`src/lib/presence.ts`).
**Pattern:** APG Toolbar <https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/> · **Completeness references:** Mantine and
Chakra ActionBar, Primer ActionBar.

**API:** `ActionBar` — `count: number` (shown as `selectedCount`, formatted with `Intl.NumberFormat(locale)`), `open?`
(overrides `count > 0`), `onClear?` (adds the × named `clearSelection`), `position?: "container" | "viewport"` (absolute
1rem above the bottom of the positioned ancestor, or fixed above the window's), `returnFocusTo?`, `aria-label?` (default:
the count text), Radix Toolbar root props (`loop`, `dir`). `ActionBarButton` — Button props in the roving order (default
`ghost`, foreground text). `ActionBarSeparator`. Parts: `action-bar-status` (always present, `role="status"`, sr-only),
`action-bar` (`data-state`, `data-position`, `data-bui-motion="overlay"`), `action-bar-count`, `action-bar-separator`,
`action-bar-button`, `action-bar-clear`. Look: `--popover` surface, 1 px edge, 8 px radius, `shadow-md`, 0.375rem padding,
0.25rem gap; rises with `slide-in-from-bottom-4` + fade, fades out (theme exit policy). Strings: `clearSelection` (new),
`selectedCount` (existing).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| hidden | nothing; empty status | — | — | stays hidden while nothing is selected |
| shown | floating bar with count, actions, × | `role="toolbar"`, `aria-orientation="horizontal"`, named by the count | Basic | shows a toolbar named by the count, and announces the count politely |
| announcement | — | status text set on appear and on change | Basic | announces when it appears and when the count changes |
| focus | roving tabindex, one tab stop | — | — | is one tab stop, and moves between its buttons with the arrows, wrapping |
| overflow | icon button opening a DropdownMenu | — | With many actions | — |
| in a table | over the table's bottom | — | In a table | — |
| closing with focus inside | — | focus back to where it came from, else `returnFocusTo` | — | returns focus to where it came from when it closes with focus inside |
| locale / strings | — | — | — | formats the count for the locale and takes its strings from the provider |
| open / viewport | fixed | `data-position="viewport"` | — | shows with open whatever the count, and takes a name and a place |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Into the bar (last used button) and out: one stop | APG Toolbar |
| → / ← | Next / previous button, wrapping; reversed in RTL | APG Toolbar (Radix) |
| Home / End | First / last button | APG Toolbar (Radix) |
| Enter / Space | Activates the focused button; × clears | APG Button |

**Notes.** The bar never takes focus by itself. Leave padding under the list so the bar does not cover the last row.
**Presence.** `usePresence(open, ref)` (`src/lib/presence.ts`, internal, not a package entry) keeps the bar mounted with
`data-state="closed"` while its exit animation runs, and unmounts it on the element's own `animationend` or
`transitionend` (an `animationcancel` under the entrance's name is ignored), after the computed duration if no end event
comes, or at once when nothing animates (no computed animation or transition; in browsers, nothing in
`getAnimations()`) or `prefers-reduced-motion: reduce` matches. It replaces Radix's `Presence` from `radix-ui/internal`,
which is not documented API and may be missing in `radix-ui` 1.4.3. Test: `tests/lib/presence.test.jsx` (7 cases) and
"stays on the page, closed, while it fades out" in the bar's tests.

### Behaviour details

**Focus return through menus.** The bar remembers where focus entered from. React brings it the focus events of a menu
opened from the bar although the menu is a portal elsewhere in the page; the bar learns those places (the child of
`<body>` holding the menu) and does not count moves between them and the bar as entering it. When the bar closes with
focus in the bar, in one of its menus, or lost, focus returns to where it entered from (else `returnFocusTo`) after the
current task, once a menu that emptied the selection has stopped trapping focus. Focus that reaches the bar while it
fades out (a menu handing it back to its trigger) is passed on at once. A bar fading out has `pointer-events: none`. A
consumer `ref` is merged with the bar's own, so the exit animation and focus return keep their element.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed by a menu item | fades out | focus back on the list | many-actions | returns focus to the list when a menu item empties the selection and the bar is gone before the menu lets go; passes focus on when a menu of the bar hands it back while the bar fades out |
| menu opened and closed, then cleared | fades out | focus back on the list | many-actions | still returns focus to the list after a menu of the bar was opened and closed |

## Aspect ratio

**Status:** built (0.1.1) · **Stock:** shadcn `aspect-ratio` (Radix Aspect Ratio), unchanged apart from the `@since` tag.
**Pattern:** none (layout only) · **Completeness references:** none in Base UI or React Aria (CSS `aspect-ratio`).

**API:** `AspectRatio` (`ratio`, width ÷ height, default 1; `asChild`). Data slot: `aspect-ratio` (the inner box). It draws
nothing: no tokens, no states beyond its content's.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| 16:9 | height = 56.25 % of the width | outer `padding-bottom: 56.25%` | 16:9 image, Video placeholder | reserves the height for its ratio and holds its content |
| square | height = width | `padding-bottom: 100%` | Square | is square by default |

No keys. **Notes:** content taller than the ratio is cut off or overflows; give images `object-cover` or `object-contain`.

## Autocomplete

**Status:** built (0.1.1) · **Stock:** none: built on Base UI Autocomplete (`@base-ui/react/autocomplete`).
**Pattern:** WAI-ARIA APG Combobox, list autocomplete (and both, with inline completion)
<https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/> · **Completeness references:**
Base UI Autocomplete <https://base-ui.com/react/components/autocomplete> · React Aria Autocomplete
<https://react-aria.adobe.com/Autocomplete>

**API:** `Autocomplete` (Base UI `Autocomplete.Root`: `items`, `value`/`defaultValue`/`onValueChange` carrying the text,
`mode` `list | both | inline | none`, `filter`, `itemToStringValue`, `openOnInputClick`, `autoHighlight`, `disabled`…).
`AutocompleteInput` — `size`, `variant`, `showTrigger` (default `false`), `showClear`, `loading`, `disabled`.
`AutocompleteContent` — `side`, `sideOffset` (2), `align` (`start`), `alignOffset`, `anchor`, `container`.
`AutocompleteList`, `AutocompleteItem` (`icon?`, `description?`), `AutocompleteGroup`, `AutocompleteLabel`,
`AutocompleteCollection`, `AutocompleteEmpty` (default `noResults`), `AutocompleteStatus` (`loading?`),
`AutocompleteSeparator`, `AutocompleteTrigger`, `AutocompleteClear`, `useAutocompleteFilter`. Parts: `autocomplete-*` as
the combobox's, the field is `input-group`. Strings: `noResults`, `loadingResults`, `toggleOptions`, `clear`.

The look is Combobox's: the field is `InputGroup`, the list Select's (field width, 2 px below, 6 px radius, `shadow-md`,
`data-bui-motion="overlay"`), suggestions are Select's options with `--accent` while highlighted and no chosen state.
While empty, the list hides unless `AutocompleteEmpty` or `AutocompleteStatus` has text.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| free text | the typed text stays | input `role="combobox"`, `aria-autocomplete="list"` | Basic | keeps free text that matches no suggestion |
| suggestions | the list below, narrowed as you type | `role="listbox"` | Basic | filters the suggestions as you type |
| highlighted | `--accent` | `aria-activedescendant` | Basic | highlights suggestions with ArrowDown and ArrowUp |
| inline completion | the highlighted suggestion written in the field | `aria-autocomplete="both"` | Inline completion | inline completion (mode="both") puts the highlighted suggestion in the field |
| loading | spinner in the field, status in the list | `role="status"` | Async | async: announces loading, then shows the suggestions |
| groups | muted semibold labels | `role="group"` named by the label | Groups | shows groups with their labels |
| empty | "No results" | live region | Groups | shows the provider’s "No results" with AutocompleteEmpty |
| clearable | × while there is text | `button` named `clear` | — | clears with the clear button, named from the provider |
| sizes / filled | 28 / 35 / 42 px; `--field-filled` | `data-size`, `data-variant` on the field | Sizes, Filled | sets data-size and data-variant on the field; takes the provider controlSize |
| disabled / invalid | `--field-disabled`; `--invalid` edge | `disabled`; `aria-invalid` | Disabled, Invalid | is disabled and invalid on request |
| in a dialog / sheet | the list over the dialog | — | — | in a dialog: a click fills the field, the dialog stays open, Escape closes the list first; in a sheet |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowDown / ArrowUp | Open, then highlight the next / previous suggestion | APG Combobox |
| Enter | Fills the field with the highlighted suggestion, closes | APG Combobox |
| Escape | Closes the list, keeps the text; inside a dialog the dialog stays open | APG Combobox |
| Home / End | Move the text cursor | APG Combobox |
| Printable characters | Narrow the suggestions (and complete inline with `mode="both"`) | APG Combobox |

**Notes.** Inside Radix overlays it uses Combobox's approach (see Combobox notes): portalled to `<body>` with pointer
events restored, wheel and touch propagation stopped at the positioner, Escape marked handled while open. The reference's
Force Selection demo is Combobox; its Command Menu demo is `CommandDialog`.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Open, named by a `<label>` | — | as Combobox | Basic | "keeps the name of its label while the list is open, when Base UI hides the label" |
| Form reset | back to `defaultValue`, focus kept | a controlled one gets `onValueChange(firstText, { reason: "none" })` | — | "goes back to its defaultValue when its form resets, and tells onValueChange"; "controlled: a form reset calls onValueChange with the text it started with" |

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| In a popover | as anywhere | Escape closes the list, then the popover | — | "in a popover: a click fills the field and the popover stays open; Escape closes the list, then the popover" |
| Form (`name`) | — | the input submits its text | — | "submits the text under name, a suggestion or not" |
| Async, request superseded or failed | as Combobox | | Async | "async example: clearing the text while a search runs stops the spinner" |

Notes: the label limit of Combobox applies.

## Banner

**Status:** built (0.1.1) · **Stock:** none: built on plain elements.
**Pattern:** WAI-ARIA live regions (`status`, `alert`) <https://www.w3.org/TR/wai-aria-1.2/#status> · **Completeness
references:** Primer Banner, Atlassian Banner, Polaris Banner; colours from the visual target's Message.

**API:** `Banner` — `tone?: "neutral" | "info" | "success" | "warning" | "destructive"` (default `info`), `position?:
"static" | "sticky"` (sticky: `sticky top-0 z-10`), `icon?` (each tone has a lucide default; `null` hides it),
`dismissible?`, `onDismiss?`, `returnFocusTo?`, `role?` (default `status`, `alert` for warning/destructive), div props.
`BannerTitle` (medium weight), `BannerDescription`, `BannerActions` (end of the line). `bannerVariants` exported. Parts:
`banner`, `banner-icon`, `banner-content`, `banner-title`, `banner-description`, `banner-actions`, `banner-dismiss`. Look:
full width, 1 px bottom edge, `px-4 py-2.5`, 14/21 text, 16 px icon, 0.5rem gap; tone = `--{tone}-subtle` /
`--{tone}-border` / `--{tone}-strong` (neutral: secondary); dismiss = the Message close button (24 px circle, current
colour, 10 % current-colour fill on hover). Strings: `dismiss` (new).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| tones | five colour sets, own icon | `role="status"` / `"alert"`, `data-tone` | Tones | renders each tone with its icon, polite for the calm tones and an alert for warning and destructive |
| default | info, static | `data-tone="info"`, `data-position="static"` | — | is info and static by default, and sticky on request |
| custom / no icon | — | icon `aria-hidden` | — | takes another icon, or none |
| with actions | buttons at the end, wrapping | — | With actions | moves through its actions and × with Tab |
| dismissible | × at the end; banner removed on press | × named `dismiss` | Dismissible | removes itself with the × (Enter or Space), calls onDismiss and moves focus on |
| focus after dismiss | — | to `returnFocusTo`, else next tabbable | Dismissible | sends focus to returnFocusTo when given |
| sticky | stays at the top of the scrolling box | `data-position="sticky"` | Sticky | (above) |
| strings / role | — | — | — | names the × from the provider, and takes another role |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Through the actions and the × in reading order | — |
| Enter / Space | On the ×, removes the banner and moves focus on | APG Button |

**Notes.** No motion. Remembering a dismissal is the product's job. In the WordPress admin a sticky banner in a page that
scrolls needs `top-(--wp-admin--admin-bar--height)`.

### Behaviour details

**Focus after dismissal.** The × records, while the banner still marks its place, whether focus was in the banner (or
nowhere) and the fallback: the first element after the banner that Tab reaches, skipping hidden, inert and unrendered
elements, or the last one before it when nothing follows. Once the banner has gone (an effect after the commit),
`returnFocusTo` is read, so it can name an element the dismissal itself shows, such as a "Show again" button, and focus
moves there or to the fallback. A pointer click that left focus elsewhere moves nothing. A consumer `ref` is merged with
the banner's own.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| dismissed, focus target shown by the dismissal | gone | focus on `returnFocusTo` | dismissible | sends focus to an element the dismissal itself shows, named by returnFocusTo |
| dismissed, nothing after it | gone | focus on the previous tab stop | — | moves focus to the control before it when nothing follows, never to the page |
| dismissed by a click, focus elsewhere | gone | focus unchanged | — | leaves focus where it is when the × is clicked while focus is elsewhere |

## Carousel

**Status:** built (0.1.1) · **Stock:** shadcn `new-york-v4/carousel` (Embla, `embla-carousel-react` 8.6)

**Pattern:** WAI-ARIA APG Carousel <https://www.w3.org/WAI/ARIA/apg/patterns/carousel/> · **Completeness references:**
Embla <https://www.embla-carousel.com/api/> · React Aria has no carousel; the visual target's carousel page (alignment,
orientation, loop, variable size, indicators)

**API.** Parts: `Carousel` (`data-slot="carousel"`, `role="region"`), `CarouselContent` (`carousel-content`, the viewport,
with the track inside), `CarouselItem` (`carousel-item`), `CarouselPrevious` (`carousel-previous`), `CarouselNext`
(`carousel-next`), and two new parts: `CarouselFooter` (`carousel-footer`: a row under the slides; buttons inside it sit in
the row) and `CarouselDots` (`carousel-dots`, each dot `carousel-dot`). `Carousel` props: `opts` (Embla options),
`plugins`, `orientation` (`"horizontal" | "vertical"`), `setApi`; `aria-label` from the consumer. `CarouselPrevious` /
`CarouselNext` take `Button`'s props (`variant` default `outline`, `size` default `icon`). Type: `CarouselApi`.
No sizes or variants: slides carry the consumer's content.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Buttons | 32 px outline, round, arrow icons, at `-left-12` / `-right-12` | 36 px outline, round, `--muted-foreground` 16 px chevrons (`rtl:rotate-180`); at the logical edges (`-start-12` / `-end-12`); inside `CarouselFooter` they sit in its row | The visual target's demo buttons (36 px, chevrons); RTL |
| Vertical buttons | the horizontal button turned 90° | chevron up and down, no rotation | Rotation broke the RTL mirroring |
| Button names | "Previous slide", "Next slide" hard-coded | `previousSlide`, `nextSlide` | No English inside components |
| Role descriptions | "carousel", "slide" hard-coded | `carouselRole`, `slideRole` | Screen readers announce them |
| Slide name | none | "Slide {index} of {count}" (`slideOf`), kept current on Embla's `slidesChanged`/`reInit`; a consumer `aria-label` wins | APG Carousel: each slide is labelled by its position |
| Keys | ArrowLeft / ArrowRight only, whatever the orientation and direction | Left/Right swap in RTL; Up/Down in a vertical carousel; ignored while focus is in a text field | APG, RTL, and fields inside slides keep their keys |
| Direction | Embla left in LTR | `direction` from the provider for a horizontal carousel | Embla scrolls the wrong way in RTL without it |
| Spacing | `-ml-4` / `pl-4` | `-ms-4` / `ps-4` | RTL |
| Scroll state | `setState` from an effect, only "select" unsubscribed | `useSyncExternalStore` on Embla's `select` and `reInit` | The React Compiler lint, and a listener leak |
| Indicators | none | `CarouselDots`: one 28 × 8 px bar per scroll position (`--border`, `--control` on hover, `--primary` current), 8 px apart, 16 px padding, a 24 px tall target through `::after`; named "Go to slide {index}" (`goToSlide`), `aria-current` on the current one | The visual target's indicators |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | slides in a row; the footer row with dots at its start and the buttons at its end | `role="region"`, `aria-roledescription` (provider), each slide `role="group"` named "Slide n of m" | Basic | renders a named region of slides, each named by its position |
| first / last slide | Previous (or Next) at 60 % opacity | `disabled` | Basic | disables Previous on the first slide and Next on the last, and moves on click |
| loop | both buttons always enabled | — | Loop | — |
| current dot | `--primary` bar | `aria-current="true"` | Basic, Dots | renders one dot per position, named "Go to slide n", marking the current one |
| hover | button: `--subtle` fill, `--foreground` chevron; dot: `--control` | — | Basic | — |
| focus-visible | 1 px `--ring` outline 2 px out (buttons and dots) | — | Basic | — |
| vertical | slides stacked, Previous above, Next below | `data-orientation="vertical"` | Vertical | moves a vertical carousel with ArrowDown and ArrowUp, and ignores Left and Right |
| RTL | slides from the right, Previous on the right, chevrons mirrored | provider `dir` | Basic (`?dir=rtl`) | swaps ArrowLeft and ArrowRight in a right-to-left page |
| several per view | `basis-1/3`; dots count scroll positions | — | Several per view, Variable size | — |

Rows not applicable: disabled, invalid, read-only (a carousel holds no value); loading, empty (the consumer's slides).

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowRight | With focus inside a horizontal carousel, next slide (previous in RTL) | APG Carousel; RTL |
| ArrowLeft | With focus inside a horizontal carousel, previous slide (next in RTL) | APG Carousel; RTL |
| ArrowDown | With focus inside a vertical carousel, next slide | APG Carousel |
| ArrowUp | With focus inside a vertical carousel, previous slide | APG Carousel |
| Enter, Space | On a button, previous or next slide; on a dot, its position | native button |

Notes. The region is not a tab stop; its buttons, dots and slide controls are. A button that becomes disabled at an end
drops focus (native behaviour); `loop` avoids it. No autoplay is built in (Embla's plugin works through `plugins`; WCAG 2.2.2
then needs a pause button). In dark, the visual target fills its demo buttons slate 800; the package keeps the outline
button's transparent fill.

### Behaviour details

| Key | Behaviour | Source |
| --- | --- | --- |
| Arrow keys on a control inside a slide that handles them | Left to the control; the carousel does not move | read in the bubble phase, skipped when `defaultPrevented` |

**Focus.** When Previous or Next disables at an end while it has focus, focus moves to the other (a layout effect on
the can-scroll state). Tests: leaves the arrow keys to a control inside a slide that handles them, such as a radio
group; hands focus to Previous when Next disables on the last slide, and back again.

## Cascade select

**Status:** built (0.1.1) · **Stock:** none: built on Radix `DropdownMenu` (Root, Trigger, Content, Sub, SubTrigger,
SubContent, RadioGroup, RadioItem), with the library's select-field look.
**Pattern:** APG Menu Button <https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/> with submenus (APG Menu) ·
**Completeness references:** the visual target's Select "Cascade" demo and CascadeSelect component; React Aria Menu
submenus <https://react-aria.adobe.com/Menu>.

**Why DropdownMenu submenus, not Popover with our own menu:** the visual target's cascade is a menu of submenus; Radix
gives the APG menu keyboard (arrows, → / ← mirrored in RTL, Home/End, type-ahead, Escape), focus return, nested dismissable
layers, collision flipping and portals, already tested in this library. A hand-built menu in a Popover would repeat all of
it. Leaves are `menuitemradio` inside `RadioGroup`, so the chosen option is announced as checked.

**API:** `CascadeSelect` — `options: CascadeSelectOption[]` (`value` unique across the tree, `label`, `icon?`, `disabled?`,
`children?`, `hasChildren?`), `value?` / `defaultValue = ""` / `onValueChange(value, path)` (`""`, `[]` when cleared),
`loadOptions?(option)` (lazy levels, called once per group, result cached), `placeholder`, `showPath`, `separator = " / "`,
`size` (`useControlSize`), `variant` (`useFieldVariant`), `fluid`, `clearable`, `loading` (top level), `open` /
`defaultOpen` / `onOpenChange`, `name` (hidden input), `disabled`, and `button` props (the trigger). Exports
`CascadeSelect`, types `CascadeSelectOption`, `CascadeSelectProps`. Slots: `cascade-select-trigger`, `cascade-select-value`,
`cascade-select-control` (clearable wrapper), `cascade-select-clear`, `cascade-select-content`, `cascade-select-level`,
`cascade-select-group`, `cascade-select-item`, `cascade-select-sub-content`, `cascade-select-status`. No new strings: reuses
`clear`, `loading`, `noResults`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| placeholder | the select field (35 px, `--field`, `--control` edge, 14 px chevron in a 36 px end column), muted text | `data-placeholder`; button named "{label} {placeholder}" | Basic | is a menu button named by its label and its value |
| open | levels: `--popover`, 1 px `--border`, 6 px radius, `shadow-md`, 4 px padding, 29 px options edge to edge; 2 px below the field, at least its width; each next level starts at its group's edge, first option aligned with the group | `aria-expanded`, `role="menu"` per level | Basic | opens with ArrowDown and focuses the first option |
| group open | group `--accent`, 12 px chevron `--control-hover` (`--muted-foreground` when focused) | `menuitem[aria-haspopup=menu][aria-expanded=true]` | Basic | opens a group with ArrowRight and closes its level with ArrowLeft |
| chosen | `--highlight` fill (`--highlight-focus` focused); reopening opens its path and focuses it | `menuitemradio[aria-checked=true]` | Show the path | reopens on the chosen option, with every level of its path open (and in strict mode) |
| show path | "Europe / Germany / Frankfurt" | — | Show the path | shows the whole path with showPath and a separator |
| icons | 14 px icons before labels | — | Groups with icons | — |
| clearable | × 24 px target, 14 px icon, before the chevron | button named `clear` | Clear | clears with the clear button by keyboard and returns focus to the field |
| loading level | disabled "Loading" row with spinner | `aria-busy` on the level | Loading options | loads a level the first time it opens |
| loading / empty top | spinner replaces the chevron; "Loading" / "No results" row | `aria-busy` on the trigger | — | says when the top level is loading, and when a level is empty |
| sizes | 28 / 35 / 42 px, chevron 12 / 14 / 16 px | `data-size` | Sizes | sets data-size and data-variant from its props or the provider |
| filled | `--field-filled` | `data-variant=filled` | Filled | same |
| fluid | full width | — | Fluid | fills its container with fluid |
| disabled | `--field-disabled`, not-allowed cursor; disabled groups/options at 60 % | `disabled`; `aria-disabled` items | Disabled | does not open when disabled; skips a disabled group |
| invalid | `--invalid` edge, red placeholder; `--ring` while focused or open | `aria-invalid`, `aria-describedby` | Invalid | marks an invalid field and reads its message |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space, ↓ | On the field: opens, focus to the first option or the chosen one | APG Menu Button |
| ↓, ↑ | Next / previous option of the level, wrapping, skipping disabled ones | APG Menu |
| → (← in RTL) | On a group: opens its level, focus to its first option | APG Menu (submenu) |
| ← (→ in RTL) | Closes the level, focus back to its group | APG Menu (submenu) |
| Enter, Space | On a group: opens its level; on an option: chooses it, closes, focus to the field | APG Menu |
| Home, End | First / last option of the level | APG Menu |
| A–Z | Type-ahead within the level | APG Menu |
| Escape | Closes every level, value unchanged, focus to the field | APG Menu Button |
| Enter, Space (clear) | Empties the field, focus to the field | native button |

**Notes.** The trigger is a menu button, whose name would be its label alone; the component composes
`aria-labelledby` from the field's `labels` (ids added where missing), `aria-labelledby` or `aria-label`, plus its value
span, so it reads "Office, Los Angeles"; the top menu is named by the label. Radix closes each submenu it mounts in React
strict mode (its unmount cleanup); while the chosen path opens those requests are ignored (guarded, with a test). A value
inside a level not loaded yet shows as the raw value. Remaining differences from the visual target: sub-levels are as wide
as their content (min 128 px) where the demo fixes 176 / 160 px; the menu sits 2 px below the field like the library's
Select (the demo: 3 px).

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Level failed to load | One muted row, "Could not load the options" (provider `loadFailed`) | the level's `role="menu"` without `aria-busy`; the row is a disabled `menuitem` | — | "says a level could not load, and loads it again the next time its group opens" |
| Long label | Field and levels cut the label with an ellipsis; a level is never wider than the room on its side | the whole label stays the option's name | — | "never grows past its container, so a long value truncates" (class), browser check |

Notes:
- A rejected `loadOptions` is not cached: opening the group again retries, the level saying "Loading" meanwhile.
- Reopening on a chosen option scrolls each open level (not the page) so the option, and the group that opened each level, are in view.
- Forms: the hidden input is `disabled` with the field and takes the field's `form` attribute; a form reset sets an uncontrolled field back to `defaultValue` (through `onValueChange`, with its path), via the library's `useFormReset`. A controlled field is left to the app.
- Cleanup: the 500 ms reveal timer is cleared when the menu closes or reopens and on unmount; the reveal frame is cancelled on unmount; a load that settles after unmount sets no state.

## Chat

**Status:** built (0.1.1) · **Stock:** none as one item: built on native elements (a `role="log"` region, `article`,
`form`) and Button. The parts follow the shape of shadcn's `message`, `bubble`, `attachment` and `marker` registry items
(4.21.1); `message-scroller` was read but not used, as it needs `@shadcn/react`, which the package does not have: the
thread's own stick-to-bottom logic replaces it.
**Pattern:** WAI-ARIA `log` role <https://www.w3.org/TR/wai-aria-1.2/#log> · **Completeness references:** shadcn chat
items <https://ui.shadcn.com/docs/components> · Atlassian and Intercom conversation threads · the visual target's
Sidebar "Chat Application" and Terminal "AI Assistant" demos.

**API:**

- `ChatThread` (`div` props; `aria-label` defaults to the provider's `chatThread`): the scrolling log. Data slots
  `chat-thread`, `chat-thread-viewport` (the `role="log"` element), `chat-thread-content`, `chat-thread-jump`.
- `ChatMessage` (`article` props): `side` `"start"` | `"end"` (default `start`), `author` (required), `avatar`, `time`
  (`Date` | ISO string | ms), `timeFormat` (`Intl.DateTimeFormatOptions`, default hour and minute), `status`
  `"sending"` | `"sent"` | `"failed"`, `onRetry`, `continued`. Data slots `chat-message`, `chat-message-avatar`,
  `chat-message-body`, `chat-message-header`, `chat-message-author`, `chat-message-time`, `chat-message-status`,
  `chat-message-status-text`, `chat-message-retry`; `data-side`, `data-status`, `data-continued`.
- `ChatBubble` (`div` props): `variant` `"default"` | `"plain"`. Data slot `chat-bubble`.
- `ChatAttachment` (`div` props): `name` (required), `size` (bytes, written by `formatFileSize` from File upload), `type`
  (MIME, picks the icon), `href`, `download`, `src` + `alt` (a picture instead of the chip). Data slots `chat-attachment`
  (`data-kind="file"` | `"image"`), `chat-attachment-icon`, `chat-attachment-info`, `chat-attachment-name`,
  `chat-attachment-size`.
- `ChatDateSeparator` (`div` props): `date`, `format` (default weekday, day, month), or children. Data slots
  `chat-date-separator`, `chat-date-separator-label`.
- `ChatTypingIndicator` (`div` props): `name` (required), `avatar`. Data slots `chat-typing-indicator`,
  `chat-typing-indicator-avatar`, `chat-typing-indicator-dots`, `chat-typing-indicator-label`.
- `ChatComposer` (`form` props): `value` / `defaultValue` / `onValueChange`, `onSend(text)`, `onAttach(files)`, `accept`,
  `multiple` (default `true`), `placeholder`, `disabled`, `size` (`ControlSize`, provider default), `variant`
  (`FieldVariant`, provider default), `aria-label` (default `chatMessage`), children (shown above the field). Data slots
  `chat-composer`, `chat-composer-attachments`, `chat-composer-row`, `chat-composer-attach`, `chat-composer-file`, `chat-composer-input`,
  `chat-composer-send`; `data-size`, `data-variant`, `data-disabled`.
- Types `ChatTime`, `ChatMessageStatus`.

Times and dates are written with `Intl.DateTimeFormat(locale, { timeZone })` from the provider; the `datetime`
attribute is the wall-clock time in that zone (`2026-10-05T09:41`), so server and browser write the same markup.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| message from others | 28 px avatar, name and time in 12 px over a `--muted` bubble, 12 px radius with a 4 px top-start corner | `article`, `data-side="start"`, `time[datetime]` | Basic | is a named log of messages, each an article with its author and time |
| own message | mirrored; `--primary` bubble, `--primary-foreground` text | `data-side="end"` | Basic | sets the side and the plain bubble as data attributes |
| follow-up | avatar space kept, header visually hidden, 6 px from the previous message | `data-continued`, header `sr-only` | Basic | hides the header of a follow-up visually, and keeps it for screen readers |
| sending | bubble at 70 % opacity, clock icon and "Sending" | `data-status="sending"` | Typing and statuses | shows sending, sent and failed, and retries a failed message |
| sent | check icon and "Sent" in `--muted-foreground` | `data-status="sent"` | Typing and statuses | same |
| failed | alert icon, "Not sent" and an underlined Retry in `--destructive-strong` | `data-status="failed"`, Retry is a `button` | Typing and statuses | same; retries with Enter and Space on the retry button; shows no retry button without onRetry |
| typing | three 6 px dots fading in turn in a `--muted` bubble | dots `aria-hidden`, sentence `sr-only` | Typing and statuses | reads who is typing and hides the dots |
| file attachment | 288 px chip: 40 px type icon on `--secondary`, name, size; `--subtle` while its link is hovered | name is a link with a stretched hit area when `href` | With attachments | shows a file as a chip with its size, the whole chip opening the link |
| image attachment | picture up to 240 px tall, 8 px radius, `--border` edge | `img[alt]` | With attachments | same |
| date separator | the day centred between two `--border` rules, 12 px medium `--muted-foreground` | `time[datetime]` (date only) | Date separators | writes the day, or your own words |
| at the bottom | new content keeps the newest message in view | — | Composer | stays at the bottom when a message arrives while the reader is there |
| scrolled up | place kept; an outlined pill "New messages" with an arrow at the bottom centre | `button` | Long thread | keeps the reader where they scrolled to and offers the jump to new messages; hides the jump once the reader scrolls back to the bottom; does not offer the jump when only the typing indicator appears |
| own message while scrolled up | scrolls to the bottom | — | Composer | scrolls to a message the reader sent even when they had scrolled up |
| composer empty | send button disabled (60 %) | `disabled` | Composer | disables the send button while the field is empty or blank |
| composer focus | `--ring` edge on the frame | — | Composer | — |
| composer disabled | `--field-disabled` fill, every control disabled | `data-disabled`, `disabled` | — | is disabled: no writing, attaching or sending |
| composer sizes, filled | 12 / 14 / 16 px text, 24 / 28 / 36 px buttons; `--field-filled` | `data-size`, `data-variant` | — | sets its size and variant, from the provider by default |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter | In the composer, sends and empties the field; nothing while blank or while an input method composes | Chat convention (Intercom, Slack) |
| Shift+Enter | In the composer, a new line | Chat convention |
| Enter, Space | Activates send, attach, retry and New messages | Native button |

**Notes:** the log announces additions politely, including the reader's own messages and status changes. Focus: the jump
moves focus to the thread (`tabIndex` −1 when it is not in the tab order, 0 while it scrolls with nothing focusable, per
`useScrollFocus`); retry leaves focus on the message's status. The composer grows with its text to 160 px. The visual
target's chat demo is skeletons only, so the look is built from the tokens: the assistant style copies its Terminal "AI
Assistant" demo (24 px avatars, a primary avatar with a sparkle for the assistant, plain answers). Not built: loading
older messages on scroll, reactions, editing and deleting messages, read receipts beyond `sent`.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Thread height changes while at the bottom | Stays on the newest message | — | — | "stays at the bottom when the thread itself gets shorter…" |
| Picture loads late | Stays at the bottom if the reader was there; keeps the place otherwise | — | attachments | "stays at the bottom when a picture loads late", "keeps the place of a reader who scrolled up…" |
| Composer with attachments and no text | Send enabled | — | — | "sends attachments without text" |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter (ending an IME composition, Safari: key code 229) | Does not send | WebKit IME behaviour |

- `ChatAttachment` with `src`: `alt` defaults to `name`; `alt=""` marks a decorative picture.
- `ChatComposer`: `onSend` may receive `""` when the composer's children (attachments) are sent without text. While it measures its field to grow it, the composer fixes its own height for that moment, so a thread sharing its column is not resized and its scroll position not clamped (test: "keeps its own height while it measures the field…"; seen in Chromium: a thread above a growing composer stays at the newest message).

## Checkbox group

**Status:** built (0.1.1) · **Stock:** none: built on the library's `Checkbox` (Radix) with a group context.
**Pattern:** APG Checkbox, mixed state <https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/> ·
**Completeness references:** Base UI CheckboxGroup <https://base-ui.com/react/components/checkbox-group> (parent checkbox,
`allValues`), React Aria CheckboxGroup <https://react-aria.adobe.com/CheckboxGroup>.

**Why not Base UI:** Base UI's group needs Base UI checkboxes, a second checkbox look beside the library's Radix
`Checkbox` (sizes, filled, custom icons, its tests) and the optional `@base-ui/react` peer; its parent logic is small, and
the APG restore cycle is added here.

**API:** `CheckboxGroup` — `value?: string[]`, `defaultValue = []`, `onValueChange(string[])`, `allValues?` (for a parent
rendered on the server), `disabled`, `orientation = "vertical" | "horizontal"`, `size`, `variant`, `name`, `aria-invalid`
(handed to every box, not set on the group), and `div` props (`role="group"`). `CheckboxGroupItem` — `value`, `label?`,
`description?`, `disabled`, and `Checkbox` props. `CheckboxGroupParent` — `values?` (the subset it controls; every
registered item by default), `label?` (default `selectAll`), `description?`, and `Checkbox` props. Parts:
`checkbox-group`, `checkbox-group-item`, `checkbox-group-parent`, `checkbox-group-parent-item`,
`checkbox-group-description`. New string: `selectAll` = "Select all".

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | stacked rows, 12 px apart; 18 px box, 8 px gap, 14 px medium label | `role="group"`; `role="checkbox"` per item named by its label | Basic | renders a named group of labelled boxes, checked from its value |
| controlled | follows `value` | — | Controlled | is controlled by value |
| description | 14 px `--muted-foreground` line indented to the label | `aria-describedby` | Dynamic | reads an item description as the box description |
| parent mixed | dash in the box | `aria-checked="mixed"`, `aria-controls` = item ids | Select all | shows the parent mixed while some items are checked, and lists its items in aria-controls |
| nested | a parent per subset | `values` | Nested group | controls only its values in a nested group |
| horizontal | wrapping row, 16 px column gap | `data-orientation` | Horizontal | lays the items out in a row with orientation="horizontal" |
| disabled | `Checkbox` disabled look; labels at 60 % | boxes `disabled`; the parent skips disabled items | Disabled | disables every box, the parent too, when the group is disabled; leaves disabled items alone when the parent toggles |
| invalid | `--invalid` edges | `aria-invalid` on each box; group `aria-describedby` | Invalid | marks every box invalid with aria-invalid on the group |
| sizes / variant | per `Checkbox` | `data-size`, `data-variant` on each box | Sizes, Filled | hands its size and variant to every box |
| strings | — | `selectAll` | — | labels the parent from the provider string |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Next box | native |
| Space | Toggles the item | APG Checkbox |
| Space (parent) | mixed → all → none → the last mix (or all) | APG Checkbox, mixed state |

**Notes.** Items register in an effect, so without `allValues` (or the parent's `values`) a parent drawn on the server
reads unchecked until hydration.

### Behaviour details

**Form reset.** The group listens for its form's `reset` and sets its first value (the uncontrolled `defaultValue`, or the
controlled `value` at mount) in one step, calling `onValueChange` with it. The items and the parent toggle in their
`onClick` (Space and a label click are clicks too) rather than in `onCheckedChange`: Radix also calls
`onCheckedChange` on a form reset, once per box and with the value of the last render, which left the boxes and the
submitted inputs out of step. A consumer `onClick` on an item or the parent runs first and can cancel the toggle with
`preventDefault()`. The group's `ref` is composed with its own.

**Parent and disabled items.** The parent's state counts only the enabled items it controls; a checked disabled item
stays checked whatever the parent does. A parent whose items are all disabled is disabled.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| parent over disabled items | unchecked while only disabled items are checked | `aria-checked` from the enabled items | — | counts only the items it can change: a checked disabled item leaves the parent unchecked and stays checked |
| parent, every item disabled | disabled box | `disabled` | — | disables the parent when every item it controls is disabled |
| form reset | back to the first value | hidden inputs follow | — | goes back to its first value when the form is reset, the parent with it |
| consumer `onClick` | — | — | — | calls an item onClick and lets it cancel the toggle |

## Chip

**Status:** built (0.1.1) · **Stock:** none: built on plain elements (no primitive).
**Pattern:** WAI-ARIA APG has no chip; the remove action follows APG Button <https://www.w3.org/WAI/ARIA/apg/patterns/button/>
· **Completeness references:** React Aria TagGroup <https://react-aria.adobe.com/TagGroup> · MUI Chip
<https://mui.com/material-ui/react-chip/>

**API:** `Chip` — `label: string`, `icon?: ReactNode`, `image?: string`, `imageAlt?: string` (default `""`),
`onRemove?: () => void`, `disabled?: boolean`, and `div` props. `ChipGroup` — `div` props (`role="list"`,
`tabIndex={-1}`). Parts: `chip`, `chip-icon`, `chip-image`, `chip-label`, `chip-remove`, `chip-group`. New string:
`removeItem` = `"Remove {label}"`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | 28 px tall, 16 px radius, `--secondary` fill, 12 px `--accent-foreground` text, 10 px padding | `div`; `role="listitem"` in a group | Basic | is plain text with no list role or tab stop when it cannot be removed |
| icon | a 14 px icon in a 22 px box, 6 px start padding | icon `aria-hidden` | Icon | is plain text with no list role or tab stop when it cannot be removed |
| image | a round 22 px picture | `alt=""` unless `imageAlt` | Image | draws a decorative image unless it is given alternative text |
| removable | a 14 px circled × in a 22 px button, 6 px end padding | `button` named `removeItem` with the label | Removable | names the remove button with the provider string |
| remove focused | the chip turns `--secondary-hover`; a 1 px `--ring` outline round the × | — | Removable | moves between removable chips with Tab |
| group | wrapping row, 8 px gaps | `role="list"`, named by the consumer | Group | makes a named list of chips, each with a remove button named after it |
| disabled | 70 % opacity, so the label still reads at 4.5:1 (a chip is not a native control, so nothing marks its text inactive); the remove button disabled | `data-disabled`, `disabled` | Disabled | disables the remove button of a disabled chip |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves to the next removable chip's remove button | native |
| Enter | Removes the chip; focus moves to the next chip's remove button, else the previous one's, else the group | APG Button; focus rule from React Aria TagGroup |
| Space | As Enter | APG Button |
| Backspace | As Enter | React Aria TagGroup |
| Delete | As Enter | React Aria TagGroup |

**Notes.** The remove button, not the chip, is the tab stop: it has a role and a name, and it is what the visual target
makes focusable. `onRemove` is called and focus moves at once; a consumer that asks before removing moves focus itself.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| removable | unchanged 22 px circle; presses land on a transparent 24 × 24 px square centred on it (WCAG 2.5.8), 16 px circle with the same square in a small tags input | `::after` on `chip-remove` | Removable | gives the remove button a hit area of at least 24 × 24 px |

## Choice card

**Status:** built (0.1.1) · **Stock:** none: built on the library's `RadioGroup` (single) and `CheckboxGroup` (multiple).
**Pattern:** APG Radio Group <https://www.w3.org/WAI/ARIA/apg/patterns/radio/> and APG Checkbox
<https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/> · **Completeness references:** React Aria RadioGroup (card style)
<https://react-aria.adobe.com/RadioGroup>, Base UI Radio <https://base-ui.com/react/components/radio>.

**API:** `ChoiceCardGroup` — `type: "single" | "multiple"` (discriminates `value` as `string` or `string[]`),
`defaultValue`, `onValueChange`, `disabled`, `size`, `variant`, `name`, `required` (single), `aria-invalid`, and `div`
props; a one-column grid (`className` for columns). `ChoiceCard` — `value`, `title`, `description?`, `icon?`, `aside?`
(end of the title row, e.g. a price), `disabled?`, `indicator?: "start" | "end"` (default end for radios, start for
checkboxes), `children` (extra content), and `label` props. Parts: `choice-card-group` (`data-type`), `choice-card`,
`choice-card-title`, `choice-card-description`, `choice-card-aside`, `choice-card-icon`. No new strings.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| single | 16 px padding, 1 px `--border`, 8 px radius, on the page; title 16 px medium, description 14 px muted; radio at the end | `role="radiogroup"`; radio `aria-labelledby` = title, `aria-describedby` = aside + description; card is its `<label>` | Single | renders single cards as a named radio group, each radio named by its title and described by the rest |
| chosen | `--primary` edge | `aria-checked="true"` | Single | chooses a card when any part of it is clicked |
| hover | `--accent` fill | — | — | — |
| focus | 1 px `--ring` outline 2 px round the card (control's own outline hidden) | — | — | moves to the chosen card with Tab and chooses the next one with ArrowDown |
| multiple | checkbox at the start, 6 px radius, 12 px gap | `role="group"` of checkboxes | Multiple | renders multiple cards as checkboxes that toggle with Space and with a click |
| icon | 16 px muted icon before the title | `aria-hidden` | With icons | renders single cards as a named radio group, … |
| disabled card | 60 % opacity, not-allowed cursor | control `disabled` | Disabled option | takes a disabled card out of the choice; disables every card when the group is disabled |
| invalid | `--invalid` edge on every card | `aria-invalid` on each control; group `aria-describedby` | Invalid | marks every control invalid with aria-invalid on the group |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Single: to the chosen card; multiple: next card | APG |
| ↓ / → | Single: choose the next card (→ reversed in RTL) | APG Radio Group (Radix) |
| ↑ / ← | Single: choose the previous card | APG Radio Group (Radix) |
| Space | Choose the radio card / toggle the checkbox card | APG |

**Notes.** The card is a `<label>` for its control, so no interactive content belongs inside it.

### Behaviour details

`type="multiple"` takes the checkbox group's form reset; `type="single"` takes Radix's. Test: goes back to its first
value when the form is reset, single and multiple. The card has no fill of its own (it takes the page colour); the
theming text says so.

## Close button

**Status:** built (0.1.1) · **Stock:** none: built on Button; the look is Dialog's and Sheet's × (`variant="ghost"`,
round, `text-muted-foreground hover:bg-subtle hover:text-muted-foreground active:bg-accent`, 14 px icon).
**Pattern:** WAI-ARIA APG Button <https://www.w3.org/WAI/ARIA/apg/patterns/button/> · **Completeness references:** Chakra
CloseButton <https://chakra-ui.com/docs/components/close-button> · Mantine CloseButton
<https://mantine.dev/core/close-button/>

**API:** `CloseButton` — Button's props except `size`, `variant`, `severity`, `rounded`; `size?` (`sm` 28 | `default` 36
| `lg` 42 px, provider `controlSize` fallback), `label?` (name; the provider's `close` string by default), `type`
(`"button"` by default), `children` (replaces the ×). Part: `close-button`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | a 36 px round ×, muted grey, 14 px icon; the faintest surface on hover | `type="button"`, `aria-label`, icon `aria-hidden`, `data-rounded` | Basic | is a round ghost button named Close, of type button |
| sizes | 28/36/42 px, 12/14/16 px icon | `data-size` `icon-sm` / `icon` / `icon-lg` | Sizes | maps its sizes to the square button sizes, following the provider when given none |
| named | `label` or the translated `close` | `aria-label` | In a card corner | takes its name from the provider, or from label |
| disabled | Button's 60 % | `disabled` | Disabled | cannot be pressed when disabled |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | Activates | native button |

**Notes.** Dialog and Sheet could render `CloseButton` for their × instead of their own copies of the classes (lead's call).

## Code block

**Status:** built (0.1.1) · **Stock:** none: built on `<figure>`, `<pre>`, `<code>`, with CopyButton and IconButton.
**Pattern:** a scrollable region in the tab order (axe `scrollable-region-focusable`; WAI-ARIA region
<https://www.w3.org/TR/wai-aria-1.2/#region>) · **Completeness references:** Mantine CodeHighlight
<https://mantine.dev/x/code-highlight/> · Chakra CodeBlock <https://chakra-ui.com/docs/components/code-block> · Carbon
CodeSnippet <https://carbondesignsystem.com/components/code-snippet/usage/>

**API:** `CodeBlock` — the `<figure>` props except `title`/`children`; `code: string` (required: shown, and copied),
`html?` (highlighted HTML from Shiki/Prism; inserted unsanitised), `language?`, `title?` (string: caption bar),
`lineNumbers?`, `highlightLines?: number[]` (1-based), `wrap?` / `defaultWrap?` / `onWrapChange?`, `wrapToggle?`,
`copyable?` (true), `maxHeight?` (number px or CSS length), `aria-label?` (names the region). Parts: `code-block`,
`code-block-header` (figcaption), `code-block-title`, `code-block-actions`, `code-block-wrap`, `code-block-content`
(the `pre`), `code-block-code`, `code-block-line`, `code-block-line-number`, `code-block-line-content`.

**HTML lines.** A highlighter's `<pre><code>` wrapper is dropped (its inner `<code>` content kept); the HTML is split at
newlines and any element open at a line's end is closed there and reopened at the next line's start, so Prism's
multi-line tokens survive per-line rendering.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | the visual target's code panel: `--card`, 1 px edge, 8 px radius, 12 px × 16 px padding, 14 px mono on 24 px lines (20 + 2 + 2); a 32 px muted copy button 7 px from the top-end corner, `--accent` on hover | `figure`; `pre role="region" tabindex="0" aria-label="{title} code"`; `code data-language class="language-*"` | Basic | shows the code in a focusable region named after its title… |
| with title | a 40 px caption bar (14 px medium) with a bottom edge; the buttons centred in it | `figcaption` holds the title only | With title | shows the code in a focusable region…; names the region from its language without a title, or from aria-label |
| line numbers | a muted gutter, sticky at the start edge while lines scroll sideways, not selectable | numbers `aria-hidden` | Line numbers | numbers lines in a hidden gutter and marks highlighted lines |
| highlighted lines | `--accent` from edge to edge | `data-highlighted` | Highlighted lines | numbers lines in a hidden gutter and marks highlighted lines |
| long / scrolls | `maxHeight`, scrolls both ways | `style.max-height` | Long (scrolls) | caps its height with maxHeight |
| wrapped | lines wrap anywhere; the toggle `--accent` filled | toggle `aria-pressed`; `data-wrap` on the figure | Long (scrolls) | wraps and unwraps long lines with Enter and Space on the wrap toggle |
| focus-visible (region) | a 1 px `--ring` outline 2 px round the whole panel | `has-[…:focus-visible]` | — | — |
| pre-highlighted | the consumer's colours | `dangerouslySetInnerHTML` per line | Pre-highlighted HTML | splits highlighted HTML into well-formed lines… |
| copy | CopyButton's | — | Basic | copies the plain code with the copy button |
| translated | `codeBlock`, `wrapLines`, `copy` | — | — | takes its words from the provider |
| right to left | the title bar and buttons follow the page; the code itself stays left to right | `dir="ltr"` on the `pre` | Highlighted lines (`?dir=rtl`) | — |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | The wrap toggle, the copy button, then the code region (where the browser's arrow keys scroll it) | DOM order = visual order |
| Enter, Space | On the toggle, wrap/unwrap; on the copy button, copy | native button |

**Notes.** Strings: `wrapLines`, `codeBlock` ("{title} code", filled with `title`, else `language`) new. No highlighter
dependency. Inline code is Typography's `InlineCode` (the "Inline" example lives on this page).

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| No title, right-to-left page | Buttons at the code's top right-hand corner (the code reads left to right) | `code-block-actions` uses `right-*`; with a title, `end-*` | basic (`?dir=rtl`) | keeps the buttons at the code's right-hand end without a title |

Note: `html` is inserted without cleaning. It must be a highlighter's output (which escapes the code) or HTML the consumer has sanitised.

## Color picker

**Status:** built (0.1.1) · **Stock:** none: built on native range inputs, Radix RadioGroup (swatches) and the library's
Popover and Input.
**Pattern:** APG Slider <https://www.w3.org/WAI/ARIA/apg/patterns/slider/>; the area follows React Aria ColorArea
<https://react-aria.adobe.com/ColorArea> (two range inputs in one thumb, one tab stop, Page Up/Down for the y channel and
Home/End for the x channel) · **Completeness references:** React Aria ColorPicker / ColorArea / ColorSlider /
ColorSwatchPicker <https://react-aria.adobe.com/ColorPicker>, Base UI has none.

**API:** `ColorPicker` — `value?: string` (hex), `defaultValue = "#000000"`, `onValueChange(hex)`, `onValueCommit(hex)`,
`alpha?: boolean` (adds the alpha slider; value `#rrggbbaa` while not opaque), `swatches?: (string | { value, label? })[]`,
`orientation?: "horizontal" | "vertical"`, `disabled`, `size?: ControlSize` (hex field and swatches), `variant?:
FieldVariant` (hex field), `name` (hidden input), `aria-label` / `aria-labelledby`, and `div` props. `ColorPickerPopover`
— the same props plus `open`, `defaultOpen`, `onOpenChange`, `align = "start"`, `side`; `size` sizes the swatch trigger
(28 / 36 / 42 px). `ColorSwatch` — `color: string`, `span` props; decorative unless `aria-label`. Parts: `color-picker`,
`color-picker-area`, `color-picker-area-thumb`, `color-picker-slider` (`data-channel` hue | alpha),
`color-picker-slider-thumb`, `color-picker-preview`, `color-picker-input`, `color-picker-swatches`, `color-picker-swatch`,
`color-picker-trigger`, `color-swatch`. New strings: `colorPicker` "Colour picker", `hue`, `saturation`, `brightness`,
`alpha`, `hexColor` "Hex colour", `colorSwatches` "Preset colours".

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | 4:3 area (6 px radius, 1 px `--border` inset ring), 16 px hue slider, 36 px preview, hex field; 16 px thumbs with a 3 px white ring | `role="group"` named "Colour picker"; area thumb holds `input type=range` Saturation (x) and Brightness (y, `aria-orientation="vertical"`); Hue range input; `aria-valuetext` in percent / degrees (Intl, provider locale) | Basic | renders a named group with the area, the hue slider, the hex field and no alpha slider |
| keyboard focus | 1 px `--ring` outline 2 px round the thumb (`has-[:focus-visible]`) | only one area input has `tabindex=0` (the last used) | Basic | keeps one tab stop in the area: the input used last |
| in a popover | 36 px swatch button; 288 px popover, 12 px padding | trigger named "{label} {hex}"; popover content `role="dialog"` named with the label | In a popover | opens the picker from a swatch button named with its label and colour, and returns focus on Escape |
| vertical | hue / alpha sliders upright beside the area, max at top | `aria-orientation="vertical"` | Vertical hue slider | stands the sliders upright with orientation="vertical" |
| controlled | hex shown follows `value`; a rejected change keeps the parent's colour | — | Controlled | shows a controlled value, follows it, and reports each change once it ends; keeps showing the controlled value when the parent does not take the change |
| swatches | 24 px squares (20 / 28 px by size), chosen one with a 2 px `--ring` ring 2 px away | `role="radiogroup"` "Preset colours", radios named by label or hex | Swatches | chooses a preset colour from the swatches, named by their labels; checks no swatch while the colour matches none |
| alpha | alpha slider over `--muted` / `--background` checks | Alpha range input, percent value text | With alpha | adds an alpha slider whose value reaches the hex as an alpha pair |
| disabled | area and sliders at 60 % opacity, field `--field-disabled` | inputs `disabled`, group `aria-disabled` | Disabled | disables every slider, the field and the swatches |
| RTL | area and horizontal sliders run right to left; hex field stays `dir="ltr"` | — | — | swaps ArrowLeft and ArrowRight on the area and the hue slider in right-to-left pages |
| strings | — | provider keys above | — | reads its names from the provider strings |

| Key | Behaviour | Source |
| --- | --- | --- |
| ← / → | Area: saturation −/+1; slider: value −/+1 (swapped in RTL for horizontal parts) | APG Slider; React Aria ColorArea |
| ↑ / ↓ | Area: brightness +/−1 and focus moves to the brightness input; slider: value +/−1 | React Aria ColorArea |
| Shift + arrow | 10 that way | React Aria ColorArea / ColorSlider |
| Page Up / Page Down | Area: brightness +/−10; slider: value +/−10 | React Aria ColorArea; APG Slider |
| Home / End | Area: saturation −/+10; slider: minimum / maximum | React Aria ColorArea; APG Slider |
| Enter | Hex field: applies and shows the colour's hex | native field |
| arrows (swatches) | Choose the previous / next swatch | APG Radio Group (Radix) |

**Notes.** Colour state is HSVA so the hue survives greys and hex round trips. Range inputs (not `div role=slider`) give
touch screen readers their swipe gestures. The thumbs' white ring is literal white in both themes because it sits on the
colour itself. No eyedropper and no RGB/HSL formats (out of scope; hex only). The area has no `aria-roledescription="2D
slider"` (React Aria adds one): it would need another provider string.

### Behaviour details

- **Forms:** `name` renders a hidden input holding the lower-case hex; it is `disabled` with the picker, so a disabled picker is not submitted, and a `reset` of its form brings an uncontrolled picker back to `defaultValue` (no `onValueChange`, as a native field). `ColorPickerPopover` does the same with its own hidden input.
- **Commit:** `onValueCommit` fires when the pointer capture ends (`lostpointercapture`: release or a cancelled pointer), and after a change made on a range input itself (assistive technology), as well as after each key press and hex edit.
- **Values:** a `value`/`defaultValue` that is not hex is ignored (black, or the colour shown before). `ColorPickerPopover` names its swatch button and submits the normalised hex, black for a value that is not hex. A colour given twice in `swatches` shows once; a swatch that is not hex is left out.
- **RTL (decision recorded):** the area and the horizontal sliders run from right to left; ← and → move the thumb the way the arrow points; Home and End on the area lower and raise the saturation by 10 (toward the start and end edge), and on a slider set the minimum and maximum. Upright sliders keep → as "more".
- **Literal colours:** only colour data (the area's and hue's gradients, swatch and thumb fills) and the thumbs' white ring with its shadow, which sits on the colour rather than on the theme, so a theme token would vanish on dark colours in dark mode.
- New tests: disabled not submitted (picker and popover), form reset (picker and popover), assistive-technology change commits, drag commit on `lostpointercapture`, duplicate swatches, popover hex normalisation, Escape inside a dialog closes only the popover.

## Combobox

**Status:** built (0.1.1) · **Stock:** shadcn `combobox` (new-york-v4, on Base UI Combobox).
**Pattern:** WAI-ARIA APG Combobox, list autocomplete <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/>
· **Completeness references:** Base UI Combobox <https://base-ui.com/react/components/combobox> · React Aria ComboBox
<https://react-aria.adobe.com/ComboBox>

**API:** `Combobox` (Base UI `Combobox.Root`: `items`, `value`/`defaultValue`/`onValueChange`, `multiple`, `filter`,
`itemToStringLabel`, `onInputValueChange`, `virtualized`, `disabled`…). `ComboboxInput` — `size?: "sm" | "default" | "lg"`
(provider `controlSize`), `variant?: "default" | "filled"` (provider `fieldVariant`), `showTrigger` (default `true`),
`showClear`, `loading`, `disabled`, and Base UI input props. `ComboboxContent` — `side`, `sideOffset` (default 2), `align`
(default `start`), `alignOffset`, `anchor`, `container`. `ComboboxList`, `ComboboxItem` (`icon?`, `description?`),
`ComboboxGroup`, `ComboboxLabel`, `ComboboxCollection`, `ComboboxEmpty` (children default to `noResults`),
`ComboboxStatus` (`loading?` shows a spinner and `loadingResults`), `ComboboxSeparator`, `ComboboxChips` (`size`,
`variant`), `ComboboxChip` (`showRemove`, `label?`), `ComboboxChipsInput`, `ComboboxTrigger`, `ComboboxClear`,
`ComboboxValue`, `useComboboxAnchor`, `useComboboxFilteredItems`. Parts: `combobox-trigger`, `combobox-clear`,
`combobox-loading`, `combobox-content`, `combobox-list`, `combobox-item`, `combobox-item-icon`, `combobox-item-body`,
`combobox-item-description`, `combobox-item-indicator`, `combobox-group`, `combobox-label`, `combobox-empty`,
`combobox-status`, `combobox-separator`, `combobox-chips`, `combobox-chip`, `combobox-chip-remove`, `combobox-chip-input`;
the field is `input-group`. New strings: `noResults`, `loadingResults`, `toggleOptions`; reused: `clear`, `removeItem`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Import | `@base-ui/react` root | `@base-ui/react/combobox` | One entry of the peer, as the other Base UI components. |
| Field | an unsized `InputGroup` as wide as its input; the list lines up with the input | `InputGroup` with `size` and `variant`, full width, registered as Base UI's input group so the list lines up with the whole field | The field look and sizes of Input; the visual target's list is the field's width. |
| Trigger | a 24 px ghost button, 16 px muted chevron, unnamed | a 36 px end cell (28 / 42 px) divided by a line in the field's edge colour, 14 px chevron in `--control-hover`, named `toggleOptions` | The visual target's Trigger demo; a named button. |
| Clear | a ghost icon button, unnamed | a bare 14 px × in a 24 px box, named `clear` | Input's clear button. |
| Loading | none | `loading` spinner in the clear button's place | The visual target's Loading demo. |
| List | 6 px below, 28 px wider than the field, a ring, own max height | 2 px below, the field's width, 6 px radius, 1 px `--border` edge, `shadow-md`, at most 24rem or the room below, flex column; `data-bui-motion="overlay"`, `data-bui-portal` | Select's list. |
| Inside overlays | unusable with the pointer inside a modal Radix dialog | the positioner restores `pointer-events`, stops `wheel`/`touchmove` propagation; Escape is marked handled while the list is open | See Notes. |
| Options | 6 × 8 px padding, no chosen fill, 16 px check, 50 % disabled | Select's option: 4 × 10 px, `--accent` highlighted, `--highlight` chosen (`--highlight-focus` both), 14 px check 10 px from the end, 60 % disabled; `icon`/`description` | Select's look, the visual target's selected fill. |
| Group label, separator | 12 px regular, 4 px margins | 14 px semibold muted with the options' padding; 2 px margins | Select. |
| Empty | hidden with `display: none` while the list has options | always mounted live region, room only when it has text; default text `noResults` | Base UI requires the live region to stay; no English inside. |
| Status | not exported | `ComboboxStatus` with `loading` | Async lists. |
| Chips field | 36 px minimum, transparent fill, 3 px ring; needs `anchor` | the field look, 35 / 28 / 42 px for one row, chips 3 px from the edge; registered as the input group (no `anchor` needed) | The visual target's Chips demo. |
| Chip | a 22 px square-cornered muted chip, ghost remove button at half opacity, unnamed | the library Chip's look: a 28 px pill on `--secondary` (22 / 32 px), `--secondary-hover` when focused, a round 22 px remove target named `removeItem` | The library's chip; Base UI's chip keyboard model is kept (see Notes). |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | the field: 35 px, `--field`, `--control` edge, chevron cell | input `role="combobox"`, `aria-expanded="false"` | Basic | opens with ArrowDown and highlights the options in turn |
| open | the list below, 2 px away | `aria-expanded="true"`, `aria-controls` → `role="listbox"` | Basic | opens with ArrowDown and highlights the options in turn |
| highlighted option | `--accent` fill | `data-highlighted`, input `aria-activedescendant` | Basic | opens with ArrowDown and highlights the options in turn |
| chosen option | `--highlight` fill, a check at the end | `aria-selected="true"`, `data-selected` | Trigger | marks the chosen option selected with a check |
| filtered / empty | fewer options; "No results" | `data-empty` on the list | Basic | filters the options as you type; shows the provider’s "No results" when nothing matches |
| loading | spinner in the field, "Loading results…" in the list | `role="status"` (polite) | Async | async: announces loading in the status, then shows the results |
| clearable | × before the chevron while a value is chosen | `button` named `clear`, `tabindex="-1"` | Clear | clears with the clear button, named from the provider, and keeps focus in the field |
| multiple | chips in the field | chips in `role="toolbar"`, remove buttons named "Remove {label}" | Multiple | multiple: chips in the field, removed with Backspace from an empty input |
| sizes | 28 / 35 / 42 px | `data-size` on the field | Sizes | sets data-size and data-variant on the field; takes the provider controlSize |
| filled | `--field-filled` | `data-variant="filled"` | Filled | sets data-size and data-variant on the field |
| disabled | `--field-disabled`, does not open | `disabled` on the input | Disabled | does not open while disabled |
| invalid | `--invalid` edge, red placeholder | `aria-invalid="true"` | Invalid | passes aria-invalid to the input |
| in a dialog / sheet | the list over the dialog, may reach past its edge | — | In a dialog | in a dialog: a click on an option picks it and the dialog stays open; Escape closes the list, not the dialog; in a sheet |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowDown | Opens the list, then highlights the next option | APG Combobox |
| ArrowUp | Highlights the previous option | APG Combobox |
| Enter | Chooses the highlighted option, fills the field, closes | APG Combobox |
| Escape | Closes the list without choosing; inside a dialog the dialog stays open | APG Combobox |
| Home / End | Move the text cursor (editable combobox) | APG Combobox (textbox keys) |
| Printable characters | Filter the options | APG Combobox |
| Backspace | With `multiple`, in an empty input, removes the last chip | Base UI Combobox |

**Notes.** *Inside Radix overlays.* A Base UI list is portalled to `<body>`. Radix already counts presses in it as inside
the dialog, sheet or popover, since the list renders within the overlay's React tree (Radix's outside check is React-tree
based), and focus stays in the field. Three things are fixed in `ComboboxContent`: a modal dialog sets `pointer-events:
none` on `<body>`, so the positioner sets `pointer-events: auto`; the dialog's scroll lock cancels `wheel`/`touchmove`
outside its content from a document listener, so the positioner stops their propagation (native scrolling stays); and
Radix listens for Escape on the document in the capture phase, so a window capture listener marks Escape handled
(`preventDefault`) while the list is open — Radix then does not dismiss, and Base UI, which does not check
`defaultPrevented`, closes the list. Rendering the list inside the overlay was tried and rejected: the dialog's
`overflow` and transform clip it, and in a short dialog it covered the title. Measured in Chromium (pick, wheel, Escape)
and in jsdom (tests). *Home / End* stay text-cursor keys, as in every editable combobox. *Chips* use Base UI's `Chip` and
`ChipRemove` with the library Chip's look rather than the `Chip` component: Base UI moves between chips with the arrow
keys and removes on Backspace / Delete on the chip, and the `Chip` component's own Backspace handler on its button would
remove twice. *Virtualised* lists work with `@tanstack/react-virtual` (`virtualized`, `useComboboxFilteredItems`,
`index` on each item).

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Open, named by a `<label>` | — | the input carries its labels' text as `aria-label`, read on mount, as the list opens (before Base UI hides the label) and when the label's text changes while closed; an own `aria-label` or `aria-labelledby` is kept | Basic | "keeps the name of its label while the list is open, when Base UI hides the label"; "takes its name from a label round it, leaving out hidden text, and follows a change of the label’s text"; "leaves the name of an input named by aria-labelledby or aria-label alone"; "multiple: the chips input keeps its label’s name while the list is open" |
| Form reset | back to `defaultValue`; the input keeps its focus | a controlled one gets `onValueChange(firstValue, { reason: "none" })` | — | "goes back to its defaultValue when its form resets, single and multiple, and tells onValueChange"; "controlled: a form reset calls onValueChange with the value it started with"; "resets after a React form action, and the field keeps the focus it had" |
| Chip remove target | the 22 px circle (16 px `sm`) unchanged | a transparent 24 px square takes presses (WCAG 2.5.8) | Multiple | "multiple: each chip’s remove button has a hit area of at least 24 × 24 px round its 22px circle (WCAG 2.5.8)" |

The earlier limit (Chrome reads the input with no name while the list is open) is fixed and no longer documented.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| In a popover | as anywhere; a pick keeps the popover open | Escape closes the list, then the popover | — | "in a popover: a click picks and the popover stays open; Escape closes the list, then the popover" |
| Form (`name`) | — | one hidden input per value (`multiple`), by `itemToStringValue` (an object's `value`) | — | "submits the chosen value under name, one hidden input per value with multiple" |
| Async, request superseded or failed | spinner off; a failure shows its text in `ComboboxStatus` | the status is the polite live region | Async | "async example: clearing the text while a search runs stops the spinner" |

| Key | Behaviour | Source |
| --- | --- | --- |
| Left Arrow (Right Arrow, right to left) at the start of the chips input | Focuses the last chip; the arrows move between the chips and back to the input | Base UI Combobox, with the provider's direction |

Notes:
- `Combobox` is now a component that renders Base UI's root inside Base UI's `DirectionProvider`, set from the provider's `dir` (as `InputOTP`), so Base UI's own keys flip right to left (the chip keys among them); its props and generics are Base UI's root's. Changed from stock: one row. Autocomplete, Multi-select, Tags input (its suggestions), Input number and Drawer wrap their Base UI roots the same way.
- The Async example keeps only the latest request (a counter, not the query text), turns the spinner off when the text is cleared mid-request, and catches a rejected request, showing its message in `ComboboxStatus`.

## Confirm

**Status:** built (0.1.1) · **Stock:** none: built on the library's AlertDialog (Radix AlertDialog).
**Pattern:** APG Alert Dialog <https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/> · **Completeness references:**
the visual target's OverlayManager (Basic, Update, Stacked, Confirm) and ConfirmDialog, Mantine `modals.openConfirmModal`,
Chakra/Ark imperative dialogs.

**API:** `ConfirmProvider` (render once inside `BooleanUIProvider`; one queue per provider, nothing in module scope, so
server rendering and several providers per page work) and `useConfirm()` → `confirm(options?) => Promise<boolean>`
(throws "useConfirm() must be called inside a <ConfirmProvider>." outside one). `ConfirmOptions`: `title?` (default
`confirmTitle`), `description?`, `confirmLabel?` (default `confirm`, `delete` when destructive), `cancelLabel?` (default
`cancel`), `tone?: "default" | "destructive"`, `icon?` (24 px, before the description), `defaultFocus?: "confirm" |
"cancel"` (default: Confirm, Cancel when destructive), `showCloseButton?` (default `true`), `onConfirm?: () => unknown`
(a returned promise keeps the dialog open with a spinner; rejection shows `Error.message` and keeps it open),
`returnFocusTo?: ReturnFocusTarget`. Parts (`data-slot`): `confirm-content` (on `alert-dialog-content`, with
`data-bui-motion="modal"`, `data-tone`), `confirm-header`, `confirm-title`, `confirm-body`, `confirm-icon`,
`confirm-description`, `confirm-error`, `confirm-footer`, `confirm-cancel`, `confirm-action`, `confirm-close`. Width 352 px
(the visual target's confirm); Cancel is `secondary`, Confirm `default` or `destructive`. Strings: `confirm`,
`confirmTitle`, `delete` (new), `cancel`, `close`, `loading` (existing).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | nothing rendered | — | — | (all) |
| open | 352 px panel, 12 px radius, title 18/27 semibold, × at the end, muted 14/21 description, buttons end-aligned | `role="alertdialog"`, `aria-modal`, named by the title, described by the description (no `aria-describedby` without one) | Basic | opens an alert dialog named by the title, with focus on Confirm, and resolves true when confirmed |
| destructive | red Confirm labelled `delete` | `data-tone="destructive"` | Destructive | starts on Cancel for a destructive confirmation, whose button reads Delete |
| icon / custom labels | 24 px icon 0.875rem before the description | icon `aria-hidden` | Custom labels and icon | takes custom labels, an icon and defaultFocus |
| busy (async) | spinner before the label, buttons at 60 % | dialog `aria-busy`, Confirm `aria-busy` + `aria-disabled`, Cancel and × `aria-disabled`; Escape ignored | Async confirm | shows a spinner and stays open while an async onConfirm runs, then resolves true |
| error | red 14/21 text under the description | `role="alert"` paragraph; focus back on Confirm | Async error | stays open with the error when onConfirm rejects, for another try |
| queued | one dialog at a time; the next opens after the previous has left | — | Queued | queues confirmations asked while one is open, one at a time, and returns focus at the end |
| trigger gone | — | focus to `returnFocusTo` | — | sends focus to returnFocusTo when the element that asked is gone |
| provider unmounted | — | pending promises resolve `false` | — | resolves false for every waiting confirmation when the provider unmounts |
| several providers | — | separate queues | — | keeps a separate queue per provider |
| strings | — | provider strings | — | takes its default title and labels from the provider; resolves false from the ×, named by the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter / Space | Activates the focused button (Confirm → `true`; Cancel, × → `false`) | APG Alert Dialog |
| Escape | Cancels (`false`); ignored while `onConfirm` runs | APG Alert Dialog (Radix) |
| Tab / Shift+Tab | Moves between the buttons, wrapping inside the dialog | APG Dialog (Radix FocusScope) |

**Notes.** Focus: the element focused when the first of a run of confirmations was asked is recorded and gets focus back
when the queue empties (else `returnFocusTo`); between queued dialogs focus moves straight to the next. The next queued
dialog opens only after the previous one's exit animation (its content unmounts), so each is perceived as new. Confirm
is a plain Button (not `AlertDialogAction`) so an async confirm can keep the dialog open; it uses `aria-disabled`, not
`disabled`, while busy so focus is never dropped. Default focus follows the visual target (accept) except for the
destructive tone, which follows APG (least destructive). No prompt (text input) variant.

### Behaviour details

- `onConfirm` rejecting: the message is an `Error`'s, or a non-empty string's, otherwise the new provider string
  `actionFailed` = "Something went wrong. Try again.". Test: "says that it failed when onConfirm rejects without a
  message, in the provider’s words".
- Focus at the end of a run: the element that asked, if on the page; else the trigger of the menu whose item asked
  (recorded as in Dialog's review); else `returnFocusTo`. Tests: "returns focus to the menu button when a menu item
  asked, since the item leaves with its menu" (a menu item and a submenu item), and "asked from inside a dialog, closes
  alone on Escape and returns focus into the dialog".

## Confirm popup

**Status:** built (0.1.1) · **Stock:** none: built on the library's Popover (Radix Popover, modal).
**Pattern:** APG Alert Dialog <https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/> · **Completeness references:**
the visual target's ConfirmPopup (Basic, Template, Headless), Ant Design Popconfirm, Mantine Popover confirm recipes.

**API:** `ConfirmPopup` — `open?`, `defaultOpen?`, `onOpenChange?`, `onConfirm?: () => unknown` (promise → spinner, stays
open; rejection → `Error.message`, stays open), `onCancel?` (Cancel, Escape, click outside), `tone?: "default" |
"destructive"`, `defaultFocus?: "confirm" | "cancel"`. `ConfirmPopupTrigger` — Popover trigger (`asChild`).
`ConfirmPopupContent` — `message?`, `icon?` (20 px), `confirmLabel?`, `cancelLabel?`, `side` (default `bottom`), `align`
(default `start`), `returnFocusTo?`, children replace icon + message, and PopoverContent props. Parts: `confirm-popup-trigger`,
`confirm-popup-content` (`data-bui-motion="overlay"`, `data-tone`), `confirm-popup-body`, `confirm-popup-icon`,
`confirm-popup-message`, `confirm-popup-error`, `confirm-popup-footer`, `confirm-popup-cancel`, `confirm-popup-action`,
`confirm-popup-arrow`. Look: 6 px radius, 1 px edge, overlay shadow (`shadow-md`), 0.625rem body padding with 0.5rem
gap, footer `0 0.625rem 0.625rem` with 0.375rem gap, small (28 px) buttons — Cancel `outline` in the muted colour,
Confirm `default`/`destructive` — and a 20 × 10 px arrow (fill `--popover`, edge `--border`) in the 10 px between trigger
and popup. Strings: `confirm`, `delete` (new), `cancel`, `loading`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | trigger only | trigger `aria-haspopup="dialog"`, `aria-expanded="false"` | Basic | opens from its trigger as an alert dialog named by the message, with focus on Confirm |
| open | popup below the trigger, start-aligned, arrow to it | `role="alertdialog"`, `aria-modal`, `aria-labelledby` → body; rest of page hidden | Basic | (same) |
| destructive | red Delete | `data-tone` | Destructive | starts on Cancel when destructive, with a red Delete button |
| custom content | your content in the body | names the popup | Custom content | takes your own content, which names the popup, and a side |
| placement | four sides, flips on collision | `data-side`, `data-align` | Placement | (same) |
| busy | spinner in Confirm, buttons 60 % | popup `aria-busy`; Confirm `aria-busy` + `aria-disabled`; Escape/outside ignored | Custom content | waits for an async onConfirm with a spinner, ignoring Escape, then closes |
| error | red text above the footer | `role="alert"` | Async error | stays open with the error when onConfirm rejects |
| controlled | — | — | — | is controlled with open and onOpenChange |
| trigger gone | — | focus to `returnFocusTo` | — | sends focus to returnFocusTo when the confirmed action removed the trigger |
| strings | — | — | — | takes its labels from the props or the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter / Space | On the trigger opens; on a button activates it | APG Button |
| Escape | Cancels and closes; focus to the trigger; ignored while busy | APG Alert Dialog (Radix) |
| Tab / Shift+Tab | Between Cancel and Confirm, wrapping (focus trapped) | APG Dialog (Radix FocusScope) |

**Notes.** Default focus follows the visual target (Confirm) except for `destructive` (Cancel). Modal like the visual
target's focus-trapped popup: a click outside cancels and does not reach what it lands on. The arrow is centred on the
trigger by Radix Popper (the visual target pins it 1.125rem from the popup's start).

### Behaviour details

`onConfirm` rejecting: as Confirm's (`actionFailed` when there is no message). Test: "says that it failed when onConfirm
rejects without a message, or with a string".

## Context menu

**Status:** built (0.1.1) · **Stock:** shadcn `context-menu` (Radix Context Menu), with the patches in `PATCHES.md`.
**Pattern:** WAI-ARIA APG Menu <https://www.w3.org/WAI/ARIA/apg/patterns/menubar/> · **Completeness references:** Base UI
Context Menu <https://base-ui.com/react/components/context-menu> · React Aria Menu <https://react-aria.adobe.com/Menu>

**API:** stock's parts unchanged: `ContextMenu`, `ContextMenuTrigger`, `ContextMenuContent`, `ContextMenuItem`
(`variant` `default` | `destructive`, `inset`), `ContextMenuCheckboxItem`, `ContextMenuRadioGroup`,
`ContextMenuRadioItem`, `ContextMenuLabel` (`inset`), `ContextMenuSeparator`, `ContextMenuShortcut`, `ContextMenuGroup`,
`ContextMenuPortal`, `ContextMenuSub`, `ContextMenuSubTrigger` (`inset`), `ContextMenuSubContent`. No strings.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Look | stock menu | exactly the package's dropdown menu: 29 px rows (0.25 × 0.625 rem padding, 14 / 21 px), 4 px item radius, a 6 px-radius surface with 0.25 rem padding and 2 px between rows, the overlay shadow, 14 px icons in `--control-hover` that darken on focus, muted semibold labels, full-width 1 px rules, a 6 px dot and 14 px check | The visual target's context menu (resolved CSS) and the dropdown menu already matched to it. |
| Destructive | `--destructive` on 10 % | `--destructive-strong` on `--destructive-subtle` | As the dropdown menu. |
| Disabled | 50 % | 60 % | The target. |
| Submenu chevron | 16 px, unmirrored | 12 px, `rtl:rotate-180` | The target's 12 px submenu icon; RTL. |
| Motion | stock animate classes | plus `data-bui-motion="overlay"` on the content and sub-content | The theme sets timing, exit and reduced motion. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| open | menu at the pointer | `role="menu"`, trigger `data-state="open"` | Basic | opens on right-click as a menu with the right attributes, with overlay motion |
| highlighted | `--accent` fill, icon `--muted-foreground` | `data-highlighted` | Basic | moves with the arrow keys, skips a disabled item, and wraps |
| disabled item | 60 % | `aria-disabled`, `data-disabled` | — | marks a disabled and a destructive item |
| destructive | strong red, subtle red when highlighted | `data-variant="destructive"` | Destructive item | marks a disabled and a destructive item |
| checkbox / radio | check / dot in the icon column | `menuitemcheckbox` / `menuitemradio`, `aria-checked` | Checkbox and radio items | toggles a checkbox item and chooses one radio item |
| submenu open | trigger keeps the `--accent` fill | `aria-haspopup="menu"`, `aria-expanded` | Submenus | opens a submenu with ArrowRight and closes it with ArrowLeft |

| Key | Behaviour | Source |
| --- | --- | --- |
| Shift + F10, menu key | Opens on the focused trigger (the browser's `contextmenu` event) | Platform convention; Radix |
| ↓ / ↑ | Next / previous item, wrapping | APG Menu |
| Home / End | First / last item | APG Menu |
| A–Z | Type-ahead | APG Menu |
| Enter, Space | Choose and close | APG Menu |
| → / ← | Open / close a submenu (mirrored in RTL) | APG Menu; Radix with `dir` |
| Escape | Close, focus back to the trigger area | APG Menu |

**Notes:** Radix does not make the trigger focusable; the docs and examples give it `tabIndex={0}`. A context menu must
only repeat actions that are visible elsewhere.

### Behaviour details

As Dropdown menu's: arrows stop at the ends unless `loop` (tests "moves with the arrow keys, skips a disabled item, and
stops at the ends", "wraps from the last item to the first with loop"); `ContextMenuSubContent` scrolls.

## Copy button

**Status:** built (0.1.1) · **Stock:** none: built on Button and Tooltip.
**Pattern:** WAI-ARIA APG Button <https://www.w3.org/WAI/ARIA/apg/patterns/button/> with a status live region
<https://www.w3.org/TR/wai-aria-1.2/#status> · **Completeness references:** Mantine CopyButton
<https://mantine.dev/core/copy-button/> · Carbon CopyButton <https://carbondesignsystem.com/components/copy-button/usage/>

**API:** `CopyButton` — Button's props except `size`, `children`, `value`, `asChild`, `aria-label`, `onCopy`; `value?`,
`getValue?()` (string or promise; wins over `value`), `timeout?` (2000 ms), `onCopy?(text)`, `onCopyError?(error)`,
`showLabel?`, `label?` (the icon button's name; `copy` string by default), `size?` (`xs` | `sm` | `default` | `lg`),
`tooltip?` (true), `tooltipSide?`. `variant` defaults to `ghost` (icon) / `outline` (label). Exports `CopyButton` and
`copyText(text): Promise<boolean>`. Parts: `copy-button`, `copy-button-label`, `copy-button-status` (an `<output>`).

**Copying.** `navigator.clipboard.writeText`; if missing or rejected, a read-only off-screen `<textarea>` is focused,
selected and `document.execCommand("copy")` run, then removed and focus restored to the element that had it.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| idle | copy icon; tooltip "Copy" on hover and focus (icon only) | `data-state="idle"`, `aria-label` (icon only) | Icon only | copies its value with the Clipboard API on Enter… |
| copied | check icon; tooltip held open with "Copied", or the label reads "Copied"; for `timeout` ms | `data-state="copied"`; `<output aria-live="polite">` says "Copied"; the name does not change (icon only) | Icon only, With label | copies…; goes back to Copy after the timeout |
| fallback | as copied | — | — | falls back to the copy command when the Clipboard API is missing, and keeps focus |
| failed | × icon, "Copy failed" | `data-state="failed"`; status says "Copy failed" | Copy fails | falls back when the Clipboard API refuses, and says Copy failed when nothing works |
| getValue | — | — | Custom timeout | copies what getValue returns at the moment of the click |
| with label | outline button, icon + "Copy" | `data-size` the text size | With label | shows the label beside the icon with showLabel, sized as a text button |
| in an input group | 24 px (`xs`) at the field's end | the status is an `<output>`, so InputGroup does not take it for a text add-on | In an input group | — |
| sizes, translated | provider `controlSize`, strings | `data-size` | — | takes its words from the provider and its size from the provider |
| disabled | 60 % | `disabled` | Disabled | does nothing when disabled |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | Copies | native button |

**Notes.** Strings: `copy`, `copied`, `copyFailed` new. Two copies within the timeout announce once (the region keeps the
same text). The Clipboard API needs a secure context.

### Behaviour details

- The copy-command fallback puts its hidden text area in the button's parent, so a `Dialog` or `Sheet` focus trap does not pull focus out of it; `copyText(text, container?: HTMLElement | null)`. Test: falls back inside a dialog.
- Key row: | Escape | Closes the tooltip, "Copied" included | Radix Tooltip | — test: closes the Copied tooltip on Escape before its time is up.
- A copy that settles after unmount sets no state and starts no timer (`onCopy` still fires). Test: leaves no timer behind when it is removed before the copy ends.

## Data table

**Status:** built (0.1.1) · **Stock:** none: built on TanStack Table 9 (`@tanstack/react-table` 9.2.5, state and row
models) and TanStack Virtual 3 (`@tanstack/react-virtual` 3.14, row virtualisation). shadcn has no data-table registry
item; its data-table page is a recipe written for TanStack Table 8.

**Pattern:** WAI-ARIA APG Table <https://www.w3.org/WAI/ARIA/apg/patterns/table/> and its sortable table example
<https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/> · **Completeness references:** React Aria Table
<https://react-spectrum.adobe.com/react-aria/Table.html> · TanStack Table 9 guides <https://tanstack.com/table/latest> ·
the visual target's DataTable page (Basic, Size, Gridlines, Striped Rows, Selection, Sort, Pagination, Scroll, Row
Expansion, Editing, Row Grouping, Column Resize, Column Reorder, Column Toggle, Column Group, Filter, Export, Lazy
Loading, Loading, Empty State, Advanced). Base UI has no table.

**API.** One entry, `@booleanpress/ui/data-table`, flat named exports:

- `DataTable<TData>` (`data-slot="data-table"`, with `data-size`, `data-gridlines`, `data-striped`): `columns`
  (TanStack 9 column definitions), `data`, `getRowId`, `getSubRows`, `getRowLabel`; features `sorting`, `filtering`
  (`true` | `"global"` | `"columns"`), `pagination` (`true` | `{ pageSizes, range }`), `selection` (`"single"` |
  `"multiple"`), `renderSubRow`, `grouping`, `onCellEdit` (with `meta.editor` on columns), `columnResizing`,
  `columnOrdering`, `columnVisibility`, `stickyHeader` + `maxHeight`, `virtual` (`true` | `{ rowHeight, overscan }`),
  `loading` (`true` | `"overlay"` | `"skeleton"`), `empty`, `size` (`ControlSize`, provider default), `gridlines`,
  `striped`, `toolbar` (your content), `exportCsv` (`true` | file name), `selectOnRowClick` (default `true`),
  `caption`, `aria-label`, `aria-labelledby`, `className`; state `state`, `initialState` and one `on…Change` per slice
  (`sorting`, `columnFilters`, `globalFilter`, `pagination`, `rowSelection`, `expanded`, `grouping`, `columnSizing`,
  `columnOrder`, `columnVisibility`, `columnPinning`); server mode `manualSorting`, `manualFiltering`,
  `manualPagination`, `rowCount`, `pageCount`; `tableOptions` for any other TanStack option; `renderGroupHeader`.
- `useDataTable<TData>(options)` → the TanStack React table instance (`DataTableInstance<TData>`), with the selection
  and expansion columns added.
- `DataTableColumnHeader` (`th`, `data-slot="data-table-head"`): sort button (`data-table-sort`) with its arrow,
  `aria-sort`, drag grip (`data-table-drag-grip`), column menu (`data-table-column-menu`: Move left, Move right, Hide
  column), resize handle (`data-table-resize-handle`); props `header`, `reorderable`, `resizable`, `th` props.
- `DataTableToolbar` (`data-table-toolbar`): children, the selected count, search (`data-table-search`), Columns menu
  (`data-table-columns`), Export CSV (`data-table-export`); props `table`, `search`, `columnsMenu`, `exportCsv`.
- `DataTablePagination` (`data-table-pagination`): `PaginationPages`, optional `PaginationRange` and
  `PaginationRowsPerPage`; props `table`, `pageSizes`, `range`.
- `DataTableRowActions` (`data-table-row-actions`): ⋯ menu trigger named "Actions for {name}"; props `label`,
  `children` (menu items), `align`.
- `exportToCsv(table, { rows: "all" | "page" | "selected", separator })` → CSV text; `downloadCsv(text, filename)`.
- `createDataTableColumnHelper<TData>()`; types `DataTableProps`, `UseDataTableOptions`, `DataTableColumnDef`,
  `DataTableColumnMeta` (`label`, `align`, `headerClassName`, `cellClassName`, `filter`, `editor`, `editorOptions`,
  `exportValue`), `DataTableMeta`, `DataTableOption`, `DataTableFeatures`, `DataTableInstance`, `DataTableRow`,
  `DataTableState`, `DataTableCellEdit`, `ExportToCsvOptions`.

Other parts: `data-table-container` (the scroll box), `data-table-table`, `data-table-header`, `data-table-header-row`,
`data-table-filter-row`, `data-table-filter`, `data-table-body`, `data-table-row`, `data-table-cell`,
`data-table-sub-row`, `data-table-group-row`, `data-table-group-footer`, `data-table-skeleton-row`,
`data-table-empty`, `data-table-spacer`, `data-table-footer`, `data-table-caption`, `data-table-loading`,
`data-table-status` (live region), `data-table-radio`, `data-table-expand`, `data-table-edit-trigger`,
`data-table-editor`, `data-table-selected-count`.

**Why this shape.**

| Choice | Reason |
| --- | --- |
| One `DataTable` with a prop per feature, plus `useDataTable` and the parts | The common table is one element; a layout it does not draw uses the same hook and parts instead of a second API. Flat named exports, as every entry. |
| TanStack Table 9, features registered once (`DataTableFeatures`) | v9 makes features opt-in; one fixed set keeps column types simple (`DataTableColumnDef<Row>`) and every feature prop a boolean. The set is built in a `/* @__PURE__ */` call, so importing only `exportToCsv` or the parts lets a bundler drop it. Built-in filter, sort and aggregation functions are registered one by one, not as the full registries. |
| State as TanStack has it (`state` / `initialState` / `on…Change` per slice) | Controlled or not, slice by slice, with no wrapper vocabulary to learn; `manual…` flags hand processing to a server. Undefined props are dropped before they reach TanStack, so an absent callback never overrides the internal updater. |
| A native table, not an ARIA grid | Spec standard §6.1: native semantics first. Every control is a tab stop; no roving cell focus. |
| Single selection as native radios sharing a name | The browser's radio group gives Tab-once and arrow-key selection between rows for free; a press on the row selects too. Multiple selection is checkboxes with the header box (mixed computed as "some and not all", as v9 changed `getIsSome…`). |
| Cells carry the lines; the table's borders are separate | Lines stay on sticky header cells and frozen columns; the visual target uses separate borders too. |
| Sized tables use a `colgroup`, the last column takes the rest | Header rows can span; a fixed layout reads widths from `col`. The last column has no handle, as in the visual target's fit mode, and the table grows past its box (and scrolls) when the columns need it. |
| Column menu shown on hover and focus | A narrow column keeps its title; the menu is always shown on touch screens and whenever it has focus. |
| Virtualiser in its own body component, spacer rows | Scrolling re-renders the visible rows only; spacer rows keep the native table layout, `aria-rowcount` and `aria-rowindex`. |
| Row reorder left to the list batch | It needs drag-and-drop announcements in the provider's strings (dnd-kit's are English); the column menu covers column order by keyboard. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | 41 px header (semibold 14/24 on `--card`, 1 px `--border` line, `--muted` in dark), 38 px rows (14/21, 0.5 × 0.875 rem) | native `table`, `th scope="col"` | Basic | renders a native table with column headers and one row per record |
| sizes | `sm` 26 px rows (0.125 × 0.375 rem), `lg` 46 px (0.75 × 1.125 rem) | `data-size` | Sizes | reaches its size, gridlines and stripes through data attributes |
| gridlines | 1 px line around every cell | `data-gridlines` | Gridlines, Column groups, Column resize | as above |
| striped | every other row `--subtle` (`--background` in dark) | `data-striped` | Striped | as above |
| hover | row `--accent` | — | every example | — |
| sorted | arrow up/down in `--foreground`; unsorted ⇅ in `--muted-foreground`, darker on hover; sort index with several columns | `aria-sort` on the first sort column; live "Sorted by {column}, {direction}" | Sort | sorts with Enter…; sorts with Space, and adds a second column with Shift; adds a column with Shift and Enter |
| selected | row `--highlight` / `--highlight-foreground`, its lines `--accent` (`--card` in dark) | `data-state="selected"`; checkbox `aria-checked`; radio `checked` | Single selection, Multiple selection | selects rows with Space…; selects a range with Shift; selects one row with radios… |
| mixed | header box with a dash | `aria-checked="mixed"` | Multiple selection | selects rows with Space… |
| expanded | chevron down; the sub-row below | `aria-expanded`, name swaps Expand/Collapse | Row expansion | expands a row with Enter… |
| grouped | group header row (chevron, value, count badge), group total row | — | Row grouping | groups rows under header rows that expand, with totals |
| editing | 28 px field in the cell, pulled into the 21 px line | field named by the column | Cell editing | edits a cell: Enter starts…; F2 starts, Escape cancels… |
| filtered | search field, filter row (28 px fields, a select) | live "{count} results"; `noResults` when none | Filter | filters over every column… |
| paged | paginator under the table, range and rows-per-page optional | live "11–20 of 120" | Pagination, Advanced | pages the rows and announces the range |
| resizing | `--primary` 1 px line on the handle while hovered, focused (2 px) or dragged | `role="separator"`, `aria-valuenow` (px) | Column resize | resizes a column with the arrow keys…; swaps the resize arrows in RTL |
| reordering | drag grip; drop target `--primary` inset edge | menu items, Move left disabled at the edge | Column reorder | moves a column with Move right in its menu |
| hidden column | Columns menu, Hide column | focus moves to the header row | Column visibility | hides a column from the toolbar Columns menu and from the column menu |
| sticky / frozen | header and pinned column stay; frozen column's end line | — | Scroll | — (layout) |
| loading, first | skeleton rows | `aria-busy`; status "Loading"; rows `aria-hidden` | Loading, Server mode | shows skeleton rows…, and a spinner… |
| loading, refresh | `--card` 50 % mask, 40 px `--primary` spinner | spinner `role="status"` named "Loading" | Loading | as above |
| empty | `empty` content, or "No rows" | cell spans every column | Empty | says when there are no rows… |
| virtual | only rows in view drawn | `aria-rowcount`, `aria-rowindex` | Virtual rows | draws only the rows in view of 10,000… |
| server | rows in the server's order | — | Server mode | hands sorting, filtering and paging to the server |
| RTL | logical padding and pinning; chevrons mirrored; resize arrows swapped; column resizing direction from the provider | provider `dir` | Advanced (`?dir=rtl`) | swaps the resize arrows in a right-to-left page |

Rows not applicable: disabled and invalid (a table holds no single value; rows that cannot be selected use TanStack's
`enableRowSelection` function and render a disabled box), read-only (cells are read-only unless `meta.editor`).

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On a column title, sorts: ascending, descending, not sorted | APG sortable table |
| Shift + Enter (or Shift + press) | Adds the column to the sort | TanStack multi-sort |
| Space | On a row checkbox, selects the row; on the header box, every row of the page | APG checkbox |
| ArrowDown, ArrowUp | Between single-selection radios, moves the selection | APG radio group (native) |
| Enter, Space | On an expand button, expands or collapses the row or group | APG disclosure |
| Enter, F2 | On an editable cell, opens the editor; Enter commits, Escape cancels; focus returns to the cell | spreadsheet convention |
| ArrowRight, ArrowLeft (Shift: 50 px) | On a resize handle, widens or narrows the column by 10 px; swapped in RTL | APG window splitter |
| Enter, Space, ArrowDown | On a column's options button, opens its menu | APG menu button (Radix) |

Strings added: `sortAscending`, `sortDescending`, `sortNone`, `sortedBy`, `resultsCount`, `selectRow`, `selectAllRows`,
`expandRow`, `collapseRow`, `resizeColumn`, `columnMenu`, `moveColumnLeft`, `moveColumnRight`, `hideColumn`,
`filterColumn`, `editCell`, `rowActions`, `columns`, `exportCsv`, `noRows`. Reused: `search` (the search field, in place
of a new `searchTable`), `selectedCount` (in place of `rowsSelected`; same text), `noResults`, `loading`, `pageRange`,
`rowsPerPage`, `previous`, `next`, `clear`.

Notes. Numbers in announcements are formatted with the provider's locale. "{count} results" is one string for every
count. CSV export writes raw values (or `meta.exportValue`), RFC 4180 quoting, CRLF lines, a byte-order mark on
download, and a leading apostrophe on cells that start like a formula. Virtual rows need one row height and are not
combined with expansion or grouping. Dragging a column header uses native drag and drop (no keyboard); the column
menu is the keyboard path. The visual target's paginator also has first- and last-page buttons; the library's
`PaginationPages` has none, so neither has the data table.

### Additions

- `rowReordering?: boolean` (in `UseDataTableOptions`): adds the `__reorder` utility column first (48 px, not sortable,
  hideable, resizable or filterable). `onRowOrderChange?: (data: TData[], move: DataTableRowMove) => void` on
  `DataTable`; `DataTableRowMove = { rowId, from, to }` (indexes in `data`). Built on `@dnd-kit/core` + `@dnd-kit/sortable`
  (PointerSensor with a 4 px activation distance, KeyboardSensor with `sortableKeyboardCoordinates`, vertical axis only,
  `closestCenter`); the page's top-level rows are one `SortableContext`.
- Handles rest (`disabled`) while sorted, grouped, virtual, or without `onRowOrderChange`; sub-rows have no handle.
- `pagination: { showEdges?: boolean }` (default `true`) and `DataTablePagination` `showEdges` (default `true`).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| reorderable | 14 px bars in `--control-hover`, `--secondary-foreground` on hover, grab cursor | `button` named `dragHandle` ("Drag {item}") | Row reorder | adds a drag handle named after its row at the start of each row |
| dragging | row follows the pointer, raised with `shadow-md` | `aria-pressed="true"` on the handle, `data-dragging` on the row | Row reorder | moves a row with the keyboard … each step announced |
| resting | handles at 60 % | `disabled` | — | rests the handles while the table is sorted, or without onRowOrderChange |
| first / last pages | « and » round the pages | `aria-disabled` at the ends | Pagination | shows First and Last round the pages, and leaves them out with showEdges: false |

| Key | Behaviour | Source |
| --- | --- | --- |
| Space / Enter (handle) | picks the row up; again, drops it | dnd-kit KeyboardSensor |
| ArrowDown / ArrowUp (picked up) | moves the row one place | `sortableKeyboardCoordinates` |
| Escape (picked up) | puts the row back | dnd-kit KeyboardSensor |

Announcements go to the table's own polite status region (dnd-kit's are silenced): `dragStarted`, `itemMoved` (each new
place once, and on drop) and `dragCancelled`, with `{item}` = the row label and `{position}` / `{total}` counted in `data`.

### (row reordering entry)

This replaces "Built on `@dnd-kit/core` + `@dnd-kit/sortable`" in the row-reordering bullet of `f-followups.md`, and the
"Row reorder left to the list batch" row of `data-table.md`.

- **Entry.** Row reordering lives in `@booleanpress/ui/data-table-reorder` (`src/components/data-table-reorder.tsx`),
  the only data-table file that imports dnd kit (`@dnd-kit/core` + `@dnd-kit/sortable`: PointerSensor, 4 px activation;
  KeyboardSensor with `sortableKeyboardCoordinates`; vertical axis only; `closestCenter`; the page's top-level rows one
  `SortableContext`). It exports `ReorderableDataTable<TData>` (`ReorderableDataTableProps` = `DataTableProps` without
  `rowReordering`, with `onRowOrderChange` required), which renders `DataTable` with `rowReordering` inside the layer.
  Peers: `@dnd-kit/core` and `@dnd-kit/sortable` for this entry only; the Data table page lists only the TanStack peers.
- **Seam.** `src/lib/data-table-reorder-layer.ts` (internal) holds `DataTableReorderLayerContext` (`Root`: the drag
  context; `Row`: a `useSortable` row that follows the drag and sets `data-dragging`) and
  `DataTableReorderHandleContext` (what a row hands its handle). The handle's look and name, the announcements
  (`dragStarted`, `itemMoved`, `dragCancelled`) and the new order (`onRowOrderChange(data, { rowId, from, to })`) stay in
  `data-table.tsx`. `rowReordering` stays in `UseDataTableOptions` (adds the `__reorder` column); a plain `DataTable`
  without the layer leaves it out. The table resets the layer for tables nested in its rows.
- **Tests.** Moved to `tests/components/data-table-reorder.test.jsx` (the five existing cases, now on
  `ReorderableDataTable`), plus "is the only way to move rows: a plain DataTable leaves the handles out".

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| paged, filtered or sorted | back to the first page when a client-side filter or sort changes the rows | `aria-current="page"` on 1 | Advanced | goes back to the first page when a filter or a sort changes the rows |
| page sizes | starts at the first of `pagination.pageSizes` unless `initialState.pagination` says otherwise | select shows the size in use | Advanced | starts at the first of its page sizes, shown in the rows-per-page select |
| page past the end | paginator and range show the last page | `aria-current` on the last page | — | shows a page past the end as the last page, in the paginator and the range |
| selected count | counts ids still in `data`; with a server that pages (`pagination` + `manualPagination`), every selected id | — | Advanced | counts only the selected rows still in the data, unless the server pages |
| last column | Hide column and its Columns menu item disabled for the last data column shown | `aria-disabled` | Column visibility | keeps the last column shown: its Hide items are disabled |
| editing or moving inside an overlay | — | Escape cancels the edit or the move; the `Dialog`, `Sheet` or `Popover` round the table stays open | — | cancels an edit with Escape inside a dialog without closing the dialog; puts a row back with Escape inside a dialog, leaving the dialog open |
| virtual with a footer | — | `aria-rowcount` counts header, body (or the empty row) and footer rows; footer and empty rows carry `aria-rowindex` | — | counts the footer rows in a virtual table, each with its row index |

| Key | Behaviour | Source |
| --- | --- | --- |
| (column menu) Move left, Move right | In a right-to-left page, Move left moves towards the end; the edge item is disabled | visual direction |

Notes. Radix layers listen for Escape on the document in the capture phase and close unless the key's default action is
prevented: the cell editor takes Escape on the window (capture) while it is open and cancels itself; a reorderable table
prevents Escape's default on the window while a row moves, so dnd kit still cancels the move and the layer stays open.
CSV: a text that starts with `=`, `+`, `-`, `@`, a tab, a carriage return or a line feed is written with a leading
apostrophe unless it is a plain number (`-12.5`, `-1,5`, `+3e2`); numbers are never changed (OWASP CSV injection). The
Export CSV button saves the filtered rows of every page. `downloadCsv` frees the file's object URL 40 s after the
download starts, as some browsers read it after `click` returns. A column drag carries the table's own id, so a header
dropped on another table is ignored; pressing a resize handle prevents the default action, so a movable header is not
dragged and no text is selected. Server mode: the consumer resets the page when a filter changes and drops answers to
older requests (the Server mode example cancels them in its effect's cleanup); the example's first page arrives with
the page, so its first paint is the loaded rows.

## Data view

**Status:** built (0.1.1) · **Stock:** none: built on semantic HTML (a `ul` of items) with the library's `Select`,
`SegmentedControl`, `Pagination` (`PaginationPages`), `Skeleton` and `Empty`.
**Pattern:** the items are a list; the layout switch follows APG Radio Group
<https://www.w3.org/WAI/ARIA/apg/patterns/radio/>, the sort select APG Select-Only Combobox
<https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/> · **Completeness references:** Base UI
has none; React Aria GridList <https://react-aria.adobe.com/GridList> (layout="grid", empty state, loading), MUI X Data
Grid's list view, and the visual target's data view (list/grid layouts, sorting, paginator, loading).

**API:** `DataView<T>` — `items: readonly T[]`, `renderItem(item, layout, index)`, `getItemKey?`, `layout?` /
`defaultLayout` ("list") / `onLayoutChange`, `layoutToggle`, `sortOptions?: { value, label, compare? }[]`, `sort?` /
`defaultSort` / `onSortChange`, `pageSize?`, `page?` / `defaultPage` (1) / `onPageChange`, `total?` (server paging),
`loading`, `skeletonCount?`, `renderSkeleton?`, `empty?`, `header?`, `footer?`, `itemMinWidth` ("15rem"), `aria-label` /
`aria-labelledby` (forwarded to the list), and `div` props on the root. `DataViewLayoutToggle` — `value`, `onValueChange`,
`size` ("sm"), SegmentedControl props. `DataViewSort` — `value?`, `onValueChange`, `options`, `size?`, SelectTrigger
props. Parts: `data-view`, `data-view-header`, `data-view-list` (`data-layout`), `data-view-item`, `data-view-loading`,
`data-view-empty`, `data-view-footer`, `data-view-layout-toggle`, `data-view-sort`. Client-side sorting with `compare`,
client-side paging by slicing; with `total` the items are taken as the current page. Changing the sort goes back to page 1.
Strings: `layout` ("Layout"), `layoutList` ("List"), `layoutGrid` ("Grid"), `sortBy` ("Sort by"), `noItems` ("No
items"); reuses `loading`, `pagination`, `previousPage`, `nextPage`, `morePages`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default (list) | rows divided by 1 px `--border`, 1rem above and below each | `ul` named by `aria-label`, one `li` per item, `data-layout="list"` | Basic | renders the items as a named list, one list item each, in the list layout |
| grid | cards in `repeat(auto-fill, minmax(itemMinWidth, 1fr))`, 1rem gaps | `data-layout="grid"`; `renderItem` receives `"grid"` | Grid | passes the layout to renderItem and lays out a grid with defaultLayout="grid" |
| layout switch | 28 px icon segmented control at the header's end, under a 1 px `--border` | `radiogroup` "Layout" of radios "List" / "Grid" | Layout | moves focus into the layout switch with Tab; switches with ArrowRight / ArrowLeft; follows a controlled layout |
| sorted | a Select showing "Sort by" until chosen | `combobox` "Sort by" | Sorting | opens with Enter / ArrowDown, sorts with ArrowDown and Enter; Escape keeps the order |
| paged | `PaginationPages` centred in the footer over a 1 px `--border` | `nav` "Pagination", `aria-current="page"` | Pagination | pages the items and shows a page with Enter; goes back to page 1 when the sort changes; server paging with total |
| loading (first) | `Skeleton` rows or cards in the layout's shape | wrapper `aria-busy`, `role="status"` "Loading", placeholders `aria-hidden` | Loading | shows placeholders and a status while the first items load |
| refreshing | items stay, at 60 % opacity | list `aria-busy="true"` | Refreshing | keeps the items, dimmed and busy, while new ones load |
| empty | the provider's `noItems` in `--muted-foreground`, or `empty` | — | Empty | shows the provider's noItems text with no items, and a custom empty state |
| error | the consumer's `empty` with a retry action | — | Error | (covered by the empty-state test) |
| strings | provider names | — | — | names the switch, its radios and the sort select from the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Sort select, layout switch, each item's controls, the pages | DOM order |
| → / ← | In the layout switch, the next / previous layout (mirrored in RTL) | APG Radio Group (SegmentedControl) |
| Enter | Opens the sort options / chooses one / follows a page | APG Combobox (Radix Select); link |
| ↓ | Opens the sort options; moves to the next option | APG Combobox (Radix Select) |
| Escape | Closes the sort options without sorting | APG Combobox (Radix Select) |

**Notes.** The reference's sorting demo uses a select button of two orders; the brief asks for a Select of sort keys, so
the header carries a Select with "Sort by" as its name and placeholder. The list padding (1rem) and the grid gap are the
component's; the cards' look is the consumer's `renderItem`, and the examples copy the reference cards (1 px edge, 4 px
radius, 1.5rem padding). Not built: drag reordering, virtualised lists, arrow-key movement between cards (each card's
controls are tab stops), an announcement of the new page (use `PaginationRange` in `footer`). `role="list"` is not set
(lint rule), so Safari's VoiceOver reads the bullet-less list without a count.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Any | — | an empty `role="status"` (`data-slot="data-view-status"`) is always rendered; it holds the provider's `loading` text while the first items load | loading | keeps its status region on the page |
| Provider locale | page numbers in the locale's digits (from Pagination) | — | pagination | numbers its pages in the provider's locale |

## Date field

**Status:** built (0.1.1) · **Stock:** none: built on the same segmented group as TimeField (`src/lib/date-segments.tsx`),
with the locale's order and separators from `Intl.DateTimeFormat#formatToParts`.
**Pattern:** APG Spinbutton <https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/>, React Aria DateField
<https://react-aria.adobe.com/DateField> · **Completeness references:** React Aria DateField, Base UI has none.

**API:** `DateField` — `value?: Date | null` (midnight in the provider's zone), `defaultValue`, `onValueChange(Date | null)`,
`min?`, `max?: Date` (outside → invalid), `size`, `variant`, `fluid`, `disabled`, `readOnly`, `required`, `name` (hidden
`YYYY-MM-DD`), `aria-invalid`, `div` props. Parts: `date-field`, `date-field-segment`, `date-field-literal`. New strings:
`day`, `month`, `year` (and `emptySegment`).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | Input's field look, month/day/year (en-US) | `group` + three `spinbutton`s; month `aria-valuetext` is its name | Basic | renders month, day and year in the en-US order |
| locale order | day.month.year with dots (de-DE) | — | Locale order | follows the locale order and separators… |
| typing | segments fill and advance; a 1–2 digit year becomes 20xx on blur | — | Basic | fills from typed digits…; reads a two-digit year as 20xx when focus leaves it |
| month end | the day comes back to the month's last day | — | — | brings the day back to the month end when the month changes |
| empty | "––" / "––––" muted | `aria-valuetext="Empty"` | Invalid | empties the value when a segment is cleared with Backspace; empties a segment with Delete |
| min / max | `--invalid` edge | `aria-invalid` on the segments | Min and max | marks the field invalid outside min and max |
| invalid / disabled | `--invalid` edge; `--field-disabled` | `aria-invalid`; `aria-disabled`, `tabindex=-1` | Invalid, Disabled | is invalid with aria-invalid, and disabled when disabled |
| read-only | the date, unchanged by keys | `aria-readonly` on the segments, which stay in the tab order | Read-only | keeps its segments focusable and marked read-only, and the keys change nothing |
| sizes / filled | 28 / 35 / 42 px; `--field-filled` | `data-size`, `data-variant` | Sizes, Filled | reaches data-size, and submits YYYY-MM-DD with name |
| time zone | midnight in the provider zone | — | — | makes midnight in the provider time zone |
| controlled, refused | the segments go back to the parent's date; a part-filled field stays as typed | the parent's `value` is shown and submitted | Controlled with a rule | controlled: proposes a change the parent refuses, and keeps showing and submitting the parent's date; a parent that answers later sees the old date until it does; a cleared segment stays empty to be typed again |
| form reset | back to `defaultValue`; a cancelled reset changes nothing; a controlled date is the parent's | hidden input follows, and takes `form` | With a form | uncontrolled: a form reset puts the default back…; a cancelled reset changes nothing; belongs to the form its form attribute names |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowUp / ArrowDown | ±1, wrapping (the day by the month's length) | APG Spinbutton |
| ArrowRight / ArrowLeft | Next / previous segment | React Aria |
| 0–9 | Types, moving on when complete | React Aria |
| Backspace | Removes the last digit; on an empty segment, goes back | React Aria |
| Delete | Empties the segment | React Aria |
| Home / End | Lowest / highest value (the day's highest is the month's last) | APG Spinbutton |

**Notes.** Always the Gregorian calendar (`calendar: "gregory"` is forced, so th-TH does not show Buddhist years). Name the
group with `aria-labelledby`: a label's `htmlFor` cannot name a group.

### Behaviour details

A one- or two-digit year becomes, on blur, the year nearest today within 50 years ("85" is 1985). A phone keyboard's
Backspace (`beforeinput` with `deleteContentBackward`, no key event) removes a digit as Backspace does; other deletions
empty the segment. A press on a separator acts as a press on the padding (focuses the first empty segment). A disabled
field's hidden input is disabled, so it submits nothing. The segments are re-read from the value when the provider's
`timeZone` changes. Limit, documented: in Arabic locales the segments read left to right (day at the left), where Arabic
text and DatePicker's field write a numeric date right to left (day at the right).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| skipped midnight | the typed day kept | hidden input `YYYY-MM-DD` of that day | — | keeps a day whose midnight the clocks skip in the provider time zone |
| short year, last century | year 1985 | — | — | reads a two-digit year from the last century when it is nearer, as for a date of birth |
| phone Backspace | a digit removed | — | — | removes a digit on a phone keyboard's Backspace, which sends no key event |
| press on a separator | first empty segment focused | — | — | focuses the first empty segment on a press on a separator |
| disabled, named | — | hidden input `disabled` | Disabled | submits nothing while disabled, as a disabled input does |

## Date picker

**Status:** built (0.1.1) · **Stock:** none: built on the package's `Input`, `InputGroup`, `Calendar` (react-day-picker 10)
and `Popover` (Radix Popover); shared date code in `src/lib/dates.ts` and the popup behaviour in `src/lib/date-popover.ts`.
**Pattern:** APG Date Picker Dialog <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/>
(button trigger) and APG Date Picker Combobox <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/>
(`trigger="field"`) · **Completeness references:** React Aria DatePicker <https://react-aria.adobe.com/DatePicker>, Base UI
has none.

**API:** `DatePicker` — `mode?: "single" | "multiple"`; single: `value?: Date | null`, `defaultValue`, `onValueChange(Date | null)`;
multiple: `value?: Date[]`, `defaultValue`, `onValueChange(Date[])`; `format?: string` (`yyyy yy MMMM MMM MM M dd d EEEE EEE
HH H hh h mm ss a`, quoted literals), `min?`, `max?: Date`, `showButtonBar`, `showTime`, `hourCycle?: 12 | 24`, `view?: "day" |
"month" | "year"`, `numberOfMonths`, `inline`, `clearable`, `trigger?: "button" | "icon" | "field"` (default `button`),
`icon?: ReactNode`, `size?: ControlSize`, `variant?: FieldVariant`, `fluid`, `today?: Date`, `defaultMonth?: Date`, `open`,
`defaultOpen`, `onOpenChange`, `calendarProps` (Calendar's `modifiers`, `modifiersClassNames`, `disabled`, `hidden`,
`showWeekNumber`, `weekStartsOn`, `locale`, `labels`, `components`, `formatters`, `captionLayout`, `showOutsideDays`,
`fixedWeeks`, `footer`), `name` (hidden input: `YYYY-MM-DD`, the ISO instant with `showTime`, comma-joined with `multiple`);
every other prop goes on the text input, `className` on the root. Parts: `date-picker` (root), `date-picker-trigger`,
`date-picker-panel`, `date-picker-view` (`data-view` month | year), `date-picker-header`, `date-picker-cell`,
`date-picker-time`, `date-picker-time-segment`, `date-picker-buttonbar`; the popup is `popover-content`.

**Typing:** read on blur and on Enter (Enter flushes synchronously, so a submitting form sends the new value). Unparseable
text, or a date outside `min`/`max`, is kept in the field, sets `aria-invalid`, and empties the value until fixed. Chosen over
reverting because reverting silently throws away what the person typed (WCAG 3.3.1 wants the error identified, not undone),
and over keeping the old value because the field would then show text that is not the value a form submits.

**Time zones:** values are plain `Date` instants; a day is midnight in the provider's `timeZone` (the browser's when unset).
The calendar gets `timeZone`, the text is formatted and parsed with `Intl` in that zone, and react-day-picker's `TZDate`
results are converted back to plain `Date`s.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | Input's look, 188 px intrinsic text field, a 36 × 35 px `--secondary` button joined at the end (`--control` edge, no start edge) | text `input`; button "Choose date", `aria-haspopup="dialog"`, `aria-expanded` | Basic | shows the value in the locale format, with a named calendar button |
| open | 2 px below the field, 6 px radius, 10 px padding, `shadow-md`, the Calendar; 274 × 280 px | `role="dialog"` named "Choose date", focus on the chosen day / today | Basic | opens from the button with focus on the chosen day |
| typed text | re-formatted in the locale on blur / Enter | — | Basic | reads typed text when the field loses focus…; reads typed text on Enter |
| invalid text | `--invalid` edge, text kept | `aria-invalid="true"` | Invalid | keeps text that is not a date, marks the field invalid… |
| format | text in the pattern | — | Format | writes and reads the format pattern |
| icon / field trigger | 14 px icon inside the field (`text-control-hover`); or no button | `trigger="field"`: input `role="combobox"`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` | Icon trigger | puts the button inside the field…; opens on a click in the field…, leaving focus there |
| min / max | days outside blocked, arrows stop | days `disabled` | Min and max | treats a typed date outside min and max as invalid, and blocks those days |
| multiple | dates listed with commas, popup stays open | grid `aria-multiselectable` (DayPicker) | Multiple dates | toggles several dates in multiple mode… |
| button bar | Today / Clear: 28 px `sm` ghost buttons in `--muted-foreground` over a 1 px divider | buttons named by `today`, `clear` | Button bar | chooses today and clears from the button bar |
| time | 28 px round up/down arrows round 14 px values under a divider | `spinbutton`s Hour, Minute, AM/PM with `aria-valuenow/min/max/text`; arrows `aria-hidden`, `tabindex=-1` | Time | changes hours, minutes and AM/PM with the arrow keys |
| month / year view | 3 × 4 month grid (150 × 212 px popup), 2 × 5 year grid (162 × 248 px); chosen cell `--primary` | `grid` named by the year / decade, `gridcell aria-selected`, roving `tabindex` | Month picker, Year picker | chooses a month…; chooses a year…; opens the year list from the month view title; flips the month grid arrows in right-to-left |
| two months | months divided by a 1 px line, 10 px either side | two grids | Two months | — (Calendar's) |
| date template | Calendar modifiers, e.g. a 4 px dot | name via `calendarProps.labels` | Date template | — |
| inline | the calendar on the page, no panel | `role="group"` named by `aria-label` | Inline | shows the calendar on the page with inline |
| clearable | × inside the field end | button "Clear" | Clear | clears with the clear button and keeps focus in the field |
| sizes | 28 / 35 / 42 px; button 28 / 36 / 42 px, icon 12 / 14 / 16 | `data-size` on input and button | Sizes | reaches data-size and data-variant |
| filled | `--field-filled` | `data-variant="filled"` | Filled | reaches data-size and data-variant |
| fluid | root and field full width | — | Fluid | — |
| disabled | `--field-disabled`; button at 60 % | `disabled` on input and button | Disabled | disables the field and the button |
| strings | — | `chooseDate` etc. | — | takes its names from the provider strings |
| time zone | text in the provider zone | — | — | shows and reads dates in the provider time zone |
| float label | label rests in the empty field, moves above with a value | — | With a float label | — (FloatLabel's) |

| Key | Behaviour | Source |
| --- | --- | --- |
| Alt+ArrowDown | In the field: opens, focus to the chosen day / today | APG Date Picker Combobox |
| Enter | Field: reads the text now. Button: opens | APG Date Picker Dialog |
| Escape | Closes, focus to the field | APG Date Picker Dialog |
| Tab / Shift+Tab | Next / previous popup control, wrapping | APG Date Picker Dialog |
| Arrow keys, PageUp/PageDown, Home, End | Month / year grid: ±1 (flipped in RTL), ±row, ±year (decade), page start / end; day grid: the Calendar's | APG Grid, React Aria |
| ArrowUp / ArrowDown | Time spinbuttons: ±1, wrapping | APG Spinbutton |

**Notes.** The day grid's own keys stay the Calendar's (already tested there). The popup is non-modal: Tab wraps inside it,
a click outside closes it without moving focus. `showTime` is single-mode, day-view only. The calendar's month and weekday
names stay react-day-picker's (English) unless `calendarProps.locale` is passed; the field's text follows the provider
locale.

### Behaviour details

**Typing.** Text the person has not changed (it equals the value's own text) changes nothing on blur or Enter, so a value
with seconds, or a month view's value that is not the 1st, is never rewritten by focus alone. A one- or two-digit year is
the year nearest `today` (in the provider's zone) within 50 years: "85" is 1985 and "30" is 2030 in 2026, with or without a
`format` (`yyyy` and `yy` alike). With `showTime`, AM or PM is read before or after the time, as the locale writes it
(ko-KR "오후 9:30", zh-CN "下午09:30").

**`min` and `max` with `showTime`.** A bound that has a time (any but midnight in the provider's zone) bounds the time on its
day as well; a midnight bound stays a whole day (`max` = 25 October means "through 25 October"). A day picked in the
calendar, a step of the time spinbuttons and Today are brought inside the bounds; typed text outside them is invalid, as
before.

**Today** chooses today's day, its month's 1st with `view="month"`, or its 1 January with `view="year"`, and shows today's
month (the calendar's month is now controlled: each opening starts on the value's month, else `defaultMonth`, else today's;
Today and valid typed text move it).

**Multiple with a comma format.** When a date's own text has a comma (`"EEE, d MMM yyyy"`), the field joins dates with "; "
and splits typed text on ";" only.

**Notes (replaces the last sentence of the section's notes).** The calendar follows the provider's `locale` (see Calendar);
without one its day names are react-day-picker's English. A day whose midnight the clocks skip in the provider's zone is
the first instant of that day (see `dateFromParts`).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| blur, text unchanged | — | value unchanged, no `onValueChange` | — | leaves the value alone when the field loses focus with its text unchanged |
| day period first | — | — | — | reads AM or PM typed before the time, as Korean writes it |
| Today, month view | 1st of today's month | — | Month picker | chooses the 1st of today's month with Today in the month view |
| Today moves the month | today's month shown | grid named by it | Inline | shows today's month when Today is pressed |
| min / max with a time | picked day or time brought inside; typed outside invalid | `aria-invalid` on typed text | — | bounds the time as well with showTime and a min that has a time |
| multiple, comma format | dates joined by "; " | — | — | lists several dates with semicolons when the format has a comma, and reads them back |
| in a dialog | picking closes only the popup; Escape closes the popup first | — | — | in a dialog: a day picked keeps the dialog open, and Escape closes the calendar first |
| unmount while opening | — | the pending focus frame is cancelled | — | cancels its pending move of focus when it goes away first |

## Date range picker

**Status:** built (0.1.1; `minDays` and `maxDays` 0.2.0) · **Stock:** none: built on the package's `Calendar` (react-day-picker 10, range mode with
`resetOnSelect`), `Popover` (Radix) and `Button`; shared date code in `src/lib/dates.ts`, popup behaviour in
`src/lib/date-popover.ts`.
**Pattern:** APG Date Picker Combobox <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-datepicker/>
(a button with `role="combobox"` and a dialog popup) · **Completeness references:** React Aria DateRangePicker
<https://react-aria.adobe.com/DateRangePicker>, Base UI has none.

**API:** `DateRangePicker` — `value?: DateRangeValue | null` (`{ from: Date; to: Date }`, both midnight in the provider's
zone, `to` included), `defaultValue`, `onValueChange(DateRangeValue | null)`, `min?`, `max?: Date`, `minDays?`, `maxDays?: number` (the
fewest and most days a range covers, both ends included), `today?: Date`, `defaultMonth?: Date`, `presets?: boolean | DateRangePreset[]` (`{ label, range(today) }`, default the six built-ins),
`showActions` (Cancel / Apply), `numberOfMonths = 2`, `clearable`, `placeholder`, `size`, `variant`, `fluid`, `disabled`,
`open`, `defaultOpen`, `onOpenChange`, `calendarProps`, `name` (hidden input `YYYY-MM-DD/YYYY-MM-DD`); other props go on
the trigger button, `className` on the root. Types `DateRangeValue`, `DateRangePreset`. Parts: `date-range-picker`,
`date-range-picker-trigger`, `date-range-picker-value`, `date-range-picker-clear`, `date-range-picker-presets`,
`date-range-picker-preset`, `date-range-picker-rule`, `date-range-picker-actions`. New strings: `chooseDateRange` "Choose dates", `presetToday`,
`presetYesterday`, `presetLast7Days`, `presetLast30Days`, `presetThisMonth`, `presetLastMonth`, `apply`, `cancel`,
`rangeMinDays` "Choose at least {count} days", `rangeMaxDays` "Choose at most {count} days", `rangeDaysBetween` "Choose
{min} to {max} days".

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | the Select trigger's field look, range text ("Oct 1 – 7, 2026", `Intl.formatRange`), 14 px calendar icon at the end | `button role="combobox"`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` | Basic | shows the range in the locale, or the placeholder |
| placeholder | `--muted-foreground` | `data-placeholder` | Presets | shows the range in the locale, or the placeholder |
| open | presets column (divided by a 1 px line) beside two months without neighbour days | `dialog` "Choose dates"; focus on `from` or today | Presets | opens with Enter…; opens with Alt+ArrowDown… |
| choosing | first click starts, second ends, closes | — | Basic | chooses a range with two clicks…; starts a new range on the first click after a complete one |
| presets | 14 px rows, the matching one `--highlight` | toggle buttons, `aria-pressed` | Presets | chooses each preset, counted from today; chooses a preset with Enter |
| actions | Cancel (ghost) and Apply (primary) `sm` buttons under a divider; Apply disabled until both ends | — | Apply and cancel | waits for Apply with showActions, and Cancel leaves the value |
| min / max | days outside disabled; presets reaching outside disabled | `disabled` | Min and max | blocks days and presets outside min and max |
| range length | after the first pick, the days that would make the range shorter than `minDays` or longer than `maxDays` disabled (the first day stays, a second click on it starts over); presets breaking the rule disabled; the rule under the calendar in 12 px `--muted-foreground`, `--destructive-strong` while a draft breaks it, when Apply stays disabled | `disabled` days; the rule is the popup's (inline: the group's) `aria-describedby`; `data-invalid` on the rule | Range length | with maxDays, says the rule and disables the days and presets beyond it; with maxDays, the arrow keys stop at the last day in reach; with minDays, disables the days too close…; with both, says the span, and Apply stays disabled while the draft breaks the rule; inline, the rule describes the calendar group; takes the rule from the provider strings |
| clearable | × at `end-8` | button "Clear" | Clear | clears with the clear button and keeps focus on the field |
| sizes / filled | 28 / 35 / 42 px; `--field-filled` | `data-size`, `data-variant` | Sizes, Filled | is disabled, invalid, sized and filled |
| disabled | `--field-disabled` | `disabled` | Disabled | is disabled, invalid, sized and filled |
| invalid | `--invalid` edge, red placeholder | `aria-invalid` (allowed by the combobox role) | Invalid | is disabled, invalid, sized and filled |
| time zone | presets counted in the provider zone | — | — | counts presets in the provider time zone and submits the range with name |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter / Space | On the field: opens. On a preset: chooses it | APG Date Picker Combobox |
| Alt+ArrowDown | On the field: opens, focus to the calendar | APG Date Picker Combobox |
| Escape | Closes without a change, focus to the field | APG |
| Tab / Shift+Tab | Next / previous popup control, wrapping | APG Dialog |
| Arrow keys | Move between days; after the first pick under `minDays`/`maxDays` they skip the disabled days and stop at the last day in reach | APG Grid; react-day-picker |

**Notes.** The range cannot be typed (pair two DatePickers or DateFields for that). Neighbour-month days are hidden when two
or more months show, so a range is never drawn twice (the DatePicker's two-month view keeps them, as the visual target
does). Below 640 px the presets wrap above and the months stack.

### Behaviour details

A value whose `to` comes before its `from` is read the other way round (text, hidden input, calendar). The draft range is
reset from the value on every opening, also when a parent opens it through a controlled `open`. Presets count days with
`dateFromParts`, so "Yesterday" over a skipped midnight is the right day.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| inverted value | shown in order | hidden input in order | — | reads a value whose end comes before its start the other way round |
| opened by its parent | the current range drawn | `aria-selected` on its days | — | starts from the current range when its parent opens it |
| skipped midnight | Yesterday is the right day | — | — | counts Yesterday right across a midnight the clocks skip |
| in a dialog | choosing closes only the popup; Escape closes the popup first | — | — | in a dialog: a range chosen keeps the dialog open, and Escape closes the popup first |

## Description list

**Status:** built (0.1.1) · **Stock:** none: built on semantic HTML (`dl`, a `div` per item holding `dt` and `dd`).
**Pattern:** HTML description list (no APG widget pattern) · **Completeness references:** Chakra DataList
<https://www.chakra-ui.com/docs/components/data-list> (orientation, sizes), Ant Design Descriptions
<https://ant.design/components/descriptions> (bordered, columns, span, sizes, vertical layout).

**API:** `DescriptionList` — `orientation` ("vertical" label above, default | "horizontal" label beside, labels in a
shared column through `grid-template-columns: subgrid`), `columns` (1 | 2 | 3, from `sm`; one per row below),
`bordered`, `size?: ControlSize` (12 / 14 / 16 px text and spacing; provider default), `dl` props.
`DescriptionItem` — `label`, children (the value), `action?` (a control at the value's end), `span?` (columns, from `sm`),
`div` props. Parts: `description-list`, `description-item`, `description-label`, `description-value`,
`description-value-text`, `description-action`. Bordered: 1 px `--border` round the list (6 px radius), 1 px gaps where
each item's `0 0 0 1px` shadow draws the dividers, labels on `--subtle`. No strings.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| vertical (default) | label `--muted-foreground` above value `--foreground`, 4 px apart; rows 0.875rem apart | `dl` > `div` > `dt` + `dd` | Basic | is a dl of terms and definitions, each pair in a div; defaults to the vertical orientation, one column and the provider's size |
| horizontal | labels in one column as wide as the widest, 1rem from the values | `data-orientation="horizontal"` | Horizontal | puts the labels beside the values in a shared column |
| columns / span | 2 or 3 items per row from 640 px; `span` widens an item | `--description-columns`, `--description-span` | Columns | spans an item across columns, counting the label column when horizontal |
| bordered | table: outer edge, 1 px dividers, labels on `--subtle` | `data-bordered` | Bordered | draws the bordered table and takes the sizes |
| with actions | a ghost icon button at the value's end | consumer's `aria-label` | With actions | puts an action at the end of the value, reachable with Tab |
| sizes | 12 / 14 / 16 px; bordered padding 6×10 / 10×14 / 14×18 px | `data-size` | Sizes | (in the bordered test) |

No keyboard rows: only the consumer's actions take focus.

**Notes.** A `dl` takes no accessible name (an `aria-label` on it is prohibited), so the docs tell consumers to put a
heading above it. Below 640 px every list is one column.

### Behaviour details

- Horizontal: the label track is `fit-content(40% / columns)`, not `auto`: as wide as the widest label up to that cap, then the label wraps. With `auto`, one long label took the whole width and left the values none.
- `span` is clamped to `columns`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Long label, horizontal | Label wraps at 40% of the width | `grid-cols-[fit-content(40%)_minmax(0,1fr)]` | horizontal | caps the label column beside the values |
| `span` > `columns` | Spans the whole row, no extra tracks | `--description-span: span <columns>` | columns | spans no more columns than the list has |

## Drawer

**Status:** built (0.1.1) · **Stock:** none: built on Base UI Drawer (`@base-ui/react/drawer` 1.8), with shadcn
`new-york-v4/drawer`'s parts, names and classes (stock is built on vaul, which is not used)

**Pattern:** WAI-ARIA APG Dialog (Modal) <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/> · **Completeness
references:** Base UI Drawer <https://base-ui.com/react/components/drawer> · vaul's API through shadcn's drawer

**API.** `Drawer` (Base UI `Root`: `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `modal`,
`disablePointerDismissal`, `swipeDirection`, …) with `direction?: "top" | "right" | "bottom" | "left"` (default
`bottom`; `left`/`right` are the reading direction's start/end, as Sheet's `side`; it sets `swipeDirection`).
`DrawerTrigger` and `DrawerClose` (`asChild` mapped to Base UI's `render`), `DrawerPortal`, `DrawerOverlay` (the Backdrop),
`DrawerContent` (Portal + Overlay + Viewport + Popup, with `initialFocus`/`finalFocus`), `DrawerHeader`, `DrawerFooter`,
`DrawerTitle`, `DrawerDescription`. Slots: `drawer-trigger`, `drawer-portal`, `drawer-overlay`, `drawer-viewport`,
`drawer-content` (with `data-side`, `data-bui-motion="modal"`, `data-bui-portal`), `drawer-handle`, `drawer-header`,
`drawer-footer`, `drawer-title`, `drawer-description`, `drawer-close`. Type: `DrawerDirection`.

| Row | shadcn stock (vaul) | Boolean UI | Why |
| --- | --- | --- | --- |
| Primitive | vaul `Drawer.*` | Base UI `Drawer.*` (Root, Trigger, Portal, Backdrop, Viewport, Popup, Title, Description, Close) | The package's second primitive library; vaul is unmaintained |
| Direction | `direction` on the root, `data-vaul-drawer-direction` | `direction` on the root, `data-side` on the popup; `left`/`right` logical; maps to Base UI's `swipeDirection`, flipped in RTL | Same API; RTL |
| Surface | `bg-background`, `rounded-t-lg`/`rounded-b-lg`, side panels `sm:max-w-sm` | `bg-card` with `shadow-xl`, `rounded-t-xl`/`rounded-b-xl`, side panels `sm:max-w-80` | The BooleanPress look (cards and dialogs 12 px; Sheet's 20 rem) |
| Handle bar | 8 × 100 px `bg-muted`, bottom only | 4 × 40 px `bg-muted`, bottom only, `aria-hidden` | The lead's spec for the look |
| Backdrop | `bg-black/50` | `bg-mask`, fading with `--drawer-swipe-progress` | The mask token |
| Motion | vaul's own transform transition | `data-open:animate-in` + `slide-in-from-*`, `data-closed:animate-out`, `data-bui-motion="modal"`; the drag follows through `translate` (not `transform`), which snaps back over `--bui-duration-base` and is untouched by the exit fade | `theme.css` owns motion; the exit fades in place |
| Header / footer | `p-4`, `gap-0.5 md:gap-1.5`, `md:text-left` | `p-4.5`, `gap-1.5`, `md:text-start` | Sheet's spacing; RTL |
| Title / description | `font-semibold` (16 px), `text-sm` | 18 px semibold on 27 px, 14 px on 21 px | Sheet's type |
| Trigger / close | `asChild` (Radix Slot via vaul) | `asChild` turned into Base UI's `render` | Keeps shadcn's API |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | nothing rendered | trigger `aria-expanded="false"` | Basic | — |
| open | panel slides in from its edge, backdrop fades in | `role="dialog"` named by the title, described by the description; page inert | Basic | opens as a dialog named by its title and described by its description |
| dragging | panel follows the pointer, backdrop fades with it | `data-swiping` | Basic | (browser check: a 220 px drag down closes, 40 px snaps back) |
| closing | 100 ms opacity fade in place | `data-closed`, `data-ending-style` | Basic | closes on Escape and returns focus to the trigger |
| sides | top (rounded bottom corners), start/end full height | `data-side`, `data-swipe-direction` | Sides | opens from the other edges, swiping back towards them, with no handle bar |
| content longer than the window | panel stops at 80 vh; a `min-h-0 flex-1 overflow-y-auto` part scrolls | — | Scrollable content | — |
| controlled | — | `open`, `onOpenChange` | (test) | opens and closes from code with open and onOpenChange |
| responsive | Dialog ≥ 768 px, Drawer below | — | Responsive | — |

| Key | Behaviour | Source |
| --- | --- | --- |
| Escape | Closes, focus returns to the trigger | APG Dialog |
| Tab | Next focusable inside, wrapping | APG Dialog |
| Shift+Tab | Previous focusable inside, wrapping | APG Dialog |

Notes. Focus moves to the panel on open (Base UI's default), returns to the trigger on close (`finalFocus` overrides).
One modal at a time: a drawer is not opened from inside a Dialog or Sheet. Snap points, nested drawers and the indent
effect are Base UI features not wrapped yet. Mouse drag works anywhere on the panel (no `Drawer.Content`, so text in it is
not selectable by mouse drag); touch drag too.

### Behaviour details

The viewport (the panel's room) starts below the WordPress admin bar. `Drawer` cancels a close whose reason is
`escape-key` when the event was already `defaultPrevented`: a Radix layer inside the drawer (select, menu, popover,
tooltip) handles Escape on the document in the capture phase and marks it, and Base UI's dismiss does not check that.

| Key | Behaviour | Source |
| --- | --- | --- |
| Escape | With a select, menu or popover open inside, closes that first; then the drawer. | patch; test "closes an open select or menu inside it first, then the drawer, on Escape" |

## Editor

**Status:** built (0.1.1) · **Stock:** none: built on Tiptap 3 (`@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`
3.31.4) with the library's Toolbar (Radix Toolbar), Select, Popover, Input, Label and Button.
**Pattern:** WAI-ARIA APG Toolbar <https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/> (its rich-text example) ·
**Completeness references:** Tiptap 3 React <https://tiptap.dev/docs/editor/getting-started/install/react> · the visual
target family's Editor (resolved CSS `editor.css`, measured in headless Chromium).

**API:** `Editor` (`div` props for the frame, less `onChange`, `defaultValue` and `children`): `value` / `defaultValue`
(HTML), `onChange(html)` (`""` when empty), `onJsonChange(json)`, `placeholder`, `readOnly`, `disabled`, `maxLength`,
`characterCount`, `toolbar` (`EditorTool[][]` | `false`; default `[["heading"], ["bold", "italic", "underline",
"strike", "code"], ["bulletList", "orderedList", "blockquote"], ["link"], ["undo", "redo"]]`), `size` (`ControlSize`),
`variant` (`FieldVariant`), `name` (a hidden field with the HTML), `contentClassName`, and `id`, `aria-label`,
`aria-labelledby`, `aria-describedby`, `aria-invalid`, which go on the editable text. Types `EditorTool`, `EditorProps`.
Data slots `editor` (`data-size`, `data-variant`, `data-disabled`, `data-readonly`, `data-invalid`), `editor-toolbar`,
`editor-toolbar-group`, `editor-heading`, `editor-tool` (`data-tool`), `editor-link-popover`, `editor-link-form`, `editor-link-error`, `editor-link-actions`,
`editor-content`, `editor-input` (the ProseMirror element), `editor-placeholder`, `editor-count` (`data-full`).

Tiptap: StarterKit with headings 1–3, Link (`openOnClick: false`, `autolink`, default protocol `https`), no trailing
node; one extension of the package's own refuses transactions past `maxLength` and maps ⌘/Ctrl+K to the link form.
`immediatelyRender: false`, so nothing Tiptap renders on the server. The entry is its own (`@booleanpress/ui/editor`);
the three Tiptap packages are optional peers.

**Measured on the visual target (headless Chromium, 1440 px):** toolbar 42 px (8 px padding, 1 px edge), 28 × 24 px
icon buttons with 18 px icons in `#64748b`, `#334155` on hover, `#020617` when on; 15 px between groups; the heading
picker 98 × 24 px, borderless; the text area 12 px × 15 px padding; placeholder italic `#64748b`; `#e2e8f0` edges, 6 px
radius. Dark: toolbar and text `#0f172a`, edges `#334155`, icons `#94a3b8`, on `#f8fafc`.

| Row | Visual target | Boolean UI | Why |
| --- | --- | --- | --- |
| Frame | `#e2e8f0` edge on the toolbar and the text separately, card fill, no focus change | one frame with the field look: `--control` edge, `--control-hover`, `--ring` while the text has focus, `--field` fill (`--field-filled` filled), the toolbar ruled off with `--border` | The batch brief: the editor is a form field and follows the field states (focus, invalid, disabled, filled). |
| Toolbar buttons | 28 × 24, 18 px icons, colour only when on | 28 × 24 (`sm` 24 × 20, `lg` 32 × 28), 16 px lucide icons, `--muted-foreground` → `--foreground` on hover; on: `--primary` on an `--accent` plate | A pressed state shown by colour alone is weak (WCAG 1.4.1); the plate is listed for the owner's decision. |
| Heading picker | Quill's text picker with up/down arrows | the library Select, borderless, 112 px, chevron | The library's select keeps its keyboard and listbox semantics. |
| Content | 13 px Helvetica, margins 0, headings 2 / 1.5 / 1.17 rem | the theme font at 14 px (12 / 16 by size), margins 0, headings 2 / 1.5 / 1.17 em, quote 4 px `--control` bar, code `--muted` | The theme's type; sizes follow `size`. |
| Placeholder | italic `#64748b` | italic `--muted-foreground` | Copied. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | frame, toolbar, text | `role="textbox"`, `aria-multiline`, name; toolbar `aria-controls` the text | Basic | renders a labelled multi-line textbox, a toolbar of format buttons and the text-style select |
| hover | `--control-hover` edge | — | Basic | — |
| focus (text) | `--ring` edge | `.ProseMirror-focused` | Basic | is one tab stop: Tab enters the toolbar, then the text |
| focus (toolbar) | 1 px `--ring` outline 2 px away | — | Basic | moves between toolbar controls with → and ←, Home and End |
| format on | `--primary` icon on `--accent` | `aria-pressed="true"` | Basic | toggles bold from the toolbar and reflects it with aria-pressed; applies every toolbar format |
| link active | link icon `--primary` | `data-active` (the button opens a dialog, so no `aria-pressed`) | Basic | edits and removes a link from the toolbar button |
| link form | 320 px popover: label, URL field, Remove link, Apply | `role="dialog"` named "Link"; field `aria-invalid` + description when refused | Basic | opens the link popover with Ctrl+K, validates the address and links the selection; links a bare e-mail address with mailto: and refuses a script address |
| undo / redo unavailable | button at 60 %, skipped by the arrows | `disabled` | Basic | undoes and redoes … and enables the toolbar buttons |
| controlled | follows `value`; echoes do not reset the caret | — | Controlled | takes a controlled HTML value and reports changes; reports the content as JSON too |
| placeholder | italic muted hint while empty | `aria-placeholder` | Placeholder | shows the placeholder while empty and gives it to the textbox |
| read-only | no toolbar; text selectable | `contenteditable="false"`, `aria-readonly`, `tabindex="0"` | Read only | is read-only: no toolbar, the text reachable by Tab and not editable |
| disabled | `--field-disabled` fill, text `--field-disabled-foreground`, controls at 60 % | `aria-disabled`, no `tabindex`, controls `disabled` | Disabled | is disabled: every control off, the text out of the tab order |
| invalid | `--invalid` edge (`--ring` while focused) | `aria-invalid` on the text, `data-invalid` on the frame | Invalid | marks the textbox invalid with aria-invalid |
| character count | "n of max characters" under the text, end-aligned, 12 px; `--foreground` at the limit | the textbox is described by it | Character count with limit | counts characters, describes the textbox with the count and refuses text past the limit; counts without a limit |
| minimal toolbar | the chosen controls only | — | Minimal toolbar | shows a smaller toolbar of your choice |
| sizes | 12 / 14 / 16 px text; 24 / 28 / 32 px wide buttons | `data-size` | Sizes | sets the size and variant as data attributes |
| filled | `--field-filled` | `data-variant="filled"` | Filled | same |
| loading (before mount) | toolbar and empty text area | no `aria-controls` until mounted | — | — |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab / Shift+Tab | Into the toolbar (one stop), then the text | APG Toolbar |
| → / ← | Next / previous control, wrapping, skipping disabled; reversed in RTL | APG Toolbar, Radix |
| Home / End | First / last control | APG Toolbar |
| Enter, Space | Toggles a format, focus stays; opens the text-style list | APG Toolbar |
| Ctrl/⌘+B, I, U, E; Ctrl/⌘+Shift+S | Bold, italic, underline, code, strikethrough | Tiptap StarterKit |
| Ctrl/⌘+Alt+1–3, Ctrl/⌘+Alt+0 | Heading 1–3, paragraph | Tiptap StarterKit |
| Ctrl/⌘+Shift+8, 7, B | Bulleted list, numbered list, quote | Tiptap StarterKit |
| Ctrl/⌘+K | Link form | Package extension |
| Ctrl/⌘+Z; Ctrl/⌘+Shift+Z, Ctrl+Y | Undo; redo | Tiptap StarterKit |
| Enter (link form) | Applies, or shows why the address is refused | Native form |
| Escape | Closes the link form or the list without a change | Radix |

**Notes:** a pointer press on a toolbar button keeps the caret in the text (`mousedown` default prevented, the command
refocuses the text); a key press keeps focus on the button. The link form accepts `http(s)`, `mailto:` and `tel:`; a
bare `example.com` gets `https://`, a bare e-mail address `mailto:`; with nothing selected the address is inserted as the
linked text. `maxLength` refuses a transaction that would pass it (a paste is refused whole); values set by the app pass.
Tiptap's injected base CSS (`injectCSS`) stays on.

**For the owner's decision:** (1) the pressed plate on toolbar buttons (the target uses colour alone); (2) the single
field frame instead of the target's two bordered boxes; (3) read-only hides the toolbar (the target shows it).

### Behaviour details

- The link form stops its submit event from propagating: React bubbles a portalled form's submit through the component tree, so a `<form>` around the editor would otherwise be submitted when a link is applied (test: "applies a link inside a form without submitting the form around the editor").
- Pasted or given HTML is reduced to the schema of the toolbar by Tiptap: `<script>`, `<style>`, `<iframe>`, `<img>`, every `on*` attribute and `javascript:`/`data:`/`vbscript:` link addresses are dropped (test: "keeps scripts, event attributes and script addresses out of pasted or given HTML"; checked in Chromium with a real paste event).

## Fieldset

**Status:** built (0.1.1) · **Stock:** none: a native `<fieldset>` / `<legend>`, toggleable on Radix Collapsible

**Pattern:** HTML `fieldset` (role `group`) · WAI-ARIA APG Disclosure <https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/>
(the toggleable legend) · **Completeness references:** Base UI Fieldset <https://base-ui.com/react/components/fieldset> ·
React Aria has none (`Form` groups); the visual target's fieldset page (Basic, Toggleable, Controlled, Indicator)

**API.** `Fieldset` (`data-slot="fieldset"`; the native fieldset's attributes, plus `toggleable`, `open` / `defaultOpen`
(true) / `onOpenChange`; toggleable, it is the Collapsible root through `asChild` and carries `data-state`),
`FieldsetLegend` (`fieldset-legend`; toggleable, it holds the `fieldset-trigger` button with a `fieldset-indicator`;
`indicator` replaces the minus / plus), `FieldsetContent` (`fieldset-content`, the Collapsible content when toggleable,
`forceMount`). Not built on field.tsx's `FieldSet` / `FieldLegend`: those are an unboxed form rhythm (24 px gaps, a 16 px
medium legend with a 12 px bottom margin) and share no class with the bordered box. No strings: the legend's text names
both the group and the button.

**Look.** `--card` box, 1 px `--border`, 6 px radius, padding 0 16 px 16 px, `min-w-0`. Legend: 6 px 10 px padding, 1 px
transparent edge, 6 px radius, `--card`, 14 px semibold; the plain legend's line is 24 px (38 px tall, as the visual
target's), the toggleable one 21 px (35 px). Toggleable: the button carries the padding (the whole legend is the target),
`--accent` and `--accent-foreground` under the pointer, the 14 px indicator `--muted-foreground` (`--secondary-foreground`
under the pointer) before the label, 8 px gap. The content animates from `--radix-collapsible-content-height`; a 4 px
gutter inside its clip (`-m-1 p-1`) keeps the focus outlines of edge controls visible.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| static | legend on the top edge, content in the box | `fieldset` named by `legend` | Basic | renders a native fieldset named by its legend |
| open | minus before the label | legend button `aria-expanded="true"`, `aria-controls` → content | Toggleable | makes the legend a disclosure button when toggleable |
| closed | plus; legend and 16 px of box | `aria-expanded="false"`; content removed | Toggleable | shows and hides the content with Enter / with Space; starts closed with defaultOpen={false} |
| controlled | follows `open` | — | Controlled | follows a controlled open state and reports changes |
| custom indicator | the given icon | indicator `aria-hidden` | Custom indicator | draws a minus while open and a plus while closed, or a custom indicator, hidden from assistive technology |
| form inside | fields grouped under the legend | group name read on entry | With a form inside | — |
| disabled | native: controls inside disabled, legend toggle still works | `disabled` on the fieldset | Disabled | disables the controls inside but keeps the legend toggle working when disabled |
| focus-visible | 1 px `--ring` outline 2 px outside the legend | — | Toggleable | — |

Rows not applicable: invalid (the fields carry it), loading, sizes.

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On a toggleable legend: shows or hides the content | APG Disclosure |

**Notes.** Closed content is removed, so its fields are not submitted; `forceMount` keeps them (hiding is then the
consumer's).

### Behaviour details

**Folded content stays in the page.** A toggleable fieldset holds its open state itself (controlled or not) and renders
`FieldsetContent` with Radix's `forceMount`; the content is `hidden` once the closing slide ends (through the shared
`usePresence`, with `fill-mode-forwards` holding the height at 0 until then), at once when animations are off. Its
fields keep what was typed and are submitted with the form. A capturing `invalid` listener on the fieldset opens a
folded section when the browser finds a field in it invalid, so the browser can move to the field and show its message.
`forceMount` is accepted and has no further effect. The root `ref` and the content's `ref` are composed with the
component's own.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| folded | content slides shut, then is hidden | content `hidden`, `data-state="closed"`, trigger `aria-expanded="false"` | toggleable, with-form | keeps what was typed while folded, and still submits the folded fields with the form; hides the folded content only once its closing slide has ended |
| folded, invalid on submit | section opens | trigger `aria-expanded="true"` | — | opens a folded section when the form finds a field in it invalid |

## File upload

**Status:** built (0.1.1) · **Stock:** none: built on a hidden native `<input type="file">` and the HTML drag-and-drop
events, with the library's `Button`, `Progress` and `Badge`.
**Pattern:** no APG pattern; native buttons, a list and a polite live region (WCAG 2.5.7 Dragging movements: every drop
zone also opens the picker) · **Completeness references:** React Aria DropZone <https://react-aria.adobe.com/DropZone>
and FileTrigger <https://react-aria.adobe.com/FileTrigger>; the visual target's FileUpload page (Basic, Auto, Advanced,
InputGroup, Custom upload, Dropzone, Image preview).

**Why flat parts:** one root owns the state (files, rejections, uploads, the live region); each part does one job and
reads it from context, so the same pieces make a single button, a toolbar with a list, a drop zone or an input-group field
without render props. `useFileUpload()` covers layouts the parts do not.

**API:** `FileUpload` — `accept`, `multiple = false` (a new file replaces the chosen one), `maxSize` (bytes), `maxFiles`,
`disabled`, `auto` (upload on add), `defaultFiles` (checked like added files), `onUpload(files, { onProgress(file, %),
onError(file, message?), signal })` (the app's request; no network in the component; a rejected promise fails the batch;
`signal` aborts on Clear and on unmount), `onFilesChange(files)`, `onReject(rejections)`, and `div` props.
`FileUploadDropzone` — `title?`, `description?`, `div` props; with no children it renders one large button (cloud icon,
`dropFilesHere`, `browseFiles`). `FileUploadTrigger` (opens the picker), `FileUploadSubmit` (uploads queued files;
`secondary`), `FileUploadClear` (aborts and empties; `secondary`) — `Button` props, default icon and words without
children, `asChild` gives the behaviour to the child without `Button`'s look. `FileUploadList` — `layout = "list" |
"grid"`, `empty?`, `children?: (file) => node`. `FileUploadItem` — `file`, `preview = true`. `FileUploadPreview` — `file`
(blob-URL picture for an image, made after hydration and revoked; type icon otherwise or when the image does not decode).
`FileUploadProgress` (batch average, 4 px), `FileUploadErrors` (unique refusal messages). Exports `useFileUpload`,
`formatFileSize(bytes, locale)` (steps of 1,000, `Intl` unit style), types `FileUploadFile` (`id`, `file`, `status`,
`progress`, `error?`), `FileUploadStatus` (`queued | uploading | done | error`), `FileUploadRejection` (`type | size |
count`), `FileUploadHelpers`, `FileUploadHandler`, `FileUploadState`. Slots: `file-upload`, `file-upload-input`,
`file-upload-status`, `file-upload-dropzone`, `file-upload-dropzone-trigger`, `file-upload-trigger`, `file-upload-submit`,
`file-upload-clear`, `file-upload-progress`, `file-upload-errors`, `file-upload-error`, `file-upload-list`,
`file-upload-item`, `file-upload-item-info`, `file-upload-item-name`, `file-upload-item-size`, `file-upload-item-status`,
`file-upload-item-remove`, `file-upload-item-progress`, `file-upload-preview`.

**New strings:** `chooseFiles` "Choose", `upload` "Upload", `dropFilesHere` "Drop files here", `browseFiles` "or click to
browse", `uploadComplete` "Upload complete", `uploadFailed` "Upload failed", `fileTooLarge` "{name} is larger than
{size}", `fileTypeNotAllowed` "{name} is not an allowed file type", `tooManyFiles` "Too many files: you can add {count} at
most" (reads correctly for 1), `fileAdded` "{name} added", `filesAdded` "{count} files added". Reused: `cancel`,
`removeItem`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| empty drop zone | dashed 1 px `--border`, 8 px radius, 16 px padding; 48 px cloud icon `--muted-foreground`, 18 px medium title, 14 px muted line | one `button` named by both lines | Drop zone | opens the picker from the drop zone button with Enter and with Space |
| dragging | the dashed edge turns `--primary` | `data-dragging` | Drop zone | takes dropped files and marks the zone while files are dragged over it |
| queued | row: 50 px preview (picture, or type icon on `--secondary`), 14 px name, 12 px muted size, 24 px ghost × ; 14 px padding and gap, `--border` rule between rows | `li[data-status=queued]`; × named "Remove {name}" | Advanced, Custom upload | adds the chosen files and announces them in a polite live region |
| uploading | 4 px `Progress` across the row; batch bar over the list | `progressbar` named by the file, `aria-valuenow`; Upload disabled | Custom upload | uploads with Enter on Upload and updates each file from onProgress |
| done | success tag `uploadComplete` | `data-status=done`; live region "Upload complete" | Auto upload | uploads with Enter on Upload… |
| error | destructive tag with the message | `data-status=error`; live region "Upload failed" | Upload error | marks one file as failed with onError, and a whole batch when the upload rejects |
| refused | messages above the list: 6 × 10 px padding, `--destructive-subtle` fill, `--destructive-border` edge, `--destructive-strong` text | messages also announced politely | Validation errors | refuses a wrong type, a file too large and files over the limit, each with its message |
| grid | 160 px+ cards, 128 px picture, 12 px name; × on the corner, shown on hover, focus and coarse pointers | `ul[data-layout=grid]` | Image previews | lays files out as cards with layout="grid" |
| auto | uploads on add | — | Auto upload | uploads as soon as files are added with auto |
| single | a new file replaces the old | — | Basic, In an input group | replaces the chosen file without multiple |
| disabled | drop zone at 60 %, every button disabled | `data-disabled`; drops ignored | Disabled | stops picking, dropping and removing while disabled |
| asChild | the child's own look | `data-slot` on the child | In an input group | lends its behaviour to an element of yours with asChild |
| strings / locale | — | provider strings; sizes in `locale` | — | takes its words from the provider; formats sizes in steps of 1,000, in the locale |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On Choose or the drop zone button: opens the system's file picker | native button |
| Enter, Space | On Upload: sends the queued files; on Cancel: aborts and empties the list | native button |
| Enter, Space | On a remove button: removes the file; focus goes to the next row's remove button, else the previous, else Choose | native button + focus rule |
| Tab | Through the buttons and each row's remove button, in reading order | native |

**Notes.** No network inside the component. One `AbortSignal` per `onUpload` call: removing a file during its batch only
drops it from the list. Names and sizes carry `dir="auto"` so "84 kB" keeps its order on a right-to-left page. Pictures
are blob URLs, never rendered on the server (no hydration mismatch). Reduced motion: the bars' fill transition is ended by
`theme.css`. Remaining differences from the visual target: sizes read "138 byte" / "48.2 kB" (CLDR short units in the
provider's locale) where the target writes "138 B"; demo text is 14 px (the docs' base) where the target's demo inherits
16 px; the status tags are an addition (the target's rows show name and size only).

### Additions

`formatFileSize` now comes from `src/lib/format-bytes.ts` (shared with Chat and Format) and writes B, KB, MB, GB, TB with
the number in the locale (`Intl` parts, the unit swapped for the symbol). Test "formats sizes in steps of 1,000 with
short units, the number in the locale".

### Behaviour details

- `FileUploadHelpers.fileSignal(file)`: one file's `AbortSignal`, aborted when that file leaves the list (removed, or replaced without `multiple`) and whenever the batch's `signal` aborts. The batch's `signal` also aborts once none of its files is left in the list.
- A dropped folder (detected through `DataTransferItem.webkitGetAsEntry().isDirectory`) is refused with `reason: "type"` and the `folderNotAllowed` message ("{name} is a folder: add the files inside it"); its contents are not read.
- `accept` takes `*` and `*/*` as "any file".

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Folder dropped | Refusal message in `FileUploadErrors`, announced | `role="status"` | — | "refuses a dropped folder with its own message…" |
| File removed during upload | Row gone; its request aborted | — | custom-upload | "aborts a file's signal when it is removed during its upload…", "aborts the batch when every file of it is removed…", "aborts the upload of a file replaced without multiple" |
| Image preview removed or unmounted | — | blob URL revoked | image-preview | "shows an image's picture from a blob URL and revokes it…" |

## Float label

**Status:** built (0.1.1) · **Stock:** none: built on a plain `div` round the field and its native `label`; the label
moves with CSS.
**Pattern:** no APG pattern (a visible label: WCAG 2.5.3 Label in Name, 3.3.2 Labels or Instructions) ·
**Completeness references:** the visual target's float label · Material 3 text field (filled and outlined labels).

**API.** `FloatLabel` (`data-slot="float-label"`): every `div` prop, plus `variant?: "over" | "in" | "on"` (default
`over`, carried as `data-variant`). Children: one field and its `<label htmlFor>` (a `Label`), the label a direct child.
The field is an `Input`, `Textarea`, `PasswordInput`, `InputGroup`, `NativeSelect` or `Select`. Inside an `InputGroup`
(round an `InputGroupInput` and its label) it grows to fill the group. No strings.

**How it knows "has a value".** The wrapper reads its field on every `input` and `change` event, on every DOM change
(a `MutationObserver` on `value` and `data-placeholder` attributes, child lists and text: a Radix Select's chosen value,
a textarea's new text) and after every render (a controlled value set from code, including a native select's). A field is
filled when its value is not empty; a Radix Select when its trigger has no `data-placeholder`. It sets `data-filled` on
the wrapper. The label also moves while the wrapper has focus within, while a Select's list is open, while the field is
autofilled and whenever the field has a `placeholder` (so the two never overlap).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| empty | the label inside the field: 14 px (12 / 16 px for `sm` / `lg` fields), `--muted-foreground`, line height 1, vertically centred at the field's start padding (34 px past a leading icon; 28 / 40 px for `sm` / `lg`); in a textarea at the first line | no `data-filled` | Basic | marks itself filled while the field has a value, on typing and on clearing |
| over, focused or filled | the label 18 px above the field, 10 px | `data-filled` while filled | Basic | starts filled with a default value |
| in | the field 47 px tall (18 px top, 6 px bottom padding); the label moves to 6 px from the top, 10 px; a select's chevron stays centred | `data-variant="in"` | In | defaults to the over variant and records the variant it is given |
| on | the label centred on the top edge, 10 px, on `--field` with 2 px side padding and a 2 px radius | `data-variant="on"` | On | defaults to the over variant and records the variant it is given |
| focused | the label `--secondary-foreground` | — | Basic | — |
| invalid | the label `--destructive-strong`, focused or not | the field's `aria-invalid` | Invalid | keeps an invalid field named and described |
| controlled value | moves when code sets or empties the value | `data-filled` | — | follows a controlled value set from code; reads a controlled value from a parent that re-renders it |
| select | moves once a value is chosen or the list opens | `data-filled` | With a select | marks itself filled when a Select gets a value; marks itself filled when a native select gets an option with a value |
| textarea, password, group with icon | as above | — | Textarea, Basic | works with a textarea, a password input and an input group with a leading icon |
| RTL | the label at the start (right) side | logical `start` | Basic (`?dir=rtl`) | — |
| reduced motion | the move is instant | `theme.css` | — | — |

No keys: the wrapper and the label take no focus; the label ignores the pointer, so a click reaches the field.

**Motion.** The label moves (top, translate, font size, colour, fill, padding) over `--bui-duration-control` with
`--bui-ease-standard`; no `data-bui-motion`, as it is a control's own transition, not an overlay.

**Notes.** An `over` label needs 18 px free above the field; the examples leave it. A text addon at the start of a group
puts the label over the addon: put the `FloatLabel` inside the group instead. A `Select` should have no placeholder. The
focused colour is `--secondary-foreground` (slate 600 / slate 300), where the visual target's dark theme uses slate 50.
An empty `Select` trigger with no placeholder collapses to 28 px; the wrapper gives its value line one line of height
(see the Select request).

### Additions

The `in` padding (and InFieldLabel's) also applies to `[data-slot=input-mask]`, `[data-slot=input-number-input]` and
InputNumber's prefix and suffix; with `buttons="horizontal"` the label starts past the 36 px minus button (2.875 rem,
2.75 rem `sm`, 3 rem `lg`). Example With a number and a mask; tests "works with an InputNumber …", "works with an
InputMask …". The Select workaround (`min-h-lh` on the value) moved into `SelectTrigger`.

### Behaviour details

**Form reset.** A reset puts the field back without an input event; the wrapper reads `data-filled` again once the form
has reset (`useFormReset`), so the label never rests on a value a reset restored or floats over an emptied field.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| after a form reset | label follows the reset value | `data-filled` | — | follows a form reset, which puts the field back without an input event |

## Format

**Status:** built (0.1.1) · **Stock:** none: built on `Intl` (`NumberFormat`, `DateTimeFormat`, `RelativeTimeFormat`),
no primitive · **Pattern:** none (static text; HTML `data` and `time` elements) · **Completeness references:** React Aria
`useNumberFormatter`, `useDateFormatter` <https://react-aria.adobe.com/internationalized/number> · GitHub
`relative-time-element` <https://github.com/github/relative-time-element>

**API** (`@booleanpress/ui/format`; every part reads `useUiLocale()`, and takes `locale` to override it):

- `FormatNumber`: `value: number | bigint`; `style?: "decimal" | "percent" | "compact" | "unit"` (`compact` is
  `notation: "compact"`; `percent` reads the value as a fraction); any other `Intl.NumberFormatOptions` as a prop
  (`unit`, `maximumFractionDigits`, `signDisplay`, `notation`…). Renders `<data data-slot="format-number" value>`.
- `FormatCurrency`: `value`, `currency` (ISO 4217, required), any `Intl.NumberFormatOptions` (`currencySign`,
  `currencyDisplay`, `notation`). Renders `<data data-slot="format-currency" data-currency value>`.
- `FormatBytes`: `value` in bytes; `units?: "decimal" | "binary"` (steps of 1,000 with B, KB, MB, GB; or 1,024 with B,
  KiB, MiB, GiB); `unitDisplay?: "short" | "narrow" | "long"` (the locale's own unit through `Intl`, for decimal
  steps); `maximumFractionDigits` (1). Shares the package's one size formatter (`src/lib/format-bytes.ts`) with
  FileUpload and Chat. Renders `<data data-slot="format-bytes" value>`.
- `FormatDate`: `value: Date | number | string`; `dateStyle`, `timeStyle` or any `Intl.DateTimeFormatOptions`; with no
  field, `dateStyle: "medium"`. Time zone: the `timeZone` prop, else the provider's, else the browser's. A date-only
  string ("2026-10-31") is a calendar day, written as that day in every zone. Renders
  `<time data-slot="format-date" dateTime>` (the ISO instant, or the day).
- `FormatRelativeTime`: `value`; `now?` (default: the current time); `unit?` (forced, else the largest unit that keeps
  the number at 1 or more: seconds < 60, minutes < 60, hours < 24, days < 7, weeks < 5, months < 12, then years, rounded
  half away from zero); `numeric?: "auto" | "always"` ("auto": "yesterday", "now"); `style?: "long" | "short" |
  "narrow"`; `live?: boolean` (re-reads the clock every 60 s with `setInterval`, cleared on unmount; ignored when `now`
  is given). Renders `<time data-slot="format-relative-time" dateTime>`, with `suppressHydrationWarning` when `now` is
  not given.
- Plain functions, for code outside JSX: `formatNumber(value, options)`, `formatCurrency(value, { currency, … })`,
  `formatBytes(value, options)`, `formatDate(value, options)`, `formatRelativeTime(value, options)`; each options object
  takes `locale` (and `timeZone` for dates) and does not read the provider. Formatters are cached by locale and options.
- No strings: every word comes from `Intl`. No sizes or variants: the parts draw nothing and take the surrounding text's
  font and colour.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| number | "1,240,861" / "42.9%" / "48K" / "245 ms" / "+3.1%" | `data[value]` with the raw number | Numbers | takes the decimal, percent, compact and unit styles and any Intl option |
| currency | "$29.00", "(£45.00)" accounting, "$483K" compact | `data[value]`, `data-currency` | Currency | takes accounting signs, compact notation and fraction digits |
| bytes | "512 B", "245.8 KB", "3.5 MiB" binary | `data[value]` in bytes | Bytes | steps by 1,000 with the short symbols B, KB, MB and GB, the number in the locale |
| date | "Oct 14, 2026, 10:30 AM" in the zone | `time[dateTime]` ISO 8601 | Dates and times | writes a date in the provider’s locale and time zone inside a time element |
| calendar day | "October 31, 2026" everywhere | `time[dateTime="2026-10-31"]` | Dates and times | writes a date-only string as that calendar day in every time zone |
| relative | "3 hours ago", "yesterday", "in 3 days" | `time[dateTime]` | Relative time | picks the largest unit that keeps the number at 1 or more |
| live | the text rewritten every minute | — | — | writes the time again every minute with live, and stops when it is removed |
| another locale | de-DE "1.240.861,5", ar-EG Arabic-Indic digits | — | Another locale | writes every part in the provider’s locale, Arabic digits included |
| time zone | one instant in Berlin, New York, Tokyo | — | Time zone | lets the timeZone prop override the provider’s |
| invalid | nothing written | no `value` / `dateTime` | — | writes nothing for NaN / for an invalid date |

No keys: the parts take no focus.

Notes: the entry is a client module (it reads the provider context), so a React Server Component cannot call the plain
functions through it. A live relative time is not announced (no `aria-live`), on purpose. Without a provider `locale`,
`Intl` uses the runtime's default, which can differ between server and browser; the docs say to set it when rendering
on a server.

### Behaviour details

`FormatRelativeTime` without `now`: once a server-rendered page is hydrated, the element is rendered again (a key change
from `useSyncExternalStore`'s server snapshot to the browser's), against the browser's clock. Hydration keeps the server's
text under `suppressHydrationWarning`, and a later render with the same text would not touch it, so a cached page kept
the server's old "now" (even with `live`, until the text changed).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| hydrated without `now` | text against the browser's clock | — | — | writes the server's text again against the browser's clock once hydrated |

## Hover card

**Status:** built (0.1.1) · **Stock:** shadcn `hover-card` (Radix Hover Card), with the patches in `PATCHES.md`.
**Pattern:** none in the APG (a preview of a link's target, not announced) · **Completeness references:** Base UI Preview
Card <https://base-ui.com/react/components/preview-card> · React Aria has none.

**API:** stock's parts unchanged: `HoverCard` (`open` / `defaultOpen` / `onOpenChange`, `openDelay` 700, `closeDelay`
300), `HoverCardTrigger` (a link unless `asChild`), `HoverCardContent` (`side`, `align`, `sideOffset` 4, `forceMount`).
No strings.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Surface | 6 px radius, `shadow-md`, no type size | the popover's: 8 px radius, 1 px edge, 16 px padding, the soft 8 px shadow at 5 %, 14 px on 21 px | The visual target's popover surface (measured live). |
| Motion | stock classes | plus `data-bui-motion="overlay"` | The theme sets timing, exit and reduced motion. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | the trigger only | link `href` | Basic | renders its trigger as a link and nothing else until it opens |
| open (hover) | card after `openDelay` | `data-state="open"`, `data-bui-motion="overlay"` | Basic, Delay | opens on hover after the open delay and closes after the close delay |
| open (focus) | card while the trigger has keyboard focus | — | Basic | opens when Tab focuses the trigger and closes when focus moves away |
| placement | card on the given side | `data-side` | Placement | — |
| controlled | follows `open` | — | — | follows a controlled open state |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Focusing the trigger opens the card (after `openDelay`); leaving closes it | Radix |
| Escape | Closes the card; focus stays on the trigger | Radix (DismissableLayer) |

**Notes:** the card is not announced and its content is not in the tab order; it must only preview what the link leads
to. Touch screens never open it.

## Icon button

**Status:** built (0.1.1) · **Stock:** none: built on Button and Tooltip.
**Pattern:** WAI-ARIA APG Button <https://www.w3.org/WAI/ARIA/apg/patterns/button/> · **Completeness references:** Chakra
IconButton <https://chakra-ui.com/docs/components/icon-button> · Primer IconButton
<https://primer.style/components/icon-button>

**API:** `IconButton` — Button's props except `size`, `aria-label` and `aria-labelledby`; `label: string` (required by the
type; set as `aria-label`, after the other props), `size?` (`xs` 24 | `sm` 28 | `default` 36 | `lg` 42 px; the provider's
`controlSize` when left out), `tooltip?` (shows `label`), `tooltipSide?` (`top`). `variant` defaults to `ghost`.
Exports `IconButton`, `IconButtonProps`, `IconButtonSize`. Part: `icon-button`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | a 36 px square ghost button, 14 px icon | `aria-label`, `data-variant="ghost"`, `data-size="icon"` | Basic | is a button named by its label, ghost by default |
| sizes | 24/28/36/42 px with 12/12/14/16 px icons (the visual target's) | `data-size` `icon-xs` … `icon-lg` | Sizes | maps its sizes to the square button sizes, following the provider when given none |
| severities, variants | Button's | `data-severity`, `data-variant` | Severities and variants | passes severity and rounded through to the button |
| rounded, raised | a circle; the raised shadow | `data-rounded`, `data-raised` | Rounded | passes severity and rounded through to the button |
| with tooltip | the label in a Tooltip on hover and focus | no `aria-describedby` from the tooltip (a consumer's own is kept) | With tooltip | shows its label in a tooltip on focus without adding it as a description…; keeps a description the consumer gives |
| loading | the spinner in place of the icon | `aria-busy`, `disabled` | Loading | shows the spinner, sets aria-busy and disables itself while loading |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | Activates | native button |
| Escape | With `tooltip`, closes the tooltip | Radix Tooltip |

**Type test** (for `tests/types/components.tsx`): `{/* @ts-expect-error: an icon button must have a label */}
<IconButton><PencilIcon /></IconButton>` and `{/* @ts-expect-error: IconButton's sizes are xs, sm, default and lg */}
<IconButton label="Edit" size="icon">…</IconButton>`; both verified against the source in a scratch project.

### Behaviour details

Loading state row: `aria-busy`, `aria-disabled` (not `disabled`), keeps focus; test "shows the spinner in place of the icon, sets aria-busy and refuses presses while loading, keeping focus".

## In-field label

**Status:** built (0.1.1) · **Stock:** none: built on a plain `div` round the field and its native `label`.
**Pattern:** no APG pattern (a visible label: WCAG 2.5.3, 3.3.2) · **Completeness references:** the visual target's
"ifta" label.

**API.** `InFieldLabel` (`data-slot="in-field-label"`): every `div` prop. Children: one field and its `<label htmlFor>`,
the label a direct child; the same fields as `FloatLabel`. A server component (no state, no `"use client"`). No strings.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rest | the field 47 px (18 px top, 6 px bottom padding); the label 10 px, `--muted-foreground`, 6 px from the top at the field's start padding (8 / 12 px for `sm` / `lg`) | — | Basic | names its field with its label and takes typing |
| icon | an icon or button addon lines up with the value, below the label; the label stays at the start padding | — | Basic | works with a textarea and an input group with an icon |
| select | the chevron stays centred in the field | — | With a select | names a Select and keeps it working |
| focused | the label `--secondary-foreground` | — | Basic | — |
| invalid | the label `--destructive-strong`, focused or not | the field's `aria-invalid` | Invalid | keeps an invalid field named and described |
| RTL | the label at the start side | logical `start` | Basic (`?dir=rtl`) | — |

No keys.

### Additions

As Float label: InputNumber (prefix and suffix included, horizontal buttons offset) and InputMask. Example With a number
and a mask; test "names an InputNumber and an InputMask and keeps them working".

## Inplace

**Status:** built (0.1.1) · **Stock:** none: built on the library's Input and Textarea (or a custom editor).
**Pattern:** native button + labelled field; no APG pattern · **Completeness references:** the visual target's Inplace
(Basic, Disabled, Controlled, Image), Atlassian InlineEdit, Chakra Editable.

**API:** `Inplace` — `label: string` (field name; hint `edit` "Edit {label}"), `value?` / `defaultValue?` /
`onValueChange?`, `onSave?: (value) => unknown` (promise → spinner, field read-only and `aria-busy`; rejection →
`Error.message` or `saveFailed`, field stays open; not called when unchanged), `open?` / `defaultOpen?` /
`onOpenChange?`, `placeholder?`, `multiline?` (Textarea; Ctrl/⌘+Enter saves), `disabled?`, `size?: ControlSize`,
`variant?: FieldVariant`, `saveOnBlur?` (default `true`), `showButtons?` (default `true`), `renderDisplay?(value)`,
`renderEditor?({ value, onValueChange, save, cancel, fieldProps })`. `InplaceEditorProps` exported. Parts: `inplace`
(`data-state`; `role="group"` when open), `inplace-display` (`data-size`), `inplace-placeholder`, `inplace-editor`,
`inplace-save`, `inplace-cancel`, `inplace-error`. Look: display = the visual target's inplace display (transparent 1 px
edge, field padding by size, 6 px radius, `--accent` fill and `--accent-foreground` on hover, 1 px ring outline);
editor = Input/Textarea with square end corners plus ✓ (`--success`) and × (`--destructive`) addons on `--control` edges,
`--field` fill, as tall as the field (36/28/42 px wide by size). Strings: `edit`, `save`, `saving`, `saveFailed` (new),
`cancel` (existing).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| display | value as borderless text | native `button`, name = value, description "Edit {label}" | Basic | shows the value as a button described as “Edit {label}” |
| hover | `--accent` fill | — | Basic | — |
| editing | field + ✓ + × | `role="group"`; field named by `label`; text selected | Basic | opens the field on click, focused and with its text selected |
| multiline | Textarea | — | Textarea | makes a new line with Enter in a multi-line field and saves with Ctrl+Enter |
| controlled | — | — | Controlled | is controlled with value and open |
| saving | spinner in ✓ | field `aria-busy`, `readonly`; spinner named `saving` | Async save with error | shows a spinner while an async save runs, then closes |
| error | red 12/18 message under the field | field `aria-invalid`, `aria-describedby` → `role="alert"` | Async save with error | keeps the field open with the error when an async save fails; says the provider’s saveFailed when the error has no message |
| disabled | 60 % opacity, not clickable | `disabled` | Disabled | cannot be opened when disabled |
| empty | muted placeholder | — | — | shows the placeholder for an empty value, and reaches data-size from its prop or the provider |
| custom display / editor | badge, native select | `fieldProps` spread | Custom display | renders a custom display and editor |
| strings | — | — | — | takes its strings from the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter / Space (value) | Opens the field | native button |
| Enter (field) | Saves, focus to the value (new line in `multiline`) | — |
| Ctrl/⌘+Enter (multiline) | Saves | — |
| Escape | Puts the value back, closes, focus to the value | — |
| Tab | To ✓ and ×; leaving the group saves (focus not pulled back) | — |

**Notes.** ✓ and × keep focus in the field on pointer press so the press is not a blurring save. A window blur (another
tab) does not save. Escape inside a Radix dialog also closes the dialog (Radix listens on the document).

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Saving, Escape or × pressed | nothing changes; × dimmed | × `aria-disabled="true"` | async-save | waits for a pending save on Escape and the × |
| Save settles after unmount | — | no `onValueChange`, no `onOpenChange` | — | ignores a save that settles after the inplace left the page |
| Save settles after an outside close and a new opening | the new field stays open | `onValueChange` called with the saved value | — | does not close a field opened again when an earlier save settles |
| Multi-line value shown | line breaks kept (`whitespace-pre-line`) | — | textarea | keeps the line breaks of a multi-line value |

| Key | Behaviour | Source |
| --- | --- | --- |
| Escape (inside a Dialog, Sheet or Popover) | Cancels the edit only; the outer layer stays open (window-capture guard marks the key handled, as Combobox does) | ours |

Notes: the caller's `onKeyDown` and `onBlur` run before the built-in handlers instead of replacing them. Long words break anywhere (`wrap-anywhere`) in the display.

## Input mask

**Status:** built (0.1.1) · **Stock:** none: built on the library's `Input`, with its own mask engine.
**Pattern:** no APG pattern (a text field) · **Completeness references:** React Aria TextField
<https://react-aria.adobe.com/TextField> · the visual target's input mask.

**API:** `InputMask`: `mask: string` (`9` digit, `a` letter A–Z, `*` letter or digit, `?` starts the optional part, any
other character fixed), `slotChar?: string` (`"_"`; or a string as long as the pattern, `mm/dd/yyyy`), `autoClear?:
boolean` (true), `unmask?: boolean`, `value?`, `defaultValue?`, `onValueChange?(value, { complete })`; every other prop of
`Input` (`size`, `variant`, `clearable`, `aria-invalid`, `onChange`) except `keyFilter`. `data-slot="input-mask"`,
`data-mask` holds the pattern. No strings.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| empty | the placeholder; nothing written on focus | — | Basic | fills the slots as digits are typed and types the fixed characters itself |
| typing | every slot drawn, empty ones in `slotChar`; the caret after the last filled slot | — | Basic | (same) |
| refused character | nothing changes | — | Patterns | refuses a character that does not fit its slot; takes letters, digits or either in a mixed pattern |
| optional part | complete without it; empty optional slots dropped on blur | `onValueChange(…, { complete: true })` | Optional part | is complete without its optional part, and drops the empty optional slots on blur |
| slot character | `mm/dd/yyyy` under the typed digits | — | Slot character | shows slotChar in the empty slots, one character per position |
| unfinished on blur | emptied (`autoClear`), or kept with its slots | — | Auto-clear | empties an unfinished value when it loses focus, unless autoClear is off |
| unmask | the field shows the mask; the value is the typed characters | — | Unmasked value | reports the typed characters only with unmask, and the shown text to onChange |
| controlled / set from outside | the new value formatted | — | — | is controlled with value and onValueChange, and takes a value set from outside |
| clearable | Input's × | `button` named by `clear` | — | clears with the clear button |
| sizes, filled, invalid, disabled | Input's | `data-size`, `data-variant`, `aria-invalid`, `disabled` | Sizes, Disabled, Invalid | cannot be changed when disabled, and keeps its size, look and invalid state |
| all-digit pattern | — | `inputmode="numeric"` | Basic | opens the number pad when every slot takes a digit |

| Key | Behaviour | Source |
| --- | --- | --- |
| characters | fill the next slot when they fit (skipping fixed characters), else refused; a selection is replaced | the visual target's input mask |
| Backspace | removes the character before the caret; the rest move back | the visual target |
| Delete | removes the character after the caret; the rest move back | the visual target |
| Ctrl/Cmd+V | pasted text read as typed | the visual target |

**Notes.** Every edit is taken on `beforeinput` (and `paste`) and cancelled; the mask's result is written through the
native value setter with an `input` event, so React's and the app's `onChange` see it. Text arriving another way (an input
method, autofill, the clear button) is read again on the input event. Typing is never placed past the first empty slot,
so the filled slots are always a prefix of the pattern. Undo and redo are ignored. A refused character is not announced.

### Behaviour details

**Form reset.** The field holds its text in state, which a native reset cannot reach: an uncontrolled field sets its
`defaultValue` again after a reset. The form submits the shown text, mask included, even with `unmask`.
**Pattern change.** A new `mask` or `slotChar` redraws the typed characters that still fit (`fitRaw`).
**Right to left.** The input carries `unicode-bidi: plaintext` and `rtl:text-right`: slots take Latin letters and digits,
so the text keeps its left-to-right order on a right-to-left page, at the field's start.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| after a form reset | the default value | — | — | goes back to its default value when its form is reset, and submits what it shows |
| new pattern | the typed characters in the new pattern | `data-mask` | — | redraws its value when the pattern or the slot character changes |
| right to left | `(555) 123-4567` in order, at the start | — | (any, `?dir=rtl`) | — (layout; checked in the browser) |

## Input number

**Status:** built (0.1.1) · **Stock:** none: built on Base UI's Number Field (`@base-ui/react/number-field`).
**Pattern:** WAI-ARIA APG Spinbutton <https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/> · **Completeness
references:** Base UI Number Field <https://base-ui.com/react/components/number-field> · React Aria NumberField
<https://react-aria.adobe.com/NumberField>

**API:** one part, `InputNumber`. Root props passed to Base UI: `id`, `name`, `form`, `value` (`number | null`),
`defaultValue`, `onValueChange(value, details)`, `onValueCommitted`, `min`, `max`, `step` (1), `smallStep` (0.1),
`largeStep` (10), `snapOnStep`, `allowWheelScrub`, `allowOutOfRange`, `format` (`Intl.NumberFormatOptions`), `disabled`,
`readOnly`, `required`, `inputRef`. Own props: `size?: ControlSize`, `variant?: FieldVariant`, `fluid?: boolean`,
`buttons?: "stacked" | "horizontal" | "vertical"`, `prefix?: ReactNode`, `suffix?: ReactNode`, `locale?` (defaults to
the provider's `locale`). `className` goes on the outer box; every other attribute goes on the input. Parts:
`data-slot="input-number"` (root; `data-size`, `data-variant`, `data-buttons`), `input-number-field` (the box with the
field look), `input-number-input`, `input-number-prefix`, `input-number-suffix`, `input-number-buttons` (the stacked
column), `input-number-increment`, `input-number-decrement`. Strings: `increment` ("Increase"), `decrement`
("Decrease"), `numberFieldRole` ("Number field", the input's `aria-roledescription`, which Base UI hard-codes in English).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | 35 px: 6 × 10 px padding, 14/21 px text, `--field` fill, `--control` edge, 6 px radius, `shadow-xs`; as wide as an input's natural width (188 px) | `inputmode="decimal"`, `aria-roledescription` | Basic | shows the number in the provider locale, and a field locale over it |
| hover | edge `--control-hover`; a stepper `--accent` with its icon `--muted-foreground` (dark `--secondary-foreground`) | — | Buttons | — |
| pressed stepper | `--secondary-hover` fill, `--secondary-foreground` icon (dark `--secondary-hover-foreground`) | — | Buttons | — |
| focus-visible | the field's edge `--ring`, no ring | — | Basic | — |
| stacked buttons | a 36 px column inside the edge, two 16.5 px buttons, chevrons 14 px; the text's end padding 46 px | `data-buttons="stacked"` | Buttons | stops the arrows at max and turns the increment button off there |
| horizontal buttons | minus and plus 36 px wide either side, in the `--control` edge; the field's radius 0 | `data-buttons="horizontal"` | Buttons on both sides | changes the value with the stepper buttons, named by the provider strings |
| vertical buttons | chevrons above and below, full width, 6 px padding; the text centred | `data-buttons="vertical"` | Vertical | keeps the stepper buttons out of the tab order |
| at a bound | the button at that end at 60 % opacity | `disabled` on that button | Min and max | stops the arrows at max and turns the increment button off there |
| prefix / suffix | text inside the field, a space's width from the number | the input's `aria-describedby` includes them | Prefix and suffix | reads its prefix and suffix as its description |
| sizes | 28 / 35 / 42 px, icons 12 / 14 / 16 px | `data-size` on root and input | Sizes | sets its size, look and buttons as attributes, the provider ones when it has none |
| filled | `--field-filled` | `data-variant="filled"` | Filled | (same) |
| fluid | fills its container | — | Decimals | (same) |
| disabled | `--field-disabled` fill and `--field-disabled-foreground` text; buttons at full opacity on the disabled fill | `disabled` on input and buttons | Disabled | cannot be changed when disabled or read-only |
| read-only | as default; keys and buttons do nothing | `readonly` | Read-only | cannot be changed when disabled or read-only |
| invalid | `--invalid` edge (on the buttons too), red placeholder; focus still `--ring` | `aria-invalid` | Invalid | announces an invalid value with its message |
| controlled | — | `value` + `onValueChange` | — | is controlled with value and onValueChange |
| form | the number submitted under `name` | hidden native number input | — | submits its number with its form under its name |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowUp / ArrowDown | ± `step`; Shift ± `largeStep`; Alt ± `smallStep`; clamped | APG Spinbutton; Base UI |
| Page Up / Page Down | ± `largeStep`; clamped | APG Spinbutton; added here (Base UI 1.8 leaves them to the browser): the component re-dispatches Shift+Arrow so Base UI's own clamping, snapping and change reason apply |
| Home / End | to `min` / `max` when set | APG Spinbutton; Base UI |
| digits, separators | typed; other characters refused | Base UI |

**Notes.** The input keeps the page's direction but reads its text left to right (`unicode-bidi: plaintext`, right-aligned
on a right-to-left page), so `10,25 €` never reorders. The stepper buttons are outside the tab order (APG); a press keeps
the focus in the field. The stacked buttons are 36 × 16.5 px, as in the visual target, under WCAG 2.5.8's 24 px; the
keyboard and the full-size horizontal and vertical buttons cover it. Base UI's scrub area is not exposed. Typed values
outside the range are clamped on blur.

### Behaviour details

**Form reset.** Base UI keeps the number in state; an uncontrolled field remounts its Root after a reset (`key`), so it
starts from `defaultValue` again.
**Step check.** Without a `step` of its own the Root gets `step="any"`: Base UI steps by 1 as before, and the hidden
number input that carries the value for forms takes `step="any"`. With `min`, the browser's step check refused a form
holding a number between whole steps (`12.99`, `min={0}`). A `step` of the app's keeps the native check.
**Alt with an arrow** steps by `smallStep`; the row was on the page without a test.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| after a form reset | the default value | — | — | goes back to its default value when its form is reset |
| decimal with `min` in a form | — | hidden input `step="any"` | — | lets a form holding a number between whole steps submit, with min set |

| Key | Behaviour | Source |
| --- | --- | --- |
| Alt + ArrowUp / ArrowDown | adds or takes away `smallStep` | Base UI (test: steps by smallStep with Alt and an arrow) |

## Input OTP

**Status:** built (0.1.1) · **Stock:** none: built on Base UI OTP Field (`@base-ui/react/otp-field` 1.8), with shadcn
`new-york-v4/input-otp`'s parts and names (stock is built on the `input-otp` package, which is not used)

**Pattern:** no APG pattern; a group of text inputs (WAI-ARIA `group`) · **Completeness references:** Base UI OTP Field
<https://base-ui.com/react/components/otp-field> · the visual target's input OTP page (controlled, mask, integer only,
filled, sizes, disabled, sample)

**API.** `InputOTP` (Base UI `Root`, `data-slot="input-otp"`): `maxLength` (required, mapped to `length`), `size`
(`ControlSize`), `variant` (`FieldVariant`), `validationType` (`"alphanumeric"` default here; `"numeric" | "alpha" |
"none"`), `value`, `defaultValue`, `onValueChange`, `onValueComplete`, `onValueInvalid`, `normalizeValue`, `mask`,
`disabled`, `readOnly`, `required`, `name`, `form`, `autoSubmit`, `autoComplete`, `id`, `aria-invalid` (passed to every
box, not the group), `aria-label`, `aria-labelledby`. `InputOTPGroup` (`input-otp-group`), `InputOTPSlot`
(`input-otp-slot`, a native `input`; `index` names it), `InputOTPSeparator` (`input-otp-separator`, Base UI `Separator`
with a minus icon). The root is wrapped in Base UI's `DirectionProvider` with the provider's `dir`.

| Row | shadcn stock (input-otp) | Boolean UI | Why |
| --- | --- | --- | --- |
| Primitive | `OTPInput` (one hidden input, painted slots, fake caret) | Base UI OTP Field: one real `input` per box, roving tab stop, hidden form input | Real inputs, native caret, per-box names |
| Value API | `value`, `onChange`, `pattern` regex | `value`, `onValueChange`, `validationType`, `normalizeValue` | Base UI's API; `maxLength` kept |
| Slots | joined: shared borders, outer corners rounded | one box per character, 8 px apart, each with the field edge and 6 px radius | The visual target's boxes |
| Size | 36 × 36 px, one size | 36 × 35 px default (`py-1.5 text-sm/normal`), 28 × 28 sm, 42 × 42 lg; `data-size` | The field sizes |
| Look | `border-input`, focus ring at 50 %, `dark:bg-input/30` | `--field` fill, `--control` edge (`--control-hover` on hover), focus `--ring` edge, `--invalid` edge, `--field-disabled` fill; `filled` = `--field-filled` | The field look |
| Disabled | 50 % opacity on the container | per-box disabled fill and text, no opacity | The field look |
| Separator | 16 px minus | 14 px minus in `--muted-foreground`, `role="separator"` | Icon size |
| Names | none on the slots | first box: the label (or the root's `aria-label`/`aria-labelledby`); others "Character {index} of {count}" (`otpCharacter`) | WCAG 4.1.2 |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default (empty) | white boxes, `--control` edge | `role="group"` named by the label; `autocomplete="one-time-code"` on the first box | Basic | renders one named box per character in a group named by the label |
| hover | `--control-hover` edge | — | Basic | — |
| focus-visible | `--ring` edge | roving `tabindex` | Basic | is one tab stop |
| filled | characters centred | `data-filled` | Controlled | works as a controlled field |
| complete | — | `data-complete`; `onValueComplete` | Sample | fills every box from a pasted code |
| masked | dots | `type="password"` | Mask | hides the characters with mask |
| numeric | digits only, number pad | `inputmode="numeric"` | Integer only | takes letters and digits by default, and digits only with validationType="numeric" |
| sizes | 28 / 35 / 42 px | `data-size` on the group and every box | Sizes | sets the size and the filled look on every box, from the prop or the provider |
| filled variant | `--field-filled` fill | `data-variant="filled"` | Filled | (same test) |
| disabled | `--field-disabled` fill and text | `disabled` on every box | Disabled | disables every box |
| invalid | `--invalid` edge, message below | `aria-invalid` on every box, `aria-describedby` on the group | Invalid | marks every box invalid with aria-invalid |
| split | two groups with a minus | `role="separator"` | With separator | splits the boxes with a separator |
| in a Dialog | works unchanged (no portal) | — | (test) | takes typing inside a Dialog |

Rows not applicable: loading, empty list, open.

| Key | Behaviour | Source |
| --- | --- | --- |
| 0–9, A–Z | Fills the box and moves on; refused characters ignored | Base UI OTP Field |
| Backspace | Empties the box, or the previous one when empty, and moves back | Base UI |
| Delete | Removes the box's character; later ones move back | Base UI |
| ArrowLeft / ArrowRight | Previous / next box (swapped in RTL) | Base UI, with the provider's direction |
| Home / End | First box / the box after the last character | Base UI |
| Ctrl+V | Pastes across the boxes from the focused one | Base UI |
| Tab | Leaves the field (one tab stop) | Base UI |

Notes. Default `validationType` is `alphanumeric` (Base UI: `numeric`; shadcn and the visual target accept anything):
letters and digits cover real codes and refuse spaces and symbols. The visual target's sample uses bold 24 px digits in
larger boxes; the package's Sample uses `size="lg"`.

### Additions

`validationType` defaults to `"numeric"` (was `"alphanumeric"`); `inputMode` defaults to `"numeric"` with digits;
`autoComplete` defaults to `"one-time-code"`. Example Letters and digits (`alphanumeric`); tests "takes digits only by
default …", "takes letters and digits with validationType="alphanumeric" …".

### Behaviour details

**Form reset.** Base UI keeps the code in state; an uncontrolled field remounts its Root after a reset, so it starts
from `defaultValue` again. A partly filled code fails the hidden input's `pattern`, so the form submits once every box
is filled (or none is, unless `required`); the page says so.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| in a form, reset | the default code | hidden input `name` | — | submits its code under its name and goes back to its default when its form is reset |

## Knob

**Status:** built (0.1.1) · **Stock:** none: built on an SVG with `role="slider"`.
**Pattern:** APG Slider <https://www.w3.org/WAI/ARIA/apg/patterns/slider/> · **Completeness references:** React Aria
Slider <https://react-aria.adobe.com/Slider>, Base UI Slider <https://base-ui.com/react/components/slider> (no round
variant in either).

**API:** `Knob` — `value?: number`, `defaultValue = min`, `onValueChange`, `onValueCommit`, `min = 0`, `max = 100`,
`step = 1`, `size?: ControlSize` (80 / 100 / 150 px; any `size-*` class overrides), `strokeWidth = 14` (1–20, in
hundredths of the width), `formatValue?: (n) => string` (text and `aria-valuetext`), `showValue = true`, `valueColor`,
`rangeColor`, `textColor` (any CSS colour, set as `--knob-value`, `--knob-range`, `--knob-text`), `readOnly`, `disabled`,
`aria-label` / `aria-labelledby` / `aria-describedby`, and `div` props. Parts: `knob`, `knob-dial`, `knob-range`,
`knob-value`, `knob-text`. No new strings (numbers via Intl in the provider locale).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | 300° arc, radius 40 of 100, 14-unit stroke; arc `--border`, value `--primary`, 18-unit text `--muted-foreground` | `svg role="slider"`, `aria-valuenow/min/max`, `tabindex=0` | Basic | renders a named slider with its value and bounds, and the value in the middle |
| min/max across zero | value arc starts at 0 | — | Min and max | starts the value arc at zero when the range spans it, and draws none at zero |
| step | snaps by key and drag | — | Step | snaps to its step |
| template | text and announcement from `formatValue` | `aria-valuetext` | Value template | shows and announces the text formatValue returns |
| stroke / sizes / colours | thinner arc; 80 / 100 / 150 px; token colours | `data-size` | Stroke width, Sizes, Colours | sets data-size from its prop or the provider |
| controlled | follows `value` | — | Controlled | is controlled by value and reports each change once it ends |
| focus | 1 px `--ring` outline 2 px round the dial | — | — | — |
| read only | unchanged look, default cursor | `aria-readonly="true"`, stays focusable | Read only | keeps a read-only dial focusable and announced but fixed |
| disabled | 60 % opacity | `aria-disabled="true"`, `tabindex=-1` | Disabled | leaves the tab order and ignores keys while disabled |
| pointer | press or drag round the dial; below it the nearer end wins | — | — | sets the value from a press on the dial |

| Key | Behaviour | Source |
| --- | --- | --- |
| → / ↑ | +1 step | APG Slider |
| ← / ↓ | −1 step | APG Slider |
| Shift + arrow | 10 steps | APG Slider (large step), as the library's Slider |
| Page Up / Page Down | ±10 steps | APG Slider |
| Home / End | min / max | APG Slider |

**Notes.** The dial turns clockwise in both reading directions, so the arrows are not swapped in RTL (it is not a
horizontal slider). The reference's mount animation of the value arc is not copied (motion lives in theme.css).

### Behaviour details

**API addition:** `name?: string`. A hidden `input` (`data-slot="knob-input"`) carries the value and is disabled with the
knob, so a disabled knob submits nothing, as a native input. A form `reset` sets the first value (`defaultValue`, else
`min`; a controlled knob gets `onValueChange` with the value it had at mount). The root `ref` is composed with the knob's
own.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| in a form | — | hidden input `name` = value | — | submits its value under name and goes back to its first value when the form is reset |
| disabled in a form | — | the hidden input is disabled | — | submits nothing while disabled, as a native input |

## Link

**Status:** built (0.1.1) · **Stock:** none: built on an `<a>` (Radix `Slot` for `asChild`).
**Pattern:** WAI-ARIA APG Link <https://www.w3.org/WAI/ARIA/apg/patterns/link/> · **Completeness references:** React
Aria Link <https://react-aria.adobe.com/Link> · Primer Link <https://primer.style/components/link> · Chakra Link
<https://chakra-ui.com/docs/components/link>

**API:** `Link` — the `<a>` props, plus `variant?` (`default` | `muted` | `destructive`), `underline?` (`hover` (default)
| `always`), `size?` (`sm` 12/18 | `default` 14/21 | `lg` 16/24; left out, the size of the surrounding text, no
`data-size`), `visited?` (`visited:` colour `--help-active`), `external?`, `disabled?`, `asChild?`. Exports `Link`,
`linkVariants`. Parts: `link`, `link-external-icon`, `link-external-label`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | 500-weight text in `--primary`, no underline; underlined in the text colour on hover | `href`, `data-variant`, `data-size` | Basic | renders an anchor with its address, variant and size |
| muted | `--muted-foreground`, `--foreground` on hover | `data-variant="muted"` | Muted | renders an anchor with its address, variant and size |
| destructive | `--destructive-strong` | `data-variant="destructive"` | Destructive | — |
| sizes | 12, 14, 16 px; none inherits | `data-size` or none | Sizes, In a paragraph | takes the size of the text around it when given none |
| underline always | underlined at 40 % of the text colour, 0.2 em below, full colour on hover | — | In a paragraph | — |
| external | a 0.875 em up-right arrow after the text, kept on the last word's line (word joiner in a nowrap, `aria-hidden` span), mirrored in RTL | `target="_blank"`, `rel` + `noopener noreferrer`, visually hidden " (opens in a new tab)" | External, In a paragraph | opens an external link in a new tab, safely, and says so…; translates the new-tab notice |
| visited | `--help-active` once visited | `visited:` class | — (depends on browser history, so no example) | adds the visited colour only with visited |
| focus-visible | 1 px `--ring` outline 2 px out, 2 px radius | — | Basic | — |
| disabled | 60 % opacity, no pointer | no `href`, `role="link"`, `aria-disabled="true"`; clicks prevented | Disabled | turns off when disabled… |
| asChild | the look on the router's link; the child keeps its address and navigation | `data-slot="link"` on the child | As a router link | puts its look and behaviour on a router link with asChild…; takes a disabled router link out of the tab order |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter | Follows the link | native `<a href>` / APG Link |

**Notes.** Strings: `opensInNewTab` new. The underline in running text (`underline="always"`) is required for WCAG 1.4.1:
`--primary` is under 3:1 against `--foreground`. With `asChild`, `disabled` cannot remove the child's address or stop a
router's own click handler; it sets `aria-disabled`, `tabindex="-1"` and `pointer-events: none`.

## Listbox

**Status:** built (0.1.1) · **Stock:** none: built on plain elements, to the APG listbox pattern; the filter field is the
library's InputGroup.
**Pattern:** WAI-ARIA APG Listbox <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/> · **Completeness references:**
React Aria ListBox <https://react-aria.adobe.com/ListBox> · Base UI Combobox (inline) <https://base-ui.com/react/components/combobox>

**Why plain elements:** the two bases offered do not give a correct listbox. Base UI's Combobox list is virtual-focus only:
the keyboard owner and the `aria-activedescendant` host is always a text input, so a listbox with no filter has no focus
owner. The cmdk Command marks the *highlighted* item with `aria-selected`, which cannot be overridden, so a screen reader
would announce the highlight as the selection and could not tell chosen options in a multiple list. The listbox is one
tab stop (`role="listbox"`, `tabindex="0"`) with `aria-activedescendant`, `aria-multiselectable`, and options carrying
their real `aria-selected`; with `filter`, a `role="combobox"` field (`aria-expanded="true"`, `aria-controls`) owns the
keyboard instead.

**API:** `Listbox` — single: `value?: string | null`, `defaultValue?`, `onValueChange?: (value: string | null) => void`;
`multiple: true`: `value?: string[]`, `defaultValue?`, `onValueChange?: (value: string[]) => void`; `indicator?: "none" |
"check" | "checkbox"` (default `none`), `filter`, `filterPlaceholder`, `disabled`, `listClassName`, `aria-label` /
`aria-labelledby` / `aria-invalid` / `aria-describedby` (to the list). `ListboxItem` — `value`, `textValue?`, `disabled`,
`icon?`, `description?`. `ListboxGroup`, `ListboxLabel`, `ListboxSeparator` (`aria-hidden`), `ListboxEmpty` (default
`noResults`). Parts: `listbox`, `listbox-header`, `listbox-list`, `listbox-item`, `listbox-item-indicator`,
`listbox-item-checkbox`, `listbox-item-icon`, `listbox-item-body`, `listbox-group`, `listbox-label`, `listbox-separator`,
`listbox-empty`. Strings: `filterOptions`, `noResults`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rest | a 1 px `--control` frame, 6 px radius, `--field` fill; options as Select's (29 px, 4 × 10 px) | `role="listbox"` `tabindex="0"`, options `role="option"` | Basic | is one tab stop; focus highlights the chosen option, else the first |
| focused / highlighted | frame `--ring`; the highlighted option `--accent` | `aria-activedescendant` | Basic | moves the highlight with ArrowDown and ArrowUp, stopping at the ends |
| chosen | `--highlight` fill (`--highlight-focus` while highlighted) | `aria-selected="true"` | Basic, Multiple | chooses the highlighted option with Enter or Space (single); multiple: Space toggles… |
| check / checkbox | a 14 px check, or an 18 px drawn checkbox, at the start | marks `aria-hidden` | Checkbox selection | checkbox and check indicators mark the chosen options |
| groups | muted semibold label; a group with no match hides | `role="group"` `aria-labelledby` | Groups | groups options under their labels; a separator is hidden from assistive technology |
| filter / empty | an InputGroup with a search icon above; "No results" | field `role="combobox"`, `aria-controls`, `aria-activedescendant` | Filter | filter: typing narrows the options; the arrows and Enter work from the field; "No results" from the provider |
| custom option | avatar and a second line | — | Custom option | — (covered by the type-ahead test via `textValue`) |
| disabled option | 60 %; skipped | `aria-disabled="true"` | Disabled options | skips and ignores disabled options |
| disabled | `--field-disabled`, muted options, the chosen one on a `--control` fill | `aria-disabled="true"`, `tabindex="-1"` | Disabled | is out of the tab order and unchangeable while disabled |
| invalid | `--invalid` frame | `aria-invalid="true"` on the list | Invalid | passes aria-invalid to the list |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowDown / ArrowUp | Move the highlight; stop at the ends | APG Listbox |
| Home / End | First / last option (on the list) | APG Listbox |
| Space | Choose (single) or toggle (multiple) the highlighted option (on the list) | APG Listbox |
| Enter | As Space; also from the filter field | Boolean UI (APG leaves Enter to the author) |
| Printable characters | Type-ahead on the list (500 ms buffer); narrow the options from the filter field | APG Listbox |

**Notes.** Selection does not follow focus (APG's optional behaviour), so arrowing never changes the value. No Shift range
selection or Ctrl+A in this version. A click chooses and keeps focus on the list (or its field). The highlight shows only
while the list has focus, and follows the options the filter leaves.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Empty (filter or data) | "No results" in an option's place | `ListboxEmpty` is a `role="status"` after the `role="listbox"`, empty until the list shows no option | Filter | "empty: "No results" is a polite status beside the list, not inside it, and the empty list passes axe" |
| Form (`name`) | — | one hidden input per chosen value; none while disabled | — | "name: submits each chosen value as a hidden input; a disabled list submits nothing" |
| After a form reset | the starting value | — | — | "a form reset puts an uncontrolled list back to its starting value" |

Notes:
- `ListboxEmpty` must be a direct child of `Listbox`, which renders it after the list; the message used to sit inside the listbox, which axe reports as critical (`aria-required-children`) and screen readers did not announce.
- New prop `name` (hidden inputs, `disabled` with the list). An `id` given to the list is the one the filter field's `aria-controls` names ("an id given to the list is the one the filter field controls").

## Loading overlay

**Status:** built (0.1.1) · **Stock:** none: built on plain elements, the `inert` attribute and the package's presence
hook (`src/lib/presence.ts`).
**Pattern:** `aria-busy` <https://www.w3.org/TR/wai-aria-1.2/#aria-busy> and a polite live region · **Completeness
references:** the visual target's BlockUI, Mantine LoadingOverlay.

**API:** `LoadingOverlay` — `loading?`, `fullScreen?` (portal to `<body>`, fixed mask, every other body child `inert`;
children optional), `label?: string` (beside the spinner and announced; default announcement `loading`), `indicator?`
(replaces the spinner), div props for the wrapper (`relative rounded-md`). Parts: `loading-overlay` (`aria-busy`,
`data-loading`), `loading-overlay-content` (`inert` while loading), `loading-overlay-mask` (`data-state`,
`data-bui-motion="overlay"`, `bg-mask`, `rounded-[inherit]`, fades), `loading-overlay-indicator` (a `--popover` chip, 8 px
radius, `shadow-md`, `aria-hidden`), `loading-overlay-label`, `loading-overlay-portal`. Strings: `loading` (existing).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| idle | content only | no `aria-busy`, no `inert`, empty status | — | leaves the content alone while not loading |
| region loading | mask over the region, spinner chip in the middle | wrapper `aria-busy="true"`, content `inert`, status = label | Region | marks the region busy, makes its content inert and announces the label while loading |
| with text | label beside the spinner | — | With text | (same) |
| default announcement | — | status = `loading` | — | announces the provider’s loading string when there is no label |
| custom indicator | ProgressCircle in place of the spinner | — | Custom indicator | shows a custom indicator in place of the spinner |
| focus return | — | the control focused when blocking began gets focus back | Region | gives focus back to the control that had it when loading ends |
| full screen | fixed mask over the window | other body children `inert`, status in the portal | Full screen | covers the window and makes the rest of the page inert with fullScreen |

**Keys:** none (nothing inside is reachable while loading).

**Notes.** The status region is always on the page so the announcement is reliable. The mask follows the wrapper's
corners; give the wrapper the region's radius. There is no mask-foreground token, so the spinner sits on a popover chip to
read in both themes (the visual target shows a bare mask).
**Presence.** The mask uses `usePresence(loading, ref)` (`src/lib/presence.ts`): it stays mounted, `data-state="closed"`,
while its fade-out runs and leaves on its own `animationend`/`transitionend`, after the computed duration, or at once when
nothing animates or under reduced motion. It replaces Radix's undocumented `Presence` (`radix-ui/internal`). Test:
`tests/lib/presence.test.jsx`.

### Behaviour details

**Full screen.** While loading, every child of `<body>` except the overlays' own parts is inert, and `<html>` has
`overflow: hidden` (with `scrollbar-gutter: stable` where the window has a classic scrollbar, so nothing shifts). Both
are counted on the elements (`data-bui-inert`, `data-bui-scroll-lock`), so overlapping full-screen overlays — or two
copies of the library on one page — release the page only when the last one ends; an element inert before loading, and
the page's own inline `overflow`, are restored as they were. The status region stays in a portal that is always on the
page; the mask is a portal of its own that joins the end of `<body>` when loading starts, so it covers a dialog or menu
opened earlier at the same z-index. A consumer `ref` is merged with the wrapper's own. Known limit: when two full-screen
overlays overlap, focus returns only if the first one to start is the last to end.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| two full-screen overlays overlap | both masks | page `inert` until the last ends; `<html>` `overflow: hidden` | — | keeps the page inert and still until the last of two full-screen overlays ends |
| unmounted while loading | gone | `inert` and scroll restored; earlier `inert` kept | — | releases the page and its scroll when it unmounts while loading, and keeps the page’s own values |
| loading over an open dialog | mask above the dialog | dialog `inert` | — | puts the full-screen mask above a layer opened before loading started |

## Menubar

**Status:** built (0.1.1) · **Stock:** shadcn `menubar` (Radix Menubar), with the patches in `PATCHES.md`.
**Pattern:** WAI-ARIA APG Menubar <https://www.w3.org/WAI/ARIA/apg/patterns/menubar/> · **Completeness references:**
Base UI Menubar <https://base-ui.com/react/components/menubar> · React Aria Menu <https://react-aria.adobe.com/Menu>

**API:** stock's parts unchanged: `Menubar`, `MenubarMenu`, `MenubarTrigger`, `MenubarContent`, `MenubarItem` (`variant`,
`inset`), `MenubarCheckboxItem`, `MenubarRadioGroup`, `MenubarRadioItem`, `MenubarLabel`, `MenubarSeparator`,
`MenubarShortcut`, `MenubarGroup`, `MenubarPortal`, `MenubarSub`, `MenubarSubTrigger`, `MenubarSubContent`. No strings.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Bar | 36 px fixed, `--background`, 4 px padding and gap, `shadow-xs` | `--card`, 1 px edge, 6 px radius, 6 × 10 px padding, 8 px gap, no shadow (43 px tall) | The visual target's menubar (resolved CSS). |
| Trigger | px-2 py-1, 4 px radius, medium, accent on focus / open only | 0.25 × 0.625 rem padding, 6 px radius, 14 px medium on 21 px, `--accent` on hover, focus and open; 14 px icons in `--control-hover` | The target's root items; the weight follows the target's live File / Edit / View demo (its menubar CSS says normal). |
| Menus | 12 rem, block, no exit animation | at least 12.5 rem; the dropdown menu's look (see Context menu); exit fade added; `data-bui-motion="overlay"` | The target's submenu; every overlay fades out. |
| Items, checks, labels, rules, chevron | stock | as the dropdown menu; 12 px chevron with `rtl:rotate-180` | Consistency; RTL. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rest | bar with triggers | `role="menubar"`, triggers `menuitem` + `aria-haspopup="menu"` | Basic | renders a menubar of triggers that open menus |
| trigger hover / focus / open | `--accent` fill | `aria-expanded`, `data-state="open"` | Basic | opens a menu with Enter and with Space |
| disabled item | 60 % | `aria-disabled` | Basic | opens a menu on its first item with ArrowDown … skipping a disabled item |
| checkbox / radio | check / dot | `aria-checked` | Checkbox and radio items | toggles a checkbox item and chooses one radio item |
| icons | 14 px icon before the label | — | With icons | — |
| submenu | nested menu | `aria-haspopup="menu"` | Basic | opens a submenu with ArrowRight and closes it with ArrowLeft |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | One tab stop in and out | APG Menubar |
| → / ← | Next / previous trigger, wrapping; inside a menu, opens the next / previous menu (mirrored in RTL) | APG Menubar |
| Enter, Space | Open a menu; choose an item | APG Menubar |
| ↓ / ↑ | Open on the first item; next / previous item | APG Menubar |
| Home / End | First / last trigger or item | APG Menubar |
| A–Z | Type-ahead in a menu | APG Menubar |
| Escape | Close, focus back to the trigger | APG Menubar |

**Notes:** no mobile collapse (the target has a hamburger mode; not built). For the owner: trigger weight 500 (live demo)
or 400 (the target's menubar CSS).

### Behaviour details

`MenubarSubContent` takes the content's available height and scrolls (stock: cut off).

## Meter group

**Status:** built (0.1.1) · **Stock:** none: built on semantic HTML — a `role="group"` of `role="meter"` segments. Base
UI's Meter was considered: a meter has no behaviour beyond its ARIA attributes, so it would add an optional peer and
nothing for screen readers.
**Pattern:** APG Meter <https://www.w3.org/WAI/ARIA/apg/patterns/meter/> · **Completeness references:** Base UI Meter
<https://base-ui.com/react/components/meter>, Mantine Progress sections, and the visual target's meter group (multiple,
colours, icons, label position and orientation, vertical, min-max, custom template).

**API:** `MeterGroup` — `values: { label, value, color?, icon? }[]`, `min` (0), `max` (100), `orientation`
("horizontal" | "vertical"), `labelPosition` ("start" | "end"), `labelOrientation?` (follows `orientation`),
`formatValue?(value, percent)` (default: the share as a percentage in the provider's locale), children (replace the
built-in track and legend), `div` props; name it with `aria-label` / `aria-labelledby`. `MeterGroupMeters` — the 6 px
`--border` track (6 px radius) of segments, each as long as `value / (max - min)`, clamped to 0–100 %, first and last
rounding the ends. `MeterGroupLegend` — `orientation?`; 6 px dots (or 14 px icons) in the segment colour, 14 px labels
"Label (14%)", 14 px gaps in a row, 6 px in a column; `aria-hidden`. Segment colours default to `--chart-1`…`--chart-5`
in turn. Parts: `meter-group`, `meter-group-meters`, `meter-group-meter`, `meter-group-legend`, `meter-group-label`,
`meter-group-label-marker`, `meter-group-label-icon`, `meter-group-label-text`. No strings.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | one `--chart-1` segment on the track, legend below | `group` "Storage" > `meter` with `aria-valuenow/min/max/valuetext` | Basic | is a named group of meters, one per segment, with their values |
| multiple / colours | segments in chart or status colours | inline `background-color` | Multiple | colours the segments with the chart colours in turn unless one names its own |
| icons | an icon in place of the dot, in the segment colour | legend `aria-hidden` | Icons | hides the legend, which repeats the meters, and draws an icon in place of a dot |
| label position | legend before the track; legend in a column | `data-orientation` on the legend | Label position | puts the legend first with labelPosition="start", and in a column with labelOrientation |
| vertical | a 6 px column, segments top down, legend beside | `data-orientation="vertical"` | Vertical | stands the track up with orientation="vertical" |
| min-max | shares of `max - min` (16 of 200 = 8 %) | `aria-valuemax="200"` | Min and max | measures each segment against max - min; keeps a share between 0 and 100 % |
| custom legend | consumer cards above the track | consumer content | Custom legend | takes a custom legend from children, with the parts |
| locale | "16 %" in de-DE, or `formatValue` | `aria-valuetext` | — | writes the values in the provider's locale, or with formatValue |

No keyboard rows: meters are not interactive.

**Notes.** The reference puts a single `role="meter"` with the total on the root; here every segment is a meter with its
own name and value, which says more, and the legend is hidden so values are not read twice. A custom legend is read
unless the consumer hides it. Not built: a thickness size (the reference has one, 6 px).

### Behaviour details

- Each segment's drawn length is its share capped by the room the segments before it leave, so the total never exceeds the track; `percent` and the text stay the segment's own.
- `aria-valuenow` is clamped to `min`–`max`; `aria-valuetext` still says the real amount.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Segments sum over the range | Track full, later segments cut short or not drawn | widths sum to 100% | — | never draws past the end of the track |
| Value outside the range | Clamped length | `aria-valuenow` clamped, `aria-valuetext` real | — | keeps aria-valuenow within the range |

## Multi-select

**Status:** built (0.1.1) · **Stock:** none: built on Base UI Combobox (`@base-ui/react/combobox`) with `multiple` and
the input inside the list; reuses the library's Combobox list parts, Checkbox and InputGroup.
**Pattern:** WAI-ARIA APG Combobox, select-only trigger <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
with a filterable multi-selectable listbox · **Completeness references:** Base UI Combobox (input inside popup)
<https://base-ui.com/react/components/combobox> · React Aria Select (multiple) <https://react-aria.adobe.com/Select> ·
Mantine MultiSelect <https://mantine.dev/core/multi-select/>

**API:** `MultiSelect<Value = string>` — `items`, `value?: Value[]`, `defaultValue?: Value[]`,
`onValueChange?: (value: Value[]) => void`, `itemToStringLabel`, `isItemEqualToValue` (default: same value or same `value`
field), `disabled`, and the other Base UI root props. `MultiSelectTrigger` — `size`, `variant`, `fluid`, `clearable`.
`MultiSelectValue` — `placeholder`, `display?: "labels" | "chips" | "count"` (default `labels`), `maxShown?: number`.
`MultiSelectContent` — `filter` (show the filter field from the start), `filterPlaceholder`, `selectAll`, and
`ComboboxContent` props. `MultiSelectItem` — `indicator?: "check" | "checkbox"`, `icon?`, `description?`, `disabled`.
`MultiSelectList`, `MultiSelectGroup`, `MultiSelectLabel`, `MultiSelectSeparator`, `MultiSelectEmpty`,
`MultiSelectCollection`. Parts: `multi-select-trigger`, `multi-select-control`, `multi-select-clear`, `multi-select-value`,
`multi-select-chip`, `multi-select-chip-remove`, `multi-select-more`, `multi-select-content`, `multi-select-header`,
`multi-select-filter`, `multi-select-select-all`, `multi-select-list`, `multi-select-item`, `multi-select-item-indicator`,
`multi-select-item-checkbox`, `multi-select-group`, `multi-select-label`, `multi-select-empty`. New strings: `filterOptions`,
`selectedCount` ("{count} selected"), `moreSelected` ("+{count} more"); reused: `selectAll`, `clear`, `removeItem`,
`toggleOptions`, `noResults`. Counts are formatted with `Intl.NumberFormat(locale)`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| placeholder | Select's trigger with muted text | trigger `role="combobox"`, `aria-haspopup="dialog"`, `data-placeholder` | Basic | shows the placeholder while nothing is chosen |
| labels | "Delivered, Bounced", truncated | — | Basic | shows the chosen labels, joined with commas |
| max shown / count | "Billing +2 more" (muted); "3 selected" | — | Max shown | maxShown: …; display="count": … |
| chips | 28 px pills on `--secondary` with × (pointer only); the field grows a row when they wrap | × `aria-hidden`, not focusable | Chips | display="chips": a chip per value; a click on its × removes it without opening the list |
| open | the list below with a filter field at its top (hidden until typed into unless `filter`) | a dialog named after the field's label; filter `role="combobox"` named `filterOptions`; `role="listbox"` `aria-multiselectable` | Basic, Filter | opens from the trigger…; filters as you type…; shows a visible filter field with filter |
| chosen option | `--highlight` fill and a check at the start (or a drawn checkbox) | `aria-selected="true"` | Basic, Checkbox selection | toggles the highlighted option with Enter and stays open; …with Space |
| select all | an 18 px checkbox (mixed while some are chosen) with "Select all" (label hidden beside a filter) | Radix checkbox named `selectAll` | Checkbox selection | selectAll: chooses every option the filter leaves, then clears them; selectAll is mixed… |
| groups | muted semibold labels | `role="group"` | Groups | shows groups with their labels |
| clearable | × before the chevron while options are chosen | `button` named `clear`, a tab stop | Clear | clear: empties the selection, names the button from the provider and refocuses the trigger |
| sizes / filled / fluid | 28 / 35 / 42 px; `--field-filled`; `w-full` | `data-size`, `data-variant` | Sizes, Filled, Fluid | sets data-size and data-variant…; takes the provider controlSize… |
| disabled | `--field-disabled`; disabled options at 60 % | `disabled` | Disabled | does not open while disabled |
| invalid | `--invalid` edge, red placeholder | `aria-invalid` | Invalid | passes aria-invalid to the trigger |
| in a dialog / sheet | the list inside the overlay | — | In a dialog | in a dialog: the list renders inside it…; in a sheet… |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter / ArrowDown (trigger) | Open the list, focus in its filter | APG Combobox (select-only) |
| ArrowDown / ArrowUp | Highlight the next / previous option | APG Combobox |
| Enter | Toggle the highlighted option; the list stays open | APG Listbox (multi-select) |
| Space | With nothing typed, toggle the highlighted option | APG Listbox (multi-select) |
| Printable characters | Filter the options; the filter field shows | Base UI Combobox |
| Escape | Close, focus returns to the trigger; inside a dialog the dialog stays open | APG Combobox |
| Backspace (closed trigger) | Remove the last chosen option | Boolean UI (the chips' keyboard path) |
| Tab | With `clearable`, from the trigger to the clear button | native |

**Notes.** Focus moves into the list (to its filter input), so inside a Radix dialog, sheet or popover the list is
portalled into that overlay's content (found from a hidden marker in the field's place): outside it, the dialog's focus
trap would take focus straight back. The cost is that a short dialog clips the list; it flips to the side with more room.
Escape is marked handled while the list is open, as in Combobox. Picking keeps the typed filter (Base UI's item-press
input clear is cancelled), so several options can be picked from one search. A chip's × is a pointer shortcut inside the
trigger button (a button cannot contain a button); keyboard users unpick in the list or press Backspace on the closed
trigger.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Chip × target | the 22 px circle (16 px `sm`) unchanged | a transparent 24 px square takes presses (WCAG 2.5.8) | Chips | "display="chips": each × has a hit area of at least 24 × 24 px round its 22px circle (WCAG 2.5.8)" |

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| In a popover | the list renders inside the popover | focus in the filter; Escape closes the list and returns focus to the trigger, then closes the popover | — | "in a popover: the list renders inside it, a click toggles an option, Escape closes the list, then the popover" |
| Form (`name`) | — | one hidden input per value (an object's `value`); none while disabled | — | "submits each chosen value under name (an object its value); a disabled field submits nothing" |
| After a form reset | the starting choice | — | — | "a form reset puts an uncontrolled field back to the options it started with" |

Notes: a form reset puts an uncontrolled field back to `defaultValue` (`useFormReset`, following the root's `form` attribute); a controlled one is left to the app.

## Navigation menu

**Status:** built (0.1.1) · **Stock:** shadcn `navigation-menu` (Radix Navigation Menu), with the patches in `PATCHES.md`.
The file stays a server-safe module (no `"use client"`, as stock) so `navigationMenuTriggerStyle()` can be called on the server.
**Pattern:** WAI-ARIA APG Disclosure navigation
<https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/> · **Completeness references:**
Base UI Navigation Menu <https://base-ui.com/react/components/navigation-menu> · React Aria has none.

**API:** stock's parts (`NavigationMenu` with `viewport`, `NavigationMenuList`, `NavigationMenuItem`,
`NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuIndicator`,
`NavigationMenuViewport`, `navigationMenuTriggerStyle`) plus **`NavigationMenuSub`** (Radix's Sub, which stock does not
export: a nested list that shows one item's content at a time, as tabs; `value` / `defaultValue` / `onValueChange`,
`orientation`). No strings.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Trigger | 36 px, 16 px side padding, `--background` fill, 50 % accent while open, 3 px ring, chevron | 0.25 × 0.625 rem padding, 14 px medium on 21 px, 6 px radius, no fill at rest, `--accent` on hover / focus / open, 1 px `--ring` outline 2 px away on keyboard focus, a row also on a link, **no chevron** | The visual target's trigger buttons (resolved CSS, live demos); the outline because triggers are tab stops. |
| Panel | `p-2 pe-2.5`, viewport `mt-1.5 shadow` | `p-1`, viewport `mt-1 shadow-md` (6 px radius, 1 px edge); without the viewport, the same under its trigger | The target's menu surface. |
| Link | `p-2`, 16 px icons, 3 px ring | menu row: 0.25 × 0.625 rem, 14 / 21 px, 4 px radius, `--accent` on hover / focus, 14 px icons in `--control-hover`; 1 px outline on keyboard focus outside a panel | The target's menu items. |
| Motion | stock classes | plus `data-bui-motion="overlay"` on the content and the viewport | The theme sets timing, exit and reduced motion. |
| RTL | physical `left-0`, `pr-2.5` | `start-0`, logical padding | RTL. |
| Viewport wrapper | no slot | `data-slot="navigation-menu-viewport-wrapper"` | Every element carries a data-slot. |
| Sub | not exported | `NavigationMenuSub` | The target's *Submenus* demo. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | triggers in a row | `nav` > `ul`; trigger `aria-expanded="false"` | Basic | renders a navigation of disclosure buttons and links |
| open | trigger `--accent`; panel in the viewport | `aria-expanded="true"`, `data-state="open"` | Basic | opens and closes a panel with Enter |
| no viewport | panel under its trigger | `data-viewport="false"` | Icons | shows the panel in the shared viewport, or under its trigger without it |
| current page | link `--accent` at 50 % | `aria-current="page"`, `data-active` | — | marks the current page link |
| submenu | one area's links beside the vertical list | `data-orientation="vertical"` on the sub | Submenus | shows one area of a submenu at a time, as tabs do |
| mega menu | a wide grid of grouped links | — | Mega menu | — |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Next trigger or link; from an open trigger into its panel | APG Disclosure navigation |
| Enter, Space | Toggle a panel; follow a link | APG Disclosure navigation |
| ↓ | Into the open panel | Radix |
| → / ← | Along the row (mirrored in RTL) | APG Disclosure navigation (optional keys), Radix |
| Home / End | First / last in the row | APG Disclosure navigation (optional keys), Radix |
| Escape | Close, focus back to the trigger | APG Disclosure navigation |

**For the owner's decision:** the trigger has no chevron, as the visual target; stock has one and it is a useful cue.
**Notes:** the panels render inline (not portalled), so a docs example reserves height for them; with the shared
viewport a panel is aligned to the menu's start edge.

## Order list

**Status:** built (0.1.1) · **Stock:** none: built on plain elements to the APG listbox pattern, with the library's
`Button`, `Checkbox` and `InputGroup`; dragging through `@dnd-kit/core` and `@dnd-kit/sortable` (peers).
**Pattern:** APG Listbox <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/> (multi-select, recommended selection
model) and its rearrangeable example <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/>
· **Completeness references:** Base UI has none; React Aria ListBox with `useDragAndDrop`
<https://react-aria.adobe.com/ListBox> (keyboard drag, drop announcements); dnd kit's sortable preset with its
KeyboardSensor; the visual target's order list (Basic, Drag Drop, Placeholder, Checkbox).

**API:** `OrderList<T>` — `value?` / `defaultValue` / `onValueChange(items)` (the items in order), `getItemKey?` (string
itself, else `id`, then `value`), `getItemLabel?` (string, else `label`, `name`, `title`), `renderItem?(item, { index,
selected, dragging })`, `selected?` / `defaultSelected` / `onSelectedChange(keys)` (keys in list order), `header?`
(names the list), `controls` ("start" | "end" | "none"), `draggable`, `dragHandle`, `filter`, `filterValue?` /
`onFilterValueChange`, `filterPlaceholder?`, `indicator` ("none" | "checkbox"), `selectAll`, `empty?`, `disabled`,
`listClassName?`, `aria-label` / `aria-labelledby` / `aria-describedby` / `aria-invalid` (to the list), and `div` props on
the root. `OrderListGroup` — `children`: OrderLists that share one drag context, so items drag between them (PickList is
built on it). `moveItems(items, keys, move, getItemKey?)` — the same up / down / top / bottom move as a pure function.
Types `OrderListMove`, `OrderListItemState`, `OrderListProps`. Parts: `order-list` (`data-controls`, `data-disabled`),
`order-list-header`, `order-list-controls`, `order-list-move`, `order-list-frame` (`data-drop-target`),
`order-list-toolbar`, `order-list-select-all`, `order-list-filter`, `order-list-viewport`, `order-list-list`,
`order-list-item` (`data-selected`, `data-highlighted`, `data-dragging`, `data-draggable`, `data-drop`),
`order-list-handle`, `order-list-checkbox`, `order-list-item-content`, `order-list-empty`, `order-list-drag-preview`,
`order-list-status`. No `size`: the list follows Listbox, which has none. Strings: `moveUp`, `moveDown`, `moveToTop`,
`moveToBottom`, `itemMoved` ("{item} moved to position {position} of {total}"), `itemsMoved` ("{count} items moved; the
first is now at position {position} of {total}"), `dragHandle` ("Drag {item}"), `dragStarted`, `dragCancelled`; reuses
`selectAll`, `filterOptions`, `noItems`, `noResults`. Positions are formatted with `Intl.NumberFormat(locale)`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | 28 px secondary icon buttons 4 px apart, 8 px from a field-look frame (1 px `--control`, 6 px radius, `shadow-xs`); 29 px items, 2 px apart | `listbox` `aria-multiselectable="true"` of `option`s with `aria-selected`; buttons `aria-disabled` while nothing is chosen | Basic | is a multi-selectable listbox; marks every Move button unavailable while nothing is chosen |
| focused / highlighted | frame edge `--ring`; highlighted item `--accent` | `aria-activedescendant` on the list | Basic | focus highlights the first chosen item, else the first |
| chosen | `--highlight` fill, `--highlight-focus` while highlighted | `aria-selected="true"` | Basic | chooses and un-chooses with Space; Shift ranges; Control and A |
| moved | items reorder; polite announcement | `role="status"` "X moved to position 2 of 8" | Basic | moves the chosen items with Alt and the arrows / the buttons, and says so |
| dragging | lifted copy on `--popover` with `shadow-md`; its place at 50 %; items make room at `--bui-duration-base` | sensors: mouse (4 px), touch (250 ms hold), keyboard (Enter) | Drag and drop | picks up with Enter, moves with the arrows, drops with Space; Escape puts it back |
| drag handle | a 14 px grip at the item's start; only it starts a pointer drag | grip `aria-hidden`, `title` "Drag {item}" | Drag handle | shows a grip named for its item, hidden from assistive technology |
| checkbox | an 18 px drawn checkbox per item, `--primary` once chosen; "Select all" box above | header `checkbox` "Select all", mixed when some are chosen | Multiple selection with checkboxes | a click toggles; Select all chooses every item or none |
| filtered | a filter field in the header (8 px 14 px 2 px) | field named "Filter options", `aria-controls` the list | Filter | filters the items in view; moves leave the hidden ones in place; ArrowDown to the list |
| empty | "No items" (or `empty`) in `--muted-foreground` over the empty list | the list's `aria-describedby` points at it | Empty placeholder | says when it has no items, with the provider text or `empty` |
| disabled | `--field-disabled` frame, muted items, buttons at 60 % | list `aria-disabled`, `tabindex="-1"`; buttons `disabled` | Disabled | is greyed, unchangeable and out of the tab order |
| invalid | `--invalid` edge (`--ring` while focused) | `aria-invalid` on the list | Invalid | passes aria-invalid and aria-describedby to the list |
| controlled | — | — | Basic | follows a controlled value; keeps it until the value changes |
| strings | provider names and announcements | — | — | reads its names and announcements from the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| ↓ / ↑ | Next / previous item, stopping at the ends | APG Listbox |
| Home / End | First / last item | APG Listbox |
| Space | Toggles the highlighted item | APG Listbox (multi-select) |
| Shift + ↓ / ↑ / Home / End | Moves the highlight and chooses from the anchor to it | APG Listbox (recommended model, extended) |
| Shift + Space | Chooses from the anchor to the highlighted item | APG Listbox |
| Ctrl / ⌘ + A | Chooses every item in view, or none when all are | APG Listbox |
| Alt + ↑ / ↓ | Moves the chosen items (or the highlighted one) one place | Rearrangeable listbox (own keys, documented) |
| Alt + Home / End | Moves the chosen items to the top / bottom | Own keys, documented |
| Enter | With `draggable`, picks the highlighted item up; then ↑ ↓ (← → into another list of the group) move it, Space / Enter / Tab drop it, Escape cancels | dnd kit KeyboardSensor (start key Enter, as Space chooses) |
| A–Z | Type-ahead | APG Listbox |
| ↓ (filter field) | Moves the focus to the list | Own |

**Notes.** The visual target's demos are copied: the buttons are its small secondary icon buttons in a column at the
list's top, 8 px away; items are Listbox's options; the "Drag Drop" lift and the "Placeholder" clone become one look (a
lifted copy and the item's place at half strength). dnd kit's keyboard sensor starts on Enter, not its default Space,
because Space chooses in a listbox; its English announcements and pick-up instructions are replaced by the provider's
strings in one polite live region shared by every move. Drag handles are not focusable, since a listbox option may hold no
focusable content (axe nested-interactive); the keyboard drag starts from the list. Unavailable Move buttons are
`aria-disabled`, so a move that empties a button's work never drops the focus. The empty message sits over the list, not
in it, because a listbox may hold only options. A pointer drag moves one item; the buttons and Alt keys move the whole
choice.

### Behaviour details

Notes: every item is in the page. Items are memoised and the list's handlers keep their identity, so a key press redraws
only the items whose state changed (the highlight's old and new item, a newly chosen item, the moved items). Choosing
every item, and any move in a draggable list (dnd kit's sortable context changes), redraws them all. A list that cannot
be dragged gives dnd kit no ids. Measured with 5,000 items in Chromium (development build): ↓ 193 ms → 12 ms; Space
194 ms → 12 ms; Alt and ↓ (not draggable) 15 ms. Test: "redraws only the items a key press changes in a long list".

### Behaviour details

- **Overlays.** While an item is dragged (keyboard or pointer), Escape is claimed in the window's capture phase
  (`preventDefault`, no `stopPropagation`): a surrounding Radix `Dialog`, `Sheet` or `Popover` leaves it alone and dnd
  kit cancels the drag. With nothing dragged, Escape is the overlay's again. Test: "works inside a dialog…".
- **Drag preview.** `DragOverlay` is portalled to `document.body` once hydrated (`useSyncExternalStore`), so a
  transformed ancestor (the dialog's centring translate) does not shift its fixed position; the preview is
  `aria-hidden` (the live region says where the item is).
- **Announcements.** Each new place of a dragged item is read once, its own place included: picked up at 1, moved to 2,
  back over itself is "moved to position 1 of 4".
- **Disabled.** A press on a disabled list neither focuses it nor shows a highlight.
- **Performance.** The sortable ids are one array while the items in view are unchanged (and each option's sortable
  `data` is memoised), so dnd kit's per-item copy of the ids after it runs only when the items in view change: a highlight move in
  a 2,000-item draggable list copies 20 array elements. Re-rendering stays linear in the items; thousands
  of items remain a documented limit.

| Key | Behaviour | Source |
| --- | --- | --- |
| Escape (while dragging, inside an overlay) | Puts the item back; the overlay stays open | dnd kit + window capture claim |

## Overlay badge

**Status:** built (0.1.1) · **Stock:** none: built on Badge.
**Pattern:** none in the APG (a decorated element with a description; WAI-ARIA `aria-describedby`
<https://www.w3.org/TR/wai-aria-1.2/#aria-describedby>) · **Completeness references:** MUI Badge
<https://mui.com/material-ui/react-badge/> · Mantine Indicator <https://mantine.dev/core/indicator/>

**API:** `OverlayBadge` — `children` (one element: an icon, a button, an avatar), `label: string` (required: the badge in
words), `count?`, `max?`, `dot?`, `severity?`, `size?` (passed to `Badge`), `className` and the other `span` props on the
wrapper. Parts: `overlay-badge` (wrapper), `overlay-badge-badge`, `overlay-badge-label`.

**How it is announced.** The drawn badge is `aria-hidden`. `label` is a visually hidden text with an id; the child gets
`aria-describedby` with that id (merged with its own). Once mounted, the wrapper checks whether the child takes focus: a
focusable child (button, link, field, `tabindex`) is described by the label and the label is `hidden`, so it is read
once, on focus ("Delivery alerts, button, 3 failed deliveries"); any other child (an icon, an avatar) leaves the label
readable after it in the page.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| count on an icon | a 20 px count on the top-end corner, moved half its size out (translate 50 %, −50 %), a 2 px `--card` ring | badge `aria-hidden`; label in the flow | Icon | reads the label after a child that cannot take focus |
| count on a button | as above | button `aria-describedby` → label; label `hidden` | Dot | describes a focusable child with its label and reads the label once |
| on an avatar | as above | label in the flow | Avatar | reads the label after a child that cannot take focus |
| dot | an 8 px dot on the corner | badge `data-kind="dot"` | Dot | draws a dot instead of the count |
| max | `99+` | badge `data-count` keeps the real number | Max | passes count, max, severity and size to a badge hidden from assistive technology |
| right to left | the badge on the top-left corner | `rtl:` translate | Icon (`?dir=rtl`) | passes count, max, severity and size to a badge hidden from assistive technology |
| child's own description | kept, the label after it | `aria-describedby="hint <label id>"` | — | keeps the child's own description beside the label |

| Key | Behaviour | Source |
| --- | --- | --- |
| — | None of its own: the wrapped element keeps its keys | — |

**Notes.** The ring is `--card` (white / `#0f172a`), as the visual target's. Until the page has mounted, the label is
read beside a focusable child too. A changing count is not announced.

### Behaviour details

`aria-describedby` points at the label only when the child is focusable (checked after mount); any other child has the label read after it, and is not also described by it. Test: does not also describe a child that cannot take focus.

## Page header

**Status:** built (0.1.1) · **Stock:** none: built on plain elements, the library's Button and DropdownMenu, and a
container query.
**Pattern:** HTML headings; APG Menu Button for the folded actions <https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/>
· **Completeness references:** Primer PageHeader, Atlassian Page header, Polaris Page.

**API:** `PageHeader` (grid, `@container/page-header`), `PageHeaderBreadcrumb` (full width, above), `PageHeaderHeading`
(title line, min 36 px), `PageHeaderTitle` (`as?: "h1"…"h6"`, default `h1`; 20/30 semibold), `PageHeaderMeta` (badges,
avatars, date; 14 px muted), `PageHeaderDescription` (14/21 muted), `PageHeaderActions` (`collapse?: "auto" | "always" |
"never"`; at the end of the title line), `PageHeaderAction` (Button props + `onSelect?`, `icon?`, `pinned?`; default
variant `outline`, `default` when pinned). Below 36rem of the header's width (`@max-xl`) the unpinned actions fold into a
"More actions" DropdownMenu (icon button, `moreActions`); pinned actions stay buttons. Parts: `page-header`,
`page-header-breadcrumb`, `page-header-heading`, `page-header-title`, `page-header-meta`, `page-header-description`,
`page-header-actions`, `page-header-action-list`, `page-header-more`, `page-header-action`. Strings: `moreActions`
(existing).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | title + description | `h1` | Basic | renders the title as the page heading, with breadcrumb, meta and description |
| heading level | — | `as` | — | takes another heading level with as |
| breadcrumb | breadcrumb above | `nav` landmark | With breadcrumb | (first test) |
| actions | buttons at the end of the title line | — | With actions | runs an action with Enter and with Space |
| meta | badge, avatars, date beside the title | — | With meta | (first test) |
| narrow | unpinned actions in "More actions" | menu button `aria-haspopup="menu"`; destructive item `data-variant` | Narrow | folds the unpinned actions into a “More actions” menu that the arrows move through |
| menu closing | — | focus back to the menu button | — | closes the menu with Escape and returns focus to its button |
| collapse | never / always | — | — | keeps a pinned action out of the menu, and decides once with collapse |
| with tabs | Tabs after the header | — | With tabs | — |
| strings | — | — | — | names the menu button from the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter / Space | Runs the focused action, or opens the menu | APG Button / Menu Button |
| ↓ / ↑ | Between the menu's items | APG Menu (Radix) |
| Escape | Closes the menu, focus to its button | APG Menu Button (Radix) |

**Notes.** Both the action row and the menu button are rendered; the container query shows one. Only
`PageHeaderAction`s fold.

### Behaviour details

**Folding.** Only `PageHeaderAction`s leave for the "More actions" menu: below 36rem each unpinned action hides on its
own (`@max-xl/page-header:hidden`), and with `collapse="always"` the unpinned actions are not rendered, while any other
child of `PageHeaderActions` stays where it is. An icon-only action's menu item shows its `aria-label` as its text.
**Many actions.** `PageHeaderActions` is at most `60cqi` of the header wide and wraps past that, so the title keeps at
least 40%. With a description, the actions span the title and description rows (`row-end: span 2`) and the description's
row is `1fr`, so actions taller than the title push no space between the title and the description.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| other elements among the actions, narrow | the element stays; actions in the menu | — | — | keeps elements that are not actions visible at every width, and folds only the actions |
| many actions | actions wrap within 60% | — | — | caps the actions at 60% of the header and lets them span the description’s row, so many actions wrap |
| icon-only action folded | menu item named by `aria-label` | `menuitem` name | — | names an icon-only action in the menu by its aria-label |

## Panel

**Status:** built (0.1.1) · **Stock:** none: built on Radix Collapsible (the Card's surface, the visual target's panel)

**Pattern:** WAI-ARIA APG Disclosure <https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/> (the toggle) ·
**Completeness references:** Radix Collapsible <https://www.radix-ui.com/primitives/docs/components/collapsible> · Base UI
Collapsible <https://base-ui.com/react/components/collapsible> · React Aria Disclosure
<https://react-aria.adobe.com/Disclosure>; the visual target's panel page (Basic, Toggleable, Controlled, Indicator,
Template)

**API.** `Panel` (`data-slot="panel"`; `toggleable`, `open` / `defaultOpen` (true) / `onOpenChange`, `disabled`; with
`toggleable` it is the Collapsible root and carries `data-state` and `data-toggleable`), `PanelHeader` (`panel-header`),
`PanelTitle` (`panel-title`, a `div`, `asChild` for a heading), `PanelActions` (`panel-actions`), `PanelTrigger`
(`panel-trigger`, the Collapsible trigger, `indicator`; renders nothing unless the panel is toggleable), `PanelContent`
(`panel-content`, the Collapsible content when toggleable, `forceMount`), `PanelFooter` (`panel-footer`; outside the
content it stays in view when folded, inside it folds with it). String: `toggleContent` ("Show or hide {title}"), filled
with the title's text content.

**Look.** `--card` surface, 1 px `--border` edge, 6 px radius, no shadow. Header 16 px padding, 53 px tall; title 14 px
semibold on 21 px. Content 0 16 px 16 px, 14 px on 20 px. Toggle: a 14 px chevron in a 24 px round target pulled into the
header's padding (`-my-1 -me-1.5`), `--accent` circle under the pointer; the chevron turns 180° when open. Content height
animates from `--radix-collapsible-content-height` (tw-animate's `collapsible-down/up`, as the accordion).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| static | header and content, no toggle | — | Basic | renders a header, title and content, with no toggle unless toggleable |
| open | content shown, chevron up | toggle `aria-expanded="true"`, `aria-controls` → content; `data-state="open"` | Toggleable | names the toggle from the title and ties it to the content |
| closed | header only (53 px), chevron down | `aria-expanded="false"`; content removed | Toggleable | shows and hides the content with Enter / with Space; starts closed with defaultOpen={false} |
| controlled | follows `open` | — | Controlled | follows a controlled open state and reports changes |
| custom indicator | the given icon(s) | indicator `aria-hidden` | Custom indicator | replaces the chevron with a custom indicator, hidden from assistive technology |
| header actions | buttons before the toggle | consumer-named | Header actions | — |
| footer | footer outside content stays; inside folds | — | Footer | keeps a footer outside the content in view when closed, and folds one inside it |
| disabled | toggle at 60 % | toggle `disabled` | Disabled | disables the toggle with disabled |
| focus-visible | 1 px `--ring` outline 2 px outside the 24 px circle | — | Toggleable | — |
| heading title | title as `h2`/`h3` | heading role | — | renders the title as a heading with asChild |
| strings | translated toggle name | — | — | takes the toggle name from the provider strings |

Rows not applicable: invalid, loading, read-only, sizes.

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | On the toggle: shows or hides the content | APG Disclosure |

**Notes.** The visual target's trigger is a bare 14 px icon; ours keeps the icon and adds a 24 px target for WCAG 2.5.8
without changing the header's height. The toggle's name is computed from the title's text after mount (an effect), so the
server render names it with the bare template until hydration; `aria-label` overrides it.

### Additions

`PanelTrigger` is named by `aria-labelledby`: hidden spans with the `toggleContent` words before and after `{title}`, and
the title's id (generated by `Panel`, or `PanelTitle`'s own `id`). Tests "keeps the title where the translation puts it",
"names the toggle after the title from the first render …", "follows a title id of your own". Fieldset needs no change:
its toggle is the legend's text.

### Behaviour details

`forceMount` on `PanelContent` keeps the folded content in the page and hides it (`hidden`) once the closing slide ends;
Panel holds its open state for this. Without `forceMount`, Radix still removes the folded content. Test: keeps
force-mounted content in the page while folded, hidden, with what was typed.

## Pick list

**Status:** built (0.1.1) · **Stock:** none: built on `OrderList` and `OrderListGroup` (so on the APG listbox pattern and
dnd kit) with the library's `Button`.
**Pattern:** two APG Listboxes <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/> with buttons between them ·
**Completeness references:** Base UI has none; React Aria's drag between lists <https://react-aria.adobe.com/ListBox>
(`useDragAndDrop` across ListBoxes); the visual target's pick list (Basic, Drag Drop, Placeholder, Checkbox).

**API:** `PickList<T>` — `source?` / `defaultSource` / `onSourceChange(items)`, `target?` / `defaultTarget` /
`onTargetChange(items)`, `getItemKey?`, `getItemLabel?`, `renderItem?(item, { index, selected, dragging, list })`,
`sourceHeader?` / `targetHeader?` (name the lists; else the provider's `sourceList` / `targetList`), `orderControls`
(true), `draggable`, `dragHandle`, `filter`, `filterPlaceholder?`, `indicator`, `selectAll`, `sourceEmpty?` /
`targetEmpty?`, `disabled`, `listClassName` ("h-60"), and `div` props on the root. `transferItems(from, to, keys,
getItemKey?)` — moves the keyed items to the end of the other array. Types `PickListProps`, `PickListItemState`. Parts:
`pick-list` (a `@container/pick-list`), `pick-list-layout`, `pick-list-transfer`, `pick-list-move`, `pick-list-status`,
and each list's `order-list` parts (`data-list="source"` / `"target"` on its root). Strings: `moveToTarget`,
`moveAllToTarget`, `moveToSource`, `moveAllToSource`, `sourceList`, `targetList`; reuses OrderList's.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | source buttons, source list, four transfer buttons, target list, target buttons, 12 px apart; lists 240 px tall | two named `listbox`es; transfer buttons `aria-disabled` while they have nothing to move | Basic | renders two named multi-selectable listboxes with buttons between them; names them Source and Target without headers |
| transferred | moved items at the end of the other list; polite announcement | `role="status"` "Amy Elsner moved to position 1 of 1" | Basic | Move to target / Move all / Move to source, with clicks, Enter and Space |
| reordered | each list's own buttons and Alt keys | as OrderList | Basic | puts each list in order with its own Move buttons; Alt and the arrows inside each list |
| dragging across | the other list's edge `--ring`; a 2 px `--primary` line where the item will land | keyboard: Enter, ← / →, Space | Drag and drop | drags an item into the other list from the keyboard; the focus follows the item |
| checkbox | checkboxes and a Select all box in each list | as OrderList | Checkboxes | draws checkboxes and a Select all box in each list |
| filtered | a filter field above each list; Move all moves the items in view | as OrderList | Filter | moves only the items in view with a filter |
| empty | "No items" or `sourceEmpty` / `targetEmpty` | the list's description | Empty placeholders | says when a list is empty |
| stacked | below 576 px of room: lists stacked, transfer buttons in a row, arrows turned down / up | — | (any, narrow) | — (CSS container query) |
| RTL | source on the right; transfer arrows mirrored | names unchanged | — | keeps the same names in a right-to-left page |
| disabled | both lists and every button greyed | buttons `disabled`, lists `aria-disabled` | Disabled | disables both lists and every button |
| controlled | — | — | Basic | follows controlled lists and reports each move |
| strings | provider names | — | — | reads its button names and announcements from the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| ↓ ↑ Home End Space Shift Ctrl/⌘+A A–Z | As OrderList, in each list | APG Listbox |
| Alt + ↑ / ↓ / Home / End | Moves the chosen items within their list | Own keys (OrderList) |
| Enter | With `draggable`, picks the highlighted item up; ↑ ↓ move it in its list, ← → take it to the other list, Space / Enter drop it, Escape cancels | dnd kit KeyboardSensor |
| Enter / Space (transfer button) | Moves the chosen items, or every item in view, to the end of the other list | Button |
| Tab | Source buttons, source list, transfer buttons, target list, target buttons | DOM order |

**Notes.** The visual target centres both button columns on the whole block; here they centre on the list frames (the
transfer column drops by the header's height), so the three columns line up. Transfer labels are direction-neutral
("Move to target"), so only the arrows mirror in RTL. A keyboard drag into the other list lands before the item it is
over (dnd kit's keyboard coordinates find no droppable below the last item); to land last, drop and press Alt + End, or
use the transfer buttons, which always append. Transfers clear the source list's choice. The transfer announcements are
the pick list's own polite region; drags and in-list moves use the group's.

### Behaviour details

Notes: the chosen keys are checked through a `Set`, and the `renderItem` passed to each list is memoised on the pick
list's own `renderItem`, so a choice redraws one item. Measured with 5,000 items: Space 207 ms → 16 ms. Test: "redraws
only the item a choice changes in a long list, then moves every chosen item".

### Behaviour details

- A transfer drops only the moved keys from the list's choice; chosen items the filter hides stay chosen. Test: "keeps chosen items the filter hides chosen…".
- Transfer buttons are keyed by a fixed id, not by their translated label.
- Inherits Order list's overlay, preview, announcement and performance fixes (it is two `OrderList`s in one
  `OrderListGroup`).

## Progress circle

**Status:** built (0.1.1) · **Stock:** none: built on the Radix Progress primitive, drawn in SVG · **Pattern:** ARIA
`progressbar` <https://www.w3.org/TR/wai-aria-1.2/#progressbar> · **Completeness references:** React Aria ProgressBar
(circular example) <https://react-aria.adobe.com/ProgressBar> · Base UI Progress
<https://base-ui.com/react/components/progress>

**Entry:** `@booleanpress/ui/progress-circle` · **Category:** Misc.

### API

`ProgressCircle` (one part), on `Progress.Root`:

| Prop | Type | Default | Meaning |
| --- | --- | --- | --- |
| `value` | `number \| null` | — | 0 to `max`; leave it out for the indeterminate ring |
| `max` | `number` | 100 | the top of the range |
| `size` | `"sm" \| "default" \| "lg"` | `"default"` | 24, 40 or 64 px, with a 3, 4 or 6 px ring (explicit only; an indicator, not a control) |
| `strokeWidth` | `number` | by size | the ring's thickness in px at its own size |
| `variant` | `"default" \| "success" \| "info" \| "warning" \| "destructive"` | `"default"` | the arc's colour: `--primary` or a plain status colour |
| `showValue` | `boolean` | `false` | the value in the middle (not at `sm`, nor indeterminate) |
| `getValueLabel` | `(value, max) => string` | `Intl` percent in the provider's `locale` | `aria-valuetext` and the text in the middle |
| `aria-label` / `aria-labelledby` | `string` | — | required: the types ask for one of the two |

### States

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| determinate | a `--border` track; the arc from the top, clockwise, round caps, in the text colour | `role="progressbar"`, `aria-valuemin/max/now`, `aria-valuetext`, `data-state="loading"`; the SVG `aria-hidden` | Basic | is a named progressbar with its value, min and max, and fills its arc to the value |
| named by text | — | `aria-labelledby` | With a label | is named by visible text with aria-labelledby |
| indeterminate | a quarter arc turning (`animate-spin`); still under reduced motion | no `aria-valuenow`, `data-state="indeterminate"` | Indeterminate | turns a quarter arc with no value, without aria-valuenow |
| value shown | the percentage in the middle: 10 px semibold (`default`), 12 px medium (`lg`), `--foreground` | the text `aria-hidden`; `aria-valuetext` carries it | With a label | writes the value in the middle with showValue, from getValueLabel when given, hidden from assistive technology |
| locale | "50 %" in German | `aria-valuetext` | — | formats the percentage in the provider’s locale |
| sizes | 24 / 40 / 64 px | `data-size`, the SVG `viewBox` in px | Sizes | takes the sm, default and lg sizes with their ring widths, and draws no value at sm |
| colours | `--success`, `--info`, `--warning`, `--destructive` arcs | `data-variant` | Colours | colours the arc with the status variants |
| complete | the full ring | `data-state="complete"` | — | is complete at the top of the range |
| right to left | the arc fills counter-clockwise from the top | (the SVG flipped before its quarter turn) | With a label (RTL) | — |

No keys: it takes no focus.

Notes: the arc is a `stroke-dasharray` circle; a new value slides with `transition-[stroke-dashoffset]` (Tailwind's
default duration, as `Progress`), and `theme.css` ends it under reduced motion. At 0 the arc is hidden so its round cap
does not show as a dot. It is not a live region; announce milestones in the page.

### Behaviour details

The same clamping as Progress. Test: clamps a value outside the range and repairs a bad max, without a console error. A missing name stays a type error (the props union); there is no runtime fallback name.

## Rating

**Status:** built (0.1.1) · **Stock:** none: built on Radix RadioGroup.
**Pattern:** APG Radio Group <https://www.w3.org/WAI/ARIA/apg/patterns/radio/> · **Completeness references:** MUI Rating
<https://mui.com/material-ui/react-rating/> (radios, `role="img"` when read only); React Aria and Base UI have none.

**API:** `Rating` — `value?: number`, `defaultValue = 0`, `onValueChange(number)`, `max = 5`, `allowHalf`, `readOnly`,
`disabled`, `size?: ControlSize` (14 / 16 / 20 px stars), `icon`, `emptyIcon`, `orientation`, `name`, `required`,
`aria-label` / `aria-labelledby`, and Radix RadioGroup root props. Parts: `rating`, `rating-item` (`data-state` full |
half | empty), `rating-icon`, `rating-empty-icon`, `rating-radio`. New string: `ratingValue` = "{value} of {max}".

**Why radios, not a slider:** a screen reader hears each star as "3 of 5, radio button, 3 of 5", the choice is discrete,
the reference itself uses hidden radios, and Radix gives roving focus, RTL arrows and form submission for free; a slider
would announce a bare number and needs a value-text string anyway.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | 16 px stars, 4 px gap; unchosen `--muted-foreground` outline, chosen `--primary` fill; hovered star `--primary` | `role="radiogroup"`; one `role="radio"` per star named "n of max" | Basic | renders a named radio group of stars, each named out of five, with the rating checked |
| half | start half filled (clip-path, mirrored in RTL) | two radios per star (half covers the start half, whole the end half) | Half stars | splits each star into a half and a whole with allowHalf |
| controlled | follows `value` | — | Controlled | is controlled by value |
| max | `max` stars | names "n of max" | Number of stars | draws max stars, each named out of max |
| custom icon | `icon` / `emptyIcon` | icons `aria-hidden` | Custom icon | draws custom icons for chosen and unchosen stars |
| read only | same stars, no pointer | single `role="img"` named "{aria-label} {value} of {max}"; no tab stop | Read only | shows a read-only rating as one image named with the value, out of the tab order; names a read-only rating through aria-labelledby with its value |
| focus | 1 px `--ring` outline 2 px round the star | — | — | moves to the chosen star with Tab |
| disabled | 60 % opacity | radios `disabled`, no tab stop | Disabled | ignores clicks and keys and leaves the tab order while disabled |
| sizes | 14 / 16 / 20 px | `data-size` | Sizes | sets data-size from its prop or the provider |
| strings | — | `ratingValue`, numbers via Intl in the provider locale | — | names its stars from the provider string, in the provider locale |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | To the chosen star, else the first | APG Radio Group |
| → / ↓ | Choose the next star, wrapping (→ reversed in RTL) | APG Radio Group (Radix) |
| ← / ↑ | Choose the previous star, wrapping | APG Radio Group (Radix) |
| Space | Choose the focused star | APG Radio Group |

**Notes.** A radio cannot be unchecked, so there is no keyboard way back to 0; reset from outside. Stars are 16 px;
use `lg` on touch screens.

### Additions

- `allowClear?: boolean` (default `true`). New string `ratingCleared` = "Rating cleared"; a polite `role="status"` span
  sits beside the radio group (not in it).

| Key | Behaviour | Source |
| --- | --- | --- |
| Space (checked star) | clears to 0 | the radio's click, handled before Radix's |
| Enter | chooses the focused star; on the checked star, clears to 0 | own handler (Radix ignores Enter) |
| Backspace / Delete | clears to 0 | own handler on the group |

Tests: "clears the rating when the chosen star is clicked again, and announces it", "clears the rating with Space …",
"… with Enter …", "… with Backspace and Delete", "keeps the rating with allowClear={false}", "says a cleared rating in the
provider string".

## Scroll top

**Status:** built (0.1.1) · **Stock:** none: built from React state on Button

**Pattern:** none in the APG (a plain button) · **Completeness references:** the visual target's ScrollTop (target window |
parent, threshold, icon, behavior) · Base UI and React Aria have none

**API.** `ScrollTop` (`data-slot="scroll-top"`; a Button minus `size`: `target` window | parent (default window),
`threshold` (400 px), `behavior` smooth | auto (smooth), `icon`, Button's `variant` / `severity`; `data-state` open |
closed, `data-target`). With `target="parent"` it renders a hidden `scroll-top-anchor` span to find the box it sits in.
String: `scrollToTop` ("Scroll to top").

**Look.** A 48 px round primary Button with a 24 px chevron; window: `fixed`, 20 px from the bottom and end edges, `z-40`;
parent: `sticky`, 20 px from the box's bottom, pushed to the end (`ms-auto`). Enters with the overlay fade
(`data-bui-motion="overlay"`: the theme's base duration), leaves with the exit fade (exit duration, last frame held), then
unmounts on `animationend` (a 400 ms timer covers browsers where no animation runs).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| hidden | nothing rendered | — | Window, Element | appears once the window scrolls past the threshold |
| shown | button in the corner | `data-state="open"`, name "Scroll to top" | Window, Element | appears once the window scrolls past the threshold |
| leaving | fading out, not operable | `data-state="closed"`, `aria-hidden`, `tabindex="-1"` | — | fades out and leaves once the window is back above the threshold |
| scrolling | smooth to the top; a jump under reduced motion | — | Window | scrolls the window back to the top, smoothly, with a click; jumps instead of scrolling smoothly under reduced motion |
| parent | sticky in the box; focus moves to the box (when it takes focus) | `data-target="parent"` | Element, Custom icon | watches and scrolls the box it is placed in with target="parent", then focuses the box |
| custom icon / strings | the given icon; translated name | — | Custom icon | shows a custom icon and takes its name from the provider strings |
| focus-visible | Button's outline | — | — | — |

Rows not applicable: disabled, invalid, sizes (set the size with `className`).

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space | Scroll the target to the top | native button |

**Notes.** The docs show the Window example in its own 360 px frame (`frameHeight`), so the fixed button sits in the
frame's corner, not over the documentation. The JS scroll checks `prefers-reduced-motion` itself, because `behavior:
"smooth"` overrides the theme's `scroll-behavior: auto`.

### Behaviour details

After activation with focus on the button, focus moves to the top of the target with `preventScroll`: a box that has a
`tabindex` is focused; a box without one, and the page's `body`, take `tabindex="-1"` and `outline: none` until they
blur. The next Tab starts from the top. Tests: moves focus to the top of the page as it leaves; focuses a box that cannot
take focus for the moment.

## Search field

**Status:** built (0.1.1) · **Stock:** none: built on the library's `InputGroup` and `Input`, in a `role="search"` form.
**Pattern:** WAI-ARIA search landmark <https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/examples/search.html> ·
**Completeness references:** React Aria SearchField <https://react-aria.adobe.com/SearchField> · Polaris and Carbon
search fields.

**API:** `SearchField`: `size?`, `variant?`, `loading?: boolean`, `onSearch?(value)`, and the input's attributes
(`value`, `defaultValue`, `onChange`, `placeholder`, `disabled`, `readOnly`, `id`, `aria-*`). `className` on the form.
The input is `type="search"` with `enterkeyhint="search"`, always `clearable`. Parts: `data-slot="search-field"` (form),
then `InputGroup`'s parts. String: `search` ("Search"), the name of the field and landmark when there is no
`aria-label`, `aria-labelledby` or `id`; the clear button reuses `clear`, the spinner `loading`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | a 14 px search icon 10 px in, the text 34 px in | `role="search"` form, `searchbox` | Basic | is a named searchbox inside a search landmark of the same name |
| unlabelled | — | named by `search` | — | takes the provider string as its name when it has no label |
| with text | the × at the end | `button` named by `clear` | Basic | shows a clear button while there is text, which empties the field and keeps the focus |
| loading | a 14 px spinner after the × | spinner `role="status"` named by `loading`; `aria-busy` on the input | Loading | shows a spinner named by the provider and marks the field busy while loading |
| results count | the app's status line | the app's `role="status"` | With results count | — |
| sizes, filled | InputGroup's | `data-size`, `data-variant` on the group | Sizes, Filled | sets its size and look on the group, the provider ones when it has none |
| disabled | `--field-disabled`; no × | `disabled` | Disabled | cannot be used when disabled, and has no clear button then |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter | submits: `onSearch(text)`, no page load | native implicit submission |
| Escape | empties the field (through `onChange`) and keeps the focus; on an empty field, blurs | React Aria SearchField |
| Tab | input, then the × while it shows | native order |

**Notes.** The browser's own cancel button and decoration are hidden. Escape's clearing prevents the browser's own clearing
of a search input, so it happens once. A form cannot sit inside another form; inside a Radix dialog, the dialog's
document-level Escape listener runs first and closes it.

### Behaviour details

**Landmark element.** The search landmark is a `div role="search"`, not a `form`. A `form` cannot hold a form: inside a
settings form (a WordPress options page is one form) React reported the nesting, and Enter in the field submitted
natively and reloaded the page. Enter is now handled on the input: it calls `onSearch` with the text and prevents the
default, so it never submits a form round the field; Enter that confirms input-method text (`isComposing`) is left
alone. With `name`, the text is submitted with a surrounding form.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| inside a form | as default | one `form` (the app's); the input belongs to it | — | works inside a form: Enter searches without sending the form, and the form submits the text under its name |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter | `onSearch(text)`; never submits a form round the field | React Aria SearchField |

## Segmented control

**Status:** built (0.1.1) · **Stock:** none: built on Radix RadioGroup.
**Pattern:** APG Radio Group <https://www.w3.org/WAI/ARIA/apg/patterns/radio/> · **Completeness references:** Radix Themes
SegmentedControl <https://www.radix-ui.com/themes/docs/components/segmented-control> (equal segments, transform-only
indicator), React Aria ToggleButtonGroup <https://react-aria.adobe.com/ToggleButtonGroup>.

**API:** `SegmentedControl` — `value?`, `defaultValue?`, `onValueChange(string)`, `size?: ControlSize` (12 / 14 / 16 px
text; 32 / 35 / 38 px tall), `fluid`, `disabled`, `name`, `required`, `dir`, `loop`, `aria-invalid`, and Radix
RadioGroup root props. `SegmentedControlItem` — Radix RadioGroup item props (`value`, `disabled`, `aria-label` for icon
only). Parts: `segmented-control`, `segmented-control-indicator`, `segmented-control-item`. No new strings.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | `--muted` bar (`--background` in dark) with a 1 px edge of its colour, 6 px radius, equal segments; chosen segment on a raised `--background` plate (`--muted` in dark) that slides by `translate` | `role="radiogroup"` of `role="radio"`; plate `aria-hidden` | Basic | renders a named radio group of segments with the chosen one checked and the highlight under it; draws no highlight while nothing is chosen |
| icons | 14 px icons, 8 px gap | — | With icons | — |
| icon only | — | segment `aria-label` | Icon only | names an icon-only segment with aria-label |
| sizes | 12 / 14 / 16 px text | `data-size` on bar and segments | Sizes | sets data-size on the control and its segments, from its prop or the provider |
| fluid | fills the container | — | Fluid | fills its container with fluid |
| focus | 1 px `--ring` outline 2 px outside the segment | — | — | moves to the chosen segment with Tab |
| disabled | bar `--field-disabled`, text `--field-disabled-foreground`; a lone disabled segment fills its cell grey | `disabled` | Disabled | disables every segment when disabled, and skips a disabled segment with the arrows |
| invalid | `--invalid` edge round the bar | `aria-invalid` on the radiogroup | Invalid | passes aria-invalid and its description to the group |
| RTL | order and slide mirrored | — | — | swaps ArrowLeft and ArrowRight, and the slide, in right-to-left pages |
| wrapped segments | each chosen segment draws its own plate | — | — | lets wrapped segments draw their own plate |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | To the chosen segment | APG Radio Group |
| → / ↓ | Choose the next segment, wrapping (→ reversed in RTL) | APG Radio Group (Radix) |
| ← / ↑ | Choose the previous segment, wrapping | APG Radio Group (Radix) |
| Space | Choose the focused segment | APG Radio Group |

**Notes.** Equal segments (the reference sizes them to content) are what lets the plate move by transform alone with no
measuring; the slide uses `--bui-duration-base` / `--bui-ease-standard` and stops under reduced motion (theme.css).

### Behaviour details

The sliding plate counts the children that render (`React.Children.toArray`), so a segment left out by a condition keeps
it; any child that is not a segment still turns it off. A form reset reports `""` for "nothing chosen" (Radix reports
`null`).

The segments stay equal (`minmax(0, 1fr)` columns, which the plate relies on). When the bar is narrower than
`segment count × widest segment`, a label of several words wraps, centred (`whitespace` normal, `text-center
wrap-break-word`), and a single word too long for its segment is clipped at the segment's end (`overflow-hidden
justify-center-safe`), instead of running over the next segment; with room, nothing wraps or clips and the bar is
unchanged (checked at 1000, 320 and 240 px).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| conditional segment | the plate still slides | `--segment-count` counts rendered segments | — | keeps the sliding highlight when a segment is left out by a condition |
| form reset | back to the first value | — | — | goes back to its first value when the form is reset, reporting "" when that was none |
| narrow bar | words wrap, a long word clips at the end, inside equal segments | — | Fluid (narrow viewport) | fills its container with fluid (the rules; widths in the browser) |

## Slider

**Status:** built (0.1.1) · **Stock:** shadcn `slider` (Radix Slider), with the patches in `PATCHES.md`.
**Pattern:** WAI-ARIA APG Slider <https://www.w3.org/WAI/ARIA/apg/patterns/slider/> and Multi-thumb slider
<https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/> · **Completeness references:** Base UI Slider
<https://base-ui.com/react/components/slider> · React Aria Slider <https://react-aria.adobe.com/Slider>

**API:** `Slider` (Radix Root: `value` / `defaultValue` / `onValueChange` / `onValueCommit`, `min`, `max`, `step`,
`minStepsBetweenThumbs`, `orientation`, `inverted`, `disabled`, `name`, `dir`) plus `size?: ControlSize` (default: the
provider's `controlSize`, set as `data-size`). `aria-label`, `aria-labelledby` and `aria-describedby` on the slider are
passed to its handles. New strings: `sliderMinimum` = "Minimum", `sliderMaximum` = "Maximum", `sliderValue` =
"Value {index} of {count}". Data slots: `slider`, `slider-track`, `slider-range`, `slider-thumb`.

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Handle | 16 px white circle, primary edge, 4 px ring on hover / focus | 20 px `--border` circle holding a 16 px `--background` knob with a hairline shadow, `--card` on hover; grab cursor | The visual target's handle. |
| Track | 6 px, `--muted` | 3 px, `--border`; range `--primary` | The target. |
| Sizes | one | `sm` 16 / 12 px handle, 2 px track; `default` 20 / 16 / 3 px; `lg` 24 / 20 / 4 px (CSS variables per `data-size`) | Package size scale. |
| Focus | 4 px ring | 1 px `--ring` outline 2 px outside the handle | The target. |
| Disabled | 50 % | 60 % | The target. |
| Vertical | at least 176 px | at least 100 px | The target (`min-height: 100px`). |
| Default handles | two (`[min, max]`) when no value is given | one (`[min]`), as Radix's own default | Avoids a hidden second handle. |
| Names | `aria-label` stays on the root (no role); Radix names range handles in English | the name moves to the handles; range handles add the provider strings | WCAG 4.1.2; no English inside components. |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| rest | track, range, handle | `role="slider"`, `aria-valuenow/min/max`, `aria-orientation` | Basic | renders one named handle with its value and bounds |
| hover | knob `--card` (visible in dark) | — | Basic | — |
| focus-visible | 1 px `--ring` outline 2 px away | — | Basic | — |
| range | two handles, named Minimum / Maximum | handle `aria-label` / `aria-labelledby` | Range | names a range’s handles Minimum and Maximum from the provider strings |
| vertical | vertical track | `aria-orientation="vertical"` | Vertical | is vertical with orientation |
| controlled | follows `value` | — | Controlled, With input | follows a controlled value and reports changes and commits |
| sizes | 16 / 20 / 24 px handles | `data-size` | Sizes | sets the size as data-size, from the prop or the provider |
| disabled | 60 %, handles out of the tab order | `data-disabled` | Disabled | ignores the keyboard and leaves the tab order while disabled |
| in a form | hidden input per value | `name` | — | submits its value in a form with name |

| Key | Behaviour | Source |
| --- | --- | --- |
| → / ↑ | +1 step (→ −1 in RTL) | APG Slider; Radix flips with `dir` |
| ← / ↓ | −1 step (← +1 in RTL) | APG Slider |
| Shift + arrow | 10 steps | Radix |
| Page Up / Page Down | ±10 steps | APG Slider |
| Home / End | min / max | APG Slider |
| Tab | next handle, then out | APG Multi-thumb slider |

**Notes:** Radix has no `aria-valuetext`, so the value is announced as a number; show the unit beside the slider (the
*Controlled* example formats it with `Intl.NumberFormat(useUiLocale().locale)`). Handles cannot be disabled one at a time.

## Speed dial

**Status:** built (0.1.1) · **Stock:** none: built from React state on Button and Tooltip

**Pattern:** WAI-ARIA APG Menu button <https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/> with a Menu
<https://www.w3.org/WAI/ARIA/apg/patterns/menubar/> of icon items · **Completeness references:** the visual target's speed
dial page (Basic, Linear, Circle, Semi Circle, Quarter Circle, Transition Delay, Template, Tooltip, Mask) · Material
Design FAB menu; Base UI and React Aria have none

**API.** `SpeedDial` (`data-slot="speed-dial"`; `open` / `defaultOpen` / `onOpenChange`; `type` linear | circle |
semi-circle | quarter-circle; `direction` up | down | left | right (line, semicircle) or up-left | up-right | down-left |
down-right (quarter), physical; `radius` (80, 120 for a quarter); `transitionDelay` (30 ms); `tooltipSide`; `mask`,
`maskClassName`; `data-state`, `data-type`, `data-direction`), `SpeedDialTrigger` (`speed-dial-trigger`, a 36 px round
Button: `severity` etc.; the plus turns 45° into a cross while open; children replace it), `SpeedDialContent`
(`speed-dial-content`, the `ul role="menu"`, `inert` while closed; wraps each child in `li role="none"`
`data-slot="speed-dial-item"` and places it), `SpeedDialAction` (`speed-dial-action`, a 28 px round secondary Button with
`role="menuitem"`, `tabIndex={-1}`; `label` (required: name and tooltip), `tooltip` (true), Button's `variant` / `size`).
Strings: `openActions` ("Open actions"), `closeActions` ("Close actions").

**Why a menu, not a disclosure of buttons.** The actions are commands on one object, as the visual target marks them
(`role="menu"`, `menuitem`). A menu keeps the dial one tab stop in the page however many actions it holds, gives arrow keys
along the fan, and has a defined open / close / return-focus contract. Icon-only items are named by `label` and show it in
a tooltip on hover and focus.

**Motion.** Transform and opacity only: each item grows from `scale(0)`, `opacity: 0` in its place over
`--bui-duration-slow` with `--bui-ease-standard`; items on an arc are placed with `translate` (CSS variables from the
centre: `calc(-50% + x px)`), not `top`/`left`. Opening staggers outward by `transitionDelay`, closing inward;
`motion-reduce:delay-0` and the theme's reduced-motion rule end both at once. The trigger's icon turns over
`--bui-duration-slow`. The mask fades over `--bui-duration-base`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| closed | the trigger only | trigger `aria-haspopup="menu"`, `aria-expanded="false"`, `aria-controls`; menu `inert`, `aria-labelledby` the trigger | Linear | renders a menu button whose closed menu is inert |
| open (pointer) | actions shown, cross icon | `aria-expanded="true"`, name "Close actions"; focus stays on the trigger | Linear | opens with a click, renamed, leaving focus on the trigger |
| open (keyboard) | first action focused, its tooltip shown | — | Linear | opens with Enter and Space, focusing the first action; opens with an arrow key on the trigger, focusing the first action |
| line | actions in a row / column, 8 px gap | menu `aria-orientation` | Linear, Directions, Labelled actions | moves along an upward line with ↑ (outwards) and ↓ (back), wrapping; moves along a line to the right with → and ← |
| arc | circle / semicircle / quarter | `--speed-dial-x/y` | Circle, Semicircle, Quarter circle | moves round a circle with ↓ and → on, ↑ and ← back; places the actions of a round layout with transforms only |
| stagger | entrances staggered | `--speed-dial-delay` | Transition delay | — |
| tooltip | label beside the action | Radix Tooltip | With tooltips | shows an action's label in a tooltip on focus |
| mask | `--mask` over the positioned container | mask `aria-hidden`, `data-state` | With mask | draws a mask while open that closes the actions when clicked |
| chosen | action runs, menu closes | focus to the trigger | — | runs an action with Enter, closes and returns focus to the trigger |
| dismissed | closes | Escape returns focus; Tab / outside press closes | — | closes with Escape and returns focus to the trigger; closes when Tab moves focus out, and on a press outside |
| controlled | follows `open` | — | — | follows a controlled open state and reports changes |
| strings | translated trigger names | — | — | names the trigger from the provider strings |

Rows not applicable: invalid, loading, sizes (the trigger and actions take Button's `size`).

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter, Space (trigger) | Toggle; opening focuses the first action | APG Menu button |
| Arrow keys (trigger) | Open with focus on the first action; when open, ↑/← to the last, ↓/→ to the first | APG Menu button |
| Arrow along the line | Away from the trigger: next; towards it: previous; wrapping. On an arc: ↓/→ next, ↑/← previous | APG Menu (adapted to the fan) |
| Home / End | First / last action | APG Menu |
| Enter, Space (action) | Run it; close; focus to the trigger | APG Menu |
| Escape | Close; focus to the trigger (also when a tooltip took the same press) | APG Menu |
| Tab | Close and move on | APG Menu |

**Notes.** Directions are physical (they do not flip in RTL), as the dial is placed physically. Clicking the trigger leaves
focus on it (no tooltip flash); keyboard opening moves focus in. An open tooltip handles Escape first (Radix marks it
handled); the menu still closes on the same press.

### Behaviour details

A linear `left`/`right` line reverses its flex direction under `rtl:`, so the actions run physically left or right in a
right-to-left page, matching the physical arrow keys and the documentation. Test: keeps left and right physical in a
right-to-left page.

## Splitter

**Status:** built (0.1.1) · **Stock:** shadcn `new-york-v4/resizable` (react-resizable-panels 4), renamed

**Pattern:** WAI-ARIA APG Window splitter <https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/> · **Completeness
references:** react-resizable-panels <https://react-resizable-panels.vercel.app> · React Aria has no splitter; the visual
target's splitter page (size, min/max, collapsible, nested, disabled)

**API.** `Splitter` (`data-slot="splitter"`, was `ResizablePanelGroup`), `SplitterPanel` (`splitter-panel`, was
`ResizablePanel`), `SplitterHandle` (`splitter-handle`, was `ResizableHandle`, with the inner `splitter-handle-grip`).
`Splitter`: the library's `GroupProps` (`orientation`, `disabled`, `defaultLayout`, `onLayoutChange`, `onLayoutChanged`,
`groupRef`, …), plus `data-orientation`. `SplitterPanel`: `PanelProps` (`defaultSize`, `minSize`, `maxSize`, `collapsible`,
`collapsedSize`, `panelRef`, …; numbers are pixels, strings percent or CSS units). `SplitterHandle`: `SeparatorProps` plus
`withHandle`. The stock source already used v4's API (`Group`, `Panel`, `Separator`); only the Group's
`aria-[orientation=vertical]:flex-col` was dead (v4's group renders no `aria-orientation` and sets `flex-direction` inline).

| Row | Stock | Boolean UI | Why |
| --- | --- | --- | --- |
| Names | `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle`, `resizable-*` slots | `Splitter`, `SplitterPanel`, `SplitterHandle`, `splitter-*` slots | The suite's name for the component |
| Frame | none | 1 px `--border` edge, 6 px radius, `--card` surface; a splitter inside a panel drops it | The visual target's frame; nested splitters read as one |
| Orientation hook | `aria-[orientation=vertical]:flex-col` on the group (never matched in v4) | `data-orientation` on the group | v4 renders no `aria-orientation` on the group |
| Focus | a ring around the whole bar | a 1 px `--ring` outline 2 px around a 24 px handle in the middle of the bar | The visual target's handle focus |
| Grip | 16 × 12 px box on `--border`, only with `withHandle` | the 24 px handle is always there (it carries the outline); with `withHandle` it is a 24 × 12 px `--card` box with a 1 px edge and a `--muted-foreground` grip icon | The visual target's handle size |
| Disabled | the group's `disabled` left the handles focusable, announced as operable | a disabled splitter disables its handles: `aria-disabled`, out of the tab order, 60 % opacity | WCAG 4.1.2 |
| RTL | the library has no RTL mode: drag and arrows move the wrong way in a right-to-left row | a horizontal splitter in an RTL page renders `dir="ltr"` with each panel `dir="rtl"` | Correct pointer and keys over mirrored order |

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | framed panels, 1 px `--border` bar | separator `role="separator"`, `aria-orientation`, `aria-valuenow/min/max`, `aria-controls` | Basic | renders two panels and a focusable separator that reports the first panel's size |
| vertical | stacked panels, horizontal bar | `aria-orientation="horizontal"` on the separator | Vertical | moves a vertical splitter with ArrowDown and ArrowUp, and ignores Left and Right |
| sizes | panels start at `defaultSize` | `aria-valuenow` | Sizes | — |
| min / max | the handle stops at the limits | `aria-valuemin`, `aria-valuemax` | Min and max | gives the first panel its smallest size with Home and its largest with End |
| collapsed | the panel folds to `collapsedSize` | `aria-valuenow` = collapsed size | Collapsible | collapses a collapsible first panel with Enter, and restores it with Enter again |
| focus-visible | outline around the 24 px handle | — | With handle grip | draws the grip with withHandle, and always keeps the 24 px handle that carries the focus outline |
| disabled | bars at 60 % | `aria-disabled="true"`, no `tabindex` | Disabled | takes a disabled splitter's handles out of the tab order and ignores the keys |
| nested | inner splitter without frame | — | Nested | drops the frame of a splitter nested in a panel |
| RTL | horizontal: source order left to right, RTL content | `dir="ltr"` on the group, `dir="rtl"` on panels | With handle grip (`?dir=rtl`) | lays a horizontal splitter out left to right in a right-to-left page; keeps a vertical splitter in the page direction |

Rows not applicable: invalid, read-only, loading, empty.

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowLeft / ArrowRight | Side-by-side panels: the panel before the handle shrinks / grows by 5 % | APG Window splitter |
| ArrowUp / ArrowDown | Stacked panels: the handle moves up / down by 5 % | APG Window splitter |
| Home | The panel before the handle to its smallest size | APG (optional) |
| End | The panel before the handle to its largest size | APG (optional) |
| Enter | Collapses a `collapsible` panel before the handle, or restores it | APG (optional) |
| F6, Shift+F6 | Focus to the next / previous handle in the splitter | react-resizable-panels |

Notes. The step (5 %) is the library's. Handles are named by the consumer (`aria-label` or `aria-labelledby`); no built-in
string. Hit area: the library's `resizeTargetMinimumSize` (10 px fine, 20 px coarse).

## Statistic

**Status:** built (0.1.1) · **Stock:** none: built on semantic HTML (a `dl` of one `dt` and its `dd`s).
**Pattern:** HTML description list (no APG widget pattern) · **Completeness references:** Ant Design Statistic
<https://ant.design/components/statistic>, Chakra Stat <https://www.chakra-ui.com/docs/components/stat> (label, value,
help text, up/down indicator), Atlassian MetricText; the look follows the visual target's meter-group template cards
(14 px muted label, 18 px bold value, 32 px icon circle, bordered 12 px card with 1.125rem padding).

**API:** `Statistic` — `label`, `value?: number | string | null`, `format` ("number" | "currency" | "percent" (a
fraction) | "compact"), `currency?` (ISO 4217, default "USD"), `formatOptions?` (laid over the format's), `trend?` ("up"
| "down"), `trendValue?` (a fraction, written as a percentage), `invertTrendColor`, `helpText?`, `icon?`,
`iconClassName?`, `loading`, `variant?` ("plain" | "card"; a group's by default), `size?: ControlSize` (16 / 18 / 24 px
value; provider default), `div` props. `StatisticGroup` — `variant` ("card" default | "plain"), a grid of
`repeat(auto-fit, minmax(12rem, 1fr))` with 1rem gaps. Numbers are written with `Intl.NumberFormat(useUiLocale().locale)`.
Parts: `statistic`, `statistic-label`, `statistic-value`, `statistic-help`, `statistic-trend` (`data-trend`),
`statistic-icon`, `statistic-group`. Strings: `trendUp` ("Up {value}"), `trendDown` ("Down {value}"); reuses `loading`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | 14 px `--muted-foreground` label over an 18 px bold `--foreground` value, tabular figures | `dt` + `dd` | Basic | pairs the label and the value in a description list |
| formats | 12,408 · €48,250.50 · 42.8% · 12.4K | — | Currency, Compact | formats the value in the provider's locale (de-DE); writes compact numbers as 12.4K…, lays formatOptions over the format |
| trend up / down | arrow and change in `--success-tag-foreground` (rise) or `--destructive-tag-foreground` (fall), swapped by `invertTrendColor`; help text after it | arrow and drawn change `aria-hidden`; sr-only "Up 12.4%" | Trend | says "Up"… in the success colour; says "Down"… and the other way round with invertTrendColor; takes the trend words from the provider |
| icon / card | 32 px circle at the end (`--secondary` or `iconClassName`); card: `--card`, `--border`, 12 px radius, shadow-sm, 1.125rem padding | icon `aria-hidden`; `data-variant` | With icon | draws a decorative icon, the card variant and the sizes |
| group | cards in a wrapping row | — | Group | makes the statistics in a StatisticGroup cards, unless they or the group say otherwise |
| loading | a `Skeleton` in place of the value; trend hidden | root `aria-busy`; value reads "Loading" | Loading | shows a placeholder and reads "Loading" while loading, marked busy |
| sizes | 16 / 18 / 24 px value | `data-size` | Sizes | (in the icon/card test) |

No keyboard rows: a statistic takes no focus.

**Notes.** The brief named `--success-strong` / `--destructive-strong` for the trend; `--success-strong` (#16a34a) is
3.29:1 on white and fails 1.4.3 for 14 px text (found by axe in the browser), so the trend uses the status-tag text
colours (#15803d 5.0:1, #b91c1c 6.5:1; light greens and reds in dark). The meaning of a direction is the consumer's:
colour marks good or bad, the words say only up or down.

### Behaviour details

- A numeric value is wrapped in `<bdi>` so its sign and currency stay in order on a right-to-left page; a string value is shown as it is.
- `Intl.NumberFormat` errors (a currency code it does not know) fall back to the plain number in the locale instead of throwing.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Negative number, RTL | `-$64.00`, minus in front | value inside `<bdi>` | — | isolates a written number |
| Unknown currency code | Plain number (`48,250.5`) | — | — | writes the number plainly |

## Stepper

**Status:** built (0.1.1) · **Stock:** none: built from React state, no primitive

**Pattern:** no APG pattern; an ordered list of buttons with `aria-current="step"` (WAI-ARIA 1.2 `aria-current`
<https://www.w3.org/TR/wai-aria-1.2/#aria-current>), arrow keys as between an accordion's triggers ·
**Completeness references:** the visual target's stepper and steps pages (Horizontal, Vertical, Linear, Steps Only,
Template) · Dice UI Stepper <https://www.diceui.com/docs/components/stepper> · React Aria has none

**API.** `Stepper` (`data-slot="stepper"`; `value` / `defaultValue` (1) / `onValueChange`, the current step's number;
`orientation` horizontal | vertical; `linear`), `StepperList` (`stepper-list`, the `ol`; arrow-key navigation),
`StepperItem` (`stepper-item`, the `li`; `step` (required), `completed` (default: step < value), `error`, `disabled`;
`data-state` active | completed | inactive, `data-error`, `data-disabled`), `StepperTrigger` (`stepper-trigger`, the
`button`), `StepperIndicator` (`stepper-indicator`, `aria-hidden`: the number via `Intl.NumberFormat(locale)`, a check when
completed, a cross on error; children replace them), `StepperTitle` (`stepper-title`), `StepperDescription`
(`stepper-description`), `StepperSeparator` (`stepper-separator`), `StepperContent` (`stepper-content`, `role="group"`
named by its step's button; `step`, defaulting to the enclosing item's; `forceMount`), `StepperPrevious`
(`stepper-previous`, secondary Button, `back`), `StepperNext` (`stepper-next`, Button, `next`, `finish` on the last step;
`event.preventDefault()` in `onClick` keeps the step). Strings: `stepOf` ("Step {current} of {total}"), `stepCompleted`
("Completed"), `stepError` ("Has errors"), `back` ("Back"), `finish` ("Finish"); reuses `next`.

**Look (the visual target's).** Item 6 px padding, 14 px to the separator; indicator 32 px circle, 2 px `--border` edge,
`--card`, 16 px medium on 32 px, `--muted-foreground` (`--primary` when current or completed), the two-layer shadow
`0 .5px 0 rgba(0,0,0,.06), 0 1px 1px rgba(0,0,0,.12)`; error `--invalid` edge and `--destructive-strong`. Title 14 px medium
`--muted-foreground`, current `--primary`, error `--destructive-strong`, truncated; description 12 px muted. Separator 2 px
`--border`, `--primary` after a completed step. Horizontal content 12 px 6 px 16 px; vertical: a 40 px column with the line
at 20–22 px beside the current step's content, shown only where content is open. Disabled (linear) steps at 60 %.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| current | number and title in `--primary` | `aria-current="step"`; name "Step 1 of 3 …" | Horizontal | renders an ordered list of step buttons, the current one marked aria-current="step" |
| inactive | muted | — | Horizontal | goes to a step with Enter and Space |
| completed | check, `--primary` line after | name ends "Completed"; `data-state="completed"` | With descriptions | marks the steps before the current one completed, with a check |
| error | red circle, cross, red title | name ends "Has errors"; `data-error` | Error state, Wizard | marks a step in error |
| linear-blocked | 60 % | `disabled` | Linear, Wizard | blocks later steps when linear, and Next moves on |
| vertical | content under its step | — | Vertical | moves with ↓ and ↑ when vertical, each step showing its content in its item |
| steps only | list, no content | — | Steps only | — |
| navigation buttons | Back disabled on step 1; Finish on the last | `disabled` | Linear, Wizard | disables Back on the first step and shows Finish on the last, which keeps the step; stays on the step when Next is prevented |
| controlled | follows `value` | — | Wizard | follows a controlled value and reports changes |
| strings | translated words | — | — | takes its words from the provider strings |
| focus-visible | 1 px `--ring` outline 2 px outside the button | — | Horizontal | — |
| RTL | mirrored; ← moves forward | — | (`?dir=rtl`) | reverses → and ← in a right-to-left page |

Rows not applicable: sizes, loading, read-only.

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Next step that can be chosen, then the content | native |
| Enter, Space | Goes to the focused step | native button |
| ArrowRight / ArrowLeft (ArrowDown / ArrowUp vertical) | Focus to the next / previous step, wrapping; reversed in RTL | as Radix Accordion's triggers |
| Home / End | First / last step that can be chosen | as Radix Accordion |

**Notes.** Every step stays a tab stop (as the accordion's triggers) so keyboard users meet each step without learning a
composite widget. Linear blocks only later steps (the visual target blocks every other step); earlier ones stay reachable.
The total in "Step x of y" comes from the items' registration after mount, so the server render says "of 0" in the
visually hidden text until hydration. A step change is not announced; moving focus into the new content is the consumer's.

### Additions

The step count is read from the `StepperItem`s written among the children while rendering, until the mounted items have
registered. Test "counts the steps while rendering, so the server HTML reads "Step 2 of 3" …" (`renderToString`).

### Behaviour details

When `StepperPrevious` disables while focused (Back on the first step), focus moves to `StepperNext`; when a
`StepperNext` the consumer disables has focus, focus moves to `StepperPrevious`; with neither, to the current step's
button. Both take a composed `ref`. Tests: hands focus to Next when Back disables on the first step; hands focus to Back
when a Next with focus is disabled.

## Tags input

**Status:** built (0.1.1) · **Stock:** none: built on plain elements and the library's `Chip`/`ChipGroup`; with
`suggestions`, the input is Base UI Autocomplete (`@base-ui/react/autocomplete`).
**Pattern:** no APG pattern for tags; the tags are a list of chips with APG Button remove actions, the suggestions APG
Combobox (list autocomplete) · **Completeness references:** React Aria TagGroup <https://react-aria.adobe.com/TagGroup>
· Mantine TagsInput <https://mantine.dev/core/tags-input/> · Chakra TagsInput <https://chakra-ui.com/docs/components/tags-input>

**API:** `TagsInput` — `value?: string[]`, `defaultValue?: string[]`, `onValueChange?: (value: string[]) => void`,
`delimiter?: string | string[]`, `allowDuplicates?: boolean` (default `false`), `max?: number`, `suggestions?: string[]`,
`tagIcon?: ReactNode | ((tag: string) => ReactNode)`, `size`, `variant`, `disabled`, `name` (one hidden input per tag),
`className` (the field), other `input` props (`id`, `placeholder`, `aria-*`) to the input. Parts: `tags-input`,
`tags-input-tags` (the `ChipGroup`), `chip`, `tags-input-input`, `tags-input-content`, `tags-input-list`,
`tags-input-suggestion`. Strings: `removeItem` (the Chip's), `suggestions` (the list's name).

**Why plain elements and Chip, not Base UI Combobox `multiple`:** the core of a tags input is free entry — any text,
trimmed, refused when duplicate or over `max`, split on delimiters and on paste. Base UI Combobox values must be options
(free entry needs a synthetic "create" option per keystroke), and its chip remove buttons are out of the tab order. The
library's `Chip` gives each tag a named, focusable remove button with Backspace / Delete, and the field stays a plain text
input that screen readers announce as such. Base UI is used only where it fits: the optional suggestion list.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| empty | Input's field look, 35 px, placeholder | text `input` | Invalid | — |
| with tags | Chips (28 px pills) 3 px from the edge, the input after them; wraps to more rows | `role="list"` of `role="listitem"` chips; remove buttons named "Remove {label}" | Basic | adds the typed text as a tag on Enter and empties the input |
| delimiter | — | — | Delimiter | adds on a delimiter as well as Enter, and splits pasted text |
| duplicates | a repeat is not added (text stays); `allowDuplicates` lets it through | — | No duplicates | does not add a tag already in the field, unless allowDuplicates |
| max | the input stops taking text | `readonly` | Max | stops at max: the input stops taking text |
| custom tag | an icon before each label | icon `aria-hidden` | Custom tag | shows tagIcon before each label |
| typeahead | Select's list under the field with the values not yet added | input `role="combobox"`, `aria-autocomplete="list"` | Typeahead | typeahead: suggestions filter as you type, and picking one adds it; a click on a suggestion adds it |
| sizes / filled | 28 / 35 / 42 px with 22 / 28 / 32 px chips; `--field-filled` | `data-size`, `data-variant` | Sizes, Filled | sets data-size and data-variant, from its props or the provider |
| disabled | `--field-disabled`; the chips at full contrast with no remove buttons | `disabled` on the input | Disabled | is disabled: no typing, and the tags show without remove buttons |
| invalid | `--invalid` edge, red placeholder | `aria-invalid` on the input | Invalid | passes aria-invalid to the input |
| in a dialog / sheet | suggestions over the dialog | — | — | in a dialog: a suggestion picked with the mouse is added and the dialog stays open; Escape closes the list first; in a sheet |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter | Adds the typed text (or the highlighted suggestion) | Mantine / Chakra TagsInput |
| Delimiter (e.g. `,`) | Adds the typed text | Mantine / Chakra TagsInput |
| Backspace (empty input) | Removes the last tag | Mantine / Chakra TagsInput |
| Backspace / Delete (remove button) | Removes that tag; focus to the next, else previous, else the input | the library's Chip; React Aria TagGroup |
| Shift+Tab | From the input to the last tag's remove button | native |
| ArrowDown / ArrowUp, Escape | With suggestions: highlight, close (the dialog stays open) | APG Combobox |

**Notes.** Removing the last tag returns focus to the input (the emptied list is unmounted). A press on the field's empty
space puts the cursor in the input. Suggestions use Combobox's overlay approach (portalled to `<body>`, pointer events
restored, wheel and touch propagation stopped, Escape marked handled while open). Adding a tag is not announced.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Suggestions open | — | the input keeps its label's name (`aria-label` from its labels); the `role="listbox"` is named "Suggestions" (`suggestions`), not its presentation popup | Typeahead | "typeahead: the input keeps the name of its label while the list is open, when Base UI hides the label" |

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Required | as default | the input is `required` only while there is no tag | — | "required asks for one tag: the form is invalid while there is none, valid once one is in" |
| Disabled, in a form | as disabled | hidden inputs `disabled` | Disabled | "a disabled field submits no tags, as a disabled input" |
| Read-only | tags at full contrast, no remove buttons | input `readonly`; tags still submitted | Read-only | "readOnly: no remove buttons, Backspace and typing change nothing, and the tags still submit" |
| Full, with suggestions | as full | input focusable and `readonly`; no list | Max | "full, with suggestions: the input stays focusable and Backspace still removes the last tag" |
| After a form reset | the starting tags, empty input | — | — | "a form reset puts the tags it started with back and empties the input" |

Notes:
- Paste splits the text with the draft round the cursor (`selectionStart`/`selectionEnd`), not appended to its end ("splits pasted text with the typed text round the cursor").
- With `suggestions`, the field filters them itself (Base UI's `useFilter().contains`) and holds the list's `open`: the list is open only while a suggestion matches. An open list, even an empty hidden one, marks the label `aria-hidden` and takes the first Escape; a request to open with nothing to show is dropped.
- `form` reaches the input and the hidden inputs; a form reset empties the input and restores an uncontrolled `defaultValue`.

## Time field

**Status:** built (0.1.1) · **Stock:** none: built on a plain `role="group"` of contentEditable `role="spinbutton"`
segments (`src/lib/date-segments.tsx`, shared with DateField), formatted with `Intl` (`src/lib/dates.ts`).
**Pattern:** APG Spinbutton <https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/>, React Aria TimeField segment model
<https://react-aria.adobe.com/TimeField> · **Completeness references:** React Aria TimeField, Base UI has none.

**API:** `TimeField` — `value?: Date | null`, `defaultValue`, `onValueChange(Date | null)` (fires when every segment is
filled, null when a filled field loses one), `hourCycle?: 12 | 24` (locale default), `showSeconds`, `step` (minutes),
`min?`, `max?: Date` (time of day; outside → invalid), `referenceDate?: Date` (the day a new time goes on; default today),
`size`, `variant`, `fluid`, `disabled`, `readOnly`, `required`, `name` (hidden `HH:mm[:ss]`), `aria-invalid`, and `div`
props (`aria-label` / `aria-labelledby` name the group). Parts: `time-field`, `time-field-segment` (`data-type`,
`data-placeholder`), `time-field-literal`. New strings: `hour`, `minute`, `second`, `dayPeriod` "AM/PM", `emptySegment`
"Empty".

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | Input's field look, fit to content, segments in the locale order, laid out LTR | `group` + `spinbutton`s with `aria-valuenow/min/max/text` | Basic | renders a named group of hour, minute and AM/PM spinbuttons in the locale order |
| 24-hour | no AM/PM | — | 24-hour | uses a 24-hour clock where the locale does, or with hourCycle |
| seconds | a seconds segment | — | Seconds | adds a seconds segment with showSeconds |
| step | ↑/↓ on the step grid | — | Step (15 min) | steps minutes by step |
| focus | focused segment `--primary` / `--primary-foreground`, field edge `--ring` | — | Basic | — |
| empty segment | "––" in `--muted-foreground` | `aria-valuetext="Empty"`, no `aria-valuenow` | Invalid | clears a digit with Backspace…; empties a segment with Delete |
| min / max | `--invalid` edge | `aria-invalid` on every segment, `data-invalid` on the group | Min and max | marks every segment invalid when the time is outside min and max |
| invalid | `--invalid` edge | `aria-invalid` | Invalid | is invalid with aria-invalid, and inert when disabled |
| disabled | `--field-disabled` | group `aria-disabled`, segments `tabindex=-1` | Disabled | is invalid with aria-invalid, and inert when disabled |
| read-only | the time, unchanged by keys | `aria-readonly` on the segments, which stay in the tab order | Read-only | keeps its segments focusable and marked read-only, and the keys change nothing |
| sizes / filled | 28 / 35 / 42 px; `--field-filled` | `data-size`, `data-variant` | Sizes, Filled | reaches data-size and data-variant, and submits HH:mm with name |
| time zone | hours in the provider zone | — | — | reads hours in the provider time zone |
| strings | — | segment names | — | takes its segment names from the provider strings |

| Key | Behaviour | Source |
| --- | --- | --- |
| ArrowUp / ArrowDown | ±1 (± `step` minutes), wrapping; AM/PM toggles | APG Spinbutton |
| ArrowRight / ArrowLeft | Next / previous segment (no flip: segments are LTR) | React Aria |
| 0–9 | Types, moving on when complete | React Aria |
| A / P | AM / PM (first letter of the locale's names) | React Aria |
| Backspace | Removes the last digit; on an empty segment, goes back | React Aria |
| Delete | Empties the segment | React Aria |
| Home / End | Lowest / highest value | APG Spinbutton |

**Notes.** Segments are contentEditable so a phone opens its number keyboard; a native `beforeinput` listener reads the
typed text and blocks every other edit. `min`/`max` mark invalid without clamping, as React Aria does.

### Behaviour details

The segments are re-read from the value when `hourCycle`, `showSeconds` or the provider's `timeZone` changes after mount
(21:30 becomes 9:30 PM). A time in the hour the clocks skip becomes the time just after the jump. Shares the Date field's
phone Backspace, separator press and disabled hidden input. Limit, documented: in right-to-left text a time is written with
AM/PM before the hours; the segments keep the locale's left-to-right order, AM/PM last.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| hourCycle changed | same time in the new segments | — | — | writes the same time in the new segments when hourCycle changes after mount |

## Timeline

**Status:** built (0.1.1) · **Stock:** none: built on semantic HTML (an `ol` of `li` events), no primitive.
**Pattern:** a list (no APG widget pattern applies) · **Completeness references:** MUI Timeline
<https://mui.com/material-ui/react-timeline/> (position, opposite content, separator, connector), Ant Design Timeline
<https://ant.design/components/timeline> (mode left/right/alternate, line at the edge without opposite content), and the
visual target's timeline (align, opposite, horizontal, custom markers, activity feed).

**API:** `Timeline` — `align` ("start" | "end" | "alternate", default "start": the side of the line the content takes),
`orientation` ("vertical" | "horizontal"), `ol` props. `TimelineItem` (`li`), `TimelineOpposite`, `TimelineSeparator`
(without children: a default `TimelineMarker` and `TimelineConnector`; `aria-hidden`), `TimelineMarker` (16 px ring of
`--border` on `--card` with a 6 px `--primary` dot when empty; children replace the dot), `TimelineConnector` (2 px
`--border`, not drawn after the last event), `TimelineContent`. Parts: `timeline`, `timeline-item`, `timeline-separator`,
`timeline-marker`, `timeline-connector`, `timeline-content`, `timeline-opposite`. Layout: each event is a grid of three
named areas (opposite, separator, content); `Timeline` sets the areas, tracks and text alignment as custom properties
from `align` and `orientation`, so the markup order stays the reading order. The side without content collapses unless
any event has `TimelineOpposite` (detected with `:has`) or the events alternate; then both sides share the width. No
strings.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| basic | marker per event, 2 px connector, content 0.875rem from the line; events ≥ 4.5rem tall, the last as tall as its content | `ol` named by `aria-label`, `li` per event; separator `aria-hidden` | Basic | is an ordered list with one list item per event; hides the separator and draws a marker and connector by default |
| align start / end / alternate | content after / before the line / alternating; text aligned away from the line | `data-align` | Alignment | defaults to align="start"…; puts the content before the line with align="end"; switches side on every event with align="alternate" |
| opposite | times in `--muted-foreground` on the other side; the line centred | — | Opposite | reads the opposite content before the content of each event |
| horizontal | events across, the last one its own width; content below (above with `end`) | `data-orientation="horizontal"` | Horizontal | runs across the page with orientation="horizontal" |
| custom markers | icon markers in status colours, cards as content | — | Custom markers | takes a custom marker with an icon and a connector of its own |
| activity feed | avatars as markers, relative times from a fixed `now` | `time dateTime` | Activity feed | — |

No keyboard rows: the timeline has no interaction of its own; links in content are tab stops.

**Notes.** Remaining differences from the reference: without opposite content the line sits at the edge (the reference
always keeps an empty opposite half, centring Basic and Alignment); the marker sits 2 px low in vertical timelines so it
centres on the first 21 px line of 14 px content (the reference demos set 16 px lines). Not built: the reference's
interactive onboarding demo (a consumer pattern: buttons in the markers), horizontal scrolling or wrapping.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| Horizontal, wrapping text | 1rem gap before the next event (none after the last) | content and opposite `pe-4`, last `pe-0` | horizontal | keeps a gap after each horizontal event |

## Toolbar

**Status:** built (0.1.1) · **Stock:** none: built on Radix Toolbar (shadcn has no toolbar item); buttons reuse Button's
`buttonVariants`, toggle items Toggle's `toggleVariants`

**Pattern:** WAI-ARIA APG Toolbar <https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/> · **Completeness references:** Radix
Toolbar <https://www.radix-ui.com/primitives/docs/components/toolbar> · Base UI Toolbar
<https://base-ui.com/react/components/toolbar> · React Aria Toolbar <https://react-aria.adobe.com/Toolbar>; the visual
target's toolbar page (Basic, Custom)

**API.** `Toolbar` (`data-slot="toolbar"`, Radix Root: `orientation`, `loop`, `dir`; the Tailwind group `toolbar`),
`ToolbarGroup` (`toolbar-group`, `role="group"`; the bar spreads groups to start / centre / end), `ToolbarButton`
(`toolbar-button`, Radix Button composed onto Button: `variant` (default `ghost`, drawn in `--muted-foreground`), `size`,
`severity`, `raised`, `rounded`, `loading`), `ToolbarOverflowButton` (`toolbar-overflow-button`, an ellipsis
ToolbarButton named by the `moreActions` string, for a DropdownMenu trigger), `ToolbarLink` (`toolbar-link`, Button's link
look), `ToolbarToggleGroup` (`toolbar-toggle-group`, `type`, `value` / `defaultValue` / `onValueChange`, `size` →
`useControlSize`, `data-size`), `ToolbarToggleItem` (`toolbar-toggle-item`, the toggle look, joined into one segmented
pill), `ToolbarSeparator` (`toolbar-separator`, perpendicular to the bar). String: `moreActions` ("More actions").

**Look.** `--card` bar, 1 px `--border`, 6 px radius, 10 px padding, 8 px gaps, wraps; 57 px tall with 35 px fields. Icon
buttons 36 × 28 (the visual target's secondary text buttons): `--muted-foreground`, `--subtle` under the pointer. Separator
1 × 20 px `--border` (horizontal bar), full width in a vertical bar.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | groups spread across the bar | `role="toolbar"`, `aria-orientation="horizontal"`, consumer `aria-label` | Basic, Start/centre/end | renders a named toolbar with its orientation, groups and a separator |
| one tab stop | the last used control is the stop | roving `tabindex` | Basic | is one tab stop: Tab enters on the first control and leaves on the next |
| disabled control | 60 %, skipped by arrows | `disabled` | Basic | moves with → and ←, skipping disabled controls and wrapping at the ends |
| vertical | stacked | `aria-orientation="vertical"` | Vertical | moves with ↓ and ↑ when vertical |
| toggles | pressed plate | `aria-pressed` (multiple), `role="radio"` + `aria-checked` (single) | With toggle groups | toggles items with Space and Enter, pressed in a multiple group and checked in a single group |
| overflow | ellipsis button opening a menu | `aria-haspopup="menu"` (DropdownMenu) | Overflow menu | names the overflow button from the provider strings |
| loading button | spinner | `aria-busy`, `disabled` | — | passes Button looks through and disables a loading button |
| RTL | arrows reversed | `dir` from the provider | (`?dir=rtl`) | reverses the arrows in a right-to-left page |

Rows not applicable: invalid, read-only, empty.

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab / Shift+Tab | Into the toolbar (last used control) and out: one stop | APG Toolbar |
| ArrowRight / ArrowLeft | Next / previous control, wrapping (reversed in RTL); ArrowDown / ArrowUp when vertical | APG Toolbar, Radix |
| Home / End | First / last control | APG Toolbar |
| Enter, Space | Activate the button, toggle the item | native, Radix |

**Notes.** A text field inside the bar keeps its own arrow keys and is its own tab stop (Radix's roving group only holds
its items). The visual target's toolbar has no toggle groups; ours use the suite's toggle look.

### Behaviour details

`ToolbarButton` no longer passes `disabled` while `loading`; `Button` marks it `aria-disabled` and `aria-busy` and
refuses the press, so it keeps its focus and stays in the arrow-key order. Test: keeps focus on a toolbar button that
starts loading, and ignores its presses while it loads.

## Tour

**Status:** built (0.1.1) · **Stock:** none: built on Radix Popover (`Popover.Root`, a virtual `Popover.Anchor`,
`Popover.Content`, `Popover.Arrow`) and Radix Portal for the mask.
**Pattern:** WAI-ARIA APG Dialog (Modal) <https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/> (with the mask; a
non-modal dialog without it) · **Completeness references:** Ant Design Tour <https://ant.design/components/tour> ·
Atlassian Spotlight <https://atlassian.design/components/onboarding/examples> · Fluent UI TeachingPopover
<https://react.fluentui.dev/?path=/docs/components-teachingpopover--docs>

**API:** `Tour` — `steps: TourStep[]` (required), `open?` / `defaultOpen?` / `onOpenChange?(open)`, `step?` /
`defaultStep?` (0; an uncontrolled tour starts there again each time it opens) / `onStepChange?(step)`, `onFinish?()`,
`mask?` (true), `arrow?` (true), `spotlightPadding?` (4 px), `returnFocusTo?` (a ref or a function, as Dialog's),
`className?` (the card). `TourStep` — `target?` (a CSS selector, a ref, or a function returning the element; left out or
not on the page, the card is centred in the window), `title` (names the card), `description?` (describes it), `content?`,
`placement?` (`top` | `right` | `bottom` (default) | `left`, flips on collision), `align?` (`start` | `center` | `end`).
Exports `Tour`, `TourStep`, `TourTarget`. Parts: `tour-content`, `tour-title`, `tour-description`, `tour-step-content`,
`tour-footer`, `tour-step-count`, `tour-skip`, `tour-back`, `tour-next`, `tour-arrow`, `tour-mask`, `tour-spotlight`.

**How it works.** The anchor is a virtual ref whose `current` resolves the step's target each time Popper reads it, so the
card follows the element as it is on the page; without a target it is a fixed object whose rect sits half the card's
height above the window's centre, so the card is centred. The mask is a fixed full-window SVG: a `--mask` rect with a mask
that cuts a rounded (8 px) hole `spotlightPadding` px round the target; the hole's attributes are set directly on scroll,
resize and target resize (rAF-throttled), so following a scroll re-renders nothing. The mask fades (opacity only) with
`data-bui-motion="modal"`; the hole jumps between steps (no layout animation). With the mask the popover is modal (focus
trapped, page `aria-hidden` and inert to the pointer, page scroll locked); without it the page stays usable. A click or
focus outside never ends the tour (`onInteractOutside` prevented).

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| open, first step | a 320 px card (Popover look: `--popover`, 1 px edge, 8 px radius, 16 px padding, overlay shadow), 16 px semibold title, 14 px muted description, footer: "1 of 3" (12 px muted), Skip tour (ghost sm), Next (default sm); a 10 px arrow; the page dimmed with a spotlight round the target | `role="dialog"`, `aria-labelledby` title, `aria-describedby` description, `data-step`, `data-bui-motion="overlay"`; mask `aria-hidden` | Basic | opens a card named by the step title, with focus on the card |
| middle step | Back (outline sm) appears | — | Basic | presses Next with Enter and Back with Space… |
| last step | Next reads Finish, Skip tour leaves | — | Basic | ends on Skip tour, and on Finish, which calls onFinish |
| no target | the card centred in the window, no arrow, no hole | — | Custom content | centres a step without a target, with no arrow |
| custom content | `content` under the description | — | Custom content | moves between the card's buttons with Tab… |
| without mask | no mask; the page usable; focus may leave the card | non-modal dialog | Without mask | stays open on a click outside, and leaves the mask out with mask={false} |
| controlled | the step the consumer sets | — | Controlled | follows a controlled step and reports each move |
| reopened | starts at `defaultStep` again | — | Basic | starts again from the first step each time it opens |
| right to left | logical layout; the count keeps its order (`unicode-bidi: plaintext`); arrows flipped | — | Basic (`?dir=rtl`) | flips the arrow keys on a right-to-left page |
| translated | provider strings; the count's numbers in the provider's `locale` | — | — | takes its words from the provider and formats the count in its locale |
| reduced motion | the target jumps into view instead of scrolling smoothly; the card and mask keep a short fade | — | — | — |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab / Shift+Tab | Moves between the card's buttons (and links in `content`); wraps within the card with the mask | APG Dialog (Modal) |
| Enter, Space | Presses the focused button | native button |
| ArrowRight (ArrowLeft in RTL) | From the card or one of its buttons, next step | Boolean UI addition: the carousel convention for moving between slides |
| ArrowLeft (ArrowRight in RTL) | From the card or one of its buttons, previous step | as above |
| Escape | Ends the tour; focus returns to the element focused before it opened (or `returnFocusTo`) | APG Dialog (Modal) |

**Notes.** Focus moves to the card itself on open and on every step change (so a screen reader reads the new title and
description); Tab then reaches the buttons. The target is scrolled into view (`block: "center"`) only when it is not
wholly in the window. Strings: `skipTour`, `tourStep` ("{current} of {total}") new; `back`, `next`, `finish` reused.
The target cannot be used while the mask shows (by design; `mask={false}` for interactive steps).

### Behaviour details

A step whose `target` resolves to nothing is treated as a step without a target: centred, `side="bottom"`, no arrow, no
collision avoidance. Whether the target is on the page is read with `useSyncExternalStore` from the page, watched by a
`MutationObserver` on `<body>` while the tour shows, so a ref set after the first render or an element rendered later is
found. Test: "centres a step whose target is not on the page, with no arrow, and points again at the next step’s target".

## Tree

**Status:** built (0.1.1) · **Stock:** none: built on plain elements; pointer dragging, in the separate entry
`tree-drag` (`DraggableTree`), on `@dnd-kit/core` 6.3 (`DndContext`, `useDraggable`, `useDroppable`, `DragOverlay`).

**Pattern:** WAI-ARIA APG Tree View <https://www.w3.org/WAI/ARIA/apg/patterns/treeview/> · **Completeness references:**
React Aria Tree <https://react-aria.adobe.com/Tree> · the visual target's tree page (Basic, Content, Toggle Indicator,
Controlled, Selection, Filter, Lazy, Loading, Empty, Drag and Drop).

**API.** `Tree` (`data-slot="tree"`; the list `tree-list`, `role="tree"`; nodes `tree-node`, `role="treeitem"`; their row
`tree-node-content`, with `tree-node-toggle`, `tree-node-checkbox`, `tree-node-icon`, `tree-node-label`; children
`tree-group`, `role="group"`; `tree-filter`, `tree-empty`, `tree-skeleton`, `tree-loading`, `tree-status`; in a
`DraggableTree`, `tree-drag-preview`). Props: `nodes: TreeNode[]` (`{ id, label, icon?, expandedIcon?, children?, leaf?, disabled?, data? }`),
`selectionMode` (`"none" | "single" | "multiple" | "checkbox"`, default `none`), `expanded` / `defaultExpanded` /
`onExpandedChange` and `selected` / `defaultSelected` / `onSelectedChange` (id arrays), `onNodeSelect`, `loadChildren`,
`filter`, `filterValue` / `onFilterValueChange`, `filterPlaceholder`, `loading`, `empty`, `renderLabel(node, state)`,
`expandIcon`, `collapseIcon`, `onNodeMove(move)`; `aria-label` / `aria-labelledby` / `aria-describedby` go to the list,
other `div` props to the root. Also exported: `moveTreeNode(nodes, move)`, `getExpandableIds(nodes)`, `useTreeState`
(the state and keyboard model `TreeTable` shares); types `TreeNode`, `TreeSelectionMode`, `TreeMove`, `TreeNodeState`,
`TreeRow`, `TreeProps`, `TreeStateOptions`. No sizes or variants (the visual target has none). New strings:
`filterTree` = "Filter", `treeLoading` = "Loading {label}"; reused: `noResults`, `loading`.

**Checkbox rules.** A node in `selected` checks its whole branch; a parent is checked when all its children are, mixed when
some are. Checking a node checks its leaves (disabled ones keep their state); unchecking also unchecks its ancestors.
`onSelectedChange` lists every checked node in tree order, parents whose branch is all checked included. Children loaded
later under a checked node inherit the check.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | 29 px rows (4 × 8 px padding, 21 px line), 6 px gaps, 6 px radius, 2 px between rows, 14 px indent a level, a bare 14 px chevron in the text colour (24 px pointer area), 14 px padding on the `--card` surface | `role="tree"`, `treeitem` with `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded` on parents | Basic | renders a named tree of treeitems with their level, position and state |
| hover | `--accent` / `--accent-foreground`, only while nodes can be chosen | — | Single selection | — |
| focus-visible | 1 px `--ring` outline inside the row (offset −1 px) | roving `tabindex` | Single selection | moves to the next node with Down Arrow |
| open | chevron down; `expandedIcon` if given | `aria-expanded="true"`, child `role="group"` | Basic | opens a closed node with Right Arrow, then moves to its first child |
| selected | `--highlight` fill, `--highlight-foreground` text and icons | `aria-selected`; `aria-multiselectable` with `multiple` | Single / Multiple selection | chooses the node with Enter in single selection |
| checked / mixed | the library's Checkbox (check, dash), no row fill | `aria-checked` `true` / `false` / `mixed`; the box is `aria-hidden` | Checkbox selection | checks a whole branch, shows a parent as mixed … |
| disabled | 60 % opacity | `aria-disabled`; focusable and openable, not chosen, checked or moved | Disabled nodes | leaves a disabled node out of checking and choosing |
| filtered | matches, their ancestors (opened) and their own branch | `aria-controls` from the field to the list; `posinset`/`setsize` among the nodes shown | Filter | filters to the matching nodes and their ancestors … |
| no results | muted "No results" line | `role="status"` | Filter | filters … and says when nothing matches |
| node loading | 14 px spinner in place of the chevron | `aria-busy` on the node; live region says `treeLoading` | Lazy loading | loads children the first time a node opens … |
| loading | rows under a `--card`/50 mask with a 28 px `--primary` spinner; no nodes: six placeholder rows | `aria-busy` on the root; spinner `role="status"` named `loading` | Loading | dims the nodes under a spinner … |
| empty | `empty`, else a muted `noResults` line | — | Empty | shows the empty message … |
| dragging (`DraggableTree`) | dashed 1 px `--primary` outline on the source; a card-surface preview with a shadow; drop line 1 px `--primary` before/after, `--accent` fill inside | `data-dragging` on the source row, `data-drop` (`before`/`after`/`inside`) on the target row | Drag and drop | tree-drag tests: drops a node into a folder with the pointer, marking the source and the target meanwhile; drops a node before another …; refuses a drop into the node's own branch; leaves a disabled node undraggable |
| moving without dragging | a menu on each node: Move up, Move down, Move into | the menu button is out of the tab order; the keyboard moves with Alt and the arrows (`onNodeMove`) | Move without dragging | — (a recipe of `moveTreeNode`) |

| Key | Behaviour | Source |
| --- | --- | --- |
| Down Arrow / Up Arrow | Next / previous node shown | APG Tree View |
| Right Arrow | Opens a closed node; on an open node, moves to its first child (Left Arrow in RTL) | APG Tree View |
| Left Arrow | Closes an open node; otherwise moves to its parent (Right Arrow in RTL) | APG Tree View |
| Home / End | First / last node shown | APG Tree View |
| Enter | Chooses (single, multiple), checks (checkbox), or opens/closes a parent (none) | APG Tree View (default action) |
| Space | As Enter | APG Tree View (multi-select) |
| * | Opens every sibling of the focused node | APG Tree View |
| A–Z | Type-ahead: next node whose label starts with the letters typed (500 ms buffer; a repeated letter cycles) | APG Tree View |
| Shift + Down / Up Arrow | `multiple`: moves and toggles the next node's choice | APG Tree View (multi-select) |
| Control + A | `multiple`: chooses every node shown, or none when all are | APG Tree View (multi-select) |
| Alt + Up / Down Arrow | `onNodeMove`: before the previous / after the next sibling | outliner convention (no APG key) |
| Alt + Right / Left Arrow | `onNodeMove`: into the previous sibling as its last child / out, after its parent (flipped in RTL) | outliner convention |

**Notes.** Keyboard moving is the tree's own (Alt and the arrows), not dnd-kit's keyboard sensor, whose pick-up keys (Space,
Enter) are the tree's selection keys; dnd-kit's English announcements and instructions are switched off, and the moved
node keeps the focus, so a screen reader reads its new level and position. Pointer dragging uses dnd-kit's
`PointerSensor` (4 px activation, touch included); the drop position is the top or bottom quarter of a row
(before/after) or its middle (inside); a `leaf` takes before/after only; a node cannot be dropped into its own branch.
The toggle is a 14 px mark, as the visual target draws it, not a 28 px button: its pointer area is 24 px through `::after`,
and the keyboard does not need it. Rows are nested `li`/`ul` (the APG markup), not the visual target's flat list.
Lazy loading is derived state: an open node with no children yet and `loadChildren` is loading; a failed load closes it
again.

### Dragging

- **Entry.** Pointer dragging lives in `@booleanpress/ui/tree-drag` (`src/components/tree-drag.tsx`), the only tree file
  that imports dnd kit, so `tree`, `tree-select` and `tree-table` need no drag library. It exports `DraggableTree<TData>`
  (`DraggableTreeProps` = `TreeProps` with `onNodeMove` required), which renders `Tree` inside the drag layer; `Tree`'s
  own `onNodeMove` keeps only the Alt and arrow-key moves (no dnd kit needed). Peers: `@dnd-kit/core` for the drag entry
  only.
- **Seam.** `src/lib/tree-drag-layer.ts` (internal, not a package entry) holds `TreeDragLayerContext` with a `Root`
  (wraps the list: `DndContext`, the drop position, `DragOverlay` preview) and a `Content` (each node's row:
  `useDraggable` + `useDroppable`, sets `data-dragging` / `data-drop`). `Tree` draws the layer it finds when
  `onNodeMove` is set and resets the context for its descendants, so a tree nested in a label does not inherit it. The
  row's drag styles stay in `tree.tsx`, keyed on those data attributes.
- **Drop position.** Worked out from the latest collision check (pointer height and the row under the pointer), not from
  `onDragMove`'s `over`, which dnd kit hands over one move late; the indicator follows the pointer exactly.
- **Tests.** `tests/components/tree-drag.test.jsx`: semantics unchanged (no `aria-roledescription`; dnd kit's hidden
  regions present), pointer drop inside and before (rows laid out with a stubbed `getBoundingClientRect`), refusal into
  its own branch, disabled node not draggable, Alt+arrow moves in a `DraggableTree`, and a plain `Tree` with
  `onNodeMove` renders no drag layer.

### Behaviour details

- **Lazy failure.** A rejected (or throwing) `loadChildren` closes the node again; the live region (`tree-status`) says the new string `treeLoadFailed` = "Could not load {label}"; opening the node calls `loadChildren` again. A load that settles after unmount changes no state and calls no callback. Test: "closes a node whose children fail to load, says so, and tries again when it opens"; "treats a loader that throws as a failed load"; "calls nothing of yours when a load settles after the tree is gone".
- **Checkbox rules (addition).** Pressing a node whose branch would not change by checking (its only unchecked nodes are disabled) unchecks the branch instead, so a mixed parent can always be cleared. Test: "clears a branch on a second press when its only unchecked node is disabled".
- **Moves (addition).** Every move (Alt and an arrow, or a drop) goes through one path: the node it goes into opens, and the live region says `itemMoved` with the node's new position among its siblings. Test: "says where a node moved with Alt and an arrow key"; tree-drag "opens the folder a node is dropped into, and says where it went". A lazy node whose children have not loaded takes no node inside it (keyboard or drop). Test: tree-drag "drops only before or after a lazy node whose children have not loaded".
- **Notes (this replaces the sensor sentence).** Pointer dragging uses dnd kit's `MouseSensor` (4 px activation) and `TouchSensor` (250 ms press, 5 px tolerance), as the order list does, so a swipe over the tree scrolls the page. While a node is dragged, Escape is marked handled on the window in the capture phase, so a Radix `Dialog`, `Sheet` or `Popover` around the tree does not close and dnd kit cancels the drag. The preview (`tree-drag-preview`) is portalled to `document.body` once hydrated. Tests: "drags with a finger after a long press"; "cancels a drag with Escape inside a dialog, and the dialog stays open".
- **Limits (additions).** `moveTreeNode` moves the nodes passed in; children brought in by `loadChildren` live in the tree until added to `nodes`. Every node shown is drawn (no virtual rows); each node keeps one ref callback between renders so a key press does not re-attach every node's ref.
- **Keys.** Shift + Up Arrow has its own test ("takes a node away from the choice with Shift and Up Arrow in multiple selection"); the type-ahead timer is cleared on unmount ("clears the type-ahead timer when the tree goes away").

## Tree select

**Status:** built (0.1.1) · **Stock:** none: built on the library's `Popover` (Radix Popover) holding the library's `Tree`.

**Pattern:** WAI-ARIA APG Combobox <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/> (popup: tree, or dialog with the
filter) · **Completeness references:** React Aria has no tree select; the visual target's select page, "Tree" demo, and its
TreeSelect component (chips display, clear, filter, sizes, filled, fluid, disabled, invalid).

**API.** `TreeSelect` (`data-slot`: `tree-select-trigger`, `tree-select-value`, `tree-select-chip`, `tree-select-control`
(clearable wrapper), `tree-select-clear`, `tree-select-content`). Props: `nodes`, `selectionMode` (`"single" | "multiple" |
"checkbox"`, default `single`), `value` / `defaultValue` / `onValueChange` (id arrays), `placeholder`, `display`
(`"comma" | "chip"`), `maxSelectedLabels` (default 3), `filter`, `filterPlaceholder`, `clearable`, `size` (`ControlSize`,
`useControlSize`), `variant` (`FieldVariant`, `useFieldVariant`), `fluid`, `defaultExpanded`, `loadChildren`, `loading`,
`empty`, `renderLabel`, `name` (hidden inputs), `disabled`, and `button` props (`id`, `aria-*`). Type: `TreeSelectProps`.
Strings reused: `clear`, `selectedCount`, `moreSelected`, and the Tree's `filterTree`, `noResults`, `treeLoading`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | the select field: 35 px, `--field`, `--control` edge, 14 px chevron in a 36 px end column; placeholder `--muted-foreground` | `role="combobox"`, `aria-haspopup="tree"` (`"dialog"` with `filter`), `aria-expanded` | Basic | is a named combobox showing its placeholder … |
| hover / focus / open | `--control-hover` edge / `--ring` edge | `aria-controls` while open | Basic | opens on a click, moves the focus into the tree … |
| open list | overlay as wide as the field at least, 2 px below, 6 px radius, 4 px padding, `shadow-md`, scrolls past 20 rem; the tree without padding or fill | list named by the field's label (`Label htmlFor`, `aria-labelledby` or `aria-label`); with `filter` the popover is a named `role="dialog"` | Basic, Filter | filters the list from a field at its top … |
| chosen (single) | the node's label | value text | Basic | chooses a node with a click, a parent included |
| several (comma) | labels joined by commas; past the limit `selectedCount` | — | Multiple | keeps the list open in multiple selection … |
| chips | 24 px chips (`--secondary`, 4 px radius, 12 px text, 3 px apart) in half the field's padding, the field keeping its height; `moreSelected` chip past the limit | chips are text | Chips display | shows chips, with a last chip counting the rest |
| checkbox | checked branch shown by its top node | tree `aria-checked` | Checkbox | checks whole branches and shows a checked branch by its top node |
| clearable | × 14 px in `--control-hover`, `--foreground` on hover, 32 px from the end | button named `clear` | Clear | empties the field with the clear button … |
| sizes | 28 / 35 / 42 px, chevron 12 / 14 / 16 px | `data-size` | Sizes | marks an invalid field and passes sizes … |
| filled | `--field-filled` | `data-variant="filled"` | Filled | marks an invalid field and passes … the filled look |
| fluid | full width | — | Fluid | — |
| disabled | `--field-disabled`, cannot open | `disabled` | Disabled | cannot open while disabled |
| invalid | `--invalid` edge, red placeholder | `aria-invalid` | Invalid | marks an invalid field … |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter / Space | On the field, opens or closes; in the list, chooses (single closes) or checks | APG Combobox; Tree |
| Down / Up Arrow | On the closed field, opens; in the list, moves; Down from the filter enters the tree | APG Combobox |
| Right / Left Arrow | In the list, opens / closes nodes, moves to child / parent (flipped in RTL) | APG Tree View |
| Escape | Closes without change; focus back on the field | APG Combobox |
| Tab | From the last stop in the list (Shift+Tab from the first), closes; focus back on the field | the visual target's overlay behaviour |

**Notes.** The list opens with the chosen nodes' branches open. Labels of lazily loaded chosen nodes are kept from the
nodes chosen. Chips are a summary, not controls (a button cannot hold buttons). Because the entry imports `Tree`, it needs
`@dnd-kit/core` installed, though it never drags.

### Behaviour details

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| In a modal dialog or sheet | The list scrolls with the wheel and touch | — | — | "keeps wheel and touch scrolling in the list from a dialog's scroll lock" |
| Long value | The field never grows past its container; the value truncates | — | — | "never grows past its container, so a long value truncates" (class) |

| Key | Behaviour | Source |
| --- | --- | --- |
| Enter (on the field) | Opens the list (it moves the focus into the list, so the field never closes it by key) | Radix Popover trigger |
| Up Arrow (in the list) | Moves to the previous node | Tree |
| Right / Left Arrow in RTL | Mirrored: Left opens or enters a node, Right closes it or moves to its parent | Tree |

Notes:
- The list stops `wheel` and `touchmove` on its own element, so the dialog's document-level scroll lock (which cancels scrolls outside the dialog's element; the list is portalled to `<body>`) never sees them; `overscroll-contain` keeps a scroll at the list's ends from passing on.
- Forms: as Cascade select — hidden inputs `disabled` with the field and following its `form` attribute; a form reset restores an uncontrolled `defaultValue`.

## Tree table

**Status:** built (0.1.1) · **Stock:** none: built on the Tree's data model and state (`useTreeState`) rendered as a
`role="treegrid"` table with the library's Table parts (`TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`)
and `Pagination` parts. Not on `@tanstack/react-table`: one node shape and one set of rules (open and chosen ids, mixed
checkboxes, lazy children, type-ahead, the arrow keys) across Tree, TreeSelect and TreeTable, the APG treegrid row keys
that TanStack (headless state only) would leave to be written anyway, and no table peer for consumers.

**Pattern:** WAI-ARIA APG Treegrid <https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/> (row focus) · **Completeness
references:** the visual target's treetable page (Basic, Size, Gridlines, Striped Rows, Selection, Sort, Pagination,
Scroll, Lazy Loading, Loading, Empty State), React Aria Table (tree data).

**API.** `TreeTable` (`data-slot`: `tree-table`, `tree-table-container`, `tree-table-table`, `tree-table-header`,
`tree-table-head`, `tree-table-sort`, `tree-table-expand-all`, `tree-table-select-all`, `tree-table-body`,
`tree-table-row`, `tree-table-toggle`, `tree-table-checkbox`, `tree-table-icon`, `tree-table-label`,
`tree-table-skeleton`, `tree-table-empty`, `tree-table-loading`, `tree-table-status`, `tree-table-pagination`). Props:
`nodes: TreeNode<TData>[]`, `columns: TreeTableColumn<TData>[]` (`{ id, header, cell?, sortable?, sortValue?, className?,
headerClassName? }`; the first holds the tree), `selectionMode` (`none` / `single` / `multiple` / `checkbox`),
`expanded` / `defaultExpanded` / `onExpandedChange`, `selected` / `defaultSelected` / `onSelectedChange`, `sort` /
`defaultSort` / `onSortChange` (`{ id, desc } | null`), `pageSize`, `page` / `onPageChange`, `loadChildren`, `loading`,
`empty`, `size` (`"sm" | "default" | "lg"`: 6 × 8, 8 × 14, 15 × 20 px cells), `gridlines`, `striped`, `scrollHeight`,
`expandAllButton`; `aria-label` / `aria-labelledby` / `aria-describedby` go to the table. Types: `TreeTableColumn`,
`TreeTableSort`, `TreeTableProps`. New strings: `expandNode` = "Expand {label}", `collapseNode` = "Collapse {label}",
`expandAll` = "Expand all", `collapseAll` = "Collapse all" (and the Tree's `treeLoading`); reused: `selectAll`,
`noResults`, `loading`, `pageRange`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | the Table look: 8 × 14 px cells, 14 px text, semibold headings, `--border` lines (`--muted` in dark) drawn on the cells, `--card` surface; a round 24 px toggle with a 14 px `--muted-foreground` chevron, `--accent` on hover; 16 px indent a level | `role="treegrid"`; rows `aria-level`, `aria-setsize`, `aria-posinset`, `aria-expanded`; cells `gridcell` | Basic | renders a named treegrid whose rows carry their level, position and state |
| hover | row `--accent` | — | Basic | — |
| focus-visible | 1 px `--ring` outline inside the row | roving `tabindex` on rows | Basic | moves to the next row with Down Arrow |
| selected (single, multiple) | row `--highlight`; the toggle takes the row's colour, `--card` under the pointer | `aria-selected`, `data-state="selected"` | Single selection, Multiple selection | chooses the row with Enter in single selection |
| checked / mixed | the library's Checkbox after the toggle; the heading's select-all box | row `aria-selected` when checked; box `aria-checked` `mixed`, named by the row label; heading box `selectAll` | Checkbox selection | checks a branch, shows a partly checked row as mixed … |
| sorted | heading `--highlight`, 12 px sort mark; unsorted sortable heading `--accent` under the pointer | `aria-sort` on sortable headings | Sort | sorts siblings by a heading … |
| sizes | sm / default / lg padding | — | Sizes | draws sizes, gridlines, stripes and a scrolling header |
| gridlines | a line on every side of every cell | — | Gridlines | same |
| striped | even rows `--subtle` (`--background` in dark) | — | Striped | same |
| scroll | `scrollHeight` box, sticky `--card` header | — | Scroll | same |
| paged | top-level rows a page, `PaginationRange` + `PaginationPages` below | range is a live region | Pagination | pages the top-level rows … |
| row loading | spinner in the toggle | `aria-busy`; live region `treeLoading` | Lazy children | loads children the first time a row opens … |
| loading | rows under a `--card`/50 mask with a 28 px spinner; no rows: four placeholder rows | table `aria-busy`; spinner `role="status"` | Loading | dims the rows while loading … |
| empty | `empty`, else `noResults`, across the columns | one `gridcell` with `colspan` | Empty | shows the empty message across the columns |

| Key | Behaviour | Source |
| --- | --- | --- |
| Down / Up Arrow | Next / previous row | APG Treegrid |
| Right Arrow | Opens a closed row; on an open row, moves to its first child (Left Arrow in RTL) | APG Treegrid (rows; no cell focus) |
| Left Arrow | Closes an open row; otherwise moves to its parent (Right Arrow in RTL) | APG Treegrid |
| Home / End | First / last row | APG Treegrid |
| Enter / Space | Chooses or checks the row; with no selection, opens or closes it | APG Treegrid |
| * | Opens every sibling row | APG Tree View |
| A–Z | Type-ahead on the first column's labels | APG Tree View |

**Notes.** Focus is by row only; Right Arrow on an open row moves to its first child rather than into the cells (APG's
cell mode), as in the Tree. The toggle and checkbox keep the focus on their row when pressed. Sorting is per level among
siblings, by `sortValue` or the cell value: numbers by size, text with `Intl.Collator` in the provider's locale, empty
values last. Not built (the visual target has them): editing, column resize and reorder, row reorder, column toggle,
column groups, filter and export.

### Behaviour details

- **API.** `size?: ControlSize`, resolved with `useControlSize` (the provider's `controlSize` by default), set as `data-size` on `tree-table`. Test: "takes its size from the provider unless it is given one".
- **Select all.** The heading box toggles with the same rule as a row: it clears every row when checking would change nothing (the only unchecked rows are disabled). Test: "clears every row from the heading when the only unchecked rows are disabled".
- **Labels.** A row checkbox's `aria-labelledby` points at an id built from the row's position, so a node id with a space keeps it working. Test: "names each row checkbox by its label, even when the row id holds a space".
- **Keys (additions).** | Shift + Down / Up Arrow | `multiple`: moves and toggles the next row's choice | APG Treegrid (multi-select) | · | Control + A | `multiple`: every row shown, or none | APG Treegrid (multi-select) |. Tests: "extends the choice with Shift and an arrow key in multiple selection"; "chooses every row with Control and A in multiple selection, then none"; RTL: "flips Right and Left Arrow in a right-to-left page".
- **Lazy failure.** As the Tree: the row closes, the live region says `treeLoadFailed`. Test: "closes a row whose children fail to load and says so".

## Typography

**Status:** built (0.1.1) · **Stock:** none: plain elements styled with the visual target's documentation type scale.
**Pattern:** none in the APG (native headings, paragraphs, lists, quotes, code, tables) · **Completeness references:**
Chakra Prose <https://chakra-ui.com/docs/components/prose> · shadcn Typography <https://ui.shadcn.com/docs/components/typography>
· Tailwind Typography <https://github.com/tailwindlabs/tailwindcss-typography>

**Scale (measured 2026-10-05 on the visual target's guide pages, computed styles, light and dark):** h1 30/36 weight 400,
−0.75 px tracking; h2 20/28 500, 56 px above, 4 px below; h3 18/28 500, 32 px above; h4 16/24 500, 24 px above; body
16/24, paragraphs 16 px apart; lists disc/decimal, items 6 px apart; inline code 14/21 500 mono on slate 200 / slate 700,
2 px × 4 px, 4 px radius; tables 14/20, cells 10 × 12 px, th 700, a rule under the header and under each row; bold 600 in
the heading colour; headings slate 900 / white. h5 (14/21) and h6 (12/18) extend the scale. The brief's h2 24/32, h3
20/28, h4 18/28 and prose 16/28 were not what the visual target computes; the measured values are built.

**API:** `Prose` (div; `asChild`) — styles its HTML (direct-child blocks: `h1`–`h6`, `p`, `ul`, `ol`, `blockquote`,
`pre`, `hr`, `figure`; any depth: `li`, `a`, `code` not in `pre`, `strong`, `img`, `figcaption`, `table` and its cells).
`Heading` — `level?` 1–6 (2; renders `h{level}`), `size?` 1–6 (another level's look), `asChild?`. `Text` — `size?`
(`xs` 12/18 | `sm` 14/21 default | `base` 16/24 | `lg` 18/28), `tone?` (`default` | `muted` | `strong` | `destructive` |
`success`), `weight?`, `asChild?`; renders `p`. `Blockquote`, `InlineCode`. Exports also `headingVariants`,
`textVariants`, `HeadingLevel`. Parts: `prose`, `heading`, `text`, `blockquote`, `inline-code`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| prose article | as the scale | native elements only | Prose | Prose renders the HTML inside it as the semantic elements it is |
| headings | the six levels; `size` decoupled from `level` | `data-level`, `data-size` | Headings | Heading renders its level and draws another level's size on request |
| text | sizes, tones, weights | `data-size`, `data-tone` | Text sizes and tones | Text renders a paragraph, or the child with asChild… |
| lists and quotes | nested `circle` lists; quote: 2 px start edge, 16 px in, italic muted | — | Lists and quotes | Blockquote and InlineCode render their native elements |
| table | full width, rules under rows | — | Table inside prose | Prose renders the HTML… |
| right to left | headings, lists and quotes follow the page; `code` and `pre` stay left to right, isolated | InlineCode `dir="ltr"`; Prose `direction: ltr; unicode-bidi: isolate` on `code`, `direction: ltr` on `pre` | Prose (`?dir=rtl`) | — |
| links in prose | 500 weight, `--primary`, underlined at 40 % (full on hover), focus outline | — | Prose | — |

| Key | Behaviour | Source |
| --- | --- | --- |
| — | None of its own; links inside keep native keys | — |

**Notes.** Deviations from the visual target, on purpose: prose links are always underlined in `--primary` (the target
uses slate 600 with hover-only underline, which fails WCAG 1.4.1 inside text); list markers hang outside (`ps-5`, the
target uses `list-inside`), which looks the same for one-line items and keeps a loose list's `<li><p>` on the marker's
line. A wide table is not wrapped automatically (raw HTML has no wrapper); the docs say to wrap it in a focusable region.
The `success` tone is 3.3:1 on white in light (an existing exception pair of the theme).

## Virtual scroller

**Status:** built (0.1.1) · **Stock:** none: built on TanStack Virtual's `useVirtualizer` (`@tanstack/react-virtual`,
peer) and the library's `Skeleton`.
**Pattern:** a focusable scrolling region (WCAG 2.1.1; APG Landmark Regions
<https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/>) whose items are a list with `aria-setsize` /
`aria-posinset` · **Completeness references:** Base UI has none; React Aria Virtualizer
<https://react-aria.adobe.com/Virtualizer>; TanStack Virtual's examples (fixed, dynamic, grid, infinite); the visual
target's virtual scroller (vertical, horizontal, grid "both", lazy loading with loader, scroll to index).

**API:** `VirtualScroller<T>` — `items`, `renderItem(item, index)`, `itemSize?` (fixed; omit to measure),
`estimatedItemSize` (40), `orientation` ("vertical" | "horizontal" | "grid"), `columns` (3), `gap` (0), `overscan` (5),
`getItemKey?`, `list` (true), `hasMore`, `loading`, `onLoadMore?`, `loadMoreThreshold` (5), `loaderCount` (3),
`renderLoader?(index)`, `empty?`, `ref` (a `VirtualScrollerHandle`: `scrollToIndex(index, { align, behavior })`,
`scrollToOffset(offset, …)`, `element`), and `div` props on the region. Types `VirtualScrollerProps`,
`VirtualScrollerHandle`, `VirtualScrollerScrollOptions`. Parts: `virtual-scroller` (`data-orientation`),
`virtual-scroller-content`, `virtual-scroller-item`, `virtual-scroller-row` (grid), `virtual-scroller-loader`,
`virtual-scroller-empty`, `virtual-scroller-status`. Strings: `loadingMore` ("Loading more…"); reuses `loading`,
`noItems`.

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| default | a plain scrolling box; the page gives it a frame and height | `region` named by `aria-label`, `tabindex="0"`; content `list`, items `listitem` with `aria-posinset` and `aria-setsize` | Basic | renders only the items in view and a few either side; renders a new slice as it scrolls |
| focused | 1 px `--ring` outline 2 px away | — | Basic | takes the focus with Tab |
| horizontal | a row scrolled sideways, mirrored in RTL | `data-orientation="horizontal"` | Horizontal | scrolls a row; mirrors a horizontal row in a right-to-left page |
| grid | `columns` items per row, `gap` apart, virtualised by row | rows are generic; cells `listitem` with flat positions | Grid | lays a grid out `columns` to a row |
| measured | items size themselves; positions follow measurements | `data-index` on each item | Variable heights | measures items without `itemSize` |
| loading more | `loaderCount` skeleton rows after the last item | region `aria-busy`; `status` "Loading more…"; loaders `aria-hidden`; `aria-setsize="-1"` while `hasMore` | Lazy loading | asks for more once the end is in view, shows loading rows, asks once per length; not before the end is near |
| loading first / empty | "Loading" status; or `empty` / "No items" in `--muted-foreground` | `status` | Empty and retry | says "Loading" while the first items load; empty text |
| scrolled to index | — | — | Scroll to index | scrolls to an item with scrollToIndex from its ref |
| no list semantics | — | `list={false}` drops the roles | — | drops the list roles with list={false} |
| strings | provider text | — | — | reads its loading text from the provider |

| Key | Behaviour | Source |
| --- | --- | --- |
| Tab | Moves the focus to the region | DOM (tabindex 0) |
| ↓ ↑ ← → / PageDown PageUp | Scroll by a line / a view | The browser's own scrolling of a focused scroll container |
| Home / End | Scroll to the first / last item through the virtualiser (exact with measured items) | Own |

**Notes.** The visual target's 2-D "both" demo (rows and columns each virtualised over a 2-D array) is built as a grid of
flat items `columns` to a row, the shape product screens use (cards, thumbnails); a 2-D virtualisation is not built. Its
lazy loader (a full overlay with a spinner) becomes placeholder rows after the last item, so the items in view stay
readable. The scroller draws no frame: the examples copy the demos' 1 px `--border`, 4 px radius, 50 px rows with 8 px
padding and `--muted` stripes. Items out of view are not in the page: find-in-page cannot reach them, and a focused
control inside an item loses the focus when the item scrolls far away (documented).

### Behaviour details

- **Performance.** The key function given to TanStack Virtual changes only with `items`, the row count, the columns and
  whether `getItemKey` is set (the latest `getItemKey` is read through a ref). An inline `getItemKey` therefore does not re-key every item on each scroll frame.
- **Sizes after mount.** A new `itemSize` or `estimatedItemSize` calls `virtualizer.measure()` in a layout effect, so the
  items are placed at the new size before paint.
- **Lazy loading.** `onLoadMore` still fires once per length of `items`, but the guard resets once the end leaves the
  view: a load that added nothing (a failed request) is retried by scrolling back to the end, and never loops while the
  end stays in view. With no items at all the consumer shows its own retry.
- Example `lazy-loading` clears its pretend request's timer on unmount.

## Form behaviour: Select, Checkbox, Switch, Radio group, Rating, Slider

Form behaviour confirmed and tested: each submits under `name`; `required` blocks the form until a value is chosen
(Select, Checkbox, Radio group, Rating); a Select with nothing chosen, or cleared, submits `""`; a form reset brings back
the first value (Radix's own reset, after a Select clear too). Escape in an open Select returns focus to the trigger.
Rating moves by half stars with the arrows, mirrored in right-to-left, and clears a half with Space or Delete.

| Component | Test |
| --- | --- |
| Select | in a form: submits nothing chosen as "", is invalid while required, and submits the choice · a cleared value submits "" and blocks a required form again · a reset brings back the first value, after a clear too · closes on Escape without changing the value, and returns focus to the trigger |
| Checkbox | submits its value under name while checked, and goes back to its first state when the form is reset |
| Switch | submits its value under name while on, and goes back to its first state when the form is reset |
| Radio group | submits the chosen value under name, is required until one is chosen, and resets with the form |
| Rating | moves by half stars with the arrows, mirrored in right-to-left pages, and clears a half with Space or Delete · goes back to its first rating when the form is reset, and is required until a star is chosen |
| Slider | goes back to its first value when the form is reset · submits nothing while disabled, as a disabled input does |

## Native forms: every named control

Every control that takes `name` submits under it with the form, as the native control it stands for:

- **Disabled** submits nothing.
- **`form`** ties the value to a form by id, for a control placed outside it; the reset follows the same form.
- **Reset:** an uncontrolled control goes back to its `defaultValue` once the form has put its own fields back
  (`useFormReset`, a task after the `reset` event), and a cancelled reset changes nothing. A controlled value is the
  parent's: the reset leaves it alone, except where a component's own row says it proposes the first value through
  `onValueChange`.
- **Controlled:** the parent's `value` is what shows and what is submitted; a change is only proposed.
- **FileUpload** takes no `name`: files leave through its upload function, and a reset leaves its list alone.

| Component | Test |
| --- | --- |
| Date field | in a form: refused, accepted, transformed and later answers; a cleared segment; the same date again; reset, cancelled reset, controlled reset; `form` |
| Time field | in a form: a refused change keeps the parent's time; reset; `form` |
| Date picker | in a form: reset puts the date back in the field and the value; `form`; its own Bengali and Hindi month names |
| Date range picker | in a form: reset after a clear; `form` |
| Editor | in a form: nothing while disabled and the HTML again once enabled; reset; `form` |
| Knob | and its form: `form`, a cancelled reset, a controlled value left alone |
| Checkbox group, Listbox, Choice card, Colour picker | and its form: `form` (and the Colour picker's reset with it) |
| Autocomplete, Combobox | disabled on the root: disables the input, which submits nothing |
| Slider | submits nothing while disabled |

## Menu shortcuts: Dropdown menu, Context menu, Menubar

| State | Visual | Attributes / ARIA | Example | Test |
| --- | --- | --- | --- | --- |
| right-to-left | a shortcut hint at the row's end (left) in its written order, "⌘L" | `[unicode-bidi:plaintext]` on `*-shortcut` | Shortcuts (Dropdown menu, Context menu), Basic (Menubar) | keeps a shortcut hint in its written order on a right-to-left page |

## Shared date code

`dateFromParts(parts, timeZone)` tries the zone's offset a day before and a day after the wall time and keeps the one whose
instant shows that wall time: the first instant of a repeated time (clocks going back), and, for a time that never happens
(clocks going forward), the time moved forward by the jump, as `Date` does. Before, a skipped midnight (America/Santiago,
America/Havana) resolved to 23:00 of the day before. `expandYear(text, referenceYear)` reads short years. Tests:
`tests/lib/dates.test.js`.
