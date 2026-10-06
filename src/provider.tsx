"use client"

import * as React from "react"
import { Direction, Tooltip as TooltipPrimitive } from "radix-ui"

/**
 * English defaults of every string the components render themselves. A product passes its translated map to
 * `BooleanUIProvider`; a key it leaves out falls back to the English here.
 *
 * @since 0.1.1
 */
export const DEFAULT_STRINGS = Object.freeze({
  close: "Close",
  previous: "Previous",
  next: "Next",
  previousPage: "Go to previous page",
  nextPage: "Go to next page",
  morePages: "More pages",
  loading: "Loading",
  toggleSidebar: "Toggle Sidebar",
  sidebarTitle: "Sidebar",
  sidebarDescription: "Displays the mobile sidebar.",
  commandTitle: "Command Palette",
  commandDescription: "Search for a command to run...",
  pagination: "Pagination",
  breadcrumb: "Breadcrumb",
  more: "More",
  showPassword: "Show password",
  notifications: "Notifications",
  closeNotification: "Close notification",
  suggestions: "Suggestions",
  // Dialog
  maximize: "Maximize",
  restore: "Restore",
  // Pagination
  rowsPerPage: "Rows per page",
  pageRange: "{start}–{end} of {total}",
  goToPage: "Go to page",
  firstPage: "Go to first page",
  lastPage: "Go to last page",
  // Select (and every clearable field)
  clear: "Clear",
  // Slider
  sliderMinimum: "Minimum",
  sliderMaximum: "Maximum",
  sliderValue: "Value {index} of {count}",
  // Badge and Chip
  badgeOverflow: "{max}+",
  removeItem: "Remove {label}",
  // Tabs
  scrollTabsBackward: "Scroll tabs backward",
  scrollTabsForward: "Scroll tabs forward",
  closeTab: "Close {label}",
  // Carousel
  carouselRole: "carousel",
  slideRole: "slide",
  previousSlide: "Previous slide",
  nextSlide: "Next slide",
  slideOf: "Slide {index} of {count}",
  goToSlide: "Go to slide {index}",
  // InputOTP
  otpCharacter: "Character {index} of {count}",
  // ColorPicker
  colorPicker: "Colour picker",
  hue: "Hue",
  saturation: "Saturation",
  brightness: "Brightness",
  alpha: "Alpha",
  hexColor: "Hex colour",
  colorSwatches: "Preset colours",
  colorFormat: "Colour format",
  red: "Red",
  green: "Green",
  blue: "Blue",
  lightness: "Lightness",
  chroma: "Chroma",
  cssColor: "CSS colour",
  pickColor: "Pick a colour from the screen",
  eyeDropperUnavailable: "Screen colour picking is unavailable in this browser",
  eyeDropperFailed: "The colour could not be picked",
  // Rating
  ratingValue: "{value} of {max}",
  ratingCleared: "Rating cleared",
  // CheckboxGroup
  selectAll: "Select all",
  // DatePicker, DateRangePicker, DateField and TimeField
  today: "Today",
  chooseDate: "Choose date",
  chooseDateRange: "Choose dates",
  apply: "Apply",
  cancel: "Cancel",
  presetToday: "Today",
  presetYesterday: "Yesterday",
  presetLast7Days: "Last 7 days",
  presetLast30Days: "Last 30 days",
  presetThisMonth: "This month",
  presetLastMonth: "Last month",
  hour: "Hour",
  minute: "Minute",
  second: "Second",
  dayPeriod: "AM/PM",
  day: "Day",
  month: "Month",
  year: "Year",
  chooseYear: "Choose year",
  previousYear: "Previous year",
  nextYear: "Next year",
  previousYears: "Previous years",
  nextYears: "Next years",
  emptySegment: "Empty",
  // Combobox, Autocomplete, MultiSelect, TagsInput and Listbox
  noResults: "No results",
  loadingResults: "Loading results…",
  toggleOptions: "Show options",
  filterOptions: "Filter options",
  selectedCount: "{count} selected",
  moreSelected: "+{count} more",
  // InputNumber, SearchField and PasswordInput
  increment: "Increase",
  decrement: "Decrease",
  numberFieldRole: "Number field",
  search: "Search",
  passwordStrength: "Password strength: {level}",
  strengthWeak: "Weak",
  strengthMedium: "Medium",
  strengthStrong: "Strong",
  strengthVeryStrong: "Very strong",
  strengthTooWeak: "Too weak",
  strengthFair: "Fair",
  passwordStrengthTitle: "Password strength",
  ruleMet: "{label}: met",
  ruleNotMet: "{label}: not met",
  // Panel, Stepper, SpeedDial, ScrollTop and Toolbar
  toggleContent: "Show or hide {title}",
  stepOf: "Step {current} of {total}",
  stepCompleted: "Completed",
  stepError: "Has errors",
  back: "Back",
  finish: "Finish",
  speedDialActions: "Actions",
  scrollToTop: "Scroll to top",
  moreActions: "More actions",
  // Tree, TreeSelect and TreeTable
  expandNode: "Expand {label}",
  collapseNode: "Collapse {label}",
  filterTree: "Filter",
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  treeLoading: "Loading {label}",
  // FileUpload
  chooseFiles: "Choose",
  upload: "Upload",
  dropFilesHere: "Drop files here",
  browseFiles: "or click to browse",
  uploadComplete: "Upload complete",
  uploadFailed: "Upload failed",
  fileTooLarge: "{name} is larger than {size}",
  fileTypeNotAllowed: "{name} is not an allowed file type",
  tooManyFiles: "Too many files: you can add {count} at most",
  fileAdded: "{name} added",
  filesAdded: "{count} files added",
  folderNotAllowed: "{name} is a folder: add the files inside it",
  // DataView
  layout: "Layout",
  layoutList: "List",
  layoutGrid: "Grid",
  sortBy: "Sort by",
  noItems: "No items",
  // Statistic
  trendUp: "Up {value}",
  trendDown: "Down {value}",
  // DataTable (with `search`, `selectedCount`, `noResults`, `loading`, `pageRange`, `rowsPerPage`, `previous`, `next`)
  sortAscending: "ascending",
  sortDescending: "descending",
  sortNone: "Not sorted",
  sortedBy: "Sorted by {column}, {direction}",
  resultsCount: "{count} results",
  selectRow: "Select row {name}",
  selectAllRows: "Select all rows on this page",
  expandRow: "Expand row {name}",
  collapseRow: "Collapse row {name}",
  resizeColumn: "Resize {column}",
  columnMenu: "{column} options",
  moveColumnLeft: "Move left",
  moveColumnRight: "Move right",
  hideColumn: "Hide column",
  filterColumn: "Filter {column}",
  editCell: "Edit {column}",
  rowActions: "Actions for {name}",
  columns: "Columns",
  exportCsv: "Export CSV",
  noRows: "No rows",
  // Confirm, ConfirmPopup, Banner, ActionBar and Inplace (with `cancel`, `close`, `loading`, `moreActions`,
  // `selectedCount`)
  confirm: "Confirm",
  confirmTitle: "Are you sure?",
  delete: "Delete",
  dismiss: "Dismiss",
  clearSelection: "Clear selection",
  edit: "Edit {label}",
  save: "Save",
  saving: "Saving…",
  saveFailed: "The change could not be saved.",
  // Tour, Link, CopyButton and CodeBlock (with `back`, `finish`, `next`, `close`)
  skipTour: "Skip tour",
  tourStep: "{current} of {total}",
  opensInNewTab: "(opens in a new tab)",
  copy: "Copy",
  copied: "Copied",
  copyFailed: "Copy failed",
  wrapLines: "Wrap lines",
  codeBlock: "{title} code",
  // Chat
  chatThread: "Conversation",
  newMessages: "New messages",
  chatMessage: "Message",
  sendMessage: "Send message",
  attachFile: "Attach file",
  typing: "{name} is typing",
  messageSending: "Sending",
  messageSent: "Sent",
  messageFailed: "Not sent",
  retry: "Retry",
  // Editor (with `apply`)
  editorToolbar: "Formatting",
  textStyle: "Text style",
  paragraph: "Paragraph",
  heading: "Heading {level}",
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strikethrough: "Strikethrough",
  inlineCode: "Code",
  bulletList: "Bulleted list",
  orderedList: "Numbered list",
  blockquote: "Quote",
  link: "Link",
  linkUrl: "Link address",
  invalidLink: "Enter a full address, such as https://example.com",
  removeLink: "Remove link",
  undo: "Undo",
  redo: "Redo",
  characters: "{count} characters",
  characterCount: "{count} of {max} characters",
  // Calendar (with `month`, `year`)
  monthNavigation: "Month navigation",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  todayDate: "Today, {date}",
  selectedDate: "{date}, selected",
  weekNumber: "Week {week}",
  weekNumberHeader: "Week number",
  // OrderList, PickList and VirtualScroller (with `selectAll`, `filterOptions`, `noResults`, `noItems`, `loading`)
  moveUp: "Move up",
  moveDown: "Move down",
  moveToTop: "Move to top",
  moveToBottom: "Move to bottom",
  moveToTarget: "Move to target",
  moveAllToTarget: "Move all to target",
  moveToSource: "Move to source",
  moveAllToSource: "Move all to source",
  itemMoved: "{item} moved to position {position} of {total}",
  itemsMoved: "{count} items moved; the first is now at position {position} of {total}",
  dragHandle: "Drag {item}",
  dragStarted: "Picked up {item} at position {position} of {total}. Arrow keys move it, Space or Enter drops it, Escape cancels.",
  dragCancelled: "Move cancelled. {item} is back at position {position} of {total}.",
  sourceList: "Source",
  targetList: "Target",
  loadingMore: "Loading more…",
  // CascadeSelect
  loadFailed: "Could not load the options",
  // Tree and TreeTable (a node's children that failed to load)
  treeLoadFailed: "Could not load {label}",
  // Confirm and ConfirmPopup (an `onConfirm` that failed without a message of its own)
  actionFailed: "Something went wrong. Try again.",
})

/**
 * The built-in strings: every key of `DEFAULT_STRINGS`, each a translated string.
 *
 * @since 0.1.1
 */
export type UiStrings = { [Key in keyof typeof DEFAULT_STRINGS]: string }

/**
 * Text direction of the admin page.
 *
 * @since 0.1.1
 */
export type UiDirection = "ltr" | "rtl"

/**
 * The size of a control: 26, 34 or 42 px tall for a text field.
 *
 * @since 0.1.1
 */
export type ControlSize = "sm" | "default" | "lg"

/**
 * The look of a field: the white `--field` fill, or the grey `--field-filled` one.
 *
 * @since 0.1.1
 */
export type FieldVariant = "default" | "filled"

/**
 * What `useUiConfig()` returns: the provider's resolved configuration.
 *
 * @since 0.1.1
 */
export interface UiConfig {
  strings: UiStrings
  dir: UiDirection
  tooltipDelay: number
  tooltipSkipDelay: number
  sidebarStorageKey: string
  /** The size every control takes when it is given none. */
  controlSize: ControlSize
  /** The look every field takes when it is given none. */
  fieldVariant: FieldVariant
  /** BCP 47 locale for numbers and dates (`"de-DE"`); undefined is the runtime's default. */
  locale: string | undefined
  /** IANA time zone dates are shown in (`"Europe/Berlin"`); undefined uses the browser's. */
  timeZone: string | undefined
}

/**
 * Tooltip timing: a tooltip waits half a second where the pointer rests, and the next one waits again, so sweeping
 * the pointer across a row of icon buttons never strobes tooltips.
 *
 * @since 0.1.1
 */
export const DEFAULT_TOOLTIP_DELAY = 500

/** @since 0.1.1 */
export const DEFAULT_TOOLTIP_SKIP_DELAY = 0

const DEFAULT_CONFIG: UiConfig = Object.freeze({
  strings: DEFAULT_STRINGS,
  dir: "ltr",
  tooltipDelay: DEFAULT_TOOLTIP_DELAY,
  tooltipSkipDelay: DEFAULT_TOOLTIP_SKIP_DELAY,
  sidebarStorageKey: "booleanpress-ui:sidebar",
  controlSize: "default",
  fieldVariant: "default",
  locale: undefined,
  timeZone: undefined,
})

const UiContext = React.createContext<UiConfig>(DEFAULT_CONFIG)
UiContext.displayName = "BooleanUIContext"

/**
 * Props of `BooleanUIProvider`. Every prop is optional: at the root, one left out takes its default; in a nested
 * provider, it takes the value of the provider above.
 *
 * @since 0.1.1
 */
export interface BooleanUIProviderProps {
  /**
   * Translated strings, built with the product's own `t()`. A missing key falls back to English at the root, and to
   * the provider above's string in a nested provider.
   */
  strings?: Partial<UiStrings>
  /** Text direction of the admin page. */
  dir?: UiDirection
  /** Milliseconds before a tooltip opens. */
  tooltipDelay?: number
  /** Milliseconds after a tooltip closes during which the next one opens at once. */
  tooltipSkipDelay?: number
  /** Local-storage key of the sidebar's collapsed state, unique per product. */
  sidebarStorageKey?: string
  /** The size of every control that is given none, for a compact or a roomy app. @since 0.1.1 */
  controlSize?: ControlSize
  /** The look of every field that is given none: `filled` for grey fields everywhere. @since 0.1.1 */
  fieldVariant?: FieldVariant
  /**
   * BCP 47 locale for the numbers and dates components format (`"de-DE"`): usually the site's locale. WordPress's form
   * (`"de_DE"`, `"de_DE_formal"`) is accepted; a locale `Intl` cannot read falls back to the runtime's default.
   * @since 0.1.1
   */
  locale?: string
  /**
   * IANA time zone dates are shown in (`"Europe/Berlin"`): usually the site's time zone. A UTC offset (`"+02:00"`, as
   * WordPress gives for a site set to one) is accepted; a zone `Intl` cannot read falls back to the browser's.
   * @since 0.1.1
   */
  timeZone?: string
  children?: React.ReactNode
}

/**
 * A locale `Intl` accepts, from what an app passes: WordPress writes `de_DE` and `de_DE_formal`, which `Intl` refuses
 * with a RangeError, so underscores become hyphens, WordPress's `formal` / `informal` variants are dropped, and a tag
 * still refused loses its last subtags until one is accepted (`pt_PT_ao90` → `pt-PT`). Nothing usable gives undefined,
 * the runtime's default. The same input gives the same output on the server and in the browser.
 */
function normalizeLocale(locale: string | undefined): string | undefined {
  if (typeof locale !== "string") return undefined
  const subtags = locale
    .trim()
    .replace(/_/g, "-")
    .split("-")
    .filter((part) => part && !/^(formal|informal)$/i.test(part))
  while (subtags.length) {
    try {
      const [canonical] = Intl.getCanonicalLocales(subtags.join("-"))
      if (canonical) return canonical
    } catch {
      /* refused: try without the last subtag */
    }
    subtags.pop()
  }
  return undefined
}

/**
 * A time zone `Intl` accepts: an IANA name as given, or a whole-hour UTC offset such as WordPress's `wp_timezone_string()`
 * returns for a site set to "UTC+2" (`+02:00` → `Etc/GMT-2`, which every browser knows; the sign is reversed in those
 * names). Any other offset is kept where the runtime accepts it; a zone it refuses gives undefined, the browser's zone.
 */
function normalizeTimeZone(timeZone: string | undefined): string | undefined {
  if (typeof timeZone !== "string" || !timeZone.trim()) return undefined
  let zone = timeZone.trim()
  const offset = zone.match(/^(?:UTC|GMT)?([+-])(\d{1,2})(?::?(\d{2}))?$/i)
  if (offset && Number(offset[3] ?? 0) === 0) {
    const hours = Number(offset[2])
    zone = hours === 0 ? "UTC" : `Etc/GMT${offset[1] === "+" ? "-" : "+"}${hours}`
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: zone })
    return zone
  } catch {
    return undefined
  }
}

/** Merges translated strings over the inherited ones; a key given as `undefined` counts as left out. */
function mergeStrings(base: UiStrings, strings: Partial<UiStrings> | undefined): UiStrings {
  if (!strings) return base
  const merged: Record<keyof UiStrings, string> = { ...base }
  for (const key of Object.keys(strings) as (keyof UiStrings)[]) {
    const value = strings[key]
    if (value !== undefined) merged[key] = value
  }
  return merged
}

/**
 * The root an app renders once, around its whole interface: it hands the components their
 * translated strings, the text direction, the tooltip timing and the storage key of the sidebar's state.
 *
 * A provider inside another changes only what it is given and inherits the rest, strings key by key, so a part of
 * the page can take its own locale (`<BooleanUIProvider locale="de-DE">`) and keep the app's direction, strings and
 * sizes.
 *
 * @since 0.1.1
 */
export function BooleanUIProvider({
  strings,
  dir,
  tooltipDelay,
  tooltipSkipDelay,
  sidebarStorageKey,
  controlSize,
  fieldVariant,
  locale,
  timeZone,
  children,
}: BooleanUIProviderProps) {
  // Outside any provider this is DEFAULT_CONFIG, so the root provider resolves every prop it is not given to its default.
  const parent = React.useContext(UiContext)
  const root = parent === DEFAULT_CONFIG
  // Normalised once here, so every reader (`useUiLocale()`, `useUiConfig()`) gets a locale and a zone `Intl` accepts.
  const resolvedLocale = React.useMemo(() => normalizeLocale(locale), [locale])
  const resolvedTimeZone = React.useMemo(() => normalizeTimeZone(timeZone), [timeZone])
  const value = React.useMemo<UiConfig>(
    () => ({
      strings: mergeStrings(parent.strings, strings),
      dir: dir ?? parent.dir,
      tooltipDelay: tooltipDelay ?? parent.tooltipDelay,
      tooltipSkipDelay: tooltipSkipDelay ?? parent.tooltipSkipDelay,
      sidebarStorageKey: sidebarStorageKey ?? parent.sidebarStorageKey,
      controlSize: controlSize ?? parent.controlSize,
      fieldVariant: fieldVariant ?? parent.fieldVariant,
      locale: resolvedLocale ?? parent.locale,
      timeZone: resolvedTimeZone ?? parent.timeZone,
    }),
    [parent, strings, dir, tooltipDelay, tooltipSkipDelay, sidebarStorageKey, controlSize, fieldVariant, resolvedLocale, resolvedTimeZone]
  )

  // A nested provider that leaves the timing alone keeps the tooltip provider above, so its tooltips share one delay.
  const content =
    root || tooltipDelay !== undefined || tooltipSkipDelay !== undefined ? (
      <TooltipPrimitive.Provider delayDuration={value.tooltipDelay} skipDelayDuration={value.tooltipSkipDelay}>
        {children}
      </TooltipPrimitive.Provider>
    ) : (
      children
    )

  return (
    <UiContext.Provider value={value}>
      <Direction.Provider dir={value.dir}>{content}</Direction.Provider>
    </UiContext.Provider>
  )
}

/**
 * The provider's configuration: strings, direction, tooltip timing and sidebar storage key. Outside a provider it
 * returns the defaults, so a component never breaks for want of one.
 *
 * @since 0.1.1
 */
export function useUiConfig(): UiConfig {
  return React.useContext(UiContext)
}

/**
 * The translated built-in strings (English defaults outside a provider).
 *
 * @since 0.1.1
 */
export function useUiStrings(): UiStrings {
  return React.useContext(UiContext).strings
}

/**
 * A control's size: its own `size` prop, else the provider's `controlSize`.
 *
 * @since 0.1.1
 */
export function useControlSize(size?: ControlSize | null): ControlSize {
  const fallback = React.useContext(UiContext).controlSize
  return size ?? fallback
}

/**
 * A field's look: its own `variant` prop, else the provider's `fieldVariant`.
 *
 * @since 0.1.1
 */
export function useFieldVariant(variant?: FieldVariant | null): FieldVariant {
  const fallback = React.useContext(UiContext).fieldVariant
  return variant ?? fallback
}

/**
 * The locale and time zone numbers and dates are formatted in: the provider's, else undefined, which `Intl` reads as the
 * runtime's default. Pass them straight to `Intl` (`new Intl.NumberFormat(locale)`). Nothing is read from the page during
 * render, so server and browser render the same text.
 *
 * @since 0.1.1
 */
export function useUiLocale(): { locale: string | undefined; timeZone: string | undefined } {
  const { locale, timeZone } = React.useContext(UiContext)
  return { locale, timeZone }
}
