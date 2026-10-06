"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import {
  useControlSize,
  useFieldVariant,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

// boolean-ui patch: the chosen value, shared with the trigger so a clearable trigger can show its × and reset the
// value (stock: the value lives only in Radix's private context).
const SelectSelectionContext = React.createContext<{
  value: string
  disabled: boolean
  clear: () => void
} | null>(null)

/** @since 0.1.1 */
function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  // boolean-ui patch: the value is kept here and handed to Radix controlled, controlled or not by the app, so the
  // trigger's clear button can reset it to `""`, the placeholder (stock: Radix keeps an uncontrolled value itself).
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "")
  const value = valueProp ?? uncontrolledValue
  const setValue = React.useCallback(
    (next: string) => {
      if (valueProp === undefined) setUncontrolledValue(next)
      if (next !== value) onValueChange?.(next)
    },
    [valueProp, value, onValueChange]
  )
  const selection = React.useMemo(
    () => ({ value, disabled: props.disabled ?? false, clear: () => setValue("") }),
    [value, props.disabled, setValue]
  )

  return (
    <SelectSelectionContext.Provider value={selection}>
      <SelectPrimitive.Root data-slot="select" value={value} onValueChange={setValue} {...props} />
    </SelectSelectionContext.Provider>
  )
}

/** @since 0.1.1 */
function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      // boolean-ui patch: 2px between the options of a group, as in the list (stock: none).
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/** @since 0.1.1 */
function SelectTrigger({
  className,
  size,
  variant,
  fluid = false,
  clearable = false,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  /** 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. @since 0.1.1 */
  variant?: FieldVariant
  /** Fills the width of its container. @since 0.1.1 */
  fluid?: boolean
  /** Shows a clear button inside the field while a value is chosen; it resets the value to the placeholder. @since 0.1.1 */
  clearable?: boolean
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const strings = useUiStrings()
  const selection = React.useContext(SelectSelectionContext)
  const showClear =
    clearable && selection !== null && selection.value !== "" && !selection.disabled && !props.disabled

  const trigger = (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      className={cn(
        // boolean-ui patch: the BooleanPress field look, as Input — 34px tall from 6px × 10px padding and a 20px line (sm 26px:
        // 4px × 8px, 12px text), a solid `--field` fill, the `--control` edge darkening on hover and turning `--ring` on
        // focus and while open, with no ring; the chevron is 14px in the field-icon colour, centred in a 40px end column;
        // disabled fills `--field-disabled` at full opacity (stock: 36px and 32px fixed heights, transparent fill, a 3px
        // ring, 16px chevron at 50%, 50% opacity).
        "group/select-trigger flex w-fit items-center justify-between gap-5.75 rounded-md border border-control bg-field py-1.5 ps-2.5 pe-3.25 text-sm whitespace-nowrap text-foreground shadow-(--bui-shadow-field) transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none hover:border-control-hover focus-visible:border-ring data-[state=open]:border-ring disabled:cursor-not-allowed disabled:border-control disabled:bg-field-disabled disabled:text-field-disabled-foreground data-[placeholder]:text-field-placeholder data-[size=sm]:gap-5.25 data-[size=sm]:py-1 data-[size=sm]:ps-2 data-[size=sm]:pe-3.25 data-[size=sm]:text-xs *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-field-icon",
        // boolean-ui patch: lg is 42px from 8px × 12px padding and a 24px line of 16px text, the chevron 16px in the same
        // 40px column (stock: no lg).
        "data-[size=lg]:gap-6.25 data-[size=lg]:py-2 data-[size=lg]:ps-3 data-[size=lg]:pe-3.25 data-[size=lg]:text-base",
        // boolean-ui patch: filled is the grey `--field-filled` fill, kept on hover and focus (stock: no variant).
        "data-[variant=filled]:enabled:bg-field-filled",
        // boolean-ui patch: the value line keeps one line's height with nothing in it, so a trigger with no value and no
        // placeholder stays 34px (26px, 42px) instead of shrinking to the chevron (stock: no minimum).
        "*:data-[slot=select-value]:min-h-lh",
        // boolean-ui patch: invalid is the `--invalid` edge and a red placeholder, no ring; focus and the open list still
        // show `--ring` (stock: the destructive edge and ring).
        "aria-invalid:border-invalid aria-invalid:text-field-invalid-foreground aria-invalid:data-[placeholder]:text-field-invalid-foreground aria-invalid:focus-visible:border-ring aria-invalid:data-[state=open]:border-ring",
        // boolean-ui patch: fluid fills the container (stock: no prop).
        fluid && "w-full",
        // boolean-ui patch: room for the clear button between the value and the chevron, and the hover edge kept while
        // the pointer is on it (stock: no clear button).
        clearable && "group-hover/select-control:border-control-hover",
        showClear && "gap-8.75 data-[size=sm]:gap-8.5 data-[size=lg]:gap-9",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-3.5 text-field-icon" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )

  if (!clearable) return trigger

  return (
    // boolean-ui patch: a clearable trigger sits in a wrapper with its clear button beside it, not inside it, as a button
    // inside a button is invalid; the wrapper is as wide as the trigger, or full width with `fluid` or `w-full` (stock:
    // no clear button).
    <div
      data-slot="select-control"
      className={cn("group/select-control relative flex w-fit has-[>.w-full]:w-full", fluid && "w-full")}
    >
      {trigger}
      {showClear ? (
        <button
          type="button"
          data-slot="select-clear"
          aria-label={strings.clear}
          onClick={(event) => {
            selection.clear()
            event.currentTarget
              .closest("[data-slot=select-control]")
              ?.querySelector<HTMLElement>("[data-slot=select-trigger]")
              ?.focus()
          }}
          className="absolute end-8 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-field-icon transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-ring"
        >
          <XIcon aria-hidden="true" className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

/** @since 0.1.1 */
function SelectContent({
  className,
  children,
  // boolean-ui patch: below the field, flipping above when there is no room (stock: item-aligned), PATCHES.md §1 row 4.
  position = "popper",
  align = "center",
  arrow = false,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content> & {
  /** Draws a pointer toward the trigger when using popper positioning. */
  arrow?: boolean
}) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          // boolean-ui patch: 14px text on a 20px line, 2px below the field (stock: inherited text size, 4px below).
          "relative z-50 max-h-(--radix-select-content-available-height) min-w-0 origin-(--radix-select-content-transform-origin) overflow-visible rounded-md border border-border bg-popover text-sm text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-93 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-93",
          position === "popper" &&
          "min-w-(--radix-select-trigger-width) data-[side=bottom]:translate-y-0.5 data-[side=left]:-translate-x-0.5 rtl:data-[side=left]:translate-x-0.5 data-[side=right]:translate-x-0.5 rtl:data-[side=right]:-translate-x-0.5 data-[side=top]:-translate-y-0.5",
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            // boolean-ui patch: 2px between options (stock: none).
            "flex flex-col gap-0.5 p-1 scroll-py-12",
            position === "popper" &&
            // boolean-ui patch: the list is as wide as the field, its edge included (stock: 2px wider).
            "h-[var(--radix-select-trigger-height)] w-full min-w-[calc(var(--radix-select-trigger-width)-2px)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
        {arrow && position === "popper" && <SelectArrow />}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/** A popup pointer; use SelectContent's `arrow` prop to keep it outside the scrolling viewport. */
function SelectArrow({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.Arrow>) {
  // boolean-ui patch: use Radix's positioned arrow and the popup's semantic surface.
  return <SelectPrimitive.Arrow data-slot="select-arrow" width={16} height={8} className={cn("fill-popover stroke-border", className)} {...props} />
}

/** @since 0.1.1 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      // boolean-ui patch: a 14px semibold group name with the options' 4px × 10px padding (stock: 12px regular, 6px × 8px).
      className={cn("px-2.5 py-1 text-sm font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function SelectItem({
  className,
  children,
  icon,
  description,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item> & {
  /** Leading media in the list, beside both lines, such as an avatar or a flag. The trigger does not show it. @since 0.1.1 */
  icon?: React.ReactNode
  /** A second, muted line under the label in the list. The trigger does not show it. @since 0.1.1 */
  description?: React.ReactNode
}) {
  const rich = icon != null || description != null

  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        // boolean-ui patch: options are 29px tall from 4px × 10px padding and a 20px line, a 4px radius; the focused option
        // takes `--accent`, the chosen one fills `--highlight` (`--highlight-focus` while focused); disabled at 60% (stock:
        // 6px × 8px padding, no chosen fill, 50%).
        "relative flex w-full cursor-default items-center gap-2 whitespace-nowrap rounded-sm px-2.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=checked]:bg-highlight data-[state=checked]:text-highlight-foreground data-[state=checked]:focus:bg-highlight-focus data-[state=checked]:focus:text-highlight-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        // boolean-ui patch: an option with media or a description has 8px above and below and 12px from the media to the
        // text, as the visual target's custom options (stock: no such option).
        rich && "gap-3 py-2",
        className
      )}
      {...props}
    >
      <span
        data-slot="select-item-indicator"
        // boolean-ui patch: a reserved 14px leading check column, in the option's text colour (stock: trailing).
        className="relative flex size-3.5 shrink-0 items-center justify-center"
      >
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-3.5 text-current" />
        </SelectPrimitive.ItemIndicator>
      </span>
      {rich ? (
        <>
          {icon != null ? (
            <span data-slot="select-item-icon" className="flex shrink-0 items-center">
              {icon}
            </span>
          ) : null}
          <div data-slot="select-item-body" className="flex min-w-0 flex-col">
            <SelectPrimitive.ItemText className="flex items-center gap-2">{children}</SelectPrimitive.ItemText>
            {description != null ? (
              <div
                data-slot="select-item-description"
                className="text-xs text-muted-foreground in-data-[state=checked]:text-highlight-foreground/70"
              >
                {description}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      )}
    </SelectPrimitive.Item>
  )
}

/** @since 0.1.1 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      // boolean-ui patch: 2px margins, which the list's 2px gap brings to 4px each side (stock: 4px margins, no gap).
      className={cn("pointer-events-none -mx-1 my-0.5 h-px bg-border", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      {/* boolean-ui patch: a 14px chevron in the muted colour (stock: 16px in the text colour). */}
      <ChevronUpIcon className="size-3.5 text-muted-foreground" />
    </SelectPrimitive.ScrollUpButton>
  )
}

/** @since 0.1.1 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      {/* boolean-ui patch: a 14px chevron in the muted colour (stock: 16px in the text colour). */}
      <ChevronDownIcon className="size-3.5 text-muted-foreground" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectArrow,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
