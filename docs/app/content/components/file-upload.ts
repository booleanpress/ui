import type { ComponentDoc } from "../types.ts"

const AS_CHILD =
  "Gives the part's behaviour to your element, such as an `InputGroupButton`, and none of `Button`'s look: `variant`, `size` and the other style props are not passed on."
const BUTTON = {
  asChild: AS_CHILD,
  size: "`Button`'s size. Without children the part shows its own icon and words.",
  severity: "`Button`'s severity colour.",
  raised: "`Button`'s raised shadow.",
  rounded: "`Button`'s pill shape.",
  loading: "`Button`'s loading state.",
}

export default {
  slug: "file-upload",
  title: "File upload",
  category: "File",
  purpose: "Lets people pick or drop files, checks them, and shows each one's progress while the app uploads it.",
  links: {
    spec: "specs/004_full-suite-components.md#file-upload",
  },
  usage: `\`\`\`tsx
<FileUpload
  accept="image/*,application/pdf"
  multiple
  maxSize={5_000_000}
  onUpload={async (files, { onProgress, signal }) => {
    for (const file of files) {
      await sendToApi(file, { signal, onProgress: (percent) => onProgress(file, percent) })
    }
  }}
>
  <FileUploadDropzone />
  <FileUploadList />
  <FileUploadSubmit />
</FileUpload>
\`\`\``,
  examples: [
    {
      id: "basic",
      title: "Basic",
      description: "A Choose button, the chosen file names, and an Upload button that sends them.",
    },
    {
      id: "auto",
      title: "Auto upload",
      description: "`auto` uploads each file as soon as it is chosen.",
    },
    {
      id: "advanced",
      title: "Advanced",
      description:
        "A toolbar with Choose, Upload and Cancel above a progress bar and the list.",
    },
    {
      id: "input-group",
      title: "In an input group",
      description: "`FileUploadTrigger asChild` turns an input group's button into the file picker.",
    },
    {
      id: "custom-upload",
      title: "Custom upload",
      description: "Your own `onUpload` reports each file's progress through `onProgress`.",
    },
    {
      id: "dropzone",
      title: "Drop zone",
      description: "With no children the drop zone is one large button: drop files on it or press it to browse.",
    },
    {
      id: "image-preview",
      title: "Image previews",
      description: "`layout=\"grid\"` shows each image as a card with its picture.",
    },
    {
      id: "validation",
      title: "Validation errors",
      description: "`accept`, `maxSize` and `maxFiles` refuse files with a message for each.",
    },
    {
      id: "disabled",
      title: "Disabled",
      description: "`disabled` stops picking, dropping, uploading and removing.",
    },
    { id: "upload-error", title: "Upload error", description: "An `onUpload` that rejects marks the file's row as failed." },
  ],
  accessibility: {
    semantics:
      "Every way to add files is a native `button`; each row's progress is a `progressbar`, and a polite `status` region announces changes.",
    labels:
      "The buttons carry their own words and a remove button is named after its file. With `asChild`, name your element yourself.",
    focus:
      "The picker returns focus to the button that opened it. Removing a file moves focus to a neighbouring row or button.",
    limits: [
      "Dragging files is a pointer gesture only; every drop zone also opens the picker by click, Enter or Space, so nothing depends on dragging (WCAG 2.5.7).",
      "A refused file is not listed. Its message stays in `FileUploadErrors` until the next files arrive or the list is cleared.",
      "Removing a file during its upload aborts its `fileSignal(file)`; a request given only the batch's `signal` stops when the last file of the batch is removed.",
      "A dropped folder is refused, not opened: its files are not added. People choose or drop the files themselves.",
      "Files leave through your upload function, not with a form's native submit: FileUpload takes no `name`, and a form's Reset leaves its list alone.",
      "Sizes are in steps of 1,000 with the short units B, KB, MB and GB, the same in every language; the number is formatted by `Intl` in the provider's locale.",
      "An image's picture is a blob URL made in the browser after it loads; the server renders the type icon in its place.",
      "On a card the remove button is hidden until the card is hovered or holds focus; on touch screens it always shows.",
    ],
  },
  keyboard: [
    { keys: ["Enter", "Space"], behaviour: "On Choose, or on a drop zone with no children, opens the system's file picker." },
    { keys: ["Enter", "Space"], behaviour: "On Upload, sends the queued files; on Cancel, aborts the uploads and empties the list." },
    { keys: ["Enter", "Space"], behaviour: "On a file's remove button, removes it and moves focus to the next file's remove button." },
    { keys: ["Tab"], behaviour: "Moves through the buttons and each file's remove button in reading order." },
  ],
  theming:
    "The drop zone is a dashed `--border` edge that turns `--primary` while files are dragged over it; its icon and second line are `--muted-foreground`. Rows are divided by `--border`; a file with no picture shows its type icon on `--secondary`. Progress bars are `Progress` at 4 px. The status uses the success and destructive tag tokens, and refusal messages `--destructive-subtle`, `--destructive-border` and `--destructive-strong`.",
  props: {
    FileUpload: {
      className: "Classes for the root, a column with 14 px between its parts.",
    },
    FileUploadTrigger: { ...BUTTON, variant: "The button's look; `default` (the primary fill) by default." },
    FileUploadSubmit: {
      ...BUTTON,
      variant: "The button's look; `secondary` by default. It is disabled while no file is queued.",
    },
    FileUploadClear: {
      ...BUTTON,
      variant: "The button's look; `secondary` by default. It is disabled while there is nothing to clear.",
    },
    FileUploadProgress: {
      className: "Classes for the bar: 4 px tall, the average progress of every file that has not failed.",
    },
    FileUploadErrors: {
      className: "Classes for the list of messages; each message shows once, however many files it refused.",
    },
  },
} satisfies ComponentDoc
