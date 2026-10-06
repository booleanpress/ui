"use client"

// DataTable: built on TanStack Table 9 (state, sorting, filtering, paging, selection, expansion, grouping, column sizing,
// order, visibility and pinning) and TanStack Virtual 3 (row virtualisation), drawn as a native table with the library's
// Table cells, Checkbox, Input, Select, DropdownMenu, Pagination, Skeleton and Spinner. Row reordering is a separate
// entry, `data-table-reorder` (`ReorderableDataTable`, on dnd kit), so this one needs no drag library.
import * as React from "react"
import {
  aggregationFn_count,
  aggregationFn_max,
  aggregationFn_mean,
  aggregationFn_min,
  aggregationFn_sum,
  columnFilteringFeature,
  columnGroupingFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createExpandedRowModel,
  createFilteredRowModel,
  createGroupedRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_includesString,
  filterFn_inNumberRange,
  filterFn_weakEquals,
  FlexRender,
  flexRender,
  globalFilteringFeature,
  metaHelper,
  rowAggregationFeature,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
  type Cell,
  type CellContext,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type ColumnHelper,
  type ColumnOrderState,
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnVisibilityState,
  type ExpandedState,
  type GroupingState,
  type Header,
  type HeaderContext,
  type OnChangeFn,
  type PaginationState,
  type ReactTable,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type Table,
  type TableOptions,
  type TableState,
  type AggregationFnDef,
} from "@tanstack/react-table"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  ArrowDownWideNarrowIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpDownIcon,
  ArrowUpNarrowWideIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  EyeOffIcon,
  FileDownIcon,
  MenuIcon,
  MoreHorizontalIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"
import { cn, fillString } from "@/lib/utils"
import { useScrollFocus } from "@/lib/scroll-focus"
import { DataTableReorderHandleContext, DataTableReorderLayerContext } from "@/lib/data-table-reorder-layer"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Checkbox } from "@/components/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { Input } from "@/components/input"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
import { Pagination, PaginationPages, PaginationRange, PaginationRowsPerPage } from "@/components/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Skeleton } from "@/components/skeleton"
import { Spinner } from "@/components/spinner"
import { TableCaption, TableCell, TableHead } from "@/components/table"
import { useControlSize, useUiConfig, useUiLocale, useUiStrings, type ControlSize } from "@booleanpress/ui/provider"

// ---------------------------------------------------------------------------------------------------------------------
// Types and the feature set
// ---------------------------------------------------------------------------------------------------------------------

/**
 * One choice of a select filter or a select editor: the value stored and the label shown.
 *
 * @since 0.1.0
 */
interface DataTableOption {
  label: string
  value: string
}

/**
 * What a column's `meta` can say to `DataTable`, beyond TanStack's own column options.
 *
 * @since 0.1.0
 */
interface DataTableColumnMeta {
  /**
   * The column's name as plain text: the column menu, the live announcements, the resize handle's name and the CSV
   * header use it. Defaults to `header` when that is a string, else the column id.
   */
  label?: string
  /** Aligns the header and the cells: `end` for numbers and amounts. */
  align?: "start" | "center" | "end"
  /** Classes added to the column's header cell. */
  headerClassName?: string
  /** Classes added to each of the column's body cells. */
  cellClassName?: string
  /**
   * The column's control in the filter row (`filtering` on): a text field (the default), or a select of `options`. A
   * text filter matches any part of the value, a select filter the whole value, unless the column sets `filterFn`.
   */
  filter?: { variant?: "text" | "select"; placeholder?: string; options?: DataTableOption[] }
  /** Makes the column's cells editable with `onCellEdit`: a text field, a number field or a select of `editorOptions`. */
  editor?: "text" | "number" | "select"
  /** The choices of a `select` editor. */
  editorOptions?: DataTableOption[]
  /** The text `exportToCsv` writes for a cell, when the raw value is not what a spreadsheet should get. */
  exportValue?: (value: unknown, row: unknown) => string
}

/**
 * The table's `meta`. `DataTable` keeps its own settings under `dataTable`; every other key is yours.
 *
 * @since 0.1.0
 */
interface DataTableMeta {
  /** Set by `useDataTable`; do not write it. */
  dataTable?: {
    getRowLabel?: (row: never) => string
    radioName?: string
    /** The server pages (`pagination` with `manualPagination`): selected ids of other pages are not in `data`. */
    serverPaged?: boolean
  }
  [key: string]: unknown
}

// Every feature DataTable draws, registered once. The PURE mark lets a bundler drop it when only the helpers are used.
function createDataTableFeatures() {
  return tableFeatures({
    columnFilteringFeature,
    globalFilteringFeature,
    rowSortingFeature,
    columnGroupingFeature,
    rowAggregationFeature,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    columnSizingFeature,
    columnResizingFeature,
    columnOrderingFeature,
    columnVisibilityFeature,
    columnPinningFeature,
    filteredRowModel: createFilteredRowModel(),
    groupedRowModel: createGroupedRowModel(),
    sortedRowModel: createSortedRowModel(),
    expandedRowModel: createExpandedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filterFns: {
      includesString: filterFn_includesString,
      equalsString: filterFn_equalsString,
      equals: filterFn_equals,
      weakEquals: filterFn_weakEquals,
      inNumberRange: filterFn_inNumberRange,
      arrIncludesSome: filterFn_arrIncludesSome,
    },
    sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime, basic: sortFn_basic },
    aggregationFns: {
      sum: aggregationFn_sum,
      count: aggregationFn_count,
      mean: aggregationFn_mean,
      // Typed with TanStack's public names: its own type for these (a `Date | number` range value) is not exported, and
      // the declaration build must name every type this file's exports reach.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack's own declaration of these functions
      min: aggregationFn_min as AggregationFnDef<any, any, unknown, Date | number | undefined>,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack's own declaration of these functions
      max: aggregationFn_max as AggregationFnDef<any, any, unknown, Date | number | undefined>,
    },
    columnMeta: metaHelper<DataTableColumnMeta>(),
    tableMeta: metaHelper<DataTableMeta>(),
  })
}

const DATA_TABLE_FEATURES = /* @__PURE__ */ createDataTableFeatures()

/**
 * The TanStack features every `DataTable` registers. Columns, rows and the instance are typed with it.
 *
 * @since 0.1.0
 */
type DataTableFeatures = typeof DATA_TABLE_FEATURES

/**
 * A column of a `DataTable`: a TanStack Table 9 column definition, with `meta` typed as `DataTableColumnMeta`.
 *
 * @since 0.1.0
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- columns of one table hold values of different types
type DataTableColumnDef<TData extends RowData, TValue = any> = ColumnDef<DataTableFeatures, TData, TValue>

/**
 * The table instance `useDataTable` returns: TanStack's React table with DataTable's features.
 *
 * @since 0.1.0
 */
type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>

/**
 * A row of a `DataTable`.
 *
 * @since 0.1.0
 */
type DataTableRow<TData extends RowData> = Row<DataTableFeatures, TData>

/**
 * Every state slice of a `DataTable`: `sorting`, `columnFilters`, `globalFilter`, `pagination`, `rowSelection`,
 * `expanded`, `grouping`, `columnSizing`, `columnOrder`, `columnVisibility`, `columnPinning` and `columnResizing`.
 *
 * @since 0.1.0
 */
type DataTableState = TableState<DataTableFeatures>

/**
 * What `onCellEdit` receives when an edit is committed.
 *
 * @since 0.1.0
 */
interface DataTableCellEdit<TData extends RowData> {
  /** The row's data before the edit. */
  row: TData
  /** The row's id (`getRowId`). */
  rowId: string
  /** The edited column's id. */
  columnId: string
  /** The new value: a string, or a number from a number editor (`null` when emptied). */
  value: unknown
}

/**
 * The options of `useDataTable`, and the data and feature props of `DataTable`.
 *
 * @since 0.1.0
 */
interface UseDataTableOptions<TData extends RowData> {
  /** The columns, as TanStack Table 9 column definitions. Keep the array stable (module scope or `useMemo`). */
  columns: ReadonlyArray<DataTableColumnDef<TData>>
  /** The rows: all of them, or the current page when the server pages (`manualPagination`). Keep the array stable. */
  data: ReadonlyArray<TData>
  /** A stable id for a row, such as its database id. Selection and expansion are kept by id. Defaults to its index. */
  getRowId?: (row: TData, index: number, parent?: DataTableRow<TData>) => string
  /** The child rows of a row, for a tree of rows that expand. */
  getSubRows?: (row: TData, index: number) => ReadonlyArray<TData> | undefined
  /** A row's name, for the names of its checkbox, radio, expand button and actions. Defaults to its first column's value. */
  getRowLabel?: (row: TData) => string
  /** Sorts by a column when its title is pressed; Shift adds the column to the sort. */
  sorting?: boolean
  /** `true` gives a search field over every column and a filter row under the header; `"global"` or `"columns"` gives one. */
  filtering?: boolean | "global" | "columns"
  /**
   * Splits the rows into pages with a paginator under the table. `pageSizes` adds a rows-per-page select, `range` the
   * "11–20 of 120" text; `showEdges: false` leaves out the First and Last links.
   */
  pagination?: boolean | { pageSizes?: number[]; range?: boolean; showEdges?: boolean }
  /** Adds a column of radios (`single`) or checkboxes with a select-all box (`multiple`). */
  selection?: "single" | "multiple"
  /** Adds an expand button to each row; when expanded, the row is followed by what this returns. */
  renderSubRow?: (row: DataTableRow<TData>) => React.ReactNode
  /** Groups rows by the columns in the `grouping` state, each group under a header row that expands. */
  grouping?: boolean
  /** Lets each column be resized by dragging its edge, or with the arrow keys on its resize handle. */
  columnResizing?: boolean
  /** Lets columns be hidden: a Columns menu in the toolbar and a Hide item in each column's menu. */
  columnVisibility?: boolean
  /**
   * Adds a drag handle at the start of each row. The handles move rows in a `ReorderableDataTable`, from
   * `@booleanpress/ui/data-table-reorder`, which turns this on; a plain `DataTable` leaves the handles out.
   */
  rowReordering?: boolean
  /** The server sorts: `data` comes sorted, and `onSortingChange` tells you the order to ask for. */
  manualSorting?: boolean
  /** The server filters: `data` comes filtered, and `onGlobalFilterChange` / `onColumnFiltersChange` say how. */
  manualFiltering?: boolean
  /** The server pages: `data` is the current page, and `rowCount` the total. */
  manualPagination?: boolean
  /** The number of rows on the server, for the page count, when it pages. */
  rowCount?: number
  /** The number of pages on the server, when you know it instead of `rowCount`. */
  pageCount?: number
  /** State you control, slice by slice, each with its `on…Change`. */
  state?: Partial<DataTableState>
  /** The state the table starts with, for the slices it controls itself. */
  initialState?: Partial<DataTableState>
  onSortingChange?: OnChangeFn<SortingState>
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack types the global filter as any
  onGlobalFilterChange?: OnChangeFn<any>
  onPaginationChange?: OnChangeFn<PaginationState>
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  onExpandedChange?: OnChangeFn<ExpandedState>
  onGroupingChange?: OnChangeFn<GroupingState>
  onColumnSizingChange?: OnChangeFn<ColumnSizingState>
  onColumnOrderChange?: OnChangeFn<ColumnOrderState>
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>
  onColumnPinningChange?: OnChangeFn<ColumnPinningState>
  /** Any other TanStack Table option (`enableMultiSort`, `getRowCanExpand`, `meta`…); it overrides the props above. */
  tableOptions?: Partial<TableOptions<DataTableFeatures, TData>>
}

const SELECT_COLUMN = "__select"
const EXPAND_COLUMN = "__expand"
const REORDER_COLUMN = "__reorder"
const COLUMN_DRAG_TYPE = "application/x-booleanpress-column"

function isInternalColumn(id: string) {
  return id === SELECT_COLUMN || id === EXPAND_COLUMN || id === REORDER_COLUMN
}

/** A column's plain-text name: `meta.label`, else a string header, else its id. */
function getColumnLabel<TData extends RowData>(column: Column<DataTableFeatures, TData, unknown>): string {
  const meta = column.columnDef.meta
  if (meta?.label) return meta.label
  const header = column.columnDef.header
  return typeof header === "string" ? header : column.id
}

/** A row's name: `getRowLabel`, else the value of its first visible data column, else its position. */
function getRowLabel<TData extends RowData>(row: Row<DataTableFeatures, TData>): string {
  const custom = row.table.options.meta?.dataTable?.getRowLabel as ((row: unknown) => string) | undefined
  if (custom) return custom(row.original)
  const column = row.table.getVisibleLeafColumns().find((candidate) => candidate.accessorFn && !isInternalColumn(candidate.id))
  const value = column ? row.getValue<unknown>(column.id) : undefined
  return value == null || value === "" ? String(row.index + 1) : String(value)
}

/** Text filters match a part of the value and select filters the whole value, unless the column chooses. */
function prepareColumns<TData extends RowData>(
  columns: ReadonlyArray<DataTableColumnDef<TData>>
): DataTableColumnDef<TData>[] {
  return columns.map((column) => {
    const children = (column as { columns?: ReadonlyArray<DataTableColumnDef<TData>> }).columns
    const isAccessor = "accessorKey" in column || "accessorFn" in column
    const filterFn =
      isAccessor && !column.filterFn ? (column.meta?.filter?.variant === "select" ? "equalsString" : "includesString") : undefined
    if (!children && !filterFn) return column
    return {
      ...column,
      ...(children ? { columns: prepareColumns(children) } : null),
      ...(filterFn ? { filterFn } : null),
    } as DataTableColumnDef<TData>
  })
}

function withoutUndefined<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T
}

function isShiftEvent(event: unknown) {
  return Boolean((event as { shiftKey?: boolean } | null)?.shiftKey)
}

// ---------------------------------------------------------------------------------------------------------------------
// Built-in columns: selection and expansion
// ---------------------------------------------------------------------------------------------------------------------

function DataTableSelectAll({ table }: HeaderContext<DataTableFeatures, RowData, unknown>) {
  const strings = useUiStrings()
  const all = table.getIsAllPageRowsSelected()
  // "Some" includes "all" in TanStack Table 9, so the mixed state is some but not all.
  const some = table.getIsSomePageRowsSelected()

  return (
    <div className="flex items-center">
      <Checkbox
        aria-label={strings.selectAllRows}
        checked={all ? true : some ? "indeterminate" : false}
        disabled={table.getRowModel().rows.length === 0}
        onClick={() => table.toggleAllPageRowsSelected(!all)}
      />
    </div>
  )
}

function DataTableSelectCell({ row, table }: CellContext<DataTableFeatures, RowData, unknown>) {
  const strings = useUiStrings()
  const name = fillString(strings.selectRow, { name: getRowLabel(row) })
  const selected = row.getIsSelected()

  if (table.options.enableMultiRowSelection === false) {
    return (
      <div className="flex items-center">
        {/* Native radios that share a name: the arrow keys move the selection between rows, as in any radio group. */}
        <input
          type="radio"
          data-slot="data-table-radio"
          name={table.options.meta?.dataTable?.radioName}
          checked={selected}
          disabled={!row.getCanSelect()}
          onChange={() => row.toggleSelected(true)}
          aria-label={name}
          className="size-4.5 shrink-0 appearance-none rounded-full border border-control bg-field shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none enabled:hover:border-control-hover checked:border-primary checked:bg-primary-foreground checked:shadow-[inset_0_0_0_3px_var(--color-primary)] focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:bg-field-disabled group-data-[size=sm]/data-table:size-3.5 group-data-[size=sm]/data-table:checked:shadow-[inset_0_0_0_2.5px_var(--color-primary)] group-data-[size=lg]/data-table:size-5"
        />
      </div>
    )
  }

  const toggle = row.getToggleSelectedHandler()
  return (
    <div className="flex items-center">
      <Checkbox
        aria-label={name}
        checked={selected ? true : row.getIsSomeSelected() ? "indeterminate" : false}
        disabled={!row.getCanSelect()}
        // The handler reads the new value and Shift (a range from the last row pressed) from the event it is given.
        onClick={(event) => toggle({ target: { checked: !selected }, shiftKey: event.shiftKey })}
      />
    </div>
  )
}

/** The round 24px button that expands a row or a group. */
function DataTableExpandButton<TData extends RowData>({ row, label }: { row: Row<DataTableFeatures, TData>; label: string }) {
  const strings = useUiStrings()
  const expanded = row.getIsExpanded()
  const Icon = expanded ? ChevronDownIcon : ChevronRightIcon

  return (
    <button
      type="button"
      data-slot="data-table-expand"
      aria-expanded={expanded}
      aria-label={fillString(expanded ? strings.collapseRow : strings.expandRow, { name: label })}
      onClick={() => row.toggleExpanded()}
      className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:bg-accent hover:text-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring in-data-[state=selected]:text-highlight-foreground in-data-[state=selected]:hover:bg-card in-data-[state=selected]:hover:text-primary"
    >
      <Icon aria-hidden="true" className={cn("size-3.5", !expanded && "rtl:rotate-180")} />
    </button>
  )
}

function DataTableExpandCell({ row }: CellContext<DataTableFeatures, RowData, unknown>) {
  return (
    <div className="flex items-center" style={row.depth ? { paddingInlineStart: `${row.depth * 1.5}rem` } : undefined}>
      {row.getCanExpand() ? <DataTableExpandButton row={row} label={getRowLabel(row)} /> : <span className="size-6" />}
    </div>
  )
}

/** The drag handle of a reorderable row: the visual target's bars, in the field-icon colour, darker on hover. */
function DataTableReorderCell({ row }: CellContext<DataTableFeatures, RowData, unknown>) {
  const strings = useUiStrings()
  // Given by the row of a `ReorderableDataTable`.
  const handle = React.useContext(DataTableReorderHandleContext)
  // Sub-rows and tables drawn without DataTable have no handle: there is nothing to move them with.
  if (!handle) return <span className="block size-5" />
  const { props: dragProps, attach, disabled } = handle

  return (
    <div className="flex items-center">
      <button
        type="button"
        data-slot="data-table-row-handle"
        ref={attach}
        {...dragProps}
        // The handle is a button named after its row; dnd-kit's English role description and its empty instructions
        // are left out. The pick-up announcement says how to move the row.
        aria-roledescription={undefined}
        aria-describedby={undefined}
        aria-label={fillString(strings.dragHandle, { item: getRowLabel(row) })}
        disabled={disabled}
        className="inline-flex size-5 shrink-0 cursor-grab touch-none items-center justify-center rounded-sm text-control-hover transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-secondary-foreground focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-60 in-data-[state=selected]:text-highlight-foreground"
      >
        <MenuIcon aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  )
}

const UTILITY_COLUMN = {
  enableSorting: false,
  enableHiding: false,
  enableResizing: false,
  enableColumnFilter: false,
  enableGlobalFilter: false,
  enableGrouping: false,
  enablePinning: false,
} as const

function createSelectColumn<TData extends RowData>(mode: "single" | "multiple"): DataTableColumnDef<TData> {
  return {
    id: SELECT_COLUMN,
    header: mode === "multiple" ? DataTableSelectAll : undefined,
    cell: DataTableSelectCell,
    size: 48,
    ...UTILITY_COLUMN,
    meta: { headerClassName: "w-px", cellClassName: "w-px" },
  } as DataTableColumnDef<TData>
}

function createReorderColumn<TData extends RowData>(): DataTableColumnDef<TData> {
  return {
    id: REORDER_COLUMN,
    cell: DataTableReorderCell,
    size: 48,
    ...UTILITY_COLUMN,
    meta: { headerClassName: "w-px", cellClassName: "w-px" },
  } as DataTableColumnDef<TData>
}

function createExpandColumn<TData extends RowData>(): DataTableColumnDef<TData> {
  return {
    id: EXPAND_COLUMN,
    cell: DataTableExpandCell,
    size: 52,
    ...UTILITY_COLUMN,
    meta: { headerClassName: "w-px", cellClassName: "w-px" },
  } as DataTableColumnDef<TData>
}

// ---------------------------------------------------------------------------------------------------------------------
// useDataTable
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Builds the TanStack Table 9 instance a `DataTable` draws, from the same props, for a table you draw yourself: render
 * `table.getHeaderGroups()` with `DataTableColumnHeader` and `table.getRowModel().rows` with the Table parts, and add
 * `DataTableToolbar` and `DataTablePagination` around it. Selection and expansion add their columns for you.
 *
 * @since 0.1.0
 */
function useDataTable<TData extends RowData>(options: UseDataTableOptions<TData>): DataTableInstance<TData> {
  const {
    columns,
    data,
    getRowId,
    getSubRows,
    getRowLabel: rowLabel,
    sorting,
    filtering,
    pagination,
    selection,
    renderSubRow,
    grouping,
    columnResizing,
    columnVisibility,
    rowReordering,
    manualSorting,
    manualFiltering,
    manualPagination,
    rowCount,
    pageCount,
    state,
    initialState,
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
    onRowSelectionChange,
    onExpandedChange,
    onGroupingChange,
    onColumnSizingChange,
    onColumnOrderChange,
    onColumnVisibilityChange,
    onColumnPinningChange,
    tableOptions,
  } = options
  const { dir } = useUiConfig()
  const radioName = React.useId()
  const expandable = Boolean(renderSubRow || getSubRows)

  const allColumns = React.useMemo(
    () => [
      ...(rowReordering ? [createReorderColumn<TData>()] : []),
      ...(selection ? [createSelectColumn<TData>(selection)] : []),
      ...(expandable ? [createExpandColumn<TData>()] : []),
      ...prepareColumns(columns),
    ],
    [columns, selection, expandable, rowReordering]
  )

  const pageSizes = typeof pagination === "object" ? pagination.pageSizes : undefined
  const resolved = withoutUndefined({
    features: DATA_TABLE_FEATURES,
    data,
    columns: allColumns,
    getRowId,
    getSubRows,
    state,
    // Read once, when the table is built: groups start open, as a grouped list reads best with its rows showing, and
    // pages start at the first of `pageSizes`, so the rows-per-page select shows the size in use.
    initialState: {
      ...(grouping ? { expanded: true as const } : null),
      ...initialState,
      ...(pageSizes?.length ? { pagination: { pageIndex: 0, pageSize: pageSizes[0], ...initialState?.pagination } } : null),
    },
    enableSorting: Boolean(sorting),
    // Every column sorts ascending first, numbers included.
    sortDescFirst: false,
    manualSorting,
    enableFilters: Boolean(filtering),
    enableColumnFilters: filtering === true || filtering === "columns",
    enableGlobalFilter: filtering === true || filtering === "global",
    globalFilterFn: "includesString" as const,
    manualFiltering,
    // Without pagination the paginated model passes every row through.
    manualPagination: !pagination || manualPagination,
    rowCount,
    pageCount,
    enableRowSelection: Boolean(selection),
    enableMultiRowSelection: selection === "multiple",
    isRowRangeSelectionEvent: isShiftEvent,
    enableExpanding: expandable || Boolean(grouping),
    getRowCanExpand: renderSubRow ? () => true : undefined,
    enableGrouping: Boolean(grouping),
    // A grouped column becomes the group's header row, so it leaves the columns.
    groupedColumnMode: "remove" as const,
    // A page holds whole groups.
    paginateExpandedRows: grouping ? false : undefined,
    enableColumnResizing: Boolean(columnResizing),
    columnResizeMode: "onChange" as const,
    columnResizeDirection: dir,
    enableHiding: Boolean(columnVisibility),
    onSortingChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onPaginationChange,
    onRowSelectionChange,
    onExpandedChange,
    onGroupingChange,
    onColumnSizingChange,
    onColumnOrderChange,
    onColumnVisibilityChange,
    onColumnPinningChange,
    ...tableOptions,
    meta: {
      ...tableOptions?.meta,
      dataTable: { getRowLabel: rowLabel, radioName, serverPaged: Boolean(pagination && manualPagination) },
    },
  })

  return useTable(resolved as unknown as TableOptions<DataTableFeatures, TData>)
}

/**
 * The TanStack column helper typed for a `DataTable` of `TData`: `helper.accessor("subject", { header: "Subject" })`.
 *
 * @since 0.1.0
 */
function createDataTableColumnHelper<TData extends RowData>(): ColumnHelper<DataTableFeatures, TData> {
  return createColumnHelper<DataTableFeatures, TData>()
}

// ---------------------------------------------------------------------------------------------------------------------
// Cells
// ---------------------------------------------------------------------------------------------------------------------

// The visual target's cell padding at each size: 0.125rem × 0.375rem, 0.5rem × 0.875rem (the Table cells' own) and
// 0.75rem × 1.125rem. A checkbox column keeps its end padding.
const PAD =
  "group-data-[size=sm]/data-table:px-1.5 group-data-[size=sm]/data-table:py-0.5 group-data-[size=lg]/data-table:px-4.5 group-data-[size=lg]/data-table:py-3 [&:has([role=checkbox])]:pe-3.5 group-data-[size=sm]/data-table:[&:has([role=checkbox])]:pe-1.5 group-data-[size=lg]/data-table:[&:has([role=checkbox])]:pe-4.5"

// Cells carry the row lines (the table's borders are separate, so they stay on sticky cells): `--border`, `--muted` in
// dark; a selected row and the row above it take the faint line the visual target draws around the highlight.
const EDGE =
  "border-b border-border dark:border-muted group-data-gridlines/data-table:border-e in-data-[state=selected]:border-accent dark:in-data-[state=selected]:border-card [tr:has(+tr[data-state=selected])>&]:border-accent dark:[tr:has(+tr[data-state=selected])>&]:border-card"

const HEAD_EDGE = "border-b border-border bg-card dark:border-muted group-data-gridlines/data-table:border-e"

// Rows sit on the card surface (sticky cells inherit it), take the content-hover fill on hover, and the solid highlight
// when selected; a row whose actions menu is open keeps the hover fill.
const ROW =
  "bg-card text-foreground transition-colors duration-(--bui-duration-control) hover:bg-accent hover:text-accent-foreground has-[[data-slot=data-table-row-actions][aria-expanded=true]]:bg-accent data-[state=selected]:bg-highlight data-[state=selected]:text-highlight-foreground data-[state=selected]:hover:bg-highlight data-[state=selected]:hover:text-highlight-foreground"

const ROW_HEIGHTS: Record<ControlSize, number> = { sm: 26, default: 38, lg: 46 }

function alignClass(align: DataTableColumnMeta["align"]) {
  return align === "end" ? "text-end" : align === "center" ? "text-center" : undefined
}

function pinnedStyle<TData extends RowData>(column: Column<DataTableFeatures, TData, unknown>, sized: boolean): React.CSSProperties | undefined {
  const pinned = column.getIsPinned()
  const size = sized || pinned ? column.getSize() : undefined
  if (!pinned) return size ? { width: size } : undefined
  return {
    position: "sticky",
    insetInlineStart: pinned === "start" ? column.getStart("start") : undefined,
    insetInlineEnd: pinned === "end" ? column.getAfter("end") : undefined,
    width: size,
    minWidth: size,
    maxWidth: size,
  }
}

function pinnedClass<TData extends RowData>(column: Column<DataTableFeatures, TData, unknown>) {
  const pinned = column.getIsPinned()
  if (!pinned) return undefined
  return cn(
    "z-1",
    pinned === "start" && column.getIsLastColumn("start") && "border-e",
    pinned === "end" && column.getIsFirstColumn("end") && "border-s"
  )
}

/** Shows a cell's value as a button; Enter, F2 or a press opens its editor in place. */
function DataTableEditableCell<TData extends RowData>({
  cell,
  onCellEdit,
}: {
  cell: Cell<DataTableFeatures, TData, unknown>
  onCellEdit: (edit: DataTableCellEdit<TData>) => void
}) {
  const strings = useUiStrings()
  const meta = cell.column.columnDef.meta
  const editor = meta?.editor ?? "text"
  const label = getColumnLabel(cell.column)
  const value = cell.getValue()
  const [draft, setDraft] = React.useState<string | null>(null)
  const editing = draft !== null
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const fieldRef = React.useRef<HTMLInputElement & HTMLSelectElement>(null)
  const returnFocus = React.useRef(false)
  const finished = React.useRef(false)

  React.useEffect(() => {
    if (editing) {
      fieldRef.current?.focus()
      if (fieldRef.current instanceof HTMLInputElement) fieldRef.current.select()
    } else if (returnFocus.current) {
      returnFocus.current = false
      buttonRef.current?.focus()
    }
  }, [editing])

  // Escape cancels the edit and nothing else. A dialog, sheet or popover round the table listens for Escape on the
  // document, before the field would see it, so the field takes it first, on the window, while it is open.
  React.useEffect(() => {
    if (!editing) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.target !== fieldRef.current) return
      event.preventDefault()
      event.stopPropagation()
      if (finished.current) return
      finished.current = true
      returnFocus.current = true
      setDraft(null)
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [editing])

  const start = () => {
    finished.current = false
    setDraft(value == null ? "" : String(value))
  }

  const finish = (commit: boolean, focusCell: boolean) => {
    if (finished.current || draft === null) return
    finished.current = true
    if (commit) {
      const next = editor === "number" ? (draft.trim() === "" ? null : Number(draft)) : draft
      const valid = !(typeof next === "number" && Number.isNaN(next))
      if (valid && next !== value && !(next === "" && value == null)) {
        onCellEdit({ row: cell.row.original, rowId: cell.row.id, columnId: cell.column.id, value: next })
      }
    }
    returnFocus.current = focusCell
    setDraft(null)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault()
      event.stopPropagation()
      finish(false, true)
    } else if (event.key === "Enter") {
      event.preventDefault()
      finish(true, true)
    }
  }

  if (editing) {
    // The field keeps the row's height: 28px tall, pulled into the 21px line.
    if (editor === "select") {
      return (
        <NativeSelect
          ref={fieldRef}
          size="sm"
          fluid
          data-slot="data-table-editor"
          aria-label={label}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => finish(true, false)}
          className="-my-[3.5px]"
        >
          {meta?.editorOptions?.map((option) => (
            <NativeSelectOption key={option.value} value={option.value}>
              {option.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )
    }
    return (
      <Input
        ref={fieldRef}
        size="sm"
        type={editor === "number" ? "number" : "text"}
        data-slot="data-table-editor"
        aria-label={label}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => finish(true, false)}
        className="-my-[3.5px]"
      />
    )
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      data-slot="data-table-edit-trigger"
      onClick={start}
      onKeyDown={(event) => {
        if (event.key !== "F2") return
        event.preventDefault()
        start()
      }}
      className="-mx-1 block w-[calc(100%+0.5rem)] cursor-text rounded-sm px-1 [text-align:inherit] outline-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-ring"
    >
      <span className="sr-only">{fillString(strings.editCell, { column: label })}</span>{" "}
      <FlexRender cell={cell} />
    </button>
  )
}

// ---------------------------------------------------------------------------------------------------------------------
// DataTableColumnHeader
// ---------------------------------------------------------------------------------------------------------------------

function moveColumn<TData extends RowData>(table: Table<DataTableFeatures, TData>, fromId: string, toId: string) {
  const order = table.getAllLeafColumns().map((column) => column.id)
  const from = order.indexOf(fromId)
  const to = order.indexOf(toId)
  if (from < 0 || to < 0 || from === to) return
  const next = [...order]
  next.splice(from, 1)
  next.splice(to, 0, fromId)
  table.setColumnOrder(next)
}

/** How many data columns (not selection, expansion or a drag handle) are shown. */
function visibleDataColumns<TData extends RowData>(table: Table<DataTableFeatures, TData>) {
  return table.getVisibleLeafColumns().filter((column) => !isInternalColumn(column.id)).length
}

/** The visible, movable neighbour of a column on its visual left or right. */
function neighbourOf<TData extends RowData>(column: Column<DataTableFeatures, TData, unknown>, side: "left" | "right", dir: "ltr" | "rtl") {
  const columns = column.table
    .getVisibleLeafColumns()
    .filter((candidate) => !isInternalColumn(candidate.id) && !candidate.getIsPinned() && !candidate.parent)
  const index = columns.findIndex((candidate) => candidate.id === column.id)
  const towardsStart = (side === "left") === (dir === "ltr")
  return index < 0 ? undefined : columns[index + (towardsStart ? -1 : 1)]
}

function DataTableResizeHandle({ header, label }: { header: Header<DataTableFeatures, RowData, unknown>; label: string }) {
  const strings = useUiStrings()
  const { dir } = useUiConfig()
  const column = header.column
  const size = header.getSize()
  const min = column.columnDef.minSize ?? 20
  const max = Math.min(column.columnDef.maxSize ?? 2000, 2000)
  const handler = header.getResizeHandler()

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={fillString(strings.resizeColumn, { column: label })}
      aria-valuenow={Math.round(size)}
      aria-valuemin={min}
      aria-valuemax={max}
      // A focusable separator is the APG window-splitter pattern: the arrow keys resize the column.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      data-slot="data-table-resize-handle"
      data-resizing={column.getIsResizing() || undefined}
      onMouseDown={(event) => {
        // No text selection, and no drag of a header that can be moved: the press resizes.
        event.preventDefault()
        handler(event)
      }}
      onTouchStart={handler}
      onDoubleClick={() => column.resetSize()}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
        event.preventDefault()
        const step = event.shiftKey ? 50 : 10
        // ArrowRight widens a column in a left-to-right table, ArrowLeft in a right-to-left one.
        const wider = (event.key === "ArrowRight") === (dir === "ltr")
        const next = Math.min(Math.max(size + (wider ? step : -step), min), max)
        column.table.setColumnSizing((old) => ({ ...old, [column.id]: next }))
      }}
      // An 8px strip on the column's end edge; its 1px line shows in the primary colour on hover, focus and while
      // dragging, the visual target's resize indicator.
      className="group/resize absolute inset-y-0 end-0 z-2 flex w-2 cursor-col-resize touch-none justify-end outline-none select-none after:h-full after:w-px after:bg-transparent hover:after:bg-primary focus-visible:after:w-0.5 focus-visible:after:bg-ring data-resizing:after:bg-primary"
    />
  )
}

/**
 * A header cell (`th`) of a `DataTable` column: the title as a sort button with its arrow (`aria-sort` on the cell), the
 * drag grip and the column menu (hide, move) when allowed, and the resize handle. Render one per header of
 * `table.getHeaderGroups()` in a table you draw yourself.
 *
 * @since 0.1.0
 */
function DataTableColumnHeader<TData extends RowData>({
  header,
  reorderable = false,
  resizable = true,
  className,
  style,
  ...props
}: Omit<React.ComponentProps<"th">, "children"> & {
  /** The TanStack header to draw. */
  header: Header<DataTableFeatures, TData, unknown>
  /** Lets the column be moved: dragged by its header, or with Move left and Move right in its menu. */
  reorderable?: boolean
  /** Shows the resize handle when the column can resize; `false` for a last column that takes the space left. */
  resizable?: boolean
}) {
  const strings = useUiStrings()
  const { dir } = useUiConfig()
  const { locale } = useUiLocale()
  const column = header.column
  const table = column.table
  const meta = column.columnDef.meta
  const label = getColumnLabel(column)
  const isGroup = header.subHeaders.length > 0
  const canSort = !isGroup && column.getCanSort()
  const sorted = column.getIsSorted()
  const sortIndex = column.getSortIndex()
  const sortCount = table.atoms.sorting.get().length
  const canHide = !isGroup && column.getCanHide()
  const canMove = reorderable && !isGroup && !column.parent && !column.getIsPinned() && !isInternalColumn(column.id)
  const canResize = resizable && !isGroup && column.getCanResize()
  const [dropTarget, setDropTarget] = React.useState(false)
  const rowRef = React.useRef<HTMLTableRowElement | null>(null)
  const hidden = React.useRef(false)
  const content = flexRender(column.columnDef.header, header.getContext())
  const SortIcon = sorted === "asc" ? ArrowUpNarrowWideIcon : sorted === "desc" ? ArrowDownWideNarrowIcon : ArrowUpDownIcon
  // aria-sort goes on one header at a time: the first column of the sort.
  const ariaSort = canSort ? (sorted && sortIndex === 0 ? (sorted === "asc" ? "ascending" : "descending") : "none") : undefined
  // Unique to the table (a `useId`), to tell its column drags from another table's.
  const tableKey = table.options.meta?.dataTable?.radioName ?? ""
  const left = canMove ? neighbourOf(column, "left", dir) : undefined
  const right = canMove ? neighbourOf(column, "right", dir) : undefined

  return (
    <TableHead
      data-slot="data-table-head"
      scope="col"
      colSpan={header.colSpan > 1 ? header.colSpan : undefined}
      aria-sort={ariaSort}
      draggable={canMove || undefined}
      data-drop-target={dropTarget || undefined}
      onDragStart={
        canMove
          ? (event) => {
              // The table's own id goes with the column's, so a header dropped on another table moves nothing there.
              event.dataTransfer.setData(COLUMN_DRAG_TYPE, `${tableKey}\n${column.id}`)
              event.dataTransfer.effectAllowed = "move"
            }
          : undefined
      }
      onDragOver={
        canMove
          ? (event) => {
              if (!event.dataTransfer.types.includes(COLUMN_DRAG_TYPE)) return
              event.preventDefault()
              event.dataTransfer.dropEffect = "move"
              setDropTarget(true)
            }
          : undefined
      }
      onDragLeave={canMove ? () => setDropTarget(false) : undefined}
      onDrop={
        canMove
          ? (event) => {
              event.preventDefault()
              setDropTarget(false)
              const [fromTable, fromId] = event.dataTransfer.getData(COLUMN_DRAG_TYPE).split("\n")
              if (fromTable === tableKey && fromId) moveColumn(table, fromId, column.id)
            }
          : undefined
      }
      style={{ ...pinnedStyle(column, false), ...style }}
      className={cn(
        HEAD_EDGE,
        PAD,
        (isGroup || meta?.align === "center") && "text-center",
        meta?.align === "end" && "text-end",
        (canResize || canHide || canMove) && "group/head relative",
        pinnedClass(column),
        "data-drop-target:shadow-[inset_2px_0_0_var(--color-primary)] rtl:data-drop-target:shadow-[inset_-2px_0_0_var(--color-primary)]",
        meta?.headerClassName,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          (isGroup || meta?.align === "center") && "justify-center",
          meta?.align === "end" && "justify-end"
        )}
      >
        {canMove ? (
          // The visual target's drag grip; dragging works from anywhere on the header, the menu moves it by keyboard.
          <MenuIcon aria-hidden="true" data-slot="data-table-drag-grip" className="size-3.5 shrink-0 cursor-grab text-control-hover" />
        ) : null}
        {canSort ? (
          <button
            type="button"
            data-slot="data-table-sort"
            data-sorted={sorted || undefined}
            onClick={column.getToggleSortingHandler()}
            onKeyDown={(event) => {
              // Shift and Enter add the column to the sort, whatever modifiers the browser puts on the click it makes.
              if (event.key !== "Enter" || !event.shiftKey) return
              event.preventDefault()
              column.toggleSorting(undefined, true)
            }}
            className="group/sort inline-flex min-w-0 items-center gap-2 rounded-sm font-semibold outline-none select-none focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="truncate">{content}</span>
            <span className="inline-flex items-center gap-0.5 px-1">
              {/* Unsorted in the muted colour, darker on hover; the sorted arrow in the text colour. */}
              <SortIcon
                aria-hidden="true"
                className={cn(
                  "size-3.5 shrink-0",
                  sorted ? "text-foreground" : "text-muted-foreground group-hover/sort:text-secondary-foreground"
                )}
              />
              {sorted && sortCount > 1 ? (
                <span aria-hidden="true" className="text-[0.625rem]/none font-semibold text-muted-foreground tabular-nums">
                  {new Intl.NumberFormat(locale).format(sortIndex + 1)}
                </span>
              ) : null}
            </span>
          </button>
        ) : (
          <span className={cn("min-w-0", !header.isPlaceholder && "font-semibold")}>{content}</span>
        )}
        {canHide || canMove ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-slot="data-table-column-menu"
                aria-label={fillString(strings.columnMenu, { column: label })}
                onPointerDown={(event) => {
                  rowRef.current = event.currentTarget.closest("tr")
                }}
                onKeyDown={(event) => {
                  rowRef.current = event.currentTarget.closest("tr")
                }}
                // Over the header's end, shown while the pointer is on the header, on focus, while open, and always on
                // touch screens, so a narrow column keeps its title.
                className="absolute end-2 top-1/2 inline-flex size-6 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-card text-muted-foreground opacity-0 transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none group-hover/head:opacity-100 hover:bg-accent hover:text-foreground focus-visible:opacity-100 focus-visible:outline-solid focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring data-[state=open]:bg-accent data-[state=open]:text-foreground data-[state=open]:opacity-100 pointer-coarse:opacity-100"
              >
                <EllipsisVerticalIcon aria-hidden="true" className="size-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(event) => {
                if (!hidden.current) return
                // The column is gone with its menu button: focus the first control left in its header row.
                hidden.current = false
                event.preventDefault()
                rowRef.current?.querySelector<HTMLElement>("button, [tabindex='0']")?.focus()
              }}
            >
              {canMove ? (
                <>
                  <DropdownMenuItem disabled={!left} onSelect={() => left && moveColumn(table, column.id, left.id)}>
                    <ArrowLeftIcon aria-hidden="true" />
                    {strings.moveColumnLeft}
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={!right} onSelect={() => right && moveColumn(table, column.id, right.id)}>
                    <ArrowRightIcon aria-hidden="true" />
                    {strings.moveColumnRight}
                  </DropdownMenuItem>
                </>
              ) : null}
              {canMove && canHide ? <DropdownMenuSeparator /> : null}
              {canHide ? (
                <DropdownMenuItem
                  // The last data column stays: a table needs one, and its header holds the way back.
                  disabled={visibleDataColumns(table) <= 1}
                  onSelect={() => {
                    hidden.current = true
                    column.toggleVisibility(false)
                  }}
                >
                  <EyeOffIcon aria-hidden="true" />
                  {strings.hideColumn}
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
      {canResize ? <DataTableResizeHandle header={header as Header<DataTableFeatures, RowData, unknown>} label={label} /> : null}
    </TableHead>
  )
}

/** The filter row's control for one column: a small text field, or a select of the column's options. */
function DataTableColumnFilter<TData extends RowData>({ column }: { column: Column<DataTableFeatures, TData, unknown> }) {
  const strings = useUiStrings()
  const filter = column.columnDef.meta?.filter
  const label = fillString(strings.filterColumn, { column: getColumnLabel(column) })
  const value = column.getFilterValue()
  const text = typeof value === "string" ? value : value == null ? "" : String(value)

  if (filter?.variant === "select") {
    return (
      <Select value={text} onValueChange={(next) => column.setFilterValue(next || undefined)}>
        <SelectTrigger size="sm" fluid clearable aria-label={label}>
          <SelectValue placeholder={filter.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filter.options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  return (
    <Input
      size="sm"
      data-slot="data-table-filter"
      aria-label={label}
      placeholder={filter?.placeholder}
      value={text}
      onChange={(event) => column.setFilterValue(event.target.value || undefined)}
      className="min-w-20 font-normal"
    />
  )
}

// ---------------------------------------------------------------------------------------------------------------------
// DataTableToolbar, DataTablePagination, DataTableRowActions
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The bar above a `DataTable`: your own content at the start (a title, bulk actions), the number of selected rows, and
 * at the end the search field, the Columns menu and the Export CSV button.
 *
 * @since 0.1.0
 */
function DataTableToolbar<TData extends RowData>({
  table,
  search,
  columnsMenu,
  exportCsv,
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** The table it acts on. */
  table: DataTableInstance<TData>
  /** Shows the search field over every column. Defaults to the table's global filtering. */
  search?: boolean
  /** Shows the Columns menu that hides and shows columns. Defaults to the table's column visibility. */
  columnsMenu?: boolean
  /** Shows the Export CSV button; a string is the file's name. */
  exportCsv?: boolean | string
}) {
  const strings = useUiStrings()
  const showSearch = search ?? table.options.enableGlobalFilter === true
  const showColumns = columnsMenu ?? table.options.enableHiding === true
  const rowSelection = table.atoms.rowSelection.get()
  const serverPaged = Boolean(table.options.meta?.dataTable?.serverPaged)
  const rowsById = table.getCoreRowModel().rowsById
  // Ids whose rows have left `data` are not counted, unless the server pages and they may be on another page.
  const selected = Object.keys(rowSelection).filter((id) => rowSelection[id] && (serverPaged || rowsById[id])).length
  const globalFilter = table.atoms.globalFilter.get()
  const hideable = table.getAllLeafColumns().filter((column) => column.getCanHide() && !isInternalColumn(column.id))
  const { locale } = useUiLocale()

  return (
    <div
      data-slot="data-table-toolbar"
      className={cn("mb-4 flex flex-wrap items-center gap-2", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {children}
        {selected > 0 ? (
          <span data-slot="data-table-selected-count" className="text-sm/normal text-muted-foreground">
            {fillString(strings.selectedCount, { count: new Intl.NumberFormat(locale).format(selected) })}
          </span>
        ) : null}
      </div>
      {showSearch ? (
        <div data-slot="data-table-search" className="relative w-full sm:w-72">
          <SearchIcon
            aria-hidden="true"
            className="pointer-events-none absolute start-3 top-1/2 z-1 size-3.5 -translate-y-1/2 text-control-hover"
          />
          <Input
            clearable
            aria-label={strings.search}
            placeholder={strings.search}
            value={typeof globalFilter === "string" ? globalFilter : ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="ps-8.5"
          />
        </div>
      ) : null}
      {showColumns && hideable.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" data-slot="data-table-columns">
              <SettingsIcon aria-hidden="true" />
              {strings.columns}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {hideable.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                // The last data column shown stays shown.
                disabled={column.getIsVisible() && visibleDataColumns(table) <= 1}
                onCheckedChange={(checked) => column.toggleVisibility(checked === true)}
                // The menu stays open, so several columns can be changed in a row.
                onSelect={(event) => event.preventDefault()}
              >
                {getColumnLabel(column)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
      {exportCsv ? (
        <Button
          size="sm"
          data-slot="data-table-export"
          onClick={() => downloadCsv(exportToCsv(table), typeof exportCsv === "string" ? exportCsv : "table.csv")}
        >
          <FileDownIcon aria-hidden="true" />
          {strings.exportCsv}
        </Button>
      ) : null}
    </div>
  )
}

/**
 * The paginator under a `DataTable`: First, Previous, the pages, Next and Last, centred, as the visual target's
 * paginator; with `range`, the rows shown ("11–20 of 120") at the start; with `pageSizes`, a rows-per-page select at the
 * end.
 *
 * @since 0.1.0
 */
function DataTablePagination<TData extends RowData>({
  table,
  pageSizes,
  range = false,
  showEdges = true,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** The table it pages. */
  table: DataTableInstance<TData>
  /** The rows-per-page choices; leave out for no select. */
  pageSizes?: number[]
  /** Shows the rows the page holds, "11–20 of 120". */
  range?: boolean
  /** Shows the First and Last links round Previous and Next. `true` by default. */
  showEdges?: boolean
}) {
  const { pageIndex, pageSize } = table.atoms.pagination.get()
  const pageCount = Math.max(1, table.getPageCount())
  // A page past the end (a server total that shrank) shows as the last page.
  const page = Math.min(pageIndex + 1, pageCount)
  const sides = range || Boolean(pageSizes?.length)

  return (
    <div
      data-slot="data-table-pagination"
      className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-3.5 py-1.5", className)}
      {...props}
    >
      {sides ? (
        // boolean-ui patch: each side keeps its content's width, so a narrow table wraps the footer instead of letting
        // "Rows per page" run over the page buttons (stock: no footer).
        <div className="flex items-center sm:flex-1">
          {/* The table's own live region announces the new range, so this one is not a status. */}
          {range ? <PaginationRange role={undefined} page={page} pageSize={pageSize} total={table.getRowCount()} /> : null}
        </div>
      ) : null}
      <Pagination className="mx-0 w-auto">
        <PaginationPages
          page={page}
          pageCount={pageCount}
          onPageChange={(page) => table.setPageIndex(page - 1)}
          showEdges={showEdges}
        />
      </Pagination>
      {sides ? (
        <div className="flex items-center justify-end sm:flex-1">
          {pageSizes?.length ? (
            <PaginationRowsPerPage value={pageSize} options={pageSizes} onValueChange={(next) => table.setPageSize(next)} />
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/**
 * A row's actions: a round ⋯ button named "Actions for {name}" that opens a menu of `DropdownMenuItem`s. Put it in a
 * display column's cell.
 *
 * @since 0.1.0
 */
function DataTableRowActions({
  label,
  children,
  align = "end",
  className,
}: {
  /** The row's name, for the button's name ("Actions for t-1042"). */
  label: string
  /** The menu's items. */
  children: React.ReactNode
  /** Where the menu lines up with the button. */
  align?: "start" | "center" | "end"
  className?: string
}) {
  const strings = useUiStrings()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          rounded
          data-slot="data-table-row-actions"
          aria-label={fillString(strings.rowActions, { name: label })}
          className={cn("-my-1 text-muted-foreground in-data-[state=selected]:text-highlight-foreground", className)}
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

// ---------------------------------------------------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------------------------------------------------

/**
 * The options of `exportToCsv`.
 *
 * @since 0.1.0
 */
interface ExportToCsvOptions {
  /** `all` (the default): every row after filtering and sorting, on every page; `page`: the rows shown; `selected`. */
  rows?: "all" | "page" | "selected"
  /** The field separator: `,` by default, `;` for spreadsheets in locales with a decimal comma. */
  separator?: string
}

function csvText(value: unknown): string {
  if (value == null) return ""
  if (value instanceof Date) return value.toISOString()
  if (Array.isArray(value)) return value.map(csvText).join("; ")
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

// A spreadsheet reads a cell that starts with one of these as a formula, `-2+3+cmd|' /C calc'!A0` included.
const FORMULA_START = /^[=+\-@\t\r\n]/
// A plain number, such as -12.5, -1,5 or +3e2, is left as it is: it cannot call anything.
const PLAIN_NUMBER = /^[+-]?[\d.,]*\d(?:[eE][+-]?\d+)?$/

function csvField(value: unknown, separator: string): string {
  let text = csvText(value)
  // A cell that starts like a formula is written as text, so a spreadsheet never runs it.
  if (FORMULA_START.test(text) && !PLAIN_NUMBER.test(text)) text = `'${text}`
  return text.includes(separator) || /["\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text
}

function collectRows<TData extends RowData>(
  rows: Row<DataTableFeatures, TData>[],
  into: Row<DataTableFeatures, TData>[] = []
): Row<DataTableFeatures, TData>[] {
  for (const row of rows) {
    into.push(row)
    if (row.subRows.length) collectRows(row.subRows, into)
  }
  return into
}

/**
 * The table as CSV text (RFC 4180, CRLF lines): the visible data columns under their labels, and the rows in the order
 * shown. Display columns (selection, actions) are left out.
 *
 * @since 0.1.0
 */
function exportToCsv<TData extends RowData>(table: Table<DataTableFeatures, TData>, options: ExportToCsvOptions = {}): string {
  const { rows: which = "all", separator = "," } = options
  const columns = table.getVisibleLeafColumns().filter((column) => column.accessorFn && !isInternalColumn(column.id))
  const source = which === "page" ? table.getRowModel().rows : collectRows(table.getSortedRowModel().rows)
  const rows = source.filter((row) => !row.getIsGrouped() && (which !== "selected" || row.getIsSelected()))
  const lines = [
    columns.map((column) => csvField(getColumnLabel(column), separator)),
    ...rows.map((row) =>
      columns.map((column) => {
        const value = row.getValue<unknown>(column.id)
        const exportValue = column.columnDef.meta?.exportValue
        return csvField(exportValue ? exportValue(value, row.original) : value, separator)
      })
    ),
  ]
  return lines.map((line) => line.join(separator)).join("\r\n")
}

/**
 * Saves CSV text as a file through the browser, with a byte-order mark so spreadsheets read it as UTF-8.
 *
 * @since 0.1.0
 */
function downloadCsv(csv: string, filename: string) {
  const url = URL.createObjectURL(new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" }))
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.hidden = true
  document.body.append(link)
  link.click()
  link.remove()
  // Some browsers read the file after `click` returns, so the address lives on for a while; nothing else waits on it.
  setTimeout(() => URL.revokeObjectURL(url), 40_000)
}

// ---------------------------------------------------------------------------------------------------------------------
// DataTable
// ---------------------------------------------------------------------------------------------------------------------

/**
 * What `onRowOrderChange` receives with the new order: the row moved and its places in `data`, before and after.
 *
 * @since 0.1.0
 */
interface DataTableRowMove {
  /** The moved row's id (`getRowId`). */
  rowId: string
  /** Its index in `data` before the move. */
  from: number
  /** Its index in the new order. */
  to: number
}

/**
 * The props of `DataTable`: the data and features of `useDataTable`, and how the table is drawn.
 *
 * @since 0.1.0
 */
interface DataTableProps<TData extends RowData> extends UseDataTableOptions<TData> {
  /** Draws a group's header row (a grouped table); defaults to the grouped value and the number of rows in it. */
  renderGroupHeader?: (row: DataTableRow<TData>) => React.ReactNode
  /** Commits an edit of a cell whose column has `meta.editor`; update `data` with the new value. */
  onCellEdit?: (edit: DataTableCellEdit<TData>) => void
  /** Lets columns be moved by dragging their headers, or with Move left and Move right in each column's menu. */
  columnOrdering?: boolean
  /** With `rowReordering`, called with `data` in its new order when a row is dropped in a new place; pass it back as `data`. */
  onRowOrderChange?: (data: TData[], move: DataTableRowMove) => void
  /** Keeps the header in view while the rows scroll; give the table a `maxHeight`. */
  stickyHeader?: boolean
  /** The height the table scrolls in, such as `400` or `"60vh"`. */
  maxHeight?: number | string
  /** Draws only the rows in view, for thousands of rows; needs `maxHeight`. Rows keep one height. */
  virtual?: boolean | { rowHeight?: number; overscan?: number }
  /** Shows that rows are loading: skeleton rows when there are none yet, else a spinner over them; or force one. */
  loading?: boolean | "overlay" | "skeleton"
  /** What the table shows when it has no rows. */
  empty?: React.ReactNode
  /** The density: `sm` 26px rows, `default` 38px, `lg` 46px. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** Draws a line around every cell. */
  gridlines?: boolean
  /** Fills every other row with the faintest surface. */
  striped?: boolean
  /** Your content at the start of the toolbar above the table: a title, or buttons for the selected rows. */
  toolbar?: React.ReactNode
  /** Shows an Export CSV button in the toolbar; a string is the file's name. */
  exportCsv?: boolean | string
  /** With `selection`, a press on a row selects it too (Shift extends a multiple selection). On by default. */
  selectOnRowClick?: boolean
  /** The table's caption, shown under it. */
  caption?: React.ReactNode
  /** The table's name, when it has no caption. */
  "aria-label"?: string
  /** The id of the element that names the table. */
  "aria-labelledby"?: string
  /** Classes on the outer element. */
  className?: string
}

/** The polite announcements: the sort, the number of results after filtering, the rows of a new page. */
function useAnnouncement<TData extends RowData>(table: DataTableInstance<TData>, loading: boolean) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const { sorting, globalFilter, columnFilters, pagination } = table.state
  const data = table.options.data
  const sortKey = JSON.stringify(sorting)
  const filterKey = JSON.stringify([globalFilter ?? "", columnFilters])
  const pageKey = `${pagination.pageIndex}:${pagination.pageSize}`
  const [seen, setSeen] = React.useState({ sortKey, filterKey, pageKey, data, loading, waiting: false })
  const [message, setMessage] = React.useState("")

  if (
    seen.sortKey !== sortKey ||
    seen.filterKey !== filterKey ||
    seen.pageKey !== pageKey ||
    seen.data !== data ||
    seen.loading !== loading
  ) {
    const format = new Intl.NumberFormat(locale)
    const results = (count: number) => fillString(strings.resultsCount, { count: format.format(count) })
    let next = message
    let waiting = seen.waiting
    if (seen.sortKey !== sortKey) {
      next = sorting.length
        ? sorting
            .map((sort) => {
              const column = table.getColumn(sort.id)
              return fillString(strings.sortedBy, {
                column: column ? getColumnLabel(column) : sort.id,
                direction: sort.desc ? strings.sortDescending : strings.sortAscending,
              })
            })
            .join("; ")
        : strings.sortNone
    } else if (seen.filterKey !== filterKey) {
      // The server's results arrive later: announce them with the data that follows.
      if (table.options.manualFiltering) waiting = true
      else next = results(table.getFilteredRowModel().rows.length)
    } else if (seen.pageKey !== pageKey) {
      const total = table.getRowCount()
      const start = total ? Math.min(pagination.pageIndex * pagination.pageSize + 1, total) : 0
      const end = Math.min((pagination.pageIndex + 1) * pagination.pageSize, total)
      next = fillString(strings.pageRange, { start: format.format(start), end: format.format(end), total: format.format(total) })
    }
    if (waiting && !loading && (seen.data !== data || seen.loading !== loading)) {
      next = results(table.getRowCount())
      waiting = false
    }
    setSeen({ sortKey, filterKey, pageKey, data, loading, waiting })
    if (next !== message) setMessage(next)
  }

  return message
}

/** `list` with the item at `from` moved to `to`, as a new array. */
function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const next = [...list]
  next.splice(to, 0, ...next.splice(from, 1))
  return next
}

/** The rows in view and the spacers above and below them. Scrolling re-renders this part only. */
function DataTableVirtualRows<TData extends RowData>({
  rows,
  columnCount,
  rowHeight,
  overscan,
  scrollElement,
  renderRow,
}: {
  rows: DataTableRow<TData>[]
  columnCount: number
  rowHeight: number
  overscan: number
  scrollElement: HTMLDivElement | null
  renderRow: (row: DataTableRow<TData>, index: number) => React.ReactNode
}) {
  // The virtual items are read again on every render, never memoised, so the compiler's warning does not apply.
  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => rowHeight,
    overscan,
    getItemKey: (index) => rows[index]?.id ?? index,
  })
  const items = virtualizer.getVirtualItems()
  const before = items.length ? items[0].start : 0
  const after = items.length ? virtualizer.getTotalSize() - items[items.length - 1].end : 0

  return (
    <>
      {before > 0 ? (
        <tr aria-hidden="true" data-slot="data-table-spacer" style={{ height: before }}>
          <td colSpan={columnCount} className="p-0" />
        </tr>
      ) : null}
      {items.map((item) => renderRow(rows[item.index], item.index))}
      {after > 0 ? (
        <tr aria-hidden="true" data-slot="data-table-spacer" style={{ height: after }}>
          <td colSpan={columnCount} className="p-0" />
        </tr>
      ) : null}
    </>
  )
}

/**
 * A table of records with the features of a data grid, each turned on by a prop: sorting, filtering, pagination, row
 * selection, expansion, grouping, cell editing, column resizing, ordering and visibility, a sticky header, row
 * virtualisation, loading and empty states, sizes, gridlines and stripes. Built on TanStack Table 9: its state is
 * controlled or not slice by slice (`state` and `on…Change`), and the `manual…` flags hand the work to a server.
 *
 * @since 0.1.0
 */
function DataTable<TData extends RowData>(props: DataTableProps<TData>) {
  const {
    renderGroupHeader,
    onCellEdit,
    onRowOrderChange,
    columnOrdering = false,
    stickyHeader = false,
    maxHeight,
    virtual,
    loading = false,
    empty,
    size,
    gridlines = false,
    striped = false,
    toolbar,
    exportCsv,
    selectOnRowClick = true,
    caption,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    className,
    ...options
  } = props
  const { renderSubRow, selection, filtering, pagination, columnVisibility, rowReordering } = options
  // Row reordering needs the drag layer a `ReorderableDataTable` gives; without it the handles are left out.
  const reorderLayer = React.useContext(DataTableReorderLayerContext)
  const reorderable = Boolean(rowReordering) && reorderLayer !== null
  const table = useDataTable(rowReordering && !reorderable ? { ...options, rowReordering: false } : options)
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const { attach, tabIndex } = useScrollFocus<HTMLDivElement>()
  const [scrollElement, setScrollElement] = React.useState<HTMLDivElement | null>(null)
  const containerRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      attach(node)
      setScrollElement(node)
    },
    [attach]
  )

  const rows = table.getRowModel().rows
  const visibleColumns = table.getVisibleLeafColumns()
  const columnCount = visibleColumns.length
  const lastColumnId = visibleColumns[columnCount - 1]?.id
  const headerGroups = table.getHeaderGroups()
  const globalFiltering = filtering === true || filtering === "global"
  const columnFiltering = filtering === true || filtering === "columns"
  const virtualOptions = typeof virtual === "object" ? virtual : {}
  const virtualOn = Boolean(virtual)
  const sized = Boolean(options.columnResizing) || virtualOn
  const rowHeight = virtualOptions.rowHeight ?? ROW_HEIGHTS[resolvedSize]
  const loadingMode = loading === true ? (rows.length ? "overlay" : "skeleton") : loading || null
  const headerRowCount = headerGroups.length + (columnFiltering ? 1 : 0)
  const hasAggregates = visibleColumns.some((column) => column.columnDef.aggregationFn)
  const hasFooter = table.getAllLeafColumns().some((column) => column.columnDef.footer !== undefined)
  const filtered = Boolean(table.state.globalFilter) || table.state.columnFilters.length > 0
  const announcement = useAnnouncement(table, Boolean(loading))

  // Row reordering: the page's top-level rows form one sortable list. The rows follow `data`, so the handles rest while
  // the order shown is not the data's (sorted, grouped) and while rows are virtual.
  const reorderLocked =
    !onRowOrderChange || virtualOn || table.state.sorting.length > 0 || (table.state.grouping?.length ?? 0) > 0
  const sortableIds = reorderable ? rows.filter((row) => row.depth === 0 && !row.getIsGrouped()).map((row) => row.id) : []
  const [reorderMessage, setReorderMessage] = React.useState({ text: "", id: 0, over: "" })

  const reorderAnnounce = (template: string, active: string, position: number) => {
    const row = rows.find((candidate) => candidate.id === active)
    if (!row) return
    const format = new Intl.NumberFormat(locale)
    const text = fillString(template, {
      item: getRowLabel(row),
      position: format.format(position),
      total: format.format(options.data.length),
    })
    // Shown until the table's own announcement changes; the key makes a repeated message read again.
    setReorderMessage((previous) => ({ text, id: previous.id + 1, over: announcement }))
  }
  const indexOf = (id: string) => rows.find((candidate) => candidate.id === id)?.index ?? -1
  // The row the dragged one is over, so each new place is announced once (and the start, over itself, not at all).
  const overRef = React.useRef<string | null>(null)

  const onDragStart = (active: string) => {
    overRef.current = active
    reorderAnnounce(strings.dragStarted, active, indexOf(active) + 1)
  }
  const onDragOver = (active: string, over: string) => {
    if (over === overRef.current) return
    overRef.current = over
    reorderAnnounce(strings.itemMoved, active, indexOf(over) + 1)
  }
  const onDragCancel = (active: string) => reorderAnnounce(strings.dragCancelled, active, indexOf(active) + 1)
  const onDragEnd = (active: string, over: string | null) => {
    const from = indexOf(active)
    if (over === null) {
      reorderAnnounce(strings.dragCancelled, active, from + 1)
      return
    }
    const to = indexOf(over)
    if (from >= 0 && to >= 0 && from !== to && onRowOrderChange) {
      onRowOrderChange(moveItem(options.data, from, to), { rowId: active, from, to })
    }
    reorderAnnounce(strings.itemMoved, active, (to >= 0 ? to : from) + 1)
  }

  const onRowClick = (event: React.MouseEvent<HTMLTableRowElement>, row: DataTableRow<TData>) => {
    const target = event.target as HTMLElement
    // A press on a control inside the row is the control's.
    if (target.closest("button, a, input, select, textarea, label, [role=checkbox], [role=menuitem], [contenteditable=true]")) return
    if (!row.getCanSelect()) return
    if (selection === "single") row.toggleSelected(true)
    else row.getToggleSelectedHandler()({ target: { checked: !row.getIsSelected() }, shiftKey: event.shiftKey })
  }

  const renderCell = (cell: Cell<DataTableFeatures, TData, unknown>) => {
    const column = cell.column
    const meta = column.columnDef.meta
    const editable = Boolean(onCellEdit && meta?.editor) && !cell.getIsAggregated() && !cell.getIsPlaceholder()
    return (
      <TableCell
        key={cell.id}
        data-slot="data-table-cell"
        style={pinnedStyle(column, false)}
        className={cn(
          EDGE,
          PAD,
          alignClass(meta?.align),
          column.getIsPinned() && "bg-inherit",
          pinnedClass(column),
          sized && "overflow-hidden text-ellipsis",
          meta?.cellClassName
        )}
      >
        {editable && onCellEdit ? <DataTableEditableCell cell={cell} onCellEdit={onCellEdit} /> : <FlexRender cell={cell} />}
      </TableCell>
    )
  }

  const renderGroupFooter = (group: DataTableRow<TData>) => {
    const cells = group.getAllCellsByColumnId()
    return (
      <tr key={`${group.id}-footer`} data-slot="data-table-group-footer" className="bg-card">
        {visibleColumns.map((column) => {
          const cell = cells[column.id]
          return (
            <TableCell key={column.id} className={cn(EDGE, PAD, alignClass(column.columnDef.meta?.align), "font-semibold")}>
              {cell && column.columnDef.aggregationFn ? <FlexRender cell={cell} /> : null}
            </TableCell>
          )
        })}
      </tr>
    )
  }

  const renderRow = (row: DataTableRow<TData>, index: number): React.ReactNode => {
    if (row.getIsGrouped()) {
      const groupCell = row.groupingColumnId ? row.getAllCellsByColumnId()[row.groupingColumnId] : undefined
      const label = String(row.groupingValue ?? "")
      return (
        <tr key={row.id} data-slot="data-table-group-row" className="bg-card">
          <TableCell colSpan={columnCount} className={cn(EDGE, PAD)} style={{ paddingInlineStart: row.depth ? `${0.875 + row.depth * 1.5}rem` : undefined }}>
            <div className="flex items-center gap-2">
              <DataTableExpandButton row={row} label={label} />
              {renderGroupHeader ? (
                renderGroupHeader(row)
              ) : (
                <>
                  <span className="font-semibold">{groupCell ? <FlexRender cell={groupCell} /> : label}</span>
                  <Badge count={row.subRows.length} severity="secondary" />
                </>
              )}
            </div>
          </TableCell>
        </tr>
      )
    }
    const selected = row.getIsSelected()
    const clickable = Boolean(selection) && selectOnRowClick && row.getCanSelect()
    const rowProps = {
      "data-slot": "data-table-row",
      "data-state": selected ? "selected" : undefined,
      "aria-rowindex": virtualOn ? headerRowCount + index + 1 : undefined,
      onClick: clickable ? (event: React.MouseEvent<HTMLTableRowElement>) => onRowClick(event, row) : undefined,
      // Shift and a press extend the selection; they do not select the text between the rows.
      onMouseDown:
        clickable && selection === "multiple"
          ? (event: React.MouseEvent<HTMLTableRowElement>) => event.shiftKey && event.preventDefault()
          : undefined,
      style: virtualOn ? { height: rowHeight } : undefined,
      className: cn(
        ROW,
        striped && index % 2 === 1 && "bg-subtle dark:bg-background",
        clickable && "cursor-pointer",
        // The row being dragged rises over the others with the overlay shadow.
        reorderable && "data-dragging:relative data-dragging:z-2 data-dragging:shadow-md"
      ),
    }
    const cells = row.getVisibleCells().map(renderCell)
    return (
      <React.Fragment key={row.id}>
        {reorderLayer && reorderable && row.depth === 0 ? (
          <reorderLayer.Row id={row.id} disabled={reorderLocked} {...rowProps}>
            {cells}
          </reorderLayer.Row>
        ) : (
          <tr {...rowProps}>{cells}</tr>
        )}
        {renderSubRow && row.getIsExpanded() ? (
          <tr data-slot="data-table-sub-row" className="bg-card">
            <TableCell colSpan={columnCount} className={cn(EDGE, PAD, "whitespace-normal")}>
              {renderSubRow(row)}
            </TableCell>
          </tr>
        ) : null}
      </React.Fragment>
    )
  }

  const renderRows = () => {
    const out: React.ReactNode[] = []
    const open: DataTableRow<TData>[] = []
    rows.forEach((row, index) => {
      while (hasAggregates && open.length && open[open.length - 1].depth >= row.depth) out.push(renderGroupFooter(open.pop()!))
      out.push(renderRow(row, index))
      if (hasAggregates && row.getIsGrouped() && row.getIsExpanded()) open.push(row)
    })
    while (open.length) out.push(renderGroupFooter(open.pop()!))
    return out
  }

  let body: React.ReactNode
  if (loadingMode === "skeleton") {
    const count = pagination ? table.atoms.pagination.get().pageSize : 5
    body = Array.from({ length: Math.min(count, 10) }, (_, index) => (
      <tr key={index} aria-hidden="true" data-slot="data-table-skeleton-row" className="bg-card">
        {visibleColumns.map((column) => (
          <TableCell key={column.id} className={cn(EDGE, PAD)}>
            <Skeleton className={cn("h-4", isInternalColumn(column.id) ? "w-4" : index % 2 ? "w-2/3" : "w-4/5")} />
          </TableCell>
        ))}
      </tr>
    ))
  } else if (rows.length === 0) {
    body = (
      <tr data-slot="data-table-empty" aria-rowindex={virtualOn ? headerRowCount + 1 : undefined} className="bg-card">
        <TableCell colSpan={columnCount} className={cn(EDGE, PAD, "whitespace-normal")}>
          {empty ?? <div className="py-6 text-center text-muted-foreground">{filtered ? strings.noResults : strings.noRows}</div>}
        </TableCell>
      </tr>
    )
  } else if (virtualOn) {
    body = (
      <DataTableVirtualRows
        rows={rows}
        columnCount={columnCount}
        rowHeight={rowHeight}
        overscan={virtualOptions.overscan ?? 10}
        scrollElement={scrollElement}
        renderRow={renderRow}
      />
    )
  } else {
    body = renderRows()
  }

  // TanStack's default title for a column that sets none; a display column with it has no title.
  const defaultHeader = table.getDefaultColumnDef().header
  // A leaf column under a group header row is drawn once, spanning the rows above it, as the visual target does.
  const leafHeaders = new Map(headerGroups[headerGroups.length - 1]?.headers.map((header) => [header.column.id, header]))
  const spanned = new Set<string>()
  const renderHead = (header: Header<DataTableFeatures, TData, unknown>, rowSpan?: number) => {
    const untitled =
      !header.subHeaders.length &&
      !header.column.accessorFn &&
      (header.column.columnDef.header == null || header.column.columnDef.header === defaultHeader)
    if (untitled) {
      // A column without a title (selection, expansion, actions) has an empty cell, not an empty header.
      return (
        <td
          key={header.id}
          rowSpan={rowSpan}
          data-slot="data-table-head"
          style={pinnedStyle(header.column, false)}
          className={cn(HEAD_EDGE, "px-3.5 py-2 align-middle", PAD, pinnedClass(header.column), header.column.columnDef.meta?.headerClassName)}
        />
      )
    }
    return (
      <DataTableColumnHeader
        key={header.id}
        header={header}
        rowSpan={rowSpan}
        reorderable={columnOrdering}
        // The last column takes the width left over, as in the visual target's fit mode, so it has no handle.
        resizable={header.column.id !== lastColumnId}
      />
    )
  }

  // Skeleton rows are hidden from assistive technology; an empty table has its one message row.
  const bodyRowCount = loadingMode === "skeleton" ? 0 : rows.length || 1
  const footerGroups = hasFooter
    ? table.getFooterGroups().filter((group) => group.headers.some((header) => !header.isPlaceholder && header.column.columnDef.footer !== undefined))
    : []

  const showToolbar = globalFiltering || Boolean(columnVisibility) || Boolean(exportCsv) || toolbar != null
  const paginationOptions = typeof pagination === "object" ? pagination : {}

  const tableElement = (
    <table
      data-slot="data-table-table"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-busy={loading ? true : undefined}
      // Every row a screen reader can reach: the header rows, the body rows (or the empty row) and the footer rows.
      aria-rowcount={virtualOn ? headerRowCount + bodyRowCount + footerGroups.length : undefined}
      // Sized columns: at least the box's width, wider when the columns need it (the table then scrolls).
      style={options.columnResizing ? { width: `max(100%, ${table.getTotalSize()}px)` } : undefined}
      className={cn(
        "w-full caption-bottom border-separate border-spacing-0 text-sm/normal",
        sized && "table-fixed",
        gridlines && "border-s border-t border-border dark:border-muted"
      )}
    >
      {caption != null ? <TableCaption data-slot="data-table-caption">{caption}</TableCaption> : null}
      {sized ? (
        // Fixed widths for every column but the last, which takes the rest; a colgroup, as header rows can span.
        <colgroup>
          {visibleColumns.map((column) => (
            <col key={column.id} style={column.id === lastColumnId ? undefined : { width: column.getSize() }} />
          ))}
        </colgroup>
      ) : null}
      <thead data-slot="data-table-header" className={cn(stickyHeader && "sticky top-0 z-3")}>
        {headerGroups.map((group, groupIndex) => (
          <tr key={group.id} data-slot="data-table-header-row" aria-rowindex={virtualOn ? groupIndex + 1 : undefined}>
            {group.headers.map((header) => {
              if (header.isPlaceholder) {
                if (spanned.has(header.column.id)) return null
                spanned.add(header.column.id)
                return renderHead(leafHeaders.get(header.column.id) ?? header, headerGroups.length - groupIndex)
              }
              if (spanned.has(header.column.id)) return null
              return renderHead(header)
            })}
          </tr>
        ))}
        {columnFiltering ? (
          <tr data-slot="data-table-filter-row" aria-rowindex={virtualOn ? headerGroups.length + 1 : undefined}>
            {visibleColumns.map((column) => (
              <td
                key={column.id}
                style={pinnedStyle(column, false)}
                className={cn(HEAD_EDGE, "px-3.5 py-2 align-middle", PAD, pinnedClass(column))}
              >
                {column.accessorFn && column.getCanFilter() ? <DataTableColumnFilter column={column} /> : null}
              </td>
            ))}
          </tr>
        ) : null}
      </thead>
      <tbody data-slot="data-table-body">{body}</tbody>
      {footerGroups.length ? (
        <tfoot data-slot="data-table-footer">
          {footerGroups.map((group, groupIndex) => (
            <tr key={group.id} aria-rowindex={virtualOn ? headerRowCount + bodyRowCount + groupIndex + 1 : undefined} className="bg-card">
              {group.headers.map((header) => (
                <TableCell
                  key={header.id}
                  colSpan={header.colSpan > 1 ? header.colSpan : undefined}
                  className={cn(EDGE, PAD, "font-semibold", alignClass(header.column.columnDef.meta?.align))}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                </TableCell>
              ))}
            </tr>
          ))}
        </tfoot>
      ) : null}
    </table>
  )

  return (
    <div
      data-slot="data-table"
      data-size={resolvedSize}
      data-gridlines={gridlines || undefined}
      data-striped={striped || undefined}
      className={cn("group/data-table flex w-full min-w-0 flex-col text-foreground", className)}
    >
      {showToolbar ? (
        <DataTableToolbar table={table} search={globalFiltering} columnsMenu={Boolean(columnVisibility)} exportCsv={exportCsv}>
          {toolbar}
        </DataTableToolbar>
      ) : null}
      <div className="relative">
        <div
          ref={containerRef}
          tabIndex={tabIndex}
          data-slot="data-table-container"
          className="relative w-full overflow-auto"
          style={maxHeight != null ? { maxHeight } : undefined}
        >
          {reorderLayer && reorderable ? (
            <reorderLayer.Root
              ids={sortableIds}
              disabled={reorderLocked}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDragCancel={onDragCancel}
            >
              {/* The layer is this table's: a table nested in a sub-row does not take it. */}
              <DataTableReorderLayerContext.Provider value={null}>{tableElement}</DataTableReorderLayerContext.Provider>
            </reorderLayer.Root>
          ) : (
            tableElement
          )}
        </div>
        {loadingMode === "overlay" ? (
          <div data-slot="data-table-loading" className="absolute inset-0 z-4 flex items-center justify-center bg-card/50">
            <div className="flex flex-col items-center gap-2">
              <Spinner className="size-10 text-primary" />
              <span aria-hidden="true" className="text-sm/normal text-secondary-foreground">
                {strings.loading}
              </span>
            </div>
          </div>
        ) : null}
      </div>
      {pagination ? (
        <DataTablePagination
          table={table}
          pageSizes={paginationOptions.pageSizes}
          range={paginationOptions.range}
          showEdges={paginationOptions.showEdges}
        />
      ) : null}
      <div role="status" data-slot="data-table-status" className="sr-only">
        {loadingMode === "skeleton" ? (
          strings.loading
        ) : reorderMessage.text && reorderMessage.over === announcement ? (
          <span key={reorderMessage.id}>{reorderMessage.text}</span>
        ) : (
          announcement
        )}
      </div>
    </div>
  )
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTableToolbar,
  DataTablePagination,
  DataTableRowActions,
  useDataTable,
  createDataTableColumnHelper,
  exportToCsv,
  downloadCsv,
  type DataTableProps,
  type UseDataTableOptions,
  type DataTableColumnDef,
  type DataTableColumnMeta,
  type DataTableMeta,
  type DataTableOption,
  type DataTableFeatures,
  type DataTableInstance,
  type DataTableRow,
  type DataTableState,
  type DataTableCellEdit,
  type DataTableRowMove,
  type ExportToCsvOptions,
}
