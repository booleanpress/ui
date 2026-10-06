import { Button } from "@booleanpress/ui/button"

export default function ButtonSeverities() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button>Save</Button>
      <Button variant="secondary">Duplicate</Button>
      <Button severity="success">Approve</Button>
      <Button severity="info">View logs</Button>
      <Button severity="warning">Pause sending</Button>
      <Button severity="help">Get help</Button>
      <Button severity="danger">Delete</Button>
      <Button severity="contrast">Publish</Button>
    </div>
  )
}
