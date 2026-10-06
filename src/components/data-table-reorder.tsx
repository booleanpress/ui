"use client"

// ReorderableDataTable: the DataTable with rows that move by a drag handle, by pointer or keyboard, built on
// @dnd-kit/core and @dnd-kit/sortable. A separate entry, so only an app that reorders rows installs dnd kit.

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Modifier,
} from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { RowData } from "@tanstack/react-table"

import { DataTable, type DataTableProps, type DataTableRowMove } from "@/components/data-table"
import {
  DataTableReorderHandleContext,
  DataTableReorderLayerContext,
  type DataTableReorderLayer,
  type DataTableReorderRootProps,
  type DataTableReorderRowProps,
} from "@/lib/data-table-reorder-layer"

/** A dragged row moves up and down only. */
const restrictToVerticalAxis: Modifier = ({ transform }) => ({ ...transform, x: 0 })

// The live region is the table's own; dnd-kit's English announcements and instructions are left out.
const SILENT = () => undefined
const DND_ACCESSIBILITY = {
  announcements: { onDragStart: SILENT, onDragOver: SILENT, onDragEnd: SILENT, onDragCancel: SILENT },
  screenReaderInstructions: { draggable: "" },
}

// The page's top-level rows as one sortable list, moved by pointer (4 px to start) or keyboard.
function DataTableReorderRoot({ children, ids, disabled, onDragStart, onDragOver, onDragEnd, onDragCancel }: DataTableReorderRootProps) {
  const dndId = React.useId()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  // While a row moves, Escape puts it back and does nothing else. A dialog, sheet or popover round the table listens for
  // Escape before dnd kit does and closes unless the key's default action is prevented, so it is prevented first, on
  // the window; dnd kit still receives the key and cancels the move.
  const dragging = React.useRef(false)
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (dragging.current && event.key === "Escape") event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [])

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      accessibility={DND_ACCESSIBILITY}
      onDragStart={({ active }: DragStartEvent) => {
        dragging.current = true
        onDragStart(String(active.id))
      }}
      onDragOver={({ active, over }: DragOverEvent) => {
        if (over) onDragOver(String(active.id), String(over.id))
      }}
      onDragEnd={({ active, over }: DragEndEvent) => {
        dragging.current = false
        onDragEnd(String(active.id), over ? String(over.id) : null)
      }}
      onDragCancel={({ active }) => {
        dragging.current = false
        onDragCancel(String(active.id))
      }}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy} disabled={disabled}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

// A row that moves with the sortable list: the row follows the drag, its handle starts it.
function DataTableReorderRow({ id, disabled, style, children, ...props }: DataTableReorderRowProps) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })
  const handle = React.useMemo(
    () => ({ props: { ...attributes, ...listeners }, attach: setActivatorNodeRef, disabled }),
    [attributes, listeners, setActivatorNodeRef, disabled]
  )

  return (
    <DataTableReorderHandleContext.Provider value={handle}>
      <tr
        ref={setNodeRef}
        data-dragging={isDragging || undefined}
        style={{ ...style, transform: transform ? `translate3d(0, ${Math.round(transform.y)}px, 0)` : undefined, transition }}
        {...props}
      >
        {children}
      </tr>
    </DataTableReorderHandleContext.Provider>
  )
}

const layer: DataTableReorderLayer = { Root: DataTableReorderRoot, Row: DataTableReorderRow }

/**
 * Props of `ReorderableDataTable`: the DataTable's, with `onRowOrderChange` required.
 *
 * @since 0.1.0
 */
interface ReorderableDataTableProps<TData extends RowData> extends Omit<DataTableProps<TData>, "rowReordering"> {
  /** Called with `data` in its new order when a row is dropped in a new place; pass it back as `data`. */
  onRowOrderChange: (data: TData[], move: DataTableRowMove) => void
}

/**
 * A `DataTable` whose rows move by a drag handle at the start of each row: by pointer, or by keyboard (Space picks a
 * row up, the arrows move it, Space drops it, Escape puts it back), each step announced in the table's live region.
 * Takes every prop of `DataTable`; rows keep the order of `data`, so the handles rest while the table is sorted,
 * grouped or virtual. Needs `@dnd-kit/core` and `@dnd-kit/sortable`.
 *
 * @since 0.1.0
 */
function ReorderableDataTable<TData extends RowData>(props: ReorderableDataTableProps<TData>) {
  return (
    <DataTableReorderLayerContext.Provider value={layer}>
      <DataTable {...props} rowReordering />
    </DataTableReorderLayerContext.Provider>
  )
}

export { ReorderableDataTable }
export type { ReorderableDataTableProps }
