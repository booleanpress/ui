import { Button } from "@booleanpress/ui/button"

export default function ButtonRaised() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <Button raised>Save</Button>
      <Button raised variant="secondary">Duplicate</Button>
      <Button raised severity="success">Approve</Button>
      <Button raised severity="info">View logs</Button>
      <Button raised severity="warning">Pause sending</Button>
      <Button raised severity="help">Get help</Button>
      <Button raised severity="danger">Delete</Button>
      <Button raised severity="contrast">Publish</Button>
    </div>
  )
}
