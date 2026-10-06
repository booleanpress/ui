import { CopyIcon, EyeIcon, FileIcon, FolderOpenIcon, PencilIcon, RedoIcon, SaveIcon, UndoIcon } from "lucide-react"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@booleanpress/ui/menubar"

export default function MenubarWithIcons() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger><FileIcon />File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem><FolderOpenIcon />Open</MenubarItem>
          <MenubarItem><SaveIcon />Save</MenubarItem>
          <MenubarItem><CopyIcon />Duplicate</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger><PencilIcon />Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem><UndoIcon />Undo</MenubarItem>
          <MenubarItem><RedoIcon />Redo</MenubarItem>
          <MenubarSeparator />
          <MenubarItem><CopyIcon />Copy</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger><EyeIcon />View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Desktop preview</MenubarItem>
          <MenubarItem>Mobile preview</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
