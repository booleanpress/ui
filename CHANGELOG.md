# Changelog

All notable changes to `@booleanpress/ui`. Versions follow the spec standard's rules (`specs/000_component-spec-standard.md`
§8): before 1.0.0, a breaking change is a minor version with a migration note.

## 0.1.0 — Unreleased

The initial release candidate: 114 components, each with its own entry (`@booleanpress/ui/<name>`), a page with an example
per state, and keyboard and axe tests; three sizes and a filled look for every control, documented variations and states, locale-aware formatting and forced-colours support.

### Form controls and migration

The current form contract is [spec 005](specs/005_form-contract.md). These are prelaunch changes to the candidate;
no published version is implied.

- Text fields use 26/34/42 px heights and 12/16, 14/20, 16/24 px font-size/line-height. Button sizes remain unchanged.
  Field borders, placeholder/icon colours, selected indicators, invalid and disabled states use the current form tokens;
  `--bui-shadow-field` controls the shared faint field shadow.
  Ten default control-edge pairs are below 3:1; unpressed toggle text (4.3439:1) and unmet inline password-rule text
  (4.34:1), plus attached InputGroup text (2.56:1), are below 4.5:1 in light mode. See **Default colours and contrast** for overrides and audit scope.
- Rating defaults to half steps, adds per-position templates and correct vertical half targets. Pass `allowHalf={false}`
  for the previous whole-step behavior. Slider starts at `[50]`; pass `defaultValue={[min]}` for the previous start.
- Textarea is fixed-height and native-width by default. Add `autoResize fluid` for the previous growing/full-width
  behavior. Automatic resizing preserves the native row minimum and responds to value, width and reset changes.
- Toggle accepts function children receiving `{ pressed }`. ToggleGroup now exposes pressed buttons in both selection
  modes and tabs through every enabled item. Add `rovingFocus` for the previous arrow/one-tab-stop model;
  `allowEmpty={false}` keeps the last selected item. CheckboxGroup parent selection now alternates all/none without
  restoring an older partial selection. Groups wrap horizontally by default; add `orientation="vertical"` for the previous stack.
- Password masking can be controlled, strength feedback accepts custom percentages and weighted rules, and the default
  score has four levels. Add `showToggle` to retain the previously automatic eye button. OTP accepts general characters
  by default; add `validationType="numeric"` for numeric validation and keypad behavior.
- ColorPicker includes format selection, channel fields/sliders, composed layouts and a browser eyedropper. Alpha is
  enabled by default; pass `alpha={false}` for the previous opaque arrangement. Supported colour strings can be used as
  input, while callbacks and form values remain normalized sRGB hex. Out-of-gamut OKLCH is clipped to sRGB.
- Listbox adds configurable focus/hover/modifier selection, controlled filtering and header composition. InputGroup
  supports attached cells; InputNumber accepts custom stepper icons. Date controls add inline range, ISO-week forwarding,
  year/month/day navigation and range-hover preview without committing early. DatePicker opens from its field by default; add
  `trigger="button"` to retain the attached button. Outside-month dates are disabled in both date pickers; pass
  `calendarProps={{ selectOutsideDays: true }}` to restore pointer selection. Arrow-key navigation still crosses months.
- Select and Autocomplete add optional popup arrows and documented filtering, multiple/chip, forced-selection and focus
  recipes using existing primitives. Autocomplete uses native lifecycle opacity/scale transitions with `--bui-ease-popup`. Select reserves a 40 px trigger indicator column at every size. Matching layouts do not require replacing the existing package entry points.

### The package

- **43 components from shadcn/ui,** each imported from its own entry (`@booleanpress/ui/<component>`) and typed for TypeScript, with a
  `.d.ts` for every entry: Alert, Alert dialog, Avatar, Badge, Breadcrumb, Button, Button group, Calendar, Card, Chart,
  Checkbox, Collapsible, Command, Dialog, Dropdown menu, Empty, Field, Input, Input group, Item, Kbd, Label, Native
  select, Pagination, Password input, Popover, Progress, Radio group, Scroll area, Select, Separator, Sheet, Sidebar,
  Skeleton, Spinner, Switch, Table, Tabs, Textarea, Toast (`@booleanpress/ui/sonner`), Toggle, Toggle group and Tooltip.
  They come from the shadcn/ui CLI 4.21.1 (new-york) on Radix; every change from stock is in `PATCHES.md`.
- **Server rendering.** The built files keep `"use client"` on every module that needs the browser, so a Next.js App
  Router app renders them on the server and hydrates them.
- **`BooleanUIProvider`:** translatable strings with English defaults, the text direction, the tooltip timing and the
  sidebar's storage key. No component writes English of its own.
- **`theme.css`:** shadcn/ui's token names with neutral defaults, plus `--control` for the edge of a form control; the
  motion tokens; overlays that fade out over 100 ms, opacity only (`<html data-bui-exits="off">` closes them at once);
  reduced motion; and resets that keep WordPress's admin styles off portalled overlays.
- **Right-to-left.** Every component uses logical classes (`ms-*`, `ps-*`, `start-*`, `text-start`), so layouts mirror in
  an RTL page; sheets slide in from the edge they sit on, chevrons turn round, the calendar's arrow keys follow the
  provider's direction, and a shortcut in Kbd keeps its written order.
- **`bui-contrast`:** a command for a product's lint that checks registered token/surface pairs at 4.5:1 for text
  and 3:1 for control edges in light and dark themes. Rendered CSS and opacity require browser checks.
- **Documentation:** <https://ui.booleanpress.com>, with a page for every component, the guides and the blocks, and the same pages as
  Markdown inside the package (`dist/docs/`, indexed by `dist/docs/llms.txt`), matched to the installed version.
- **AI assistant plugin** for Claude Code, Codex, GitHub Copilot, Cursor and Gemini CLI, installed from this repository's
  marketplace. Its seven skills read the Markdown documentation in the installed package.
- **MIT licence.** `NOTICE` keeps shadcn/ui's MIT notice.

### Maintainer tooling

- Ordinary CI and local development use `pnpm check:fast` for lint, types and unit tests. `pnpm check` remains the full
  release gate, including package, consumer and documentation verification.
- `pnpm build` builds runtime modules and types; `pnpm docs:markdown` separately generates the versioned documentation
  included in release packages. Internal entry sizes are informational through `pnpm bundle:size`.
- Removed the port-based documentation process killer; stop development servers with `Ctrl+C`. Product-specific
  recording and bundle-comparison tools are maintained privately.
- Component changes use a short contract record for maintenance and small additions; detailed specifications remain
  for complex interactions. Upstream provenance, translations, accessibility and behavioural tests remain required.
- Installation guidance now states the React 19 shared-runtime and WordPress overlay-stacking requirements.
  Consumers must verify these in their host screen; no component API or global WordPress styling changed.

### Beyond stock shadcn/ui

- **Dialog, Alert dialog and Sheet:** the panel uses the floating-surface tokens; dialogs fit below the WordPress admin
  bar, with a scrolling `DialogBody`; Dialog has `size` (`sm`, `md`, `lg`); the × is named from the provider; and focus
  never falls to `<body>` on close: it returns to the element that opened the overlay, or to `returnFocusTo` when that
  element is gone.
- **Form tokens:** text-field edges use `--control` and `--control-hover`; Switch uses the same palette for its off track.
  The default subtle-edge palette and its contrast exception are recorded in spec 005; consumers can override these tokens.
- **Select** opens below its field; **Tooltip** waits 500 ms; **Tabs'** inactive labels pass AA in every palette;
  **Checkbox's** mixed state shows a dash on the unfilled box.
- **Accessibility:** Command's hidden title sits inside its dialog and names its search field, and its separator no longer
  breaks the list; Item's group drops an invalid `role="list"`; a Scroll area or a wide Table that scrolls content with
  nothing focusable is reachable by keyboard; Password input's button keeps one name and reports its state with
  `aria-pressed`.
- **Sidebar** keeps its state in local storage under the provider's `sidebarStorageKey`, not in a cookie, and a menu
  button's tooltip stays closed unless the sidebar is collapsed to its icons.
- **Chart** draws after hydration, so a server-rendered page logs no hydration error. **Toast** takes its status colours
  from the status tokens and its theme as a prop.

### The full suite: 71 more components

- **Accordion, Slider, Context menu, Menubar, Navigation menu, Hover card, Aspect ratio:** new components from their shadcn stock, in the BooleanPress look, each with its own entry (`@booleanpress/ui/<name>`). Nothing to install: they use `radix-ui`, already a peer.
- **Action bar** (`@booleanpress/ui/action-bar`): `ActionBar`, `ActionBarButton`, `ActionBarSeparator` — a floating toolbar for selected items with "{count} selected" announced politely, roving focus and a clear-selection × (new string `clearSelection`). Consumers: nothing to do.
- **Autocomplete** (`@booleanpress/ui/autocomplete`): a free-text field with suggestions on Base UI Autocomplete — inline completion (`mode="both"`), async status, groups, clear, sizes, filled; works inside `Dialog` and `Sheet`. Consumers: install the optional peer `@base-ui/react` to use it.
- **Banner** (`@booleanpress/ui/banner`): `Banner`, `BannerTitle`, `BannerDescription`, `BannerActions` — a full-width page message in five tones with an icon, actions, a dismiss × (new string `dismiss`) and a sticky position. Consumers: nothing to do.
- **Carousel** (`@booleanpress/ui/carousel`): shadcn's carousel on Embla, with `CarouselFooter` and `CarouselDots`, vertical and right-to-left keys, and provider strings `carouselRole`, `slideRole`, `previousSlide`, `nextSlide`, `slideOf`, `goToSlide`. Install the peer `embla-carousel-react` to use it.
- **Cascade select** (`@booleanpress/ui/cascade-select`): choose a leaf from a tree in menus that open level by level (Radix Dropdown Menu submenus), with the select field's sizes, `filled`, `fluid`, `clearable`, `showPath`, lazy levels through `loadOptions`, and reopening on the chosen option. No new strings; nothing to install.
- **Chat:** new component (`@booleanpress/ui/chat`): `ChatThread` (a `role="log"` that sticks to the newest message and offers a "New messages" jump), `ChatMessage` (author, avatar, time in the provider's locale and time zone, sending / sent / failed with retry), `ChatBubble`, `ChatAttachment`, `ChatDateSeparator`, `ChatTypingIndicator` and `ChatComposer` (Enter sends, Shift+Enter adds a line; never while an input method is composing; `onSend` gets an empty text when only attachments are sent). Nothing to install.
- **Checkbox group** (`@booleanpress/ui/checkbox-group`): `CheckboxGroup`, `CheckboxGroupItem` (optional label and description) and `CheckboxGroupParent` (mixed state, enabled all/none selection, nested subsets) on the library's Checkbox; new string `selectAll`. Consumers: nothing to install.
- **Chip** (`@booleanpress/ui/chip`): `Chip` with an icon or image and a remove button (Enter, Space, Backspace, Delete; focus moves to the next chip) and `ChipGroup`; new string `removeItem`. Consumers: nothing to install.
- **Choice card** (`@booleanpress/ui/choice-card`): `ChoiceCardGroup` (`type="single"` radios or `"multiple"` checkboxes) and `ChoiceCard` with title, description, icon and aside. Consumers: nothing to install.
- **Close button** (`@booleanpress/ui/close-button`): Dialog's round ×, for any panel or notice, named from the `close` string (or `label`), in three sizes. Consumers: nothing to install.
- **Code block** (`@booleanpress/ui/code-block`): code in the visual target's panel with a copy button, optional title bar, line numbers, highlighted lines, a wrap toggle and a scrolling, focusable region; takes a highlighter's HTML as `html` (no highlighter in the package). New strings `wrapLines`, `codeBlock`. Consumers: nothing to install; bring Shiki or Prism to colour code.
- **Color picker** (`@booleanpress/ui/color-picker`): `ColorPicker` (saturation/brightness area on React Aria's ColorArea model, hue and optional alpha sliders, hex field, preset swatches, vertical layout), `ColorPickerPopover` and `ColorSwatch`; new strings `colorPicker`, `hue`, `saturation`, `brightness`, `alpha`, `hexColor`, `colorSwatches`. Consumers: nothing to install.
- **Combobox** (`@booleanpress/ui/combobox`): shadcn's combobox on Base UI Combobox with the library's field and list look — filtering, chips for `multiple`, clear, loading status, groups, custom options, virtualisation, sizes, filled; works inside `Dialog` and `Sheet`. New strings `noResults`, `loadingResults`, `toggleOptions`. Consumers: install the optional peer `@base-ui/react` to use it.
- **Confirm** (`@booleanpress/ui/confirm`): `ConfirmProvider` and `useConfirm()` — `await confirm({ title, description, tone, onConfirm, … })` opens the library's alert dialog and resolves `true` or `false`; async `onConfirm` with a spinner, queued confirmations, focus returned. New strings `confirm`, `confirmTitle`, `delete`. Consumers: nothing to install; render `ConfirmProvider` once inside `BooleanUIProvider` to use it.
- **Confirm popup** (`@booleanpress/ui/confirm-popup`): `ConfirmPopup`, `ConfirmPopupTrigger`, `ConfirmPopupContent` — a small confirmation anchored to its trigger, with an arrow, async `onConfirm` and four placements. Uses the new `confirm` and `delete` strings. Consumers: nothing to do.
- **Copy button** (`@booleanpress/ui/copy-button`): copies `value` or `getValue()` with the Clipboard API and a copy-command fallback, then shows a check and "Copied" in its tooltip or label and in a polite status region; also exports `copyText()`. New strings `copy`, `copied`, `copyFailed`. Consumers: nothing to install. `copyText(text, container?)` copies without the Clipboard API too, inside a dialog.
- **Data table** (`@booleanpress/ui/data-table`): `DataTable` on TanStack Table 9 with sorting (multi-sort with Shift), global and per-column filtering, pagination (First and Last included; `pagination={{ showEdges: false }}` leaves them out), single and multiple selection, row expansion, grouping with totals, cell editing, column resizing, ordering and visibility, a sticky header and frozen columns, row virtualisation, loading and empty states, sizes, gridlines and stripes, each state controlled or not, and server mode; plus `useDataTable`, `DataTableColumnHeader`, `DataTableToolbar`, `DataTablePagination`, `DataTableRowActions`, `exportToCsv` and `downloadCsv`. Consumers who use it install the peers `@tanstack/react-table` (9) and `@tanstack/react-virtual` (3); 20 new provider strings (`sortAscending` … `noRows`) take English defaults. Row reordering comes from a second entry, `@booleanpress/ui/data-table-reorder`: `ReorderableDataTable` takes every prop of `DataTable` and adds a drag handle at the start of each row (pointer or keyboard: Space picks up, the arrows move, Space drops, Escape cancels; each step announced in the table's live region with the `dragHandle`, `dragStarted`, `itemMoved` and `dragCancelled` strings); `onRowOrderChange(data, { rowId, from, to })` gives `data` in its new order. New type `DataTableRowMove`. Reordering needs the peers `@dnd-kit/core` and `@dnd-kit/sortable`; `DataTable` alone needs neither.
- **Data view** (`@booleanpress/ui/data-view`): `DataView`, `DataViewLayoutToggle` and `DataViewSort` — items as rows or a grid from `renderItem(item, layout)`, with a sort select, a list/grid switch, pages, loading placeholders, a dimmed refreshing state and an empty state; sorts and pages in the browser or leaves both to the server (`total`). New strings `layout`, `layoutList`, `layoutGrid`, `sortBy`, `noItems`. Consumers: nothing to install.
- **Date field** (`@booleanpress/ui/date-field`): `DateField`, the same segmented pattern for a date in the locale's order (day, month, year), with `min`/`max`, sizes and filled. New strings `day`, `month`, `year`. Consumers: nothing to install.
- **Date picker** (`@booleanpress/ui/date-picker`): `DatePicker`, a typed date field (locale format or a `format` pattern, parsed on blur and Enter; unparseable text stays, marks the field invalid and empties the value) with the Calendar in a popup — `trigger` button / icon / field, `min`/`max`, `mode="multiple"`, `showButtonBar`, `showTime`, `view="month" | "year"`, `numberOfMonths`, `inline`, `clearable`, sizes, filled, fluid; dates in the provider's `locale` and `timeZone`. New strings `today`, `chooseDate`, `hour`, `minute`, `dayPeriod`, `chooseYear`, `previousYear`, `nextYear`, `previousYears`, `nextYears`. Consumers: install the `react-day-picker` peer.
- **Date range picker** (`@booleanpress/ui/date-range-picker`): `DateRangePicker`, a field for a first and last day with a two-month range calendar, presets (Today, Yesterday, Last 7 days, Last 30 days, This month, Last month, or your own) and optional Cancel/Apply; types `DateRangeValue`, `DateRangePreset`. New strings `chooseDateRange`, `apply`, `cancel`, `presetToday`, `presetYesterday`, `presetLast7Days`, `presetLast30Days`, `presetThisMonth`, `presetLastMonth`. Consumers: install the `react-day-picker` peer.
- **Description list** (`@booleanpress/ui/description-list`): `DescriptionList` and `DescriptionItem` — label and value pairs in a `dl`, labels above or beside, one to three columns with `span`, a bordered table look, three sizes and an `action` slot. Consumers: nothing to install.
- **Drawer** (`@booleanpress/ui/drawer`): a panel from an edge that closes when dragged back, on Base UI's Drawer with shadcn's parts (`direction`, `asChild`). Install the peer `@base-ui/react` to use it.
- **Editor:** new rich-text field (`@booleanpress/ui/editor`) on Tiptap 3: a toolbar (text style, bold, italic, underline, strikethrough, code, lists, quote, link, undo, redo) with one tab stop, HTML `value` / `onChange`, `placeholder`, `readOnly`, `disabled`, `aria-invalid`, a character count and limit, sizes and the filled variant. Install its optional peers to use it: `@tiptap/react`, `@tiptap/pm` and `@tiptap/starter-kit` (3.31 or later).
- **Fieldset** (`@booleanpress/ui/fieldset`): a native `<fieldset>` with its `<legend>` on the box's edge; `toggleable` turns the legend into a disclosure button. Nothing to install.
- **File upload** (`@booleanpress/ui/file-upload`): flat parts — `FileUpload`, `FileUploadDropzone`, `FileUploadTrigger`, `FileUploadSubmit`, `FileUploadClear`, `FileUploadList` (list or grid), `FileUploadItem`, `FileUploadPreview`, `FileUploadProgress`, `FileUploadErrors` — plus `useFileUpload()` and `formatFileSize()` (B, KB, MB and GB, the number in the provider's locale): picking, dropping, `accept` / `maxSize` / `maxFiles` checks with messages, image previews, per-file progress through your `onUpload(files, { onProgress, onError, signal })`, `auto` upload and a polite live region. New provider strings `chooseFiles`, `upload`, `dropFilesHere`, `browseFiles`, `uploadComplete`, `uploadFailed`, `fileTooLarge`, `fileTypeNotAllowed`, `tooManyFiles`, `fileAdded`, `filesAdded`. Nothing to install. Removing a file during its upload aborts it (`fileSignal(file)` in `onUpload`'s helpers); a dropped folder is refused (`folderNotAllowed`).
- **Float label** (`@booleanpress/ui/float-label`): a label inside an empty field that moves above it (`over`), into its top (`in`) or onto its edge (`on`) on focus or with a value; works with Input, Textarea, Password input, Input group, Native select, Select, Input mask and Input number (with buttons on both sides, the label starts past the minus button). Nothing to install.
- **Format** (`@booleanpress/ui/format`): `FormatNumber`, `FormatCurrency`, `FormatBytes`, `FormatDate` and `FormatRelativeTime` write a value with `Intl` in the provider's `locale` and `timeZone`, inside a `data` or `time` element; `formatNumber`, `formatCurrency`, `formatBytes`, `formatDate` and `formatRelativeTime` do the same outside JSX. Sizes read B, KB, MB and GB (KiB, MiB, GiB with binary steps), or the locale's own unit words with `unitDisplay` (`short`, `narrow`, `long`). Nothing to install.
- **Icon button** (`@booleanpress/ui/icon-button`): a square Button whose `label` is required by its type and becomes its name, with an optional tooltip of the same words; four sizes with the visual target's icon sizes. Consumers: nothing to install.
- **In-field label** (`@booleanpress/ui/in-field-label`): a 10 px label fixed in the top of its field, with the same fields as Float label. Nothing to install.
- **Inplace** (`@booleanpress/ui/inplace`): `Inplace` — a value that becomes an Input, Textarea or your own editor on click or Enter; Enter, ✓ or blur saves, Escape or × cancels, async `onSave` with a spinner and an error message. New strings `edit`, `save`, `saving`, `saveFailed`. Consumers: nothing to do.
- **Input mask** (`@booleanpress/ui/input-mask`), new: a text field that keeps a pattern such as `(999) 999-9999`, with an optional part, `slotChar`, `unmask` and `autoClear`. Nothing to install.
- **Input number** (`@booleanpress/ui/input-number`), new: a number field on Base UI's Number Field, formatted in the provider's `locale`, with `min`, `max`, `step`, `format` (currency, percent, units), stacked, horizontal or vertical stepper buttons, prefix and suffix, Page Up and Page Down. Install the `@base-ui/react` peer to use it. New strings: `increment`, `decrement`, `numberFieldRole`.
- **Input OTP** (`@booleanpress/ui/input-otp`): one-time code boxes on Base UI's OTP Field with shadcn's parts, sizes, `filled` and mask, and the provider string `otpCharacter`. Digits by default (`validationType="numeric"`, `inputMode="numeric"`, `autocomplete="one-time-code"`); pass `validationType="alphanumeric"` for a code with letters. Install the peer `@base-ui/react` to use it.
- **Knob** (`@booleanpress/ui/knob`): a round `role="slider"` dial with arrow, Page and Home/End keys, pointer drag, `formatValue`, stroke width, sizes, colours, read-only and disabled. Consumers: nothing to install. A `name` submits its value with the form, and a form reset brings back the first value.
- **Link** (`@booleanpress/ui/link`): a text link in the primary colour, `muted` or `destructive`, three sizes or the surrounding text's, underlined on hover or always, `external` (new tab, `rel="noopener noreferrer"`, an arrow and a hidden "(opens in a new tab)"), `visited`, `disabled` and `asChild` for router links. New string `opensInNewTab`. Consumers: nothing to install.
- **Listbox** (`@booleanpress/ui/listbox`): an always-visible APG listbox on plain elements — single or multiple selection, check or checkbox marks, groups, filter, type-ahead, disabled options. Consumers: nothing to install. A `name` submits the chosen values; "No results" is announced from a status region after the list.
- **Loading overlay** (`@booleanpress/ui/loading-overlay`): `LoadingOverlay` — a mask with a spinner (or your indicator) and an announced label over a region or, with `fullScreen`, the whole window; the blocked content is `aria-busy` and `inert`, and focus returns when it ends. Consumers: nothing to do.
- **Meter group** (`@booleanpress/ui/meter-group`): `MeterGroup`, `MeterGroupMeters` and `MeterGroupLegend` — several amounts on one track, each segment a `role="meter"`, with a legend (start or end, row or column), icons, a vertical orientation, `min`/`max` and custom legends. Consumers: nothing to install.
- **Multi-select** (`@booleanpress/ui/multi-select`): a select-like field for several choices on Base UI Combobox (`multiple`, input inside the list) — labels, chips, "3 selected" or "+2 more", type-to-filter, select all, check or checkbox options, clear, sizes, filled, fluid; works inside `Dialog` and `Sheet`. New strings `filterOptions`, `selectedCount`, `moreSelected`. Consumers: install the optional peer `@base-ui/react` to use it.
- **Order list** (`@booleanpress/ui/order-list`): `OrderList`, a multi-select listbox put in order with Move buttons, Alt and the arrow keys, or by dragging (mouse, touch, keyboard with Enter), announced politely from new provider strings; `OrderListGroup` to drag between lists; `moveItems` helper. New strings `moveUp`, `moveDown`, `moveToTop`, `moveToBottom`, `itemMoved`, `itemsMoved`, `dragHandle`, `dragStarted`, `dragCancelled`. Install the peers `@dnd-kit/core` and `@dnd-kit/sortable` to use it.
- **Overlay badge** (`@booleanpress/ui/overlay-badge`): pins a count or a dot to an icon, a button or an avatar, and reads its required `label` with the element. Consumers: nothing to install.
- **Page header** (`@booleanpress/ui/page-header`): `PageHeader` and its parts — breadcrumb, title (`h1` or `as`), meta, description and actions that fold into a "More actions" menu below 36rem of the header's width. Consumers: nothing to do.
- **Panel** (`@booleanpress/ui/panel`): a bordered box with a header (title, actions, toggle), content and footer; `toggleable` folds the content on Radix Collapsible, controlled with `open` / `onOpenChange`; the toggle is named "Show or hide {title}" (new string `toggleContent`) through `aria-labelledby`, so give `PanelTitle` your own `id` on the part itself, not on an `asChild` child. Nothing to install.
- **Pick list** (`@booleanpress/ui/pick-list`): `PickList`, two order lists with Move to target / Move all to target / Move to source / Move all to source buttons and dragging between them; `transferItems` helper. New strings `moveToTarget`, `moveAllToTarget`, `moveToSource`, `moveAllToSource`, `sourceList`, `targetList`. Install the peers `@dnd-kit/core` and `@dnd-kit/sortable` to use it.
- **Progress circle** (`@booleanpress/ui/progress-circle`): a ring that fills with a value or turns while indeterminate, in three sizes and the status colours, with an optional value in the middle. A name (`aria-label` or `aria-labelledby`) is required. Nothing to install.
- **Rating** (`@booleanpress/ui/rating`): star rating on Radix RadioGroup with half stars, any number of stars, custom icons, read-only (`role="img"`), sizes. Choosing the current rating again (a click, or Space or Enter on the checked star), Backspace or Delete clears it to 0, announced as "Rating cleared"; `allowClear={false}` turns clearing off. New strings `ratingValue`, `ratingCleared`. Consumers: nothing to install.
- **Scroll top** (`@booleanpress/ui/scroll-top`): a round button that appears after the window, or the box it sits in, scrolls past a threshold, and scrolls back to the top (a jump under reduced motion). New string `scrollToTop`. Nothing to install.
- **Search field** (`@booleanpress/ui/search-field`), new: a search box in a search landmark, with a clear button, Escape to clear, a loading spinner and `onSearch` on Enter. New string: `search`. Its landmark is a `div role="search"`, so it works inside a form (a settings page): Enter calls `onSearch` and never submits the form.
- **Segmented control** (`@booleanpress/ui/segmented-control`): `SegmentedControl` and `SegmentedControlItem`, a radio group drawn as joined equal segments with a plate that slides by transform; sizes, fluid, icon-only, disabled, invalid. Consumers: nothing to install.
- **Speed dial** (`@booleanpress/ui/speed-dial`): a floating action button that opens a menu of icon actions in a line, circle, semicircle or quarter circle, with tooltips, a stagger and an optional mask; transform and opacity motion. New string `speedDialActions` ("Actions"). Nothing to install.
- **Splitter** (`@booleanpress/ui/splitter`): resizable panels (`Splitter`, `SplitterPanel`, `SplitterHandle`), shadcn's Resizable renamed, on react-resizable-panels 4, with the window-splitter keys. Install the peer `react-resizable-panels` to use it; sizes are strings in percent (`"30%"`), numbers are pixels.
- **Statistic** (`@booleanpress/ui/statistic`): `Statistic` and `StatisticGroup` — a label and a number written with `Intl` in the provider's locale (number, currency, percent, compact), a coloured trend with words for screen readers, help text, an icon, a card look, sizes and a loading placeholder. New strings `trendUp`, `trendDown`. Consumers: nothing to install.
- **Stepper** (`@booleanpress/ui/stepper`): an ordered list of steps with `aria-current="step"`, horizontal or vertical, `linear`, completed and error states, content panels and Back / Next buttons. New strings `stepOf`, `stepCompleted`, `stepError`, `back`, `finish`. Nothing to install.
- **Tags input** (`@booleanpress/ui/tags-input`): a field that turns typed text into removable `Chip` tags — Enter or a delimiter adds, paste splits, no duplicates by default, `max`, per-tag icons, suggestions (Base UI Autocomplete), sizes, filled. Consumers: install the optional peer `@base-ui/react` to use it.
- **Time field** (`@booleanpress/ui/time-field`): `TimeField`, a segmented time input (hours, minutes, optional seconds, AM/PM by locale; each segment a spin button with arrows, digits, Backspace, Delete, Home, End), `step`, `min`/`max`, sizes, filled. New strings `hour`, `minute`, `second`, `dayPeriod`, `emptySegment`. Consumers: nothing to install.
- **Timeline** (`@booleanpress/ui/timeline`): `Timeline`, `TimelineItem`, `TimelineSeparator`, `TimelineMarker`, `TimelineConnector`, `TimelineContent` and `TimelineOpposite` — an ordered list of events with `align` start, end or alternate, opposite content, a horizontal orientation and custom markers. Consumers: nothing to install.
- **Toolbar** (`@booleanpress/ui/toolbar`): Radix Toolbar with one tab stop and arrow keys between `ToolbarButton`s (Button's looks), `ToolbarToggleGroup` / `ToolbarToggleItem`, `ToolbarLink`, `ToolbarSeparator`, `ToolbarGroup` and an ellipsis `ToolbarOverflowButton` for a dropdown menu. New string `moreActions`. Nothing to install.
- **Tour** (`@booleanpress/ui/tour`): a step-by-step walkthrough on Radix Popover — a card anchored to each step's element (ref, selector or function; centred without one), Next, Back, Skip tour and Finish, a step count, an optional spotlight mask, Escape to end, arrow keys between steps, targets scrolled into view. New strings `skipTour`, `tourStep`. Consumers: nothing to install.
- **Tree** (`@booleanpress/ui/tree`): a WAI-ARIA tree with single, multiple and checkbox selection (mixed parents), filter, lazy children, loading and empty states, moving nodes with Alt and the arrows, and pointer dragging with `DraggableTree` from `@booleanpress/ui/tree-drag` (which needs `@dnd-kit/core`); helpers `moveTreeNode`, `getExpandableIds`, `useTreeState`; new strings `filterTree`, `treeLoading`. Nothing to install for `Tree` itself.
- **Tree select** (`@booleanpress/ui/tree-select`): a select field opening a Tree to choose one node, several, or checked branches, with comma or chip display, filter, clear, sizes, filled, fluid, disabled and invalid. Nothing to install.
- **Tree table** (`@booleanpress/ui/tree-table`): a treegrid table of nested rows with sorting per level, single, multiple and checkbox selection (mixed parents, select all), pagination of top-level rows, sizes, gridlines, stripes, a scrolling sticky header, lazy children, loading and empty states; new strings `expandNode`, `collapseNode`, `expandAll`, `collapseAll`. Nothing to install.
- **Typography** (`@booleanpress/ui/typography`): `Prose` styles Markdown or rich-text HTML with the visual target's documentation scale (h1 30/36 to h4 16/24, running text 16/24); `Heading`, `Text`, `Blockquote` and `InlineCode` set the same scale on your own elements. Consumers: nothing to install.
- **Virtual scroller** (`@booleanpress/ui/virtual-scroller`): `VirtualScroller`, a focusable region that renders only the items in view (vertical, horizontal or grid; fixed or measured sizes; lazy loading with `onLoadMore` and placeholder rows; `scrollToIndex` through a ref), keeping `aria-setsize` / `aria-posinset` on its list items. New string `loadingMore`. Install the peer `@tanstack/react-virtual` to use it.

Every new control that takes `name` behaves as the native control it stands for: a disabled one submits nothing; `form`
ties it to a form by id when it sits outside it; a form's Reset puts an uncontrolled one back to its `defaultValue` (and
a cancelled Reset changes nothing); a controlled one shows and submits only the parent's `value`, so a change the parent
refuses is undone. FileUpload is the exception: files leave through its upload function, not with the form.

### Added to the shadcn/ui components

- **Alert:** `appearance` (`outline`, `simple`), `size` (`sm`, `lg`), and `duration` with `onDismiss` for an alert that removes itself, paused on hover and focus. Alert is now a client component (`"use client"`). Nothing to do.
- **Badge:** `severity` (solid fills), `count` with `max` (`99+`, locale-formatted), `dot` (8 px, named or `aria-hidden`), `size` (`sm`, `default`, `lg`) and `rounded`; new string `badgeOverflow`. The module is now a client component (`"use client"`): call `badgeVariants()` from a client module. Consumers: nothing else.
- **Button group:** raised buttons lift the whole group on one shadow, and rounded buttons make it a pill. Consumers: nothing.
- **Button:** `severity` (`success`, `info`, `warning`, `help`, `danger`, `contrast`) colours the solid, outline, ghost and link variants; `raised`, `rounded` and `loading` (spinner in place of the icon, `aria-busy`, disabled). The severities' colours are new tokens (under **The look**). Consumers: nothing; a `brand.css` with its own status colours may set them, and `bui-contrast` measures them.
- **Calendar:** follows the provider's `locale`: month and weekday names, dropdowns, digits and each day's name come from `Intl`, and the week starts on the locale's first day where the browser knows it. The labels' words are new provider strings (`todayDate`, `selectedDate`, `previousMonth`, `nextMonth`, `monthNavigation`, `weekNumber`, `weekNumberHeader`; the dropdowns use `month` and `year`). The month arrows are now named "Previous month" and "Next month" (were "Go to the Previous Month"/"Go to the Next Month"): update tests that query those names. English pages look the same. A product that passes DayPicker's `locale` keeps it.
- **Checkbox:** `size` (`sm` 14 px, `default` 18 px, `lg` 20 px), `variant="filled"`, and `icon` / `indeterminateIcon` for custom marks; `size` and `variant` default to the provider's. Nothing to do.
- **Dialog:** `size="full"`, `position` (`center`, `top`, `bottom`, `start`, `end`), `maximizable` with `maximized` / `defaultMaximized` / `onMaximizedChange`, `scroll="outside"`, and a usable non-modal dialog (`modal={false}`: it stays open while the page is used, and Tab moves on to the page). New strings `maximize` and `restore`; translated products add them. Nothing else to do.
- **Input group:** `size` and `variant="filled"` on the group (the control, icons, text addons and buttons scale with it); `clearable` on `InputGroupInput`; a `Checkbox`, a `RadioGroupItem` or a `Select` can sit in an addon as a cell. Nothing to do.
- **Input:** `keyFilter` lets only some characters in, typed or pasted: `int`, `num`, `money`, `hex`, `alpha`, `alphanum` or a regular expression; the number presets follow the provider's `locale`. Nothing to change.
- **Input:** `size` (`sm`, `default`, `lg`), `variant="filled"` and `clearable` (a × that empties the field, calls `onChange` and refocuses it; named by the `clear` string). The native numeric `size` attribute is no longer in the props type: set a width with a class. The file is now a client module. Nothing else to do.
- **Native select:** `size="lg"` (42 px), `variant="filled"` and `fluid`; `size` and `variant` default to the provider's `controlSize` and `fieldVariant`. It is now a client module. Nothing to do.
- **Pagination:** new parts `PaginationPages` (pages from `page` and `pageCount`, with `siblings` and `boundaries`), `PaginationRange`, `PaginationRowsPerPage` and `PaginationJump`, and the helper `getPaginationItems`. New strings `rowsPerPage`, `pageRange` (`{start}`, `{end}`, `{total}`) and `goToPage`; translated products add them. Numbers follow the provider's `locale`. `PaginationFirst` and `PaginationLast` (double chevrons, turned in right-to-left pages, strings `firstPage` and `lastPage`) and `showEdges` on `PaginationPages` add the first and last pages. Nothing else to do.
- **Password input:** `rules` shows a checklist that ticks as the value meets each rule, `strength` a weak, medium or strong meter (replace the score with `scoreStrength`; `scorePasswordStrength` is exported), and `feedback="popover"` shows both in a panel while the field has focus; changes are announced politely. New strings: `passwordStrength`, `strengthWeak`, `strengthMedium`, `strengthStrong`, `ruleMet`, `ruleNotMet`. Nothing to change without the new props.
- **Password input:** `size`, `variant="filled"` and `clearable` (a × before the eye). Nothing to do.
- **Progress:** a bar with no `value` now slides across the track (indeterminate) instead of drawing nothing; `size` (`sm`, `default`, `lg`), `steps` (segments) and `showValue` (the value inside the fill) are new; `max` now sets the fill (`value / max`) as well as `aria-valuemax`; the value text is a percentage in the provider's `locale` unless `getValueLabel` is given. Check any bar rendered without a value while loading: it now animates.
- **Radio group:** `size` (`sm` 14 px, `default` 18 px, `lg` 20 px) and `variant="filled"`, on the group or on one radio; they default to the provider's. Nothing to do.
- **Scroll area:** `fade` fades the content at the edges where more of it is hidden. New examples for both scrollbars and for `type`. Nothing to do.
- **Select:** `SelectTrigger` takes `size="lg"` (42 px), `variant="filled"`, `fluid` and `clearable` (a clear button that resets the value to the placeholder); `size` and `variant` default to the provider's `controlSize` and `fieldVariant`. `SelectItem` takes `icon` and `description`, shown in the list only. Nothing to do; a clearable trigger renders in a wrapper (`data-slot="select-control"`), so a layout class such as `flex-1` that must reach the outer box goes on your own wrapper.
- **Separator:** `variant` (`solid`, `dashed`, `dotted`), and content inside the line with `align` (`start`, `center`, `end`; `top`, `bottom` on a vertical line). Consumers: nothing.
- **Sheet:** `size="full"` covers the window below the admin bar. Nothing to do.
- **Sidebar:** new examples for the floating and inset variants, a dual sidebar and a nested menu; no change to the component. Nothing to do.
- **Switch:** `size="lg"` (44 × 26 px), and `checkedIcon` / `uncheckedIcon` for an icon in the thumb; `size` defaults to the provider's `controlSize`. Nothing to do.
- **Tabs:** `scrollable` on `TabsList` scrolls a long row with previous and next buttons; `onClose` on `TabsTrigger` makes a tab closable (an × and the Delete key; the neighbour takes the selection and focus); a new `TabsIndicator` part slides one bar to the selected tab. New strings `scrollTabsBackward`, `scrollTabsForward` and `closeTab`: translate them. With `scrollable`, `className` styles the box around the list. Nothing else to do.
- **Textarea:** `size` (`sm`, `default`, `lg`) and `variant="filled"`. The file is now a client module. Nothing to do.
- **Toast:** a `toast.custom()` or `unstyled` toast no longer takes the package's card padding, shadow and title weight; draw its card yourself (the Custom example shows the classes). New examples: position, sticky, update in place, custom and expanded.
- **Toggle:** `fluid`; `size` defaults to the provider's `controlSize` and is set as `data-size`. Nothing to do.
- **Toggle group:** `fluid` (the items share the width) and an invalid state (`aria-invalid` on the group); `size` defaults to the provider's `controlSize`. Nothing to do.
- **Tooltip:** `arrow={false}` on `TooltipContent` leaves out the arrow (it stays on by default). New examples for standalone triggers, the arrow, offsets, per-tooltip delay and the controlled state. Nothing to do.

### Theme, provider and strings

- **Sizes and the filled look, app-wide.** Every control takes `size` (`sm` 28 px, `default` 35 px, `lg` 42 px for a
  field) and every field `variant="filled"`; without the prop, the provider's new `controlSize` and `fieldVariant` apply
  (`<BooleanUIProvider controlSize="sm" fieldVariant="filled">`).
- **Locale and time zone.** The provider takes `locale` and `timeZone`; the calendar, date and time fields, number field,
  pagination's range, file sizes, statistics, chat times and `@booleanpress/ui/format` format with them (`Intl`). An app
  rendered on the server passes `locale`, or the server and the browser may format a date differently. WordPress's
  forms are accepted as they come (`de_DE`, `de_DE_formal`, a `+02:00` offset), and a value `Intl` cannot read falls
  back to the default instead of throwing.
- **Nested providers inherit.** A `BooleanUIProvider` inside another changes only the props it is given and takes the
  rest from the one above, strings key by key, so a part of the page can take its own `locale` and keep the app's
  direction, strings and sizes. A nested provider without `tooltipDelay` or `tooltipSkipDelay` shares the outer tooltip
  timing.
- **Badge tags are opaque in dark:** each `--{tone}-tag` is the visual target's 16 % tint mixed over `--card`, so a tag
  stays legible on any surface, a selected (near-white) table row included.
- **200 new strings,** each with an English default (219 in all): a translated product adds them to its map; the strings
  guide's table lists every key and the components that read it. A string with a value in it carries a `{name}`
  placeholder, filled by the new `fillString()` from `@booleanpress/ui/utils`.
- **Forced colours:** in Windows contrast themes and other forced-colours modes, `theme.css` now redraws what a fill or a shadow alone drew: switch thumbs, sliders, progress and meter fills, the chosen tab, pressed toggles and segments, chosen days, highlighted options and selected rows (in `Highlight`), separators and dot badges, tooltip and badge edges, and a 2 px `Highlight` outline on every keyboard focus. Nothing to change; import `theme.css` as before.
- **Fields on touch screens.** On a phone or tablet (`pointer: coarse`), every field's text is 16 px, the new
  `--bui-field-text-touch`, so Safari on iPhone and iPad no longer zooms the page into a field the user taps. A
  single-line field keeps its height (28, 35 or 42 px); a textarea and the editor grow by a few pixels a line. With a
  mouse nothing changes. Nothing to do; import `theme.css` as before.
- **Motion for newer overlays.** An overlay that carries `data-bui-motion="overlay"` or `"modal"` takes the theme's
  durations, exit fade and reduced-motion rule, whether its primitive is Radix or Base UI; the WordPress admin reset
  covers it too.
- **`bui-contrast` measures the interactive steps:** the text on the primary and destructive fills' hover and press
  steps, on `--secondary-hover` and on a chosen option with focus (`--highlight-focus`), 220 pairs in all.

### Optional packages

Each is an optional peer: install it only for the components that need it.

| Package | For |
| --- | --- |
| `recharts` 3 | Chart |
| `react-day-picker` 10 | Calendar, Date picker, Date range picker |
| `sonner` 2 | Toast |
| `@base-ui/react` | Combobox, Autocomplete, Multi-select, Tags input (suggestions), Drawer, Input OTP, Input number |
| `embla-carousel-react` | Carousel |
| `react-resizable-panels` | Splitter |
| `@tanstack/react-table` | Data table |
| `@tanstack/react-virtual` | Data table, Virtual scroller; the Combobox example of a long list |
| `@dnd-kit/core`, `@dnd-kit/sortable` | Order list, Pick list, `ReorderableDataTable` (`data-table-reorder`) |
| `@dnd-kit/core` | `DraggableTree` (`tree-drag`) |
| `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit` | Editor |

Command brings `cmdk` as a dependency.

### Documentation

- **Blocks:** whole screens built from the library — Sign in, Settings page, Table page and Dashboard — at desktop and
  phone width, with their code; the package's Markdown documentation holds them too (`dist/docs/blocks/`, listed in
  `dist/docs/llms.txt`).
- **Forms guide:** labels, descriptions, errors, required fields, focus on the first error and server errors with the `Field` parts, recipes for React Hook Form with Zod, TanStack Form and plain React (`useActionState`), and how each control's value maps. The Accessibility guide has a Forced colours section.
- **Component pages:** a live preview at the top, then Installation (the command for npm, pnpm, yarn or bun, with any
  extra package the component needs), Usage (the import and one code sample), the examples, Accessibility and, last, the
  **API Reference**: each part's props, the styling hooks and the theme tokens. The right column links to it, beside
  Source and Copy Markdown.
- **Layout:** the page grows with the window up to 1728 px, with the guides, components and blocks each listing only
  their own pages on the left. Below 1280 px a pill at the foot of the window shows the section being read and opens the
  page's contents.
- **Examples:** the code opens on its first three lines under a **View Code** button and then scrolls in a box at most
  300 px tall; a toolbar button opens and closes it, and another opens the example on its own page. Every code block has
  a copy button.
- **Keyboard tables** read alternatives as "Enter or Space" and combinations as "Shift + Tab", with one spelling per key.
- **Search** puts a page whose title is what was typed first ("date picker" opens on Date picker).
- **API tables** list variant props (`variant`, `size`, `severity` …) and the props of generic components.

### The look

- **The look.** Slate greys with a near-black primary; 14 px text on a 21 px line in every control, at every width;
  buttons and text fields 35 px tall, icon buttons 36 px, checkboxes and radios 18 px; a 1 px focus outline 2 px from the
  part, where a text field turns its edge `--ring` instead; a 4 px radius on small parts, 6 px on controls and menus, 8 px
  on popovers and 12 px on dialogs and cards; cards with a soft shadow; underline tabs. A control's hover, press, focus
  and checked colours change over 200 ms. The documentation draws it in Inter; your product keeps its own font. Every
  class change is in `PATCHES.md` §4.
- **New tokens** in `theme.css`, with light and dark defaults:
  - actions: `--primary-hover`, `--primary-active`, `--secondary-hover`, `--secondary-hover-foreground`,
    `--secondary-active`, `--destructive-hover`, `--destructive-active`, and `--subtle`, the lightest hover;
  - selection: `--highlight`, `--highlight-foreground` and `--highlight-focus`, for a chosen option, the current page,
    a selected table row and the days inside a range;
  - fields: `--field`, `--field-filled` (the filled look), `--field-disabled`, `--field-disabled-foreground`,
    `--control-hover` and `--invalid`;
  - headings and strong text in Typography and Tour: `--heading`;
  - the backdrop of dialogs and sheets: `--mask`;
  - status: `--warning-strong`, and for each of `destructive`, `success`, `warning` and `info` the `-subtle` fill, the
    `-border` edge and the `-tag` and `-tag-foreground` pair of badges;
  - severities of buttons and solid badges: `--success-hover`, `--success-active`, `--success-edge`,
    `--success-ghost-hover`, `--success-ghost-active`; `--info-solid`, `--warning-solid`, `--help` and `--contrast`, each
    with `-foreground`, `-hover`, `-active`, `-edge`, `-ghost-hover` and `-ghost-active`; `--destructive-edge`,
    `--destructive-ghost-hover`, `--destructive-ghost-active`;
  - motion: `--bui-duration-control` (200 ms), for the colour changes of controls.
- **New defaults.** The neutral defaults are slate greys, written in hex: in light, white surfaces, `--foreground`
  `#334155`, `--primary` and `--ring` `#020617`, `--border` `#e2e8f0`; in dark, a `#020617` page, `#0f172a` cards and a
  `#f8fafc` primary. `--control` is `#cbd5e1` light and `#334155` dark, and `--input` keeps `--control`'s value; no
  component reads `--input`.
- **Status colours.** Alert's tones are a subtle fill, an edge and strong text of one hue; Badge's are the tag pair;
  status toasts take Alert's colours.

### Default colours and contrast

The default control edges (`#cbd5e1` light, `#334155` dark) fall below 3:1 against background, card, popover, muted and
sidebar in each theme: ten pairs. Three light rendered text pairs fall below 4.5:1: unpressed toggles, including group and
toolbar items (`#64748b` on `#f1f5f9`, 4.3439:1), and unmet inline password rules (opacity produces `#707a88` on white,
4.34:1 in the browser audit), and attached InputGroup addon text (`#94a3b8` on white, 2.56:1). The default palette is not a blanket WCAG AA guarantee.

Token tests record the ten border exceptions. `bui-contrast` retains strict thresholds for its registered pairs; it
does not inspect rendered CSS or opacity. The browser audit counts only the three exact text pairs on their relevant
component parts as documented contrast findings, separately from unexpected violations, which still fail.

Consumers needing higher contrast can use the [documented token and component CSS overrides](https://ui.booleanpress.com/docs/accessibility#default-colours):
control edges `#7c8ca2` light / `#64748b` dark, foreground text on unpressed toggles, and full-opacity unmet password-rule
text, plus foreground text on attached InputGroup addons. Run the CLI and verify rendered states against your own surfaces. Existing `brand.css` overrides remain authoritative.

### Not in this version

- **Tree table** is a tree with columns: cell and row editing, column resizing, reordering, visibility and groups, row
  reordering, a filter row and CSV export are Data table's. They may come to Tree table later.
- **For the documentation:** an MCP server for assistants (the site's `llms.txt` and the assistant plugin serve them
  now), Open in StackBlitz on examples, and documentation per version (the site documents the latest release).

### Fixed since the pre-release builds

- **Select**: a trigger with no value and no placeholder keeps its height (34 px, 26 px `sm`, 42 px `lg`) instead of shrinking to 28 px. Nothing to do.
- **Calendar:** the week number is a header cell, so its `scope` is valid.
- **Calendar:** the chosen day and both ends of a range keep their number in the middle of the circle (it sat 4 px to
  the left). Nothing to do.
- **Banner:** with actions, the icon, the text and the dismiss button line up with the buttons (the icon sat 3.5 px
  high). Nothing to do.
- **Choice card:** the radio or checkbox is centred on the title's line (it sat 3 px low without an aside). Nothing to do.
- **Color picker:** the channel fields show their whole value ("239", "0.75"); they were cut off. Nothing to do.
- **Data table:** a narrow table wraps its footer instead of running "Rows per page" over the page buttons. Nothing to do.
- **Date picker and Date range picker:** the popup scrolls inside instead of running off a short screen; months that do
  not fit side by side wrap to the next row; inline, Clear sits with Cancel and Apply. Nothing to do.
- **Input group:** a textarea fills the group (it kept its native width and sat in the middle). Nothing to do.
- **Order list and Pick list:** without a filter, the select-all checkbox shows its "Select all" label. Nothing to do.
- **Dialog, Alert dialog and Sheet:** opened from a menu item, they return focus to the menu's button when they close
  (focus fell to the page). Sheet's side and top panels start below the WordPress admin bar, and tall top and bottom
  panels scroll inside the window.
- **Dropdown menu:** a long submenu scrolls inside the window instead of being cut off; its shortcuts keep their order on
  right-to-left pages.
- **Command:** "no results" is announced from a status region after the list, so an empty list no longer fails axe;
  `CommandInput` honours `defaultValue`; `CommandEmpty` merges its `className`.
- **Button:** `loading` keeps focus and width (`aria-disabled`, the press refused) instead of `disabled`, which dropped
  focus; with `asChild`, `disabled` and `loading` reach the link.
- **Progress:** a value outside `0`–`max` is clamped, and a bad `max` falls back to 100.
- **Tabs:** a scrollable list keeps the selected tab in view.
- **Toast:** a `className` on `Toaster` is added to its own classes.
- **Badge, Avatar, Spinner:** a badge never grows wider than its container; an avatar's fallback stays inside its disc;
  Spinner has its `data-slot`.
- **Calendar:** in Firefox, which has no week data in `Intl`, the week starts on the locale's first day, as elsewhere.
- **Input group:** a click on a checkbox or radio cell focuses the text field.
- **Popover** and **Dropdown menu** (`modal={false}`): a long list inside them scrolls with the wheel and touch when
  they open from a Dialog or Sheet; the page behind stays still.
- **Dropdown menu:** a submenu's chevron points the way it opens in right-to-left pages.
- **Tooltip** in the WordPress admin: WordPress's element styles no longer reach a tooltip's content, as they already did
  not reach the other overlays'.

### Moving from a pre-release build

The first apps used pre-release builds of this package from packed tarballs, never published to npm. To move to this
release:

- install `@booleanpress/ui@0.1.0` from npm, pinned exactly, in place of the tarball;
- replace each local copy in `components/ui/` with its package entry (`@/components/ui/sidebar` →
  `@booleanpress/ui/sidebar`), and install `recharts`, `react-day-picker` or `sonner` if you use Chart, Calendar or Toast;
- **Sidebar:** pass `sidebarStorageKey` to the provider (one per product) and, to keep starting collapsed,
  `defaultOpen={false}`. The old `sidebar_state` cookie is no longer read;
- **Toast:** pass your theme, `<Toaster theme={dark ? "dark" : "light"} />`, instead of a local theme-provider import;
- **Translations:** add the provider's newer keys to your strings map (`pagination`, `breadcrumb`, `more`, `suggestions`,
  `showPassword`, `notifications` and `closeNotification`); until then they read in English;
- **Brand palettes:** run `bui-contrast` on your `brand.css`. If your palette changes `--background`, `--card`,
  `--popover`, `--muted` or `--sidebar`, set `--control` in `:root` and `.dark` so it stays at 3:1 on each of them; the
  default is `oklch(0.6 0 0)` light and `oklch(0.58 0 0)` dark;
- **TypeScript** now checks props: an invalid value, such as `size="xl"` on `DialogContent`, is an error;
- remove `disableAnimation` from any `PopoverContent`.

Then, for what the full suite changed:

- **Brand palettes.** A `brand.css` that sets `--primary` sets its steps too (`--primary-hover`, `--primary-active`) and
  the selection colours (`--highlight`, `--highlight-foreground`, `--highlight-focus`); otherwise they keep the
  near-black defaults. Set `--ring` to your focus colour. A palette with its own status colours sets their `-strong`,
  `-subtle`, `-border`, `-tag` and `-tag-foreground` tokens. Then run `bui-contrast` (see the open list below): it now
  measures the hover and press steps too, so a palette that changed only the resting colours fails where a hover would
  be unreadable.
- **Nested providers.** A `BooleanUIProvider` inside another now inherits every prop it is not given; it used to reset
  them to the defaults (English, left to right). Give the inner provider the value explicitly where it must differ.
- **Sizes.** Buttons are 35 px tall (`sm` 28 px, `lg` 42 px); icon buttons 36 px, `icon-sm` 28 px, `icon-lg` 42 px.
  Input, Select and Native select are 35 px; they and Textarea have 14 px text with a mouse and 16 px on a touch
  screen (see Theme, provider and strings). Checkboxes and radios are 18 px, Switch 36 × 22 px (`sm` 28 × 16 px), Avatar 28 px (`sm` 24 px,
  `lg` 42 px). Look once at layouts that count on a size, such as a table's select column.
- **Card** has a shadow and no border.
- **Tabs** are underline tabs: the list has no fill and spans the full width, and the panel pads itself (12 px 16 px
  16 px), so remove padding you added to `TabsContent`.
- **Pagination's** Previous and Next are round icon buttons; their words stay for screen readers.
- **Sheet** has no gap between its parts and the header and footer pad themselves: give a sheet's body `px-4.5` to line up
  with them. A side sheet is at most 20 rem wide.
- **Toasts** are 300 px wide, `min(18.75rem, 100vw − 2rem)`.
- **Popover** has an 8 px radius and a soft shadow.
- **Calendar** draws its own edge: drop `rounded-md border` from its `className`. Inside a Popover or a card's content it
  draws none.
- **Checkbox's** mixed state is the unfilled box with a dash.
- **Dialog and Sheet:** the × is a 36 px round icon button.
- **Strings.** A translated product adds the new keys (the strings guide lists them); a missing key shows its English
  default.
- **Calendar's month arrows** are named "Previous month" and "Next month" (were "Go to the Previous Month" and "Go to the
  Next Month"): update tests that find them by name. With a provider `locale`, its names and first weekday follow it.
- **Progress** with no `value` now slides across the track as a loading bar, where it drew nothing; `max` now sets the
  fill too.
- **Input** no longer takes the native numeric `size` attribute (it is the control size now): set a width with a class.
- **Client modules.** Alert, Badge, Input, Textarea and Native select are now `"use client"` modules: call
  `badgeVariants()` from a client module.
- **Select** with `clearable` renders in a wrapper (`data-slot="select-control"`): a layout class that must reach the
  outer box goes on your own wrapper.
- **Toast:** a `toast.custom()` or `unstyled` toast no longer takes the package's card padding, shadow and title weight.
