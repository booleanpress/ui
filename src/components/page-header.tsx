"use client"

// PageHeader: a page's title row — breadcrumb, title, description, meta and actions that fold into a "More actions" menu
// when the header is narrow. Built on plain elements, the library's Button and DropdownMenu, and container queries.

import * as React from "react"
import { EllipsisIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { useUiStrings } from "@booleanpress/ui/provider"

/**
 * The header: a grid whose actions sit at the end of the title, and fold into a menu below 36rem of its own width.
 *
 * @since 0.1.1
 */
function PageHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header"
      className={cn(
        "group/page-header @container/page-header grid grid-cols-[minmax(0,1fr)] items-start gap-x-4 gap-y-1 has-data-[slot=page-header-actions]:grid-cols-[minmax(0,1fr)_auto]",
        // Actions taller than the title (many of them, wrapped) span the title and description rows; the description's
        // row takes the extra height, so the description stays right under the title.
        "has-data-[slot=page-header-description]:grid-rows-[auto_1fr] has-data-[slot=page-header-breadcrumb]:has-data-[slot=page-header-description]:grid-rows-[auto_auto_1fr]",
        className
      )}
      {...props}
    />
  )
}

/**
 * The place for a `Breadcrumb`, above the title.
 *
 * @since 0.1.1
 */
function PageHeaderBreadcrumb({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="page-header-breadcrumb" className={cn("col-span-full mb-1.5", className)} {...props} />
}

/**
 * The title's line: the title, then its meta.
 *
 * @since 0.1.1
 */
function PageHeaderHeading({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-heading"
      className={cn("col-start-1 flex min-h-9 min-w-0 flex-wrap items-center gap-x-3 gap-y-1", className)}
      {...props}
    />
  )
}

/**
 * The page's title: an `h1` unless `as` says otherwise.
 *
 * @since 0.1.1
 */
function PageHeaderTitle({
  className,
  as: Comp = "h1",
  ...props
}: React.ComponentProps<"h1"> & {
  /** The heading level. `h1` by default; a header inside a page section takes the level that fits the outline. */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}) {
  return (
    <Comp
      data-slot="page-header-title"
      className={cn("min-w-0 text-xl/normal font-semibold break-words text-foreground", className)}
      {...props}
    />
  )
}

/**
 * Small facts beside the title: badges, avatars, a date.
 *
 * @since 0.1.1
 */
function PageHeaderMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="page-header-meta"
      className={cn("flex flex-wrap items-center gap-2 text-sm/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * A sentence under the title.
 *
 * @since 0.1.1
 */
function PageHeaderDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="page-header-description"
      className={cn("col-start-1 text-sm/normal text-muted-foreground", className)}
      {...props}
    />
  )
}

type PageHeaderActionProps = Omit<React.ComponentProps<typeof Button>, "onClick" | "asChild"> & {
  /** Runs when the action is chosen, as a button or as an item of the "More actions" menu. */
  onSelect?: () => void
  /** An icon before the label, 14 px. */
  icon?: React.ReactNode
  /** Keeps the action a button at every width, after the menu: the page's main action. */
  pinned?: boolean
}

/**
 * One action of the header: a button while there is room, an item of the "More actions" menu when there is not.
 *
 * @since 0.1.1
 */
function PageHeaderAction({ onSelect, icon, pinned = false, variant, children, ...props }: PageHeaderActionProps) {
  return (
    <Button
      type="button"
      data-slot="page-header-action"
      variant={variant ?? (pinned ? "default" : "outline")}
      onClick={onSelect}
      {...props}
    >
      {icon}
      {children}
    </Button>
  )
}

/**
 * The header's actions, at the end of the title. Below 36rem of the header's width the `PageHeaderAction`s that are not
 * `pinned` fold into a "More actions" menu.
 *
 * @since 0.1.1
 */
function PageHeaderActions({
  className,
  collapse = "auto",
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** `auto` folds the actions into the menu when the header is narrow; `always` and `never` decide once for all. */
  collapse?: "auto" | "always" | "never"
}) {
  const strings = useUiStrings()
  const elements = React.Children.toArray(children)
  const isAction = (node: React.ReactNode): node is React.ReactElement<PageHeaderActionProps> =>
    React.isValidElement(node) && node.type === PageHeaderAction
  const pinned = elements.filter((node) => isAction(node) && node.props.pinned)
  const folding = elements.filter((node) => !(isAction(node) && node.props.pinned))
  const menuItems = folding.filter(isAction)
  // Anything that is not a PageHeaderAction stays a button at every width: only the actions leave for the menu.
  const others = folding.filter((node) => !isAction(node))
  const listed =
    collapse === "always"
      ? others
      : collapse === "auto" && others.length > 0
        ? folding.map((node) =>
            isAction(node)
              ? React.cloneElement(node, { className: cn(node.props.className, "@max-xl/page-header:hidden") })
              : node
          )
        : folding

  return (
    <div
      data-slot="page-header-actions"
      data-collapse={collapse}
      className={cn(
        // At most 60% of the header, so many actions wrap instead of squeezing the title.
        "col-start-2 row-start-1 flex max-w-[60cqi] flex-wrap items-center justify-end gap-2 self-start group-has-data-[slot=page-header-breadcrumb]/page-header:row-start-2 group-has-data-[slot=page-header-description]/page-header:row-end-[span_2]",
        className
      )}
      {...props}
    >
      {listed.length > 0 && (
        <div
          data-slot="page-header-action-list"
          className={cn(
            "flex flex-wrap items-center justify-end gap-2",
            collapse === "auto" && others.length === 0 && "@max-xl/page-header:hidden"
          )}
        >
          {listed}
        </div>
      )}
      {collapse !== "never" && menuItems.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              data-slot="page-header-more"
              aria-label={strings.moreActions}
              className={cn(collapse === "auto" && "@xl/page-header:hidden")}
            >
              <EllipsisIcon aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {menuItems.map((item, index) => (
              <DropdownMenuItem
                key={item.key ?? index}
                variant={item.props.variant === "destructive" || item.props.severity === "danger" ? "destructive" : "default"}
                disabled={item.props.disabled}
                onSelect={() => item.props.onSelect?.()}
              >
                {item.props.icon}
                {/* An icon-only action is named by its aria-label: the menu shows that name as its text. */}
                {item.props.children ?? item.props["aria-label"]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {pinned}
    </div>
  )
}

export {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderHeading,
  PageHeaderTitle,
  PageHeaderMeta,
  PageHeaderDescription,
  PageHeaderActions,
  PageHeaderAction,
}
