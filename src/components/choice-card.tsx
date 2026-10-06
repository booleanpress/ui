"use client"

// Card-shaped options built on the library's RadioGroup (one choice) and CheckboxGroup (several choices).

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckboxGroup, CheckboxGroupItem } from "@/components/checkbox-group"
import { RadioGroup, RadioGroupItem } from "@/components/radio-group"
import { useControlSize, type ControlSize, type FieldVariant } from "@booleanpress/ui/provider"

interface ChoiceCardContextValue {
  type: "single" | "multiple"
  size: ControlSize
  invalid: boolean
  disabled: boolean
}

const ChoiceCardContext = React.createContext<ChoiceCardContextValue | null>(null)

interface GroupBase extends Omit<React.ComponentProps<"div">, "defaultValue" | "onChange" | "dir"> {
  /** Disables every card. */
  disabled?: boolean
  /** The size of the radios or checkboxes. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** The look of the radios or checkboxes. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** The form field name; the chosen card's value (each chosen card's, with `multiple`) is submitted under it. */
  name?: string
  /** The id of the form the value belongs to, for a group placed outside it. */
  form?: string
  /** Makes a choice required before the form can be submitted (`single` only). */
  required?: boolean
}

interface SingleProps extends GroupBase {
  /** `single`: one card is chosen, as radios. */
  type: "single"
  /** The chosen card's value, when you control it. */
  value?: string
  /** The chosen card's value at the start, when it controls itself. */
  defaultValue?: string
  /** Called with the chosen card's value. */
  onValueChange?: (value: string) => void
}

interface MultipleProps extends GroupBase {
  /** `multiple`: any number of cards are chosen, as checkboxes. */
  type: "multiple"
  /** The chosen cards' values, when you control them. */
  value?: string[]
  /** The chosen cards' values at the start, when it controls itself. */
  defaultValue?: string[]
  /** Called with the chosen cards' values. */
  onValueChange?: (value: string[]) => void
}

/**
 * A set of cards people choose from: one (`type="single"`, radios) or several (`type="multiple"`, checkboxes). Name it
 * with `aria-label` or `aria-labelledby`.
 *
 * @since 0.1.0
 */
function ChoiceCardGroup(props: SingleProps | MultipleProps) {
  const { type, className, size, variant, disabled = false, required, "aria-invalid": ariaInvalid, ...rest } = props
  const resolvedSize = useControlSize(size)
  const invalid = ariaInvalid === true || ariaInvalid === "true"
  const context = React.useMemo(() => ({ type, size: resolvedSize, invalid, disabled }), [type, resolvedSize, invalid, disabled])
  const layout = cn("grid gap-3", className)

  return (
    <ChoiceCardContext.Provider value={context}>
      {type === "single" ? (
        <RadioGroup
          data-slot="choice-card-group"
          data-type="single"
          size={resolvedSize}
          variant={variant}
          disabled={disabled}
          required={required}
          aria-invalid={invalid || undefined}
          className={layout}
          {...(rest as Omit<SingleProps, "type" | "required">)}
        />
      ) : (
        <CheckboxGroup
          data-slot="choice-card-group"
          data-type="multiple"
          size={resolvedSize}
          variant={variant}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={layout}
          {...(rest as Omit<MultipleProps, "type" | "required">)}
        />
      )}
    </ChoiceCardContext.Provider>
  )
}

/**
 * One card of a `ChoiceCardGroup`: a title, an optional description and icon, and the radio or checkbox that chooses it.
 * The whole card is its label.
 *
 * @since 0.1.0
 */
function ChoiceCard({
  value,
  title,
  description,
  icon,
  aside,
  disabled = false,
  indicator,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"label">, "title"> & {
  /** The value the group holds while this card is chosen. */
  value: string
  /** The card's name: it names the radio or checkbox. */
  title: React.ReactNode
  /** A line or two under the title, read as the control's description. */
  description?: React.ReactNode
  /** An icon before the title. Decorative. */
  icon?: React.ReactNode
  /** Short text at the end of the title row, such as a price. Read with the description. */
  aside?: React.ReactNode
  /** Disables this card only. */
  disabled?: boolean
  /** Where the radio or checkbox sits: `end` for radios and `start` for checkboxes by default. */
  indicator?: "start" | "end"
}) {
  const group = React.useContext(ChoiceCardContext)
  if (!group) throw new Error("ChoiceCard must be inside a ChoiceCardGroup.")
  const id = React.useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`
  const asideId = `${id}-aside`
  const isDisabled = group.disabled || disabled
  const place = indicator ?? (group.type === "single" ? "end" : "start")
  const describedBy = [aside != null ? asideId : undefined, description != null ? descriptionId : undefined].filter(Boolean).join(" ") || undefined

  // The card draws the focus outline, so the control's own is hidden.
  const controlProps = {
    id: `${id}-control`,
    value,
    disabled: isDisabled,
    "aria-labelledby": titleId,
    "aria-describedby": describedBy,
    "aria-invalid": group.invalid || undefined,
    // Centred on the title's line: the header row is the aside's 21px when there is one, else the title's 16px.
    className: cn(aside != null ? "mt-0.5" : "-mt-px", "focus-visible:outline-none"),
  }
  const control =
    group.type === "single" ? <RadioGroupItem {...controlProps} /> : <CheckboxGroupItem {...controlProps} />

  return (
    <label
      htmlFor={controlProps.id}
      data-slot="choice-card"
      data-disabled={isDisabled ? "" : undefined}
      className={cn(
        // The BooleanPress look of the visual target: a 16px-padded card on the page with a 1px `--border` edge and an
        // 8px radius, `--accent` under the pointer, a `--primary` edge when chosen, an `--invalid` edge when the group is
        // invalid; keyboard focus on its control is the 1px `--ring` outline 2px round the card.
        "flex cursor-pointer items-start gap-2 rounded-lg border p-4 text-start transition-[color,background-color,border-color,outline-color] duration-(--bui-duration-control) select-none hover:bg-accent",
        // Checkbox cards are drawn as the visual target draws them: a 6px radius and 12px between the box and the text.
        group.type === "multiple" && "gap-3 rounded-md",
        "has-[[data-state=checked]]:border-primary",
        "has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring has-[:focus-visible]:outline-solid",
        group.invalid && "border-invalid has-[[data-state=checked]]:border-invalid",
        isDisabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
        className
      )}
      {...props}
    >
      {place === "start" ? control : null}
      <span data-slot="choice-card-content" className="flex min-w-0 flex-1 flex-col gap-2">
        <span data-slot="choice-card-header" className="flex items-center justify-between gap-2">
          <span
            id={titleId}
            data-slot="choice-card-title"
            className="flex min-w-0 items-center gap-2 text-base/none font-medium text-foreground [&_svg]:size-4 [&_svg]:shrink-0"
          >
            {icon != null ? (
              <span data-slot="choice-card-icon" aria-hidden="true" className="flex text-muted-foreground">
                {icon}
              </span>
            ) : null}
            {title}
          </span>
          {aside != null ? (
            <span id={asideId} data-slot="choice-card-aside" className="shrink-0 text-sm/normal text-foreground">
              {aside}
            </span>
          ) : null}
        </span>
        {description != null ? (
          <span id={descriptionId} data-slot="choice-card-description" className="text-sm/normal text-muted-foreground">
            {description}
          </span>
        ) : null}
        {children}
      </span>
      {place === "end" ? control : null}
    </label>
  )
}

export { ChoiceCardGroup, ChoiceCard }
