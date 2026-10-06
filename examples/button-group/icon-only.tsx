import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@booleanpress/ui/button"
import { ButtonGroup } from "@booleanpress/ui/button-group"

const LOOKS = [
  { name: "solid", props: {} },
  { name: "outlined", props: { variant: "outline" } },
  { name: "text", props: { variant: "ghost" } },
  { name: "raised", props: { raised: true } },
  { name: "rounded", props: { rounded: true } },
  { name: "secondary", props: { variant: "secondary" } },
] as const

export default function ButtonGroupIconOnly() {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {LOOKS.map(({ name, props }) => (
        <ButtonGroup key={name} aria-label={`Log pages, ${name}`}>
          <Button {...props} size="icon" aria-label="Previous page">
            <ChevronLeftIcon className="rtl:rotate-180" />
          </Button>
          <Button {...props} size="icon" aria-label="Next page">
            <ChevronRightIcon className="rtl:rotate-180" />
          </Button>
        </ButtonGroup>
      ))}
    </div>
  )
}
