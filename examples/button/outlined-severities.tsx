import { Button } from "@booleanpress/ui/button"

export default function ButtonOutlinedSeverities() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button variant="outline">Save</Button>
      <Button variant="outline" severity="success">Approve</Button>
      <Button variant="outline" severity="info">View logs</Button>
      <Button variant="outline" severity="warning">Pause sending</Button>
      <Button variant="outline" severity="help">Get help</Button>
      <Button variant="outline" severity="danger">Delete</Button>
      <Button variant="outline" severity="contrast">Publish</Button>
    </div>
  )
}
