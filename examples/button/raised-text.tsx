import { Button } from "@booleanpress/ui/button"

export default function ButtonRaisedText() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button raised variant="ghost">Save</Button>
      <Button raised variant="ghost" severity="success">Approve</Button>
      <Button raised variant="ghost" severity="info">View logs</Button>
      <Button raised variant="ghost" severity="warning">Pause sending</Button>
      <Button raised variant="ghost" severity="help">Get help</Button>
      <Button raised variant="ghost" severity="danger">Delete</Button>
      <Button raised variant="ghost" severity="contrast">Publish</Button>
    </div>
  )
}
