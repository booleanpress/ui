"use client"

// Editor: built on Tiptap 3 (`@tiptap/react` and `@tiptap/starter-kit`), with the library's Toolbar, Select and Popover.

import * as React from "react"
import { EditorContent, Extension, useEditor, type Editor as TiptapEditor, type JSONContent } from "@tiptap/react"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { StarterKit } from "@tiptap/starter-kit"
import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  Redo2Icon,
  StrikethroughIcon,
  TextQuoteIcon,
  UnderlineIcon,
  Undo2Icon,
} from "lucide-react"
import { Toolbar as ToolbarPrimitive } from "radix-ui"
import { useFormReset } from "@/lib/form-reset"
import { shareNode } from "@/lib/refs"
import { cn, fillString } from "@/lib/utils"
import {
  useControlSize,
  useFieldVariant,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Label } from "@/components/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { Toolbar, ToolbarGroup } from "@/components/toolbar"

/**
 * A control of the editor's toolbar: `heading` is the text-style select (paragraph, headings 1 to 3); the others are
 * buttons.
 *
 * @since 0.1.1
 */
type EditorTool =
  | "heading"
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "link"
  | "undo"
  | "redo"

/** The default toolbar: each inner list is a group; groups are 15 px apart. */
const DEFAULT_TOOLBAR: EditorTool[][] = [
  ["heading"],
  ["bold", "italic", "underline", "strike", "code"],
  ["bulletList", "orderedList", "blockquote"],
  ["link"],
  ["undo", "redo"],
]

type MarkTool = "bold" | "italic" | "underline" | "strike" | "code" | "bulletList" | "orderedList" | "blockquote"
type Block = "paragraph" | "h1" | "h2" | "h3"
type Chain = ReturnType<TiptapEditor["chain"]>

// What each toggle button runs, its icon and the shortcut it answers to (`aria-keyshortcuts`).
const MARKS: Record<MarkTool, { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; run: (chain: Chain) => Chain; keys: string; flip?: boolean }> = {
  bold: { icon: BoldIcon, run: (c) => c.toggleBold(), keys: "Control+B Meta+B" },
  italic: { icon: ItalicIcon, run: (c) => c.toggleItalic(), keys: "Control+I Meta+I" },
  underline: { icon: UnderlineIcon, run: (c) => c.toggleUnderline(), keys: "Control+U Meta+U" },
  strike: { icon: StrikethroughIcon, run: (c) => c.toggleStrike(), keys: "Control+Shift+S Meta+Shift+S" },
  code: { icon: CodeIcon, run: (c) => c.toggleCode(), keys: "Control+E Meta+E" },
  bulletList: { icon: ListIcon, run: (c) => c.toggleBulletList(), keys: "Control+Shift+8 Meta+Shift+8", flip: true },
  orderedList: { icon: ListOrderedIcon, run: (c) => c.toggleOrderedList(), keys: "Control+Shift+7 Meta+Shift+7" },
  blockquote: { icon: TextQuoteIcon, run: (c) => c.toggleBlockquote(), keys: "Control+Shift+B Meta+Shift+B", flip: true },
}

/**
 * A link's address as the editor stores it, or `null` when it is not one: web addresses (a bare `example.com` gets
 * `https://`), `mailto:` (a bare e-mail address gets it) and `tel:`.
 */
function normaliseLink(input: string): string | null {
  const text = input.trim()
  if (!text || /\s/.test(text)) return null
  let candidate = text
  if (!/^[a-z][a-z\d+.-]*:/i.test(text)) {
    if (/^[^@/]+@[^@/]+\.[^@/]+$/.test(text)) candidate = `mailto:${text}`
    else if (/^[^@/.]+(\.[^@/.]+)+(?:[/?#].*)?$/.test(text) || text.startsWith("//")) candidate = `https://${text.replace(/^\/\//, "")}`
    else return null
  }
  try {
    const url = new URL(candidate)
    if (url.protocol === "mailto:" || url.protocol === "tel:") return url.pathname ? candidate : null
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    if (!url.hostname.includes(".") && url.hostname !== "localhost") return null
    return candidate
  } catch {
    return null
  }
}

// The editor's value: its HTML, or "" when it holds no text, so a required field reads as empty.
const valueOf = (editor: TiptapEditor) => (editor.isEmpty ? "" : editor.getHTML())

// The character count the limit and the counter use: the document's text, without line breaks.
const countOf = (editor: TiptapEditor) => editor.state.doc.textContent.length

interface BehaviourStorage {
  limit: number | undefined
  openLink: (() => boolean) | null
}

/**
 * The editor's own behaviour: refuses an edit that would pass the character limit (a paste over it is refused whole),
 * and opens the link popover on ⌘/Ctrl+K. Each editor keeps its limit and its link handler in the extension's storage,
 * which the component sets (`configureBehaviours`).
 */
const Behaviours = Extension.create<object, BehaviourStorage>({
  name: "buiEditorBehaviours",
  addStorage() {
    return { limit: undefined, openLink: null }
  },
  addKeyboardShortcuts() {
    return { "Mod-k": () => this.storage.openLink?.() ?? false }
  },
  addProseMirrorPlugins() {
    const storage = this.storage
    return [
      new Plugin({
        key: new PluginKey("buiCharacterLimit"),
        filterTransaction(transaction, state) {
          const max = storage.limit
          // A value set by the app (`setContent` without an update) always goes in.
          if (!max || !transaction.docChanged || transaction.getMeta("preventUpdate")) return true
          const next = transaction.doc.textContent.length
          return next <= max || next <= state.doc.textContent.length
        },
      }),
    ]
  },
})

function configureBehaviours(editor: TiptapEditor, settings: Partial<BehaviourStorage>) {
  const storage = (editor.storage as unknown as Record<string, BehaviourStorage | undefined>)[Behaviours.name]
  if (storage) Object.assign(storage, settings)
}

const EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
    // No empty paragraph forced after a heading or quote at the end: the HTML holds what was written.
    trailingNode: false,
  }),
  Behaviours,
]

// The editor's text: the visual target's spacing (12 px × 15 px at the default size), its heading sizes and its quote
// and code looks, in the theme's tokens.
const CONTENT_CLASSES = [
  "min-h-full flex-1 px-3.75 py-3 text-sm/normal text-foreground break-words whitespace-pre-wrap outline-none",
  "group-data-[size=sm]/editor:px-3 group-data-[size=sm]/editor:py-2 group-data-[size=sm]/editor:text-xs/normal",
  "group-data-[size=lg]/editor:px-4 group-data-[size=lg]/editor:py-3.5 group-data-[size=lg]/editor:text-base/normal",
  "group-data-disabled/editor:cursor-not-allowed group-data-disabled/editor:text-field-disabled-foreground",
  "[&_h1]:text-[2em]/tight [&_h1]:font-semibold [&_h2]:text-[1.5em]/snug [&_h2]:font-semibold [&_h3]:text-[1.17em]/snug [&_h3]:font-semibold",
  "[&_ol]:list-decimal [&_ol]:ps-6 [&_ul]:list-disc [&_ul]:ps-6",
  "[&_blockquote]:my-1.25 [&_blockquote]:border-s-4 [&_blockquote]:border-control [&_blockquote]:ps-4",
  "[&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[85%]",
  "[&_pre]:my-1.25 [&_pre]:rounded-sm [&_pre]:bg-muted [&_pre]:px-2.5 [&_pre]:py-1.25 [&_pre]:font-mono [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[inherit]",
  "[&_a]:text-primary [&_a]:underline [&_hr]:my-2 [&_hr]:border-border",
].join(" ")

// A toolbar button: the visual target's 28 × 24 px icon button in the muted text colour, darker on hover, the primary
// colour on a faint plate while its format is on.
const TOOL_CLASSES = cn(
  "inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-[color,background-color,outline-color] duration-(--bui-duration-control) outline-none hover:text-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:pointer-events-none disabled:opacity-60 aria-pressed:bg-accent aria-pressed:text-primary data-active:text-primary [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  "group-data-[size=sm]/editor:h-5 group-data-[size=sm]/editor:w-6 group-data-[size=sm]/editor:[&_svg]:size-3.5",
  "group-data-[size=lg]/editor:h-7 group-data-[size=lg]/editor:w-8 group-data-[size=lg]/editor:[&_svg]:size-4.5"
)

const preventBlur = (event: React.MouseEvent) => event.preventDefault()

/**
 * The props of `Editor`.
 *
 * @since 0.1.1
 */
type EditorProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue" | "children"> & {
  /** The content as HTML, controlled. An empty editor's value is `""`. */
  value?: string
  /** The content to start with, as HTML, uncontrolled. */
  defaultValue?: string
  /** Called with the HTML after every change (`""` once the editor is empty). */
  onChange?: (html: string) => void
  /** Called with the content as Tiptap JSON after every change. */
  onJsonChange?: (json: JSONContent) => void
  /** The hint shown while the editor is empty. */
  placeholder?: string
  /** Shows the content without a toolbar; it can be selected and copied but not changed. */
  readOnly?: boolean
  /** Stops editing and every toolbar control. */
  disabled?: boolean
  /** The most characters the text may hold; an edit that would pass it is refused. */
  maxLength?: number
  /** Shows the number of characters under the text ("12 of 200 characters" with `maxLength`). */
  characterCount?: boolean
  /** The toolbar's controls, one inner list per group; `false` hides it. */
  toolbar?: EditorTool[][] | false
  /** The text size, padding and toolbar: 12, 14 or 16 px text. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` draws the grey `--field-filled` fill. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
  /** Adds a field with this name holding the HTML, for a form that posts natively. */
  name?: string
  /** The id of the form that field belongs to, for an editor placed outside it. */
  form?: string
  /** Classes for the area that holds the text, such as a height (`h-80`) or a minimum height. */
  contentClassName?: string
}

/** @since 0.1.1 */
function Editor({
  value,
  defaultValue,
  onChange,
  onJsonChange,
  placeholder,
  readOnly = false,
  disabled = false,
  maxLength,
  characterCount = false,
  toolbar = DEFAULT_TOOLBAR,
  size,
  variant,
  name,
  form,
  id,
  contentClassName,
  className,
  ref,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}: EditorProps) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const autoId = React.useId()
  const inputId = id ?? `${autoId}-input`
  const countId = `${autoId}-count`
  const linkInputId = `${autoId}-link`
  const linkErrorId = `${autoId}-link-error`
  const invalid = ariaInvalid === true || ariaInvalid === "true"
  const editable = !readOnly && !disabled
  const showToolbar = toolbar !== false && toolbar.length > 0 && !readOnly
  const tools = showToolbar ? toolbar : []
  const hasLink = tools.some((group) => group.includes("link"))

  // The content the editor starts with; later values arrive through the effect below.
  const [initialContent] = React.useState(() => value ?? defaultValue ?? "")
  // The HTML this editor last reported, so a controlled `value` that echoes it does not reset the text and the caret.
  const reportedRef = React.useRef<string | undefined>(undefined)

  const describedBy = [ariaDescribedBy, characterCount ? countId : undefined].filter(Boolean).join(" ") || undefined
  const attributes = React.useMemo(() => {
    const entries: Record<string, string | undefined> = {
      id: inputId,
      "data-slot": "editor-input",
      class: CONTENT_CLASSES,
      "aria-multiline": "true",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": describedBy,
      "aria-invalid": invalid ? "true" : undefined,
      "aria-readonly": readOnly ? "true" : undefined,
      "aria-disabled": disabled ? "true" : undefined,
      "aria-placeholder": placeholder,
      // A read-only editor stays in the tab order, so its text can be reached and read; a disabled one does not.
      tabindex: readOnly && !disabled ? "0" : undefined,
    }
    return Object.fromEntries(Object.entries(entries).filter((entry): entry is [string, string] => entry[1] !== undefined))
  }, [inputId, ariaLabel, ariaLabelledBy, describedBy, invalid, readOnly, disabled, placeholder])
  const editorProps = React.useMemo(() => ({ attributes }), [attributes])

  const editor = useEditor({
    extensions: EXTENSIONS,
    content: initialContent,
    editable,
    // Rendered in the browser once mounted, never on the server, so server and client markup agree.
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps,
    onUpdate: ({ editor: current }) => {
      const html = valueOf(current)
      reportedRef.current = html
      onChange?.(html)
      onJsonChange?.(current.getJSON())
    },
  })

  React.useEffect(() => {
    if (editor) configureBehaviours(editor, { limit: maxLength })
  }, [editor, maxLength])

  React.useEffect(() => {
    if (editor && !editor.isDestroyed && editor.isEditable !== editable) editor.setEditable(editable, false)
  }, [editor, editable])

  // A form's reset puts the starting content back; a controlled value is the parent's to reset.
  const rootRef = React.useRef<HTMLDivElement>(null)
  useFormReset(
    rootRef,
    () => {
      if (!editor || editor.isDestroyed) return
      editor.commands.setContent(defaultValue ?? "", { emitUpdate: false })
      reportedRef.current = valueOf(editor)
    },
    { enabled: value === undefined, form }
  )

  // A controlled value from outside replaces the content, without reporting it back as a change.
  React.useEffect(() => {
    if (!editor || editor.isDestroyed || value === undefined || value === reportedRef.current) return
    if (valueOf(editor) === value) return
    reportedRef.current = value
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  // What the toolbar and the counter show, read from the editor on every render; the editor re-renders this component
  // after each transaction (`shouldRerenderOnTransaction`).
  const state = editor
    ? {
        ready: true,
        empty: editor.isEmpty,
        count: countOf(editor),
        block: (editor.isActive("heading", { level: 1 })
          ? "h1"
          : editor.isActive("heading", { level: 2 })
            ? "h2"
            : editor.isActive("heading", { level: 3 })
              ? "h3"
              : "paragraph") as Block,
        link: editor.isActive("link"),
        canUndo: editable && editor.can().undo(),
        canRedo: editable && editor.can().redo(),
        html: name ? valueOf(editor) : "",
        marks: Object.fromEntries((Object.keys(MARKS) as MarkTool[]).map((mark) => [mark, editor.isActive(mark)])) as Partial<
          Record<MarkTool, boolean>
        >,
      }
    : // Before the editor is made: on the server, and in the browser's first render.
      {
        ready: false,
        empty: initialContent === "",
        count: 0,
        block: "paragraph" as Block,
        link: false,
        canUndo: false,
        canRedo: false,
        html: initialContent,
        marks: {} as Partial<Record<MarkTool, boolean>>,
      }

  // A command from the toolbar: a click puts the caret back in the text; a key press keeps focus in the toolbar.
  const run = (command: (chain: Chain) => Chain, refocus: boolean) => {
    if (!editor || !editable) return
    const chain = editor.chain()
    command(refocus ? chain.focus() : chain).run()
  }

  // The link popover.
  const [linkOpen, setLinkOpen] = React.useState(false)
  const [linkDraft, setLinkDraft] = React.useState("")
  const [linkError, setLinkError] = React.useState(false)
  const returnToText = React.useRef(false)

  const openLink = React.useCallback(
    (fromText: boolean) => {
      if (!editor || !editable) return false
      returnToText.current = fromText
      setLinkDraft((editor.getAttributes("link").href as string | undefined) ?? "")
      setLinkError(false)
      setLinkOpen(true)
      return true
    },
    [editor, editable]
  )

  React.useEffect(() => {
    if (editor) configureBehaviours(editor, { openLink: hasLink ? () => openLink(true) : null })
  }, [editor, hasLink, openLink])

  const applyLink = (event: React.FormEvent) => {
    event.preventDefault()
    // The link form is portalled, but React bubbles its submit through the component tree: without this, a form
    // around the editor would be submitted too.
    event.stopPropagation()
    if (!editor) return
    const href = normaliseLink(linkDraft)
    if (!href) {
      setLinkError(true)
      return
    }
    const chain = editor.chain().focus()
    if (editor.state.selection.empty && !editor.isActive("link")) {
      // The typed address goes in as linked text; what is typed after it is not part of the link.
      chain
        .insertContent({ type: "text", text: linkDraft.trim(), marks: [{ type: "link", attrs: { href } }] })
        .command(({ tr }) => {
          tr.removeStoredMark(editor.schema.marks.link)
          return true
        })
        .run()
    } else {
      chain.extendMarkRange("link").setLink({ href }).run()
    }
    returnToText.current = true
    setLinkOpen(false)
  }

  const removeLink = () => {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run()
    returnToText.current = true
    setLinkOpen(false)
  }

  // The text-style select: opened with the pointer, the caret goes back to the text when it closes.
  const styleByPointer = React.useRef(false)
  const setBlock = (block: string) => {
    run((chain) => (block === "paragraph" ? chain.setParagraph() : chain.setHeading({ level: Number(block.slice(1)) as 1 | 2 | 3 })), false)
  }

  const markLabels: Record<MarkTool, string> = {
    bold: strings.bold,
    italic: strings.italic,
    underline: strings.underline,
    strike: strings.strikethrough,
    code: strings.inlineCode,
    bulletList: strings.bulletList,
    orderedList: strings.orderedList,
    blockquote: strings.blockquote,
  }

  const renderTool = (tool: EditorTool) => {
    switch (tool) {
      case "heading":
        return (
          <Select
            key={tool}
            value={state.block}
            onValueChange={setBlock}
            disabled={!editable}
          >
            <ToolbarPrimitive.Button asChild disabled={!editable}>
              <SelectTrigger
                size="default"
                variant="default"
                data-slot="editor-heading"
                aria-label={strings.textStyle}
                onPointerDown={() => (styleByPointer.current = true)}
                onKeyDown={() => (styleByPointer.current = false)}
                className={cn(
                  "h-6 w-28 gap-2 rounded-sm border-0 bg-transparent py-0 ps-2 pe-1 font-medium text-muted-foreground shadow-none hover:text-foreground focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid data-[placeholder]:text-muted-foreground data-[state=open]:text-primary disabled:bg-transparent disabled:text-muted-foreground disabled:opacity-60 [&_svg]:text-current",
                  "group-data-[size=sm]/editor:h-5 group-data-[size=sm]/editor:w-24 group-data-[size=sm]/editor:text-xs/normal group-data-[size=lg]/editor:h-7 group-data-[size=lg]/editor:w-32 group-data-[size=lg]/editor:text-base/normal"
                )}
              >
                <SelectValue />
              </SelectTrigger>
            </ToolbarPrimitive.Button>
            <SelectContent
              onCloseAutoFocus={(event) => {
                if (!styleByPointer.current || !editor || editor.isDestroyed) return
                event.preventDefault()
                editor.commands.focus()
              }}
            >
              <SelectItem value="paragraph">{strings.paragraph}</SelectItem>
              <SelectItem value="h1">{fillString(strings.heading, { level: 1 })}</SelectItem>
              <SelectItem value="h2">{fillString(strings.heading, { level: 2 })}</SelectItem>
              <SelectItem value="h3">{fillString(strings.heading, { level: 3 })}</SelectItem>
            </SelectContent>
          </Select>
        )
      case "link":
        return (
          <Popover key={tool} open={linkOpen} onOpenChange={(open) => (open ? openLink(false) : setLinkOpen(false))}>
            <PopoverTrigger asChild>
              <ToolbarPrimitive.Button
                type="button"
                data-slot="editor-tool"
                data-tool="link"
                data-active={state.link || undefined}
                aria-label={strings.link}
                aria-keyshortcuts="Control+K Meta+K"
                disabled={!editable}
                onMouseDown={preventBlur}
                className={TOOL_CLASSES}
              >
                <LinkIcon aria-hidden="true" />
              </ToolbarPrimitive.Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              data-slot="editor-link-popover"
              aria-label={strings.link}
              className="w-80 p-3"
              onCloseAutoFocus={(event) => {
                if (!returnToText.current) return
                returnToText.current = false
                if (!editor || editor.isDestroyed) return
                event.preventDefault()
                editor.commands.focus()
              }}
            >
              <form noValidate data-slot="editor-link-form" onSubmit={applyLink} className="flex flex-col gap-2">
                <Label htmlFor={linkInputId}>{strings.linkUrl}</Label>
                <Input
                  id={linkInputId}
                  type="url"
                  size="sm"
                  inputMode="url"
                  autoComplete="url"
                  value={linkDraft}
                  placeholder="https://"
                  aria-invalid={linkError || undefined}
                  aria-describedby={linkError ? linkErrorId : undefined}
                  onChange={(event) => {
                    setLinkDraft(event.target.value)
                    setLinkError(false)
                  }}
                />
                {linkError ? (
                  <p id={linkErrorId} data-slot="editor-link-error" className="text-xs/normal text-destructive-strong">
                    {strings.invalidLink}
                  </p>
                ) : null}
                <div data-slot="editor-link-actions" className="flex justify-end gap-2">
                  {state.link ? (
                    <Button type="button" variant="outline" size="sm" onClick={removeLink}>
                      {strings.removeLink}
                    </Button>
                  ) : null}
                  <Button type="submit" size="sm">
                    {strings.apply}
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        )
      case "undo":
      case "redo": {
        const undo = tool === "undo"
        const Icon = undo ? Undo2Icon : Redo2Icon
        return (
          <ToolbarPrimitive.Button
            key={tool}
            type="button"
            data-slot="editor-tool"
            data-tool={tool}
            aria-label={undo ? strings.undo : strings.redo}
            aria-keyshortcuts={undo ? "Control+Z Meta+Z" : "Control+Shift+Z Meta+Shift+Z Control+Y"}
            disabled={!editable || !(undo ? state.canUndo : state.canRedo)}
            onMouseDown={preventBlur}
            onClick={(event) => run((chain) => (undo ? chain.undo() : chain.redo()), event.detail !== 0)}
            className={TOOL_CLASSES}
          >
            <Icon aria-hidden="true" className="rtl:-scale-x-100" />
          </ToolbarPrimitive.Button>
        )
      }
      default: {
        const mark = MARKS[tool]
        const Icon = mark.icon
        return (
          <ToolbarPrimitive.Button
            key={tool}
            type="button"
            data-slot="editor-tool"
            data-tool={tool}
            aria-label={markLabels[tool]}
            aria-pressed={state.marks[tool] ?? false}
            aria-keyshortcuts={mark.keys}
            disabled={!editable}
            onMouseDown={preventBlur}
            onClick={(event) => run(mark.run, event.detail !== 0)}
            className={TOOL_CLASSES}
          >
            <Icon aria-hidden="true" className={mark.flip ? "rtl:-scale-x-100" : undefined} />
          </ToolbarPrimitive.Button>
        )
      }
    }
  }

  const count = new Intl.NumberFormat(locale).format(state.count)

  return (
    <div
      ref={(node) => shareNode(node, [rootRef, ref])}
      data-slot="editor"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      data-invalid={invalid || undefined}
      className={cn(
        // The field look: the `--control` edge, darker on hover, `--ring` while the text has focus; the toolbar sits
        // inside it, ruled off from the text.
        "group/editor flex w-full min-w-0 flex-col overflow-hidden rounded-md border border-control bg-field text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) hover:border-control-hover has-[.ProseMirror-focused]:border-ring",
        "data-[variant=filled]:bg-field-filled",
        "data-invalid:border-invalid data-invalid:has-[.ProseMirror-focused]:border-ring",
        "data-disabled:cursor-not-allowed data-disabled:border-control data-disabled:bg-field-disabled data-disabled:text-field-disabled-foreground data-disabled:hover:border-control",
        className
      )}
      {...props}
    >
      {showToolbar ? (
        <Toolbar
          data-slot="editor-toolbar"
          aria-label={strings.editorToolbar}
          aria-controls={state.ready ? inputId : undefined}
          className="justify-start gap-x-3.75 gap-y-1 rounded-none border-x-0 border-t-0 border-border bg-transparent p-2 text-muted-foreground group-data-[size=lg]/editor:p-2.5 group-data-[size=sm]/editor:p-1.5"
        >
          {tools.map((group, index) => (
            <ToolbarGroup key={index} data-slot="editor-toolbar-group" className="gap-0">
              {group.map(renderTool)}
            </ToolbarGroup>
          ))}
        </Toolbar>
      ) : null}
      {/* `flex-auto`, so a height in `contentClassName` (`h-80`) sets the area's size; it grows from 160 px otherwise. */}
      <div data-slot="editor-content" className={cn("relative flex min-h-40 flex-auto flex-col overflow-y-auto", contentClassName)}>
        <EditorContent editor={editor} className="flex flex-1 flex-col" />
        {placeholder && state.empty ? (
          <div
            aria-hidden="true"
            data-slot="editor-placeholder"
            className="pointer-events-none absolute inset-x-0 top-0 truncate px-3.75 py-3 text-sm/normal text-muted-foreground italic group-data-[size=lg]/editor:px-4 group-data-[size=lg]/editor:py-3.5 group-data-[size=lg]/editor:text-base/normal group-data-[size=sm]/editor:px-3 group-data-[size=sm]/editor:py-2 group-data-[size=sm]/editor:text-xs/normal"
          >
            {placeholder}
          </div>
        ) : null}
      </div>
      {characterCount ? (
        <div
          id={countId}
          data-slot="editor-count"
          data-full={maxLength !== undefined && state.count >= maxLength ? "" : undefined}
          className="px-3.75 pb-2 text-end text-xs/normal text-muted-foreground tabular-nums data-full:text-foreground group-data-[size=sm]/editor:px-3 group-data-[size=lg]/editor:px-4"
        >
          {maxLength !== undefined
            ? fillString(strings.characterCount, { count, max: new Intl.NumberFormat(locale).format(maxLength) })
            : fillString(strings.characters, { count })}
        </div>
      ) : null}
      {name ? <input type="hidden" name={name} value={state.html} disabled={disabled} form={form} /> : null}
    </div>
  )
}

export { Editor }
export type { EditorTool, EditorProps }
