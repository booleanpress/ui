import { Button } from "@booleanpress/ui/button"

export default function ButtonRounded() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button rounded>Save</Button>
      <Button rounded variant="secondary">Duplicate</Button>
      <Button rounded severity="success">Approve</Button>
      <Button rounded severity="info">View logs</Button>
      <Button rounded severity="warning">Pause sending</Button>
      <Button rounded severity="help">Get help</Button>
      <Button rounded severity="danger">Delete</Button>
      <Button rounded severity="contrast">Publish</Button>
    </div>
  )
}
