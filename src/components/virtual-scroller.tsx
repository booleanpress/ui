"use client"

// Built on TanStack Virtual's useVirtualizer: a focusable scrolling region that renders only the items in view, and a
// few either side, in a column, a row or a grid, with optional loading of more items as the end comes into view.

import * as React from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/skeleton"
import { useUiConfig, useUiStrings } from "@booleanpress/ui/provider"

/**
 * How `scrollToIndex` and `scrollToOffset` place the target: at the start, the centre or the end of the view, or
 * (`auto`) only as far as needed to bring it into view.
 *
 * @since 0.1.0
 */
export interface VirtualScrollerScrollOptions {
  align?: "start" | "center" | "end" | "auto"
  behavior?: "auto" | "smooth"
}

/**
 * What a `ref` on `VirtualScroller` holds.
 *
 * @since 0.1.0
 */
export interface VirtualScrollerHandle {
  /** Scrolls the item at `index` into view; in a grid, its row. */
  scrollToIndex: (index: number, options?: VirtualScrollerScrollOptions) => void
  /** Scrolls to a distance from the start, in pixels. */
  scrollToOffset: (offset: number, options?: VirtualScrollerScrollOptions) => void
  /** The scrolling element. */
  element: HTMLDivElement | null
}

/**
 * Props of `VirtualScroller`.
 *
 * @since 0.1.0
 */
export interface VirtualScrollerProps<T> extends Omit<React.ComponentProps<"div">, "children" | "ref"> {
  /** Every item; only those in view are rendered. */
  items: readonly T[]
  /** Draws one item. It is wrapped in an element that places it, sized `itemSize` along the scroll. */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Each item's size along the scroll in pixels (the row's height in a grid). Leave it out to measure every item. */
  itemSize?: number
  /** The size assumed for an item until it is measured, without `itemSize`. */
  estimatedItemSize?: number
  /** `vertical` (default) scrolls a column, `horizontal` a row, `grid` rows of `columns` items. */
  orientation?: "vertical" | "horizontal" | "grid"
  /** The number of items in a grid row. */
  columns?: number
  /** The space between items (and between a grid's columns), in pixels. */
  gap?: number
  /** How many items to render beyond each edge of the view, so a fast scroll shows no gap. */
  overscan?: number
  /** A stable key for an item, such as its id. Defaults to its position. */
  getItemKey?: (item: T, index: number) => React.Key
  /**
   * Marks the items as a list: the content is `role="list"` and each item a `listitem` with its `aria-posinset` and
   * the list's `aria-setsize`, so a screen reader knows the whole size though only a part is rendered.
   */
  list?: boolean
  /** More items exist after the last one: `onLoadMore` is called as the end comes into view. */
  hasMore?: boolean
  /** Items are loading: placeholder rows follow the last item and the region is marked busy. */
  loading?: boolean
  /** Called once the last items come into view while `hasMore` is set and nothing is loading. */
  onLoadMore?: () => void
  /** How many items before the end `onLoadMore` is called. */
  loadMoreThreshold?: number
  /** The number of placeholder rows while loading. */
  loaderCount?: number
  /** Draws a placeholder row while loading, in place of the built-in skeleton. */
  renderLoader?: (index: number) => React.ReactNode
  /** What shows when there are no items and nothing is loading. Defaults to the provider's `noItems` string. */
  empty?: React.ReactNode
  /** Receives `scrollToIndex`, `scrollToOffset` and the scrolling element. */
  ref?: React.Ref<VirtualScrollerHandle>
}

/**
 * A scrolling region for long lists that renders only the items in view, so 100,000 rows scroll as smoothly as 10. Give
 * it a height (a width for `horizontal`) and a name with `aria-label` or `aria-labelledby`.
 *
 * @since 0.1.0
 */
function VirtualScroller<T>({
  items,
  renderItem,
  itemSize,
  estimatedItemSize = 40,
  orientation = "vertical",
  columns = 3,
  gap = 0,
  overscan = 5,
  getItemKey,
  list = true,
  hasMore = false,
  loading = false,
  onLoadMore,
  loadMoreThreshold = 5,
  loaderCount = 3,
  renderLoader,
  empty,
  ref,
  className,
  onKeyDown,
  ...props
}: VirtualScrollerProps<T>) {
  const strings = useUiStrings()
  const { dir } = useUiConfig()
  const scroller = React.useRef<HTMLDivElement>(null)
  const horizontal = orientation === "horizontal"
  const perRow = orientation === "grid" ? Math.max(1, Math.floor(columns)) : 1
  const rowCount = Math.ceil(items.length / perRow)
  const loaderRows = loading ? Math.max(0, loaderCount) : 0
  const measured = itemSize === undefined
  // An unknown total while more can load: -1, as ARIA has it.
  const setSize = hasMore ? -1 : items.length

  // The virtualiser places every item again whenever its key function changes, so the function changes only with what
  // it reads: a scroll then re-renders without walking the whole list. The latest `getItemKey` is read through a ref.
  const latestGetItemKey = React.useRef(getItemKey)
  React.useLayoutEffect(() => {
    latestGetItemKey.current = getItemKey
  })
  const keyed = getItemKey !== undefined
  const itemKey = React.useCallback(
    (index: number): React.Key => {
      const getKey = latestGetItemKey.current
      if (index >= rowCount) return `bui-loader-${index - rowCount}`
      return perRow === 1 && keyed && getKey ? getKey(items[index], index) : index
    },
    [items, rowCount, perRow, keyed]
  )

  // The virtual items are read again on every render, never memoised, so the compiler's warning does not apply.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rowCount + loaderRows,
    getScrollElement: () => scroller.current,
    estimateSize: () => itemSize ?? estimatedItemSize,
    overscan,
    horizontal,
    gap,
    isRtl: horizontal && dir === "rtl",
    getItemKey: itemKey,
  })
  const rows = virtualizer.getVirtualItems()
  const lastRow = rows.length > 0 ? rows[rows.length - 1].index : -1

  // A new `itemSize` (or estimate) places the items again; the virtualiser keeps its sizes until told.
  const sizes = React.useRef({ itemSize, estimatedItemSize })
  React.useLayoutEffect(() => {
    if (sizes.current.itemSize === itemSize && sizes.current.estimatedItemSize === estimatedItemSize) return
    sizes.current = { itemSize, estimatedItemSize }
    virtualizer.measure()
  }, [virtualizer, itemSize, estimatedItemSize])

  React.useImperativeHandle(
    ref,
    () => ({
      scrollToIndex: (index, options) => virtualizer.scrollToIndex(Math.floor(index / perRow), options),
      scrollToOffset: (offset, options) => virtualizer.scrollToOffset(offset, options),
      get element() {
        return scroller.current
      },
    }),
    [virtualizer, perRow]
  )

  // Asks for more once the last items are in view; once per length, so a load that adds nothing does not loop. Once the
  // end leaves the view, coming back asks again, so a load that failed is retried by scrolling.
  const requestedAt = React.useRef(-1)
  React.useEffect(() => {
    const nearEnd = rowCount === 0 || lastRow >= rowCount - 1 - Math.ceil(loadMoreThreshold / perRow)
    if (!nearEnd) {
      requestedAt.current = -1
      return
    }
    if (!onLoadMore || !hasMore || loading || requestedAt.current === items.length) return
    requestedAt.current = items.length
    onLoadMore()
  }, [onLoadMore, hasMore, loading, items.length, rowCount, lastRow, loadMoreThreshold, perRow])

  const place = (start: number): React.CSSProperties =>
    horizontal ? { transform: `translateX(${dir === "rtl" ? -start : start}px)` } : { transform: `translateY(${start}px)` }
  const size = (pixels: number | undefined): React.CSSProperties =>
    pixels === undefined ? {} : horizontal ? { width: pixels } : { height: pixels }

  const loader = (index: number) =>
    renderLoader ? (
      renderLoader(index)
    ) : (
      // A skeleton bar in the item's padding, as a loading row of the visual target.
      <div className={cn("flex size-full p-2", horizontal ? "justify-center" : "items-center")}>
        <Skeleton className={horizontal ? "h-3/5 w-3.5" : "h-3.5 w-3/5"} />
      </div>
    )

  return (
    <div
      ref={scroller}
      role="region"
      // The region takes the focus, so the arrow and page keys scroll it (WCAG 2.1.1; axe's scrollable-region-focusable).
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region is reachable by keyboard.
      tabIndex={0}
      aria-busy={loading || undefined}
      data-slot="virtual-scroller"
      data-orientation={orientation}
      onKeyDown={(event) => {
        onKeyDown?.(event)
        if (event.defaultPrevented || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return
        // Home and End go through the virtualiser, which corrects the distance as it measures the items it reaches.
        if (event.key === "Home" || event.key === "End") {
          event.preventDefault()
          const count = rowCount + loaderRows
          if (count > 0) virtualizer.scrollToIndex(event.key === "Home" ? 0 : count - 1, { align: event.key === "Home" ? "start" : "end" })
        }
      }}
      // A plain scrolling box: the frame, height and surface are the page's to give; a focused region is outlined 1px,
      // 2px away, as every focused control.
      className={cn(
        "relative overflow-auto overscroll-contain outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid",
        className
      )}
      {...props}
    >
      <div
        role={list ? "list" : undefined}
        data-slot="virtual-scroller-content"
        className={cn("relative", horizontal ? "h-full" : "w-full")}
        style={horizontal ? { width: virtualizer.getTotalSize() } : { height: virtualizer.getTotalSize() }}
      >
        {rows.map((row) => {
          const isLoader = row.index >= rowCount
          const common = {
            "data-index": row.index,
            ref: measured ? virtualizer.measureElement : undefined,
            style: { ...place(row.start), ...size(measured ? undefined : itemSize) },
          }
          const position = horizontal ? "absolute top-0 start-0 h-full" : "absolute top-0 start-0 w-full"
          if (isLoader) {
            return (
              <div key={row.key} {...common} aria-hidden="true" data-slot="virtual-scroller-loader" className={position}>
                {perRow === 1 ? (
                  loader(row.index - rowCount)
                ) : (
                  <div className="grid size-full" style={{ gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))`, columnGap: gap }}>
                    {Array.from({ length: perRow }, (_, column) => (
                      <React.Fragment key={column}>{loader((row.index - rowCount) * perRow + column)}</React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )
          }
          if (perRow === 1) {
            return (
              <div
                key={row.key}
                {...common}
                role={list ? "listitem" : undefined}
                aria-setsize={list ? setSize : undefined}
                aria-posinset={list ? row.index + 1 : undefined}
                data-slot="virtual-scroller-item"
                className={position}
              >
                {renderItem(items[row.index], row.index)}
              </div>
            )
          }
          const first = row.index * perRow
          return (
            <div
              key={row.key}
              {...common}
              data-slot="virtual-scroller-row"
              className={cn(position, "grid")}
              style={{ ...common.style, gridTemplateColumns: `repeat(${perRow}, minmax(0, 1fr))`, columnGap: gap }}
            >
              {items.slice(first, first + perRow).map((item, column) => (
                <div
                  key={getItemKey ? getItemKey(item, first + column) : first + column}
                  role={list ? "listitem" : undefined}
                  aria-setsize={list ? setSize : undefined}
                  aria-posinset={list ? first + column + 1 : undefined}
                  data-slot="virtual-scroller-item"
                  className="min-w-0"
                >
                  {renderItem(item, first + column)}
                </div>
              ))}
            </div>
          )
        })}
      </div>
      {items.length === 0 && !loading && !hasMore ? (
        <div data-slot="virtual-scroller-empty" className="p-2 text-sm/normal text-muted-foreground">
          {empty ?? strings.noItems}
        </div>
      ) : null}
      <div data-slot="virtual-scroller-status" role="status" className="sr-only">
        {loading ? (items.length > 0 ? strings.loadingMore : strings.loading) : ""}
      </div>
    </div>
  )
}

export { VirtualScroller }
