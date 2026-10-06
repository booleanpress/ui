import { Button } from "@booleanpress/ui/button"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"
import { Popover, PopoverContent, PopoverHeader, PopoverTitle, PopoverTrigger } from "@booleanpress/ui/popover"

export default function PopoverForm() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Rename mailer</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
          <PopoverHeader>
            <PopoverTitle>Rename mailer</PopoverTitle>
          </PopoverHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="popover-mailer-name">Name</Label>
            <Input id="popover-mailer-name" defaultValue="Primary mailer" />
          </div>
          <Button type="submit" size="sm" className="self-end">
            Save
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  )
}
