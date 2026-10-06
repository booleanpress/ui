import { Editor, type EditorTool } from "@booleanpress/ui/editor"

const TOOLS: EditorTool[][] = [["bold", "italic", "link"]]

export default function EditorSizes() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <Editor aria-label="Small note" size="sm" toolbar={TOOLS} defaultValue="<p>Small: 12 px text.</p>" contentClassName="min-h-16" />
      <Editor aria-label="Default note" toolbar={TOOLS} defaultValue="<p>Default: 14 px text.</p>" contentClassName="min-h-16" />
      <Editor aria-label="Large note" size="lg" toolbar={TOOLS} defaultValue="<p>Large: 16 px text.</p>" contentClassName="min-h-16" />
    </div>
  )
}
