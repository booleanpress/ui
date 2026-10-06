import { Button } from "@booleanpress/ui/button"
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@booleanpress/ui/popover"

export default function PopoverBasic() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Delivery status</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Delivered</PopoverTitle>
          <PopoverDescription>The mail server accepted this email at 09:41. The recipient's server has not reported a bounce.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  )
}
