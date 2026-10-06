// Built on Base UI's Autocomplete (`@base-ui/react/autocomplete`): a text field whose suggestions are optional, with the
// library's field and list look.
"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { useFormReset } from "@/lib/form-reset"
import { useLabelName } from "@/lib/label-name"
import { cn } from "@/lib/utils"
import { ChevronDownIcon, XIcon } from "lucide-react"

import { InputGroup, InputGroupInput } from "@/components/input-group"
import { useUiConfig, useUiStrings, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

type WithStringClassName<T> = Omit<T, "className"> & { className?: string }

/** While the list is open, Escape closes the list only: a Radix dialog around it sees the key as handled. */
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

const SPINNER = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="18 100" />
  </svg>
)

// A 24px box round a 14px icon that keeps the field's end padding; 20px round 12px in `sm`, 26px round 16px in `lg`.
const END_ICON =
  "-ms-1.25 me-1.25 flex size-6 shrink-0 items-center justify-center rounded-sm text-field-icon group-data-[size=lg]/input-group:-ms-1.5 group-data-[size=lg]/input-group:me-1.5 group-data-[size=lg]/input-group:size-7 group-data-[size=sm]/input-group:-ms-1 group-data-[size=sm]/input-group:me-1 group-data-[size=sm]/input-group:size-5 [&>svg]:size-3.5 group-data-[size=lg]/input-group:[&>svg]:size-4 group-data-[size=sm]/input-group:[&>svg]:size-3"

/** The details Base UI passes with a change, for the change a form reset makes. */
function resetDetails(): AutocompletePrimitive.Root.ChangeEventDetails {
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

// `reset` puts the field back to its first text, `focus` saying the input had focus; the root then starts again and
// `takeFocus` tells the new input, once, to take that focus back.
const AutocompleteResetContext = React.createContext<{ reset: (focus: boolean) => void; takeFocus: () => boolean } | null>(null)

// Base UI's root inside its direction provider, set from the library's provider, so its own keys flip right to left. A
// form reset puts the field back to its first text, as every field of the library: an uncontrolled one starts again from
// `defaultValue`; a controlled one is given the text it started with through `onValueChange`.
function AutocompleteRoot(props: React.ComponentProps<typeof AutocompletePrimitive.Root>) {
  const { dir } = useUiConfig()
  const [resetCount, setResetCount] = React.useState(0)
  const [firstValue] = React.useState(() => String((props.value !== undefined ? props.value : props.defaultValue) ?? ""))
  const typed = React.useRef(String(props.defaultValue ?? ""))
  const refocus = React.useRef(false)
  const latest = React.useRef(props)
  React.useEffect(() => {
    latest.current = props
  })
  const reset = React.useCallback(
    (focus: boolean) => {
      const { value, defaultValue, onValueChange } = latest.current
      if (value !== undefined) {
        if (String(value) !== firstValue) onValueChange?.(firstValue, resetDetails())
        return
      }
      refocus.current = focus
      setResetCount((count) => count + 1)
      const initial = String(defaultValue ?? "")
      if (typed.current !== initial) {
        typed.current = initial
        onValueChange?.(initial, resetDetails())
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
      if (!details.isCanceled) typed.current = value
    },
    [onValueChange]
  )

  return (
    <DirectionProvider direction={dir}>
      <AutocompleteResetContext.Provider value={resetApi}>
        <AutocompletePrimitive.Root key={resetCount} {...props} onValueChange={handleValueChange} />
      </AutocompleteResetContext.Provider>
    </DirectionProvider>
  )
}

/**
 * The element Base UI renders as the field's input: named by its own labels while the list is open (Base UI hides the
 * visible label from assistive technology then), and the root's link to a form reset.
 */
function AutocompleteControl(props: React.ComponentProps<typeof InputGroupInput>) {
  const { input, ...named } = useLabelName(props)
  const resetApi = React.useContext(AutocompleteResetContext)
  useFormReset(input, () => resetApi?.reset(input.current === input.current?.ownerDocument.activeElement), {
    form: props.form,
  })
  React.useEffect(() => {
    if (resetApi?.takeFocus()) input.current?.focus()
  }, [resetApi, input])

  return <InputGroupInput {...props} {...named} />
}

/**
 * A text field with suggestions: people type anything, and may pick a suggestion to fill the field.
 *
 * @since 0.1.1
 */
const Autocomplete = AutocompleteRoot as typeof AutocompletePrimitive.Root

/** @since 0.1.1 */
function AutocompleteTrigger({ className, ...props }: WithStringClassName<AutocompletePrimitive.Trigger.Props>) {
  const strings = useUiStrings()

  return (
    <AutocompletePrimitive.Trigger
      data-slot="autocomplete-trigger"
      aria-label={strings.toggleOptions}
      // A 36px end cell of the field, divided from the text by a line in the field's edge colour, its 14px chevron in
      // the field-icon colour; 26px in `sm`, 42px in `lg`.
      className={cn(
        "flex w-9 shrink-0 cursor-pointer items-center justify-center self-stretch border-s border-inherit text-field-icon outline-none select-none disabled:cursor-not-allowed group-data-[size=lg]/input-group:w-10.5 group-data-[size=sm]/input-group:w-7 [&_svg]:size-3.5 group-data-[size=lg]/input-group:[&_svg]:size-4 group-data-[size=sm]/input-group:[&_svg]:size-3",
        className
      )}
      {...props}
    >
      <ChevronDownIcon aria-hidden="true" className="pointer-events-none" />
    </AutocompletePrimitive.Trigger>
  )
}

/** @since 0.1.1 */
function AutocompleteClear({ className, ...props }: WithStringClassName<AutocompletePrimitive.Clear.Props>) {
  const strings = useUiStrings()

  return (
    <AutocompletePrimitive.Clear
      data-slot="autocomplete-clear"
      aria-label={strings.clear}
      className={cn(
        END_ICON,
        "cursor-pointer transition-[color] duration-(--bui-duration-control) outline-none hover:text-foreground",
        className
      )}
      {...props}
    >
      <XIcon aria-hidden="true" className="pointer-events-none" />
    </AutocompletePrimitive.Clear>
  )
}

/** @since 0.1.1 */
function AutocompleteInput({
  className,
  children,
  disabled = false,
  showTrigger = false,
  showClear = false,
  loading = false,
  size,
  variant,
  ...props
}: Omit<WithStringClassName<AutocompletePrimitive.Input.Props>, "size"> & {
  /** Shows a chevron cell at the field's end that opens the whole list of suggestions. */
  showTrigger?: boolean
  /** Shows a clear button while the field has text; it empties the field and keeps focus in it. */
  showClear?: boolean
  /** Shows a spinner in the field while suggestions load. Pair it with `AutocompleteStatus`, which announces it. */
  loading?: boolean
  /** 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
}) {
  return (
    // The library's InputGroup, registered with Base UI as the input group so the list lines up with the whole field.
    <AutocompletePrimitive.InputGroup
      // The group and the input take Base UI's disabled, which joins the root's, a Field's and this part's own, so a
      // disabled root disables the input and it submits nothing.
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
      <AutocompletePrimitive.Input disabled={disabled} render={<AutocompleteControl />} {...props} />
      {loading && (
        <span data-slot="autocomplete-loading" aria-hidden="true" className={END_ICON}>
          {SPINNER}
        </span>
      )}
      {showClear && <AutocompleteClear disabled={disabled} />}
      {showTrigger && <AutocompleteTrigger disabled={disabled} />}
      {children}
    </AutocompletePrimitive.InputGroup>
  )
}

/** @since 0.1.1 */
function AutocompleteContent({
  className,
  side = "bottom",
  sideOffset = 2,
  align = "start",
  alignOffset = 0,
  anchor,
  container,
  ref,
  ...props
}: WithStringClassName<AutocompletePrimitive.Popup.Props> &
  Pick<AutocompletePrimitive.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset" | "anchor"> &
  Pick<AutocompletePrimitive.Portal.Props, "container">) {
  const popup = React.useRef<HTMLDivElement | null>(null)
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
    <AutocompletePrimitive.Portal container={container}>
      <AutocompletePrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        anchor={anchor}
        // With no suggestions the list hides, unless its empty message or its status has something to say.
        className="isolate z-50 data-empty:[&:not(:has([data-slot=autocomplete-empty]:not(:empty),[data-slot=autocomplete-status]:not(:empty)))]:hidden"
        // Works inside a modal Radix dialog or sheet: takes back the pointer events the dialog turns off on the page, and
        // keeps wheel and touch scrolling from the dialog's scroll lock, which listens on the document. Radix counts
        // presses in this portal as inside, since it renders within the dialog's React tree.
        style={{ pointerEvents: "auto" }}
        onWheel={stopPropagation}
        onTouchMove={stopPropagation}
      >
        <AutocompletePrimitive.Popup
          ref={setPopup}
          data-slot="autocomplete-content"
          data-bui-motion="overlay"
          data-bui-portal=""
          // Select's list: the field's width, a 6px radius, a 1px edge, the overlay shadow, 14px text on a 20px line,
          // limited by the available height; a 150ms opacity/scale transition follows the primitive lifecycle.
          className={cn(
            "group/autocomplete-content relative flex max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-(--anchor-width) origin-(--transform-origin) flex-col overflow-visible rounded-md border border-border bg-popover text-sm text-popover-foreground shadow-md outline-none transition-[opacity,scale] duration-(--bui-duration-base) ease-(--bui-ease-popup) will-change-transform data-starting-style:opacity-0 data-starting-style:scale-[0.93] data-ending-style:opacity-0 data-ending-style:scale-[0.93]",
            className
          )}
          {...props}
        />
      </AutocompletePrimitive.Positioner>
    </AutocompletePrimitive.Portal>
  )
}

/** @since 0.1.1 */
function AutocompleteList({ className, ...props }: WithStringClassName<AutocompletePrimitive.List.Props>) {
  return (
    <AutocompletePrimitive.List
      data-slot="autocomplete-list"
      // 4px padding and 2px between suggestions; it takes the popup's remaining height and scrolls.
      className={cn(
        "flex min-h-0 flex-col gap-0.5 overflow-y-auto overscroll-contain p-1 scroll-py-12 outline-none data-empty:p-0",
        className
      )}
      {...props}
    />
  )
}

/** A positioned popup pointer. Place before the list inside AutocompleteContent. */
function AutocompleteArrow({ className, ...props }: WithStringClassName<AutocompletePrimitive.Arrow.Props>) {
  // boolean-ui patch: Base UI positions the pointer; the list retains its own scrolling container.
  return (
    <AutocompletePrimitive.Arrow
      data-slot="autocomplete-arrow"
      className={cn("absolute size-3 rounded-bl-[3px] border border-border bg-popover [clip-path:polygon(0_100%,0_0,100%_100%)] data-[side=bottom]:-top-1.5 data-[side=bottom]:rotate-135 data-[side=top]:-bottom-1.5 data-[side=top]:-rotate-45 data-[side=left]:-right-1.5 data-[side=left]:-rotate-135 data-[side=right]:-left-1.5 data-[side=right]:rotate-45", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AutocompleteItem({
  className,
  children,
  icon,
  description,
  ...props
}: WithStringClassName<AutocompletePrimitive.Item.Props> & {
  /** Leading media beside both lines, such as an icon or an avatar. */
  icon?: React.ReactNode
  /** A second, muted line under the label. */
  description?: React.ReactNode
}) {
  const rich = icon != null || description != null

  return (
    <AutocompletePrimitive.Item
      data-slot="autocomplete-item"
      // Select's option: 29px from 4px × 10px padding and a 20px line, a 4px radius, `--accent` while highlighted; a
      // suggestion with media or a description has 8px above and below.
      className={cn(
        "relative flex w-full shrink-0 cursor-default items-center gap-2 rounded-sm px-2.5 py-1 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-field-icon",
        rich && "gap-3 py-2",
        className
      )}
      {...props}
    >
      {rich ? (
        <>
          {icon != null ? (
            <span data-slot="autocomplete-item-icon" className="flex shrink-0 items-center">
              {icon}
            </span>
          ) : null}
          <div data-slot="autocomplete-item-body" className="flex min-w-0 flex-col">
            <div className="flex items-center gap-2">{children}</div>
            {description != null ? (
              <div data-slot="autocomplete-item-description" className="text-xs text-muted-foreground">
                {description}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        children
      )}
    </AutocompletePrimitive.Item>
  )
}

/** @since 0.1.1 */
function AutocompleteGroup({ className, ...props }: WithStringClassName<AutocompletePrimitive.Group.Props>) {
  return (
    <AutocompletePrimitive.Group
      data-slot="autocomplete-group"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AutocompleteLabel({ className, ...props }: WithStringClassName<AutocompletePrimitive.GroupLabel.Props>) {
  return (
    <AutocompletePrimitive.GroupLabel
      data-slot="autocomplete-label"
      // A 14px semibold group name with the suggestions' 4px × 10px padding.
      className={cn("px-2.5 py-1 text-sm font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AutocompleteCollection({ ...props }: AutocompletePrimitive.Collection.Props) {
  return <AutocompletePrimitive.Collection data-slot="autocomplete-collection" {...props} />
}

/** @since 0.1.1 */
function AutocompleteEmpty({ className, children, ...props }: WithStringClassName<AutocompletePrimitive.Empty.Props>) {
  const strings = useUiStrings()

  return (
    <AutocompletePrimitive.Empty
      data-slot="autocomplete-empty"
      // A live region that stays in the page and takes room only while the list is empty.
      className={cn("m-1 shrink-0 px-2.5 py-1 text-sm text-muted-foreground empty:m-0 empty:p-0", className)}
      {...props}
    >
      {children ?? strings.noResults}
    </AutocompletePrimitive.Empty>
  )
}

/**
 * A polite live region for asynchronous suggestions. With `loading` it shows a spinner and the provider's "Loading
 * results…"; otherwise it shows its children, such as an error, or nothing.
 *
 * @since 0.1.1
 */
function AutocompleteStatus({
  className,
  loading = false,
  children,
  ...props
}: WithStringClassName<AutocompletePrimitive.Status.Props> & {
  /** Shows a spinner and the provider's `loadingResults` string in place of the children. */
  loading?: boolean
}) {
  const strings = useUiStrings()

  return (
    <AutocompletePrimitive.Status
      data-slot="autocomplete-status"
      className={cn(
        "m-1 flex shrink-0 items-center gap-2 px-2.5 py-1 text-sm text-muted-foreground empty:m-0 empty:p-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          {SPINNER}
          {strings.loadingResults}
        </>
      ) : (
        children
      )}
    </AutocompletePrimitive.Status>
  )
}

/** @since 0.1.1 */
function AutocompleteSeparator({ className, ...props }: WithStringClassName<AutocompletePrimitive.Separator.Props>) {
  return (
    <AutocompletePrimitive.Separator
      data-slot="autocomplete-separator"
      className={cn("-mx-1 my-0.5 h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

/**
 * Base UI's locale-aware matchers (`contains`, `startsWith`, `endsWith`), for filtering outside the list.
 *
 * @since 0.1.1
 */
const useAutocompleteFilter = AutocompletePrimitive.useFilter

export {
  Autocomplete,
  AutocompleteArrow,
  AutocompleteClear,
  AutocompleteCollection,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  useAutocompleteFilter,
}
