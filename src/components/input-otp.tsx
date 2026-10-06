// Built on Base UI's OTP Field (`@base-ui/react/otp-field`), with shadcn's input-otp API and look.
"use client"

import * as React from "react"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { OTPField as OTPFieldPrimitive } from "@base-ui/react/otp-field"
import { MinusIcon } from "lucide-react"
import { useFormReset } from "@/lib/form-reset"
import { cn, fillString } from "@/lib/utils"

import {
  useControlSize,
  useFieldVariant,
  useUiConfig,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

type WithStringClassName<T> = Omit<T, "className"> & { className?: string }

type InputOTPContextValue = {
  length: number
  size: ControlSize
  variant: FieldVariant
  invalid: boolean
  label?: string
  labelledBy?: string
}

const InputOTPContext = React.createContext<InputOTPContextValue>({
  length: 0,
  size: "default",
  variant: "default",
  invalid: false,
})

/**
 * A one-time code, one box per character. Typing moves to the next box, Backspace to the previous one, and a pasted
 * code fills every box. Accepts characters by default, with the browser's one-time-code autofill;
 * `validationType="numeric"` restricts entry to digits and opens the phone's number pad.
 *
 * @since 0.1.1
 */
function InputOTP({
  maxLength,
  size,
  variant,
  validationType = "none",
  inputMode,
  autoComplete = "one-time-code",
  className,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ref,
  ...props
}: Omit<WithStringClassName<React.ComponentProps<typeof OTPFieldPrimitive.Root>>, "length"> & {
  /** The number of characters, one box each. */
  maxLength: number
  /** The boxes' size: 26, 34 or 42 px tall. */
  size?: ControlSize
  /** `filled` gives the boxes the grey field fill. */
  variant?: FieldVariant
}) {
  const { dir } = useUiConfig()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const invalid = ariaInvalid === true || ariaInvalid === "true"
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )
  // Base UI keeps the code in state, which a form reset cannot reach: an uncontrolled field starts again from its
  // `defaultValue` instead.
  const [resetCount, setResetCount] = React.useState(0)
  useFormReset(rootRef, () => setResetCount((count) => count + 1), {
    enabled: props.value === undefined,
    form: props.form,
  })
  const context = React.useMemo(
    () => ({
      length: maxLength,
      size: resolvedSize,
      variant: resolvedVariant,
      invalid,
      label: ariaLabel,
      labelledBy: ariaLabelledBy,
    }),
    [maxLength, resolvedSize, resolvedVariant, invalid, ariaLabel, ariaLabelledBy]
  )

  return (
    <DirectionProvider direction={dir}>
      <InputOTPContext.Provider value={context}>
        <OTPFieldPrimitive.Root
          key={resetCount}
          ref={setRefs}
          data-slot="input-otp"
          data-size={resolvedSize}
          data-variant={resolvedVariant}
          length={maxLength}
          validationType={validationType}
          // Digits open the number pad; letters the full keyboard. Base UI applies both to the boxes and the hidden
          // input, and the autofill hint to the first box.
          inputMode={inputMode ?? (validationType === "numeric" ? "numeric" : undefined)}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn("flex items-center gap-2", className)}
          {...props}
        />
      </InputOTPContext.Provider>
    </DirectionProvider>
  )
}

/** @since 0.1.1 */
function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-otp-group"
      // One box per character, 8 px apart.
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  )
}

/**
 * One character's box. The first box takes the field's label; the others are named "Character 2 of 6".
 *
 * @since 0.1.1
 */
function InputOTPSlot({
  index,
  className,
  "aria-label": ariaLabel,
  ...props
}: WithStringClassName<React.ComponentProps<typeof OTPFieldPrimitive.Input>> & {
  /** The box's position, from 0. */
  index: number
}) {
  const { length, size, variant, invalid, label, labelledBy } = React.useContext(InputOTPContext)
  const strings = useUiStrings()
  const name = ariaLabel ?? fillString(strings.otpCharacter, { index: index + 1, count: length })

  return (
    <OTPFieldPrimitive.Input
      data-slot="input-otp-slot"
      data-size={size}
      data-variant={variant}
      aria-invalid={invalid || undefined}
      aria-label={index === 0 ? undefined : name}
      aria-labelledby={index === 0 ? labelledBy : undefined}
      // Base UI names the first box by the field's `<label>`. Without one, it takes the field's `aria-label`, or its
      // position.
      render={
        index === 0
          ? (renderProps) => (
              <input {...renderProps} aria-label={renderProps["aria-labelledby"] ? undefined : (label ?? name)} />
            )
          : undefined
      }
      // The field look: 34 px tall and 36 px wide (28 × 26 and 42 × 42 for the small and large sizes), the `--control`
      // edge darkening on hover and turning `--ring` on focus, the `--invalid` edge, the disabled and filled fills.
      className={cn(
        "w-9 min-w-0 rounded-md border border-control bg-field px-2.5 py-1.5 text-center text-sm text-foreground placeholder:text-field-placeholder shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none selection:bg-primary selection:text-primary-foreground hover:border-control-hover focus-visible:border-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-field-disabled disabled:text-field-disabled-foreground aria-invalid:border-invalid aria-invalid:placeholder:text-field-invalid-foreground aria-invalid:focus-visible:border-ring data-[variant=filled]:enabled:bg-field-filled",
        "data-[size=sm]:w-7 data-[size=sm]:px-2 data-[size=sm]:py-1 data-[size=sm]:text-xs data-[size=lg]:w-[2.625rem] data-[size=lg]:px-3 data-[size=lg]:py-2 data-[size=lg]:text-base",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function InputOTPSeparator({
  className,
  ...props
}: WithStringClassName<React.ComponentProps<typeof OTPFieldPrimitive.Separator>>) {
  return (
    <OTPFieldPrimitive.Separator
      data-slot="input-otp-separator"
      className={cn("flex items-center text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5", className)}
      {...props}
    >
      <MinusIcon />
    </OTPFieldPrimitive.Separator>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot }
