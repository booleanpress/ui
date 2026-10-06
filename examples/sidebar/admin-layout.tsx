import { ChevronRightIcon, InboxIcon, MailIcon, PlugIcon, RouteIcon, SettingsIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@booleanpress/ui/collapsible"
import { Separator } from "@booleanpress/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@booleanpress/ui/sidebar"

export default function SidebarAdminLayout() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <nav aria-label="Admin pages" className="flex min-h-0 flex-1 flex-col">
          <SidebarHeader className="truncate px-4 py-3 text-sm font-semibold group-data-[collapsible=icon]:invisible">Acme</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Delivery</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Email log">
                      <MailIcon />
                      <span>Email log</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Mailers">
                      <PlugIcon />
                      <span>Mailers</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Routing rules">
                      <RouteIcon />
                      <span>Routing rules</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Configure</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible asChild defaultOpen className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip="Settings">
                          <SettingsIcon />
                          <span>Settings</span>
                          <ChevronRightIcon className="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#">
                              <span>Logging</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton href="#">
                              <span>Notifications</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </nav>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <span className="text-sm font-medium">Email log</span>
        </header>
        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <InboxIcon className="size-4" aria-hidden="true" />
          Press Ctrl+B or ⌘B to collapse the sidebar to its icons.
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
