"use client"

// The seam between `DataTable` and its row-reorder layer (`@booleanpress/ui/data-table-reorder`): the table draws the
// layer it finds here, so the table's own entry never imports dnd kit. The table keeps the handle's look, the
// announcements and the new order; the layer moves the rows.

import * as React from "react"

/** What the reorder layer wraps round the table. */
export interface DataTableReorderRootProps {
  children: React.ReactNode
  /** The ids of the rows that move, in the order shown. */
  ids: string[]
  /** The handles rest: the order shown is not the data's. */
  disabled: boolean
  onDragStart: (id: string) => void
  /** The dragged row is over the row `overId`. */
  onDragOver: (id: string, overId: string) => void
  /** The row is dropped over the row `overId`, or over none. */
  onDragEnd: (id: string, overId: string | null) => void
  onDragCancel: (id: string) => void
}

/** A top-level row, drawn by the layer so it can move. */
export interface DataTableReorderRowProps extends React.ComponentProps<"tr"> {
  id: string
  disabled: boolean
}

export interface DataTableReorderLayer {
  Root: React.ComponentType<DataTableReorderRootProps>
  Row: React.ComponentType<DataTableReorderRowProps>
}

/** What a movable row hands its drag handle: the props that start a drag, the handle's ref, and whether it rests. */
export interface DataTableReorderHandle {
  props: Record<string, unknown>
  attach: (node: HTMLElement | null) => void
  disabled: boolean
}

export const DataTableReorderLayerContext = React.createContext<DataTableReorderLayer | null>(null)

export const DataTableReorderHandleContext = React.createContext<DataTableReorderHandle | null>(null)
