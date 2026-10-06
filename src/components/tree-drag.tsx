"use client"

// DraggableTree: the Tree with pointer dragging as well, built on @dnd-kit/core. A separate entry, so only an app that
// drags nodes installs dnd kit; the keyboard moves (Alt and the arrows) are the Tree's own.

import * as React from "react"
import { createPortal } from "react-dom"
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  pointerWithin,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core"

import { Tree, type TreeMove, type TreeProps } from "@/components/tree"
import {
  TreeDragLayerContext,
  type TreeDragContentProps,
  type TreeDragLayer,
  type TreeDragRootProps,
} from "@/lib/tree-drag-layer"

type Drop = { id: string; position: TreeMove["position"] }

const noSubscription = () => () => {}

const DragStateContext = React.createContext<{ dragId: string | null; drop: Drop | null }>({ dragId: null, drop: null })

// Wraps the tree's list: the drag context, the drop position under the pointer, and the preview that follows it.
function TreeDragRoot({ children, index, onNodeMove, canNest }: TreeDragRootProps) {
  const [dragId, setDragId] = React.useState<string | null>(null)
  const [drop, setDrop] = React.useState<Drop | null>(null)
  // The pointer's height and the row under it, from the latest collision check. dnd-kit hands `onDragMove` the row of
  // the move before, so the drop position is worked out from these instead.
  const pointerY = React.useRef(0)
  const under = React.useRef<{ id: string; top: number; height: number } | null>(null)
  // A mouse drags after 4px; a finger after a 250ms press, so a swipe over the tree still scrolls the page.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  )

  const collision: CollisionDetection = (args) => {
    const hits = pointerWithin(args)
    if (args.pointerCoordinates) pointerY.current = args.pointerCoordinates.y
    const rect = hits[0] ? args.droppableRects.get(hits[0].id) : undefined
    under.current = hits[0] && rect ? { id: String(hits[0].id), top: rect.top, height: rect.height } : null
    return hits
  }

  // Escape while dragging cancels the drag (dnd kit listens on the document as the key bubbles). Inside a Dialog, Sheet or
  // Popover, Radix would dismiss the layer first, on the way down; marking the key handled stops that, and dnd kit still
  // sees it.
  React.useEffect(() => {
    if (dragId === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [dragId])

  const onDragStart = (event: DragStartEvent) => setDragId(String(event.active.id))
  const onDragMove = (event: DragMoveEvent) => {
    const over = under.current
    const activeId = String(event.active.id)
    if (!over) {
      if (drop) setDrop(null)
      return
    }
    const targetId = over.id
    let inside = false
    for (let id: string | null = targetId; id; id = index.get(id)?.parentId ?? null) if (id === activeId) inside = true
    if (inside) {
      if (drop) setDrop(null)
      return
    }
    const target = index.get(targetId)?.node
    const ratio = (pointerY.current - over.top) / Math.max(over.height, 1)
    // The top or bottom quarter of a row puts the node before or after it, the middle inside; a node that cannot take
    // children (a leaf, or a lazy node not loaded yet) takes halves.
    const nests = canNest ? canNest(targetId) : !target?.leaf
    const position: TreeMove["position"] = !nests
      ? ratio < 0.5
        ? "before"
        : "after"
      : ratio < 0.25
        ? "before"
        : ratio > 0.75
          ? "after"
          : "inside"
    if (drop?.id !== targetId || drop.position !== position) setDrop({ id: targetId, position })
  }
  const onDragEnd = (event: DragEndEvent) => {
    if (drop) onNodeMove({ id: String(event.active.id), targetId: drop.id, position: drop.position })
    setDragId(null)
    setDrop(null)
  }
  const onDragCancel = () => {
    setDragId(null)
    setDrop(null)
  }

  const dragNode = dragId !== null ? index.get(dragId)?.node : undefined
  // The preview is drawn on the body once hydrated: a transformed ancestor (a dialog) would shift its fixed place.
  const hydrated = React.useSyncExternalStore(noSubscription, () => true, () => false)
  const state = React.useMemo(() => ({ dragId, drop }), [dragId, drop])

  return (
    <DragStateContext.Provider value={state}>
      <DndContext
        sensors={sensors}
        collisionDetection={collision}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        // Keyboard moves are the tree's own (Alt and the arrows), so dnd-kit's pick-up instructions and its English
        // announcements are left out.
        accessibility={{
          screenReaderInstructions: { draggable: "" },
          announcements: {
            onDragStart: () => undefined,
            onDragMove: () => undefined,
            onDragOver: () => undefined,
            onDragEnd: () => undefined,
            onDragCancel: () => undefined,
          },
        }}
      >
        {children}
        {hydrated
          ? createPortal(
              <DragOverlay dropAnimation={null}>
                {dragNode ? (
                  <div
                    data-slot="tree-drag-preview"
                    className="flex w-fit cursor-grabbing items-center gap-1.5 rounded-md bg-card px-2 py-1 text-sm/normal text-foreground shadow-md [&_svg]:size-3.5"
                  >
                    {dragNode.icon}
                    {dragNode.label}
                  </div>
                ) : null}
              </DragOverlay>,
              document.body
            )
          : null}
      </DndContext>
    </DragStateContext.Provider>
  )
}

// A node's row: draggable, a drop target, and marked while it is dragged (`data-dragging`) or dropped on (`data-drop`),
// which the Tree's row styles draw.
function TreeDragContent({ nodeId, disabled, ...props }: TreeDragContentProps) {
  const { dragId, drop } = React.useContext(DragStateContext)
  const { setNodeRef: setDragRef, listeners } = useDraggable({ id: nodeId, disabled })
  const { setNodeRef: setDropRef } = useDroppable({ id: nodeId })
  const setRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      setDragRef(element)
      setDropRef(element)
    },
    [setDragRef, setDropRef]
  )
  return (
    <div
      ref={setRef}
      data-slot="tree-node-content"
      data-dragging={dragId === nodeId || undefined}
      data-drop={drop?.id === nodeId ? drop.position : undefined}
      {...props}
      {...listeners}
    />
  )
}

const layer: TreeDragLayer = { Root: TreeDragRoot, Content: TreeDragContent }

/**
 * Props of `DraggableTree`: the Tree's, with `onNodeMove` required.
 *
 * @since 0.1.1
 */
interface DraggableTreeProps<TData = unknown> extends TreeProps<TData> {
  /** Called with each move, by pointer or by Alt and the arrow keys. Apply it with `moveTreeNode`. */
  onNodeMove: (move: TreeMove) => void
}

/**
 * A `Tree` whose nodes can also be dragged with a pointer, before, after or into another node. Takes every prop of
 * `Tree`; needs `@dnd-kit/core`.
 *
 * @since 0.1.1
 */
function DraggableTree<TData = unknown>(props: DraggableTreeProps<TData>) {
  return (
    <TreeDragLayerContext.Provider value={layer}>
      <Tree {...props} />
    </TreeDragLayerContext.Provider>
  )
}

export { DraggableTree }
export type { DraggableTreeProps }
