"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import {
  useControlSize,
  useFieldVariant,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"

// boolean-ui patch: the group hands its size to its control, so the input's padding and text follow it (stock: no size).
const InputGroupContext = React.createContext<{ size: ControlSize; attached: boolean } | null>(null)

/** @since 0.1.0 */
function InputGroup({
  className,
  size,
  variant,
  attached = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** The size of the group and everything in it: 26, 34 or 42 px tall. Defaults to the provider's `controlSize`. @since 0.1.0 */
  size?: ControlSize
  /** `filled` draws the grey `--field-filled` fill round the whole group. Defaults to the provider's `fieldVariant`. @since 0.1.0 */
  variant?: FieldVariant
  /** Separates inline addons into cells and makes addon buttons fill the group's height. */
  attached?: boolean
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const context = React.useMemo(() => ({ size: resolvedSize, attached }), [resolvedSize, attached])

  return (
    <InputGroupContext.Provider value={context}>
      <div
        data-slot="input-group"
        data-size={resolvedSize}
        data-variant={resolvedVariant}
        data-attached={attached || undefined}
        role="group"
        className={cn(
          // boolean-ui patch: the BooleanPress field look round the whole group — a solid `--field` fill, the `--control`
          // edge darkening on hover, 34px tall from the control's padding and line height rather than a fixed height
          // (stock: 36px fixed, transparent fill, no hover).
          "group/input-group relative flex w-full min-w-0 items-center rounded-md border border-control bg-field shadow-(--bui-shadow-field) transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none hover:border-control-hover",

          // Variants based on alignment.
          "has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-2.5",
          "has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-2.5",

          // boolean-ui patch: focus turns the edge `--ring`, with no ring around it (stock: a 3px ring at 50%).
          "has-[[data-slot=input-group-control]:focus-visible]:border-ring",

          // boolean-ui patch: a select addon draws no edge of its own, so the group's edge shows its focus and its open
          // list (stock: no select addon).
          "has-[>[data-slot=input-group-addon]>[role=combobox]:focus-visible]:border-ring has-[>[data-slot=input-group-addon]>[role=combobox][data-state=open]]:border-ring",

          // boolean-ui patch: invalid is the `--invalid` edge with no ring; focus still shows `--ring` (stock: the
          // destructive edge and ring).
          "has-[[data-slot][aria-invalid=true]]:border-invalid has-[[data-slot][aria-invalid=true]]:has-[[data-slot=input-group-control]:focus-visible]:border-ring",

          // boolean-ui patch: a disabled control fills the group `--field-disabled` at full opacity (stock: no group style).
          "has-[[data-slot=input-group-control]:disabled]:border-control has-[[data-slot=input-group-control]:disabled]:bg-field-disabled",

          // boolean-ui patch: `variant="filled"` fills the group `--field-filled`, on hover and focus too; a disabled
          // control keeps the disabled fill (stock: no variant).
          "data-[variant=filled]:bg-field-filled data-[variant=filled]:has-[[data-slot=input-group-control]:disabled]:bg-field-disabled",
          // boolean-ui patch: attached cells share one edge and retain logical start/end corners in RTL.
          attached && "items-stretch [&>[data-slot=input-group-addon]]:m-0! [&>[data-slot=input-group-addon]]:order-none! [&>[data-slot=input-group-addon]]:min-w-9 [&>[data-slot=input-group-addon]]:self-stretch [&>[data-slot=input-group-addon]]:px-2! [&>[data-align=inline-start]]:border-e [&>[data-align=inline-end]]:border-s [&>[data-slot=input-group-addon]]:border-control [&>[data-slot=input-group-addon]:has(button)]:p-0! [&>[data-slot=input-group-addon]>button]:h-full [&>[data-slot=input-group-addon]>button]:min-h-0 [&>[data-slot=input-group-addon]>button]:rounded-none [&>[data-slot=input-group-addon]>button]:border-0 [&>[data-slot=input-group-addon]>button]:px-2.5 [&>[data-slot=input-group-addon]:first-child]:rounded-s-[5px] [&>[data-slot=input-group-addon]:last-child]:rounded-e-[5px] [&>[data-slot=input-group-addon]:first-child>button]:rounded-s-[5px] [&>[data-slot=input-group-addon]:last-child>button]:rounded-e-[5px] [&>[data-slot=input-group-control]+[data-slot=input-group-control]]:border-s [&>[data-slot=input-group-control]+[data-slot=input-group-control]]:border-control",
          className
        )}
        {...props}
      />
    </InputGroupContext.Provider>
  )
}

const inputGroupAddonVariants = cva(
  [
    // boolean-ui patch: an icon sits 10px from the edge in the field-icon colour at 14px, so the text starts 32px in; a
    // text addon (`InputGroupText`) becomes a cell at least 36px wide, divided from the input by a line in the group's
    // edge colour; `data-disabled` on the group dims addons to 60% (stock: 16px icons in the muted colour, medium text,
    // no divider, 50%).
    "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm text-field-icon select-none group-data-[disabled=true]/input-group:opacity-60 [&>kbd]:rounded-sm [&>svg:not([class*='size-'])]:size-3.5",
    // boolean-ui patch: text follows the group size; inset icons stay 14px in every size (stock: one size).
    "group-data-[size=sm]/input-group:text-xs group-data-[size=lg]/input-group:text-base group-data-[attached=true]/input-group:dark:text-field-placeholder",
    // boolean-ui patch: a checkbox, a radio or a select is a cell like a text addon; the select inside draws no edge,
    // fill or shadow of its own, so the group's show (stock: no such addons).
    "[&>[role=combobox]]:self-stretch [&>[role=combobox]]:rounded-none [&>[role=combobox]]:border-0 [&>[role=combobox]]:bg-transparent [&>[role=combobox]]:shadow-none",
  ],
  {
    variants: {
      align: {
        "inline-start": [
          "order-first py-0 ps-2.5 has-[>svg]:ps-2.25 has-[>button:not([role])]:-ms-1.25 has-[>kbd]:ms-[-0.35rem] has-[>span]:min-w-9 has-[>span]:self-stretch has-[>span]:border-e has-[>span]:border-inherit has-[>span]:px-2",
          // boolean-ui patch: an icon or a button sits 8px from the edge in `sm` and 12px in `lg` (stock: one size).
          "group-data-[size=sm]/input-group:has-[>button:not([role])]:ps-2 group-data-[size=sm]/input-group:has-[>button:not([role])]:-ms-1 group-data-[size=lg]/input-group:has-[>button:not([role])]:ps-3 group-data-[size=lg]/input-group:has-[>button:not([role])]:-ms-1.5",
          "has-[>[role=checkbox],>[role=radio],>[role=radiogroup],>[role=combobox]]:self-stretch has-[>[role=checkbox],>[role=radio],>[role=radiogroup],>[role=combobox]]:border-e has-[>[role=checkbox],>[role=radio],>[role=radiogroup],>[role=combobox]]:border-inherit has-[>[role=checkbox],>[role=radio],>[role=radiogroup]]:min-w-9 has-[>[role=checkbox],>[role=radio],>[role=radiogroup]]:px-2 has-[>[role=combobox]]:p-0",
        ],
        "inline-end": [
          "order-last py-0 pe-2.5 has-[>svg]:pe-2.25 has-[>button:not([role])]:-me-1.25 has-[>kbd]:me-[-0.35rem] has-[>span]:min-w-9 has-[>span]:self-stretch has-[>span]:border-s has-[>span]:border-inherit has-[>span]:px-2",
          // boolean-ui patch: as inline-start (stock: one size).
          "group-data-[size=sm]/input-group:has-[>button:not([role])]:pe-2 group-data-[size=sm]/input-group:has-[>button:not([role])]:-me-1 group-data-[size=lg]/input-group:has-[>button:not([role])]:pe-3 group-data-[size=lg]/input-group:has-[>button:not([role])]:-me-1.5",
          "has-[>[role=checkbox],>[role=radio],>[role=radiogroup],>[role=combobox]]:self-stretch has-[>[role=checkbox],>[role=radio],>[role=radiogroup],>[role=combobox]]:border-s has-[>[role=checkbox],>[role=radio],>[role=radiogroup],>[role=combobox]]:border-inherit has-[>[role=checkbox],>[role=radio],>[role=radiogroup]]:min-w-9 has-[>[role=checkbox],>[role=radio],>[role=radiogroup]]:px-2 has-[>[role=combobox]]:p-0",
        ],
        "block-start":
          "order-first w-full justify-start px-2.5 pt-2.5 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2.5",
        "block-end":
          "order-last w-full justify-start px-2.5 pb-2.5 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2.5",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

/** @since 0.1.0 */
function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return
        }
        // boolean-ui patch: a click on the addon focuses the group's control, a textarea too, and never the hidden input a
        // Checkbox or a RadioGroupItem in an addon keeps for its form (stock focuses the first input).
        const group = e.currentTarget.parentElement
        const control =
          group?.querySelector<HTMLElement>("[data-slot=input-group-control]") ??
          group?.querySelector<HTMLElement>("input:not([aria-hidden=true]), textarea")
        control?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      // boolean-ui patch: fixed heights with no vertical padding, so the button sits inside the 34px field; 4px radius on
      // the 24px sizes, `sm` is the 26px small button (stock: `sm` 32px, a 3px radius). In an `sm` group each is 4px
      // smaller with 12px text and icons, in an `lg` group 4px larger with 16px text and icons.
      size: {
        xs: "h-6 gap-1 rounded-sm px-2 py-0 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5 group-data-[size=sm]/input-group:h-5 group-data-[size=sm]/input-group:text-xs group-data-[size=sm]/input-group:[&>svg:not([class*='size-'])]:size-3 group-data-[size=lg]/input-group:h-7 group-data-[size=lg]/input-group:text-base group-data-[size=lg]/input-group:[&>svg:not([class*='size-'])]:size-4",
        sm: "h-7 gap-1.5 rounded-md px-2.5 py-0 has-[>svg]:px-2.5 group-data-[size=sm]/input-group:h-6 group-data-[size=sm]/input-group:text-xs group-data-[size=lg]/input-group:h-8 group-data-[size=lg]/input-group:text-base",
        "icon-xs":
          "size-6 rounded-sm p-0 has-[>svg]:p-0 [&>svg:not([class*='size-'])]:size-3.5 group-data-[size=sm]/input-group:size-5 group-data-[size=sm]/input-group:[&>svg:not([class*='size-'])]:size-3 group-data-[size=lg]/input-group:size-7 group-data-[size=lg]/input-group:[&>svg:not([class*='size-'])]:size-4",
        "icon-sm":
          "size-7 p-0 has-[>svg]:p-0 group-data-[size=sm]/input-group:size-6 group-data-[size=lg]/input-group:size-8",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  }
)

/** @since 0.1.0 */
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      // boolean-ui patch: a `data-slot`, as every part has (stock: none).
      data-slot="input-group-text"
      className={cn(
        // boolean-ui patch: 14px text on a 20px line, 14px icons (stock: 16px icons).
        "flex items-center gap-2 text-sm text-muted-foreground group-data-[attached=true]/input-group:text-field-icon group-data-[attached=true]/input-group:dark:text-field-placeholder [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5",
        // boolean-ui patch: 12px text and icons in an `sm` group, 16px in an `lg` group (stock: one size).
        "group-data-[size=sm]/input-group:text-xs group-data-[size=sm]/input-group:[&_svg:not([class*='size-'])]:size-3 group-data-[size=lg]/input-group:text-base group-data-[size=lg]/input-group:[&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function InputGroupInput({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "size" | "variant">) {
  const group = React.useContext(InputGroupContext)

  return (
    <Input
      data-slot="input-group-control"
      // boolean-ui patch: the input takes the group's size; the group draws the fill, so the input never takes the
      // filled one (stock: no size or variant).
      size={group?.size}
      variant="default"
      className={cn(
        // boolean-ui patch: the group draws the fill, edge and disabled fill (stock also removed a focus ring).
        "flex-1 rounded-none border-0 bg-transparent shadow-none disabled:bg-transparent",
        !group?.attached && "group-has-[>[data-align=inline-start]>svg]/input-group:ps-2.25 group-has-[>[data-align=inline-end]>svg]/input-group:pe-2.25",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function InputGroupTextarea({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Textarea>, "size" | "variant">) {
  const group = React.useContext(InputGroupContext)

  return (
    <Textarea
      data-slot="input-group-control"
      // boolean-ui patch: as InputGroupInput (stock: no size or variant).
      size={group?.size}
      variant="default"
      className={cn(
        // boolean-ui patch: the group draws the fill, edge and disabled fill; the text keeps Textarea's 6px × 10px padding
        // (stock: 12px vertical padding and a removed focus ring). It fills the group's width: Textarea alone keeps its
        // native column width, which a group stacked over a block addon would centre.
        "w-full flex-1 resize-none rounded-none border-0 bg-transparent shadow-none disabled:bg-transparent",
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
