"use client"

// Built on plain elements, to the APG listbox pattern: a list people put in order with the Move buttons, Alt and the
// arrow keys, or by dragging with a mouse, a finger or the keyboard through @dnd-kit/core and @dnd-kit/sortable.

import * as React from "react"
import { createPortal } from "react-dom"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
  type Active,
  type DragEndEvent,
  type DragMoveEvent,
  type DragOverEvent,
  type DragStartEvent,
  type Over,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, ChevronsDownIcon, ChevronsUpIcon, GripVerticalIcon, SearchIcon } from "lucide-react"

import { cn, fillString } from "@/lib/utils"
import { Button } from "@/components/button"
import { Checkbox } from "@/components/checkbox"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/input-group"
import { useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

/**
 * A move of the chosen items: one place up or down, or to the top or the bottom of the list.
 *
 * @since 0.1.0
 */
export type OrderListMove = "up" | "down" | "top" | "bottom"

/**
 * What `renderItem` is told about the item it draws.
 *
 * @since 0.1.0
 */
export interface OrderListItemState {
  /** The item's position in the whole list, from 0. */
  index: number
  /** The item is chosen. */
  selected: boolean
  /** True on the copy that follows the pointer while the item is dragged. */
  dragging: boolean
}

/**
 * Props of `OrderList`.
 *
 * @since 0.1.0
 */
export interface OrderListProps<T> extends Omit<React.ComponentProps<"div">, "children" | "defaultValue" | "onChange"> {
  /** The items in their order, when you control it. Pair it with `onValueChange`. */
  value?: readonly T[]
  /** The items in the order they start in, when the list controls itself. */
  defaultValue?: readonly T[]
  /** Called with the items in their new order after every move. */
  onValueChange?: (value: T[]) => void
  /** A stable, unique key for an item. Defaults to the item itself for strings, else its `id`, then its `value`. */
  getItemKey?: (item: T) => string
  /**
   * The item's text: what type-ahead and the filter match and what the announcements say. Defaults to the item itself
   * for strings, else its `label`, `name` or `title`.
   */
  getItemLabel?: (item: T) => string
  /** Draws an item's content. Defaults to its label. */
  renderItem?: (item: T, state: OrderListItemState) => React.ReactNode
  /** The chosen items' keys, when you control them. */
  selected?: string[]
  /** The items chosen at first, when the list controls them. */
  defaultSelected?: string[]
  /** Called with the chosen items' keys, in list order. */
  onSelectedChange?: (selected: string[]) => void
  /** A title above the list that names it. */
  header?: React.ReactNode
  /** Where the Move buttons sit: before the list (default), after it, or nowhere. */
  controls?: "start" | "end" | "none"
  /** Lets people drag items to a new place, with a mouse, a finger (press and hold) or the keyboard (Enter). */
  draggable?: boolean
  /** With `draggable`, shows a grip at the start of each item; only the grip starts a pointer drag. */
  dragHandle?: boolean
  /** Shows a field above the list that keeps the items whose label contains its text. */
  filter?: boolean
  /** The filter's text, when you control it. */
  filterValue?: string
  /** Called with the filter's text as it is typed. */
  onFilterValueChange?: (value: string) => void
  /** The filter field's placeholder. */
  filterPlaceholder?: string
  /** `checkbox` draws a checkbox on every item, ticked once chosen; a click then toggles an item. */
  indicator?: "none" | "checkbox"
  /** Shows a "Select all" checkbox above the list that chooses every item in view, or none. */
  selectAll?: boolean
  /** What the list says when it has no items. Defaults to the provider's `noItems` string. */
  empty?: React.ReactNode
  /** Greys the list and its buttons, keeps the order, and takes the list out of the tab order. */
  disabled?: boolean
  /** Classes for the scrolling list inside the frame, such as a height (`h-60`) or a maximum height. */
  listClassName?: string
}

type Listener = (event: React.SyntheticEvent) => void

/** What each list tells its group, read when a drag starts, moves and ends. */
interface ListRegistration {
  items: readonly unknown[]
  visibleKeys: readonly string[]
  getKey: (item: unknown) => string
  getLabel: (item: unknown) => string
  commit: (items: unknown[]) => void
  renderOverlay: (key: string) => React.ReactNode
  reveal: (key: string, focus: boolean) => void
}

interface DragTarget {
  listId: string
  key: string
}

/** Where a dragged item would land in another list: before or after an item, or (key `null`) at its end. */
interface DropPlacement {
  listId: string
  key: string | null
  side: "before" | "after"
}

interface GroupValue {
  register: (id: string, registration: React.RefObject<ListRegistration | null>) => () => void
  announce: (message: string) => void
  dragging: DragTarget | null
  drop: DropPlacement | null
  /** More than one list shares the group, so items can be dropped from one into another. */
  shared: boolean
}

const OrderListGroupContext = React.createContext<GroupValue | null>(null)

function defaultItemKey(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") return String(item)
  const record = item as { id?: unknown; value?: unknown }
  return String(record.id ?? record.value)
}

function defaultItemLabel(item: unknown): string {
  if (typeof item === "string" || typeof item === "number") return String(item)
  const record = item as { label?: unknown; name?: unknown; title?: unknown }
  return String(record.label ?? record.name ?? record.title ?? defaultItemKey(item))
}

/**
 * Moves the items whose keys are given one place up or down, or to the top or the bottom, keeping their order among
 * themselves; an item already against the end stays. Returns a new array. `getItemKey` defaults to the item itself for
 * strings, else its `id`, then its `value`.
 *
 * @since 0.1.0
 */
export function moveItems<T>(
  items: readonly T[],
  keys: readonly string[],
  move: OrderListMove,
  getItemKey: (item: T) => string = defaultItemKey
): T[] {
  const chosen = new Set(keys)
  const isChosen = (item: T) => chosen.has(getItemKey(item))
  if (move === "top") return [...items.filter(isChosen), ...items.filter((item) => !isChosen(item))]
  if (move === "bottom") return [...items.filter((item) => !isChosen(item)), ...items.filter(isChosen)]
  const next = [...items]
  if (move === "up") {
    for (let i = 1; i < next.length; i++) {
      if (isChosen(next[i]) && !isChosen(next[i - 1])) [next[i - 1], next[i]] = [next[i], next[i - 1]]
    }
  } else {
    for (let i = next.length - 2; i >= 0; i--) {
      if (isChosen(next[i]) && !isChosen(next[i + 1])) [next[i], next[i + 1]] = [next[i + 1], next[i]]
    }
  }
  return next
}

/** Gives the items in view a new order and leaves the ones the filter hides in their places. */
function withVisibleOrder<T>(
  items: readonly T[],
  getKey: (item: T) => string,
  visibleKeys: readonly string[],
  nextVisible: readonly T[]
): T[] {
  const visible = new Set(visibleKeys)
  let i = 0
  return items.map((item) => (visible.has(getKey(item)) ? nextVisible[i++] : item))
}

/**
 * The ids of the sortable items, the same array while the items in view stay the same: dnd kit works per item from it,
 * so a new array on every render would make each move of the highlight cost the square of the list's length.
 */
function useSortableIds(listId: string, keys: readonly string[]) {
  const signature = `${listId}|${JSON.stringify(keys)}`
  const [cache, setCache] = React.useState(() => ({ signature, ids: keys.map((key) => `${listId}|${key}`) }))
  if (cache.signature === signature) return cache.ids
  const next = { signature, ids: keys.map((key) => `${listId}|${key}`) }
  setCache(next)
  return next.ids
}

function useControllableState<V>(prop: V | undefined, defaultValue: V, onChange?: (value: V) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = prop !== undefined
  const value = controlled ? prop : inner
  const latest = React.useRef(value)
  React.useLayoutEffect(() => {
    latest.current = value
  })
  const setValue = React.useCallback(
    (next: V) => {
      latest.current = next
      if (!controlled) setInner(next)
      onChange?.(next)
    },
    [controlled, onChange]
  )
  return [value, setValue] as const
}

// Enter picks the highlighted item up (Space toggles the choice in a listbox); the arrows move it; Space, Enter or Tab
// drops it; Escape puts it back.
const KEYBOARD_CODES = { start: ["Enter"], cancel: ["Escape"], end: ["Space", "Enter", "Tab"] }
// The sensors' options are constants: dnd kit rebuilds its activators when an options object is new, which redraws every
// item. A mouse drag starts after 4px, so a click still chooses; a finger presses and holds, so the list still scrolls.
const MOUSE_OPTIONS = { activationConstraint: { distance: 4 } }
const TOUCH_OPTIONS = { activationConstraint: { delay: 250, tolerance: 5 } }
const KEYBOARD_OPTIONS = { coordinateGetter: sortableKeyboardCoordinates, keyboardCodes: KEYBOARD_CODES }
const SILENT = () => undefined
const NO_KEYS: readonly string[] = []
const noSubscription = () => () => undefined
// The announcements are the group's own, from the provider's strings, in its polite live region; dnd kit's English
// ones and its pick-up instructions are left out.
const DND_ACCESSIBILITY = {
  announcements: { onDragStart: SILENT, onDragOver: SILENT, onDragEnd: SILENT, onDragCancel: SILENT },
  screenReaderInstructions: { draggable: "" },
  restoreFocus: false,
}

/**
 * Wraps several `OrderList`s so items can be dragged from one into another, as `PickList` does; each list keeps its
 * own value. An `OrderList` on its own needs no group.
 *
 * @since 0.1.0
 */
function OrderListGroup({ children }: { children?: React.ReactNode }) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const lists = React.useRef(new Map<string, React.RefObject<ListRegistration | null>>())
  const [listCount, setListCount] = React.useState(0)
  const [message, setMessage] = React.useState({ text: "", id: 0 })
  const [dragging, setDragging] = React.useState<(DragTarget & { overlay: React.ReactNode }) | null>(null)
  const [drop, setDrop] = React.useState<DropPlacement | null>(null)
  // The item the dragged one was last over, so each new place is read out once, its own place included.
  const lastOver = React.useRef<string | number | null>(null)
  // The dragged copy is drawn on the body once hydrated: a transformed ancestor (a dialog) would shift its fixed place.
  const hydrated = React.useSyncExternalStore(noSubscription, () => true, () => false)
  const sensors = useSensors(
    useSensor(MouseSensor, MOUSE_OPTIONS),
    useSensor(TouchSensor, TOUCH_OPTIONS),
    useSensor(KeyboardSensor, KEYBOARD_OPTIONS)
  )

  const register = React.useCallback((id: string, registration: React.RefObject<ListRegistration | null>) => {
    lists.current.set(id, registration)
    setListCount(lists.current.size)
    return () => {
      lists.current.delete(id)
      setListCount(lists.current.size)
    }
  }, [])
  const announce = React.useCallback((text: string) => setMessage((previous) => ({ text, id: previous.id + 1 })), [])

  const number = (value: number) => new Intl.NumberFormat(locale).format(value)
  const lookup = (data: unknown) => {
    const target = data as { listId?: string; key?: string } | undefined
    const registration = target?.listId ? lists.current.get(target.listId)?.current : null
    return registration && target?.listId ? { registration, listId: target.listId, key: target.key ?? null } : null
  }
  const indexIn = (registration: ListRegistration, key: string) =>
    registration.items.findIndex((item) => registration.getKey(item) === key)
  const labelIn = (registration: ListRegistration, key: string) => {
    const item = registration.items.find((entry) => registration.getKey(entry) === key)
    return item === undefined ? key : registration.getLabel(item)
  }
  const moved = (item: string, position: number, total: number) =>
    announce(fillString(strings.itemMoved, { item, position: number(position), total: number(total) }))

  // Into another list the item lands before or after the item under its middle, or at the end over an empty part.
  const placement = (active: Active, over: Over | null): DropPlacement | null => {
    const from = lookup(active.data.current)
    const to = over ? lookup(over.data.current) : null
    if (!over || !from || !to || from.listId === to.listId) return null
    if (to.key === null) return { listId: to.listId, key: null, side: "after" }
    const rect = active.rect.current.translated
    const below = rect ? rect.top + rect.height / 2 > over.rect.top + over.rect.height / 2 : false
    return { listId: to.listId, key: to.key, side: below ? "after" : "before" }
  }
  const showPlacement = (next: DropPlacement | null) =>
    setDrop((previous) =>
      previous?.listId === next?.listId && previous?.key === next?.key && previous?.side === next?.side ? previous : next
    )

  const onDragStart = ({ active }: DragStartEvent) => {
    const from = lookup(active.data.current)
    if (!from || from.key === null) return
    lastOver.current = active.id
    setDragging({ listId: from.listId, key: from.key, overlay: from.registration.renderOverlay(from.key) })
    announce(
      fillString(strings.dragStarted, {
        item: labelIn(from.registration, from.key),
        position: number(indexIn(from.registration, from.key) + 1),
        total: number(from.registration.items.length),
      })
    )
  }

  const onDragMove = ({ active, over }: DragMoveEvent) => showPlacement(placement(active, over))

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const next = placement(active, over)
    showPlacement(next)
    const from = lookup(active.data.current)
    const to = over ? lookup(over.data.current) : null
    if (!from || from.key === null || !to || !over || over.id === lastOver.current) return
    lastOver.current = over.id
    const item = labelIn(from.registration, from.key)
    if (to.listId === from.listId) {
      if (to.key !== null) moved(item, indexIn(to.registration, to.key) + 1, to.registration.items.length)
      return
    }
    const total = to.registration.items.length + 1
    moved(item, next?.key == null ? total : indexIn(to.registration, next.key) + (next.side === "after" ? 2 : 1), total)
  }

  const onDragEnd = ({ active, over, activatorEvent }: DragEndEvent) => {
    const where = placement(active, over)
    setDragging(null)
    setDrop(null)
    const from = lookup(active.data.current)
    if (!from || from.key === null) return
    const key = from.key
    const source = from.registration
    const to = over ? lookup(over.data.current) : null
    if (!to) {
      announce(
        fillString(strings.dragCancelled, {
          item: labelIn(source, key),
          position: number(indexIn(source, key) + 1),
          total: number(source.items.length),
        })
      )
      return
    }
    const item = source.items.find((entry) => source.getKey(entry) === key)
    if (to.listId === from.listId) {
      const visible = source.visibleKeys
      const oldIndex = visible.indexOf(key)
      const newIndex = to.key === null ? oldIndex : visible.indexOf(to.key)
      let next = source.items
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        const byKey = new Map(source.items.map((entry) => [source.getKey(entry), entry]))
        const nextVisible = arrayMove([...visible], oldIndex, newIndex).map((k) => byKey.get(k))
        next = withVisibleOrder(source.items, source.getKey, visible, nextVisible)
        source.commit([...next])
      }
      moved(labelIn(source, key), next.findIndex((entry) => source.getKey(entry) === key) + 1, next.length)
      source.reveal(key, false)
      return
    }
    if (item === undefined) return
    const destination = to.registration
    const nextDestination = [...destination.items]
    const at = where?.key == null ? nextDestination.length : indexIn(destination, where.key) + (where.side === "after" ? 1 : 0)
    nextDestination.splice(Math.max(0, at), 0, item)
    source.commit(source.items.filter((entry) => source.getKey(entry) !== key))
    destination.commit(nextDestination)
    moved(source.getLabel(item), Math.max(0, at) + 1, nextDestination.length)
    // A keyboard drag carries the focus with the item into the other list.
    destination.reveal(key, typeof KeyboardEvent !== "undefined" && activatorEvent instanceof KeyboardEvent)
  }

  const onDragCancel = ({ active }: { active: Active }) => {
    setDragging(null)
    setDrop(null)
    const from = lookup(active.data.current)
    if (!from || from.key === null) return
    announce(
      fillString(strings.dragCancelled, {
        item: labelIn(from.registration, from.key),
        position: number(indexIn(from.registration, from.key) + 1),
        total: number(from.registration.items.length),
      })
    )
  }

  const value = React.useMemo<GroupValue>(
    () => ({ register, announce, dragging, drop, shared: listCount > 1 }),
    [register, announce, dragging, drop, listCount]
  )

  // dnd kit puts an item back on Escape from a listener on the document, but a dialog, sheet or popover around the list
  // listens before it (in the capture phase) and would close. While an item is dragged, Escape is marked handled first,
  // on the window, so the layer leaves it to the drag.
  const isDragging = dragging !== null
  React.useEffect(() => {
    if (!isDragging) return
    const claimEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") event.preventDefault()
    }
    window.addEventListener("keydown", claimEscape, true)
    return () => window.removeEventListener("keydown", claimEscape, true)
  }, [isDragging])

  const overlay = <DragOverlay dropAnimation={null}>{dragging?.overlay ?? null}</DragOverlay>

  return (
    <OrderListGroupContext.Provider value={value}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={onDragStart}
        onDragMove={onDragMove}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={DND_ACCESSIBILITY}
      >
        {children}
        {hydrated ? createPortal(overlay, document.body) : null}
      </DndContext>
      {/* Every move is read out here, politely: by the buttons, Alt and the arrows, or a drag. */}
      <div data-slot="order-list-status" role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        <span key={message.id}>{message.text}</span>
      </div>
    </OrderListGroupContext.Provider>
  )
}

/**
 * A list people put in order: they choose one or several items, then move them with the buttons beside it, with Alt
 * and the arrow keys, or by dragging. Name it with `header`, `aria-label` or `aria-labelledby`.
 *
 * @since 0.1.0
 */
function OrderList<T>({
  controls = "start",
  draggable = false,
  dragHandle = false,
  filter = false,
  indicator = "none",
  selectAll = false,
  disabled = false,
  ...props
}: OrderListProps<T>) {
  const inGroup = React.useContext(OrderListGroupContext) !== null
  const list = (
    <OrderListRoot<T>
      data-slot="order-list"
      controls={controls}
      draggable={draggable}
      dragHandle={dragHandle}
      filter={filter}
      indicator={indicator}
      selectAll={selectAll}
      disabled={disabled}
      {...props}
    />
  )
  return inGroup ? list : <OrderListGroup>{list}</OrderListGroup>
}

function OrderListRoot<T>({
  value: valueProp,
  defaultValue,
  onValueChange,
  getItemKey = defaultItemKey,
  getItemLabel = defaultItemLabel,
  renderItem,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  header,
  controls = "start",
  draggable = false,
  dragHandle = false,
  filter = false,
  filterValue: filterValueProp,
  onFilterValueChange,
  filterPlaceholder,
  indicator = "none",
  selectAll = false,
  empty,
  disabled = false,
  listClassName,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "data-slot": slot = "order-list",
  ...props
}: OrderListProps<T> & { "data-slot"?: string }) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const group = React.useContext(OrderListGroupContext)
  if (!group) throw new Error("OrderList must be rendered by OrderList or inside OrderListGroup.")
  const { register, announce } = group

  const [items, setItems] = useControllableState<T[]>(
    valueProp as T[] | undefined,
    defaultValue ? [...defaultValue] : [],
    onValueChange
  )
  const [selected, setSelected] = useControllableState<string[]>(selectedProp, defaultSelected ?? [], onSelectedChange)
  const [query, setQuery] = useControllableState(filterValueProp, "", onFilterValueChange)
  const baseId = React.useId()
  const listId = `${baseId}-list`
  const headerId = `${baseId}-header`
  const emptyId = `${baseId}-empty`
  const optionId = (key: string) => `${baseId}-option-${encodeURIComponent(key)}`
  const listNode = React.useRef<HTMLDivElement | null>(null)
  const [active, setActive] = React.useState<string | null>(null)
  const [focused, setFocused] = React.useState(false)
  const anchor = React.useRef<string | null>(null)
  const typeahead = React.useRef({ text: "", time: 0 })
  const activators = React.useRef(new Map<string, Listener>())

  const keys = items.map(getItemKey)
  const indexOf = new Map(keys.map((key, index) => [key, index]))
  const needle = query.trim().toLocaleLowerCase(locale)
  const visible =
    filter && needle !== "" ? items.filter((item) => getItemLabel(item).toLocaleLowerCase(locale).includes(needle)) : items
  const visibleKeys = visible.map(getItemKey)
  const chosen = new Set(selected.filter((key) => indexOf.has(key)))
  const chosenInView = visibleKeys.filter((key) => chosen.has(key))
  // The highlighted item; while the list has focus and its highlighted item has left (moved away or filtered out), the
  // first chosen item in view takes its place, else the first.
  const current =
    active !== null && visibleKeys.includes(active) ? active : focused ? (chosenInView[0] ?? visibleKeys[0] ?? null) : null
  const dragging = group.dragging !== null
  const canDrag = draggable && !disabled

  // A list that cannot be dragged gives dnd kit no ids: they would change with every move and redraw every item.
  const sortableIds = useSortableIds(listId, canDrag ? visibleKeys : NO_KEYS)

  const latestVisible = React.useRef(visibleKeys)
  React.useLayoutEffect(() => {
    latestVisible.current = visibleKeys
  })

  const number = (value: number) => new Intl.NumberFormat(locale).format(value)
  const inListOrder = (set: Set<string>) => keys.filter((key) => set.has(key))
  const choose = (next: Set<string>) => setSelected(inListOrder(next))

  const highlight = React.useCallback(
    (key: string) => {
      setActive(key)
      document.getElementById(`${baseId}-option-${encodeURIComponent(key)}`)?.scrollIntoView?.({ block: "nearest" })
    },
    [baseId]
  )

  // The group reads the list's latest items and calls back into it when a drag ends.
  const registration = React.useRef<ListRegistration | null>(null)
  React.useLayoutEffect(() => {
    registration.current = {
      items,
      visibleKeys,
      getKey: getItemKey as (item: unknown) => string,
      getLabel: getItemLabel as (item: unknown) => string,
      commit: (next) => {
        const nextItems = next as T[]
        setItems(nextItems)
        const present = new Set(nextItems.map(getItemKey))
        if (selected.some((key) => !present.has(key))) setSelected(selected.filter((key) => present.has(key)))
      },
      renderOverlay: (key) => {
        const item = items.find((entry) => getItemKey(entry) === key)
        if (item === undefined) return null
        return (
          <div
            data-slot="order-list-drag-preview"
            // A picture of the item under the pointer; the live region says where it is.
            aria-hidden="true"
            // The item lifted off the list: the overlay surface with its shadow, the option's padding and type.
            className="flex size-full cursor-grabbing items-center gap-2 rounded-sm bg-popover px-2.5 py-1 text-sm/normal text-popover-foreground shadow-md [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5"
          >
            {dragHandle ? <GripVerticalIcon aria-hidden="true" className="text-muted-foreground" /> : null}
            <span className="flex min-w-0 flex-1 items-center">
              {renderItem ? (
                renderItem(item, { index: indexOf.get(key) ?? 0, selected: false, dragging: true })
              ) : (
                <span className="truncate">{getItemLabel(item)}</span>
              )}
            </span>
          </div>
        )
      },
      reveal: (key, focus) => {
        highlight(key)
        if (focus) listNode.current?.focus()
      },
    }
  })
  React.useEffect(() => register(listId, registration), [register, listId])

  const registerActivator = React.useCallback((key: string, listener: Listener) => {
    activators.current.set(key, listener)
    return () => {
      if (activators.current.get(key) === listener) activators.current.delete(key)
    }
  }, [])

  const { setNodeRef: setDropNode } = useDroppable({
    id: `${listId}|end`,
    data: { listId },
    // Only a list that shares its group takes items dropped on its empty part; its own items are dropped on each other.
    disabled: !canDrag || !group.shared,
  })
  const setListNode = React.useCallback(
    (node: HTMLDivElement | null) => {
      listNode.current = node
      setDropNode(node)
    },
    [setDropNode]
  )

  const announceMove = (next: readonly T[], movedKeys: string[]) => {
    const nextKeys = next.map(getItemKey)
    const first = Math.min(...movedKeys.map((key) => nextKeys.indexOf(key)))
    const total = number(next.length)
    if (movedKeys.length === 1) {
      const item = next[first]
      announce(fillString(strings.itemMoved, { item: getItemLabel(item), position: number(first + 1), total }))
    } else {
      announce(fillString(strings.itemsMoved, { count: number(movedKeys.length), position: number(first + 1), total }))
    }
  }

  const packedAtTop = chosenInView.length > 0 && visibleKeys.slice(0, chosenInView.length).every((key) => chosen.has(key))
  const packedAtBottom = chosenInView.length > 0 && visibleKeys.slice(-chosenInView.length).every((key) => chosen.has(key))
  const canMove = (move: OrderListMove) =>
    !disabled && chosenInView.length > 0 && (move === "up" || move === "top" ? !packedAtTop : !packedAtBottom)

  // The Move buttons move the chosen items in view; Alt and the arrows move the highlighted item when none is chosen.
  const runMove = (move: OrderListMove, fallback: string | null) => {
    if (disabled) return
    const moving = chosenInView.length > 0 ? chosenInView : fallback !== null ? [fallback] : []
    if (moving.length === 0) return
    const byKey = new Map(items.map((item) => [getItemKey(item), item]))
    const nextVisible = moveItems(
      visibleKeys.map((key) => byKey.get(key) as T),
      moving,
      move,
      getItemKey
    )
    const next = withVisibleOrder(items, getItemKey, visibleKeys, nextVisible)
    if (next.some((item, index) => item !== items[index])) setItems(next)
    if (chosenInView.length === 0 && fallback !== null) choose(new Set([fallback]))
    announceMove(next, moving)
    const lead = moving[move === "down" || move === "bottom" ? moving.length - 1 : 0]
    requestAnimationFrame(() => document.getElementById(optionId(lead))?.scrollIntoView?.({ block: "nearest" }))
  }

  const toggle = (key: string) => {
    anchor.current = key
    const next = new Set(chosen)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    choose(next)
  }
  const chooseOnly = (key: string) => {
    anchor.current = key
    choose(new Set([key]))
  }
  const chooseRange = (to: string) => {
    const from = anchor.current !== null && visibleKeys.includes(anchor.current) ? anchor.current : to
    const a = visibleKeys.indexOf(from)
    const b = visibleKeys.indexOf(to)
    anchor.current = from
    choose(new Set(visibleKeys.slice(Math.min(a, b), Math.max(a, b) + 1)))
  }
  const allInView = visibleKeys.length > 0 && visibleKeys.every((key) => chosen.has(key))
  const toggleAll = () => {
    const next = new Set(chosen)
    for (const key of visibleKeys) {
      if (allInView) next.delete(key)
      else next.add(key)
    }
    choose(next)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // While an item is dragged, the keyboard belongs to dnd kit's sensor.
    if (disabled || dragging) return
    const modifier = event.ctrlKey || event.metaKey
    if (event.altKey && !modifier) {
      const move = ({ ArrowUp: "up", ArrowDown: "down", Home: "top", End: "bottom" } as const)[
        event.key as "ArrowUp" | "ArrowDown" | "Home" | "End"
      ]
      if (move) {
        event.preventDefault()
        runMove(move, current)
      }
      return
    }
    if (modifier && !event.altKey && event.key.toLowerCase() === "a") {
      event.preventDefault()
      toggleAll()
      return
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End") {
      if (modifier) return
      event.preventDefault()
      if (visibleKeys.length === 0) return
      const index = current === null ? -1 : visibleKeys.indexOf(current)
      const nextIndex =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? visibleKeys.length - 1
            : index === -1
              ? 0
              : Math.min(visibleKeys.length - 1, Math.max(0, index + (event.key === "ArrowDown" ? 1 : -1)))
      const next = visibleKeys[nextIndex]
      if (event.shiftKey) {
        if (anchor.current === null || !visibleKeys.includes(anchor.current)) anchor.current = current ?? next
        highlight(next)
        chooseRange(next)
      } else {
        highlight(next)
      }
      return
    }
    if (event.key === " " && !modifier) {
      event.preventDefault()
      if (current === null) return
      if (event.shiftKey) chooseRange(current)
      else toggle(current)
      return
    }
    if (event.key === "Enter" && !modifier && !event.shiftKey) {
      // dnd kit's keyboard sensor picks the highlighted item up; it ignores an event already handled, so call it first.
      if (canDrag && current !== null) activators.current.get(current)?.(event)
      return
    }
    // Type-ahead: the letters typed within half a second move to the next item whose label starts with them.
    if (event.key.length === 1 && !modifier && !event.altKey && event.key !== " ") {
      const now = event.timeStamp
      const text = (now - typeahead.current.time < 500 ? typeahead.current.text : "") + event.key.toLocaleLowerCase(locale)
      typeahead.current = { text, time: now }
      const start = Math.max(0, current === null ? 0 : visibleKeys.indexOf(current))
      const shift = text.length === 1 && current !== null ? 1 : 0
      const ordered = [...visible.slice(start + shift), ...visible.slice(0, start + shift)]
      const found = ordered.find((item) => getItemLabel(item).toLocaleLowerCase(locale).startsWith(text))
      if (found !== undefined) highlight(getItemKey(found))
    }
  }

  const onListFocus = () => {
    setFocused(true)
    setActive((previous) => {
      const inView = latestVisible.current
      if (previous !== null && inView.includes(previous)) return previous
      return inView.find((key) => chosen.has(key)) ?? inView[0] ?? null
    })
  }
  const focusList = React.useCallback(() => listNode.current?.focus(), [])

  const onItemClick = (event: React.MouseEvent, key: string) => {
    if (disabled) return
    setActive(key)
    if (event.shiftKey) chooseRange(key)
    else if (event.metaKey || event.ctrlKey || indicator === "checkbox") toggle(key)
    else chooseOnly(key)
  }

  // The items' handlers keep one identity and call the latest render's code, so a memoised item draws again only when
  // its own props change: a key press redraws the two items whose highlight moved, not every item in a long list.
  const itemHandlers = React.useRef<{
    hover: (key: string) => void
    choose: (event: React.MouseEvent, key: string) => void
  } | null>(null)
  React.useLayoutEffect(() => {
    itemHandlers.current = {
      hover: (key) => {
        if (current !== key && !dragging) setActive(key)
      },
      choose: onItemClick,
    }
  })
  const onItemHover = React.useCallback((key: string) => itemHandlers.current?.hover(key), [])
  const onItemChoose = React.useCallback(
    (event: React.MouseEvent, key: string) => itemHandlers.current?.choose(event, key),
    []
  )

  const showEmpty = visible.length === 0
  const emptyText = items.length === 0 ? (empty ?? strings.noItems) : strings.noResults
  const toolbar = filter || (selectAll && indicator === "checkbox")
  const describedBy = [ariaDescribedBy, showEmpty ? emptyId : undefined].filter(Boolean).join(" ") || undefined
  const dropOnList = group.drop !== null && group.drop.listId === listId && group.drop.key === null

  const moveButtons = [
    { move: "top", label: strings.moveToTop, Icon: ChevronsUpIcon },
    { move: "up", label: strings.moveUp, Icon: ChevronUpIcon },
    { move: "down", label: strings.moveDown, Icon: ChevronDownIcon },
    { move: "bottom", label: strings.moveToBottom, Icon: ChevronsDownIcon },
  ] as const
  const controlsNode =
    controls === "none" ? null : (
      <div
        data-slot="order-list-controls"
        // Beside the frame, under the header: four buttons 4px apart, from its top.
        className={cn("flex flex-col gap-1", controls === "start" ? "col-start-1" : "col-start-2", header != null ? "row-start-2" : "row-start-1")}
      >
        {moveButtons.map(({ move, label, Icon }) => {
          const enabled = canMove(move)
          return (
            <Button
              key={move}
              type="button"
              variant="secondary"
              size="icon-sm"
              aria-label={label}
              disabled={disabled}
              // Unavailable moves stay focusable, so the focus is never lost when a move empties a button's work.
              aria-disabled={!enabled || undefined}
              data-slot="order-list-move"
              onClick={() => enabled && runMove(move, null)}
              // The visual target's small secondary icon button: 28px square, a 14px chevron; 60% while unavailable.
              className="aria-disabled:cursor-default aria-disabled:opacity-60 aria-disabled:hover:bg-secondary aria-disabled:hover:text-secondary-foreground aria-disabled:active:bg-secondary"
            >
              <Icon aria-hidden="true" />
            </Button>
          )
        })}
      </div>
    )

  return (
    <div
      data-slot={slot}
      data-controls={controls}
      data-disabled={disabled || undefined}
      // A grid: the header over the frame, the buttons beside the frame 8px away, as in the visual target.
      className={cn(
        "grid min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-x-2 gap-y-1.5",
        controls === "start" ? "grid-cols-[auto_minmax(0,1fr)]" : controls === "end" ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-1",
        header == null && "grid-rows-[minmax(0,1fr)]",
        className
      )}
      {...props}
    >
      {header != null ? (
        // A label's type: 14px medium, 6px above the frame.
        <div
          id={headerId}
          data-slot="order-list-header"
          className={cn("row-start-1 text-sm/normal font-medium text-foreground", controls === "start" ? "col-start-2" : "col-start-1")}
        >
          {header}
        </div>
      ) : null}
      {controlsNode}
      <div
        data-slot="order-list-frame"
        data-disabled={disabled || undefined}
        data-drop-target={dropOnList || undefined}
        // The field look, as Listbox: a solid `--field` fill in a 1px `--control` edge, 6px radius, `--ring` while the
        // list has focus or an item from another list is over it; `--invalid` when invalid; disabled fills
        // `--field-disabled` and mutes its items.
        className={cn(
          header != null ? "row-start-2" : "row-start-1",
          controls === "start" ? "col-start-2" : "col-start-1",
          "group/order-list flex min-h-0 min-w-0 flex-col overflow-hidden rounded-md border border-control bg-field text-sm/normal text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) has-[[role=listbox]:focus-visible]:border-ring has-[[role=listbox][aria-invalid=true]]:border-invalid has-[[role=listbox][aria-invalid=true]:focus-visible]:border-ring data-disabled:bg-field-disabled data-disabled:text-field-disabled-foreground data-drop-target:border-ring"
        )}
      >
        {toolbar ? (
          // The list header of the visual target: 8px 14px 2px around a checkbox and the filter.
          <div data-slot="order-list-toolbar" className="flex shrink-0 items-center gap-2 px-3.5 pt-2 pb-0.5">
            {selectAll && indicator === "checkbox" ? (
              <Checkbox
                id={`${baseId}-select-all`}
                // Beside the filter it is named only for assistive technology; alone, its visible label names it.
                aria-label={filter ? strings.selectAll : undefined}
                aria-controls={listId}
                disabled={disabled || visibleKeys.length === 0}
                checked={allInView ? true : chosenInView.length > 0 ? "indeterminate" : false}
                onCheckedChange={toggleAll}
                data-slot="order-list-select-all"
              />
            ) : null}
            {selectAll && indicator === "checkbox" && !filter ? (
              // boolean-ui patch: without a filter beside it, the checkbox says what it does (a lone box read as a blank row).
              <label htmlFor={`${baseId}-select-all`} className="cursor-pointer select-none text-sm/normal text-foreground">
                {strings.selectAll}
              </label>
            ) : null}
            {filter ? (
              <InputGroup size="default" variant="default" className="flex-1">
                <InputGroupInput
                  type="text"
                  aria-label={strings.filterOptions}
                  aria-controls={listId}
                  placeholder={filterPlaceholder}
                  autoComplete="off"
                  disabled={disabled}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== "ArrowDown") return
                    event.preventDefault()
                    focusList()
                  }}
                  data-slot="order-list-filter"
                />
                <InputGroupAddon align="inline-end">
                  <SearchIcon aria-hidden="true" />
                </InputGroupAddon>
              </InputGroup>
            ) : null}
          </div>
        ) : null}
        <div data-slot="order-list-viewport" className="relative flex min-h-0 flex-auto flex-col">
          <div
            ref={setListNode}
            id={listId}
            role="listbox"
            tabIndex={disabled ? -1 : 0}
            aria-multiselectable="true"
            aria-disabled={disabled || undefined}
            aria-activedescendant={focused && current !== null ? optionId(current) : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy ?? (ariaLabel === undefined && header != null ? headerId : undefined)}
            aria-describedby={describedBy}
            aria-invalid={ariaInvalid}
            data-slot="order-list-list"
            onKeyDown={handleKeyDown}
            onFocus={onListFocus}
            onBlur={() => setFocused(false)}
            // 4px padding and 2px between items, as Listbox; it scrolls past the height `listClassName` gives it.
            className={cn(
              "flex min-h-0 flex-auto flex-col gap-0.5 overflow-y-auto p-1 outline-none",
              showEmpty && "min-h-[2.3125rem]",
              listClassName
            )}
          >
            <SortableContext id={listId} items={sortableIds} strategy={verticalListSortingStrategy}>
              {visible.map((item) => {
                const key = getItemKey(item)
                const index = indexOf.get(key) ?? 0
                const isChosen = chosen.has(key)
                const drop = group.drop !== null && group.drop.listId === listId && group.drop.key === key ? group.drop.side : undefined
                return (
                  <OrderListOption
                    key={key}
                    id={`${listId}|${key}`}
                    itemKey={key}
                    listId={listId}
                    optionId={optionId(key)}
                    label={getItemLabel(item)}
                    selected={isChosen}
                    highlighted={focused && current === key}
                    disabled={disabled}
                    draggable={canDrag}
                    dragHandle={dragHandle}
                    checkbox={indicator === "checkbox"}
                    drop={drop}
                    item={item}
                    // Only `renderItem` is told the index, so without one a move that shifts the items redraws none.
                    index={renderItem ? index : 0}
                    renderItem={renderItem as OptionProps["renderItem"]}
                    registerActivator={registerActivator}
                    onPress={focusList}
                    onHover={onItemHover}
                    onChoose={onItemChoose}
                  />
                )
              })}
            </SortableContext>
          </div>
          {showEmpty ? (
            // Over the empty list rather than in it, since a listbox holds only options; the list takes it as its
            // description.
            <div id={emptyId} data-slot="order-list-empty" className="pointer-events-none absolute inset-x-1 top-1 px-2.5 py-1 text-muted-foreground">
              {emptyText}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

interface OptionProps {
  id: string
  itemKey: string
  listId: string
  optionId: string
  label: string
  selected: boolean
  highlighted: boolean
  disabled: boolean
  draggable: boolean
  dragHandle: boolean
  checkbox: boolean
  drop: "before" | "after" | undefined
  item: unknown
  index: number
  renderItem: ((item: unknown, state: OrderListItemState) => React.ReactNode) | undefined
  registerActivator: (key: string, listener: Listener) => () => void
  onPress: () => void
  onHover: (key: string) => void
  onChoose: (event: React.MouseEvent, key: string) => void
}

// Memoised, with only plain values and stable callbacks for props: a list of thousands redraws only the items that
// change. A `renderItem` written inline in the parent is a new function on each of the parent's renders, so it redraws
// every item then, as it must, since its output may have changed.
const OrderListOption = React.memo(function OrderListOption({
  id,
  itemKey,
  listId,
  optionId,
  label,
  selected,
  highlighted,
  disabled,
  draggable,
  dragHandle,
  checkbox,
  drop,
  item,
  index,
  renderItem,
  registerActivator,
  onPress,
  onHover,
  onChoose,
}: OptionProps) {
  const strings = useUiStrings()
  const data = React.useMemo(() => ({ listId, key: itemKey }), [listId, itemKey])
  const { setNodeRef, listeners: sortableListeners, transform: shift, transition, isDragging } = useSortable({
    id,
    data,
    disabled: !draggable,
  })
  const listeners = (sortableListeners ?? {}) as Partial<Record<"onKeyDown" | "onMouseDown" | "onTouchStart", Listener>>
  const keyboardActivator = listeners.onKeyDown
  React.useEffect(
    () => (keyboardActivator ? registerActivator(itemKey, keyboardActivator) : undefined),
    [registerActivator, itemKey, keyboardActivator]
  )
  const transform = shift ? `translate3d(${Math.round(shift.x)}px, ${Math.round(shift.y)}px, 0)` : undefined

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- the list keeps the focus and points at the highlighted item with aria-activedescendant (APG listbox).
    <div
      ref={setNodeRef}
      role="option"
      id={optionId}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-slot="order-list-item"
      data-selected={selected || undefined}
      data-highlighted={highlighted || undefined}
      data-dragging={isDragging || undefined}
      data-draggable={(draggable && !dragHandle) || undefined}
      data-drop={drop}
      style={{
        transform,
        // Items make room for the dragged one at the theme's pace (instant under reduced motion).
        transition: transition ? "transform var(--bui-duration-base) var(--bui-ease-standard)" : undefined,
      }}
      onMouseDown={(event) => {
        // dnd kit ignores an event already handled, so it sees the press first; then the focus stays on the list.
        if (draggable && !dragHandle) listeners.onMouseDown?.(event)
        event.preventDefault()
        // A disabled list stays out of the focus order, a press included.
        if (!disabled) onPress()
      }}
      onTouchStart={draggable && !dragHandle ? listeners.onTouchStart : undefined}
      onMouseMove={() => onHover(itemKey)}
      onClick={(event) => onChoose(event, itemKey)}
      // Listbox's option: 29px from 4px × 10px padding and a 21px line, a 4px radius, `--accent` under the pointer or
      // while highlighted; a chosen one fills `--highlight` (`--highlight-focus` while highlighted). A dragged item stays
      // in place at half strength; a line marks where an item from another list will land.
      className={cn(
        "group/order-list-item relative flex w-full shrink-0 cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1 select-none not-data-selected:hover:bg-accent not-data-selected:hover:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-selected:bg-highlight data-selected:text-highlight-foreground data-selected:data-highlighted:bg-highlight-focus data-selected:data-highlighted:text-highlight-foreground data-draggable:cursor-grab data-dragging:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        "data-drop:before:pointer-events-none data-drop:before:absolute data-drop:before:inset-x-1 data-drop:before:h-0.5 data-drop:before:rounded-full data-drop:before:bg-primary data-[drop=after]:before:-bottom-0.5 data-[drop=before]:before:-top-0.5",
        "group-data-disabled/order-list:cursor-default group-data-disabled/order-list:text-field-disabled-foreground group-data-disabled/order-list:hover:bg-transparent group-data-disabled/order-list:data-selected:bg-control group-data-disabled/order-list:data-selected:text-foreground"
      )}
    >
      {draggable && dragHandle ? (
        <span
          aria-hidden="true"
          title={fillString(strings.dragHandle, { item: label })}
          data-slot="order-list-handle"
          onMouseDown={(event) => listeners.onMouseDown?.(event)}
          onTouchStart={(event) => listeners.onTouchStart?.(event)}
          className="-ms-1 flex cursor-grab items-center text-muted-foreground in-data-selected:text-highlight-foreground/70"
        >
          <GripVerticalIcon />
        </span>
      ) : null}
      {checkbox ? (
        <span
          aria-hidden="true"
          data-slot="order-list-checkbox"
          // The library's checkbox, drawn: an 18px box on the field fill, `--primary` with a 12px check once chosen.
          className="flex size-4.5 shrink-0 items-center justify-center rounded-sm border border-control bg-field text-primary-foreground shadow-xs group-data-selected/order-list-item:border-primary group-data-selected/order-list-item:bg-primary group-data-selected/order-list-item:group-data-highlighted/order-list-item:border-highlight-foreground"
        >
          {selected ? <CheckIcon className="size-3" /> : null}
        </span>
      ) : null}
      <span data-slot="order-list-item-content" className="flex min-w-0 flex-1 items-center">
        {renderItem ? renderItem(item, { index, selected, dragging: false }) : <span className="truncate">{label}</span>}
      </span>
    </div>
  )
})

export { OrderList, OrderListGroup }
