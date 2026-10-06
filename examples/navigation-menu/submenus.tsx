import { ChevronRightIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSub,
  NavigationMenuTrigger,
} from "@booleanpress/ui/navigation-menu"

const AREAS = [
  { value: "sending", title: "Sending", links: ["Connections", "Routing rules", "Suppression list"] },
  { value: "logs", title: "Logs", links: ["Delivery log", "Bounces", "Webhook events"] },
  { value: "team", title: "Team", links: ["Members", "Roles", "Audit trail"] },
]

export default function NavigationMenuSubmenus() {
  return (
    <div className="flex h-48 w-full items-start justify-center">
      <NavigationMenu className="w-[25rem] max-w-none flex-none">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Workspace</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuSub defaultValue="sending" orientation="vertical" className="relative h-28 w-96">
                <NavigationMenuList className="w-40 flex-col items-stretch gap-0.5">
                  {AREAS.map((area) => (
                    <NavigationMenuItem key={area.value} value={area.value} className="static">
                      <NavigationMenuTrigger className="w-full justify-between font-normal">
                        {area.title}
                        <ChevronRightIcon className="size-3 text-control-hover rtl:rotate-180" />
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="start-40 w-56 ps-2 md:w-56">
                        <ul className="flex flex-col gap-0.5 border-s ps-2">
                          {area.links.map((link) => (
                            <li key={link}>
                              <NavigationMenuLink href={`#${link.toLowerCase().replaceAll(" ", "-")}`}>{link}</NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenuSub>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
