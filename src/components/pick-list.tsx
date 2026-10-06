"use client"

// Built on OrderList and OrderListGroup: two lists side by side, items moved between them with the buttons between the
// lists or by dragging, each list chosen from, filtered and put in order on its own.

import * as React from "react"
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon } from "lucide-react"

import { cn, fillString } from "@/lib/utils"
import { Button } from "@/components/button"
import { OrderList, OrderListGroup, type OrderListItemState } from "@/components/order-list"
import { useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

/**
 * What `renderItem` is told about the item it draws: OrderList's state, and the list the item is in.
 *
 * @since 0.1.0
 */
export interface PickListItemState extends OrderListItemState {
  list: "source" | "target"
}

/**
 * Props of `PickList`.
 *
 * @since 0.1.0
 */
export interface PickListProps<T> extends Omit<React.ComponentProps<"div">, "children" | "defaultValue" | "onChange"> {
  /** The items in the first list, in order, when you control them. Pair it with `onSourceChange`. */
  source?: readonly T[]
  /** The items the first list starts with, when the pick list controls itself. */
  defaultSource?: readonly T[]
  /** Called with the first list's items after every move. */
  onSourceChange?: (source: T[]) => void
  /** The items in the second list, in order, when you control them. Pair it with `onTargetChange`. */
  target?: readonly T[]
  /** The items the second list starts with, when the pick list controls itself. */
  defaultTarget?: readonly T[]
  /** Called with the second list's items after every move. */
  onTargetChange?: (target: T[]) => void
  /** A stable, unique key for an item. Defaults to the item itself for strings, else its `id`, then its `value`. */
  getItemKey?: (item: T) => string
  /** The item's text, for type-ahead, the filters and the announcements. Defaults to the string, `label`, `name` or `title`. */
  getItemLabel?: (item: T) => string
  /** Draws an item's content in either list. Defaults to its label. */
  renderItem?: (item: T, state: PickListItemState) => React.ReactNode
  /** A title above the first list that names it. Without one the list is named by the provider's `sourceList` string. */
  sourceHeader?: React.ReactNode
  /** A title above the second list that names it. Without one the list is named by the provider's `targetList` string. */
  targetHeader?: React.ReactNode
  /** Shows each list's Move up and down buttons, on its outer side. */
  orderControls?: boolean
  /** Lets people drag items within a list and from one list into the other. */
  draggable?: boolean
  /** With `draggable`, shows a grip on each item; only the grip starts a pointer drag. */
  dragHandle?: boolean
  /** Shows a filter field above each list. "Move all" then moves the items in view. */
  filter?: boolean
  /** The filter fields' placeholder. */
  filterPlaceholder?: string
  /** `checkbox` draws a checkbox on every item, ticked once chosen; a click then toggles an item. */
  indicator?: "none" | "checkbox"
  /** Shows a "Select all" checkbox above each list. */
  selectAll?: boolean
  /** What the first list says when it is empty. Defaults to the provider's `noItems` string. */
  sourceEmpty?: React.ReactNode
  /** What the second list says when it is empty. Defaults to the provider's `noItems` string. */
  targetEmpty?: React.ReactNode
  /** Greys both lists and every button. */
  disabled?: boolean
  /** Classes for both scrolling lists. Defaults to `h-60`, so the two lists are the same height. */
  listClassName?: string
}

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

/**
 * Moves the items whose keys are given from one list to the end of the other, in their order. Returns both new arrays;
 * neither input changes. `getItemKey` defaults to the item itself for strings, else its `id`, then its `value`.
 *
 * @since 0.1.0
 */
export function transferItems<T>(
  from: readonly T[],
  to: readonly T[],
  keys: readonly string[],
  getItemKey: (item: T) => string = defaultItemKey
): { from: T[]; to: T[] } {
  const moving = new Set(keys)
  return {
    from: from.filter((item) => !moving.has(getItemKey(item))),
    to: [...to, ...from.filter((item) => moving.has(getItemKey(item)))],
  }
}

/**
 * Two lists side by side: people move items from the first (the source) to the second (the target) and back with the
 * buttons between them or by dragging, and put each list in order.
 *
 * @since 0.1.0
 */
function PickList<T>({
  source: sourceProp,
  defaultSource,
  onSourceChange,
  target: targetProp,
  defaultTarget,
  onTargetChange,
  getItemKey = defaultItemKey,
  getItemLabel = defaultItemLabel,
  renderItem,
  sourceHeader,
  targetHeader,
  orderControls = true,
  draggable = false,
  dragHandle = false,
  filter = false,
  filterPlaceholder,
  indicator = "none",
  selectAll = false,
  sourceEmpty,
  targetEmpty,
  disabled = false,
  listClassName = "h-60",
  className,
  ...props
}: PickListProps<T>) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const [source, setSource] = useControllableState<T[]>(
    sourceProp as T[] | undefined,
    defaultSource ? [...defaultSource] : [],
    onSourceChange
  )
  const [target, setTarget] = useControllableState<T[]>(
    targetProp as T[] | undefined,
    defaultTarget ? [...defaultTarget] : [],
    onTargetChange
  )
  const [sourceSelected, setSourceSelected] = React.useState<string[]>([])
  const [targetSelected, setTargetSelected] = React.useState<string[]>([])
  const [sourceQuery, setSourceQuery] = React.useState("")
  const [targetQuery, setTargetQuery] = React.useState("")
  const [message, setMessage] = React.useState({ text: "", id: 0 })

  const number = (value: number) => new Intl.NumberFormat(locale).format(value)
  const inView = (items: readonly T[], query: string) => {
    const needle = query.trim().toLocaleLowerCase(locale)
    return filter && needle !== "" ? items.filter((item) => getItemLabel(item).toLocaleLowerCase(locale).includes(needle)) : items
  }
  const sourceInView = inView(source, sourceQuery).map(getItemKey)
  const targetInView = inView(target, targetQuery).map(getItemKey)
  // Sets, so a choice of thousands is checked in one pass rather than one search per item.
  const sourceChosen = new Set(sourceSelected)
  const targetChosen = new Set(targetSelected)
  const chosenSource = sourceInView.filter((key) => sourceChosen.has(key))
  const chosenTarget = targetInView.filter((key) => targetChosen.has(key))
  // One function per list across renders, so the lists' memoised items redraw only when `renderItem` itself changes.
  const renderSourceItem = React.useMemo(
    () => (renderItem ? (item: T, state: OrderListItemState) => renderItem(item, { ...state, list: "source" }) : undefined),
    [renderItem]
  )
  const renderTargetItem = React.useMemo(
    () => (renderItem ? (item: T, state: OrderListItemState) => renderItem(item, { ...state, list: "target" }) : undefined),
    [renderItem]
  )

  // The buttons move the chosen items in view, or every item in view, to the end of the other list, and say so.
  const transfer = (toTarget: boolean, all: boolean) => {
    if (disabled) return
    const from = toTarget ? source : target
    const to = toTarget ? target : source
    const keys = all ? (toTarget ? sourceInView : targetInView) : toTarget ? chosenSource : chosenTarget
    if (keys.length === 0) return
    const next = transferItems(from, to, keys, getItemKey)
    // The moved items leave the choice; chosen items the filter hides stay chosen.
    const moved = new Set(keys)
    if (toTarget) {
      setSource(next.from)
      setTarget(next.to)
      setSourceSelected((previous) => previous.filter((key) => !moved.has(key)))
    } else {
      setTarget(next.from)
      setSource(next.to)
      setTargetSelected((previous) => previous.filter((key) => !moved.has(key)))
    }
    const position = number(to.length + 1)
    const total = number(next.to.length)
    const text =
      keys.length === 1
        ? fillString(strings.itemMoved, { item: getItemLabel(next.to[to.length]), position, total })
        : fillString(strings.itemsMoved, { count: number(keys.length), position, total })
    setMessage((previous) => ({ text, id: previous.id + 1 }))
  }

  const TRANSFERS = [
    { id: "to-target", label: strings.moveToTarget, Icon: ChevronRightIcon, toTarget: true, all: false, enabled: chosenSource.length > 0 },
    { id: "all-to-target", label: strings.moveAllToTarget, Icon: ChevronsRightIcon, toTarget: true, all: true, enabled: sourceInView.length > 0 },
    { id: "to-source", label: strings.moveToSource, Icon: ChevronLeftIcon, toTarget: false, all: false, enabled: chosenTarget.length > 0 },
    { id: "all-to-source", label: strings.moveAllToSource, Icon: ChevronsLeftIcon, toTarget: false, all: true, enabled: targetInView.length > 0 },
  ]

  const shared = {
    getItemKey,
    getItemLabel,
    draggable,
    dragHandle,
    filter,
    filterPlaceholder,
    indicator,
    selectAll,
    disabled,
    listClassName,
    // Each list's own Move buttons sit 12px from it, level with the middle of its frame, as in the visual target.
    className: "min-w-0 flex-1 gap-x-3 [&>[data-slot=order-list-controls]]:self-center",
  }
  const headed = sourceHeader != null || targetHeader != null

  return (
    <div data-slot="pick-list" className={cn("@container/pick-list min-w-0", className)} {...props}>
      <OrderListGroup>
        {/* Side by side from 576px of room, with 12px between the parts, as the visual target; stacked below that. */}
        <div data-slot="pick-list-layout" className="flex flex-col gap-3 @xl/pick-list:flex-row @xl/pick-list:items-center">
          <OrderList<T>
            {...shared}
            data-list="source"
            header={sourceHeader}
            aria-label={sourceHeader == null ? strings.sourceList : undefined}
            controls={orderControls ? "start" : "none"}
            value={source}
            onValueChange={setSource}
            selected={sourceSelected}
            onSelectedChange={setSourceSelected}
            filterValue={sourceQuery}
            onFilterValueChange={setSourceQuery}
            empty={sourceEmpty}
            renderItem={renderSourceItem}
          />
          <div
            data-slot="pick-list-transfer"
            // A row of buttons when stacked; a column level with the middle of the frames, below the headers, side by side.
            className={cn("flex justify-center gap-1 @xl/pick-list:flex-col", headed && "@xl/pick-list:mt-[1.6875rem]")}
          >
            {TRANSFERS.map(({ id, label, Icon, toTarget, all, enabled }) => (
              <Button
                key={id}
                type="button"
                variant="secondary"
                size="icon-sm"
                aria-label={label}
                disabled={disabled}
                aria-disabled={!enabled || undefined}
                data-slot="pick-list-move"
                onClick={() => enabled && transfer(toTarget, all)}
                className="aria-disabled:cursor-default aria-disabled:opacity-60 aria-disabled:hover:bg-secondary aria-disabled:hover:text-secondary-foreground aria-disabled:active:bg-secondary"
              >
                {/* The arrows point at the list they move to: down when stacked, across side by side, mirrored in a
                    right-to-left page. */}
                <Icon aria-hidden="true" className="rotate-90 @xl/pick-list:rotate-0 @xl/pick-list:rtl:rotate-180" />
              </Button>
            ))}
          </div>
          <OrderList<T>
            {...shared}
            data-list="target"
            header={targetHeader}
            aria-label={targetHeader == null ? strings.targetList : undefined}
            controls={orderControls ? "end" : "none"}
            value={target}
            onValueChange={setTarget}
            selected={targetSelected}
            onSelectedChange={setTargetSelected}
            filterValue={targetQuery}
            onFilterValueChange={setTargetQuery}
            empty={targetEmpty}
            renderItem={renderTargetItem}
          />
        </div>
      </OrderListGroup>
      <div data-slot="pick-list-status" role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        <span key={message.id}>{message.text}</span>
      </div>
    </div>
  )
}

export { PickList }
