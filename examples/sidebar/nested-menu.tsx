import { ChevronRightIcon, SettingsIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@booleanpress/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
} from "@booleanpress/ui/sidebar"

type Page = { label: string; children?: Page[] }

const SETTINGS: Page[] = [
  { label: "General" },
  { label: "Delivery", children: [{ label: "Mailers" }, { label: "Routing", children: [{ label: "Rules" }, { label: "Fallbacks" }] }] },
  { label: "Logging", children: [{ label: "Retention" }, { label: "Alerts" }] },
]

// Turned by its own heading's state, so a closed level inside an open one keeps its chevron closed.
const CHEVRON = "ms-auto transition-transform rtl:rotate-180 [[data-state=open]>&]:rotate-90"

function SubPages({ pages }: { pages: Page[] }) {
  return (
    <SidebarMenuSub>
      {pages.map((page) =>
        page.children ? (
          <Collapsible key={page.label} asChild defaultOpen>
            <SidebarMenuSubItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuSubButton asChild>
                  <button type="button" className="w-full">
                    <span>{page.label}</span>
                    <ChevronRightIcon className={CHEVRON} />
                  </button>
                </SidebarMenuSubButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SubPages pages={page.children} />
              </CollapsibleContent>
            </SidebarMenuSubItem>
          </Collapsible>
        ) : (
          <SidebarMenuSubItem key={page.label}>
            <SidebarMenuSubButton href={`#${page.label.toLowerCase()}`}>
              <span>{page.label}</span>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        )
      )}
    </SidebarMenuSub>
  )
}

export default function SidebarNestedMenu() {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="h-svh border-e">
        <nav aria-label="Settings pages" className="flex min-h-0 flex-1 flex-col">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible asChild defaultOpen>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <SettingsIcon />
                          <span>Settings</span>
                          <ChevronRightIcon className={CHEVRON} />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SubPages pages={SETTINGS} />
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </nav>
      </Sidebar>
      <SidebarInset>
        <p className="p-4 text-sm text-muted-foreground">Each level opens and closes on its own; Enter or Space on a heading toggles it.</p>
      </SidebarInset>
    </SidebarProvider>
  )
}
