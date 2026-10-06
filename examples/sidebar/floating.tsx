import { InboxIcon, MailIcon, PlugIcon, RouteIcon } from "lucide-react"
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
  SidebarProvider,
  SidebarTrigger,
} from "@booleanpress/ui/sidebar"

const PAGES = [
  { label: "Email log", icon: MailIcon, count: 12 },
  { label: "Mailers", icon: PlugIcon },
  { label: "Routing rules", icon: RouteIcon },
  { label: "Inbox", icon: InboxIcon, count: 3 },
]

export default function SidebarFloating() {
  return (
    <SidebarProvider>
      <Sidebar variant="floating" collapsible="icon">
        <nav aria-label="Admin pages" className="flex min-h-0 flex-1 flex-col">
          <SidebarHeader className="truncate px-4 py-3 text-sm font-semibold group-data-[collapsible=icon]:invisible">Acme</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Delivery</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PAGES.map(({ label, icon: Icon, count }, i) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton isActive={i === 0} tooltip={label}>
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                      {count ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </nav>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 border-b px-3">
          <SidebarTrigger />
          <span className="text-sm font-medium">Email log</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">The floating sidebar is a card with a margin round it.</p>
      </SidebarInset>
    </SidebarProvider>
  )
}
