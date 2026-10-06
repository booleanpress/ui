import { useSyncExternalStore } from "react"
import { Button } from "@booleanpress/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@booleanpress/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@booleanpress/ui/drawer"
import { Input } from "@booleanpress/ui/input"
import { Label } from "@booleanpress/ui/label"

const QUERY = "(min-width: 768px)"

function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(QUERY)
      media.addEventListener("change", onChange)
      return () => media.removeEventListener("change", onChange)
    },
    () => window.matchMedia(QUERY).matches,
    () => true
  )
}

function KeyForm() {
  return (
    <div className="flex flex-col gap-2 px-4.5 pb-4.5 md:px-0 md:pb-0">
      <Label htmlFor="key-name">Key name</Label>
      <Input id="key-name" defaultValue="Production server" />
      <Button className="mt-2">Create key</Button>
    </div>
  )
}

export default function DrawerResponsive() {
  const wide = useWide()
  const title = "Create an API key"
  const description = "The key is shown once, so copy it before you close this."

  if (wide) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Create an API key</Button>
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <KeyForm />
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Create an API key</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <KeyForm />
      </DrawerContent>
    </Drawer>
  )
}
