"use client"

// Cascade select: a select-like trigger opening a Radix DropdownMenu, one submenu for each level of the options.

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronRightIcon, XIcon } from "lucide-react"
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import {
  useControlSize,
  useFieldVariant,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

import { Spinner } from "@/components/spinner"
import { useFormReset } from "@/lib/form-reset"

/**
 * One option of a cascade: a leaf, which can be chosen, or a group, which opens the next level.
 *
 * @since 0.1.0
 */
interface CascadeSelectOption {
  /** Unique across the whole tree: the value a leaf sets, and the key of a group. */
  value: string
  label: string
  /** Leading media in the menu, such as a flag or an icon. */
  icon?: React.ReactNode
  disabled?: boolean
  /** The next level. An option with children is a group and cannot be chosen itself. */
  children?: CascadeSelectOption[]
  /** A group whose children `loadOptions` fetches the first time it opens. */
  hasChildren?: boolean
}

const isGroup = (option: CascadeSelectOption) => option.children !== undefined || option.hasChildren === true

/** The options from the top level down to the leaf with this value, or null. */
function findPath(
  options: CascadeSelectOption[],
  value: string,
  loaded: Record<string, CascadeSelectOption[]>
): CascadeSelectOption[] | null {
  for (const option of options) {
    const children = option.children ?? loaded[option.value]
    if (!isGroup(option)) {
      if (option.value === value) return [option]
    } else if (children) {
      const rest = findPath(children, value, loaded)
      if (rest) return [option, ...rest]
    }
  }
  return null
}

/**
 * Scrolls the chosen option into view in its level, and the group that opened each level into view in the level above,
 * so a menu that reopens on a choice far down a long level shows it. Each level scrolls by itself; the page does not.
 */
function scrollPathIntoView(option: HTMLElement) {
  let item: HTMLElement | null = option
  while (item) {
    const level: HTMLElement | null = item.closest("[role=menu]")
    if (!level) return
    const style = getComputedStyle(level)
    const levelBox = level.getBoundingClientRect()
    const itemBox = item.getBoundingClientRect()
    // The level may still be growing in with its scale animation: distances on screen are scaled back to the layout's.
    const scale = level.offsetHeight > 0 ? levelBox.height / level.offsetHeight || 1 : 1
    const itemTop = (itemBox.top - levelBox.top) / scale - level.clientTop + level.scrollTop
    const itemBottom = itemTop + itemBox.height / scale
    const viewTop = level.scrollTop + (parseFloat(style.paddingTop) || 0)
    const viewBottom = level.scrollTop + level.clientHeight - (parseFloat(style.paddingBottom) || 0)
    if (itemTop < viewTop) level.scrollTop -= viewTop - itemTop
    else if (itemBottom > viewBottom) level.scrollTop += itemBottom - viewBottom
    // A level is labelled by the group that opened it; the top level by the field, which ends the walk.
    const opener = level.getAttribute("aria-labelledby")
    item = opener ? level.ownerDocument.getElementById(opener) : null
    if (item?.getAttribute("role") !== "menuitem") return
  }
}

interface CascadeContextValue {
  value: string
  loaded: Record<string, CascadeSelectOption[]>
  /** Groups whose `loadOptions` rejected; opening one again retries. */
  failed: Record<string, true>
  openPath: string[]
  setSubOpen: (depth: number, option: CascadeSelectOption, open: boolean) => void
  choose: (option: CascadeSelectOption, path: CascadeSelectOption[]) => void
  /** Called by the chosen leaf as it mounts, so a menu that reopens on the chosen path focuses it. */
  revealed: (node: HTMLElement | null) => void
}

const CascadeContext = React.createContext<CascadeContextValue | null>(null)

const itemClasses =
  // The visual target's option: 4px × 10px padding, 14px text on a 21px line, a 4px radius; the focused option takes
  // `--accent`; 14px icons in the field-icon colour, darker while focused; disabled at 60%.
  "relative flex cursor-default items-center gap-2 rounded-sm px-2.5 py-1 text-sm/normal whitespace-nowrap outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground"

const levelClasses =
  // The visual target's panel: 4px padding, options edge to edge, a 6px radius, the content edge and the overlay shadow.
  "z-50 flex flex-col overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-sm/normal text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"

function CascadeStatusRow({ busy, children }: { busy?: boolean; children: React.ReactNode }) {
  return (
    <DropdownMenuPrimitive.Item
      disabled
      data-slot="cascade-select-status"
      className="flex cursor-default items-center gap-2 rounded-sm px-2.5 py-1 text-sm/normal whitespace-nowrap text-muted-foreground outline-hidden select-none"
    >
      {busy ? <Spinner aria-hidden="true" role="presentation" /> : null}
      {children}
    </DropdownMenuPrimitive.Item>
  )
}

function CascadeLevel({ options, path }: { options: CascadeSelectOption[]; path: CascadeSelectOption[] }) {
  const context = React.useContext(CascadeContext)!
  const strings = useUiStrings()
  if (options.length === 0) return <CascadeStatusRow>{strings.noResults}</CascadeStatusRow>
  return (
    <DropdownMenuPrimitive.RadioGroup value={context.value} data-slot="cascade-select-level" className="flex flex-col">
      {options.map((option) =>
        isGroup(option) ? (
          <CascadeGroup key={option.value} option={option} path={path} />
        ) : (
          <DropdownMenuPrimitive.RadioItem
            key={option.value}
            ref={option.value === context.value ? context.revealed : undefined}
            value={option.value}
            disabled={option.disabled}
            textValue={option.label}
            data-slot="cascade-select-item"
            onSelect={() => context.choose(option, [...path, option])}
            className={cn(
              itemClasses,
              // The chosen option fills `--highlight`, `--highlight-focus` while focused; its icons take its text colour.
              "data-[state=checked]:bg-highlight data-[state=checked]:text-highlight-foreground data-[state=checked]:focus:bg-highlight-focus data-[state=checked]:focus:text-highlight-foreground data-[state=checked]:[&_svg:not([class*='text-'])]:text-current"
            )}
          >
            {option.icon}
            <span className="truncate">{option.label}</span>
          </DropdownMenuPrimitive.RadioItem>
        )
      )}
    </DropdownMenuPrimitive.RadioGroup>
  )
}

function CascadeGroup({ option, path }: { option: CascadeSelectOption; path: CascadeSelectOption[] }) {
  const context = React.useContext(CascadeContext)!
  const strings = useUiStrings()
  const depth = path.length
  const children = option.children ?? context.loaded[option.value]
  const failed = !children && context.failed[option.value] === true

  return (
    <DropdownMenuPrimitive.Sub
      open={context.openPath[depth] === option.value}
      onOpenChange={(open) => context.setSubOpen(depth, option, open)}
    >
      <DropdownMenuPrimitive.SubTrigger
        disabled={option.disabled}
        textValue={option.label}
        data-slot="cascade-select-group"
        className={cn(
          itemClasses,
          // A group stays `--accent` while its level is open; its 12px chevron points to the next level.
          "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-[state=open]:[&_svg:not([class*='text-'])]:text-muted-foreground"
        )}
      >
        {option.icon}
        <span className="truncate">{option.label}</span>
        <ChevronRightIcon aria-hidden="true" className="ms-auto size-3 rtl:rotate-180" />
      </DropdownMenuPrimitive.SubTrigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.SubContent
          data-slot="cascade-select-sub-content"
          data-bui-motion="overlay"
          // The next level starts at its group's edge, over its parent's padding and edge, and lines its first option up
          // with the group, as the visual target's; it is never wider than the room on its side.
          sideOffset={0}
          alignOffset={-5}
          loop
          aria-busy={children || failed ? undefined : true}
          className={cn(
            levelClasses,
            "max-h-(--radix-dropdown-menu-content-available-height) max-w-(--radix-dropdown-menu-content-available-width) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin)"
          )}
        >
          {children ? (
            <CascadeLevel options={children} path={[...path, option]} />
          ) : failed ? (
            <CascadeStatusRow>{strings.loadFailed}</CascadeStatusRow>
          ) : (
            <CascadeStatusRow busy>{strings.loading}</CascadeStatusRow>
          )}
        </DropdownMenuPrimitive.SubContent>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Sub>
  )
}

/** @since 0.1.0 */
function CascadeSelect({
  options,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  loadOptions,
  placeholder,
  showPath = false,
  separator = " / ",
  size,
  variant,
  fluid = false,
  clearable = false,
  loading = false,
  disabled = false,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  name,
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "children"> & {
  /** The top level of the tree. */
  options: CascadeSelectOption[]
  /** The chosen leaf's value, when you control it; `""` means nothing is chosen. Pair it with `onValueChange`. */
  value?: string
  /** The value it starts with, when it controls itself. */
  defaultValue?: string
  /** Called with the new value and the options from the top level down to it; with `""` and `[]` when cleared. */
  onValueChange?: (value: string, path: CascadeSelectOption[]) => void
  /** Fetches the children of a group marked `hasChildren`, the first time it opens. */
  loadOptions?: (option: CascadeSelectOption) => Promise<CascadeSelectOption[]>
  /** Shown while nothing is chosen, in the muted colour. */
  placeholder?: React.ReactNode
  /** Shows every level of the chosen option ("United States / California / Los Angeles"), not only the leaf. */
  showPath?: boolean
  /** What `showPath` puts between the levels. */
  separator?: string
  /** 28, 35 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Fills the width of its container. */
  fluid?: boolean
  /** Shows a clear button inside the field while a value is chosen. */
  clearable?: boolean
  /** The top level is still loading: a spinner takes the chevron's place and the menu says so. */
  loading?: boolean
  /** Whether the menu is open, when you control it. Pair it with `onOpenChange`. */
  open?: boolean
  /** Whether the menu starts open. */
  defaultOpen?: boolean
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** The field name: a hidden input carries the value in a form. */
  name?: string
}) {
  const strings = useUiStrings()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const generatedId = React.useId()
  const triggerId = id ?? `${generatedId}-trigger`
  const valueId = `${generatedId}-value`
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolledValue
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const [loaded, setLoaded] = React.useState<Record<string, CascadeSelectOption[]>>({})
  const [failed, setFailed] = React.useState<Record<string, true>>({})
  const pending = React.useRef(new Set<string>())
  // Loads that settle after the field has gone set no state; the reveal's timer and frame are cancelled with it.
  const mounted = React.useRef(false)
  const revealTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const revealFrame = React.useRef<number | undefined>(undefined)
  React.useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(revealTimer.current)
      if (revealFrame.current !== undefined) cancelAnimationFrame(revealFrame.current)
    }
  }, [])
  const [openPath, setOpenPath] = React.useState<string[]>([])
  // "opening" from the moment the menu opens on a chosen option until that option has focus.
  const reveal = React.useRef<"idle" | "opening" | "focusing">("idle")

  const path = React.useMemo(() => (value ? findPath(options, value, loaded) : null), [options, value, loaded])
  const display = path ? (showPath ? path.map((option) => option.label).join(separator) : path[path.length - 1].label) : value

  const setValue = React.useCallback(
    (next: string, nextPath: CascadeSelectOption[]) => {
      if (next === value) return
      if (valueProp === undefined) setUncontrolledValue(next)
      onValueChange?.(next, nextPath)
    },
    [value, valueProp, onValueChange]
  )

  const setOpen = (next: boolean) => {
    // Opening shows the chosen option in place: every level on its path opens, and the option takes focus.
    reveal.current = next && path !== null ? "opening" : "idle"
    clearTimeout(revealTimer.current)
    if (reveal.current === "opening") {
      revealTimer.current = setTimeout(() => {
        if (reveal.current === "opening") reveal.current = "idle"
      }, 500)
    }
    setOpenPath(next && path ? path.slice(0, -1).map((option) => option.value) : [])
    if (openProp === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  // A form reset puts an uncontrolled field back to the value it started with, as a native select is.
  const [initialValue] = React.useState(defaultValue)
  useFormReset(
    triggerRef,
    () => setValue(initialValue, initialValue ? (findPath(options, initialValue, loaded) ?? []) : []),
    { enabled: valueProp === undefined, form: props.form }
  )

  const load = React.useCallback(
    (option: CascadeSelectOption) => {
      if (!loadOptions || option.children || loaded[option.value] || pending.current.has(option.value)) return
      pending.current.add(option.value)
      // A level that failed before says "Loading" again while it retries.
      setFailed((previous) => {
        if (!previous[option.value]) return previous
        const rest = { ...previous }
        delete rest[option.value]
        return rest
      })
      Promise.resolve()
        .then(() => loadOptions(option))
        .then(
          (children) => {
            if (mounted.current) setLoaded((previous) => ({ ...previous, [option.value]: children }))
          },
          // A rejected load is not kept: the level says so, and opening the group again retries.
          () => {
            if (mounted.current) setFailed((previous) => ({ ...previous, [option.value]: true }))
          }
        )
        .finally(() => pending.current.delete(option.value))
    },
    [loadOptions, loaded]
  )

  const context = React.useMemo<CascadeContextValue>(
    () => ({
      value,
      loaded,
      failed,
      openPath,
      setSubOpen: (depth, option, subOpen) => {
        // While the chosen path opens, Radix closes each level it mounts in React's strict mode (its unmount
        // cleanup runs once); those requests are ignored.
        if (!subOpen && reveal.current !== "idle") return
        if (subOpen) load(option)
        setOpenPath((previous) =>
          subOpen
            ? [...previous.slice(0, depth), option.value]
            : previous[depth] === option.value
              ? previous.slice(0, depth)
              : previous
        )
      },
      choose: (option, nextPath) => setValue(option.value, nextPath),
      revealed: (node) => {
        if (!node || reveal.current !== "opening") return
        reveal.current = "focusing"
        // After Radix has placed its own focus in each level as it opened.
        revealFrame.current = requestAnimationFrame(() => {
          node.focus({ preventScroll: true })
          scrollPathIntoView(node)
          reveal.current = "idle"
        })
      },
    }),
    [value, loaded, failed, openPath, load, setValue]
  )

  // The trigger is a menu button, so its name would be its label alone; it is named by its label and its value instead,
  // as a select is. A `Label htmlFor` is found from the button's `labels`.
  // The menu is named by the same labels, without the value.
  const labelIds = React.useRef<string | null>(null)
  React.useEffect(() => {
    const button = triggerRef.current
    labelIds.current = null
    if (!button || ariaLabelledBy || ariaLabel) return
    const labels = Array.from(button.labels ?? [])
    if (labels.length === 0) {
      button.removeAttribute("aria-labelledby")
      return
    }
    const ids = labels.map((label, index) => {
      if (!label.id) label.id = `${generatedId}-label-${index}`
      return label.id
    })
    labelIds.current = ids.join(" ")
    button.setAttribute("aria-labelledby", [...ids, valueId].join(" "))
  })

  const labelledBy = ariaLabelledBy ? `${ariaLabelledBy} ${valueId}` : ariaLabel ? `${triggerId} ${valueId}` : undefined
  const showClear = clearable && value !== "" && !disabled

  const trigger = (
    <DropdownMenuPrimitive.Trigger
      ref={triggerRef}
      id={triggerId}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      aria-busy={loading || undefined}
      data-slot="cascade-select-trigger"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      data-placeholder={value === "" ? "" : undefined}
      className={cn(
        // The library's select field: 35px tall from 6px × 10px padding and a 21px line (sm 28px, lg 42px), a `--field`
        // fill, the `--control` edge darkening on hover and turning `--ring` on focus and while open; the chevron is 14px
        // in the field-icon colour in a 36px end column; disabled fills `--field-disabled`. Never wider than its
        // container: a long value truncates.
        "group/cascade-select-trigger flex w-fit max-w-full items-center justify-between gap-5.25 rounded-md border border-control bg-field py-1.5 ps-2.5 pe-2.75 text-start text-sm/normal whitespace-nowrap text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none hover:border-control-hover focus-visible:border-ring data-[state=open]:border-ring disabled:cursor-not-allowed disabled:border-control disabled:bg-field-disabled disabled:text-field-disabled-foreground data-[placeholder]:text-muted-foreground data-[size=sm]:gap-5 data-[size=sm]:py-1 data-[size=sm]:ps-2 data-[size=sm]:pe-3 data-[size=sm]:text-xs/normal",
        "data-[size=lg]:gap-5.5 data-[size=lg]:py-2 data-[size=lg]:ps-3 data-[size=lg]:pe-2.5 data-[size=lg]:text-base/normal",
        "data-[variant=filled]:enabled:bg-field-filled",
        "aria-invalid:border-invalid aria-invalid:data-[placeholder]:text-destructive-strong aria-invalid:focus-visible:border-ring aria-invalid:data-[state=open]:border-ring",
        fluid && "w-full",
        clearable && "group-hover/cascade-select-control:border-control-hover",
        showClear && "gap-8.75 data-[size=sm]:gap-8.5 data-[size=lg]:gap-9",
        className
      )}
      {...props}
    >
      <span data-slot="cascade-select-value" id={valueId} className="min-h-lh min-w-0 flex-1 truncate">
        {value === "" ? placeholder : display}
      </span>
      {loading ? (
        <Spinner
          aria-hidden="true"
          role="presentation"
          className="size-3.5 text-control-hover group-data-[size=lg]/cascade-select-trigger:size-4 group-data-[size=sm]/cascade-select-trigger:size-3"
        />
      ) : (
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3.5 shrink-0 text-control-hover group-data-[size=lg]/cascade-select-trigger:size-4 group-data-[size=sm]/cascade-select-trigger:size-3"
        />
      )}
    </DropdownMenuPrimitive.Trigger>
  )

  return (
    <CascadeContext.Provider value={context}>
      <DropdownMenuPrimitive.Root open={open} onOpenChange={setOpen}>
        {clearable ? (
          // A clearable field sits in a wrapper with its clear button beside it, not inside it, as a button inside a
          // button is invalid; the wrapper is as wide as the trigger, or full width with `fluid` or `w-full`.
          <div
            data-slot="cascade-select-control"
            className={cn("group/cascade-select-control relative flex w-fit max-w-full has-[>.w-full]:w-full", fluid && "w-full")}
          >
            {trigger}
            {showClear ? (
              <button
                type="button"
                data-slot="cascade-select-clear"
                aria-label={strings.clear}
                onClick={() => {
                  setValue("", [])
                  triggerRef.current?.focus()
                }}
                className="absolute end-8 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-control-hover transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:outline-solid"
              >
                <XIcon aria-hidden="true" className="size-3.5" />
              </button>
            ) : null}
          </div>
        ) : (
          trigger
        )}
        {/* A disabled field is not submitted, as a native one is not. */}
        {name ? <input type="hidden" name={name} value={value} disabled={disabled} form={props.form} /> : null}
        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align="start"
            sideOffset={2}
            loop
            ref={(node) => {
              if (node && labelIds.current) node.setAttribute("aria-labelledby", labelIds.current)
            }}
            aria-labelledby={ariaLabelledBy ?? triggerId}
            aria-busy={loading || undefined}
            data-slot="cascade-select-content"
            data-bui-motion="overlay"
            className={cn(
              levelClasses,
              // As wide as the field at least, 2px below it; never wider than the room on its side, so a long label
              // truncates.
              "max-h-(--radix-dropdown-menu-content-available-height) max-w-(--radix-dropdown-menu-content-available-width) min-w-(--radix-dropdown-menu-trigger-width) origin-(--radix-dropdown-menu-content-transform-origin)"
            )}
          >
            {loading ? (
              <CascadeStatusRow busy>{strings.loading}</CascadeStatusRow>
            ) : (
              <CascadeLevel options={options} path={[]} />
            )}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </CascadeContext.Provider>
  )
}

/** The props of `CascadeSelect`. @since 0.1.0 */
type CascadeSelectProps = React.ComponentProps<typeof CascadeSelect>

export { CascadeSelect }
export type { CascadeSelectOption, CascadeSelectProps }
