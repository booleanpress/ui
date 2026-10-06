// Built on plain elements, to the APG listbox pattern: an always-visible list of options with single or multiple
// selection, `aria-activedescendant` for the highlighted option, type-ahead and an optional filter field.
"use client"

import * as React from "react"
import { useFormReset } from "@/lib/form-reset"
import { cn } from "@/lib/utils"
import { CheckIcon, SearchIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input-group"
import { useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

interface ListboxContextValue {
  multiple: boolean
  disabled: boolean
  indicator: "none" | "check" | "checkbox"
  query: string
  /** Whether the list shows no option, which the empty message waits for. */
  empty: boolean
  focused: boolean
  active: string | null
  isSelected: (value: string) => boolean
  choose: (value: string, event?: React.MouseEvent) => void
  focusOnHover: boolean
  setActive: (value: string) => void
  idFor: (value: string) => string
  matches: (text: string) => boolean
  focusOwner: (value: string) => void
}

const ListboxContext = React.createContext<ListboxContextValue | null>(null)

function useListbox(part: string) {
  const context = React.useContext(ListboxContext)
  if (!context) throw new Error(`${part} must be used inside Listbox.`)
  return context
}

type ListboxSelectionProps =
  | {
      /** Lets people choose several options; Space and Enter toggle the highlighted one. */
      multiple?: false
      /** The chosen value, when you control it; `null` for none. Pair it with `onValueChange`. */
      value?: string | null
      /** The value it starts with, when it controls itself. */
      defaultValue?: string | null
      /** Called with the new value when an option is chosen. */
      onValueChange?: (value: string | null) => void
    }
  | {
      multiple: true
      value?: string[]
      defaultValue?: string[]
      onValueChange?: (value: string[]) => void
    }

/**
 * A list of options always in view, from which people choose one or, with `multiple`, several.
 *
 * @since 0.1.1
 */
// boolean-ui patch: configurable focus, modifier selection and a controlled filter use the existing option model.
function Listbox({
  className,
  children,
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  indicator = "none",
  filter = false,
  filterPlaceholder,
  filterValue,
  defaultFilterValue = "",
  onFilterValueChange,
  filterMatch = "contains",
  header,
  autoOptionFocus = true,
  selectOnFocus = false,
  focusOnHover = true,
  metaKeySelection = false,
  listClassName,
  name,
  form,
  onKeyDown,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> &
  ListboxSelectionProps & {
    /** Makes the list read-only and greys it; it leaves the tab order. */
    disabled?: boolean
    /** `none` marks chosen options with the fill only; `check` adds a check at the start; `checkbox` draws a checkbox. */
    indicator?: "none" | "check" | "checkbox"
    /** Shows a field above the list that filters the options as people type. */
    filter?: boolean
    /** The filter field's placeholder. */
    filterPlaceholder?: string
    /** Controlled query for the built-in filter. */
    filterValue?: string
    /** Initial query when the built-in filter is uncontrolled. */
    defaultFilterValue?: string
    /** Reports edits to the built-in filter, including controlled edits. */
    onFilterValueChange?: (value: string) => void
    /** Matching used by the built-in filter; a function receives text and query. */
    filterMatch?: "contains" | "startsWith" | ((text: string, query: string) => boolean)
    /** Content above the list, outside its listbox role, such as a select-all checkbox. */
    header?: React.ReactNode
    /** Highlights an option when focus enters. Defaults to true. */
    autoOptionFocus?: boolean
    /** Selects an option as keyboard or pointer focus moves to it. Defaults to false. */
    selectOnFocus?: boolean
    /** Moves the highlight on pointer hover while the list is focused. Defaults to true. */
    focusOnHover?: boolean
    /** In multiple mode, pointer choices replace selection unless Ctrl or Cmd is held. */
    metaKeySelection?: boolean
    /** Classes for the scrolling list inside the frame, such as a maximum height. */
    listClassName?: string
    /** Submits each chosen value as a hidden input of this name, as a native select does. */
    name?: string
    /** The id of the form the values belong to, for a list placed outside it. */
    form?: string
  }) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const baseId = React.useId()
  // An `id` given to the list is the one the filter field points at.
  const listId = props.id ?? `${baseId}-list`
  const list = React.useRef<HTMLDivElement>(null)
  const filterInput = React.useRef<HTMLInputElement>(null)
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(() =>
    multiple ? ((defaultValue as string[] | undefined) ?? []) : defaultValue != null ? [defaultValue as string] : []
  )
  // A form reset puts an uncontrolled list back to the value it started with, as a native select.
  const initial = React.useRef(uncontrolled)
  useFormReset(list, () => setUncontrolled(initial.current), { enabled: valueProp === undefined, form })
  const selected = React.useMemo(
    () =>
      valueProp === undefined ? uncontrolled : multiple ? ((valueProp as string[]) ?? []) : valueProp != null ? [valueProp as string] : [],
    [valueProp, uncontrolled, multiple]
  )
  const [active, setActiveState] = React.useState<string | null>(null)
  const [focused, setFocused] = React.useState(false)
  const focusingPointerOption = React.useRef(false)
  const [uncontrolledQuery, setUncontrolledQuery] = React.useState(defaultFilterValue)
  const query = filterValue ?? uncontrolledQuery
  const setQuery = (next: string) => {
    if (filterValue === undefined) setUncontrolledQuery(next)
    onFilterValueChange?.(next)
  }
  const [empty, setEmpty] = React.useState(false)
  const typeahead = React.useRef({ text: "", time: 0 })

  const idFor = React.useCallback((value: string) => `${baseId}-option-${encodeURIComponent(value)}`, [baseId])
  const options = () =>
    Array.from(list.current?.querySelectorAll<HTMLElement>('[role="option"]:not([aria-disabled="true"])') ?? [])

  const choose = React.useCallback(
    (value: string, event?: React.MouseEvent) => {
      if (disabled) return
      const replace = multiple && metaKeySelection && event && !event.ctrlKey && !event.metaKey
      // Selection following focus already chose this option. Pointer activation confirms it; Space/Enter can toggle.
      if (multiple && selectOnFocus && event && !replace && selected.includes(value)) return
      const next = multiple && !replace ? (selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]) : [value]
      if (valueProp === undefined) setUncontrolled(next)
      if (multiple) (onValueChange as ((value: string[]) => void) | undefined)?.(next)
      else if (!selected.includes(value)) (onValueChange as ((value: string | null) => void) | undefined)?.(value)
    },
    [disabled, multiple, selected, valueProp, onValueChange, metaKeySelection, selectOnFocus]
  )

  const setActive = React.useCallback(
    (value: string) => {
      setActiveState(value)
      document.getElementById(idFor(value))?.scrollIntoView?.({ block: "nearest" })
      if (selectOnFocus && !selected.includes(value)) choose(value)
    },
    [idFor, selectOnFocus, selected, choose]
  )

  const matches = React.useCallback(
    (text: string) => {
      if (!query) return true
      if (typeof filterMatch === "function") return filterMatch(text, query)
      const haystack = text.toLocaleLowerCase(locale)
      const needle = query.toLocaleLowerCase(locale)
      return filterMatch === "startsWith" ? haystack.startsWith(needle) : haystack.includes(needle)
    },
    [query, locale, filterMatch]
  )
  const focusOwner = React.useCallback((value: string) => {
    // Clicking an option must not also focus-select the first row before the click commits the intended row.
    setActiveState(value)
    focusingPointerOption.current = true
    ;(filter ? filterInput.current : list.current)?.focus()
    focusingPointerOption.current = false
  }, [filter])

  // Whether the filter (or the data) left no option, checked once the options have rendered: the empty message then says
  // so.
  React.useEffect(() => {
    setEmpty(!list.current?.querySelector('[role="option"]'))
  }, [query, children, filterMatch])

  // The highlight follows the options the filter leaves: when the highlighted one goes, the first one takes its place.
  React.useEffect(() => {
    if (active !== null && !document.getElementById(idFor(active))) {
      const first = list.current?.querySelector<HTMLElement>('[role="option"]:not([aria-disabled="true"])')
      setActiveState(first?.dataset.value ?? null)
    }
  }, [query, active, idFor, filterMatch, children])

  const move = (target: "next" | "previous" | "first" | "last") => {
    const all = options()
    if (all.length === 0) return
    const index = all.findIndex((option) => option.dataset.value === active)
    const next =
      target === "first"
        ? 0
        : target === "last"
          ? all.length - 1
          : index === -1
            ? 0
            : Math.min(all.length - 1, Math.max(0, index + (target === "next" ? 1 : -1)))
    setActive(all[next].dataset.value!)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>, fromFilter: boolean) => {
    if (disabled) return
    const keys: Record<string, () => void> = {
      ArrowDown: () => move("next"),
      ArrowUp: () => move("previous"),
      ...(fromFilter ? {} : { Home: () => move("first"), End: () => move("last") }),
      Enter: () => active !== null && choose(active),
      ...(fromFilter ? {} : { " ": () => active !== null && choose(active) }),
    }
    const action = keys[event.key]
    if (action && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault()
      action()
      return
    }
    // Type-ahead on the list: the letters typed within half a second pick the next option that starts with them.
    if (!fromFilter && event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = event.timeStamp
      const text = (now - typeahead.current.time < 500 ? typeahead.current.text : "") + event.key.toLocaleLowerCase(locale)
      typeahead.current = { text, time: now }
      const all = options()
      const start = Math.max(0, all.findIndex((option) => option.dataset.value === active))
      const ordered = [...all.slice(start + (text.length === 1 ? 1 : 0)), ...all.slice(0, start + (text.length === 1 ? 1 : 0))]
      const found = ordered.find((option) => (option.dataset.text ?? "").toLocaleLowerCase(locale).startsWith(text))
      if (found) setActive(found.dataset.value!)
    }
  }

  const onFocus = () => {
    setFocused(true)
    if (autoOptionFocus && !focusingPointerOption.current && (active === null || !document.getElementById(idFor(active)))) {
      const all = options()
      const first = all.find((option) => selected.includes(option.dataset.value!)) ?? all[0]
      if (first) setActive(first.dataset.value!)
    }
  }

  const context: ListboxContextValue = {
    multiple,
    disabled,
    indicator,
    query,
    empty,
    focused,
    active,
    isSelected: (value) => selected.includes(value),
    choose,
    setActive,
    idFor,
    matches,
    focusOwner,
    focusOnHover,
  }
  const activeId = focused && active !== null ? idFor(active) : undefined
  // The empty message is a live region beside the list, not inside it: a listbox may hold only options and groups.
  const parts = React.Children.toArray(children)
  const emptyMessages = parts.filter((child) => React.isValidElement(child) && child.type === ListboxEmpty)
  const listChildren = emptyMessages.length ? parts.filter((child) => !emptyMessages.includes(child)) : children

  return (
    <ListboxContext.Provider value={context}>
      <div
        data-slot="listbox"
        data-disabled={disabled || undefined}
        // The field look: a solid `--field` fill in a 1px `--control` edge with a 6px radius, `--ring` while it has focus;
        // `--invalid` when invalid; disabled fills `--field-disabled` and mutes its options.
        className={cn(
          "group/listbox flex w-full min-w-0 flex-col overflow-hidden rounded-md border border-control bg-field text-sm text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) has-[[role=listbox]:focus-visible]:border-ring has-[[aria-invalid=true]]:border-invalid has-[[aria-invalid=true]]:has-[[role=listbox]:focus-visible]:border-ring data-disabled:bg-field-disabled data-disabled:text-field-disabled-foreground",
          className
        )}
      >
        {(header != null || filter) && (
          <div data-slot="listbox-header" inert={disabled || undefined} className="flex shrink-0 flex-col gap-2 px-2 pt-2 pb-0.5">
            {header}
            {filter ? <InputGroup size="lg" variant="default">
              <InputGroupInput
                ref={filterInput}
                role="combobox"
                aria-label={strings.filterOptions}
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={activeId}
                placeholder={filterPlaceholder}
                disabled={disabled}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => handleKeyDown(event, true)}
                onFocus={onFocus}
                onBlur={() => setFocused(false)}
              />
              <InputGroupAddon align="inline-end">
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup> : null}
          </div>
        )}
        <div
          ref={list}
          id={listId}
          role="listbox"
          tabIndex={disabled ? -1 : filter ? -1 : 0}
          aria-multiselectable={multiple || undefined}
          aria-disabled={disabled || undefined}
          aria-activedescendant={filter ? undefined : activeId}
          data-slot="listbox-list"
          onKeyDown={(event) => {
            onKeyDown?.(event)
            if (!event.defaultPrevented) handleKeyDown(event, false)
          }}
          onFocus={filter ? undefined : onFocus}
          onBlur={filter ? undefined : () => setFocused(false)}
          // 4px padding and 2px between options, as Select's list; it scrolls past its maximum height.
          className={cn("flex min-h-0 flex-col gap-0.5 overflow-y-auto p-1 outline-none", listClassName)}
          {...props}
        >
          {listChildren}
        </div>
        {emptyMessages}
        {name
          ? selected.map((chosen) => <input key={chosen} type="hidden" name={name} value={chosen} disabled={disabled} form={form} />)
          : null}
      </div>
    </ListboxContext.Provider>
  )
}

/** @since 0.1.1 */
function ListboxItem({
  className,
  children,
  value,
  textValue,
  disabled = false,
  icon,
  description,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  children?: React.ReactNode
  /** The value this option chooses. */
  value: string
  /** The text matched by the filter and type-ahead, when the children are not plain text. */
  textValue?: string
  /** The option cannot be highlighted or chosen. */
  disabled?: boolean
  /** Leading media beside both lines, such as an avatar or a flag. */
  icon?: React.ReactNode
  /** A second, muted line under the label. */
  description?: React.ReactNode
}) {
  const listbox = useListbox("ListboxItem")
  const text = textValue ?? (typeof children === "string" ? children : value)
  if (!listbox.matches(text)) return null
  const selected = listbox.isSelected(value)
  const unavailable = disabled || listbox.disabled
  const rich = icon != null || description != null

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- the list keeps the focus and points at the highlighted option with aria-activedescendant (APG listbox).
    <div
      role="option"
      id={listbox.idFor(value)}
      aria-selected={selected}
      aria-disabled={unavailable || undefined}
      data-slot="listbox-item"
      data-value={value}
      data-text={text}
      data-selected={selected || undefined}
      data-disabled={unavailable || undefined}
      data-highlighted={(listbox.focused && listbox.active === value && !unavailable) || undefined}
      data-indicator={listbox.indicator}
      onMouseDown={(event) => {
        // Keep the focus on the list (or its filter), which owns the keyboard.
        event.preventDefault()
        if (!unavailable) listbox.focusOwner(value)
      }}
      onMouseMove={() => !unavailable && listbox.focused && listbox.focusOnHover && listbox.active !== value && listbox.setActive(value)}
      onClick={(event) => !unavailable && listbox.choose(value, event)}
      // Select's option: 29px from 4px × 10px padding and a 21px line, a 4px radius, `--accent` while highlighted; a
      // chosen one fills `--highlight` (`--highlight-focus` while highlighted); a mark sits 10px from the start. In a disabled list the chosen one keeps a quieter `--control` fill.
      className={cn(
        "group/listbox-item relative flex w-full shrink-0 cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1 select-none hover:not-data-selected:bg-accent hover:not-data-selected:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-highlight data-selected:text-highlight-foreground data-selected:data-highlighted:bg-highlight-focus data-selected:data-highlighted:text-highlight-foreground data-disabled:opacity-60 data-[indicator=check]:ps-8 data-[indicator=checkbox]:ps-9 group-data-disabled/listbox:opacity-100 group-data-disabled/listbox:text-field-disabled-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        rich && "gap-3 py-2",
        className
      )}
      {...props}
    >
      {listbox.indicator === "check" && selected ? (
        <CheckIcon aria-hidden="true" data-slot="listbox-item-indicator" className="absolute start-2.5 size-3.5 text-current" />
      ) : null}
      {listbox.indicator === "checkbox" ? (
        <span
          aria-hidden="true"
          data-slot="listbox-item-checkbox"
          // The library's checkbox, drawn: an 18px box, `--primary` with a 12px check once chosen.
          className="absolute start-2.5 top-1/2 flex size-4.5 -translate-y-1/2 items-center justify-center rounded-sm border border-control bg-field text-primary-foreground group-data-selected/listbox-item:border-primary group-data-selected/listbox-item:bg-primary group-data-selected/listbox-item:group-data-highlighted/listbox-item:border-highlight-foreground"
        >
          {selected ? <CheckIcon className="size-3" /> : null}
        </span>
      ) : null}
      {rich ? (
        <>
          {icon != null ? (
            <span data-slot="listbox-item-icon" className="flex shrink-0 items-center">
              {icon}
            </span>
          ) : null}
          <div data-slot="listbox-item-body" className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">{children}</div>
            {description != null ? (
              <div className="text-xs text-muted-foreground in-data-selected:text-highlight-foreground/70">{description}</div>
            ) : null}
          </div>
        </>
      ) : (
        children
      )}
    </div>
  )
}

const ListboxGroupContext = React.createContext<string | undefined>(undefined)

/** @since 0.1.1 */
function ListboxGroup({ className, ...props }: React.ComponentProps<"div">) {
  const labelId = React.useId()

  return (
    <ListboxGroupContext.Provider value={labelId}>
      <div
        role="group"
        aria-labelledby={labelId}
        data-slot="listbox-group"
        // 2px between its options; it hides while the filter leaves it none.
        className={cn("flex flex-col gap-0.5 not-has-[[role=option]]:hidden", className)}
        {...props}
      />
    </ListboxGroupContext.Provider>
  )
}

/** @since 0.1.1 */
function ListboxLabel({ className, ...props }: React.ComponentProps<"div">) {
  const labelId = React.useContext(ListboxGroupContext)

  return (
    <div
      id={labelId}
      role="presentation"
      data-slot="listbox-label"
      // A 14px semibold group name with the options' 4px × 10px padding, as Select's.
      className={cn("px-2.5 py-1 text-sm font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ListboxSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      data-slot="listbox-separator"
      // Hidden from assistive technology, since a listbox holds only options and groups.
      className={cn("-mx-1 my-0.5 h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

/**
 * The message shown in place of the options when the filter leaves none: "No results" from the provider, or its
 * children. Place it as a direct child of `Listbox`: it renders after the list, as a polite live region, so the change
 * is announced and the listbox holds only options.
 *
 * @since 0.1.1
 */
function ListboxEmpty({ className, children, ...props }: React.ComponentProps<"div">) {
  const strings = useUiStrings()
  const listbox = useListbox("ListboxEmpty")

  return (
    <div
      role="status"
      data-slot="listbox-empty"
      // Takes room only while the list has no option: the place of an option, 14px from the frame's edge and 8px from
      // its top and bottom, in the muted colour. Empty, it stays in the page, as a live region must.
      className={cn("-mt-1 mb-1 px-3.5 py-1 text-sm text-muted-foreground empty:m-0 empty:p-0", className)}
      {...props}
    >
      {listbox.empty ? (children ?? strings.noResults) : null}
    </div>
  )
}

export { Listbox, ListboxEmpty, ListboxGroup, ListboxItem, ListboxLabel, ListboxSeparator }
