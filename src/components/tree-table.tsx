"use client"

// Tree table: a table whose first column opens rows into their children, on the WAI-ARIA treegrid pattern. It shares
// the Tree's data model and keys (`useTreeState`) and draws with the library's Table parts.

import * as React from "react"
import {
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react"

import { cn, fillString } from "@/lib/utils"
import { ScrollContainer } from "@/lib/scroll-focus"
import { Checkbox } from "@/components/checkbox"
import { Pagination, PaginationPages, PaginationRange } from "@/components/pagination"
import { Skeleton } from "@/components/skeleton"
import { Spinner } from "@/components/spinner"
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/table"
import { getExpandableIds, useTreeState, type TreeNode } from "@/components/tree"
import { useControlSize, useUiLocale, useUiStrings, type ControlSize } from "@booleanpress/ui/provider"

/**
 * One column of a tree table. The first column holds the tree: each row's toggle, checkbox, icon and label.
 *
 * @since 0.1.0
 */
interface TreeTableColumn<TData = unknown> {
  /** Unique among the columns; by default the cell shows `node.data[id]`. */
  id: string
  /** The column's heading. */
  header: React.ReactNode
  /** Draws the cell. Defaults to `node.data[id]`, and to the node's label in the first column. */
  cell?: (node: TreeNode<TData>) => React.ReactNode
  /** Makes the column sortable by clicking its heading. */
  sortable?: boolean
  /** The value rows sort by. Defaults to `node.data[id]`, and to the label in the first column. */
  sortValue?: (node: TreeNode<TData>) => string | number | null | undefined
  /** Classes for the column's cells. */
  className?: string
  /** Classes for the column's heading. */
  headerClassName?: string
}

/**
 * The sort of a tree table: a column and its direction. Siblings sort among themselves, at every level.
 *
 * @since 0.1.0
 */
interface TreeTableSort {
  id: string
  desc: boolean
}

/**
 * Props of `TreeTable`.
 *
 * @since 0.1.0
 */
interface TreeTableProps<TData = unknown> extends Omit<React.ComponentProps<"div">, "children"> {
  /** The rows, as tree nodes: `{ id, label, icon?, children?, leaf?, disabled?, data? }`. */
  nodes: TreeNode<TData>[]
  /** The columns, the first holding the tree. */
  columns: TreeTableColumn<TData>[]
  /** How rows are chosen: `none` (default), `single`, `multiple` or `checkbox`. */
  selectionMode?: "none" | "single" | "multiple" | "checkbox"
  /** The open rows' ids, when you control them. */
  expanded?: string[]
  /** The rows open at first, when the table controls them. */
  defaultExpanded?: string[]
  /** Called with the open rows' ids. */
  onExpandedChange?: (expanded: string[]) => void
  /** The chosen (or checked) rows' ids, when you control them. */
  selected?: string[]
  /** The rows chosen at first, when the table controls them. */
  defaultSelected?: string[]
  /** Called with the chosen rows' ids. With checkboxes it lists every checked row. */
  onSelectedChange?: (selected: string[]) => void
  /** The sort, when you control it. */
  sort?: TreeTableSort | null
  /** The sort at first, when the table controls it. */
  defaultSort?: TreeTableSort | null
  /** Called with the new sort when a heading is clicked: ascending, descending, then none. */
  onSortChange?: (sort: TreeTableSort | null) => void
  /** Shows this many top-level rows a page, with pagination below; their children stay with them. */
  pageSize?: number
  /** The page, from 1, when you control it. */
  page?: number
  /** Called with the page asked for. */
  onPageChange?: (page: number) => void
  /** Loads the children of a row the first time it opens, with a spinner in its toggle meanwhile. */
  loadChildren?: (node: TreeNode<TData>) => Promise<TreeNode<TData>[]>
  /** Dims the rows under a spinner; with no rows yet, shows placeholder rows. */
  loading?: boolean
  /** What shows when there are no rows. Defaults to the provider's `noResults` string. */
  empty?: React.ReactNode
  /** Cell padding: `sm` 6 × 8 px, `default` 8 × 14 px, `lg` 15 × 20 px. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** Draws a line round every cell. */
  gridlines?: boolean
  /** Tints every other row. */
  striped?: boolean
  /** A CSS height past which the rows scroll under a header that stays in place, such as `"20rem"`. */
  scrollHeight?: string
  /** Shows a button in the first heading that opens every row, or closes them all. */
  expandAllButton?: boolean
}

const cellPadding = {
  sm: "px-2 py-1.5",
  default: "px-3.5 py-2",
  lg: "px-5 py-3.75",
} as const

function defaultValue<TData>(node: TreeNode<TData>, column: TreeTableColumn<TData>, first: boolean): unknown {
  const data = node.data as Record<string, unknown> | undefined
  return data && column.id in data ? data[column.id] : first ? node.label : undefined
}

/**
 * A table of nested rows: organisations and their teams, folders and their files. Name it with `aria-label` or
 * `aria-labelledby`.
 *
 * @since 0.1.0
 */
function TreeTable<TData = unknown>({
  nodes,
  columns,
  selectionMode = "none",
  expanded,
  defaultExpanded,
  onExpandedChange,
  selected,
  defaultSelected,
  onSelectedChange,
  sort: sortProp,
  defaultSort = null,
  onSortChange,
  pageSize,
  page: pageProp,
  onPageChange,
  loadChildren,
  loading = false,
  empty,
  size,
  gridlines = false,
  striped = false,
  scrollHeight,
  expandAllButton = false,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TreeTableProps<TData>) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const idBase = React.useId()
  const [innerSort, setInnerSort] = React.useState<TreeTableSort | null>(defaultSort)
  const sort = sortProp !== undefined ? sortProp : innerSort
  const [innerPage, setInnerPage] = React.useState(1)
  const pageCount = pageSize ? Math.max(1, Math.ceil(nodes.length / pageSize)) : 1
  const page = Math.min(Math.max(pageProp ?? innerPage, 1), pageCount)

  const sortSiblings = React.useMemo(() => {
    if (!sort) return undefined
    const index = columns.findIndex((column) => column.id === sort.id)
    const column = columns[index]
    if (!column) return undefined
    const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" })
    const valueOf = (node: TreeNode<TData>) => (column.sortValue ? column.sortValue(node) : defaultValue(node, column, index === 0))
    return (list: TreeNode<TData>[]) =>
      [...list].sort((a, b) => {
        const va = valueOf(a)
        const vb = valueOf(b)
        if (va == null || va === "") return vb == null || vb === "" ? 0 : 1
        if (vb == null || vb === "") return -1
        const order = typeof va === "number" && typeof vb === "number" ? va - vb : collator.compare(String(va), String(vb))
        return sort.desc ? -order : order
      })
  }, [sort, columns, locale])

  const rootRange = React.useMemo<[number, number] | undefined>(
    () => (pageSize ? [(page - 1) * pageSize, page * pageSize] : undefined),
    [pageSize, page]
  )

  const state = useTreeState<TData>({
    nodes,
    selectionMode,
    expanded,
    defaultExpanded,
    onExpandedChange,
    selected,
    defaultSelected,
    onSelectedChange,
    loadChildren,
    sortSiblings,
    rootRange,
  })

  const changeSort = (id: string) => {
    const next = sort?.id !== id ? { id, desc: false } : !sort.desc ? { id, desc: true } : null
    if (sortProp === undefined) setInnerSort(next)
    onSortChange?.(next)
  }
  const changePage = (next: number) => {
    if (pageProp === undefined) setInnerPage(next)
    onPageChange?.(next)
  }

  const padding = cellPadding[resolvedSize]
  // The lines are drawn on the cells, so they stay with a header that stays in place: under every cell, and with
  // `gridlines` on each side too; a chosen row's line takes `--accent`, as the visual target's does.
  const grid = cn(
    "border-b border-border dark:border-muted",
    gridlines && "border-s last:border-e",
    !gridlines && "in-data-[state=selected]:border-accent dark:in-data-[state=selected]:border-card"
  )
  const headGrid = cn(grid, gridlines && "border-t")
  const allCheck = (() => {
    if (selectionMode !== "checkbox" || nodes.length === 0) return false
    const states = nodes.map((node) => state.checkState(node.id))
    return states.every((s) => s === true) ? true : states.some((s) => s !== false) ? "indeterminate" : false
  })()
  const expandable = expandAllButton ? getExpandableIds(nodes) : []
  const allOpen = expandable.length > 0 && expandable.every((id) => state.isExpanded(id))

  const header = (
    <TableHeader
      data-slot="tree-table-header"
      className={cn(scrollHeight && "sticky top-0 z-10 bg-card", "[&_tr]:border-border dark:[&_tr]:border-muted")}
    >
      <TableRow>
        {columns.map((column, i) => {
          const sorted = sort?.id === column.id ? (sort.desc ? "descending" : "ascending") : undefined
          const SortIcon = sorted === "ascending" ? ArrowUpNarrowWideIcon : sorted === "descending" ? ArrowDownWideNarrowIcon : ArrowUpDownIcon
          const extras =
            i === 0 ? (
              <>
                {expandAllButton ? (
                  <button
                    type="button"
                    data-slot="tree-table-expand-all"
                    aria-label={allOpen ? strings.collapseAll : strings.expandAll}
                    onClick={(event) => {
                      event.stopPropagation()
                      state.setExpanded(allOpen ? [] : expandable)
                    }}
                    className="flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:bg-accent hover:text-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid [&_svg]:size-3.5"
                  >
                    {allOpen ? <ChevronsDownUpIcon aria-hidden="true" /> : <ChevronsUpDownIcon aria-hidden="true" />}
                  </button>
                ) : null}
                {selectionMode === "checkbox" ? (
                  <Checkbox
                    data-slot="tree-table-select-all"
                    aria-label={strings.selectAll}
                    checked={allCheck}
                    disabled={nodes.length === 0}
                    onCheckedChange={() => state.toggleAllChecked()}
                  />
                ) : null}
              </>
            ) : null
          return (
            <TableHead
              key={column.id}
              data-slot="tree-table-head"
              aria-sort={column.sortable ? (sorted ?? "none") : undefined}
              className={cn(
                "relative",
                padding,
                headGrid,
                // The visual target's sortable heading: `--accent` under the pointer, `--highlight` once sorted.
                column.sortable && !sorted && "transition-[color,background-color] duration-(--bui-duration-control) hover:bg-accent hover:text-accent-foreground",
                sorted && "bg-highlight text-highlight-foreground",
                column.headerClassName
              )}
            >
              <div data-slot="tree-table-head-content" className="flex items-center gap-2">
                {extras ? (
                  <span data-slot="tree-table-head-controls" className="relative z-10 flex items-center gap-2">
                    {extras}
                  </span>
                ) : null}
                {column.sortable ? (
                  <button
                    type="button"
                    data-slot="tree-table-sort"
                    onClick={() => changeSort(column.id)}
                    className={cn(
                      // The whole heading is the button's target; a 12px sort mark in the muted colour, a 1px outline
                      // inside the heading on focus.
                      "flex items-center gap-2 text-start font-semibold outline-none after:absolute after:inset-0 focus-visible:after:outline-1 focus-visible:after:-outline-offset-1 focus-visible:after:outline-solid",
                      sorted ? "focus-visible:after:outline-highlight-foreground" : "focus-visible:after:outline-ring"
                    )}
                  >
                    {column.header}
                    <SortIcon
                      aria-hidden="true"
                      className={cn("size-3 shrink-0", sorted ? "text-current" : "text-muted-foreground")}
                    />
                  </button>
                ) : (
                  column.header
                )}
              </div>
            </TableHead>
          )
        })}
      </TableRow>
    </TableHeader>
  )

  let body: React.ReactNode
  if (nodes.length === 0 && loading) {
    body = [0, 1, 2, 3].map((i) => (
      <TableRow key={i} aria-hidden="true" data-slot="tree-table-skeleton" className="hover:bg-transparent">
        {columns.map((column, c) => (
          <TableCell key={column.id} role="gridcell" className={cn(padding, grid)}>
            <div data-slot="tree-table-skeleton-content" className="flex items-center gap-2">
              {c === 0 ? <Skeleton className="size-4 rounded-full" /> : null}
              <Skeleton className={cn("h-3 rounded-sm", c === 0 ? "w-3/5" : "w-2/3")} />
            </div>
          </TableCell>
        ))}
      </TableRow>
    ))
  } else if (nodes.length === 0) {
    body = (
      <TableRow data-slot="tree-table-empty" className="hover:bg-transparent hover:text-foreground">
        <TableCell role="gridcell" colSpan={columns.length} className={cn(padding, grid, "text-center whitespace-normal text-muted-foreground")}>
          {empty ?? strings.noResults}
        </TableCell>
      </TableRow>
    )
  } else {
    body = state.rows.map((row, rowIndex) => {
      const { node, level, hasChildren, expanded: open } = row
      // By position, not by node id: an id may hold a space, which would split the `aria-labelledby` reference.
      const labelId = `${idBase}-label-${rowIndex}`
      const rowSelected = selectionMode === "single" || selectionMode === "multiple" ? state.isSelected(node.id) : false
      const checked = selectionMode === "checkbox" ? state.checkState(node.id) : false
      const icon = open && node.expandedIcon !== undefined ? node.expandedIcon : node.icon
      return (
        <TableRow
          key={node.id}
          ref={state.registerItem(node.id)}
          data-slot="tree-table-row"
          data-node-id={node.id}
          data-state={rowSelected ? "selected" : undefined}
          aria-level={level}
          aria-setsize={row.setsize}
          aria-posinset={row.posinset}
          aria-expanded={hasChildren ? open : undefined}
          aria-selected={selectionMode === "none" ? undefined : selectionMode === "checkbox" ? checked === true : rowSelected}
          aria-disabled={node.disabled || undefined}
          aria-busy={row.loading || undefined}
          tabIndex={state.tabbableId === node.id ? 0 : -1}
          onFocus={(event) => {
            if (event.target === event.currentTarget) state.setFocusedId(node.id)
          }}
          onKeyDown={(event) => {
            if (event.target === event.currentTarget) state.handleKeyDown(event, node.id)
          }}
          onClick={(event) => {
            if ((event.target as HTMLElement).closest("[data-slot=tree-table-toggle],[data-slot=tree-table-checkbox]")) return
            state.activate(node.id)
          }}
          className={cn(
            "outline-none focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring focus-visible:outline-solid",
            selectionMode !== "none" && !node.disabled && "cursor-pointer",
            selectionMode === "none" && hasChildren && "cursor-pointer",
            striped && "even:bg-subtle dark:even:bg-background",
            node.disabled && "opacity-60"
          )}
        >
          {columns.map((column, i) => {
            const content = column.cell ? column.cell(node) : (defaultValue(node, column, i === 0) as React.ReactNode)
            if (i > 0) {
              return (
                <TableCell key={column.id} role="gridcell" className={cn(padding, grid, column.className)}>
                  {content}
                </TableCell>
              )
            }
            return (
              <TableCell key={column.id} role="gridcell" className={cn(padding, grid, column.className)}>
                <div data-slot="tree-table-cell-content" className="flex items-center gap-2" style={{ paddingInlineStart: `${level - 1}rem` }}>
                  <button
                    type="button"
                    tabIndex={-1}
                    data-slot="tree-table-toggle"
                    aria-label={fillString(open ? strings.collapseNode : strings.expandNode, { label: node.label })}
                    disabled={!hasChildren}
                    // The focus stays on the row, as a pointer press on the toggle would otherwise take it.
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      state.focusRow(node.id)
                      state.toggleExpanded(node.id)
                    }}
                    className={cn(
                      // The visual target's row toggle: a round 24px button, the chevron 14px in the muted colour,
                      // `--accent` under the pointer; in a chosen row it takes the row's text colour and the card
                      // surface under the pointer.
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color] duration-(--bui-duration-control) outline-none enabled:hover:bg-accent enabled:hover:text-foreground disabled:invisible [&_svg]:size-3.5",
                      "in-data-[state=selected]:text-current in-data-[state=selected]:enabled:hover:bg-card in-data-[state=selected]:enabled:hover:text-primary"
                    )}
                  >
                    {row.loading ? (
                      <Spinner aria-hidden="true" role="presentation" />
                    ) : open ? (
                      <ChevronDownIcon aria-hidden="true" />
                    ) : (
                      <ChevronRightIcon aria-hidden="true" className="rtl:rotate-180" />
                    )}
                  </button>
                  {selectionMode === "checkbox" ? (
                    <Checkbox
                      data-slot="tree-table-checkbox"
                      tabIndex={-1}
                      aria-labelledby={labelId}
                      checked={checked === "mixed" ? "indeterminate" : checked}
                      disabled={node.disabled}
                      onMouseDown={(event) => event.preventDefault()}
                      onCheckedChange={() => {
                        state.focusRow(node.id)
                        state.toggleCheck(node.id)
                      }}
                    />
                  ) : null}
                  {icon !== undefined ? (
                    <span data-slot="tree-table-icon" aria-hidden="true" className="flex shrink-0 items-center [&_svg]:size-3.5">
                      {icon}
                    </span>
                  ) : null}
                  <span id={labelId} data-slot="tree-table-label" className="min-w-0">
                    {content}
                  </span>
                </div>
              </TableCell>
            )
          })}
        </TableRow>
      )
    })
  }

  return (
    <div
      data-slot="tree-table"
      data-size={resolvedSize}
      className={cn("relative flex w-full flex-col bg-card text-foreground", className)}
      {...props}
    >
      <ScrollContainer
        data-slot="tree-table-container"
        className="relative w-full overflow-auto"
        style={scrollHeight ? { maxHeight: scrollHeight } : undefined}
      >
        <table
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role -- the WAI-ARIA treegrid pattern puts role="treegrid" on a table; its rows take the focus.
          role="treegrid"
          data-slot="tree-table-table"
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-multiselectable={selectionMode === "multiple" || selectionMode === "checkbox" || undefined}
          aria-busy={loading || undefined}
          className="w-full caption-bottom border-separate border-spacing-0 text-sm/normal"
        >
          {header}
          <TableBody data-slot="tree-table-body" className="[&_tr]:dark:border-muted">
            {body}
          </TableBody>
        </table>
      </ScrollContainer>
      {loading && nodes.length > 0 ? (
        <div data-slot="tree-table-loading" className="absolute inset-0 z-20 flex items-center justify-center bg-card/50">
          <Spinner className="size-7 text-primary" />
        </div>
      ) : null}
      {loading && nodes.length === 0 ? (
        <span role="status" data-slot="tree-table-loading-status" className="sr-only">
          {strings.loading}
        </span>
      ) : null}
      <span role="status" data-slot="tree-table-status" className="sr-only">
        {state.status}
      </span>
      {pageSize && nodes.length > 0 ? (
        <div data-slot="tree-table-pagination" className="flex flex-wrap items-center justify-between gap-3 px-3.5 py-2">
          <PaginationRange page={page} pageSize={pageSize} total={nodes.length} />
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationPages page={page} pageCount={pageCount} onPageChange={changePage} />
          </Pagination>
        </div>
      ) : null}
    </div>
  )
}

export { TreeTable }
export type { TreeTableColumn, TreeTableProps, TreeTableSort }
