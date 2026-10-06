"use client"

// DataView: built on semantic HTML (a list of items in rows or a grid), with the library's Select, SegmentedControl,
// Pagination, Skeleton and Empty for sorting, the layout switch, pages, loading and the empty state.
import * as React from "react"
import { LayoutGridIcon, ListIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Empty, EmptyHeader, EmptyTitle } from "@/components/empty"
import { Pagination, PaginationPages } from "@/components/pagination"
import { SegmentedControl, SegmentedControlItem } from "@/components/segmented-control"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Skeleton } from "@/components/skeleton"
import { useUiStrings, type ControlSize } from "@booleanpress/ui/provider"

/** How a `DataView` lays its items out: one per row, or cards in a grid. @since 0.1.1 */
type DataViewLayout = "list" | "grid"

/** One way to sort a `DataView`: its value, the label the select shows, and how to compare two items. @since 0.1.1 */
interface DataViewSortOption<T = unknown> {
  /** The option's value, as `sort` and `onSortChange` carry it. */
  value: string
  /** The label the select shows, such as "Newest first". */
  label: string
  /** Sorts the items in the browser. Leave it out when the server sorts: `onSortChange` tells you which option. */
  compare?: (a: T, b: T) => number
}

/** The props of `DataView`. @since 0.1.1 */
interface DataViewProps<T> extends Omit<React.ComponentProps<"div">, "children" | "defaultValue"> {
  /** The items to show: all of them, or the current page when the server pages (with `total`). */
  items: readonly T[]
  /** Draws one item for the layout in use. The item is wrapped in a list item for you. */
  renderItem: (item: T, layout: DataViewLayout, index: number) => React.ReactNode
  /** A stable key for an item, such as its id. Defaults to its position. */
  getItemKey?: (item: T, index: number) => React.Key
  /** The layout, when you control it. Pair it with `onLayoutChange`. */
  layout?: DataViewLayout
  /** The layout it starts in, when it controls itself. */
  defaultLayout?: DataViewLayout
  /** Called with the layout chosen in the built-in switch. */
  onLayoutChange?: (layout: DataViewLayout) => void
  /** Shows the built-in switch between list and grid, at the end of the header. */
  layoutToggle?: boolean
  /** The ways to sort: given, the header shows a select of them. */
  sortOptions?: DataViewSortOption<T>[]
  /** The chosen sort option's value, when you control it. */
  sort?: string
  /** The sort option it starts with, when it controls itself; none keeps the items' own order. */
  defaultSort?: string
  /** Called with the sort option chosen. */
  onSortChange?: (sort: string) => void
  /** Items per page: given, the items are paged and the footer shows the pages. */
  pageSize?: number
  /** The current page, from 1, when you control it. Pair it with `onPageChange`. */
  page?: number
  /** The page it starts on, when it controls itself. */
  defaultPage?: number
  /** Called with the page asked for. Sorting goes back to page 1. */
  onPageChange?: (page: number) => void
  /** The number of items on the server, when `items` holds the current page only. */
  total?: number
  /**
   * Shows that items are loading: placeholders in the layout's shape while there are none yet, or the items dimmed while
   * new ones arrive. Either way the list is marked busy.
   */
  loading?: boolean
  /** The number of placeholders while loading. Defaults to `pageSize`, or 3. */
  skeletonCount?: number
  /** Draws one placeholder for the layout in use, in place of the built-in skeleton row or card. */
  renderSkeleton?: (layout: DataViewLayout, index: number) => React.ReactNode
  /** What to show when there are no items and nothing is loading. Defaults to the provider's `noItems` text. */
  empty?: React.ReactNode
  /** Content at the start of the header, such as a title or a search field. */
  header?: React.ReactNode
  /** Content in the footer, beside the pages. */
  footer?: React.ReactNode
  /** The narrowest a grid card may be before the grid drops a column, as a CSS length. */
  itemMinWidth?: string
}

/** A value the caller may control: the prop when given, else the component's own state. */
function useControlled<V>(controlled: V | undefined, initial: V, onChange?: (value: V) => void) {
  const [own, setOwn] = React.useState(initial)
  const value = controlled !== undefined ? controlled : own
  const setValue = React.useCallback(
    (next: V) => {
      if (controlled === undefined) setOwn(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [value, setValue] as const
}

/**
 * A switch between the list and grid layouts: a segmented control of two icon segments, named by the provider's
 * `layout`, `layoutList` and `layoutGrid` strings. The `DataView` header shows it with `layoutToggle`; render it yourself
 * for a header of your own.
 *
 * @since 0.1.1
 */
function DataViewLayoutToggle({
  value,
  onValueChange,
  size = "sm",
  className,
  ...props
}: Omit<React.ComponentProps<typeof SegmentedControl>, "value" | "defaultValue" | "onValueChange" | "children"> & {
  /** The layout in use. */
  value: DataViewLayout
  /** Called with the layout chosen. */
  onValueChange: (layout: DataViewLayout) => void
  /** The switch's size: `sm` (28 px with icons, the default), `default` or `lg`. */
  size?: ControlSize
}) {
  const strings = useUiStrings()

  return (
    <SegmentedControl
      aria-label={strings.layout}
      value={value}
      onValueChange={(next) => onValueChange(next as DataViewLayout)}
      size={size}
      data-slot="data-view-layout-toggle"
      className={className}
      {...props}
    >
      <SegmentedControlItem value="list" aria-label={strings.layoutList}>
        <ListIcon />
      </SegmentedControlItem>
      <SegmentedControlItem value="grid" aria-label={strings.layoutGrid}>
        <LayoutGridIcon />
      </SegmentedControlItem>
    </SegmentedControl>
  )
}

/**
 * A select of sort options, named by the provider's `sortBy` string, which it also shows until an option is chosen. The
 * `DataView` header shows it with `sortOptions`; render it yourself for a header of your own.
 *
 * @since 0.1.1
 */
function DataViewSort({
  value,
  onValueChange,
  options,
  size,
  className,
  ...props
}: Omit<React.ComponentProps<typeof SelectTrigger>, "value" | "onChange" | "children"> & {
  /** The chosen option's value; an empty string or none shows the placeholder. */
  value?: string
  /** Called with the option chosen. */
  onValueChange: (value: string) => void
  /** The options, each with a value and a label. */
  options: Pick<DataViewSortOption, "value" | "label">[]
  /** The select's size. Defaults to the provider's `controlSize`. */
  size?: ControlSize
}) {
  const strings = useUiStrings()

  return (
    <Select value={value ?? ""} onValueChange={onValueChange}>
      <SelectTrigger aria-label={strings.sortBy} size={size} data-slot="data-view-sort" className={className} {...props}>
        <SelectValue placeholder={strings.sortBy} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

/** The built-in placeholder of one item while the first items load. */
function DataViewSkeleton({ layout }: { layout: DataViewLayout }) {
  if (layout === "grid") {
    return (
      <div className="flex flex-col gap-6 rounded-sm border p-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="mx-auto h-40 w-26" />
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="size-12 rounded-full" />
        </div>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-18 w-24 shrink-0" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-6 w-3/5" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      <div className="flex flex-col items-end gap-4">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

/**
 * A collection of items drawn by `renderItem`, as rows (`layout="list"`) or as cards in a grid, with an optional sort
 * select, a list and grid switch, pages, loading placeholders and an empty state. It sorts and pages in the browser, or
 * leaves both to the server when given `total`.
 *
 * @since 0.1.1
 */
function DataView<T>(props: DataViewProps<T>): React.ReactElement
function DataView({
  items,
  renderItem,
  getItemKey,
  layout: layoutProp,
  defaultLayout = "list",
  onLayoutChange,
  layoutToggle = false,
  sortOptions,
  sort: sortProp,
  defaultSort,
  onSortChange,
  pageSize,
  page: pageProp,
  defaultPage = 1,
  onPageChange,
  total,
  loading = false,
  skeletonCount,
  renderSkeleton,
  empty,
  header,
  footer,
  itemMinWidth = "15rem",
  className,
  style,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: DataViewProps<unknown>) {
  const strings = useUiStrings()
  const [layout, setLayout] = useControlled(layoutProp, defaultLayout, onLayoutChange)
  const [sort, setSort] = useControlled(sortProp, defaultSort ?? "", onSortChange)
  const [page, setPage] = useControlled(pageProp, defaultPage, onPageChange)

  const sorted = React.useMemo(() => {
    const compare = sortOptions?.find((option) => option.value === sort)?.compare
    return compare ? [...items].sort(compare) : items
  }, [items, sortOptions, sort])

  const paged = pageSize !== undefined && pageSize > 0
  const pageCount = paged ? Math.max(1, Math.ceil((total ?? sorted.length) / pageSize)) : 1
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const offset = paged ? (currentPage - 1) * pageSize : 0
  const shown = paged && total === undefined ? sorted.slice(offset, offset + pageSize) : sorted

  const listClass = cn(
    "m-0 list-none p-0",
    // Rows divided by the content edge, 1rem above and below each; cards in as many columns of at least `itemMinWidth`
    // as fit, 1rem apart.
    layout === "list"
      ? "flex flex-col divide-y divide-border *:py-4 *:first:pt-0 *:last:pb-0"
      : "grid grid-cols-[repeat(auto-fill,minmax(min(var(--data-view-item-min),100%),1fr))] gap-4"
  )

  const showHeader = header !== undefined || (sortOptions?.length ?? 0) > 0 || layoutToggle
  const showPages = paged && pageCount > 1
  const placeholders = skeletonCount ?? pageSize ?? 3

  let content: React.ReactNode
  if (shown.length > 0) {
    content = (
      <ul
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-busy={loading || undefined}
        data-slot="data-view-list"
        data-layout={layout}
        // While new items arrive, the ones shown stay, dimmed.
        className={cn(listClass, loading && "opacity-60")}
      >
        {shown.map((item, index) => (
          <li key={getItemKey ? getItemKey(item, offset + index) : offset + index} data-slot="data-view-item" className="m-0 min-w-0">
            {renderItem(item, layout, offset + index)}
          </li>
        ))}
      </ul>
    )
  } else if (loading) {
    content = (
      <div data-slot="data-view-loading" aria-busy="true">
        <div aria-hidden="true" className={listClass}>
          {Array.from({ length: placeholders }, (_, index) => (
            <div key={index} className="min-w-0">
              {renderSkeleton ? renderSkeleton(layout, index) : <DataViewSkeleton layout={layout} />}
            </div>
          ))}
        </div>
      </div>
    )
  } else {
    content = (
      <div data-slot="data-view-empty">
        {empty ?? (
          <Empty className="p-6 md:p-6">
            <EmptyHeader>
              <EmptyTitle className="text-sm/normal font-normal text-muted-foreground">{strings.noItems}</EmptyTitle>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="data-view"
      data-layout={layout}
      className={cn("flex flex-col gap-4", className)}
      style={{ "--data-view-item-min": itemMinWidth, ...style } as React.CSSProperties}
      {...props}
    >
      {showHeader ? (
        <div data-slot="data-view-header" className="flex flex-wrap items-center gap-3 border-b pb-4">
          {header !== undefined ? <div className="min-w-0 flex-1">{header}</div> : null}
          {sortOptions && sortOptions.length > 0 ? (
            <DataViewSort
              value={sort}
              onValueChange={(next) => {
                setSort(next)
                if (paged && currentPage !== 1) setPage(1)
              }}
              options={sortOptions}
            />
          ) : null}
          {layoutToggle ? <DataViewLayoutToggle value={layout} onValueChange={setLayout} className="ms-auto" /> : null}
        </div>
      ) : null}
      {/* The status region is always on the page, so a screen reader hears the text put into it when the first load
          starts (a live region added together with its text is often not announced). */}
      <span role="status" data-slot="data-view-status" className="sr-only">
        {loading && shown.length === 0 ? strings.loading : null}
      </span>
      {content}
      {showPages || footer !== undefined ? (
        <div data-slot="data-view-footer" className="flex flex-wrap items-center gap-3 border-t pt-4">
          {footer}
          {showPages ? (
            <Pagination className="w-auto flex-1">
              <PaginationPages page={currentPage} pageCount={pageCount} onPageChange={setPage} />
            </Pagination>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export { DataView, DataViewLayoutToggle, DataViewSort }
export type { DataViewLayout, DataViewProps, DataViewSortOption }
