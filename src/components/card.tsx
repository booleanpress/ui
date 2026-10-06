import * as React from "react"
import { cn } from "@/lib/utils"

/** @since 0.1.0 */
function Card({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        // boolean-ui patch: the BooleanPress look — no border, a soft shadow-sm, 12px radius, 1.125rem padding, 1.5rem
        // between the parts (stock: a border, py-6).
        "flex flex-col gap-6 rounded-xl bg-card py-4.5 text-card-foreground shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      // boolean-ui patch: 1.125rem side padding, matching the card's own (stock: px-6).
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-4.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CardTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      // boolean-ui patch: 18px, medium weight (stock: the body size, leading-none, semibold).
      className={cn("text-lg/normal font-medium", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      // boolean-ui patch: 16px in the muted text colour (stock: text-sm).
      className={cn("text-base/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CardAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      // boolean-ui patch: 1.125rem side padding (stock: px-6).
      className={cn("px-4.5", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      // boolean-ui patch: 1.125rem side padding (stock: px-6).
      className={cn("flex items-center px-4.5 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
