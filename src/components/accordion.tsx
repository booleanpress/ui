"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronDownIcon } from "lucide-react"
import { Accordion as AccordionPrimitive } from "radix-ui"

/** @since 0.1.1 */
function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

/** @since 0.1.1 */
function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      // boolean-ui patch: the BooleanPress look — a 1px rule under every panel, the last included; a disabled panel at
      // 60% opacity, header and content (stock: no rule under the last panel, the trigger alone at 50%).
      className={cn(
        "group/accordion-item border-b data-[disabled]:opacity-60",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AccordionTrigger({
  className,
  children,
  indicator,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  /** Replaces the chevron, which turns when the panel opens. The trigger is the Tailwind group `accordion-trigger`. */
  indicator?: React.ReactNode
}) {
  return (
    // boolean-ui patch: the header carries a data-slot (stock: none).
    <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        // boolean-ui patch: the BooleanPress look — 16px padding, 14px semibold on a 21px line in the muted text, the
        // text colour when open or hovered, on the card surface, rounded 6px at the outer corners of the first and last
        // panel; focus is a 1px `--ring` outline 1px inside the header; colours fade over `--bui-duration-control`
        // (stock: no side padding, medium weight, underline on hover, a 3px ring, 50% opacity when disabled).
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between gap-2 bg-card p-4 text-start text-sm/normal font-semibold text-muted-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none data-[state=open]:text-foreground group-first/accordion-item:rounded-t-md group-last/accordion-item:data-[state=closed]:rounded-b-md [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
          className
        )}
        {...props}
      >
        {children}
        {indicator === undefined ? (
          // boolean-ui patch: a 14px chevron in the header's own colour, turning over `--bui-duration-control` (stock: a
          // 16px chevron in the muted text, nudged down 2px, over 200ms).
          <ChevronDownIcon
            data-slot="accordion-indicator"
            aria-hidden="true"
            className="pointer-events-none size-3.5 shrink-0 transition-transform duration-(--bui-duration-control) group-data-[state=open]/accordion-trigger:rotate-180"
          />
        ) : (
          <span
            data-slot="accordion-indicator"
            aria-hidden="true"
            className="pointer-events-none flex shrink-0 items-center"
          >
            {indicator}
          </span>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/** @since 0.1.1 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      // boolean-ui patch: the content sits on the card surface in the text colour (stock: no surface or colour).
      className="overflow-hidden bg-card text-sm text-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      {/* boolean-ui patch: 16px side padding, as the header (stock: none). */}
      <div className={cn("px-4 pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
