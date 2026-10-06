import { useState } from "react"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@booleanpress/ui/menubar"

export default function MenubarCheckboxRadio() {
  const [panels, setPanels] = useState({ outline: true, variables: false })
  const [width, setWidth] = useState("600")

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Panels</MenubarLabel>
          <MenubarCheckboxItem checked={panels.outline} onCheckedChange={(outline) => setPanels({ ...panels, outline })}>
            Outline
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={panels.variables} onCheckedChange={(variables) => setPanels({ ...panels, variables })}>
            Variables
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Layout</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Email width</MenubarLabel>
          <MenubarRadioGroup value={width} onValueChange={setWidth}>
            <MenubarRadioItem value="480">480 px</MenubarRadioItem>
            <MenubarRadioItem value="600">600 px</MenubarRadioItem>
            <MenubarRadioItem value="720">720 px</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarCheckboxItem checked disabled>Centre the content</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
