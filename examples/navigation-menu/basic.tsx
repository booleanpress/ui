import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@booleanpress/ui/navigation-menu"

const SECTIONS = [
  { title: "Sending", links: ["Connections", "Routing rules", "Suppression list"] },
  { title: "Logs", links: ["Delivery log", "Bounces", "Webhook events"] },
  { title: "Settings", links: ["General", "Notifications", "API keys"] },
]

export default function NavigationMenuBasic() {
  return (
    <div className="flex h-44 w-full items-start justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          {SECTIONS.map((section) => (
            <NavigationMenuItem key={section.title}>
              <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-48 flex-col gap-0.5">
                  {section.links.map((link) => (
                    <li key={link}>
                      <NavigationMenuLink href={`#${link.toLowerCase().replaceAll(" ", "-")}`}>{link}</NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuLink href="#help" className={navigationMenuTriggerStyle()}>
              Help
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
