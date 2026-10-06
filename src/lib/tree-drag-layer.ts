"use client"

// The seam between `Tree` and its pointer-drag layer (`@booleanpress/ui/tree-drag`): the tree draws the layer it finds
// here, so the tree's own entry never imports dnd kit.

import * as React from "react"

type TreeDragPosition = "before" | "after" | "inside"

/** What the drag layer wraps round the tree's list. */
export interface TreeDragRootProps {
  children: React.ReactNode
  /** Every loaded node by id, with its parent's id: for the drop position and the preview. */
  index: ReadonlyMap<string, { node: { label: string; icon?: React.ReactNode; leaf?: boolean }; parentId: string | null }>
  onNodeMove: (move: { id: string; targetId: string; position: TreeDragPosition }) => void
  /** Whether a node can take another inside it (not a leaf, nor a lazy node whose children have not loaded). */
  canNest?: (id: string) => boolean
}

/** A node's row, drawn by the drag layer so it can be dragged and dropped on. */
export interface TreeDragContentProps extends React.ComponentProps<"div"> {
  nodeId: string
  disabled: boolean
}

export interface TreeDragLayer {
  Root: React.ComponentType<TreeDragRootProps>
  Content: React.ComponentType<TreeDragContentProps>
}

export const TreeDragLayerContext = React.createContext<TreeDragLayer | null>(null)
