"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { Label } from "@/components/label"
import { Separator } from "@/components/separator"

/** @since 0.1.0 */
function FieldSet({
  className,
  ...props
}: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6",
        "has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-medium",
        "data-[variant=legend]:text-base",
        "data-[variant=label]:text-sm",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        // boolean-ui patch: 24px between fields, the BooleanPress form rhythm (stock: 28px).
        "group/field-group @container/field-group flex w-full flex-col gap-6 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  // boolean-ui patch: 8px between a label, its control and its text, the BooleanPress form layout; invalid text the field
  // passes down is `--destructive-strong` (stock: 12px, `--destructive`).
  "group/field flex w-full gap-2 data-[invalid=true]:text-destructive-strong",
  {
    variants: {
      orientation: {
        vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
        horizontal: [
          "flex-row items-center",
          "[&>[data-slot=field-label]]:flex-auto",
          "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
        responsive: [
          "flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto",
          "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
          "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        ],
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
)

/** @since 0.1.0 */
function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FieldContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        // boolean-ui patch: 2px between a title and its description (stock: 6px, a 1.375 line height).
        "group/field-content flex flex-1 flex-col gap-0.5",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        // boolean-ui patch: Label's 21px line and 6px gap, `--destructive-strong` in an invalid field, 60% opacity when
        // disabled; as a card round a field, 12px padding with a `--border` edge that turns `--primary` when its control is
        // chosen, with no tint (stock: a 1.375 line, 8px gap, `--destructive`, 50%, 16px padding, a 5% primary tint).
        "group/field-label peer/field-label flex w-fit gap-1.5 group-data-[invalid=true]/field:text-destructive-strong group-data-[disabled=true]/field:opacity-60",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border has-[>[data-slot=field]]:border-border [&>*]:data-[slot=field]:p-3",
        "has-data-[state=checked]:border-primary",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FieldTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        // boolean-ui patch: as Label — 14px medium text on a 21px line, a 6px gap, 60% opacity when disabled (stock: a 1.375
        // line, 8px gap, 50%).
        "flex w-fit items-center gap-1.5 text-sm/normal font-medium group-data-[disabled=true]/field:opacity-60",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        // boolean-ui patch: 12px muted text on an 18px line, 6px below the control when an error follows (stock: 14px).
        "text-xs/normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance",
        "last:mt-0 nth-last-2:-mt-0.5 [[data-variant=legend]+&]:-mt-1.5",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

/** @since 0.1.0 */
function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length == 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      // boolean-ui patch: 12px text in `--destructive-strong`, the BooleanPress error line (stock: 14px `--destructive`).
      className={cn("text-xs/normal font-normal text-destructive-strong", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
