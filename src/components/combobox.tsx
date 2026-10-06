"use client"

import * as React from "react"
// boolean-ui patch: imports the combobox entry of Base UI only, as the other Base UI components do (stock: the package
// root).
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { useFormReset } from "@/lib/form-reset"
import { useLabelName } from "@/lib/label-name"
import { cn, fillString } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"

import { InputGroup, InputGroupInput } from "@/components/input-group"
import {
  useControlSize,
  useFieldVariant,
  useUiConfig,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

type WithStringClassName<T> = Omit<T, "className"> & { className?: string }

/**
 * Escape closes an open popup and nothing else. A Radix dialog listens for Escape on the document before the field
 * sees it, and would close itself with the popup; marking the key as handled (`preventDefault`) while the popup is open
 * keeps the dialog open, and Base UI still closes the popup.
 */
function useEscapeGuard(popup: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && popup.current?.hasAttribute("data-open")) event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [popup])
}

const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation()

/** Two values alike: the same value, or lists of the same values (a multiple combobox). */
function sameValue(a: unknown, b: unknown) {
  if (Object.is(a, b)) return true
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((entry, i) => Object.is(entry, b[i]))
}

/** The details Base UI passes with a change, for the change a form reset makes. */
function resetDetails(): ComboboxPrimitive.Root.ChangeEventDetails {
  let canceled = false
  let propagation = false
  return {
    reason: "none",
    event: new Event("reset"),
    cancel: () => {
      canceled = true
    },
    allowPropagation: () => {
      propagation = true
    },
    get isCanceled() {
      return canceled
    },
    get isPropagationAllowed() {
      return propagation
    },
    trigger: undefined,
  }
}

// `reset` puts the combobox back to its first value, `focus` saying the input had focus; the root then starts again and
// `takeFocus` tells the new input, once, to take that focus back.
const ComboboxResetContext = React.createContext<{ reset: (focus: boolean) => void; takeFocus: () => boolean } | null>(null)

/** @since 0.1.0 */
function Combobox<Value, Multiple extends boolean | undefined = false, Item = Value>(
  props: ComboboxPrimitive.Root.Props<Value, Multiple, Item>
) {
  const { dir } = useUiConfig()
  // boolean-ui patch: a form reset puts the combobox back to its first value, as every field of the library (stock: it
  // keeps its value). An uncontrolled one starts again from `defaultValue`; a controlled one is given the value it
  // started with through `onValueChange`, as Select does.
  const [resetCount, setResetCount] = React.useState(0)
  const [firstValue] = React.useState(() => (props.value !== undefined ? props.value : props.defaultValue))
  const chosen = React.useRef<unknown>(props.defaultValue)
  const refocus = React.useRef(false)
  const latest = React.useRef(props)
  React.useEffect(() => {
    latest.current = props
  })
  const reset = React.useCallback(
    (focus: boolean) => {
      const { value, defaultValue, multiple, onValueChange } = latest.current
      const blank = multiple ? [] : null
      const notify = onValueChange as ((value: unknown, details: ComboboxPrimitive.Root.ChangeEventDetails) => void) | undefined
      if (value !== undefined) {
        if (!sameValue(value, firstValue ?? blank)) notify?.(firstValue ?? blank, resetDetails())
        return
      }
      refocus.current = focus
      setResetCount((count) => count + 1)
      if (!sameValue(chosen.current ?? blank, defaultValue ?? blank)) {
        chosen.current = defaultValue
        notify?.(defaultValue ?? blank, resetDetails())
      }
    },
    [firstValue]
  )
  const resetApi = React.useMemo(
    () => ({
      reset,
      takeFocus: () => {
        const focus = refocus.current
        refocus.current = false
        return focus
      },
    }),
    [reset]
  )
  const { onValueChange } = props
  const handleValueChange = React.useCallback<NonNullable<typeof onValueChange>>(
    (value, details) => {
      onValueChange?.(value, details)
      if (!details.isCanceled) chosen.current = value
    },
    [onValueChange]
  )

  return (
    // boolean-ui patch: Base UI learns the provider's direction, so its own keys flip right to left, such as the arrows
    // between the chips and their input (stock: the root alone, always left to right).
    <DirectionProvider direction={dir}>
      <ComboboxResetContext.Provider value={resetApi}>
        <ComboboxPrimitive.Root key={resetCount} {...props} onValueChange={handleValueChange} />
      </ComboboxResetContext.Provider>
    </DirectionProvider>
  )
}

/**
 * The element Base UI renders as the combobox's input: named by its own labels while the list is open (Base UI hides
 * the visible label from assistive technology then), and the root's link to a form reset.
 */
function ComboboxControl({ plain = false, ...props }: React.ComponentProps<"input"> & { plain?: boolean }) {
  const { input, ...named } = useLabelName(props)
  const resetApi = React.useContext(ComboboxResetContext)
  useFormReset(input, () => resetApi?.reset(input.current === input.current?.ownerDocument.activeElement), {
    form: props.form,
  })
  React.useEffect(() => {
    if (resetApi?.takeFocus()) input.current?.focus()
  }, [resetApi, input])

  return plain ? <input {...props} {...named} /> : <InputGroupInput {...props} {...named} />
}

/** @since 0.1.0 */
function ComboboxValue({ ...props }: ComboboxPrimitive.Value.Props) {
  return <ComboboxPrimitive.Value data-slot="combobox-value" {...props} />
}

/** @since 0.1.0 */
function ComboboxTrigger({
  className,
  children,
  ...props
}: WithStringClassName<ComboboxPrimitive.Trigger.Props>) {
  const strings = useUiStrings()

  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      // boolean-ui patch: the button is named from the provider (stock: unnamed).
      aria-label={strings.toggleOptions}
      className={cn(
        // boolean-ui patch: the BooleanPress look — a 36px end cell of the field, divided from the text by a line in the
        // field's edge colour, its 14px chevron in the field-icon colour; 26px with a 12px chevron in `sm`, 42px with a
        // 16px one in `lg` (stock: a 24px ghost button with a 16px muted chevron).
        "flex w-9 shrink-0 cursor-pointer items-center justify-center self-stretch border-s border-inherit text-field-icon outline-none select-none disabled:cursor-not-allowed group-data-[size=lg]/input-group:w-10.5 group-data-[size=sm]/input-group:w-7 [&_svg:not([class*='size-'])]:size-3.5 group-data-[size=lg]/input-group:[&_svg:not([class*='size-'])]:size-4 group-data-[size=sm]/input-group:[&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon data-slot="combobox-trigger-icon" aria-hidden="true" className="pointer-events-none" />
    </ComboboxPrimitive.Trigger>
  )
}

// boolean-ui patch: exported, so a field built from parts can show it (stock: private to ComboboxInput).
/** @since 0.1.0 */
function ComboboxClear({ className, ...props }: WithStringClassName<ComboboxPrimitive.Clear.Props>) {
  const strings = useUiStrings()

  return (
    <ComboboxPrimitive.Clear
      data-slot="combobox-clear"
      // boolean-ui patch: named from the provider's `clear` string (stock: unnamed).
      aria-label={strings.clear}
      className={cn(
        // boolean-ui patch: the field's clear button — a bare × in the field-icon colour, `--foreground` on hover, a 24px
        // box round a 14px icon that keeps the field's end padding; 20px round 12px in `sm`, 26px round 16px in `lg`
        // (stock: a ghost icon button).
        "-ms-1.25 me-1.25 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm text-field-icon transition-[color] duration-(--bui-duration-control) outline-none hover:text-foreground group-data-[size=lg]/input-group:-ms-1.5 group-data-[size=lg]/input-group:me-1.5 group-data-[size=lg]/input-group:size-7 group-data-[size=sm]/input-group:-ms-1 group-data-[size=sm]/input-group:me-1 group-data-[size=sm]/input-group:size-5 [&>svg]:size-3.5 group-data-[size=lg]/input-group:[&>svg]:size-4 group-data-[size=sm]/input-group:[&>svg]:size-3",
        className
      )}
      {...props}
    >
      <XIcon aria-hidden="true" className="pointer-events-none" />
    </ComboboxPrimitive.Clear>
  )
}

/** @since 0.1.0 */
function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  loading = false,
  size,
  variant,
  ...props
}: Omit<WithStringClassName<ComboboxPrimitive.Input.Props>, "size"> & {
  /** Shows the chevron button at the field's end, which opens and closes the list. */
  showTrigger?: boolean
  /** Shows a clear button while a value is chosen; it empties the field and keeps focus in it. */
  showClear?: boolean
  /** Shows a spinner in the field while results load. Pair it with `ComboboxStatus` in the list, which announces it. */
  loading?: boolean
  /** 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
}) {
  return (
    // boolean-ui patch: the field is the library's InputGroup with its size and variant, as wide as its container like
    // every text field, and registered with Base UI as the input group, so the list lines up with the whole field
    // (stock: an unsized group as wide as its input, the list lined up with the input alone).
    <ComboboxPrimitive.InputGroup
      // boolean-ui patch: the group and the input take Base UI's disabled, which joins the root's, a Field's and this
      // part's own (stock: this part's own only, so a disabled root left the input enabled and submitting).
      render={(groupProps, state) => (
        <InputGroup
          {...groupProps}
          size={size}
          variant={variant}
          data-disabled={state.disabled || undefined}
          className={className}
        />
      )}
    >
      {/* boolean-ui patch: the input keeps its label's name while the list is open, and resets with its form (stock: the
          group's input alone). */}
      <ComboboxPrimitive.Input disabled={disabled} render={<ComboboxControl />} {...props} />
      {loading && (
        // boolean-ui patch: new part — the loading spinner, in the clear button's place (stock: none).
        <span
          data-slot="combobox-loading"
          aria-hidden="true"
          className="-ms-1.25 me-1.25 flex size-6 shrink-0 items-center justify-center text-field-icon group-data-[size=lg]/input-group:-ms-1.5 group-data-[size=lg]/input-group:me-1.5 group-data-[size=lg]/input-group:size-7 group-data-[size=sm]/input-group:-ms-1 group-data-[size=sm]/input-group:me-1 group-data-[size=sm]/input-group:size-5"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-3.5 animate-spin group-data-[size=lg]/input-group:size-4 group-data-[size=sm]/input-group:size-3">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="18 100" />
          </svg>
        </span>
      )}
      {showClear && <ComboboxClear disabled={disabled} />}
      {showTrigger && <ComboboxTrigger disabled={disabled} />}
      {children}
    </ComboboxPrimitive.InputGroup>
  )
}

/** @since 0.1.0 */
function ComboboxContent({
  className,
  side = "bottom",
  // boolean-ui patch: 2px below the field, as Select (stock: 6px).
  sideOffset = 2,
  align = "start",
  alignOffset = 0,
  anchor,
  // boolean-ui patch: the portal's container can be set (stock: always <body>).
  container,
  ref,
  ...props
}: WithStringClassName<ComboboxPrimitive.Popup.Props> &
  Pick<ComboboxPrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset" | "anchor"> &
  Pick<ComboboxPrimitive.Portal.Props, "container">) {
  const popup = React.useRef<HTMLDivElement | null>(null)
  // boolean-ui patch: Escape closes the open list only, not a Radix dialog or sheet around it (stock: both close).
  useEscapeGuard(popup)
  const setPopup = React.useCallback(
    (node: HTMLDivElement | null) => {
      popup.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  return (
    <ComboboxPrimitive.Portal container={container}>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        className="isolate z-50"
        // boolean-ui patch: works inside a modal Radix dialog or sheet (stock: unusable there with the pointer). It takes
        // back the pointer events the dialog turns off on the page, and keeps wheel and touch scrolling from the dialog's
        // scroll lock, which listens on the document; Radix counts presses in this portal as inside, since it renders
        // within the dialog's React tree, and focus stays in the field.
        style={{ pointerEvents: "auto" }}
        onWheel={stopPropagation}
        onTouchMove={stopPropagation}
      >
        <ComboboxPrimitive.Popup
          ref={setPopup}
          data-slot="combobox-content"
          data-chips={!!anchor}
          data-bui-motion="overlay"
          data-bui-portal=""
          className={cn(
            // boolean-ui patch: the BooleanPress look, as Select's list — the field's width, a 6px radius, a 1px edge,
            // the overlay shadow, 14px text on a 20px line, at most 24rem or the room below; a column, so a header and
            // the scrolling list share the height; motion from theme.css (stock: 26px wider than the field, a ring).
            "group/combobox-content relative flex max-h-[min(24rem,var(--available-height))] w-(--anchor-width) max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-hidden rounded-md border border-border bg-popover text-sm text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  )
}

/** @since 0.1.0 */
function ComboboxList({ className, ...props }: WithStringClassName<ComboboxPrimitive.List.Props>) {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        // boolean-ui patch: 4px padding and 2px between options, as Select's list; it takes the popup's remaining height
        // and scrolls (stock: no gap, its own max height).
        "flex min-h-0 flex-col gap-0.5 overflow-y-auto overscroll-contain p-1 scroll-py-1 outline-none data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function ComboboxItem({
  className,
  children,
  icon,
  description,
  ...props
}: WithStringClassName<ComboboxPrimitive.Item.Props> & {
  /** Leading media beside both lines, such as an avatar or a flag. */
  icon?: React.ReactNode
  /** A second, muted line under the label. */
  description?: React.ReactNode
}) {
  const rich = icon != null || description != null

  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        // boolean-ui patch: the option of Select's list — 29px from 4px × 10px padding and a 20px line, a 4px radius; the
        // highlighted option takes `--accent`, the chosen one fills `--highlight` (`--highlight-focus` while highlighted);
        // disabled at 60% (stock: 6px × 8px padding, no chosen fill, 50%).
        "relative flex w-full shrink-0 cursor-default items-center gap-2 rounded-sm py-1 ps-2.5 pe-8 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-highlight data-selected:text-highlight-foreground data-selected:data-highlighted:bg-highlight-focus data-selected:data-highlighted:text-highlight-foreground data-disabled:pointer-events-none data-disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        // boolean-ui patch: an option with media or a description has 8px above and below and 12px from the media to the
        // text, as Select's (stock: no such option).
        rich && "gap-3 py-2",
        className
      )}
      {...props}
    >
      {rich ? (
        <>
          {icon != null ? (
            <span data-slot="combobox-item-icon" className="flex shrink-0 items-center">
              {icon}
            </span>
          ) : null}
          <div data-slot="combobox-item-body" className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">{children}</div>
            {description != null ? (
              <div
                data-slot="combobox-item-description"
                className="text-xs text-muted-foreground in-data-selected:text-highlight-foreground/70"
              >
                {description}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        children
      )}
      <ComboboxPrimitive.ItemIndicator
        data-slot="combobox-item-indicator"
        // boolean-ui patch: a 14px check 10px from the end, in the option's text colour (stock: 16px, 8px in).
        render={<span className="pointer-events-none absolute end-2.5 flex size-3.5 items-center justify-center" />}
      >
        <CheckIcon className="pointer-events-none size-3.5 text-current" />
      </ComboboxPrimitive.ItemIndicator>
    </ComboboxPrimitive.Item>
  )
}

/** @since 0.1.0 */
function ComboboxGroup({ className, ...props }: WithStringClassName<ComboboxPrimitive.Group.Props>) {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      // boolean-ui patch: 2px between the options of a group, as in the list (stock: none).
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function ComboboxLabel({ className, ...props }: WithStringClassName<ComboboxPrimitive.GroupLabel.Props>) {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      // boolean-ui patch: a 14px semibold group name with the options' 4px × 10px padding, as Select's (stock: 12px
      // regular, 6px × 8px).
      className={cn("px-2.5 py-1 text-sm font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function ComboboxCollection({ ...props }: ComboboxPrimitive.Collection.Props) {
  return <ComboboxPrimitive.Collection data-slot="combobox-collection" {...props} />
}

/** @since 0.1.0 */
function ComboboxEmpty({ className, children, ...props }: WithStringClassName<ComboboxPrimitive.Empty.Props>) {
  const strings = useUiStrings()

  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        // boolean-ui patch: stays in the page, as Base UI requires of a live region, and takes room only while the list is
        // empty: the message sits in the list's 4px padding with an option's 4px × 10px (stock: hidden with `display:
        // none` while the list has options).
        "m-1 shrink-0 px-2.5 py-1 text-sm text-muted-foreground empty:m-0 empty:p-0",
        className
      )}
      {...props}
    >
      {/* boolean-ui patch: "No results" from the provider when given no children (stock: children required). */}
      {children ?? strings.noResults}
    </ComboboxPrimitive.Empty>
  )
}

/**
 * A polite live region for an asynchronous list. With `loading` it shows a spinner and the provider's "Loading results…";
 * otherwise it shows its children, such as an error, or nothing. It stays in the page so changes are announced.
 *
 * @since 0.1.0
 */
function ComboboxStatus({
  className,
  loading = false,
  children,
  ...props
}: WithStringClassName<ComboboxPrimitive.Status.Props> & {
  /** Shows a spinner and the provider's `loadingResults` string in place of the children. */
  loading?: boolean
}) {
  const strings = useUiStrings()

  return (
    <ComboboxPrimitive.Status
      data-slot="combobox-status"
      // boolean-ui patch: new part — Base UI's status region with the empty message's look and a 14px icon gap (stock:
      // not exported).
      className={cn(
        "m-1 flex shrink-0 items-center gap-2 px-2.5 py-1 text-sm text-muted-foreground empty:m-0 empty:p-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="18 100" />
          </svg>
          {strings.loadingResults}
        </>
      ) : (
        children
      )}
    </ComboboxPrimitive.Status>
  )
}

/** @since 0.1.0 */
function ComboboxSeparator({ className, ...props }: WithStringClassName<ComboboxPrimitive.Separator.Props>) {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      // boolean-ui patch: 2px margins, which the list's 2px gap brings to 4px each side, as Select (stock: 4px).
      className={cn("-mx-1 my-0.5 h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

const ComboboxChipsContext = React.createContext<ControlSize>("default")

/** @since 0.1.0 */
function ComboboxChips({
  className,
  size,
  variant,
  ...props
}: WithStringClassName<React.ComponentPropsWithRef<typeof ComboboxPrimitive.Chips> & ComboboxPrimitive.Chips.Props> & {
  /** 26, 34 or 42 px tall while it holds one row. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)

  return (
    <ComboboxChipsContext.Provider value={resolvedSize}>
      {/* boolean-ui patch: the chips field is registered with Base UI as the input group, so the list lines up with the
          whole field without an `anchor` (stock: `useComboboxAnchor` required). */}
      <ComboboxPrimitive.InputGroup
        render={<ComboboxPrimitive.Chips />}
        data-slot="combobox-chips"
        data-size={resolvedSize}
        data-variant={resolvedVariant}
        className={cn(
          // boolean-ui patch: the BooleanPress field look — a solid `--field` fill, the `--control` edge darkening on
          // hover and turning `--ring` on focus with no ring; 34px tall while it holds one row, from 2px padding round
          // the 28px row of the input; chips start 3px from the edge, the text 10px; `--invalid` edge; disabled fills
          // `--field-disabled` (stock: 36px minimum, transparent fill, a 3px ring).
          "group/combobox-chips flex w-full min-w-0 cursor-text flex-wrap items-center gap-1 rounded-md border border-control bg-field px-2.5 py-0.5 text-sm text-foreground shadow-(--bui-shadow-field) transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) hover:border-control-hover has-[input:focus-visible]:border-ring has-data-[slot=combobox-chip]:ps-0.75 has-aria-invalid:border-invalid has-aria-invalid:has-[input:focus-visible]:border-ring has-[input:disabled]:cursor-not-allowed has-[input:disabled]:border-control has-[input:disabled]:bg-field-disabled has-[input:disabled]:text-field-disabled-foreground",
          // boolean-ui patch: sizes — 26px from the 22px row of `sm` with 12px text, 42px from the 36px row of `lg` with
          // 16px text (stock: one size).
          "data-[size=sm]:px-2 data-[size=sm]:text-xs data-[size=sm]:has-data-[slot=combobox-chip]:ps-0.75 data-[size=lg]:px-3 data-[size=lg]:text-base data-[size=lg]:has-data-[slot=combobox-chip]:ps-1",
          // boolean-ui patch: `variant="filled"` fills `--field-filled`, on hover and focus too (stock: no variant).
          "data-[variant=filled]:not-has-[input:disabled]:bg-field-filled",
          className
        )}
        {...props}
      />
    </ComboboxChipsContext.Provider>
  )
}

/** @since 0.1.0 */
function ComboboxChip({
  className,
  children,
  showRemove = true,
  // boolean-ui patch: the text for the remove button's name when the children are not plain text (stock: no name).
  label,
  ...props
}: WithStringClassName<ComboboxPrimitive.Chip.Props> & {
  showRemove?: boolean
  /** The chip's text for the remove button's name, "Remove {label}", when its children are not plain text. */
  label?: string
}) {
  const strings = useUiStrings()
  const size = React.useContext(ComboboxChipsContext)
  const name = label ?? (typeof children === "string" || typeof children === "number" ? String(children) : "")

  return (
    <ComboboxPrimitive.Chip
      data-slot="combobox-chip"
      data-size={size}
      className={cn(
        // boolean-ui patch: the look of the library's Chip — a 26px pill on `--secondary` with 12px text in
        // `--accent-foreground`, `--secondary-hover` while focused with the arrow keys; 22px in `sm`, 32px with 14px text
        // in `lg` (stock: a 22px square-cornered muted chip).
        "inline-flex h-7 max-w-full min-w-0 shrink-0 cursor-default items-center gap-1.5 rounded-2xl bg-secondary px-2.5 text-xs font-normal whitespace-nowrap text-accent-foreground outline-none focus:bg-secondary-hover has-data-[slot=combobox-chip-remove]:pe-1.5 aria-disabled:opacity-60 data-[size=lg]:h-8 data-[size=lg]:px-3 data-[size=lg]:text-sm data-[size=sm]:h-5.5 data-[size=sm]:gap-1 data-[size=sm]:px-2 data-[size=sm]:has-data-[slot=combobox-chip-remove]:pe-1 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {showRemove && (
        <ComboboxPrimitive.ChipRemove
          data-slot="combobox-chip-remove"
          // boolean-ui patch: named "Remove {label}" from the provider (stock: unnamed).
          aria-label={fillString(strings.removeItem, { label: name })}
          // boolean-ui patch: the Chip's remove button — a round 22px button round a 14px ×, 16px round 12px in `sm`; a
          // transparent 24px square centred on it takes its presses, so the target meets WCAG 2.2's 24 × 24 minimum
          // (2.5.8) while the circle drawn keeps its size (stock: a ghost icon button at half opacity).
          className="relative -ms-[3px] inline-flex size-5.5 shrink-0 cursor-pointer items-center justify-center rounded-full text-accent-foreground outline-none after:absolute after:top-1/2 after:left-1/2 after:size-6 after:-translate-1/2 hover:bg-secondary-hover in-data-[size=sm]:size-4 [&>svg]:size-3.5 in-data-[size=sm]:[&>svg]:size-3"
        >
          <XIcon aria-hidden="true" className="pointer-events-none" />
        </ComboboxPrimitive.ChipRemove>
      )}
    </ComboboxPrimitive.Chip>
  )
}

/** @since 0.1.0 */
function ComboboxChipsInput({ className, ...props }: WithStringClassName<ComboboxPrimitive.Input.Props>) {
  return (
    <ComboboxPrimitive.Input
      // boolean-ui patch: the input keeps its label's name while the list is open, and resets with its form (stock: a
      // plain input).
      render={<ComboboxControl plain />}
      data-slot="combobox-chip-input"
      className={cn(
        // boolean-ui patch: a 28px row of 14px text with the muted placeholder (red while invalid), so the field is 34px
        // tall; 22px in `sm`, 36px in `lg` (stock: unsized).
        "h-7 min-w-16 flex-1 bg-transparent text-inherit outline-none placeholder:text-field-placeholder disabled:cursor-not-allowed aria-invalid:placeholder:text-field-invalid-foreground group-data-[size=lg]/combobox-chips:h-9 group-data-[size=sm]/combobox-chips:h-5.5",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function useComboboxAnchor() {
  return React.useRef<HTMLDivElement | null>(null)
}

// boolean-ui patch: new export — Base UI's filtered items, for a virtualised list (stock: none).
/**
 * The options left after filtering, inside a `Combobox`: what a virtualised list renders.
 *
 * @since 0.1.0
 */
const useComboboxFilteredItems = ComboboxPrimitive.useFilteredItems

export {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxCollection,
  ComboboxEmpty,
  ComboboxStatus,
  ComboboxSeparator,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxTrigger,
  ComboboxClear,
  ComboboxValue,
  useComboboxAnchor,
  useComboboxFilteredItems,
}
