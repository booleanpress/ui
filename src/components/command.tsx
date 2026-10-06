"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { Command as CommandPrimitive } from "cmdk"
import { cn } from "@/lib/utils"
import { SearchIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/dialog"
import { useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      // boolean-ui patch: the BooleanPress look — the floating surface with a 6px radius; the edge is the caller's.
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CommandDialog({
  title,
  description,
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  const strings = useUiStrings()

  return (
    <Dialog {...props}>
      {/* boolean-ui patch: the BooleanPress look — the × sits centred in the 48 px search row (stock: the dialog's
          top corner, off the row's centre line). */}
      <DialogContent
        className={cn(
          "overflow-hidden p-0 [&>[data-slot=dialog-close]]:end-1.5 [&>[data-slot=dialog-close]]:top-1.5",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {/* boolean-ui patch: the title and description sit inside the dialog they name, and default to the provider's
            strings (stock renders them in the page, outside the dialog and in English, even while it is closed). */}
        <DialogHeader className="sr-only">
          <DialogTitle>{title ?? strings.commandTitle}</DialogTitle>
          <DialogDescription>{description ?? strings.commandDescription}</DialogDescription>
        </DialogHeader>
        {/* boolean-ui patch: the search field is named by the dialog's title (stock leaves it unnamed). The palette
            has the inline command's look, with room in the search row for the × (stock: taller rows and 20 px icons). */}
        <Command
          label={title ?? strings.commandTitle}
          className={cn(showCloseButton && "**:data-[slot=command-input-wrapper]:pe-12")}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/** @since 0.1.0 */
function CommandInput({
  className,
  defaultValue,
  value,
  onValueChange,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  // boolean-ui patch: `defaultValue` sets the first search, held here; cmdk ignores it and React warns that the field has
  // both a value and a default (stock: passed on and ignored).
  const [search, setSearch] = React.useState(defaultValue == null ? undefined : String(defaultValue))
  const held = value === undefined && search !== undefined

  return (
    <div
      data-slot="command-input-wrapper"
      // boolean-ui patch: the BooleanPress look — a search row with 0.375rem 1.125rem padding and a 1px rule under it,
      // the icon in the muted grey; the field is 16 px on a 24 px line (stock: h-9 px-3, a half-opacity icon, h-10
      // text-sm).
      className="flex items-center gap-2 border-b px-4.5 py-1.5"
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex w-full bg-transparent py-1.5 text-base/normal outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        value={held ? search : value}
        onValueChange={(next) => {
          if (held) setSearch(next)
          onValueChange?.(next)
        }}
        {...props}
      />
    </div>
  )
}

// boolean-ui patch: where `CommandEmpty` renders inside a `CommandList` — a polite status region after the listbox, so
// the message is announced and the listbox holds only groups and options (stock: inside the listbox, an axe error, and
// silent). `undefined` outside a list, `null` until the region is in the page.
const CommandEmptyRegionContext = React.createContext<HTMLElement | null | undefined>(undefined)

/** @since 0.1.0 */
function CommandList({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  const strings = useUiStrings()
  const [region, setRegion] = React.useState<HTMLDivElement | null>(null)

  return (
    <CommandEmptyRegionContext.Provider value={region}>
      <CommandPrimitive.List
        data-slot="command-list"
        // boolean-ui patch: the list's name comes from the provider (stock: cmdk's English "Suggestions").
        label={strings.suggestions}
        // boolean-ui patch: the BooleanPress look — 0.625rem padding and 2px between its rows (stock: no padding).
        className={cn(
          "max-h-[300px] scroll-py-2 overflow-x-hidden overflow-y-auto p-2.5 *:[[cmdk-list-sizer]]:flex *:[[cmdk-list-sizer]]:flex-col *:[[cmdk-list-sizer]]:gap-0.5",
          className
        )}
        {...props}
      >
        {children}
      </CommandPrimitive.List>
      {/* boolean-ui patch: the region `CommandEmpty` renders in (stock: none). */}
      <div ref={setRegion} data-slot="command-status" role="status" />
    </CommandEmptyRegionContext.Provider>
  )
}

/** @since 0.1.0 */
function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  const region = React.useContext(CommandEmptyRegionContext)
  const empty = (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      // boolean-ui patch: the BooleanPress look — 2rem above and below (stock: py-6); the caller's className is merged
      // (stock: it replaced these classes).
      className={cn("py-8 text-center text-sm/normal", className)}
      {...props}
    />
  )

  // boolean-ui patch: inside a `CommandList` the message renders in the list's status region, after the listbox (stock:
  // in the listbox). Placed outside the list, it renders where it is.
  if (region === undefined) return empty
  return region ? createPortal(empty, region) : null
}

/** @since 0.1.0 */
function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      // boolean-ui patch: the BooleanPress look — no padding of its own; the heading is a muted 14 px semibold label
      // padded as the items, and the items sit 2px apart (stock: p-1, a 12 px medium heading).
      className={cn(
        "overflow-hidden text-foreground [&_[cmdk-group-heading]]:mb-0.5 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:py-1 [&_[cmdk-group-heading]]:text-sm/normal [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-items]]:flex [&_[cmdk-group-items]]:flex-col [&_[cmdk-group-items]]:gap-0.5",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      // boolean-ui patch: hidden from assistive technology, since a listbox may hold only groups and options (stock's
      // role="separator" inside the list is an accessibility error).
      aria-hidden="true"
      // boolean-ui patch: the BooleanPress look — a 1px rule as wide as the items (stock: -mx-1).
      className={cn("h-px shrink-0 bg-border", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      // boolean-ui patch: the BooleanPress look — a menu item: 0.25rem 0.625rem padding, 14 px on a 21 px line, 4px
      // radius, no transition, the hovered-surface fill when highlighted; 14 px icons in the light icon grey that
      // darken when highlighted (stock: px-2 py-1.5, 16 px muted icons). A label too long for the row wraps, and a word
      // too long for it (an address, an id) breaks rather than runs out of the list (stock: clipped).
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2.5 py-1 text-sm/normal wrap-anywhere outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-60 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 [&_svg:not([class*='text-'])]:text-control-hover data-[selected=true]:[&_svg:not([class*='text-'])]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ms-auto text-xs tracking-widest text-muted-foreground",
        // boolean-ui patch: the hint's own first letter sets its direction, so "⌘L" keeps its order on a right-to-left
        // page, as Kbd, and it keeps its width beside a long label (stock: the page's direction shows "L⌘").
        "shrink-0 [unicode-bidi:plaintext]",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
