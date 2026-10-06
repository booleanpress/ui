// Built on Base UI's Combobox (`@base-ui/react/combobox`) with `multiple` and the input inside the list: a select-like
// trigger that shows the chosen options as labels, chips or a count, and a list people can filter by typing.
"use client"

import * as React from "react"
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { useFormReset } from "@/lib/form-reset"
import { cn, fillString } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "lucide-react"

import { Checkbox } from "@/components/checkbox"
import {
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/combobox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input-group"
import {
  useControlSize,
  useFieldVariant,
  useUiConfig,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

type WithStringClassName<T> = Omit<T, "className"> & { className?: string }

// The overlays the list renders inside. Focus moves into the list, to its filter field, so it must sit within a Radix
// dialog's or sheet's focus trap, which would otherwise take focus straight back.
const OVERLAY_CONTENT =
  "[data-slot=dialog-content],[data-slot=sheet-content],[data-slot=popover-content],[data-slot=alert-dialog-content]"

interface MultiSelectContextValue {
  value: unknown[]
  setValue: (next: unknown[]) => void
  labelOf: (value: unknown) => string
  same: (a: unknown, b: unknown) => boolean
  query: string
  disabled: boolean
  /** The field's name (its `<label>`, else its `aria-label`), which the list takes as its own. */
  fieldLabel: string | undefined
  trigger: () => HTMLButtonElement | null
  registerTrigger: (node: HTMLButtonElement | null) => void
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | null>(null)

function useMultiSelect(part: string) {
  const context = React.useContext(MultiSelectContext)
  if (!context) throw new Error(`${part} must be used inside MultiSelect.`)
  return context
}

type Group = { items: unknown[] }
const isGroup = (entry: unknown): entry is Group =>
  typeof entry === "object" && entry !== null && Array.isArray((entry as Group).items)
const flatten = (entries: readonly unknown[] | undefined) =>
  (entries ?? []).flatMap((entry) => (isGroup(entry) ? entry.items : [entry]))

function defaultLabel(value: unknown, options: unknown[]) {
  if (typeof value === "object" && value !== null && "label" in value) return String((value as { label: unknown }).label)
  const option = options.find(
    (entry) => typeof entry === "object" && entry !== null && "value" in entry && (entry as { value: unknown }).value === value
  ) as { label?: unknown } | undefined
  return option?.label != null ? String(option.label) : String(value)
}

const defaultSame = (a: unknown, b: unknown) =>
  Object.is(a, b) ||
  (typeof a === "object" && a !== null && typeof b === "object" && b !== null && "value" in a && "value" in b
    ? Object.is((a as { value: unknown }).value, (b as { value: unknown }).value)
    : false)

/**
 * A field that opens a list in which people choose several options; the field shows them as labels, chips or a count.
 *
 * @since 0.1.0
 */
function MultiSelect<Value = string>({
  value: valueProp,
  defaultValue,
  onValueChange,
  onInputValueChange,
  items,
  itemToStringLabel,
  isItemEqualToValue,
  disabled = false,
  children,
  ...props
}: Omit<
  ComboboxPrimitive.Root.Props<Value, true>,
  "multiple" | "value" | "defaultValue" | "onValueChange" | "items" | "inline"
> & {
  /** The options: a flat array, or groups of `{ value, items }`. Objects shaped `{ value, label }` show their label. */
  items?: readonly unknown[]
  /** The chosen values, when you control them. Pair it with `onValueChange`. */
  value?: Value[]
  /** The values it starts with, when it controls itself. */
  defaultValue?: Value[]
  /** Called with the new values when an option is chosen or removed, the field is cleared or all are selected. */
  onValueChange?: (value: Value[]) => void
}) {
  const [uncontrolled, setUncontrolled] = React.useState<unknown[]>(defaultValue ?? [])
  const value = (valueProp ?? uncontrolled) as unknown[]
  const [query, setQuery] = React.useState("")
  const [fieldLabel, setFieldLabel] = React.useState<string | undefined>(undefined)
  const { dir } = useUiConfig()
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const registerTrigger = React.useCallback((node: HTMLButtonElement | null) => {
    triggerRef.current = node
    if (node) setFieldLabel(node.labels?.[0]?.textContent?.trim() || node.getAttribute("aria-label") || undefined)
  }, [])
  const trigger = React.useCallback(() => triggerRef.current, [])
  const options = React.useMemo(() => flatten(items), [items])
  // A form reset puts an uncontrolled field back to the options it started with, as a native select.
  const initial = React.useRef(uncontrolled)
  useFormReset(triggerRef, () => setUncontrolled(initial.current), { enabled: valueProp === undefined, form: props.form })

  const setValue = React.useCallback(
    (next: unknown[]) => {
      if (valueProp === undefined) setUncontrolled(next)
      onValueChange?.(next as Value[])
    },
    [valueProp, onValueChange]
  )
  const labelOf = React.useCallback(
    (entry: unknown) => (itemToStringLabel ? itemToStringLabel(entry as Value) : defaultLabel(entry, options)),
    [itemToStringLabel, options]
  )
  const same = React.useCallback(
    (a: unknown, b: unknown) => (isItemEqualToValue ? isItemEqualToValue(a as Value, b as Value) : defaultSame(a, b)),
    [isItemEqualToValue]
  )
  const context = React.useMemo(
    () => ({ value, setValue, labelOf, same, query, disabled, fieldLabel, trigger, registerTrigger }),
    [value, setValue, labelOf, same, query, disabled, fieldLabel, trigger, registerTrigger]
  )

  return (
    <MultiSelectContext.Provider value={context}>
      {/* Base UI learns the provider's direction, so its own keys flip right to left. */}
      <DirectionProvider direction={dir}>
        <ComboboxPrimitive.Root
          multiple
          items={items as Value[]}
          value={value as Value[]}
          onValueChange={(next) => setValue(next as unknown[])}
          itemToStringLabel={itemToStringLabel}
          isItemEqualToValue={isItemEqualToValue ?? (defaultSame as (a: Value, b: Value) => boolean)}
          disabled={disabled}
          onInputValueChange={(next, details) => {
            onInputValueChange?.(next, details)
            // Picking an option keeps the filter, so several can be picked from one search.
            if (details.isItemPress) details.cancel()
            if (!details.isCanceled) setQuery(next)
          }}
          {...props}
        >
          {children}
        </ComboboxPrimitive.Root>
      </DirectionProvider>
    </MultiSelectContext.Provider>
  )
}

/** @since 0.1.0 */
function MultiSelectTrigger({
  className,
  size,
  variant,
  fluid = false,
  clearable = false,
  children,
  onKeyDown,
  ref,
  ...props
}: WithStringClassName<ComboboxPrimitive.Trigger.Props> & {
  /** 26, 34 or 42 px tall while it holds one row. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Fills the width of its container. */
  fluid?: boolean
  /** Shows a clear button inside the field while options are chosen; it empties the selection. */
  clearable?: boolean
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const strings = useUiStrings()
  const selection = useMultiSelect("MultiSelectTrigger")
  const showClear = clearable && selection.value.length > 0 && !selection.disabled && !props.disabled
  const { registerTrigger } = selection
  const setRefs = React.useCallback(
    (node: HTMLButtonElement | null) => {
      registerTrigger(node)
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref, registerTrigger]
  )

  const trigger = (
    <ComboboxPrimitive.Trigger
      ref={setRefs}
      data-slot="multi-select-trigger"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        // Backspace on the closed field removes the last chosen option.
        if (event.key === "Backspace" && !event.currentTarget.hasAttribute("data-popup-open") && selection.value.length) {
          event.preventDefault()
          selection.setValue(selection.value.slice(0, -1))
        }
      }}
      className={cn(
        // Select's trigger: 34px tall from 6px × 10px padding and a 20px line, a solid `--field` fill, the `--control`
        // edge darkening on hover and turning `--ring` on focus and while open; the chevron is 14px in the field-icon
        // colour in a 36px end column; disabled fills `--field-disabled`. Chips sit 3px from the edge and the field grows
        // a row when they wrap.
        "group/multi-select-trigger flex min-h-8.75 w-fit min-w-0 cursor-default items-center justify-between gap-2 rounded-md border border-control bg-field py-1.5 ps-2.5 pe-2.75 text-start text-sm text-foreground shadow-(--bui-shadow-field) transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none select-none hover:border-control-hover focus-visible:border-ring data-popup-open:border-ring disabled:cursor-not-allowed disabled:border-control disabled:bg-field-disabled disabled:text-field-disabled-foreground data-placeholder:text-field-placeholder has-data-[slot=multi-select-chip]:py-0.5 has-data-[slot=multi-select-chip]:ps-0.75 [&>svg]:pointer-events-none [&>svg]:size-3.5 [&>svg]:shrink-0 [&>svg]:text-field-icon",
        // sm is 26px with 12px text and a 12px chevron; lg 42px with 16px text and a 16px chevron.
        "data-[size=sm]:min-h-7 data-[size=sm]:py-1 data-[size=sm]:ps-2 data-[size=sm]:pe-2.5 data-[size=sm]:text-xs data-[size=sm]:[&>svg]:size-3 data-[size=lg]:min-h-10.5 data-[size=lg]:py-2 data-[size=lg]:ps-3 data-[size=lg]:pe-2.5 data-[size=lg]:text-base data-[size=lg]:[&>svg]:size-4",
        "data-[variant=filled]:enabled:bg-field-filled",
        "aria-invalid:border-invalid aria-invalid:data-placeholder:text-field-invalid-foreground aria-invalid:focus-visible:border-ring aria-invalid:data-popup-open:border-ring",
        fluid && "w-full",
        clearable && "group-hover/multi-select-control:border-control-hover",
        showClear && "gap-8.75",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon aria-hidden="true" />
    </ComboboxPrimitive.Trigger>
  )

  if (!clearable) return trigger

  return (
    // A clearable trigger sits in a wrapper with its clear button beside it, as a button inside a button is invalid.
    <div
      data-slot="multi-select-control"
      className={cn("group/multi-select-control relative flex w-fit has-[>.w-full]:w-full", fluid && "w-full")}
    >
      {trigger}
      {showClear ? (
        <button
          type="button"
          data-slot="multi-select-clear"
          aria-label={strings.clear}
          onClick={() => {
            selection.setValue([])
            selection.trigger()?.focus()
          }}
          className="absolute end-8 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-field-icon transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-ring"
        >
          <XIcon aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

/** @since 0.1.0 */
function MultiSelectValue({
  className,
  placeholder,
  display = "labels",
  maxShown,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** Shown, in the muted colour, while nothing is chosen. */
  placeholder?: React.ReactNode
  /** `labels` joins the chosen labels with commas; `chips` shows each as a removable chip; `count` says "3 selected". */
  display?: "labels" | "chips" | "count"
  /** Shows this many labels or chips, then "+{count} more". */
  maxShown?: number
}) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const selection = useMultiSelect("MultiSelectValue")
  const { value, labelOf } = selection
  const format = (count: number) => new Intl.NumberFormat(locale).format(count)

  if (value.length === 0) {
    return (
      <span data-slot="multi-select-value" className={cn("min-w-0 flex-1 truncate", className)} {...props}>
        {placeholder}
      </span>
    )
  }
  if (display === "count") {
    return (
      <span data-slot="multi-select-value" className={cn("min-w-0 flex-1 truncate", className)} {...props}>
        {fillString(strings.selectedCount, { count: format(value.length) })}
      </span>
    )
  }

  const shown = maxShown !== undefined ? value.slice(0, Math.max(0, maxShown)) : value
  const rest = value.length - shown.length
  const more =
    rest > 0 ? (
      <span data-slot="multi-select-more" className="shrink-0 text-muted-foreground">
        {fillString(strings.moreSelected, { count: format(rest) })}
      </span>
    ) : null

  if (display === "chips") {
    return (
      <span data-slot="multi-select-value" className={cn("flex min-w-0 flex-1 flex-wrap items-center gap-1", className)} {...props}>
        {shown.map((entry, index) => {
          const label = labelOf(entry)
          const remove = () => selection.setValue(value.filter((item) => !selection.same(item, entry)))
          return (
            <span
              key={`${label}-${index}`}
              data-slot="multi-select-chip"
              // The look of the library's Chip: a 26px pill on `--secondary` with 12px text; 22px in `sm`, 32px in `lg`.
              className="inline-flex h-7 max-w-full min-w-0 items-center gap-1.5 rounded-2xl bg-secondary ps-2.5 pe-1.5 text-xs text-accent-foreground group-data-[size=lg]/multi-select-trigger:h-8 group-data-[size=lg]/multi-select-trigger:text-sm group-data-[size=sm]/multi-select-trigger:h-5.5 group-data-[size=sm]/multi-select-trigger:ps-2 group-data-[size=sm]/multi-select-trigger:pe-1"
            >
              <span className="truncate">{label}</span>
              {/* A pointer shortcut only: the field is one tab stop, and the keyboard removes options in the list or
                  with Backspace on the field. */}
              <span
                aria-hidden="true"
                data-slot="multi-select-chip-remove"
                title={fillString(strings.removeItem, { label })}
                onPointerDown={(event) => event.stopPropagation()}
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
                  if (!selection.disabled) remove()
                }}
                // A transparent 24px square centred on the 22px circle (16px in `sm`) takes its presses, so the target
                // meets WCAG 2.2's 24 × 24 minimum (2.5.8) while the circle drawn keeps its size.
                className="relative -ms-[3px] inline-flex size-5.5 shrink-0 cursor-pointer items-center justify-center rounded-full after:absolute after:top-1/2 after:left-1/2 after:size-6 after:-translate-1/2 hover:bg-secondary-hover group-data-[size=sm]/multi-select-trigger:size-4 [&>svg]:size-3.5 group-data-[size=sm]/multi-select-trigger:[&>svg]:size-3"
              >
                <XIcon />
              </span>
            </span>
          )
        })}
        {more}
      </span>
    )
  }

  return (
    <span data-slot="multi-select-value" className={cn("flex min-w-0 flex-1 items-center gap-1.5", className)} {...props}>
      <span className="min-w-0 truncate">{shown.map(labelOf).join(", ")}</span>
      {more}
    </span>
  )
}

/** @since 0.1.0 */
function MultiSelectContent({
  className,
  children,
  filter = false,
  filterPlaceholder,
  selectAll = false,
  ...props
}: React.ComponentProps<typeof ComboboxContent> & {
  /** Shows the filter field at the top of the list. Without it, typing still filters, and the field shows once used. */
  filter?: boolean
  /** The filter field's placeholder. */
  filterPlaceholder?: string
  /** Shows a checkbox at the top that chooses, or clears, every option the filter leaves. */
  selectAll?: boolean
}) {
  const strings = useUiStrings()
  const selection = useMultiSelect("MultiSelectContent")
  const label = selection.fieldLabel ?? strings.toggleOptions
  const showFilter = filter || selection.query !== ""
  // The dialog, sheet or popover the field sits in, found from a marker in the field's place; else `<body>`.
  const marker = React.useRef<HTMLSpanElement>(null)
  const [container, setContainer] = React.useState<HTMLElement | undefined>(undefined)
  React.useEffect(() => {
    setContainer(marker.current?.closest<HTMLElement>(OVERLAY_CONTENT) ?? undefined)
  }, [])

  return (
    <>
      <span ref={marker} hidden data-slot="multi-select-portal-marker" />
      <ComboboxContent data-slot="multi-select-content" aria-label={label} container={container} className={className} {...props}>
        <div
          data-slot="multi-select-header"
          // 8px above, 14px at the start (in line with the options' marks), 8px at the end and 2px below.
          className={cn(
            "flex shrink-0 items-center gap-2 ps-3.5 pe-2 pt-2 pb-0.5",
            !showFilter && !selectAll && "sr-only"
          )}
        >
          {selectAll && <MultiSelectSelectAll showLabel={!showFilter} />}
          <InputGroup size="default" variant="default" className={cn("flex-1", !showFilter && "sr-only")}>
            <ComboboxPrimitive.Input
              render={<InputGroupInput />}
              data-slot="multi-select-filter"
              aria-label={strings.filterOptions}
              placeholder={filterPlaceholder}
              onKeyDown={(event) => {
                // With no text typed, Space toggles the highlighted option, as in a select.
                if (event.key === " " && event.currentTarget.value === "") {
                  event.preventDefault()
                  event.currentTarget
                    .closest("[data-slot=multi-select-content]")
                    ?.querySelector<HTMLElement>("[data-slot=multi-select-item][data-highlighted]")
                    ?.click()
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        {children}
      </ComboboxContent>
    </>
  )
}

function MultiSelectSelectAll({ showLabel }: { showLabel: boolean }) {
  const strings = useUiStrings()
  const selection = useMultiSelect("MultiSelectContent")
  const filtered = flatten(ComboboxPrimitive.useFilteredItems<unknown>())
  const id = React.useId()
  const chosen = filtered.filter((entry) => selection.value.some((item) => selection.same(item, entry)))
  const checked = filtered.length > 0 && chosen.length === filtered.length ? true : chosen.length > 0 ? "indeterminate" : false

  return (
    <div data-slot="multi-select-select-all" className="flex shrink-0 items-center gap-2 py-1.5">
      <Checkbox
        id={id}
        size="default"
        checked={checked}
        disabled={selection.disabled || filtered.length === 0}
        aria-label={showLabel ? undefined : strings.selectAll}
        onCheckedChange={() => {
          if (checked === true) {
            selection.setValue(selection.value.filter((item) => !filtered.some((entry) => selection.same(item, entry))))
          } else {
            const missing = filtered.filter((entry) => !selection.value.some((item) => selection.same(item, entry)))
            selection.setValue([...selection.value, ...missing])
          }
        }}
      />
      {showLabel && (
        <label htmlFor={id} className="text-sm text-foreground select-none">
          {strings.selectAll}
        </label>
      )}
    </div>
  )
}

/** @since 0.1.0 */
function MultiSelectList(props: React.ComponentProps<typeof ComboboxList>) {
  return <ComboboxList data-slot="multi-select-list" {...props} />
}

/** @since 0.1.0 */
function MultiSelectItem({
  className,
  children,
  indicator = "check",
  icon,
  description,
  ...props
}: WithStringClassName<ComboboxPrimitive.Item.Props> & {
  /** `check` marks a chosen option with a check at the start; `checkbox` draws a checkbox there. */
  indicator?: "check" | "checkbox"
  /** Leading media beside both lines, such as an avatar or a flag. */
  icon?: React.ReactNode
  /** A second, muted line under the label. */
  description?: React.ReactNode
}) {
  const rich = icon != null || description != null

  return (
    <ComboboxPrimitive.Item
      data-slot="multi-select-item"
      data-indicator={indicator}
      // Select's option: 29px from 4px × 10px padding and a 20px line, a 4px radius, `--accent` while highlighted; a
      // chosen one fills `--highlight` (`--highlight-focus` while highlighted); its mark sits 10px from the start and the
      // text 32px (36px after a checkbox).
      className={cn(
        "group/multi-select-item relative flex w-full shrink-0 cursor-default items-center gap-2 rounded-sm py-1 ps-8 pe-2.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-highlight data-selected:text-highlight-foreground data-selected:data-highlighted:bg-highlight-focus data-selected:data-highlighted:text-highlight-foreground data-disabled:pointer-events-none data-disabled:opacity-60 data-[indicator=checkbox]:ps-9 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        rich && "gap-3 py-2",
        className
      )}
      {...props}
    >
      {indicator === "checkbox" ? (
        <span
          aria-hidden="true"
          data-slot="multi-select-item-checkbox"
          // The library's checkbox, drawn: an 18px box, `--primary` with a 12px check once chosen.
          className="absolute start-2.5 top-1/2 flex size-4.5 -translate-y-1/2 items-center justify-center rounded-sm border border-control bg-field text-primary-foreground group-data-selected/multi-select-item:border-primary group-data-selected/multi-select-item:bg-primary group-data-selected/multi-select-item:group-data-highlighted/multi-select-item:border-highlight-foreground"
        >
          <CheckIcon className="hidden size-3 group-data-selected/multi-select-item:block" />
        </span>
      ) : (
        <ComboboxPrimitive.ItemIndicator
          data-slot="multi-select-item-indicator"
          render={<span className="pointer-events-none absolute start-2.5 flex size-3.5 items-center justify-center" />}
        >
          <CheckIcon className="size-3.5 text-current" />
        </ComboboxPrimitive.ItemIndicator>
      )}
      {rich ? (
        <>
          {icon != null ? (
            <span data-slot="multi-select-item-icon" className="flex shrink-0 items-center">
              {icon}
            </span>
          ) : null}
          <div data-slot="multi-select-item-body" className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">{children}</div>
            {description != null ? (
              <div className="text-xs text-muted-foreground in-data-selected:text-highlight-foreground/70">{description}</div>
            ) : null}
          </div>
        </>
      ) : (
        children
      )}
    </ComboboxPrimitive.Item>
  )
}

/** @since 0.1.0 */
function MultiSelectGroup(props: React.ComponentProps<typeof ComboboxGroup>) {
  return <ComboboxGroup data-slot="multi-select-group" {...props} />
}

/** @since 0.1.0 */
function MultiSelectLabel(props: React.ComponentProps<typeof ComboboxLabel>) {
  return <ComboboxLabel data-slot="multi-select-label" {...props} />
}

/** @since 0.1.0 */
function MultiSelectSeparator(props: React.ComponentProps<typeof ComboboxSeparator>) {
  return <ComboboxSeparator data-slot="multi-select-separator" {...props} />
}

/** @since 0.1.0 */
function MultiSelectEmpty(props: React.ComponentProps<typeof ComboboxEmpty>) {
  return <ComboboxEmpty data-slot="multi-select-empty" {...props} />
}

/** @since 0.1.0 */
function MultiSelectCollection(props: React.ComponentProps<typeof ComboboxCollection>) {
  return <ComboboxCollection {...props} />
}

export {
  MultiSelect,
  MultiSelectCollection,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectLabel,
  MultiSelectList,
  MultiSelectSeparator,
  MultiSelectTrigger,
  MultiSelectValue,
}
