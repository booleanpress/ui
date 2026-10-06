// Type tests: compiled by `pnpm typecheck` against the source and by `pnpm check` against the built declarations.
// A line marked @ts-expect-error fails the check if it ever type-checks; every other line must compile.
import * as React from "react"
import { BooleanUIProvider, useUiStrings } from "@booleanpress/ui/provider"
import { cn } from "@booleanpress/ui/utils"
import { Badge } from "@booleanpress/ui/badge"
import { Button } from "@booleanpress/ui/button"
import { Checkbox } from "@booleanpress/ui/checkbox"
import { Dialog, DialogBody, DialogContent, DialogTitle } from "@booleanpress/ui/dialog"
import { IconButton } from "@booleanpress/ui/icon-button"
import { Input } from "@booleanpress/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@booleanpress/ui/tooltip"
import { PencilIcon } from "lucide-react"

export function Valid() {
  const ref = React.useRef<HTMLButtonElement>(null)
  const strings = useUiStrings()
  return (
    <BooleanUIProvider strings={{ close: "Fermer" }} dir="rtl" tooltipDelay={300} controlSize="sm" fieldVariant="filled" locale="fr-FR" timeZone="Europe/Paris">
      <Button variant="outline" size="icon-sm" aria-label={strings.close} className={cn("a", undefined, ["b"])} ref={ref} />
      <Badge variant="success">Sent</Badge>
      <Button severity="success" raised rounded loading>Save</Button>
      <Input size="lg" variant="filled" clearable />
      <IconButton label="Edit" size="xs" tooltip tooltipSide="bottom" severity="danger" rounded>
        <PencilIcon />
      </IconButton>
      <Checkbox checked="indeterminate" onCheckedChange={(value) => value === true} />
      <Dialog>
        <DialogContent size="lg" returnFocusTo={ref} showCloseButton={false}>
          <DialogTitle>Title</DialogTitle>
          <DialogBody>Body</DialogBody>
        </DialogContent>
      </Dialog>
      <Tooltip>
        <TooltipTrigger>Info</TooltipTrigger>
        <TooltipContent>Without a className</TooltipContent>
      </Tooltip>
    </BooleanUIProvider>
  )
}

export function Invalid() {
  return (
    <>
      {/* @ts-expect-error: DialogContent's size is "sm", "md", "lg" or "full" */}
      <DialogContent size="xl" />
      {/* @ts-expect-error: returnFocusTo takes a ref or a function, not a selector */}
      <DialogContent returnFocusTo="#save" />
      {/* @ts-expect-error: Button has no "primary" variant */}
      <Button variant="primary" />
      {/* @ts-expect-error: Checkbox's mixed state is "indeterminate" */}
      <Checkbox checked="mixed" />
      {/* @ts-expect-error: the provider has no such string */}
      <BooleanUIProvider strings={{ nope: "x" }} />
      {/* @ts-expect-error: dir is "ltr" or "rtl" */}
      <BooleanUIProvider dir="up" />
      {/* @ts-expect-error: a control's size is "sm", "default" or "lg" */}
      <Input size={20} />
      {/* @ts-expect-error: an icon button must have a label */}
      <IconButton>
        <PencilIcon />
      </IconButton>
      {/* @ts-expect-error: IconButton's sizes are xs, sm, default and lg */}
      <IconButton label="Edit" size="icon">
        <PencilIcon />
      </IconButton>
    </>
  )
}
