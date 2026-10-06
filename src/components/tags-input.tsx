// Built on plain elements and the library's Chip: a text field that turns what people type into removable tags. With
// `suggestions`, the input is Base UI's Autocomplete (`@base-ui/react/autocomplete`), whose list offers values to add.
"use client"

import * as React from "react"
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete"
import { DirectionProvider } from "@base-ui/react/direction-provider"
import { useFormReset } from "@/lib/form-reset"
import { useLabelName } from "@/lib/label-name"
import { cn } from "@/lib/utils"

import { Chip, ChipGroup } from "@/components/chip"
import {
  useControlSize,
  useFieldVariant,
  useUiConfig,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

/** While the list is open, Escape closes the list only: a Radix dialog around it sees the key as handled. */
function useEscapeGuard(popup: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && popup.current?.hasAttribute("data-open")) event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [popup])
}

const stopPropagation = (event: React.SyntheticEvent) => event.stopPropagation()

// The chip at each size: 22px in `sm`, 28px (the Chip's own) by default, 32px with 14px text in `lg`.
const CHIP_SIZES: Record<ControlSize, string> = {
  sm: "h-5.5 gap-1 px-2 data-removable:pe-1 [&_[data-slot=chip-remove]]:size-4 [&_[data-slot=chip-remove]>svg]:size-3",
  default: "",
  lg: "h-8 px-3 text-sm/normal",
}

/**
 * A field that turns typed text into tags: Enter (or a delimiter) adds one, Backspace in the empty field removes the last,
 * and each tag's remove button takes it out.
 *
 * @since 0.1.0
 */
function TagsInput({
  className,
  value: valueProp,
  defaultValue,
  onValueChange,
  delimiter,
  allowDuplicates = false,
  max,
  suggestions,
  tagIcon,
  size,
  variant,
  disabled = false,
  readOnly = false,
  placeholder,
  name,
  required,
  form,
  ref,
  onKeyDown,
  onPaste,
  ...props
}: Omit<React.ComponentProps<"input">, "size" | "value" | "defaultValue" | "onChange"> & {
  /** The tags, when you control them. Pair it with `onValueChange`. */
  value?: string[]
  /** The tags it starts with, when it controls itself. */
  defaultValue?: string[]
  /** Called with the new tags whenever one is added or removed. */
  onValueChange?: (value: string[]) => void
  /** Characters that end a tag as they are typed or pasted, besides Enter, such as `","`. */
  delimiter?: string | string[]
  /** Lets the same tag be added more than once. Off by default: a tag already in the field is not added again. */
  allowDuplicates?: boolean
  /** The most tags the field takes; once full, the input stops taking text. */
  max?: number
  /** Values offered in a list as people type; picking one adds it. Values already added are left out. */
  suggestions?: string[]
  /** An icon before each tag's label, or a function that returns one for a tag. */
  tagIcon?: React.ReactNode | ((tag: string) => React.ReactNode)
  /** 28, 35 or 42 px tall while it holds one row. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` fills the field grey. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
}) {
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(defaultValue ?? [])
  const tags = valueProp ?? uncontrolled
  const [draft, setDraft] = React.useState("")
  const field = React.useRef<HTMLDivElement>(null)
  // A form reset empties the input and puts an uncontrolled field back to the tags it started with, as native fields.
  const initialTags = React.useRef(defaultValue ?? [])
  useFormReset(
    field,
    () => {
      setDraft("")
      if (valueProp === undefined) setUncontrolled(initialTags.current)
    },
    { form }
  )
  const input = React.useRef<HTMLInputElement | null>(null)
  const refocus = React.useRef(false)
  const delimiters = typeof delimiter === "string" ? [delimiter] : (delimiter ?? [])
  const full = max !== undefined && tags.length >= max

  const setTags = (next: string[]) => {
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  /** Adds the texts that pass the rules (not empty, not a duplicate, under `max`); returns whether any was added. */
  const add = (texts: string[]) => {
    const next = [...tags]
    for (const raw of texts) {
      const tag = raw.trim()
      if (!tag || (!allowDuplicates && next.includes(tag)) || (max !== undefined && next.length >= max)) continue
      next.push(tag)
    }
    if (next.length === tags.length) return false
    setTags(next)
    return true
  }

  const removeAt = (index: number) => {
    // The last tag gone, focus returns to the input rather than to the emptied list.
    if (tags.length === 1) refocus.current = true
    setTags(tags.filter((_, i) => i !== index))
  }

  React.useEffect(() => {
    if (refocus.current) {
      refocus.current = false
      input.current?.focus()
    }
  }, [tags])

  const setInput = React.useCallback(
    (node: HTMLInputElement | null) => {
      input.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    [ref]
  )

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || event.nativeEvent.isComposing || readOnly) return
    const text = event.currentTarget.value
    if (event.key === "Enter" || delimiters.includes(event.key)) {
      // A highlighted suggestion is Base UI's to add.
      if (event.key === "Enter" && event.currentTarget.getAttribute("aria-activedescendant")) return
      if (text.trim() === "") {
        if (delimiters.includes(event.key)) event.preventDefault()
        return
      }
      event.preventDefault()
      if (add([text])) setDraft("")
    } else if (event.key === "Backspace" && text === "" && tags.length > 0) {
      event.preventDefault()
      setTags(tags.slice(0, -1))
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    onPaste?.(event)
    if (event.defaultPrevented || readOnly || delimiters.length === 0) return
    const text = event.clipboardData.getData("text")
    const pattern = new RegExp(`[${delimiters.map((d) => d.replace(/[\\\]^-]/g, "\\$&")).join("")}\\n]`)
    if (!pattern.test(text)) return
    // Pasted text with delimiters becomes several tags at once, the text around the cursor included.
    event.preventDefault()
    const input = event.currentTarget
    const start = input.selectionStart ?? draft.length
    const end = input.selectionEnd ?? start
    if (add((draft.slice(0, start) + text + draft.slice(end)).split(pattern))) setDraft("")
  }

  const inputProps = {
    ...props,
    ref: setInput,
    form,
    disabled,
    readOnly: full || readOnly,
    // Required means at least one tag: the input needs text only while the field has none.
    required: required && tags.length === 0,
    placeholder: tags.length === 0 ? placeholder : undefined,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    "data-slot": "tags-input-input",
    className:
      // A 29px row of text, so the field is 35px tall; 22px in `sm`, 36px in `lg`. The muted placeholder turns red while
      // invalid.
      "h-7.25 min-w-24 flex-1 bg-transparent text-inherit outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed aria-invalid:placeholder:text-destructive-strong group-data-[size=lg]/tags-input:h-9 group-data-[size=sm]/tags-input:h-5.5",
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- a pointer convenience: the input is a tab stop of its own.
    <div
      ref={field}
      data-slot="tags-input"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      data-disabled={disabled || undefined}
      onMouseDown={(event) => {
        // A press on the field's empty space puts the cursor in the input.
        if (event.target === event.currentTarget) {
          event.preventDefault()
          input.current?.focus()
        }
      }}
      className={cn(
        // The field look of Input: a solid `--field` fill, the `--control` edge darkening on hover and turning `--ring`
        // while the input has focus; 35px tall while it holds one row, from 2px padding round the 29px row; tags start
        // 3px from the edge and text 10px; `--invalid` edge; disabled fills `--field-disabled`.
        "group/tags-input flex w-full min-w-0 cursor-text flex-wrap items-center gap-1 rounded-md border border-control bg-field px-2.5 py-0.5 text-sm/normal text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) hover:border-control-hover has-[input:focus-visible]:border-ring has-data-[slot=chip]:ps-0.75 has-aria-invalid:border-invalid has-aria-invalid:has-[input:focus-visible]:border-ring data-disabled:cursor-not-allowed data-disabled:border-control data-disabled:bg-field-disabled data-disabled:text-field-disabled-foreground",
        // sm is 28px with 12px text, lg 42px with 16px text.
        "data-[size=sm]:px-2 data-[size=sm]:text-xs/normal data-[size=sm]:has-data-[slot=chip]:ps-0.75 data-[size=lg]:px-3 data-[size=lg]:text-base/normal data-[size=lg]:has-data-[slot=chip]:ps-1",
        "data-[variant=filled]:not-data-disabled:bg-field-filled",
        className
      )}
    >
      {tags.length > 0 && (
        <ChipGroup data-slot="tags-input-tags" className="max-w-full gap-1">
          {tags.map((tag, index) => {
            const icon = typeof tagIcon === "function" ? tagIcon(tag) : tagIcon
            const occurrence = tags.slice(0, index).filter((other) => other === tag).length
            return (
              <Chip
                key={`${tag}\u0000${occurrence}`}
                label={tag}
                icon={icon ?? undefined}
                // A disabled or read-only field shows its tags at full contrast, with no remove buttons.
                onRemove={disabled || readOnly ? undefined : () => removeAt(index)}
                className={CHIP_SIZES[resolvedSize]}
              />
            )
          })}
        </ChipGroup>
      )}
      {suggestions ? (
        <TagsInputSuggestions
          // A full field offers nothing; its input stays focusable, read-only, so Backspace still removes the last tag.
          suggestions={full || readOnly ? [] : allowDuplicates ? suggestions : suggestions.filter((entry) => !tags.includes(entry))}
          draft={draft}
          setDraft={setDraft}
          add={add}
          field={field}
          disabled={disabled}
          inputProps={inputProps}
        />
      ) : (
        <input {...inputProps} value={draft} onChange={(event) => setDraft(event.target.value)} />
      )}
      {/* A disabled field submits nothing, as a disabled native input. */}
      {name ? tags.map((tag, index) => <input key={index} type="hidden" name={name} value={tag} form={form} disabled={disabled} />) : null}
    </div>
  )
}

/**
 * The element Base UI renders as the input with suggestions: named by its own labels while the list is open, as Base UI
 * hides the visible label from assistive technology then.
 */
function TagsInputControl(props: React.ComponentProps<"input">) {
  const { ref, "aria-label": ariaLabel } = useLabelName(props)

  return <input {...props} ref={ref} aria-label={ariaLabel} />
}

function TagsInputSuggestions({
  suggestions,
  draft,
  setDraft,
  add,
  field,
  disabled,
  inputProps,
}: {
  suggestions: string[]
  draft: string
  setDraft: (value: string) => void
  add: (texts: string[]) => boolean
  field: React.RefObject<HTMLDivElement | null>
  disabled: boolean
  inputProps: React.ComponentProps<"input"> & { "data-slot": string }
}) {
  const strings = useUiStrings()
  const { dir } = useUiConfig()
  const popup = React.useRef<HTMLDivElement>(null)
  useEscapeGuard(popup)
  const { className, ...rest } = inputProps
  // The suggestions that match the typed text, found here so the list is open only while it shows one: an open list,
  // even an empty one, hides the rest of the page from assistive technology and takes the first Escape.
  const { contains } = AutocompletePrimitive.useFilter()
  const shown = suggestions.filter((suggestion) => contains(suggestion, draft))
  const [open, setOpen] = React.useState(false)
  // A request to open while nothing matches is dropped, so the list does not appear later on its own.
  if (open && shown.length === 0) setOpen(false)

  return (
    // Base UI learns the provider's direction, so its own keys flip right to left.
    <DirectionProvider direction={dir}>
      <AutocompletePrimitive.Root
        items={shown}
        filter={null}
        open={open && shown.length > 0}
        onOpenChange={setOpen}
        value={draft}
        disabled={disabled}
        onValueChange={(next, details) => {
          if (details.reason === "item-press") {
            if (add([next])) setDraft("")
          } else {
            setDraft(next)
          }
        }}
      >
        <AutocompletePrimitive.Input render={<TagsInputControl />} {...rest} className={className} />
        <AutocompletePrimitive.Portal>
          <AutocompletePrimitive.Positioner
            anchor={field}
            side="bottom"
            sideOffset={2}
            align="start"
            className="isolate z-50 data-empty:hidden"
            // Works inside a modal Radix dialog or sheet: takes back the pointer events the dialog turns off on the page, and
            // keeps wheel and touch scrolling from the dialog's scroll lock, which listens on the document. Radix counts
            // presses in this portal as inside, since it renders within the dialog's React tree.
            style={{ pointerEvents: "auto" }}
            onWheel={stopPropagation}
            onTouchMove={stopPropagation}
          >
            <AutocompletePrimitive.Popup
              ref={popup}
              data-slot="tags-input-content"
              data-bui-motion="overlay"
              data-bui-portal=""
              // Select's list: the field's width, a 6px radius, a 1px edge, the overlay shadow; motion from theme.css.
              className="relative flex max-h-[min(24rem,var(--available-height))] w-(--anchor-width) max-w-(--available-width) origin-(--transform-origin) flex-col overflow-hidden rounded-md border border-border bg-popover text-sm/normal text-popover-foreground shadow-md outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
            >
              <AutocompletePrimitive.List
                data-slot="tags-input-list"
                // The list is named, not its popup, which Base UI renders as a presentation element.
                aria-label={strings.suggestions}
                className="flex min-h-0 flex-col gap-0.5 overflow-y-auto overscroll-contain p-1 scroll-py-1 outline-none data-empty:p-0"
              >
                {(suggestion: string) => (
                  <AutocompletePrimitive.Item
                    key={suggestion}
                    value={suggestion}
                    data-slot="tags-input-suggestion"
                    // Select's option: 29px, a 4px radius, `--accent` while highlighted.
                    className="relative flex w-full shrink-0 cursor-default items-center rounded-sm px-2.5 py-1 text-sm/normal outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground"
                  >
                    {suggestion}
                  </AutocompletePrimitive.Item>
                )}
              </AutocompletePrimitive.List>
            </AutocompletePrimitive.Popup>
          </AutocompletePrimitive.Positioner>
        </AutocompletePrimitive.Portal>
      </AutocompletePrimitive.Root>
    </DirectionProvider>
  )
}

export { TagsInput }
