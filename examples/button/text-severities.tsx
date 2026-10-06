import { Button } from "@booleanpress/ui/button"

export default function ButtonTextSeverities() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button variant="ghost">Save</Button>
      <Button variant="ghost" severity="success">Approve</Button>
      <Button variant="ghost" severity="info">View logs</Button>
      <Button variant="ghost" severity="warning">Pause sending</Button>
      <Button variant="ghost" severity="help">Get help</Button>
      <Button variant="ghost" severity="danger">Delete</Button>
      <Button variant="ghost" severity="contrast">Publish</Button>
    </div>
  )
}
