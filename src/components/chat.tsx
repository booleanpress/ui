"use client"

// Chat: built on native elements — a `role="log"` scroll region, an `article` per message and a `form` composer — with
// Button. The parts follow the shape of shadcn's message, bubble, attachment and marker items.

import * as React from "react"
import {
  ArrowDownIcon,
  CheckIcon,
  CircleAlertIcon,
  ClockIcon,
  FileArchiveIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  PaperclipIcon,
  SendHorizontalIcon,
} from "lucide-react"
import { cn, fillString } from "@/lib/utils"
import { useScrollFocus } from "@/lib/scroll-focus"
import {
  useControlSize,
  useFieldVariant,
  useUiLocale,
  useUiStrings,
  type ControlSize,
  type FieldVariant,
} from "@booleanpress/ui/provider"

import { Button } from "@/components/button"
import { formatFileSize } from "@/lib/format-bytes"

/**
 * A moment in a thread: a `Date`, an ISO string or a timestamp in milliseconds.
 *
 * @since 0.1.1
 */
type ChatTime = Date | string | number

/**
 * Where a message the reader sent stands: `sending`, `sent`, or `failed` (shown with a retry button).
 *
 * @since 0.1.1
 */
type ChatMessageStatus = "sending" | "sent" | "failed"

function toDate(value: ChatTime | undefined): Date | null {
  if (value === undefined) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

// The `datetime` of a `<time>`: the wall-clock date (and time) in the provider's time zone, so the server and the browser
// write the same attribute for the same moment.
function machineDateTime(date: Date, timeZone: string | undefined, withTime: boolean): string {
  const parts: Record<string, string> = {}
  for (const part of new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date)) {
    parts[part.type] = part.value
  }
  const day = `${parts.year}-${parts.month}-${parts.day}`
  return withTime ? `${day}T${parts.hour}:${parts.minute}` : day
}

// How close to the bottom, in pixels, still counts as reading the latest message.
const STICK_DISTANCE = 32

/** @since 0.1.1 */
function ChatThread({
  className,
  children,
  onScroll,
  "aria-label": ariaLabel,
  ...props
}: React.ComponentProps<"div">) {
  const strings = useUiStrings()
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const { attach, tabIndex } = useScrollFocus<HTMLDivElement>()
  const setViewport = React.useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node
      attach(node)
    },
    [attach]
  )
  // Whether the reader is at the bottom, and how many messages the thread held when last checked; kept outside state, so
  // scrolling never re-renders.
  const atBottom = React.useRef(true)
  const messageCount = React.useRef(-1)
  const [unseen, setUnseen] = React.useState(false)

  // After every change of the content: stay at the bottom if the reader was there, or if they sent the newest message;
  // otherwise offer the jump to the new messages.
  const follow = React.useCallback(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content) return
    const messages = content.querySelectorAll("[data-slot=chat-message]")
    const added = messageCount.current >= 0 && messages.length > messageCount.current
    messageCount.current = messages.length
    const ownNewest = added && messages[messages.length - 1]?.getAttribute("data-side") === "end"
    if (atBottom.current || ownNewest) {
      atBottom.current = true
      viewport.scrollTop = viewport.scrollHeight
      setUnseen(false)
    } else if (added) {
      setUnseen(true)
    }
  }, [])

  React.useLayoutEffect(follow)

  // Pictures that load and other changes of height that are not a render of the thread, and the thread's own height
  // changing (a composer below it growing, the window resized): a reader at the bottom stays there.
  React.useEffect(() => {
    const viewport = viewportRef.current
    const content = contentRef.current
    if (!viewport || !content || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => follow())
    observer.observe(content)
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [follow])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    onScroll?.(event)
    const viewport = event.currentTarget
    atBottom.current = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <= STICK_DISTANCE
    if (atBottom.current) setUnseen(false)
  }

  const jump = () => {
    const viewport = viewportRef.current
    if (!viewport) return
    atBottom.current = true
    const reduce = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (typeof viewport.scrollTo === "function") {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: reduce ? "auto" : "smooth" })
    } else {
      viewport.scrollTop = viewport.scrollHeight
    }
    setUnseen(false)
    // The button goes away: focus moves to the thread, where the arrow keys keep scrolling.
    viewport.focus({ preventScroll: true })
  }

  return (
    <div data-slot="chat-thread" className={cn("relative flex min-h-0 flex-col", className)} {...props}>
      <div
        ref={setViewport}
        role="log"
        aria-label={ariaLabel ?? strings.chatThread}
        // In the tab order while it scrolls with nothing focusable inside; always focusable from code, for the jump.
        tabIndex={tabIndex ?? -1}
        data-slot="chat-thread-viewport"
        onScroll={handleScroll}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-[inherit] outline-none [scrollbar-color:var(--border)_transparent] [scrollbar-width:thin] focus-visible:outline-1 focus-visible:-outline-offset-1 focus-visible:outline-ring focus-visible:outline-solid"
      >
        <div ref={contentRef} data-slot="chat-thread-content" className="flex flex-col gap-4 p-4">
          {children}
        </div>
      </div>
      {unseen ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          rounded
          data-slot="chat-thread-jump"
          onClick={jump}
          className="absolute bottom-3 start-1/2 -translate-x-1/2 bg-background shadow-md hover:bg-subtle rtl:translate-x-1/2 dark:bg-popover dark:hover:bg-accent"
        >
          <ArrowDownIcon aria-hidden="true" />
          {strings.newMessages}
        </Button>
      ) : null}
    </div>
  )
}

/** @since 0.1.1 */
function ChatMessage({
  side = "start",
  author,
  avatar,
  time,
  timeFormat,
  status,
  onRetry,
  continued = false,
  className,
  children,
  ...props
}: React.ComponentProps<"article"> & {
  /** `start` for the other people in the thread, `end` for the reader's own messages: their side and bubble colour. */
  side?: "start" | "end"
  /** Who wrote it. Shown above the message, and read with it even when `continued` hides it. */
  author: React.ReactNode
  /** An `Avatar` beside the message. */
  avatar?: React.ReactNode
  /** When it was sent: formatted in the provider's locale and time zone. */
  time?: ChatTime
  /** How to write the time; the hour and minute by default. */
  timeFormat?: Intl.DateTimeFormatOptions
  /** Where a message the reader sent stands, shown under it. */
  status?: ChatMessageStatus
  /** Called by the retry button a failed message shows. Without it, a failed message shows no button. */
  onRetry?: () => void
  /** A follow-up from the same author: the avatar, name and time are hidden, and still read by screen readers. */
  continued?: boolean
}) {
  const strings = useUiStrings()
  const { locale, timeZone } = useUiLocale()
  const statusRef = React.useRef<HTMLDivElement>(null)
  const date = toDate(time)

  const retry = () => {
    onRetry?.()
    // The button goes away as the message is sent again: focus stays on the status, which now reads "Sending".
    statusRef.current?.focus()
  }

  const statusIcon =
    status === "sending" ? <ClockIcon aria-hidden="true" /> : status === "sent" ? <CheckIcon aria-hidden="true" /> : <CircleAlertIcon aria-hidden="true" />
  const statusText =
    status === "sending" ? strings.messageSending : status === "sent" ? strings.messageSent : strings.messageFailed

  return (
    <article
      data-slot="chat-message"
      data-side={side}
      data-status={status}
      data-continued={continued || undefined}
      className={cn(
        "group/chat-message flex w-full min-w-0 items-start gap-2.5 text-sm/normal data-[side=end]:flex-row-reverse data-continued:-mt-2.5",
        className
      )}
      {...props}
    >
      {avatar ? (
        // The author's name is read with every message, so the avatar is hidden from screen readers.
        <div data-slot="chat-message-avatar" aria-hidden="true" className={cn("flex shrink-0", continued && "invisible")}>
          {avatar}
        </div>
      ) : null}
      <div
        data-slot="chat-message-body"
        className="flex max-w-[80%] min-w-0 flex-col items-start gap-1 group-data-[side=end]/chat-message:items-end"
      >
        <div
          data-slot="chat-message-header"
          className={cn(
            "flex max-w-full min-w-0 items-baseline gap-2 text-xs/normal text-muted-foreground group-data-[side=end]/chat-message:flex-row-reverse",
            continued && "sr-only"
          )}
        >
          <span data-slot="chat-message-author" className="truncate font-medium text-foreground">
            {author}
          </span>
          {date ? (
            // `dir="auto"`: "3:00 PM" keeps its order on a right-to-left page, and follows the locale's own.
            <time
              data-slot="chat-message-time"
              dir="auto"
              dateTime={machineDateTime(date, timeZone, true)}
              className="shrink-0 tabular-nums"
            >
              {new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", ...timeFormat, timeZone }).format(date)}
            </time>
          ) : null}
        </div>
        {children}
        {status ? (
          <div
            ref={statusRef}
            tabIndex={-1}
            data-slot="chat-message-status"
            data-status={status}
            className="flex items-center gap-1 text-xs/normal text-muted-foreground outline-none data-[status=failed]:text-destructive-strong [&_svg]:size-3 [&_svg]:shrink-0"
          >
            {statusIcon}
            <span data-slot="chat-message-status-text">{statusText}</span>
            {status === "failed" && onRetry ? (
              <Button
                type="button"
                variant="link"
                size="xs"
                data-slot="chat-message-retry"
                onClick={retry}
                className="ms-1 h-auto p-0 text-xs/normal text-destructive-strong underline focus-visible:outline-destructive"
              >
                {strings.retry}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

/** @since 0.1.1 */
function ChatBubble({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** `default` draws the bubble: the muted fill for others, the primary fill for the reader. `plain` is text alone. */
  variant?: "default" | "plain"
}) {
  return (
    <div
      data-slot="chat-bubble"
      data-variant={variant}
      // Each message takes the direction of its own text, as people write in more than one language.
      dir="auto"
      className={cn(
        "w-fit max-w-full min-w-0 rounded-xl bg-muted px-3 py-2 text-sm/normal break-words whitespace-pre-wrap text-foreground [&_a]:underline",
        "group-data-[side=start]/chat-message:rounded-ss-sm group-data-[side=end]/chat-message:rounded-se-sm group-data-[side=end]/chat-message:bg-primary group-data-[side=end]/chat-message:text-primary-foreground",
        // A message on its way is drawn lighter until it is sent.
        "group-data-[status=sending]/chat-message:opacity-70",
        "data-[variant=plain]:rounded-none data-[variant=plain]:bg-transparent data-[variant=plain]:p-0 data-[variant=plain]:text-foreground group-data-[side=end]/chat-message:data-[variant=plain]:bg-transparent group-data-[side=end]/chat-message:data-[variant=plain]:text-foreground",
        className
      )}
      {...props}
    />
  )
}

/** The icon of a file's type. */
function AttachmentIcon({ type, name }: { type: string; name: string }) {
  if (type.startsWith("image/")) return <FileImageIcon aria-hidden="true" />
  if (/zip|compressed|tar|gzip|rar|7z/.test(type) || /\.(zip|gz|tgz|rar|7z)$/i.test(name)) return <FileArchiveIcon aria-hidden="true" />
  if (type.startsWith("text/") || /pdf|json|xml|csv|document|sheet|presentation/.test(type)) return <FileTextIcon aria-hidden="true" />
  return <FileIcon aria-hidden="true" />
}

/** @since 0.1.1 */
function ChatAttachment({
  name,
  size,
  type = "",
  href,
  download,
  src,
  alt,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** The file's name. */
  name: string
  /** The file's size in bytes, written in the provider's locale (`84 kB`). */
  size?: number
  /** The file's MIME type, which picks its icon. */
  type?: string
  /** Where the file is: the name becomes a link, and the whole chip opens it. */
  href?: string
  /** Downloads the file instead of opening it, as the anchor's `download` attribute. */
  download?: boolean | string
  /** A picture to show in place of the chip, for an image. */
  src?: string
  /** The picture's text alternative; the file's `name` by default. Pass `""` for a picture that adds nothing to the text. */
  alt?: string
}) {
  const { locale } = useUiLocale()
  const downloadAttribute = download === true ? "" : download || undefined

  if (src) {
    const picture = (
      <img data-slot="chat-attachment-image" src={src} alt={alt ?? name} className="block max-h-60 max-w-full rounded-lg border border-border object-cover" />
    )
    return (
      <div data-slot="chat-attachment" data-kind="image" className={cn("max-w-full", className)} {...props}>
        {href ? (
          <a
            href={href}
            download={downloadAttribute}
            className="block rounded-lg outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid"
          >
            {picture}
          </a>
        ) : (
          picture
        )}
      </div>
    )
  }

  return (
    <div
      data-slot="chat-attachment"
      data-kind="file"
      className={cn(
        // The file-upload row's look, as a chip: the type icon on the secondary fill, the name, the size below.
        "relative flex w-72 max-w-full min-w-0 items-center gap-2.5 rounded-lg border border-border bg-card p-2 pe-3 text-card-foreground transition-[background-color,border-color] duration-(--bui-duration-control) has-[a:hover]:bg-subtle",
        className
      )}
      {...props}
    >
      <span
        data-slot="chat-attachment-icon"
        className="flex size-10 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground [&_svg]:size-4.5"
      >
        <AttachmentIcon type={type} name={name} />
      </span>
      <span data-slot="chat-attachment-info" className="flex min-w-0 flex-col">
        {href ? (
          <a
            href={href}
            download={downloadAttribute}
            data-slot="chat-attachment-name"
            dir="auto"
            title={name}
            className="truncate text-sm/normal font-medium text-foreground outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:outline-1 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring focus-visible:after:outline-solid"
          >
            {name}
          </a>
        ) : (
          <span data-slot="chat-attachment-name" dir="auto" title={name} className="truncate text-sm/normal font-medium text-foreground">
            {name}
          </span>
        )}
        {size !== undefined ? (
          <span data-slot="chat-attachment-size" dir="auto" className="text-xs/normal text-muted-foreground tabular-nums">
            {formatFileSize(size, locale)}
          </span>
        ) : null}
      </span>
    </div>
  )
}

/** @since 0.1.1 */
function ChatDateSeparator({
  date,
  format,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The day the messages below were sent; written in the provider's locale and time zone. */
  date?: ChatTime
  /** How to write the date; the weekday, day and month by default. */
  format?: Intl.DateTimeFormatOptions
}) {
  const { locale, timeZone } = useUiLocale()
  const day = toDate(date)
  const label =
    children ??
    (day ? new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", ...format, timeZone }).format(day) : null)

  return (
    <div
      data-slot="chat-date-separator"
      className={cn(
        "flex items-center gap-3 text-xs/normal font-medium text-muted-foreground before:h-px before:min-w-4 before:flex-1 before:bg-border after:h-px after:min-w-4 after:flex-1 after:bg-border",
        className
      )}
      {...props}
    >
      {day ? (
        <time data-slot="chat-date-separator-label" dir="auto" dateTime={machineDateTime(day, timeZone, false)} className="shrink-0 text-center">
          {label}
        </time>
      ) : (
        <span data-slot="chat-date-separator-label" className="shrink-0 text-center">
          {label}
        </span>
      )}
    </div>
  )
}

/** @since 0.1.1 */
function ChatTypingIndicator({
  name,
  avatar,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  /** Who is typing: read as the provider's `typing` string, "{name} is typing". */
  name: string
  /** An `Avatar` beside the dots, as on that person's messages. */
  avatar?: React.ReactNode
}) {
  const strings = useUiStrings()
  const dot = "size-1.5 rounded-full bg-muted-foreground animate-pulse"

  return (
    <div data-slot="chat-typing-indicator" className={cn("flex items-start gap-2.5", className)} {...props}>
      {avatar ? (
        <div data-slot="chat-typing-indicator-avatar" className="flex shrink-0">
          {avatar}
        </div>
      ) : null}
      {/* Three dots that fade in turn; under reduced motion they stand still. */}
      <div
        data-slot="chat-typing-indicator-dots"
        aria-hidden="true"
        className="flex h-9 items-center gap-1 rounded-xl rounded-ss-sm bg-muted px-3"
      >
        <span data-slot="chat-typing-indicator-dot" className={dot} />
        <span data-slot="chat-typing-indicator-dot" className={cn(dot, "[animation-delay:200ms]")} />
        <span data-slot="chat-typing-indicator-dot" className={cn(dot, "[animation-delay:400ms]")} />
      </div>
      <span data-slot="chat-typing-indicator-label" className="sr-only">
        {fillString(strings.typing, { name })}
      </span>
    </div>
  )
}

const composerButtonSizes = { sm: "icon-xs", default: "icon-sm", lg: "icon" } as const

/** @since 0.1.1 */
function ChatComposer({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSend,
  onAttach,
  accept,
  multiple = true,
  placeholder,
  disabled = false,
  size,
  variant,
  className,
  children,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  ...props
}: Omit<React.ComponentProps<"form">, "onSubmit" | "defaultValue"> & {
  /** The text being written, controlled. */
  value?: string
  /** The text to start with, uncontrolled. */
  defaultValue?: string
  /** Called as the text changes, and with `""` once it is sent. */
  onValueChange?: (value: string) => void
  /**
   * Called with the text, trimmed, when Enter or the send button sends it. The field then empties. With attachments
   * in the composer's children, it can be called with `""`: the files are sent alone.
   */
  onSend?: (text: string) => void
  /** Shows the attach button: it opens the system's file picker and passes the chosen files here. */
  onAttach?: (files: File[]) => void
  /** The file types the picker offers, as the file input's `accept`. */
  accept?: string
  /** Lets the picker choose more than one file. */
  multiple?: boolean
  /** The hint shown while the field is empty. */
  placeholder?: string
  /** Stops writing, attaching and sending. */
  disabled?: boolean
  /** The text size, padding and buttons: 12, 14 or 16 px text. Defaults to the provider's `controlSize`. */
  size?: ControlSize
  /** `filled` draws the grey `--field-filled` fill. Defaults to the provider's `fieldVariant`. */
  variant?: FieldVariant
}) {
  const strings = useUiStrings()
  const resolvedSize = useControlSize(size)
  const resolvedVariant = useFieldVariant(variant)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolled
  // Attachments shown in the composer can be sent without text.
  const hasAttachments = React.Children.toArray(children).length > 0
  const canSend = !disabled && (value.trim() !== "" || hasAttachments)

  const setValue = (next: string) => {
    if (valueProp === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  // The field grows with its text, up to its maximum height, then scrolls. It is measured at its natural height while
  // the composer keeps its own, so a thread that shares a column with it is not resized for the measurement: the
  // thread's scroll position would be clamped, and a reader at the newest message would lose it.
  React.useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    const frame = textarea.closest<HTMLElement>("[data-slot=chat-composer]")
    const height = frame?.style.height ?? ""
    if (frame) frame.style.height = `${frame.offsetHeight}px`
    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
    if (frame) frame.style.height = height
  }, [value, resolvedSize])

  const send = () => {
    if (!canSend) return
    onSend?.(value.trim())
    setValue("")
    textareaRef.current?.focus()
  }

  const buttonSize = composerButtonSizes[resolvedSize]

  return (
    <form
      data-slot="chat-composer"
      data-size={resolvedSize}
      data-variant={resolvedVariant}
      data-disabled={disabled || undefined}
      onSubmit={(event) => {
        event.preventDefault()
        send()
      }}
      className={cn(
        "group/chat-composer flex flex-col gap-1 rounded-md border border-control bg-field p-1 text-foreground shadow-xs transition-[color,background-color,border-color,outline-color,box-shadow] duration-(--bui-duration-control) hover:border-control-hover focus-within:border-ring data-[size=sm]:p-0.5",
        "data-[variant=filled]:bg-field-filled",
        "data-disabled:cursor-not-allowed data-disabled:border-control data-disabled:bg-field-disabled data-disabled:text-field-disabled-foreground",
        className
      )}
      {...props}
    >
      {hasAttachments ? (
        <div data-slot="chat-composer-attachments" className="flex flex-wrap gap-2 p-1">
          {children}
        </div>
      ) : null}
      <div data-slot="chat-composer-row" className="flex items-end gap-1">
        {onAttach ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size={buttonSize}
              data-slot="chat-composer-attach"
              aria-label={strings.attachFile}
              disabled={disabled}
              onClick={() => fileRef.current?.click()}
              className="text-muted-foreground hover:text-foreground"
            >
              <PaperclipIcon aria-hidden="true" />
            </Button>
            <input
              ref={fileRef}
              type="file"
              hidden
              tabIndex={-1}
              accept={accept}
              multiple={multiple}
              data-slot="chat-composer-file"
              onChange={(event) => {
                const files = Array.from(event.currentTarget.files ?? [])
                event.currentTarget.value = ""
                if (files.length) onAttach(files)
              }}
            />
          </>
        ) : null}
        <textarea
          ref={textareaRef}
          rows={1}
          data-slot="chat-composer-input"
          aria-label={ariaLabel ?? strings.chatMessage}
          aria-describedby={ariaDescribedBy}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            // Enter sends, Shift+Enter starts a new line; Enter that confirms an input method's composition does neither.
            // Safari ends the composition before that Enter's keydown, which it marks with key code 229 instead.
            if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing || event.keyCode === 229) return
            event.preventDefault()
            send()
          }}
          className={cn(
            "max-h-40 min-w-0 flex-1 resize-none bg-transparent px-1.5 py-[0.21875rem] text-sm/normal text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:text-field-disabled-foreground",
            "group-data-[size=sm]/chat-composer:py-0.75 group-data-[size=sm]/chat-composer:text-xs/normal group-data-[size=lg]/chat-composer:py-1.5 group-data-[size=lg]/chat-composer:text-base/normal"
          )}
        />
        <Button
          type="submit"
          size={buttonSize}
          data-slot="chat-composer-send"
          aria-label={strings.sendMessage}
          disabled={!canSend}
        >
          <SendHorizontalIcon aria-hidden="true" className="rtl:-scale-x-100" />
        </Button>
      </div>
    </form>
  )
}

export { ChatThread, ChatMessage, ChatBubble, ChatAttachment, ChatDateSeparator, ChatTypingIndicator, ChatComposer }
export type { ChatTime, ChatMessageStatus }
