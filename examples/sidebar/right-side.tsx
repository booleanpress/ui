import { TicketIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@booleanpress/ui/sidebar"

export default function SidebarRightSide() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <header className="flex h-12 items-center justify-between border-b px-3">
          <span className="text-sm font-medium">Ticket 1042</span>
          <SidebarTrigger />
        </header>
        <p className="p-4 text-sm text-muted-foreground">The panel sits on the right and slides out of view.</p>
      </SidebarInset>
      <Sidebar side="right" variant="sidebar" collapsible="offcanvas">
        <nav aria-label="Ticket details" className="flex min-h-0 flex-1 flex-col">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Details</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <TicketIcon />
                    <span>Related tickets</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </nav>
      </Sidebar>
    </SidebarProvider>
  )
}
