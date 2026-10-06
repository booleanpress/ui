"use client"

// Tree: a hierarchical list on the WAI-ARIA Tree View pattern, built on plain elements. Pointer dragging is a separate
// entry, `tree-drag` (`DraggableTree`, on dnd kit), so this one needs no drag library.

import * as React from "react"
import { ChevronDownIcon, ChevronRightIcon, SearchIcon } from "lucide-react"

import { cn, fillString } from "@/lib/utils"
import { TreeDragLayerContext, type TreeDragLayer } from "@/lib/tree-drag-layer"
import { Checkbox } from "@/components/checkbox"
import { Input } from "@/components/input"
import { Skeleton } from "@/components/skeleton"
import { Spinner } from "@/components/spinner"
import { useUiConfig, useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

/**
 * One node of a tree: `Tree`, `TreeSelect` and `TreeTable` all take an array of them.
 *
 * @since 0.1.0
 */
interface TreeNode<TData = unknown> {
  /** Unique across the whole tree. */
  id: string
  /** The node's text: its accessible name, and the text type-ahead and the filter match. */
  label: string
  /** An icon before the label, drawn at 14 px. */
  icon?: React.ReactNode
  /** The icon while the node is open, in place of `icon` (an open folder). */
  expandedIcon?: React.ReactNode
  /** The child nodes. Leave it out, with the tree's `loadChildren`, to load them when the node first opens. */
  children?: TreeNode<TData>[]
  /** A node that has no children and loads none, even with `loadChildren`. */
  leaf?: boolean
  /** The node can be focused and opened, but not chosen, checked or dragged. */
  disabled?: boolean
  /** Anything of your own: for `renderLabel`, or a tree table's columns. */
  data?: TData
}

/**
 * How nodes are chosen: not at all, one at a time, several, or with checkboxes that check a whole branch.
 *
 * @since 0.1.0
 */
type TreeSelectionMode = "none" | "single" | "multiple" | "checkbox"

/**
 * A node moved by dragging or by Alt and an arrow key: put node `id` before, after or inside node `targetId`. Pass it
 * to `moveTreeNode` to get the new nodes.
 *
 * @since 0.1.0
 */
interface TreeMove {
  id: string
  targetId: string
  position: "before" | "after" | "inside"
}

/**
 * What `renderLabel` is told about the node it draws.
 *
 * @since 0.1.0
 */
interface TreeNodeState {
  level: number
  expanded: boolean
  selected: boolean
  checked: boolean | "mixed"
  loading: boolean
}

/**
 * One visible row of a tree: a node with its place, as `useTreeState` lists them, in order.
 *
 * @since 0.1.0
 */
interface TreeRow<TData = unknown> {
  node: TreeNode<TData>
  level: number
  parentId: string | null
  posinset: number
  setsize: number
  hasChildren: boolean
  expanded: boolean
  loading: boolean
}

type TreeEntry<TData> = { node: TreeNode<TData>; parentId: string | null; level: number }
type Loaded<TData> = Record<string, TreeNode<TData>[]>

function childrenOf<TData>(node: TreeNode<TData>, loaded: Loaded<TData>): TreeNode<TData>[] | undefined {
  return node.children ?? loaded[node.id]
}

function indexTree<TData>(nodes: TreeNode<TData>[], loaded: Loaded<TData>) {
  const index = new Map<string, TreeEntry<TData>>()
  const walk = (list: TreeNode<TData>[], parentId: string | null, level: number) => {
    for (const node of list) {
      index.set(node.id, { node, parentId, level })
      const kids = childrenOf(node, loaded)
      if (kids) walk(kids, node.id, level + 1)
    }
  }
  walk(nodes, null, 1)
  return index
}

// The state of every loaded node's checkbox: a node in the set checks its whole branch; a parent is checked when all
// its children are, mixed when some are.
function computeCheckStates<TData>(nodes: TreeNode<TData>[], loaded: Loaded<TData>, checked: Set<string>) {
  const states = new Map<string, boolean | "mixed">()
  const walk = (node: TreeNode<TData>, inherited: boolean): boolean | "mixed" => {
    const own = inherited || checked.has(node.id)
    // Set first, so the map lists the nodes in tree order.
    states.set(node.id, false)
    const kids = childrenOf(node, loaded)
    let state: boolean | "mixed"
    if (!kids || kids.length === 0) state = own
    else {
      const kidStates = kids.map((kid) => walk(kid, own))
      state = kidStates.every((s) => s === true) ? true : kidStates.some((s) => s !== false) ? "mixed" : false
    }
    states.set(node.id, state)
    return state
  }
  for (const node of nodes) walk(node, false)
  return states
}

// Checks or unchecks a branch: its leaves (disabled ones keep their state) and, unchecking, its own id; the parents'
// states follow from their children.
function cascadeCheck<TData>(set: Set<string>, node: TreeNode<TData>, check: boolean, root: boolean, loaded: Loaded<TData>) {
  if (node.disabled && !root) return
  const kids = childrenOf(node, loaded)
  if (kids && kids.length > 0) {
    for (const kid of kids) cascadeCheck(set, kid, check, false, loaded)
    if (!check) set.delete(node.id)
  } else if (check) set.add(node.id)
  else set.delete(node.id)
}

function checkedIds(states: Map<string, boolean | "mixed">) {
  return [...states].filter(([, state]) => state === true).map(([id]) => id)
}

function sameIds(a: string[], b: string[]) {
  return a.length === b.length && a.every((id, i) => id === b[i])
}

/**
 * The ids of every node that has children, loaded ones included: what "expand all" opens.
 *
 * @since 0.1.0
 */
function getExpandableIds<TData>(nodes: TreeNode<TData>[]): string[] {
  const ids: string[] = []
  const walk = (list: TreeNode<TData>[]) => {
    for (const node of list) {
      if (node.children && node.children.length > 0) {
        ids.push(node.id)
        walk(node.children)
      }
    }
  }
  walk(nodes)
  return ids
}

/**
 * The nodes with one moved as `move` says, as a new array; the nodes you pass are not changed. A node cannot move into
 * itself or its own branch: the nodes come back as they were.
 *
 * @since 0.1.0
 */
function moveTreeNode<TData>(nodes: TreeNode<TData>[], move: TreeMove): TreeNode<TData>[] {
  const index = indexTree(nodes, {})
  const moving = index.get(move.id)?.node
  if (!moving || !index.has(move.targetId) || move.id === move.targetId) return nodes
  for (let id: string | null = move.targetId; id; id = index.get(id)?.parentId ?? null) {
    if (id === move.id) return nodes
  }
  const remove = (list: TreeNode<TData>[]): TreeNode<TData>[] =>
    list
      .filter((node) => node.id !== move.id)
      .map((node) => (node.children ? { ...node, children: remove(node.children) } : node))
  const insert = (list: TreeNode<TData>[]): TreeNode<TData>[] =>
    list.flatMap((node) => {
      if (node.id === move.targetId) {
        if (move.position === "before") return [moving, node]
        if (move.position === "after") return [node, moving]
        return [{ ...node, children: [...(node.children ?? []), moving] }]
      }
      return [node.children ? { ...node, children: insert(node.children) } : node]
    })
  return insert(remove(nodes))
}

function useControllableState<T>(prop: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = React.useState(defaultValue)
  const controlled = prop !== undefined
  const value = controlled ? prop : inner
  const latest = React.useRef(value)
  React.useLayoutEffect(() => {
    latest.current = value
  })
  const setValue = React.useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved = typeof next === "function" ? (next as (previous: T) => T)(latest.current) : next
      latest.current = resolved
      if (!controlled) setInner(resolved)
      onChange?.(resolved)
    },
    [controlled, onChange]
  )
  return [value, setValue] as const
}

/**
 * Options of `useTreeState`.
 *
 * @since 0.1.0
 */
interface TreeStateOptions<TData> {
  nodes: TreeNode<TData>[]
  selectionMode?: TreeSelectionMode
  expanded?: string[]
  defaultExpanded?: string[]
  onExpandedChange?: (expanded: string[]) => void
  selected?: string[]
  defaultSelected?: string[]
  onSelectedChange?: (selected: string[]) => void
  onNodeSelect?: (node: TreeNode<TData>) => void
  loadChildren?: (node: TreeNode<TData>) => Promise<TreeNode<TData>[]>
  /** Text to filter by: matching nodes show with their ancestors (opened) and their own branch. */
  filterQuery?: string
  /** Orders each set of siblings, such as a tree table's sort. */
  sortSiblings?: (siblings: TreeNode<TData>[]) => TreeNode<TData>[]
  /** The top-level nodes to show, after sorting, as `[start, end)`: a tree table's page. */
  rootRange?: [number, number]
  /** Called by Alt and an arrow key with the move it asks for. */
  onNodeMove?: (move: TreeMove) => void
}

/**
 * The state and keyboard model of a tree, shared by `Tree` and `TreeTable`: expanded and selected ids (controlled or
 * not), checkbox propagation, lazy children, filtering, the visible rows in order, roving focus and the WAI-ARIA tree
 * keys. For building another tree-shaped widget.
 *
 * @since 0.1.0
 */
function useTreeState<TData>({
  nodes,
  selectionMode = "none",
  expanded: expandedProp,
  defaultExpanded = [],
  onExpandedChange,
  selected: selectedProp,
  defaultSelected = [],
  onSelectedChange,
  onNodeSelect,
  loadChildren,
  filterQuery = "",
  sortSiblings,
  rootRange,
  onNodeMove,
}: TreeStateOptions<TData>) {
  const { dir } = useUiConfig()
  const { locale } = useUiLocale()
  const strings = useUiStrings()
  const [expanded, setExpanded] = useControllableState(expandedProp, defaultExpanded, onExpandedChange)
  const [selected, setSelected] = useControllableState(selectedProp, defaultSelected, onSelectedChange)
  const [loaded, setLoaded] = React.useState<Loaded<TData>>({})
  const [focusedId, setFocusedId] = React.useState<string | null>(null)
  // What the tree's live region says when nothing is loading: a node moved, or a branch that failed to load.
  const [announcement, setAnnouncement] = React.useState("")
  // A load that settles after the tree is gone changes nothing and calls nothing of yours.
  const mounted = React.useRef(false)
  // Branches closed by hand while a filter holds them open, for the filter text they were closed under.
  const [filterClosed, setFilterClosed] = React.useState<{ query: string; ids: Set<string> }>({ query: "", ids: new Set() })
  const items = React.useRef(new Map<string, HTMLElement>())
  const pendingFocus = React.useRef<string | null>(null)
  const inflight = React.useRef(new Set<string>())
  const typeahead = React.useRef<{ text: string; timer: ReturnType<typeof setTimeout> | undefined }>({
    text: "",
    timer: undefined,
  })

  const index = React.useMemo(() => indexTree(nodes, loaded), [nodes, loaded])
  const expandedSet = React.useMemo(() => new Set(expanded), [expanded])
  const selectedSet = React.useMemo(() => new Set(selected), [selected])
  const checkStates = React.useMemo(
    () => (selectionMode === "checkbox" ? computeCheckStates(nodes, loaded, selectedSet) : new Map<string, boolean | "mixed">()),
    [selectionMode, nodes, loaded, selectedSet]
  )

  const isLazy = React.useCallback(
    (node: TreeNode<TData>) => Boolean(loadChildren) && !node.leaf && node.children === undefined && loaded[node.id] === undefined,
    [loadChildren, loaded]
  )
  const hasChildren = React.useCallback(
    (node: TreeNode<TData>) => (childrenOf(node, loaded)?.length ?? 0) > 0 || isLazy(node),
    [loaded, isLazy]
  )

  const query = filterQuery.trim().toLocaleLowerCase(locale)
  const filter = React.useMemo(() => {
    if (!query) return null
    const visible = new Set<string>()
    const forced = new Set<string>()
    const walk = (node: TreeNode<TData>, insideMatch: boolean): boolean => {
      const self = node.label.toLocaleLowerCase(locale).includes(query)
      let below = false
      for (const kid of childrenOf(node, loaded) ?? []) if (walk(kid, insideMatch || self)) below = true
      if (below) forced.add(node.id)
      if (insideMatch || self || below) visible.add(node.id)
      return self || below
    }
    for (const node of nodes) walk(node, false)
    return { visible, forced }
  }, [query, locale, nodes, loaded])

  const isExpanded = React.useCallback(
    (id: string) => {
      if (!filter) return expandedSet.has(id)
      if (filterClosed.query === query && filterClosed.ids.has(id)) return false
      return expandedSet.has(id) || filter.forced.has(id)
    },
    [filter, expandedSet, filterClosed, query]
  )

  const rows = React.useMemo(() => {
    const list: TreeRow<TData>[] = []
    const walk = (siblings: TreeNode<TData>[], parentId: string | null, level: number) => {
      let shown = filter ? siblings.filter((node) => filter.visible.has(node.id)) : siblings
      if (sortSiblings) shown = sortSiblings(shown)
      if (level === 1 && rootRange) shown = shown.slice(rootRange[0], rootRange[1])
      shown.forEach((node, i) => {
        const open = hasChildren(node) && isExpanded(node.id)
        const lazy = isLazy(node)
        list.push({
          node,
          level,
          parentId,
          posinset: i + 1,
          setsize: shown.length,
          hasChildren: hasChildren(node),
          expanded: open,
          loading: open && lazy,
        })
        const kids = childrenOf(node, loaded)
        if (open && kids) walk(kids, node.id, level + 1)
      })
    }
    walk(nodes, null, 1)
    return list
  }, [nodes, loaded, filter, sortSiblings, rootRange, hasChildren, isExpanded, isLazy])

  const rowIndex = React.useMemo(() => new Map(rows.map((row, i) => [row.node.id, i])), [rows])

  React.useEffect(() => {
    mounted.current = true
    const state = typeahead.current
    return () => {
      mounted.current = false
      clearTimeout(state.timer)
    }
  }, [])

  // Children load when a lazy node is open: on a click, a key, or an `expanded` set from outside. A failed load closes
  // the node again, so opening it tries once more, and the live region says it failed.
  React.useEffect(() => {
    if (!loadChildren) return
    for (const id of expanded) {
      const node = index.get(id)?.node
      if (!node || !isLazy(node) || inflight.current.has(id)) continue
      inflight.current.add(id)
      Promise.resolve()
        .then(() => loadChildren(node))
        .then(
          (kids) => {
            inflight.current.delete(id)
            if (!mounted.current) return
            setLoaded((previous) => ({ ...previous, [id]: Array.isArray(kids) ? kids : [] }))
            setAnnouncement("")
          },
          () => {
            inflight.current.delete(id)
            if (!mounted.current) return
            setExpanded((previous) => previous.filter((x) => x !== id))
            setAnnouncement(fillString(strings.treeLoadFailed, { label: node.label }))
          }
        )
    }
  }, [expanded, index, isLazy, loadChildren, setExpanded, strings])

  // Focus that waits for a render: a node moved to a new place, or a parent whose open branch held the focus.
  React.useEffect(() => {
    const id = pendingFocus.current
    if (id === null) return
    const element = items.current.get(id)
    if (element) {
      pendingFocus.current = null
      if (document.activeElement !== element) element.focus()
    }
  })

  const firstSelected = rows.find((row) => (selectionMode === "checkbox" ? checkStates.get(row.node.id) === true : selectedSet.has(row.node.id)))
  const tabbableId =
    focusedId !== null && rowIndex.has(focusedId) ? focusedId : (firstSelected?.node.id ?? rows[0]?.node.id ?? null)

  // One ref callback per node id, kept between renders, so React does not detach and attach every node's ref each time
  // the tree renders (a large tree re-renders on each key).
  const itemRefs = React.useRef(new Map<string, (element: HTMLElement | null) => (() => void) | undefined>())
  const registerItem = React.useCallback((id: string) => {
    const refs = itemRefs.current
    let ref = refs.get(id)
    if (!ref) {
      ref = (element: HTMLElement | null) => {
        if (!element) return
        const map = items.current
        map.set(id, element)
        return () => {
          if (map.get(id) === element) map.delete(id)
        }
      }
      refs.set(id, ref)
    }
    return ref
  }, [])
  // A node gone from the data takes its callback with it; a collapsed node, still in the data, keeps its own.
  React.useEffect(() => {
    for (const id of itemRefs.current.keys()) if (!index.has(id)) itemRefs.current.delete(id)
  }, [index])

  const focusRow = React.useCallback((id: string) => {
    setFocusedId(id)
    const element = items.current.get(id)
    if (element?.isConnected) element.focus()
    else pendingFocus.current = id
  }, [])

  const toggleExpanded = React.useCallback(
    (id: string, open?: boolean) => {
      const node = index.get(id)?.node
      if (!node || !hasChildren(node)) return
      const isOpen = isExpanded(id)
      const next = open ?? !isOpen
      if (next === isOpen) return
      if (!next) {
        // The focus is inside the branch that closes: it moves to the node itself.
        const element = items.current.get(id)
        const active = document.activeElement
        if (element && active && active !== element && element.contains(active)) {
          pendingFocus.current = id
          setFocusedId(id)
        }
      }
      if (filter) {
        setFilterClosed((previous) => {
          const ids = new Set(previous.query === query ? previous.ids : [])
          if (next) ids.delete(id)
          else ids.add(id)
          return { query, ids }
        })
      }
      setExpanded((previous) => (next ? [...previous.filter((x) => x !== id), id] : previous.filter((x) => x !== id)))
    },
    [index, hasChildren, isExpanded, filter, query, setExpanded]
  )

  const expandSiblings = React.useCallback(
    (id: string) => {
      const entry = index.get(id)
      if (!entry) return
      const parent = entry.parentId === null ? null : index.get(entry.parentId)?.node
      const siblings = parent ? (childrenOf(parent, loaded) ?? []) : nodes
      const ids = siblings.filter((node) => hasChildren(node)).map((node) => node.id)
      setExpanded((previous) => [...new Set([...previous, ...ids])])
      if (filter) setFilterClosed({ query, ids: new Set() })
    },
    [index, loaded, nodes, hasChildren, setExpanded, filter, query]
  )

  // Checks a branch, or unchecks it when it is checked already, or when checking would change nothing: a branch whose
  // only unchecked nodes are disabled stays mixed, and a second press must still clear it.
  const toggleCheck = React.useCallback(
    (id: string) => {
      const entry = index.get(id)
      if (!entry || entry.node.disabled) return
      setSelected((previous) => {
        const current = checkedIds(computeCheckStates(nodes, loaded, new Set(previous)))
        const uncheck = (set: Set<string>) => {
          cascadeCheck(set, entry.node, false, true, loaded)
          for (let p = entry.parentId; p; p = index.get(p)?.parentId ?? null) set.delete(p)
          return checkedIds(computeCheckStates(nodes, loaded, set))
        }
        if (current.includes(id)) return uncheck(new Set(current))
        const set = new Set(current)
        cascadeCheck(set, entry.node, true, true, loaded)
        const next = checkedIds(computeCheckStates(nodes, loaded, set))
        return sameIds(next, current) ? uncheck(new Set(current)) : next
      })
    },
    [index, nodes, loaded, setSelected]
  )

  const setAllChecked = React.useCallback(
    (check: boolean) =>
      setSelected((previous) => {
        const set = new Set(checkedIds(computeCheckStates(nodes, loaded, new Set(previous))))
        for (const node of nodes) cascadeCheck(set, node, check, false, loaded)
        return checkedIds(computeCheckStates(nodes, loaded, set))
      }),
    [nodes, loaded, setSelected]
  )

  // A select-all box's press: checks every node, or unchecks them all when all are checked or checking would change
  // nothing (the only unchecked nodes are disabled).
  const toggleAllChecked = React.useCallback(
    () =>
      setSelected((previous) => {
        const current = checkedIds(computeCheckStates(nodes, loaded, new Set(previous)))
        const set = new Set(current)
        for (const node of nodes) cascadeCheck(set, node, true, false, loaded)
        const next = checkedIds(computeCheckStates(nodes, loaded, set))
        if (!sameIds(next, current)) return next
        const cleared = new Set(current)
        for (const node of nodes) cascadeCheck(cleared, node, false, false, loaded)
        return checkedIds(computeCheckStates(nodes, loaded, cleared))
      }),
    [nodes, loaded, setSelected]
  )

  const toggleSelected = React.useCallback(
    (id: string) => setSelected((previous) => (previous.includes(id) ? previous.filter((x) => x !== id) : [...previous, id])),
    [setSelected]
  )

  // The node's default action: choose it, check it, or (with no selection) open or close it.
  const activate = React.useCallback(
    (id: string) => {
      const node = index.get(id)?.node
      if (!node) return
      if (selectionMode === "none") {
        toggleExpanded(id)
        return
      }
      if (node.disabled) return
      if (selectionMode === "single") setSelected([id])
      else if (selectionMode === "multiple") toggleSelected(id)
      else toggleCheck(id)
      onNodeSelect?.(node)
    },
    [index, selectionMode, toggleExpanded, setSelected, toggleSelected, toggleCheck, onNodeSelect]
  )

  // Whether a node can take another inside it: not a leaf, and not a lazy node whose own children have not loaded yet
  // (they would be lost under the moved one).
  const canNest = React.useCallback(
    (id: string) => {
      const node = index.get(id)?.node
      return Boolean(node) && !node!.leaf && !isLazy(node!)
    },
    [index, isLazy]
  )

  // Hands a move (from the keyboard or a drop) to `onNodeMove`: opens the node it goes into and says where it went.
  const applyMove = React.useCallback(
    (move: TreeMove) => {
      const moving = index.get(move.id)?.node
      const target = index.get(move.targetId)
      if (!onNodeMove || !moving || !target) return
      if (move.position === "inside") setExpanded((list) => (list.includes(move.targetId) ? list : [...list, move.targetId]))
      const parentId = move.position === "inside" ? move.targetId : target.parentId
      const parent = parentId === null ? null : (index.get(parentId)?.node ?? null)
      const siblings = (parent ? (childrenOf(parent, loaded) ?? []) : nodes).filter((node) => node.id !== move.id)
      const at =
        move.position === "inside"
          ? siblings.length
          : siblings.findIndex((node) => node.id === move.targetId) + (move.position === "after" ? 1 : 0)
      const format = new Intl.NumberFormat(locale)
      setAnnouncement(
        fillString(strings.itemMoved, { item: moving.label, position: format.format(at + 1), total: format.format(siblings.length + 1) })
      )
      onNodeMove(move)
    },
    [index, loaded, nodes, onNodeMove, setExpanded, locale, strings]
  )

  const moveByKey = React.useCallback(
    (id: string, direction: "up" | "down" | "in" | "out") => {
      const entry = index.get(id)
      if (!onNodeMove || !entry || entry.node.disabled) return
      const parent = entry.parentId === null ? null : (index.get(entry.parentId)?.node ?? null)
      const siblings = parent ? (childrenOf(parent, loaded) ?? []) : nodes
      const at = siblings.findIndex((node) => node.id === id)
      const previous = siblings[at - 1]
      const next = siblings[at + 1]
      let move: TreeMove | null = null
      if (direction === "up" && previous) move = { id, targetId: previous.id, position: "before" }
      else if (direction === "down" && next) move = { id, targetId: next.id, position: "after" }
      else if (direction === "in" && previous && canNest(previous.id)) move = { id, targetId: previous.id, position: "inside" }
      else if (direction === "out" && parent) move = { id, targetId: parent.id, position: "after" }
      if (!move) return
      pendingFocus.current = id
      applyMove(move)
    },
    [index, loaded, nodes, onNodeMove, canNest, applyMove]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent, id: string) => {
      const at = rowIndex.get(id)
      if (at === undefined) return
      const row = rows[at]
      const forward = dir === "rtl" ? "ArrowLeft" : "ArrowRight"
      const back = dir === "rtl" ? "ArrowRight" : "ArrowLeft"
      const multiple = selectionMode === "multiple"
      let handled = true

      if (event.altKey && onNodeMove && ["ArrowUp", "ArrowDown", forward, back].includes(event.key)) {
        moveByKey(id, event.key === "ArrowUp" ? "up" : event.key === "ArrowDown" ? "down" : event.key === forward ? "in" : "out")
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const target = rows[at + (event.key === "ArrowDown" ? 1 : -1)]
        if (target) {
          focusRow(target.node.id)
          if (event.shiftKey && multiple && !target.node.disabled) toggleSelected(target.node.id)
        }
      } else if (event.key === forward) {
        if (row.hasChildren && !row.expanded) toggleExpanded(id, true)
        else if (row.expanded && rows[at + 1]?.parentId === id) focusRow(rows[at + 1].node.id)
      } else if (event.key === back) {
        if (row.expanded) toggleExpanded(id, false)
        else if (row.parentId !== null) focusRow(row.parentId)
      } else if (event.key === "Home") {
        if (rows[0]) focusRow(rows[0].node.id)
      } else if (event.key === "End") {
        if (rows.length > 0) focusRow(rows[rows.length - 1].node.id)
      } else if (event.key === "Enter" || event.key === " ") {
        activate(id)
      } else if (event.key === "*") {
        expandSiblings(id)
      } else if (multiple && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
        const all = rows.filter((r) => !r.node.disabled).map((r) => r.node.id)
        setSelected(all.every((x) => selectedSet.has(x)) ? [] : all)
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key.trim() !== "") {
        const state = typeahead.current
        clearTimeout(state.timer)
        state.text += event.key.toLocaleLowerCase(locale)
        state.timer = setTimeout(() => {
          state.text = ""
        }, 500)
        const text = state.text
        const repeated = [...text].every((char) => char === text[0])
        const search = repeated ? text[0] : text
        const start = repeated ? at + 1 : at
        const order = [...rows.slice(start), ...rows.slice(0, start)]
        const match = order.find((r) => r.node.label.toLocaleLowerCase(locale).startsWith(search))
        if (match) focusRow(match.node.id)
      } else handled = false

      if (handled) {
        event.preventDefault()
        event.stopPropagation()
      }
    },
    [rowIndex, rows, dir, selectionMode, onNodeMove, moveByKey, focusRow, toggleSelected, toggleExpanded, activate, expandSiblings, setSelected, selectedSet, locale]
  )

  const isSelected = React.useCallback(
    (id: string) => (selectionMode === "checkbox" ? checkStates.get(id) === true : selectedSet.has(id)),
    [selectionMode, checkStates, selectedSet]
  )
  const checkState = React.useCallback((id: string) => checkStates.get(id) ?? false, [checkStates])
  const loadingRow = rows.find((row) => row.loading)
  // The live region's text: the node loading its children, else the last move or failed load.
  const status = loadingRow ? fillString(strings.treeLoading, { label: loadingRow.node.label }) : announcement

  return {
    rows,
    index,
    expanded,
    setExpanded,
    selected,
    setSelected,
    loaded,
    filterActive: filter !== null,
    hasChildren,
    isExpanded,
    isSelected,
    checkState,
    toggleExpanded,
    toggleCheck,
    setAllChecked,
    toggleAllChecked,
    applyMove,
    canNest,
    activate,
    focusedId,
    setFocusedId,
    tabbableId,
    focusRow,
    registerItem,
    handleKeyDown,
    loadingLabel: loadingRow?.node.label ?? null,
    status,
    childrenOf: (node: TreeNode<TData>) => childrenOf(node, loaded),
  }
}

type TreeState<TData> = ReturnType<typeof useTreeState<TData>>

type TreeContextValue = {
  state: TreeState<unknown>
  selectionMode: TreeSelectionMode
  renderLabel?: (node: TreeNode<unknown>, state: TreeNodeState) => React.ReactNode
  expandIcon?: React.ReactNode
  collapseIcon?: React.ReactNode
  /** The drag layer's row, inside a `DraggableTree`. */
  DragContent: TreeDragLayer["Content"] | null
}

const TreeContext = React.createContext<TreeContextValue | null>(null)

// The node's look: 29px rows from 4px × 8px padding and a 21px line, 6px apart from their parts, a 6px radius; a
// focused node shows a 1px `--ring` outline inside its row.
const CONTENT =
  "relative flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm/normal text-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control)"
const ITEM_FOCUS =
  "outline-none [&:focus-visible>[data-slot=tree-node-content]]:outline-solid [&:focus-visible>[data-slot=tree-node-content]]:outline-1 [&:focus-visible>[data-slot=tree-node-content]]:-outline-offset-1 [&:focus-visible>[data-slot=tree-node-content]]:outline-ring"

function TreeNodeContent(props: React.ComponentProps<"div">) {
  return <div data-slot="tree-node-content" {...props} />
}

function TreeItem({ row, renderGroup }: { row: TreeRow<unknown>; renderGroup: (parent: TreeNode<unknown>) => React.ReactNode }) {
  const context = React.useContext(TreeContext)
  if (!context) return null
  const { state, selectionMode, renderLabel, expandIcon, collapseIcon, DragContent } = context
  const { node, level, hasChildren, expanded, loading } = row
  const selectable = selectionMode !== "none"
  const selected = selectionMode === "single" || selectionMode === "multiple" ? state.isSelected(node.id) : false
  const checked = selectionMode === "checkbox" ? state.checkState(node.id) : false
  const icon = expanded && node.expandedIcon !== undefined ? node.expandedIcon : node.icon

  const contentProps: React.ComponentProps<"div"> & Record<`data-${string}`, unknown> = {
    "data-selected": selected || undefined,
    "data-disabled": node.disabled || undefined,
    className: cn(
      CONTENT,
      // The visual target tints a node only while it can be chosen: under the pointer `--accent`, chosen `--highlight`.
      selectable && !node.disabled && "cursor-pointer select-none not-data-selected:hover:bg-accent not-data-selected:hover:text-accent-foreground",
      selectionMode === "none" && hasChildren && "cursor-pointer select-none",
      "data-selected:bg-highlight data-selected:text-highlight-foreground",
      "data-disabled:opacity-60",
      // While a `DraggableTree` drags: the drag layer sets `data-dragging` on the source and `data-drop` on the target.
      "data-dragging:outline-1 data-dragging:-outline-offset-1 data-dragging:outline-primary data-dragging:outline-dashed",
      "data-[drop=inside]:bg-accent data-[drop=inside]:text-accent-foreground",
      "data-[drop=before]:before:absolute data-[drop=before]:before:inset-x-0 data-[drop=before]:before:-top-px data-[drop=before]:before:h-px data-[drop=before]:before:bg-primary",
      "data-[drop=after]:after:absolute data-[drop=after]:after:inset-x-0 data-[drop=after]:after:-bottom-px data-[drop=after]:after:h-px data-[drop=after]:after:bg-primary"
    ),
    onClick: (event) => {
      if (event.defaultPrevented) return
      state.activate(node.id)
    },
    children: (
      <>
        <span
          data-slot="tree-node-toggle"
          aria-hidden="true"
          onClick={(event) => {
            event.preventDefault()
            if (hasChildren) state.toggleExpanded(node.id)
          }}
          className={cn(
            // A bare 14px mark, as the visual target draws it, with a 24px area under the pointer.
            "relative flex size-3.5 shrink-0 items-center justify-center text-current after:absolute after:-inset-[5px] [&_svg]:size-3.5",
            hasChildren ? "cursor-pointer" : "invisible"
          )}
        >
          {loading ? (
            <Spinner aria-hidden="true" role="presentation" />
          ) : expanded ? (
            (collapseIcon ?? <ChevronDownIcon />)
          ) : (
            (expandIcon ?? <ChevronRightIcon className="rtl:rotate-180" />)
          )}
        </span>
        {selectionMode === "checkbox" ? (
          <Checkbox
            data-slot="tree-node-checkbox"
            checked={checked === "mixed" ? "indeterminate" : checked}
            disabled={node.disabled}
            tabIndex={-1}
            aria-hidden="true"
            className="pointer-events-none"
          />
        ) : null}
        {icon !== undefined ? (
          <span data-slot="tree-node-icon" aria-hidden="true" className="flex shrink-0 items-center [&_svg]:size-3.5">
            {icon}
          </span>
        ) : null}
        <span data-slot="tree-node-label" className="flex min-w-0 flex-1 items-center gap-2">
          {renderLabel
            ? renderLabel(node, { level, expanded, selected: state.isSelected(node.id), checked, loading })
            : node.label}
        </span>
      </>
    ),
  }

  return (
    <li
      ref={state.registerItem(node.id)}
      role="treeitem"
      data-slot="tree-node"
      data-node-id={node.id}
      aria-level={level}
      aria-setsize={row.setsize}
      aria-posinset={row.posinset}
      aria-expanded={hasChildren ? expanded : undefined}
      aria-selected={selectionMode === "single" || selectionMode === "multiple" ? selected : undefined}
      aria-checked={selectionMode === "checkbox" ? checked : undefined}
      aria-disabled={node.disabled || undefined}
      aria-busy={loading || undefined}
      tabIndex={state.tabbableId === node.id ? 0 : -1}
      onFocus={(event) => {
        if (event.target === event.currentTarget) state.setFocusedId(node.id)
      }}
      className={ITEM_FOCUS}
    >
      {DragContent ? (
        <DragContent nodeId={node.id} disabled={Boolean(node.disabled)} {...contentProps} />
      ) : (
        <TreeNodeContent {...contentProps} />
      )}
      {expanded ? renderGroup(node) : null}
    </li>
  )
}

/**
 * Props of `Tree`.
 *
 * @since 0.1.0
 */
interface TreeProps<TData = unknown>
  extends Omit<React.ComponentProps<"div">, "children" | "defaultValue" | "onChange"> {
  /** The nodes to show. */
  nodes: TreeNode<TData>[]
  /** How nodes are chosen: `none` (default), `single`, `multiple` or `checkbox`. */
  selectionMode?: TreeSelectionMode
  /** The open nodes' ids, when you control them. */
  expanded?: string[]
  /** The nodes open at first, when the tree controls them. */
  defaultExpanded?: string[]
  /** Called with the open nodes' ids when a node opens or closes. */
  onExpandedChange?: (expanded: string[]) => void
  /** The chosen (or, with checkboxes, checked) nodes' ids, when you control them. */
  selected?: string[]
  /** The nodes chosen at first, when the tree controls them. */
  defaultSelected?: string[]
  /** Called with the chosen nodes' ids. With checkboxes it lists every checked node, parents whose branch is all checked included. */
  onSelectedChange?: (selected: string[]) => void
  /** Called with the node a click, Enter or Space chooses or checks, even when it was chosen already. */
  onNodeSelect?: (node: TreeNode<TData>) => void
  /** Loads the children of a node that has none yet and is not a `leaf`, the first time it opens; a spinner shows meanwhile. */
  loadChildren?: (node: TreeNode<TData>) => Promise<TreeNode<TData>[]>
  /** Shows a field above the tree that keeps the nodes whose label contains its text, with their ancestors. */
  filter?: boolean
  /** The filter's text, when you control it. */
  filterValue?: string
  /** Called with the filter's text as it is typed. */
  onFilterValueChange?: (value: string) => void
  /** The filter's placeholder. Defaults to the provider's `filterTree` string. */
  filterPlaceholder?: string
  /** Dims the nodes under a spinner; with no nodes yet, shows placeholder rows. */
  loading?: boolean
  /** What shows when there are no nodes. Defaults to the provider's `noResults` string. */
  empty?: React.ReactNode
  /** Draws a node's label and anything after it, such as a count. Defaults to the label. */
  renderLabel?: (node: TreeNode<TData>, state: TreeNodeState) => React.ReactNode
  /** The mark on a closed node, in place of the chevron. */
  expandIcon?: React.ReactNode
  /** The mark on an open node, in place of the chevron. */
  collapseIcon?: React.ReactNode
  /**
   * Makes nodes movable by Alt and the arrow keys; called with each move. Apply it with `moveTreeNode`. For pointer
   * dragging as well, use `DraggableTree` from `@booleanpress/ui/tree-drag`.
   */
  onNodeMove?: (move: TreeMove) => void
}

/**
 * A hierarchical list people open, close and choose from: folders, categories, an organisation. Name it with
 * `aria-label` or `aria-labelledby`.
 *
 * @since 0.1.0
 */
function Tree<TData = unknown>({
  nodes,
  selectionMode = "none",
  expanded,
  defaultExpanded,
  onExpandedChange,
  selected,
  defaultSelected,
  onSelectedChange,
  onNodeSelect,
  loadChildren,
  filter = false,
  filterValue: filterValueProp,
  onFilterValueChange,
  filterPlaceholder,
  loading = false,
  empty,
  renderLabel,
  expandIcon,
  collapseIcon,
  onNodeMove,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...props
}: TreeProps<TData>) {
  const strings = useUiStrings()
  const listId = React.useId()
  const [filterValue, setFilterValue] = useControllableState(filterValueProp, "", onFilterValueChange)
  const state = useTreeState<TData>({
    nodes,
    selectionMode,
    expanded,
    defaultExpanded,
    onExpandedChange,
    selected,
    defaultSelected,
    onSelectedChange,
    onNodeSelect,
    loadChildren,
    filterQuery: filter ? filterValue : "",
    onNodeMove,
  })
  // Inside a `DraggableTree`, its drag layer; the tree does not pass it on to a tree nested in its labels.
  const dragLayer = React.useContext(TreeDragLayerContext)
  const drag = dragLayer && onNodeMove ? dragLayer : null

  const rowsByParent = React.useMemo(() => {
    const map = new Map<string | null, TreeRow<TData>[]>()
    for (const row of state.rows) {
      const list = map.get(row.parentId) ?? []
      list.push(row)
      map.set(row.parentId, list)
    }
    return map
  }, [state.rows])

  const renderGroup = (parent: TreeNode<unknown>): React.ReactNode => {
    const kids = rowsByParent.get(parent.id)
    if (!kids || kids.length === 0) return null
    return (
      // boolean-ui: each level is indented 14px, its nodes 2px apart.
      <ul role="group" data-slot="tree-group" className="flex flex-col gap-0.5 pt-0.5 ps-3.5">
        {kids.map((row) => (
          <TreeItem key={row.node.id} row={row as TreeRow<unknown>} renderGroup={renderGroup} />
        ))}
      </ul>
    )
  }

  const context: TreeContextValue = {
    state: state as TreeState<unknown>,
    selectionMode,
    renderLabel: renderLabel as TreeContextValue["renderLabel"],
    expandIcon,
    collapseIcon,
    DragContent: drag?.Content ?? null,
  }

  const rootRows = rowsByParent.get(null) ?? []

  let body: React.ReactNode
  if (nodes.length === 0 && loading) {
    body = (
      <div data-slot="tree-skeleton" aria-hidden="true" className="flex flex-col gap-0.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} data-slot="tree-skeleton-row" className="flex items-center gap-1.5 px-2 py-1">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-3 w-2/5 rounded-sm" />
          </div>
        ))}
      </div>
    )
  } else if (nodes.length === 0) {
    body = (
      <div data-slot="tree-empty" className="px-2.5 py-1 text-sm/normal text-muted-foreground">
        {empty ?? strings.noResults}
      </div>
    )
  } else if (rootRows.length === 0) {
    body = (
      <div role="status" data-slot="tree-empty" className="px-2.5 py-1 text-sm/normal text-muted-foreground">
        {strings.noResults}
      </div>
    )
  } else {
    const list = (
      <ul
        id={listId}
        role="tree"
        data-slot="tree-list"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-multiselectable={selectionMode === "multiple" || selectionMode === "checkbox" || undefined}
        onKeyDown={(event) => {
          const item = (event.target as HTMLElement).closest<HTMLElement>("[data-slot=tree-node]")
          if (!item || item !== event.target || item.closest("[data-slot=tree-list]") !== event.currentTarget) return
          const id = item.dataset.nodeId
          if (id !== undefined) state.handleKeyDown(event, id)
        }}
        className="flex flex-col gap-0.5"
      >
        {rootRows.map((row) => (
          <TreeItem key={row.node.id} row={row as TreeRow<unknown>} renderGroup={renderGroup} />
        ))}
      </ul>
    )
    body =
      drag && onNodeMove ? (
        <drag.Root index={state.index} onNodeMove={state.applyMove} canNest={state.canNest}>
          {list}
        </drag.Root>
      ) : (
        list
      )
  }

  return (
    <TreeContext.Provider value={context}>
      <TreeDragLayerContext.Provider value={null}>
        <div
          data-slot="tree"
          aria-busy={loading || undefined}
          // boolean-ui: the visual target's tree — the card surface with 14px padding.
          className={cn("relative flex flex-col bg-card p-3.5 text-foreground", className)}
          {...props}
        >
          {filter ? (
            <div data-slot="tree-filter" className="relative">
              <Input
                type="text"
                value={filterValue}
                onChange={(event) => setFilterValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "ArrowDown" || state.tabbableId === null) return
                  event.preventDefault()
                  state.focusRow(state.tabbableId)
                }}
                placeholder={filterPlaceholder ?? strings.filterTree}
                aria-label={strings.filterTree}
                aria-controls={rootRows.length > 0 ? listId : undefined}
                autoComplete="off"
                className="pe-8.5"
              />
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute end-2.5 top-1/2 size-3.5 -translate-y-1/2 text-control-hover"
              />
            </div>
          ) : null}
          {body}
          {loading && nodes.length > 0 ? (
            <div
              data-slot="tree-loading"
              className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-card/50"
            >
              <Spinner className="size-7 text-primary" />
            </div>
          ) : null}
          {loading && nodes.length === 0 ? (
            <span role="status" data-slot="tree-loading-status" className="sr-only">
              {strings.loading}
            </span>
          ) : null}
          <span role="status" data-slot="tree-status" className="sr-only">
            {state.status}
          </span>
        </div>
      </TreeDragLayerContext.Provider>
    </TreeContext.Provider>
  )
}

export { Tree, getExpandableIds, moveTreeNode, useTreeState }
export type { TreeMove, TreeNode, TreeNodeState, TreeProps, TreeRow, TreeSelectionMode, TreeStateOptions }
