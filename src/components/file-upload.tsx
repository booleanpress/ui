"use client"

// File upload: built on a native file input and the HTML drag-and-drop events, with Button and Progress.

import * as React from "react"
import { cn, fillString } from "@/lib/utils"
// The size formatter is shared with Chat and Format; this entry re-exports it as `formatFileSize`.
import { formatFileSize } from "@/lib/format-bytes"
import {
  CloudUploadIcon,
  FileArchiveIcon,
  FileAudioIcon,
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  PlusIcon,
  UploadIcon,
  XIcon,
} from "lucide-react"
import { Slot } from "radix-ui"

import { useUiLocale, useUiStrings } from "@booleanpress/ui/provider"

import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Progress } from "@/components/progress"

/**
 * Where a file stands: `queued` (added, not sent), `uploading`, `done` or `error`.
 *
 * @since 0.1.0
 */
type FileUploadStatus = "queued" | "uploading" | "done" | "error"

/**
 * One file in the list, with its status and progress.
 *
 * @since 0.1.0
 */
interface FileUploadFile {
  /** Stable for the life of the entry: use it as the React key. */
  id: string
  file: File
  status: FileUploadStatus
  /** 0 to 100 while uploading; 100 once done. */
  progress: number
  /** The message shown when `status` is `error`. */
  error?: string
}

/**
 * A file that was not added, and why: `type` (not in `accept`), `size` (over `maxSize`) or `count` (over `maxFiles`).
 *
 * @since 0.1.0
 */
interface FileUploadRejection {
  file: File
  reason: "type" | "size" | "count"
  /** The translated message the component shows and announces. */
  message: string
}

/**
 * What `onUpload` receives beside the files: report progress and per-file failures, and stop when `signal` aborts.
 *
 * @since 0.1.0
 */
interface FileUploadHelpers {
  /** Reports one file's progress, from 0 to 100. */
  onProgress: (file: File, percent: number) => void
  /** Marks one file as failed, with the message to show (the provider's `uploadFailed` by default). */
  onError: (file: File, message?: string) => void
  /**
   * Aborts when the batch stops mattering during the upload: the files are cleared, every file of the batch is removed
   * (or replaced), or the component unmounts.
   */
  signal: AbortSignal
  /** One file's signal: aborts when that file is removed (or replaced), and whenever `signal` aborts. Pass it to that file's request. */
  fileSignal: (file: File) => AbortSignal
}

/**
 * The app's upload: send the files, call `onProgress` as they go, and resolve when done. A rejected promise marks every
 * file of the batch as failed.
 *
 * @since 0.1.0
 */
type FileUploadHandler = (files: File[], helpers: FileUploadHelpers) => Promise<void> | void

/**
 * What `useFileUpload()` returns, for a layout of your own.
 *
 * @since 0.1.0
 */
interface FileUploadState {
  files: FileUploadFile[]
  rejections: FileUploadRejection[]
  accept: string | undefined
  multiple: boolean
  maxSize: number | undefined
  maxFiles: number | undefined
  disabled: boolean
  /** Checks the files and adds those that pass; the others become rejections. */
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  /** Sends every queued file through `onUpload`. */
  upload: () => Promise<void>
  /** Aborts running uploads and empties the list and the messages. */
  clear: () => void
  /** Opens the system's file picker. */
  openPicker: () => void
}

const FileUploadContext = React.createContext<FileUploadState | null>(null)

/**
 * The state of the nearest `FileUpload`, for parts of your own: the files, the messages and the actions.
 *
 * @since 0.1.0
 */
function useFileUpload(): FileUploadState {
  const context = React.useContext(FileUploadContext)
  if (!context) throw new Error("useFileUpload must be used inside <FileUpload>.")
  return context
}

// Whether a file matches an `accept` list: extensions (`.csv`), wildcards (`image/*`, and `*` or `*/*` for any file) and
// exact types.
function matchesAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
  if (tokens.length === 0) return true
  const name = file.name.toLowerCase()
  const type = (file.type || "").toLowerCase()
  return tokens.some((token) => {
    if (token === "*" || token === "*/*") return true
    if (token.startsWith(".")) return name.endsWith(token)
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1))
    return type === token
  })
}

function clampPercent(percent: number): number {
  if (!Number.isFinite(percent)) return 0
  return Math.min(100, Math.max(0, percent))
}

const isImage = (file: File) => file.type.startsWith("image/")

/** A running upload: its controller and one controller per file, keyed by the entry's id. */
interface RunningBatch {
  controller: AbortController
  files: Map<string, AbortController>
}

// The folders a drop brought, which the browser lists among its files but which cannot be read or sent: the drop zone
// marks them here before it adds the files, and the check refuses them. Internal to this entry.
const FolderContext = React.createContext<WeakSet<File> | null>(null)

/**
 * The dropped files, and which of them are folders: read from the drop's items (`webkitGetAsEntry`), which list the
 * files in the same order as `files`.
 */
function readDrop(transfer: DataTransfer): { files: File[]; folders: File[] } {
  const files = Array.from(transfer.files)
  const folders: File[] = []
  let index = 0
  for (const item of Array.from(transfer.items ?? [])) {
    if (item.kind !== "file") continue
    const entry = typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null
    if (entry?.isDirectory && files[index]) folders.push(files[index])
    index += 1
  }
  return { files, folders }
}

/** @since 0.1.0 */
function FileUpload({
  accept,
  multiple = false,
  maxSize,
  maxFiles,
  disabled = false,
  auto = false,
  defaultFiles,
  onUpload,
  onFilesChange,
  onReject,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  /** The file types to take, as the native input's `accept`: `"image/*"`, `".csv,.txt"`, `"application/pdf"`. */
  accept?: string
  /** Takes several files; without it, a new file replaces the one chosen. */
  multiple?: boolean
  /** The largest file, in bytes. A larger one is refused with the provider's `fileTooLarge`. */
  maxSize?: number
  /** The most files the list holds, with `multiple`. Files over it are refused with `tooManyFiles`. */
  maxFiles?: number
  /** Stops picking, dropping, uploading and removing; the parts show as disabled. */
  disabled?: boolean
  /** Uploads files as soon as they are added, so no Upload button is needed. */
  auto?: boolean
  /** Files in the list from the start, checked like added ones. Read once, on mount. */
  defaultFiles?: File[]
  /** Sends the files; the component itself never touches the network. */
  onUpload?: FileUploadHandler
  /** Called with the whole list whenever a file is added, removed or changes status. */
  onFilesChange?: (files: FileUploadFile[]) => void
  /** Called with the files that were refused, and why. */
  onReject?: (rejections: FileUploadRejection[]) => void
}) {
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const baseId = React.useId()
  const counter = React.useRef(0)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const batches = React.useRef(new Set<RunningBatch>())
  const [folders] = React.useState(() => new WeakSet<File>())
  const mounted = React.useRef(true)

  const callbacks = React.useRef({ onUpload, onFilesChange, onReject })
  React.useEffect(() => {
    callbacks.current = { onUpload, onFilesChange, onReject }
  })

  const nextId = React.useCallback(() => {
    counter.current += 1
    return `${baseId}-file-${counter.current}`
  }, [baseId])

  // Checks incoming files against `accept`, `maxSize` and the room left, in that order.
  const check = React.useCallback(
    (incoming: File[], current: number) => {
      const passed: File[] = []
      const rejected: FileUploadRejection[] = []
      for (const file of incoming) {
        if (folders.has(file)) {
          rejected.push({ file, reason: "type", message: fillString(strings.folderNotAllowed, { name: file.name }) })
        } else if (accept && !matchesAccept(file, accept)) {
          rejected.push({ file, reason: "type", message: fillString(strings.fileTypeNotAllowed, { name: file.name }) })
        } else if (maxSize !== undefined && file.size > maxSize) {
          rejected.push({
            file,
            reason: "size",
            message: fillString(strings.fileTooLarge, { name: file.name, size: formatFileSize(maxSize, locale) }),
          })
        } else {
          passed.push(file)
        }
      }
      const limit = multiple ? (maxFiles ?? Number.POSITIVE_INFINITY) : 1
      const room = Math.max(0, limit - (multiple ? current : 0))
      const count = new Intl.NumberFormat(locale).format(limit)
      for (const file of passed.slice(room)) {
        rejected.push({ file, reason: "count", message: fillString(strings.tooManyFiles, { count }) })
      }
      return { accepted: passed.slice(0, room), rejected }
    },
    [accept, maxSize, maxFiles, multiple, strings, locale, folders]
  )

  const [initial] = React.useState(() => {
    const { accepted, rejected } = check(defaultFiles ?? [], 0)
    return {
      files: accepted.map<FileUploadFile>((file, index) => ({ id: `${baseId}-initial-${index}`, file, status: "queued", progress: 0 })),
      rejections: rejected,
    }
  })
  const [files, setFiles] = React.useState<FileUploadFile[]>(initial.files)
  const [rejections, setRejections] = React.useState<FileUploadRejection[]>(initial.rejections)
  const filesRef = React.useRef(files)

  // The list lives in a ref as well, so an upload that resolves later reads the current entries.
  const update = React.useCallback((change: (previous: FileUploadFile[]) => FileUploadFile[]) => {
    const next = change(filesRef.current)
    if (next === filesRef.current) return
    filesRef.current = next
    // A file removed or replaced during its upload aborts its signal; a batch with none of its files left aborts whole.
    if (batches.current.size > 0) {
      const present = new Set(next.map((entry) => entry.id))
      for (const batch of batches.current) {
        let remaining = 0
        batch.files.forEach((controller, id) => {
          if (present.has(id)) remaining += 1
          else controller.abort()
        })
        if (remaining === 0) batch.controller.abort()
      }
    }
    setFiles(next)
    callbacks.current.onFilesChange?.(next)
  }, [])

  // The polite live region: each announcement replaces the last, keyed so the same words are read again.
  const [announcement, setAnnouncement] = React.useState<{ key: number; messages: string[] }>({ key: 0, messages: [] })
  const announce = React.useCallback((messages: string[]) => {
    if (messages.length === 0) return
    setAnnouncement((previous) => ({ key: previous.key + 1, messages }))
  }, [])

  React.useEffect(() => {
    mounted.current = true
    const running = batches.current
    return () => {
      mounted.current = false
      running.forEach((batch) => batch.controller.abort())
      running.clear()
    }
  }, [])

  const send = React.useCallback(
    async (queue: FileUploadFile[]) => {
      const handler = callbacks.current.onUpload
      const batchEntries = queue.filter((entry) => entry.status === "queued")
      const ids = new Set(batchEntries.map((entry) => entry.id))
      if (!handler || disabled || ids.size === 0) return
      const controller = new AbortController()
      const batch: RunningBatch = { controller, files: new Map() }
      ids.forEach((id) => batch.files.set(id, new AbortController()))
      const abortFiles = () => batch.files.forEach((fileController) => fileController.abort())
      controller.signal.addEventListener("abort", abortFiles, { once: true })
      batches.current.add(batch)
      const entryOf = (file: File) => filesRef.current.find((entry) => entry.file === file && ids.has(entry.id))
      update((previous) =>
        previous.map((entry) => (ids.has(entry.id) ? { ...entry, status: "uploading", progress: 0, error: undefined } : entry))
      )
      const helpers: FileUploadHelpers = {
        signal: controller.signal,
        fileSignal: (file) => {
          const entry = batchEntries.find((item) => item.file === file)
          return (entry && batch.files.get(entry.id)?.signal) || controller.signal
        },
        onProgress: (file, percent) => {
          const entry = entryOf(file)
          if (controller.signal.aborted || !entry || entry.status !== "uploading") return
          const progress = clampPercent(percent)
          update((previous) => previous.map((item) => (item.id === entry.id ? { ...item, progress } : item)))
        },
        onError: (file, message) => {
          const entry = entryOf(file)
          if (controller.signal.aborted || !entry || entry.status !== "uploading") return
          update((previous) =>
            previous.map((item) =>
              item.id === entry.id ? { ...item, status: "error", error: message ?? strings.uploadFailed } : item
            )
          )
        },
      }
      let succeeded = true
      try {
        await handler(
          batchEntries.map((entry) => entry.file),
          helpers
        )
      } catch {
        succeeded = false
      }
      batches.current.delete(batch)
      if (controller.signal.aborted || !mounted.current) return
      update((previous) =>
        previous.map((entry) => {
          if (!ids.has(entry.id) || entry.status !== "uploading") return entry
          return succeeded
            ? { ...entry, status: "done", progress: 100 }
            : { ...entry, status: "error", error: strings.uploadFailed }
        })
      )
      const failed = filesRef.current.some((entry) => ids.has(entry.id) && entry.status === "error")
      announce([failed ? strings.uploadFailed : strings.uploadComplete])
    },
    [disabled, update, announce, strings]
  )

  const addFiles = React.useCallback(
    (list: FileList | File[]) => {
      const incoming = Array.from(list)
      if (disabled || incoming.length === 0) return
      const { accepted, rejected } = check(incoming, filesRef.current.length)
      const entries = accepted.map<FileUploadFile>((file) => ({ id: nextId(), file, status: "queued", progress: 0 }))
      if (entries.length > 0) update((previous) => (multiple ? [...previous, ...entries] : entries))
      setRejections(rejected)
      if (rejected.length > 0) callbacks.current.onReject?.(rejected)
      const messages: string[] = []
      if (entries.length === 1) messages.push(fillString(strings.fileAdded, { name: entries[0].file.name }))
      if (entries.length > 1)
        messages.push(fillString(strings.filesAdded, { count: new Intl.NumberFormat(locale).format(entries.length) }))
      messages.push(...new Set(rejected.map((rejection) => rejection.message)))
      announce(messages)
      if (auto && entries.length > 0) void send(entries)
    },
    [disabled, check, nextId, update, multiple, strings, locale, announce, auto, send]
  )

  const removeFile = React.useCallback(
    (id: string) => {
      if (disabled) return
      update((previous) => previous.filter((entry) => entry.id !== id))
    },
    [disabled, update]
  )

  const upload = React.useCallback(() => send(filesRef.current), [send])

  const clear = React.useCallback(() => {
    batches.current.forEach((batch) => batch.controller.abort())
    batches.current.clear()
    update(() => [])
    setRejections([])
  }, [update])

  const openPicker = React.useCallback(() => {
    if (!disabled) inputRef.current?.click()
  }, [disabled])

  const state = React.useMemo<FileUploadState>(
    () => ({
      files,
      rejections,
      accept,
      multiple,
      maxSize,
      maxFiles,
      disabled,
      addFiles,
      removeFile,
      upload,
      clear,
      openPicker,
    }),
    [files, rejections, accept, multiple, maxSize, maxFiles, disabled, addFiles, removeFile, upload, clear, openPicker]
  )

  return (
    <FileUploadContext.Provider value={state}>
      <FolderContext.Provider value={folders}>
        <div
          data-slot="file-upload"
          data-disabled={disabled || undefined}
          className={cn("flex flex-col gap-3.5 text-sm/normal text-foreground", className)}
          {...props}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            data-slot="file-upload-input"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(event) => {
              if (event.currentTarget.files) addFiles(event.currentTarget.files)
              // Emptied, so choosing the same file again still reports a change.
              event.currentTarget.value = ""
            }}
          />
          {children}
          <div role="status" aria-live="polite" data-slot="file-upload-status" className="sr-only">
            <div key={announcement.key}>
              {announcement.messages.map((message, index) => (
                <p key={index}>{message}</p>
              ))}
            </div>
          </div>
        </div>
      </FolderContext.Provider>
    </FileUploadContext.Provider>
  )
}

// Text or a link dragged from the page carries no files: the drop zone does not light up for it.
function carriesFiles(event: React.DragEvent): boolean {
  const types = event.dataTransfer?.types
  return !types || Array.from(types).includes("Files")
}

/** @since 0.1.0 */
function FileUploadDropzone({
  className,
  children,
  title,
  description,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  ...props
}: Omit<React.ComponentProps<"div">, "title"> & {
  /** The prompt's first line, without children. Defaults to the provider's `dropFilesHere`. */
  title?: React.ReactNode
  /** The prompt's second line, without children. Defaults to the provider's `browseFiles`. */
  description?: React.ReactNode
}) {
  const { addFiles, openPicker, disabled } = useFileUpload()
  const folders = React.useContext(FolderContext)
  const strings = useUiStrings()
  const [dragging, setDragging] = React.useState(false)
  const depth = React.useRef(0)

  return (
    <div
      data-slot="file-upload-dropzone"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        // The visual target's drop zone: a dashed 1px edge in the content border colour, 8px radius, 16px padding; it
        // turns the primary colour while files are dragged over it.
        "rounded-lg border border-dashed border-border p-4 transition-[border-color,background-color] duration-(--bui-duration-control) data-[disabled]:opacity-60 data-[dragging]:border-primary",
        className
      )}
      onDragEnter={(event) => {
        onDragEnter?.(event)
        event.preventDefault()
        if (disabled || !carriesFiles(event)) return
        depth.current += 1
        setDragging(true)
      }}
      onDragOver={(event) => {
        onDragOver?.(event)
        event.preventDefault()
        if (event.dataTransfer) event.dataTransfer.dropEffect = disabled || !carriesFiles(event) ? "none" : "copy"
      }}
      onDragLeave={(event) => {
        onDragLeave?.(event)
        depth.current = Math.max(0, depth.current - 1)
        if (depth.current === 0) setDragging(false)
      }}
      onDrop={(event) => {
        onDrop?.(event)
        event.preventDefault()
        depth.current = 0
        setDragging(false)
        if (disabled || !event.dataTransfer?.files) return
        // A dropped folder is listed as a file the browser cannot read: it is refused with its own message.
        const drop = readDrop(event.dataTransfer)
        for (const folder of drop.folders) folders?.add(folder)
        addFiles(drop.files)
      }}
      {...props}
    >
      {children ?? (
        // With no children, the whole zone is one button: Enter and Space open the picker, as a click does.
        <button
          type="button"
          data-slot="file-upload-dropzone-trigger"
          disabled={disabled}
          onClick={openPicker}
          className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-md py-8 text-center outline-none focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid disabled:cursor-not-allowed"
        >
          <CloudUploadIcon aria-hidden="true" strokeWidth={1.5} className="size-12 text-muted-foreground" />
          <span className="flex flex-col gap-1">
            <span className="text-lg/7 font-medium text-foreground">{title ?? strings.dropFilesHere}</span>{" "}
            <span className="text-sm/5 text-muted-foreground">{description ?? strings.browseFiles}</span>
          </span>
        </button>
      )}
    </div>
  )
}

type FileUploadButtonProps = React.ComponentProps<typeof Button>

// The toolbar buttons: our Button, or with `asChild` the app's own element, unstyled, with the behaviour merged in.
function FileUploadAction({
  slot,
  asChild = false,
  inactive,
  action,
  fallback,
  disabled,
  onClick,
  children,
  ...props
}: FileUploadButtonProps & {
  slot: string
  inactive: boolean
  action: () => void
  fallback: React.ReactNode
}) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event)
    if (!event.defaultPrevented) action()
  }
  if (asChild) {
    // The child keeps its own look: Button's style props are not passed on.
    const { variant: _variant, size: _size, severity: _severity, raised: _raised, rounded: _rounded, loading: _loading, ...rest } =
      props
    return (
      <Slot.Root
        data-slot={slot}
        {...(rest as React.ComponentProps<typeof Slot.Root>)}
        {...({ disabled: disabled || inactive } as object)}
        onClick={handleClick}
      >
        {children}
      </Slot.Root>
    )
  }
  return (
    <Button type="button" data-slot={slot} disabled={disabled || inactive} onClick={handleClick} {...props}>
      {children ?? fallback}
    </Button>
  )
}

/** @since 0.1.0 */
function FileUploadTrigger(props: FileUploadButtonProps) {
  const { openPicker, disabled } = useFileUpload()
  const strings = useUiStrings()
  return (
    <FileUploadAction
      slot="file-upload-trigger"
      inactive={disabled}
      action={openPicker}
      fallback={
        <>
          <PlusIcon aria-hidden="true" />
          {strings.chooseFiles}
        </>
      }
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FileUploadSubmit({ variant = "secondary", ...props }: FileUploadButtonProps) {
  const { files, upload, disabled } = useFileUpload()
  const strings = useUiStrings()
  return (
    <FileUploadAction
      slot="file-upload-submit"
      variant={variant}
      inactive={disabled || !files.some((entry) => entry.status === "queued")}
      action={() => void upload()}
      fallback={
        <>
          <UploadIcon aria-hidden="true" />
          {strings.upload}
        </>
      }
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FileUploadClear({ variant = "secondary", ...props }: FileUploadButtonProps) {
  const { files, rejections, clear, disabled } = useFileUpload()
  const strings = useUiStrings()
  return (
    <FileUploadAction
      slot="file-upload-clear"
      variant={variant}
      inactive={disabled || (files.length === 0 && rejections.length === 0)}
      action={clear}
      fallback={
        <>
          <XIcon aria-hidden="true" />
          {strings.cancel}
        </>
      }
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FileUploadProgress({ className, ...props }: Omit<React.ComponentProps<typeof Progress>, "value">) {
  const { files } = useFileUpload()
  const strings = useUiStrings()
  if (files.length === 0) return null
  const counted = files.filter((entry) => entry.status !== "error")
  const value = counted.length ? counted.reduce((sum, entry) => sum + entry.progress, 0) / counted.length : 0
  return (
    <Progress
      data-slot="file-upload-progress"
      aria-label={strings.upload}
      value={value}
      // The visual target's bar over the list: 4px tall.
      className={cn("h-1", className)}
      {...props}
    />
  )
}

/** @since 0.1.0 */
function FileUploadErrors({ className, ...props }: React.ComponentProps<"ul">) {
  const { rejections } = useFileUpload()
  const messages = [...new Set(rejections.map((rejection) => rejection.message))]
  if (messages.length === 0) return null
  return (
    <ul data-slot="file-upload-errors" className={cn("flex flex-col gap-2", className)} {...props}>
      {messages.map((message) => (
        <li
          key={message}
          data-slot="file-upload-error"
          // The visual target's error message: 6px × 10px padding, a 1px pale red edge on a faint red fill, red text.
          className="rounded-md border border-destructive-border bg-destructive-subtle px-2.5 py-1.5 text-sm/normal text-destructive-strong"
        >
          {message}
        </li>
      ))}
    </ul>
  )
}

/** The icon of a file's type, for files with no picture to show. */
function FileTypeIcon({ file, className }: { file: File; className?: string }) {
  const type = file.type
  const props = { "aria-hidden": true, className }
  if (type.startsWith("image/")) return <FileImageIcon {...props} />
  if (type.startsWith("video/")) return <FileVideoIcon {...props} />
  if (type.startsWith("audio/")) return <FileAudioIcon {...props} />
  if (/zip|compressed|tar|gzip|rar|7z/.test(type) || /\.(zip|gz|tgz|rar|7z)$/i.test(file.name)) return <FileArchiveIcon {...props} />
  if (type.startsWith("text/") || /pdf|json|xml|csv|document|sheet|presentation/.test(type)) return <FileTextIcon {...props} />
  return <FileIcon {...props} />
}

const subscribeNothing = () => () => {}

// Whether this browser makes blob URLs from files; checked once, in the browser only.
let blobUrls: boolean | undefined
function canMakeBlobUrls(): boolean {
  if (blobUrls === undefined) {
    try {
      URL.revokeObjectURL(URL.createObjectURL(new Blob()))
      blobUrls = true
    } catch {
      blobUrls = false
    }
  }
  return blobUrls
}

/** @since 0.1.0 */
function FileUploadPreview({
  file,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  /** The file to show: a picture for an image, the icon of its type otherwise. */
  file: File
}) {
  // An image's picture is a blob URL, made in the browser once hydrated (never on the server) and revoked when the file
  // goes; it is set on the element, not kept in state.
  const hydrated = React.useSyncExternalStore(subscribeNothing, () => true, () => false)
  // A file that claims to be an image but does not decode falls back to the icon.
  const [broken, setBroken] = React.useState<File | null>(null)
  const picture = hydrated && isImage(file) && broken !== file && canMakeBlobUrls()
  const imageRef = React.useRef<HTMLImageElement>(null)
  React.useEffect(() => {
    const image = imageRef.current
    if (!picture || !image) return
    const url = URL.createObjectURL(file)
    image.src = url
    return () => URL.revokeObjectURL(url)
  }, [file, picture])

  return (
    <span
      data-slot="file-upload-preview"
      data-kind={picture ? "image" : "icon"}
      className={cn(
        // The visual target's 50px thumbnail; a file with no picture shows its type's icon on the secondary fill.
        "flex size-12.5 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary text-secondary-foreground data-[kind=image]:bg-transparent",
        className
      )}
      {...props}
    >
      {picture ? (
        <img ref={imageRef} data-slot="file-upload-preview-image" alt="" onError={() => setBroken(file)} className="size-full object-cover" />
      ) : (
        <FileTypeIcon file={file} className="size-5" />
      )}
    </span>
  )
}

const FileUploadListContext = React.createContext<{ layout: "list" | "grid" }>({ layout: "list" })

/** @since 0.1.0 */
function FileUploadList({
  className,
  layout = "list",
  empty,
  children,
  ...props
}: Omit<React.ComponentProps<"ul">, "children"> & {
  /** `list` puts one file per row; `grid` lays the files out as cards with a large picture. */
  layout?: "list" | "grid"
  /** Shown in place of the list while it is empty. */
  empty?: React.ReactNode
  /** Draws each file yourself; by default each is a `FileUploadItem`. */
  children?: (file: FileUploadFile) => React.ReactNode
}) {
  const { files } = useFileUpload()
  const context = React.useMemo(() => ({ layout }), [layout])
  if (files.length === 0) return empty ? <>{empty}</> : null
  return (
    <FileUploadListContext.Provider value={context}>
      <ul
        data-slot="file-upload-list"
        data-layout={layout}
        className={cn(
          // The visual target's list: 8px between rows; cards fill a grid of 160px columns.
          "flex flex-col gap-2 data-[layout=grid]:grid data-[layout=grid]:grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] data-[layout=grid]:gap-4",
          className
        )}
        {...props}
      >
        {files.map((entry) =>
          children ? <React.Fragment key={entry.id}>{children(entry)}</React.Fragment> : <FileUploadItem key={entry.id} file={entry} />
        )}
      </ul>
    </FileUploadListContext.Provider>
  )
}

/** @since 0.1.0 */
function FileUploadItem({
  file: entry,
  preview = true,
  className,
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  /** The entry to show, from `useFileUpload().files` or the list's render function. */
  file: FileUploadFile
  /** Shows the picture of an image, or the icon of the file's type. */
  preview?: boolean
}) {
  const { removeFile, disabled } = useFileUpload()
  const { layout } = React.useContext(FileUploadListContext)
  const strings = useUiStrings()
  const { locale } = useUiLocale()
  const { file, status, progress, error } = entry
  const grid = layout === "grid"

  const remove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    const row = button.closest("li")
    const hadFocus = button.ownerDocument.activeElement === button
    // Focus goes to the next row's remove button, else the previous one's, else the first way to add files.
    const target =
      row?.nextElementSibling?.querySelector<HTMLElement>("[data-slot=file-upload-item-remove]") ??
      row?.previousElementSibling?.querySelector<HTMLElement>("[data-slot=file-upload-item-remove]") ??
      button
        .closest("[data-slot=file-upload]")
        ?.querySelector<HTMLElement>(
          "[data-slot=file-upload-trigger]:not(:disabled), [data-slot=file-upload-dropzone-trigger]:not(:disabled)"
        )
    removeFile(entry.id)
    if (hadFocus) target?.focus()
  }

  const statusBadge =
    status === "done" ? (
      <Badge variant="success" data-slot="file-upload-item-status">
        {strings.uploadComplete}
      </Badge>
    ) : status === "error" ? (
      <Badge variant="destructive" data-slot="file-upload-item-status" className="whitespace-normal">
        {error ?? strings.uploadFailed}
      </Badge>
    ) : null

  return (
    <li
      data-slot="file-upload-item"
      data-status={status}
      data-layout={layout}
      className={cn(
        grid
          ? // A card: the picture across the top, 128px tall, the name and size below, an 8px radius and the content edge.
            "group/file-upload-item relative flex flex-col overflow-hidden rounded-lg border border-border"
          : // The visual target's row: 14px padding and gap, a rule under every row but the last.
            "flex flex-wrap items-center gap-3.5 border-b border-border p-3.5 last:border-b-0",
        className
      )}
      {...props}
    >
      {preview ? <FileUploadPreview file={file} className={grid ? "h-32 w-full rounded-none" : undefined} /> : null}
      <div data-slot="file-upload-item-info" className={cn("flex min-w-0 flex-1 flex-col gap-0.5", grid && "p-2")}>
        <span
          data-slot="file-upload-item-name"
          dir="auto"
          title={file.name}
          className={cn("max-w-full self-start truncate text-foreground", grid ? "text-xs/normal font-medium" : "text-sm/normal")}
        >
          {file.name}
        </span>
        {/* `dir="auto"`: a size such as "84 kB" keeps its order on a right-to-left page, and follows the locale's own. */}
        <span data-slot="file-upload-item-size" dir="auto" className="self-start text-xs/normal text-muted-foreground tabular-nums">
          {formatFileSize(file.size, locale)}
        </span>
        {grid && statusBadge ? (
          <span data-slot="file-upload-item-status-wrapper" className="mt-1 flex">
            {statusBadge}
          </span>
        ) : null}
      </div>
      {!grid && statusBadge}
      <Button
        type="button"
        variant={grid ? "destructive" : "ghost"}
        size="icon-xs"
        rounded={grid}
        data-slot="file-upload-item-remove"
        aria-label={fillString(strings.removeItem, { label: file.name })}
        disabled={disabled}
        onClick={remove}
        className={cn(
          "[&_svg:not([class*='size-'])]:size-3.5",
          grid
            ? // On a card it sits on the picture's corner, shown while the card is hovered or holds focus.
              "absolute end-2 top-2 opacity-0 group-focus-within/file-upload-item:opacity-100 group-hover/file-upload-item:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100"
            : "ms-auto text-foreground"
        )}
      >
        <XIcon aria-hidden="true" />
      </Button>
      {status === "uploading" ? (
        <Progress
          data-slot="file-upload-item-progress"
          aria-label={file.name}
          value={progress}
          // The visual target's 4px bar, the row's full width.
          className={cn("h-1", grid ? "rounded-none" : "basis-full")}
        />
      ) : null}
    </li>
  )
}

export {
  FileUpload,
  FileUploadDropzone,
  FileUploadTrigger,
  FileUploadSubmit,
  FileUploadClear,
  FileUploadProgress,
  FileUploadErrors,
  FileUploadList,
  FileUploadItem,
  FileUploadPreview,
  useFileUpload,
  formatFileSize,
}
export type {
  FileUploadFile,
  FileUploadStatus,
  FileUploadRejection,
  FileUploadHelpers,
  FileUploadHandler,
  FileUploadState,
}
