import { ActivityIcon, BellIcon, KeyRoundIcon, LifeBuoyIcon, MailIcon, PlugIcon, ScrollTextIcon, SettingsIcon } from "lucide-react"
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
  { title: "Sending", icon: MailIcon, links: [{ label: "Connections", icon: PlugIcon }, { label: "Delivery log", icon: ScrollTextIcon }] },
  { title: "Monitoring", icon: ActivityIcon, links: [{ label: "Alerts", icon: BellIcon }, { label: "Reports", icon: ActivityIcon }] },
  { title: "Settings", icon: SettingsIcon, links: [{ label: "API keys", icon: KeyRoundIcon }, { label: "General", icon: SettingsIcon }] },
]

export default function NavigationMenuIcons() {
  return (
    <div className="flex h-40 w-full items-start justify-center">
      <NavigationMenu viewport={false}>
        <NavigationMenuList>
          {SECTIONS.map(({ title, icon: Icon, links }) => (
            <NavigationMenuItem key={title}>
              <NavigationMenuTrigger>
                <Icon />
                {title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="flex w-44 flex-col gap-0.5">
                  {links.map(({ label, icon: LinkIcon }) => (
                    <li key={label}>
                      <NavigationMenuLink href={`#${label.toLowerCase().replaceAll(" ", "-")}`} className="flex-row items-center gap-2">
                        <LinkIcon />
                        {label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
          <NavigationMenuItem>
            <NavigationMenuLink href="#support" className={navigationMenuTriggerStyle()}>
              <LifeBuoyIcon />
              Support
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
