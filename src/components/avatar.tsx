"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Avatar as AvatarPrimitive } from "radix-ui"

/** @since 0.1.1 */
function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      // boolean-ui patch: the BooleanPress sizes — 28px default, 42px lg, 24px sm (stock: 32, 40 and 24px). With a
      // badge the root stops clipping, so the badge is drawn whole; the image and fallback take the root's rounding.
      className={cn(
        "group/avatar relative flex size-7 shrink-0 overflow-hidden rounded-full select-none has-data-[slot=avatar-badge]:overflow-visible data-[size=lg]:size-[2.625rem] data-[size=sm]:size-6",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      // boolean-ui patch: the root's rounding, so the photo stays round when the root does not clip (stock: none).
      className={cn("aspect-square size-full rounded-[inherit]", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      // boolean-ui patch: a light slate disc with dark slate initials at regular weight, 14px (20px on lg, 12px on sm),
      // clipped to the disc even when a badge stops the root clipping (stock: the muted fill and muted text).
      className={cn(
        "flex size-full items-center justify-center overflow-hidden rounded-[inherit] bg-secondary-hover text-sm font-normal text-foreground group-data-[size=lg]/avatar:text-xl group-data-[size=sm]/avatar:text-xs [&>svg:not([class*='size-'])]:size-3.5 group-data-[size=lg]/avatar:[&>svg:not([class*='size-'])]:size-5",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute end-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      // boolean-ui patch: neighbours overlap by 10px (14px for lg) and each wears a 2px edge of the content surface
      // inside its box (stock: 8px overlap, a 2px page-coloured ring outside the box).
      className={cn(
        "group/avatar-group flex items-center -space-x-2.5 has-data-[size=lg]:-space-x-3.5 *:data-[slot=avatar]:border-2 *:data-[slot=avatar]:border-card",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      // boolean-ui patch: sized and coloured like the avatars beside it, with the same 2px edge (stock: 32px, muted).
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-full border-2 border-card bg-secondary-hover text-sm font-normal text-foreground group-has-data-[size=lg]/avatar-group:size-[2.625rem] group-has-data-[size=lg]/avatar-group:text-xl group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:text-xs [&>svg]:size-3.5 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
}
