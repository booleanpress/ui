"use client"

// Tree select: a select-like trigger opening a Radix Popover that holds the library's Tree.

import * as React from "react"
import { ChevronDownIcon, XIcon } from "lucide-react"

import { cn, fillString } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { Tree, type TreeNode, type TreeNodeState } from "@/components/tree"
import { useFormReset } from "@/lib/form-reset"
import {
  useControlSize,
  useFieldVariant,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

function indexNodes<TData>(nodes: TreeNode<TData>[]) {
  const index = new Map<string, { node: TreeNode<TData>; parentId: string | null }>()
  const walk = (list: TreeNode<TData>[], parentId: string | null) => {
    for (const node of list) {
      index.set(node.id, { node, parentId })
      if (node.children) walk(node.children, node.id)
    }
  }
  walk(nodes, null)
  return index
}

/**
 * Props of `TreeSelect`.
 *
 * @since 0.1.1
 */
interface TreeSelectProps<TData = unknown>
  extends Omit<React.ComponentProps<"button">, "value" | "defaultValue" | "onChange" | "children"> {
  /** The nodes of the list. */
  nodes: TreeNode<TData>[]
  /** `single` (default) chooses one node and closes; `multiple` and `checkbox` keep the list open. */
  selectionMode?: "single" | "multiple" | "checkbox"
  /** The chosen nodes' ids, when you control them. */
  value?: string[]
  /** The nodes chosen at first, when the field controls them. */
  defaultValue?: string[]
  /** Called with the chosen nodes' ids. With checkboxes it lists every checked node. */
  onValueChange?: (value: string[]) => void
  /** The text shown while nothing is chosen. */
  placeholder?: React.ReactNode
  /** With several nodes chosen: their labels separated by commas (default), or chips. */
  display?: "comma" | "chip"
  /** The most labels or chips shown; past it the field reads "3 selected" (`comma`) or adds "+2 more" (`chip`). */
  maxSelectedLabels?: number
  /** Shows a filter field at the top of the list. */
  filter?: boolean
  /** The filter's placeholder. Defaults to the provider's `filterTree` string. */
  filterPlaceholder?: string
  /** Shows a button that empties the field while something is chosen. */
  clearable?: boolean
  /** 28, 35 or 42 px tall. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Fills the width of its container. */
  fluid?: boolean
  /** The nodes open at first in the list; the branches of the chosen nodes open too whenever the list opens. */
  defaultExpanded?: string[]
  /** Loads the children of a node the first time it opens, as `Tree` does. */
  loadChildren?: (node: TreeNode<TData>) => Promise<TreeNode<TData>[]>
  /** Dims the list under a spinner, or draws placeholder rows while there are no nodes. */
  loading?: boolean
  /** What the list shows when there are no nodes. Defaults to the provider's `noResults` string. */
  empty?: React.ReactNode
  /** Draws a node's label in the list, as `Tree` does. */
  renderLabel?: (node: TreeNode<TData>, state: TreeNodeState) => React.ReactNode
  /** Submits each chosen id under this name, in a hidden input. */
  name?: string
}

/**
 * A field that opens a tree to choose from: one node, several, or checked branches. Name it with a `Label htmlFor`
 * (give it an `id`), `aria-label` or `aria-labelledby`.
 *
 * @since 0.1.1
 */
function TreeSelect<TData = unknown>({
  nodes,
  selectionMode = "single",
  value: valueProp,
  defaultValue = [],
  onValueChange,
  placeholder,
  display = "comma",
  maxSelectedLabels = 3,
  filter = false,
  filterPlaceholder,
  clearable = false,
  size,
  variant,
  fluid = false,
  defaultExpanded = [],
  loadChildren,
  loading = false,
  empty,
  renderLabel,
  name,
  disabled = false,
  className,
  id,
  onKeyDown,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  ...props
}: TreeSelectProps<TData>) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const strings = useUiStrings()
  const generatedId = React.useId()
  const triggerId = id ?? `${generatedId}-trigger`
  const contentId = `${generatedId}-content`
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(false)
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  const [expanded, setExpanded] = React.useState(defaultExpanded)
  const [labelIds, setLabelIds] = React.useState<string | undefined>(undefined)
  // Labels of nodes loaded later, which the nodes passed in do not hold.
  const [loadedLabels, setLoadedLabels] = React.useState<Record<string, string>>({})

  const index = React.useMemo(() => indexNodes(nodes), [nodes])
  const labelOf = (nodeId: string) => index.get(nodeId)?.node.label ?? loadedLabels[nodeId] ?? nodeId

  const setValue = (next: string[]) => {
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  // A form reset puts an uncontrolled field back to the nodes it started with, as a native select is.
  const [initialValue] = React.useState(defaultValue)
  useFormReset(
    triggerRef,
    () => {
      if (uncontrolled.length !== initialValue.length || uncontrolled.some((chosen, i) => chosen !== initialValue[i])) {
        setValue(initialValue)
      }
    },
    { enabled: valueProp === undefined, form: props.form }
  )

  const changeOpen = (next: boolean) => {
    if (next) {
      // The branches of the chosen nodes open with the list, so the choice is in view.
      const ancestors: string[] = []
      for (const chosen of value) {
        for (let p = index.get(chosen)?.parentId ?? null; p; p = index.get(p)?.parentId ?? null) ancestors.push(p)
      }
      if (ancestors.length > 0) setExpanded((previous) => [...new Set([...previous, ...ancestors])])
      // The list is named like the field: by its `Label htmlFor`, else by the field's own name.
      const labels = Array.from(triggerRef.current?.labels ?? [])
      setLabelIds(
        labels.length > 0
          ? labels
              .map((label, i) => {
                if (!label.id) label.id = `${generatedId}-label-${i}`
                return label.id
              })
              .join(" ")
          : undefined
      )
    }
    setOpen(next)
  }

  // With checkboxes, a checked branch shows as its top node alone.
  const valueSet = new Set(value)
  const shown =
    selectionMode === "checkbox"
      ? value.filter((chosen) => {
          const parent = index.get(chosen)?.parentId
          return !parent || !valueSet.has(parent)
        })
      : value
  const isEmpty = shown.length === 0
  const chips = selectionMode !== "single" && display === "chip" && !isEmpty

  let text: React.ReactNode = placeholder
  if (!isEmpty) {
    if (selectionMode === "single") text = labelOf(shown[0])
    else if (chips) text = null
    else if (shown.length > maxSelectedLabels) text = fillString(strings.selectedCount, { count: shown.length })
    else text = shown.map(labelOf).join(", ")
  }

  const showClear = clearable && !isEmpty && !disabled

  const trigger = (
    <PopoverTrigger asChild>
      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        role="combobox"
        // With a filter the list is a dialog holding a field and the tree; without, the tree alone.
        aria-haspopup={filter ? "dialog" : "tree"}
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        data-slot="tree-select-trigger"
        data-size={resolvedSize}
        data-variant={resolvedVariant}
        data-placeholder={isEmpty ? "" : undefined}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || open) return
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault()
            changeOpen(true)
          }
        }}
        className={cn(
          // The library's select field: 35px tall from 6px × 10px padding and a 21px line (sm 28px, lg 42px), a
          // `--field` fill, the `--control` edge darkening on hover and turning `--ring` on focus and while open; the
          // chevron is 14px in the field-icon colour in a 36px end column; disabled fills `--field-disabled`. Never wider
          // than its container: a long value truncates.
          "group/tree-select-trigger flex w-fit max-w-full min-w-0 items-center justify-between gap-5.25 rounded-md border border-control bg-field py-1.5 ps-2.5 pe-2.75 text-start text-sm/normal whitespace-nowrap text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) outline-none hover:border-control-hover focus-visible:border-ring data-[state=open]:border-ring disabled:cursor-not-allowed disabled:border-control disabled:bg-field-disabled disabled:text-field-disabled-foreground data-[placeholder]:text-muted-foreground data-[size=sm]:gap-5 data-[size=sm]:py-1 data-[size=sm]:ps-2 data-[size=sm]:pe-3 data-[size=sm]:text-xs/normal",
          "data-[size=lg]:gap-5.5 data-[size=lg]:py-2 data-[size=lg]:ps-3 data-[size=lg]:pe-2.5 data-[size=lg]:text-base/normal",
          "data-[variant=filled]:enabled:bg-field-filled",
          "aria-invalid:border-invalid aria-invalid:data-[placeholder]:text-destructive-strong aria-invalid:focus-visible:border-ring aria-invalid:data-[state=open]:border-ring",
          // Chips sit in half the padding, the field keeping its height (the visual target's chip display).
          chips &&
            "min-h-8.75 py-0.75 ps-1.25 data-[size=lg]:min-h-10.5 data-[size=lg]:py-1 data-[size=lg]:ps-1.5 data-[size=sm]:min-h-7 data-[size=sm]:py-0.5 data-[size=sm]:ps-1",
          fluid && "w-full",
          clearable && "group-hover/tree-select-control:border-control-hover",
          showClear && "gap-8.75 data-[size=sm]:gap-8.5 data-[size=lg]:gap-9",
          className
        )}
        {...props}
      >
        <span data-slot="tree-select-value" className="flex min-h-lh min-w-0 flex-1 items-center gap-0.75 overflow-hidden">
          {chips ? (
            <>
              {shown.slice(0, maxSelectedLabels).map((chosen) => (
                <span
                  key={chosen}
                  data-slot="tree-select-chip"
                  className="inline-flex shrink-0 items-center rounded-sm bg-secondary px-2.5 py-0.75 text-xs/normal text-accent-foreground"
                >
                  {labelOf(chosen)}
                </span>
              ))}
              {shown.length > maxSelectedLabels ? (
                <span
                  data-slot="tree-select-chip"
                  className="inline-flex shrink-0 items-center rounded-sm bg-secondary px-2.5 py-0.75 text-xs/normal text-accent-foreground"
                >
                  {fillString(strings.moreSelected, { count: shown.length - maxSelectedLabels })}
                </span>
              ) : null}
            </>
          ) : (
            <span data-slot="tree-select-text" className="truncate">{text}</span>
          )}
        </span>
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3.5 shrink-0 text-control-hover group-data-[size=lg]/tree-select-trigger:size-4 group-data-[size=sm]/tree-select-trigger:size-3"
        />
      </button>
    </PopoverTrigger>
  )

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      {clearable ? (
        // A clearable field sits in a wrapper with its clear button beside it, not inside it, as a button inside a
        // button is invalid; the wrapper is as wide as the trigger, or full width with `fluid` or `w-full`.
        <div
          data-slot="tree-select-control"
          className={cn("group/tree-select-control relative flex w-fit max-w-full has-[>.w-full]:w-full", fluid && "w-full")}
        >
          {trigger}
          {showClear ? (
            <button
              type="button"
              data-slot="tree-select-clear"
              aria-label={strings.clear}
              onClick={() => {
                setValue([])
                triggerRef.current?.focus()
              }}
              className="absolute end-8 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-sm text-control-hover transition-[color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-ring focus-visible:outline-solid"
            >
              <XIcon aria-hidden="true" className="size-3.5" />
            </button>
          ) : null}
        </div>
      ) : (
        trigger
      )}
      {/* A disabled field is not submitted, as a native one is not. */}
      {name
        ? value.map((chosen) => <input key={chosen} type="hidden" name={name} value={chosen} disabled={disabled} form={props.form} />)
        : null}
      {/* PopoverContent lets the wheel and touch scroll the list inside a modal dialog or sheet. */}
      <PopoverContent
        id={contentId}
        // A dialog only when it holds the filter as well as the tree, named like the field; otherwise a plain wrapper.
        role={filter ? "dialog" : undefined}
        aria-label={filter && !(labelIds || ariaLabelledBy) ? ariaLabel : undefined}
        aria-labelledby={filter ? (ariaLabelledBy ?? labelIds ?? (ariaLabel ? undefined : triggerId)) : undefined}
        align="start"
        sideOffset={2}
        data-slot="tree-select-content"
        data-bui-motion="overlay"
        onKeyDown={(event) => {
          // Tab past the list, or Shift+Tab before it, closes it; the focus goes back to the field.
          if (event.key !== "Tab") return
          const stops = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>("input, [role=treeitem][tabindex='0']")
          )
          const leaving = event.shiftKey ? stops[0] : stops[stops.length - 1]
          if (leaving && document.activeElement === leaving) {
            event.preventDefault()
            setOpen(false)
          }
        }}
        className={cn(
          // The visual target's overlay: as wide as the field at least, 2px below it, a 6px radius, 4px padding and the
          // overlay shadow; it scrolls past 20rem, without passing the scroll on to the page or dialog at its ends.
          "flex max-h-[min(20rem,var(--radix-popover-content-available-height))] w-max max-w-(--radix-popover-content-available-width) min-w-(--radix-popover-trigger-width) flex-col overflow-auto overscroll-contain rounded-md p-1 shadow-md"
        )}
      >
        <Tree<TData>
          nodes={nodes}
          selectionMode={selectionMode}
          selected={value}
          onSelectedChange={setValue}
          onNodeSelect={(node) => {
            if (!index.has(node.id)) setLoadedLabels((previous) => ({ ...previous, [node.id]: node.label }))
            if (selectionMode === "single") setOpen(false)
          }}
          expanded={expanded}
          onExpandedChange={setExpanded}
          loadChildren={loadChildren}
          filter={filter}
          filterPlaceholder={filterPlaceholder}
          loading={loading}
          empty={empty}
          renderLabel={renderLabel}
          aria-label={labelIds || ariaLabelledBy ? undefined : ariaLabel}
          aria-labelledby={ariaLabelledBy ?? labelIds}
          // The list sits on the overlay's surface: no padding or fill of its own.
          className="bg-transparent p-0"
        />
      </PopoverContent>
    </Popover>
  )
}

export { TreeSelect }
export type { TreeSelectProps }
