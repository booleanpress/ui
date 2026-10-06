import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@booleanpress/ui/menubar"

export default function MenubarBasic() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New template<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarItem>Open<MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Export as</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>HTML</MenubarItem>
              <MenubarItem>Plain text</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Send a test email<MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo<MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo<MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Insert</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Customer name</MenubarItem>
              <MenubarItem>Order number</MenubarItem>
              <MenubarItem>Unsubscribe link</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Desktop preview</MenubarItem>
          <MenubarItem>Mobile preview</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Dark mode preview</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
