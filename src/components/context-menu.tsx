"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { ContextMenu as ContextMenuPrimitive } from "radix-ui"

/** @since 0.1.1 */
function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

/** @since 0.1.1 */
function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

/** @since 0.1.1 */
function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

/** @since 0.1.1 */
function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

/** @since 0.1.1 */
function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

/** @since 0.1.1 */
function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      // boolean-ui patch: the BooleanPress look — as ContextMenuItem, and the hovered-surface fill while its submenu is
      // open; 14 px icons in the light icon grey that darken on focus (stock: px-2 py-1.5, 16 px icons in the muted text).
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2.5 py-1 text-sm/normal outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 data-[inset]:ps-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground data-[state=open]:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      {/* boolean-ui patch: a 12 px chevron that points the other way in right-to-left pages (stock: 16 px, unmirrored). */}
      <ChevronRightIcon className="ms-auto size-3 rtl:rotate-180" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

/** @since 0.1.1 */
function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      // boolean-ui patch: the theme's overlay motion.
      data-bui-motion="overlay"
      // boolean-ui patch: the BooleanPress look — as ContextMenuContent, with the overlay shadow (stock: a block,
      // shadow-lg).
      // boolean-ui patch: a long submenu stops at the room in the window and scrolls, as the menu does (stock: it is
      // cut off, its last items out of reach).
      className={cn(
        "z-50 flex max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        // boolean-ui patch: the theme's overlay motion.
        data-bui-motion="overlay"
        // boolean-ui patch: the BooleanPress look — 6px radius, 1px edge, 0.25rem padding, the overlay shadow, a column
        // with 2px between items (stock: a block).
        className={cn(
          "z-50 flex max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

/** @since 0.1.1 */
function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      // boolean-ui patch: the BooleanPress look — 0.25rem 0.625rem padding, 14 px on a 21 px line, 4px radius, the
      // hovered-surface fill on focus; 14 px icons in the light icon grey that darken on focus; a destructive item in
      // the strong red on a subtle red fill (stock: px-2 py-1.5, 16 px icons, destructive/10, 50% opacity disabled).
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2.5 py-1 text-sm/normal outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 data-[inset]:ps-8 data-[variant=destructive]:text-destructive-strong data-[variant=destructive]:focus:bg-destructive-subtle data-[variant=destructive]:focus:text-destructive-strong [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive-strong!",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      // boolean-ui patch: the BooleanPress look — as ContextMenuItem, with the 14 px check in the icon column (stock:
      // py-1.5 pe-2, a 16 px check).
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1 pe-2.5 ps-8 text-sm/normal outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute start-2.5 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-3.5" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

/** @since 0.1.1 */
function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      // boolean-ui patch: the BooleanPress look — as ContextMenuItem, with a small dot in the icon column (stock:
      // py-1.5 pe-2, an 8 px dot).
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1 pe-2.5 ps-8 text-sm/normal outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute start-2.5 flex size-3.5 items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-1.5 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

/** @since 0.1.1 */
function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      // boolean-ui patch: the BooleanPress look — a muted semibold group heading, padded as the items (stock: px-2
      // py-1.5, medium weight in the text colour).
      className={cn(
        "px-2.5 py-1 text-sm/normal font-semibold text-muted-foreground data-[inset]:ps-8",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      // boolean-ui patch: the BooleanPress look — a 1px rule as wide as the items; the menu's 2px gap spaces it (stock:
      // -mx-1 my-1).
      className={cn("h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground",
        // boolean-ui patch: the hint's own first letter sets its direction, so "⌘L" keeps its order on a right-to-left
        // page, as Kbd and CommandShortcut (stock: the page's direction shows "L⌘").
        "[unicode-bidi:plaintext]",
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
