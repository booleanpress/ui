"use client"

// A group of the library's Checkbox (Radix) sharing one array value, with a parent checkbox that turns mixed.

import * as React from "react"
import { useFormReset } from "@/lib/form-reset"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/checkbox"
import { Label } from "@/components/label"
import { useControlSize, useUiStrings, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

interface Registered {
  id: string
  disabled: boolean
}

interface CheckboxGroupContextValue {
  value: string[]
  setValue: (next: string[]) => void
  allValues?: string[]
  registry: Map<string, Registered>
  register: (value: string, entry: Registered) => () => void
  disabled: boolean
  invalid: boolean
  size: ControlSize
  variant?: FieldVariant
  name?: string
  form?: string
}

const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | null>(null)

function useGroup(part: string) {
  const context = React.useContext(CheckboxGroupContext)
  if (!context) throw new Error(`${part} must be inside a CheckboxGroup.`)
  return context
}

// The start padding that lines a description up with its label, past the 14, 18 or 20 px box and the 8 px gap.
const DESCRIPTION_INDENT: Record<ControlSize, string> = {
  sm: "ps-5.5",
  default: "ps-6.5",
  lg: "ps-7",
}

/**
 * Checkboxes that share one value, an array of the checked items' `value`s. Name it with `aria-label` or
 * `aria-labelledby`, or put it in a `FieldSet` with a `FieldLegend`.
 *
 * @since 0.1.0
 */
function CheckboxGroup({
  value,
  defaultValue = [],
  onValueChange,
  allValues,
  disabled = false,
  orientation = "horizontal",
  size,
  variant,
  name,
  form,
  className,
  "aria-invalid": ariaInvalid,
  ref,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue" | "onChange"> & {
  /** The checked items' values, when you control them. */
  value?: string[]
  /** The checked items' values at the start, when it controls itself. */
  defaultValue?: string[]
  /** Called with the new array when an item or a parent checkbox is toggled. */
  onValueChange?: (value: string[]) => void
  /** Every item's value, for a parent checkbox drawn on the server before the items are known. */
  allValues?: string[]
  /** Disables every checkbox in the group. */
  disabled?: boolean
  /** `vertical` stacks the items; `horizontal` (default) puts them in a wrapping row. */
  orientation?: "horizontal" | "vertical"
  /** The size of every checkbox in the group. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** The look of every checkbox in the group. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** The form field name of every checkbox; each checked item submits its value under it. */
  name?: string
  /** The id of the form the value belongs to, for a control placed outside it. */
  form?: string
}) {
  const resolvedSize = useControlSize(size)
  const [inner, setInner] = React.useState(defaultValue)
  const current = value ?? inner
  const [registry, setRegistry] = React.useState(() => new Map<string, Registered>())

  const setValue = React.useCallback(
    (next: string[]) => {
      if (value === undefined) setInner(next)
      onValueChange?.(next)
    },
    [value, onValueChange]
  )

  // A form reset brings back the first value, as it does for a native checkbox. The group does it in one step; the boxes
  // ignore the reset Radix reports to each of them, which would otherwise apply one stale array per box.
  const groupRef = React.useRef<HTMLDivElement | null>(null)
  const setGroupRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      groupRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  const initialValue = React.useRef(current)
  useFormReset(groupRef, () => setValue(initialValue.current), { enabled: value === undefined, form })

  const register = React.useCallback((itemValue: string, entry: Registered) => {
    setRegistry((previous) => {
      const known = previous.get(itemValue)
      if (known && known.id === entry.id && known.disabled === entry.disabled) return previous
      return new Map(previous).set(itemValue, entry)
    })
    return () =>
      setRegistry((previous) => {
        if (previous.get(itemValue)?.id !== entry.id) return previous
        const next = new Map(previous)
        next.delete(itemValue)
        return next
      })
  }, [])

  const invalid = ariaInvalid === true || ariaInvalid === "true"
  const context = React.useMemo<CheckboxGroupContextValue>(
    () => ({ value: current, setValue, allValues, registry, register, disabled, invalid, size: resolvedSize, variant, name, form }),
    [current, setValue, allValues, registry, register, disabled, invalid, resolvedSize, variant, name, form]
  )

  return (
    <CheckboxGroupContext.Provider value={context}>
      <div
        ref={setGroupRef}
        role="group"
        data-slot="checkbox-group"
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        data-invalid={invalid ? "" : undefined}
        className={cn(
          "flex",
          orientation === "horizontal" ? "flex-row flex-wrap gap-4" : "flex-col gap-2",
          className
        )}
        {...props}
      />
    </CheckboxGroupContext.Provider>
  )
}

type ItemProps = Omit<React.ComponentProps<typeof Checkbox>, "checked" | "defaultChecked" | "onCheckedChange" | "value"> & {
  /** The visible name, drawn as a label beside the box. Leave it out to label the box yourself. */
  label?: React.ReactNode
  /** A line of help under the label, read as the box's description. */
  description?: React.ReactNode
}

/** The box and, with a label, the row round it. */
function Row({
  checkbox,
  id,
  label,
  description,
  descriptionId,
  size,
  disabled,
  slot,
}: {
  checkbox: React.ReactNode
  id: string
  label?: React.ReactNode
  description?: React.ReactNode
  descriptionId: string
  size: ControlSize
  disabled: boolean
  slot: string
}) {
  if (label == null) return <>{checkbox}</>
  return (
    <div data-slot={slot} data-disabled={disabled ? "" : undefined} className="flex flex-col gap-0.5">
      <div data-slot={`${slot}-control`} className="flex items-center gap-2">
        {checkbox}
        <Label htmlFor={id}>{label}</Label>
      </div>
      {description != null ? (
        <p
          id={descriptionId}
          data-slot="checkbox-group-description"
          className={cn("text-sm/normal text-muted-foreground", disabled && "opacity-60", DESCRIPTION_INDENT[size])}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

/**
 * One checkbox of a `CheckboxGroup`: checked while the group's value holds its `value`.
 *
 * @since 0.1.0
 */
function CheckboxGroupItem({
  value,
  label,
  description,
  disabled,
  id,
  size,
  variant,
  "aria-describedby": ariaDescribedby,
  onClick,
  ...props
}: ItemProps & {
  /** The value the group's array holds while this box is checked. */
  value: string
}) {
  const group = useGroup("CheckboxGroupItem")
  const autoId = React.useId()
  const boxId = id ?? autoId
  const descriptionId = `${boxId}-description`
  const isDisabled = group.disabled || Boolean(disabled)
  const resolvedSize = size ?? group.size
  const { register, value: chosen, setValue } = group

  React.useEffect(() => register(value, { id: boxId, disabled: isDisabled }), [register, value, boxId, isDisabled])

  const checkbox = (
    <Checkbox
      id={boxId}
      value={value}
      name={group.name}
      form={group.form}
      checked={chosen.includes(value)}
      // A click (Space and a label click are clicks too) toggles the box; `onCheckedChange` is left out, as Radix also
      // calls it on a form reset, which the group handles as a whole.
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setValue(chosen.includes(value) ? chosen.filter((v) => v !== value) : [...chosen, value])
      }}
      disabled={isDisabled}
      size={resolvedSize}
      variant={variant ?? group.variant}
      aria-invalid={group.invalid || undefined}
      aria-describedby={[ariaDescribedby, label != null && description != null ? descriptionId : undefined].filter(Boolean).join(" ") || undefined}
      {...props}
    />
  )

  return (
    <Row
      checkbox={checkbox}
      id={boxId}
      label={label}
      description={description}
      descriptionId={descriptionId}
      size={resolvedSize}
      disabled={isDisabled}
      slot="checkbox-group-item"
    />
  )
}

/**
 * A checkbox that checks or clears the whole group (or the `values` you give it): checked when all are, mixed when some
 * are. From mixed, Space checks all. Each subsequent activation clears or checks every enabled item.
 *
 * @since 0.1.0
 */
function CheckboxGroupParent({
  values,
  label,
  description,
  disabled,
  id,
  size,
  variant,
  "aria-describedby": ariaDescribedby,
  onClick,
  ...props
}: ItemProps & {
  /** The values it controls: a nested group's items. Every item of the group by default. */
  values?: string[]
}) {
  const group = useGroup("CheckboxGroupParent")
  const strings = useUiStrings()
  const autoId = React.useId()
  const boxId = id ?? autoId
  const descriptionId = `${boxId}-description`
  const resolvedSize = size ?? group.size

  const subset = values ?? group.allValues ?? [...group.registry.keys()]
  const enabled = subset.filter((v) => !group.registry.get(v)?.disabled)
  const chosen = enabled.filter((v) => group.value.includes(v))
  const state: boolean | "indeterminate" =
    enabled.length > 0 && chosen.length === enabled.length ? true : chosen.length > 0 ? "indeterminate" : false
  // A parent whose items are all disabled has nothing to check or clear.
  const isDisabled = group.disabled || Boolean(disabled) || (subset.length > 0 && enabled.length === 0)

  // boolean-ui patch: a parent alternates all and none; disabled choices are preserved.
  const toggle = () => {
    const others = group.value.filter((v) => !enabled.includes(v))
    group.setValue(state === true ? others : [...others, ...enabled])
  }

  const controls = subset
    .map((v) => group.registry.get(v)?.id)
    .filter(Boolean)
    .join(" ")

  const checkbox = (
    <Checkbox
      id={boxId}
      checked={state}
      // A click toggles the group, as on an item: Radix's reset call to `onCheckedChange` must not.
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) toggle()
      }}
      disabled={isDisabled}
      size={resolvedSize}
      variant={variant ?? group.variant}
      aria-controls={controls || undefined}
      aria-invalid={group.invalid || undefined}
      aria-describedby={[ariaDescribedby, description != null ? descriptionId : undefined].filter(Boolean).join(" ") || undefined}
      data-slot="checkbox-group-parent"
      {...props}
    />
  )

  return (
    <Row
      checkbox={checkbox}
      id={boxId}
      label={label ?? strings.selectAll}
      description={description}
      descriptionId={descriptionId}
      size={resolvedSize}
      disabled={isDisabled}
      slot="checkbox-group-parent-item"
    />
  )
}

export { CheckboxGroup, CheckboxGroupItem, CheckboxGroupParent }
