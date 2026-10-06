# Form controls — current contract

This is the current contract for the 0.1.1 candidate's form controls. It supersedes only the changed form defaults,
geometry, styling and interactions described below in specs 002, 003 and 004; their other contracts remain in force.
The need is one consistent form experience across package consumers, including the documented compositions. Keep the
existing Radix and Base UI primitives and public entry points; matching a composition does not require another primitive.

## Shared field baseline

Text fields use 12/16, 14/20 and 16/24 px font-size/line-height for `sm`, `default` and `lg`, with 4×8, 6×10 and 8×12 px
vertical×horizontal padding and a 1 px edge: single-line heights are 26, 34 and 42 px. Provider `controlSize` and
`fieldVariant` still supply defaults. Toggle buttons have a different frame and are 30, 34 and 38 px high. Checkboxes,
radios, rating marks, slider handles and switch tracks retain their own dimensions; they are not text fields.

Use semantic tokens in `theme.css`: `--field`, `--field-filled`, `--control`, `--control-hover`, `--ring`, `--invalid`,
`--field-placeholder`, `--field-icon`, `--field-invalid-foreground` and the disabled-field tokens. The default light
control edge is `#cbd5e1`, dark `#334155`; hover edges are `#94a3b8` and `#475569`. Placeholder text is `#64748b`/`#94a3b8`;
icons `#94a3b8`/`#64748b`. Invalid placeholder text is `#dc2626`/`#f87171`. Field text is `#334155`/`#ffffff`.

The default control edge falls below 3:1 on background, card, popover, muted and sidebar surfaces in each theme: ten
pairs. Three light rendered text pairs also fall below 4.5:1: unpressed toggle text `#64748b` on `#f1f5f9` (4.3439:1), and
unmet inline password-rule text composited to `#707a88` on white (4.34:1 in the browser audit), and attached InputGroup
addon text `#94a3b8` on white (2.56:1). These values supersede
older blanket AA claims. The [accessibility guide](https://ui.booleanpress.com/docs/accessibility#default-colours) gives
edge-token and component CSS overrides. The CLI checks registered token pairs; the browser audit reports these exact
text exceptions separately from unexpected violations. Keyboard semantics, accessible names, errors and visible focus remain required; this palette
choice does not establish complete WCAG conformance. Disabled styling is component-specific, not a global opacity rule.

Control transitions use `--bui-duration-control`; Rating hover uses `--bui-duration-base`; password requirement feedback
uses `--bui-duration-feedback`. Field shadows use `--bui-shadow-field` (0 1px 2px, rgb(18 18 23 / 5%)). Selection popups enter and exit at 93% scale without sliding. Select uses Radix presence animations; Autocomplete uses native popup lifecycle opacity/scale transitions over `--bui-duration-base` with `--bui-ease-popup`, without sliding. Existing reduced-motion rules apply. No screenshot-baseline or new CI system is required.

## Component and composition map

| Form experience | Public entry / composition | Current contract |
| --- | --- | --- |
| Text suggestions | `autocomplete` | Text value and optional suggestions; free text remains the default. Controlled blur validation supplies forced matching. `combobox` supplies multiple selected chips. Focus-opening, select-text-on-focus, auto-highlight and pointer-highlight policy are demonstrated with existing props. `AutocompleteArrow` composes inside the popup. |
| Checkbox | `checkbox` | Checked, unchecked and indeterminate states; size and filled variant; custom checked/mixed indicators. Disabled and invalid states retain native primitive semantics. |
| Checkbox set | `checkbox-group` | Array selection, horizontal wrapping layout by default (`orientation="vertical"` stacks items), per-item and group disabled states, parent select-all. Parent alternates all/none for enabled children; a partial selection advances to all. Disabled choices are preserved; prior partial selections are not restored. Card layouts use existing choice controls. |
| Date selection | `date-picker`, `date-range-picker`, `calendar` | Single/multiple dates, ranges, inline/popup layouts, month/year views, time, bounds, locale formatting and multiple visible months. Date range supports `inline`; week configuration includes `ISOWeek` and `firstWeekContainsDate`. The field-triggered date input exposes combobox expansion/control semantics; button/icon triggers remain separate controls. |
| Icons inside a field | `input-group` + input/addons | Leading/trailing icons, both sides, loading and clear/action examples; use real buttons for actions. Inset icons remain 14 px at every size, 10 px from the outer edge; text starts 33 px from that edge including the border. No separate icon-field state engine. |
| Colour editing | `color-picker` | Alpha enabled by default; format presentation and composed editing parts described below. Serialized values remain normalized sRGB hex. |
| Attached fields/actions | `input-group` | `attached` joins addon/action cells and adjacent controls with shared edges and logical corners; ordinary icon addons remain available. Group size/variant reaches its controls. |
| Numeric input | `input-number` | Locale-aware decimals/currency/grouping and bounds, stacked/horizontal/vertical steppers, `incrementIcon`/`decrementIcon`. Vertical mode is 40 px wide by default. Prefix/suffix remain noneditable adjacent spans described to the field. |
| One-time code | `input-otp` | Default `validationType="none"` accepts general characters. `numeric` is explicit and retains numeric input mode. One native input per slot; documentation's basic code has four slots. |
| Password | `password-input` | Masked by default, eye opt-in with `showToggle`; controlled `mask`/`onMaskChange` or `defaultMask`. Inline and rule-based feedback contracts below. |
| Text input | `input` | Native text semantics, common field sizing/tokens, filled/invalid/disabled/read-only states, clear and key-filter behavior retained. |
| Field label | `label` | Native label association; required markers are an example composition, paired with the input's required state. |
| Visible choice list | `listbox` | Single/multiple selection, configurable focus/modifier rules, controlled filtering and an external header slot; details below. |
| Radio choice | `radio-group`, `choice-card` | One selected value; arrow navigation, filled/invalid/disabled states, labels and card composition. |
| Rating | `rating` | Half steps enabled by default; whole steps with `allowHalf={false}`. Per-position templates, vertical halves and keyboard/clearing behavior below. |
| Popup selection | `select`, `combobox` | Select remains a scalar Radix selection. Combobox recipes supply popup search and multiple selection. Selected checks precede labels; trigger reserves a 40 px indicator column at every size. `SelectContent arrow` adds an optional positioned arrow. |
| Numeric slider | `slider` | One handle at `[50]` by default, clamped to custom bounds; arrays provide ranges/multiple handles. `minStepsBetweenThumbs` enforces a minimum gap. `onValueChange` reports movement, `onValueCommit` completion. |
| Multiline input | `textarea` | Fixed native rows/columns and `fluid=false` by default. `autoResize` grows/shrinks while preserving the native row minimum and column width; `fluid` opts into full width. |
| Pressed button | `toggle` | Boolean controlled/uncontrolled state; children can be a node or `({ pressed }) => node`. A stable accessible name is required when the visible text changes. |
| Pressed-button set | `toggle-group` | Both single and multiple modes are `role="group"` with `aria-pressed` buttons. Every enabled item is tabbable by default; `rovingFocus` opts into arrows. `allowEmpty=false` preserves the last selected item. |
| Boolean switch | `switch` | Existing checked state, sizes and custom knob icons. Off-track fill follows `--control`/`--control-hover`; on-track fill uses primary tokens. |

## State details that change consumer behavior

**Password.** The default scorer applies five length/character checks and produces weak 25, medium 50, strong 75 or
very strong 100. A custom scorer may return the existing level string or `{ level, percent }`, with percent bounded to
0–100. `strength="rules"` weights each rule (`weight=1` by default), reports the actual percentage and uses thresholds
20/40/60/80/100 for too weak/weak/fair/strong/very strong; zero fulfilled weight has no level badge. Inline and popover feedback use provider strings. The popover
has a title, score, requirements and arrow; Escape dismisses it, editing can reopen it. Masking changes preserve its value; the optional toggle is a separate keyboard focus target.

**Listbox.** `autoOptionFocus=true`, `selectOnFocus=false`, `focusOnHover=true`, `metaKeySelection=false`. With modifier
selection enabled, a plain pointer choice replaces and Ctrl/Cmd toggles; keyboard toggling remains available. Filter
state is `filterValue`/`onFilterValueChange`, or `defaultFilterValue`; `filterMatch` is contains, startsWith or a predicate.
With `selectOnFocus` in multiple mode, pointer activation confirms the option selected by focus rather than toggling it off; Space/Enter still toggle. A composed header sits outside the listbox role; its select-all checkbox can express indeterminate state. Disabled
lists also disable header actions. Hidden and disabled options are skipped by navigation.

**Dates.** DatePicker's single-month day header opens month or year selection; year selection leads to months and then days; navigating these
views does not commit a date. A range previews from its first endpoint to the hovered day in either direction and
commits on the second click. Popup calendars use 8 px padding/radius and a 4 px offset; day targets are 36 px in 38 px
rows, a 30 px navigation/header row with 28 px title buttons, weekday labels 12 px normal and time segments 32 px. DatePicker's default trigger is the field. Inline range,
multiple months, ISO week numbering, form reset and controlled values retain their tested contracts. Visible outside-month dates are disabled in both date pickers by default; `calendarProps={{ selectOutsideDays: true }}` restores pointer selection. Keyboard navigation still crosses month boundaries. A standalone `Calendar` keeps `selectOutsideDays=true`.

**Colour.** Input accepts hex, RGB(A), HSL(A), HSB(A)/HSV(A) and CSS OKLCH strings. Change/commit callbacks and form values
remain lowercase sRGB hex. `alpha=true` is the default; false supplies opaque output and removes default transparency
controls. `format`/`defaultFormat`/`onFormatChange` choose `hex`, `rgba`, `hsba`, `hsla` or `oklcha` presentation independently
of the colour. Invalid edits revert on blur/Enter; invalid initial colour falls back to black. Out-of-gamut OKLCH clips
to sRGB; wide-gamut preservation is not promised.

`ColorPickerArea`, `ColorPickerSlider`, `ColorPickerInput`, `ColorPickerPreview`, `ColorPickerFormatSelect` and
`ColorPickerEyeDropper` support custom layouts; supplied root children replace the default control arrangement.
The chroma channel always uses OKLCH, regardless of the root display format. Numeric channels expose spinbuttons: RGB 0–255, percentages 0–100, hue 0–360, alpha 0–1, OKLCH lightness 0–1 and chroma
0–0.4. Up/Down, Page keys, Shift and Home/End adjust values; Left/Right retain text-caret behavior. The browser eyedropper
opens only after an explicit click, is disabled when unsupported, preserves alpha on success and ignores cancellation
or stale results. Other failures are localized status messages.

**Rating.** Five 16 px marks by default; `sm` 14 px and `lg` 20 px. There is no default gap. Marks use primary colour,
scale to 110% on enabled hover and have a 2 px primary focus outline. Disabled is 50% opacity. `renderIcon` receives
`{ index, active, checked, value }`: zero-based position, filled layer, selected position and current value. Half-fill
and hit targets use the horizontal start/end halves (mirrored in RTL), or vertical top/bottom halves. Arrows move by the
active half/whole step; clicking/Space/Enter on the selected value and Backspace/Delete clear unless `allowClear=false`.
Read-only remains one named image. A default half-star target is only 8 px wide: these defaults do not meet 24 px touch
target size by themselves; consumers needing larger targets must provide them.

**Slider and textarea.** Slider's default footprint follows its handle: 20 px horizontal height or vertical width, with
a 3 px track and 16 px inner knob. Disabled stops interaction at full opacity. Textarea sizing responds to edits,
controlled value changes, container-width changes and form reset when `autoResize` is enabled. A maximum-height class
caps growth and permits scrolling. Fixed textareas preserve native resize/scroll behavior. Invalid Textarea changes
its edge and placeholder; its actual value text keeps the normal colour.

**Toggles.** The button has a 4 px outer frame and an inner content plate with 2×10 px padding. Pressed content uses
`--foreground` and `--bui-shadow-toggle`; unpressed text uses `--field-placeholder`. Toolbar toggle items share this plate.
ToggleGroup single values remain strings and multiple values arrays. `allowEmpty=false` prevents clearing the last
selection; it does not invent an initial value. Space/Enter toggles the focused button. Default Tab visits each enabled
item. Optional roving focus preserves the existing directional/Home/End navigation, without changing value on focus.

## Verification and adoption

Each affected component has behavioral tests under `tests/components/`; new compositions are also exercised by
`form-recipes.test.jsx`. Colour conversion has independent tests in `tests/color.test.js`; public API contracts live in
`tests/types/`. These verify logic and semantics, not complete visual identity. Review the documentation examples in
light/dark and LTR/RTL, including focus, invalid, disabled, filled, clearing, controlled updates and form resets.
Run `pnpm check:fast` during development and the existing full `pnpm check` before publishing. Do not infer a successful
release gate or publication from this contract.

Migration for consumers of the prelaunch package: add `allowHalf={false}` for whole ratings; `defaultValue={[min]}` for
the old slider start; `autoResize fluid` for previously growing/full-width textareas; `rovingFocus` for the previous
ToggleGroup arrow model; `validationType="numeric"` for numeric OTP; `showToggle` for the password eye; and
`alpha={false}` for opaque-only colour controls. Add `orientation="vertical"` for the previous CheckboxGroup stack and `trigger="button"` for the previous DatePicker attached button. Checkbox parent selection now alternates all/none. Review fixed-height
host layouts against the new 26/34/42 px field scale.

