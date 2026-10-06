"use client"

import * as React from "react"
import { cn, fillString } from "@/lib/utils"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { buttonVariants, type Button } from "@/components/button"
import { Input } from "@/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

/** @since 0.1.0 */
function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  const strings = useUiStrings()

  return (
    <nav
      role="navigation"
      // boolean-ui patch: the landmark's name comes from the provider (stock: "pagination").
      aria-label={strings.pagination}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

/** @since 0.1.0 */
function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size,
        }),
        // boolean-ui patch: the BooleanPress look — round 2.25rem pages in the muted text colour at the normal weight, the
        // content-hover fill on hover, and the current page in the solid highlight colour (stock: ghost pages and an
        // outlined current page with the button's radius).
        "min-w-9 rounded-full border-0 bg-transparent text-sm font-normal text-muted-foreground shadow-none transition-[color,background-color,outline-color,box-shadow] duration-(--bui-duration-control) hover:bg-accent hover:text-secondary-foreground focus-visible:ring-0 focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:bg-accent [&_svg:not([class*='size-'])]:size-3.5",
        isActive &&
          "bg-highlight text-highlight-foreground hover:bg-highlight hover:text-highlight-foreground dark:hover:bg-highlight",
        className
      )}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const strings = useUiStrings()

  return (
    <PaginationLink
      // boolean-ui patch: the name and the label come from the provider. A round icon button like the pages, its label
      // for screen readers only (stock: a "Previous" label shown from the sm breakpoint).
      aria-label={strings.previousPage}
      size="icon"
      className={className}
      {...props}
    >
      <ChevronLeftIcon className="rtl:rotate-180" />
      <span className="sr-only">{strings.previous}</span>
    </PaginationLink>
  )
}

/** @since 0.1.0 */
function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const strings = useUiStrings()

  return (
    <PaginationLink
      // boolean-ui patch: the name and the label come from the provider. A round icon button like the pages, its label
      // for screen readers only (stock: a "Next" label shown from the sm breakpoint).
      aria-label={strings.nextPage}
      size="icon"
      className={className}
      {...props}
    >
      <span className="sr-only">{strings.next}</span>
      <ChevronRightIcon className="rtl:rotate-180" />
    </PaginationLink>
  )
}

/**
 * A link to the first page: a round icon button with a double chevron, like Previous, named by the provider's
 * `firstPage` string.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part — the visual target's first-page link.
function PaginationFirst({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const strings = useUiStrings()

  return (
    <PaginationLink
      aria-label={strings.firstPage}
      size="icon"
      data-slot="pagination-first"
      className={className}
      {...props}
    >
      <ChevronsLeftIcon aria-hidden="true" className="rtl:rotate-180" />
    </PaginationLink>
  )
}

/**
 * A link to the last page: a round icon button with a double chevron, like Next, named by the provider's `lastPage`
 * string.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part — the visual target's last-page link.
function PaginationLast({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  const strings = useUiStrings()

  return (
    <PaginationLink
      aria-label={strings.lastPage}
      size="icon"
      data-slot="pagination-last"
      className={className}
      {...props}
    >
      <ChevronsRightIcon aria-hidden="true" className="rtl:rotate-180" />
    </PaginationLink>
  )
}

/** @since 0.1.0 */
function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const strings = useUiStrings()

  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      // boolean-ui patch: the dots in the muted text colour, 14px (stock: the inherited colour, 16px).
      className={cn("flex size-9 items-center justify-center text-muted-foreground", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-3.5" />
      {/* boolean-ui patch: the label comes from the provider. */}
      <span className="sr-only">{strings.morePages}</span>
    </span>
  )
}

/** The numbers of a pagination, formatted in the provider's locale. */
function useNumberFormat() {
  const { locale } = useUiLocale()
  return React.useMemo(() => new Intl.NumberFormat(locale), [locale])
}

/**
 * One entry of `getPaginationItems`: a page number, or the gap before or after the pages around the current one.
 *
 * @since 0.1.0
 */
type PaginationItemValue = number | "ellipsis-start" | "ellipsis-end"

/**
 * The pages to show for `page` of `pageCount`: the first and last `boundaries` pages, `siblings` pages on each side of
 * the current one, and `"ellipsis-start"` or `"ellipsis-end"` where pages are left out. A gap of one page shows the page
 * instead, so the list keeps one length as the current page moves and the links do not jump under the pointer.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new helper — the page window the parts below draw.
function getPaginationItems({
  page,
  pageCount,
  siblings = 1,
  boundaries = 1,
}: {
  page: number
  pageCount: number
  siblings?: number
  boundaries?: number
}): PaginationItemValue[] {
  const range = (from: number, to: number) => Array.from({ length: Math.max(0, to - from + 1) }, (_, i) => from + i)
  const startPages = range(1, Math.min(boundaries, pageCount))
  const endPages = range(Math.max(pageCount - boundaries + 1, boundaries + 1), pageCount)
  const siblingsStart = Math.max(
    Math.min(page - siblings, pageCount - boundaries - siblings * 2 - 1),
    boundaries + 2
  )
  const siblingsEnd = Math.min(
    Math.max(page + siblings, boundaries + siblings * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : pageCount - 1
  )

  return [
    ...startPages,
    ...(siblingsStart > boundaries + 2
      ? (["ellipsis-start"] as const)
      : boundaries + 1 < pageCount - boundaries
        ? [boundaries + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < pageCount - boundaries - 1
      ? (["ellipsis-end"] as const)
      : pageCount - boundaries > boundaries
        ? [pageCount - boundaries]
        : []),
    ...endPages,
  ]
}

/**
 * Previous, the page numbers with gaps, and Next, drawn from `page` and `pageCount`: the list a `Pagination` holds,
 * without writing each link. With `showEdges`, First and Last go round them. First and Previous are dimmed and skipped
 * by Tab on the first page, Next and Last on the last.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part.
function PaginationPages({
  page,
  pageCount,
  onPageChange,
  getHref,
  siblings = 1,
  boundaries = 1,
  showEdges = false,
  ...props
}: Omit<React.ComponentProps<"ul">, "children"> & {
  /** The current page, from 1. */
  page: number
  /** How many pages there are. */
  pageCount: number
  /** Called with the page a link asks for. When given, the links change state instead of the address. */
  onPageChange?: (page: number) => void
  /** The address of a page, for links that load it. Without it every link points to `#`. */
  getHref?: (page: number) => string
  /** How many pages to show on each side of the current one. */
  siblings?: number
  /** How many pages to show at each end. */
  boundaries?: number
  /** Adds First and Last links, with double chevrons, before Previous and after Next. @since 0.1.0 */
  showEdges?: boolean
}) {
  const format = useNumberFormat()
  const items = getPaginationItems({ page, pageCount, siblings, boundaries })

  const linkTo = (target: number) => ({
    href: getHref?.(target) ?? "#",
    onClick: onPageChange
      ? (event: React.MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault()
          onPageChange(target)
        }
      : undefined,
  })
  const unavailable = {
    "aria-disabled": true,
    tabIndex: -1,
    className: "pointer-events-none opacity-60",
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault(),
  }

  const lastPage = Math.max(pageCount, 1)

  return (
    <PaginationContent {...props}>
      {showEdges ? (
        <PaginationItem>
          <PaginationFirst {...(page <= 1 ? { href: getHref?.(1) ?? "#", ...unavailable } : linkTo(1))} />
        </PaginationItem>
      ) : null}
      <PaginationItem>
        <PaginationPrevious {...(page <= 1 ? { href: getHref?.(1) ?? "#", ...unavailable } : linkTo(page - 1))} />
      </PaginationItem>
      {items.map((item) => (
        <PaginationItem key={item}>
          {typeof item === "number" ? (
            <PaginationLink isActive={item === page} {...linkTo(item)}>
              {format.format(item)}
            </PaginationLink>
          ) : (
            <PaginationEllipsis />
          )}
        </PaginationItem>
      ))}
      <PaginationItem>
        <PaginationNext {...(page >= pageCount ? { href: getHref?.(lastPage) ?? "#", ...unavailable } : linkTo(page + 1))} />
      </PaginationItem>
      {showEdges ? (
        <PaginationItem>
          <PaginationLast {...(page >= pageCount ? { href: getHref?.(lastPage) ?? "#", ...unavailable } : linkTo(lastPage))} />
        </PaginationItem>
      ) : null}
    </PaginationContent>
  )
}

/**
 * The rows the current page shows, as "21–30 of 120": the provider's `pageRange` string, its numbers formatted in the
 * provider's locale. A polite live region, so a screen reader announces the new range when the page changes.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part.
function PaginationRange({
  page,
  pageSize,
  total,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** The current page, from 1. */
  page: number
  /** The rows on a page. */
  pageSize: number
  /** The rows in the whole list. */
  total: number
}) {
  const strings = useUiStrings()
  const format = useNumberFormat()
  const start = total > 0 ? Math.min((page - 1) * pageSize + 1, total) : 0
  const end = Math.min(page * pageSize, total)

  return (
    <span
      role="status"
      data-slot="pagination-range"
      // Its direction follows its own text, so "1–20 of 1,284" reads in order in a right-to-left page until it is
      // translated.
      className={cn("text-sm/normal whitespace-nowrap text-muted-foreground [unicode-bidi:plaintext]", className)}
      {...props}
    >
      {fillString(strings.pageRange, {
        start: format.format(start),
        end: format.format(end),
        total: format.format(total),
      })}
    </span>
  )
}

/**
 * A labelled select of how many rows a page shows, 10, 20 or 50 unless `options` says otherwise. The label is the
 * provider's `rowsPerPage` string.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part.
function PaginationRowsPerPage({
  value,
  onValueChange,
  options = [10, 20, 50],
  size = "sm",
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children" | "onChange" | "defaultValue"> & {
  /** The rows a page shows now. */
  value: number
  /** Called with the number chosen. */
  onValueChange: (pageSize: number) => void
  /** The choices. */
  options?: number[]
  /** The select's size: 28 px (`sm`) or 35 px tall. */
  size?: "sm" | "default"
}) {
  const strings = useUiStrings()
  const format = useNumberFormat()
  const id = React.useId()
  // The size in use is always a choice, so the select never shows an empty value.
  const choices = options.includes(value) ? options : [...options, value].sort((a, b) => a - b)

  return (
    <div
      data-slot="pagination-rows-per-page"
      className={cn("flex items-center gap-2 text-sm/normal whitespace-nowrap text-muted-foreground", className)}
      {...props}
    >
      <span id={`${id}-label`} data-slot="pagination-rows-per-page-label">
        {strings.rowsPerPage}
      </span>
      <Select value={String(value)} onValueChange={(next) => onValueChange(Number(next))}>
        <SelectTrigger aria-labelledby={`${id}-label`} size={size}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {choices.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {format.format(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * A small number field named by the provider's `goToPage` string: Enter goes to the page typed, kept between 1 and
 * `pageCount`; leaving the field without Enter puts the current page back.
 *
 * @since 0.1.0
 */
// boolean-ui patch: new part.
function PaginationJump({
  page,
  pageCount,
  onPageChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The current page, from 1. */
  page: number
  /** How many pages there are. */
  pageCount: number
  /** Called with the page typed, when it differs from the current one. */
  onPageChange: (page: number) => void
}) {
  const strings = useUiStrings()
  const id = React.useId()
  const [draft, setDraft] = React.useState(String(page))
  const [shown, setShown] = React.useState(page)

  // The field follows the current page when it changes elsewhere.
  if (shown !== page) {
    setShown(page)
    setDraft(String(page))
  }

  const go = () => {
    const typed = Number.parseInt(draft, 10)
    const target = Number.isNaN(typed) ? page : Math.min(Math.max(typed, 1), Math.max(pageCount, 1))
    setDraft(String(target))
    if (target !== page) onPageChange(target)
  }

  return (
    <div
      data-slot="pagination-jump"
      className={cn("flex items-center gap-2 text-sm/normal whitespace-nowrap text-muted-foreground", className)}
      {...props}
    >
      <label htmlFor={id} data-slot="pagination-jump-label">
        {strings.goToPage}
      </label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={Math.max(pageCount, 1)}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== "Enter") return
          event.preventDefault()
          go()
        }}
        onBlur={() => setDraft(String(page))}
        data-slot="pagination-jump-input"
        // The field's 28 px size whatever the provider's `controlSize`, 48 px wide, without the browser's spin buttons.
        size="sm"
        className="w-12 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  PaginationPages,
  PaginationRange,
  PaginationRowsPerPage,
  PaginationJump,
  getPaginationItems,
  type PaginationItemValue,
}
