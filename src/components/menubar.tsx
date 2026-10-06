"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-react"
import { Menubar as MenubarPrimitive } from "radix-ui"

/** @since 0.1.1 */
function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      // boolean-ui patch: the BooleanPress look — the card surface, 1px edge, 6px radius, 6px × 10px padding, 8px between
      // menus, no shadow (stock: 36px fixed height, the page colour, 4px padding and gap, shadow-xs).
      className={cn(
        "flex items-center gap-2 rounded-md border bg-card px-2.5 py-1.5 text-card-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

/** @since 0.1.1 */
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

/** @since 0.1.1 */
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

/** @since 0.1.1 */
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

/** @since 0.1.1 */
function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      // boolean-ui patch: the BooleanPress look — 0.25rem 0.625rem padding, 14 px on a 21 px line, 6px radius, the
      // hovered-surface fill on hover, focus and while open; 14 px icons in the light icon grey that darken with it
      // (stock: px-2 py-1, 4px radius, no hover fill, no icon rule).
      className={cn(
        "flex cursor-default items-center gap-2 rounded-md px-2.5 py-1 text-sm/normal font-medium outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover hover:[&_svg:not([class*='text-'])]:text-muted-foreground focus:[&_svg:not([class*='text-'])]:text-muted-foreground data-[state=open]:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        // boolean-ui patch: the theme's overlay motion.
        data-bui-motion="overlay"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        // boolean-ui patch: the BooleanPress look — at least 12.5rem wide, 6px radius, 1px edge, 0.25rem padding, the
        // overlay shadow, a column with 2px between items; it fades out on close like every overlay (stock: 12rem, a
        // block, no exit animation).
        className={cn(
          "z-50 flex max-h-(--radix-menubar-content-available-height) min-w-50 origin-(--radix-menubar-content-transform-origin) flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

/** @since 0.1.1 */
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: "default" | "destructive"
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
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
function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      // boolean-ui patch: the BooleanPress look — as MenubarItem, with the 14 px check in the icon column (stock: 2px
      // radius, py-1.5 pe-2, a 16 px check).
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1 pe-2.5 ps-8 text-sm/normal outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute start-2.5 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="size-3.5" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

/** @since 0.1.1 */
function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      // boolean-ui patch: the BooleanPress look — as MenubarItem, with a small dot in the icon column (stock: 2px
      // radius, py-1.5 pe-2, an 8 px dot).
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1 pe-2.5 ps-8 text-sm/normal outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute start-2.5 flex size-3.5 items-center justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="size-1.5 fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

/** @since 0.1.1 */
function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
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
function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      // boolean-ui patch: the BooleanPress look — a 1px rule as wide as the items; the menu's 2px gap spaces it (stock:
      // -mx-1 my-1).
      className={cn("h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

/** @since 0.1.1 */
function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
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

/** @since 0.1.1 */
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

/** @since 0.1.1 */
function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      // boolean-ui patch: the BooleanPress look — as MenubarItem, and the hovered-surface fill while its submenu is
      // open; 14 px icons in the light icon grey that darken on focus (stock: px-2 py-1.5, no gap or icon rule).
      className={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2.5 py-1 text-sm/normal outline-none select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-60 data-[inset]:ps-8 data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover focus:[&_svg:not([class*='text-'])]:text-muted-foreground data-[state=open]:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
      {/* boolean-ui patch: a 12 px chevron that points the other way in right-to-left pages (stock: 16 px, unmirrored). */}
      <ChevronRightIcon className="ms-auto size-3 rtl:rotate-180" />
    </MenubarPrimitive.SubTrigger>
  )
}

/** @since 0.1.1 */
function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      // boolean-ui patch: the theme's overlay motion.
      data-bui-motion="overlay"
      // boolean-ui patch: the BooleanPress look — as MenubarContent, with the overlay shadow (stock: a block, shadow-lg).
      // boolean-ui patch: a long submenu stops at the room in the window and scrolls, as the menu does (stock: it is
      // cut off, its last items out of reach).
      className={cn(
        "z-50 flex max-h-(--radix-menubar-content-available-height) min-w-[8rem] origin-(--radix-menubar-content-transform-origin) flex-col gap-0.5 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
