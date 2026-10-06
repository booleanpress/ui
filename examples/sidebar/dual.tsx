import { MailIcon, PlugIcon, RouteIcon, TicketIcon, UserIcon } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@booleanpress/ui/sidebar"

const PAGES = [
  { label: "Tickets", icon: TicketIcon },
  { label: "Mailboxes", icon: MailIcon },
  { label: "Integrations", icon: PlugIcon },
  { label: "Workflows", icon: RouteIcon },
]

export default function SidebarDual() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <nav aria-label="Admin pages" className="flex min-h-0 flex-1 flex-col">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Support</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {PAGES.map(({ label, icon: Icon }, i) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton isActive={i === 0} tooltip={label}>
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
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
          <span className="text-sm font-medium">Ticket 1042</span>
        </header>
        <p className="p-4 text-sm text-muted-foreground">The left sidebar collapses to icons; the customer panel on the right stays.</p>
      </SidebarInset>
      <Sidebar collapsible="none" className="sticky top-0 hidden h-svh w-56 border-s md:flex">
        <aside aria-label="Customer" className="flex min-h-0 flex-1 flex-col">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Customer</SidebarGroupLabel>
              <SidebarGroupContent className="flex items-center gap-2 px-2 py-1 text-sm">
                <UserIcon className="size-3.5 text-control-hover" aria-hidden="true" />
                Dana Whitfield
              </SidebarGroupContent>
              <p className="px-2 py-1 text-sm text-muted-foreground">Northwind Studio · 14 tickets</p>
            </SidebarGroup>
          </SidebarContent>
        </aside>
      </Sidebar>
    </SidebarProvider>
  )
}
