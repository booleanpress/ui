import { LifeBuoyIcon, MailIcon, MousePointerClickIcon } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@booleanpress/ui/navigation-menu"

const GROUPS = [
  { title: "Sending", icon: MailIcon, links: ["SMTP relay", "Email API", "Templates", "Webhooks"] },
  { title: "Tracking", icon: MousePointerClickIcon, links: ["Opens", "Clicks", "Bounces", "Complaints"] },
  { title: "Support", icon: LifeBuoyIcon, links: ["Help desk", "Knowledge base", "Live chat", "Status page"] },
]

const slug = (text: string) => `#${text.toLowerCase().replaceAll(" ", "-")}`

export default function NavigationMenuMegaMenu() {
  return (
    <div className="flex h-80 w-full items-start justify-center">
      <NavigationMenu className="w-[34rem] max-w-none flex-none">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-[33rem] grid-cols-3 gap-x-2 gap-y-1 p-1">
                {GROUPS.map(({ title, icon: Icon, links }) => (
                  <div key={title} className="flex flex-col gap-0.5">
                    <p className="flex items-center gap-2 px-2.5 py-1 text-sm/normal font-semibold text-muted-foreground">
                      <Icon aria-hidden="true" className="size-3.5" />
                      {title}
                    </p>
                    <ul className="flex flex-col gap-0.5">
                      {links.map((link) => (
                        <li key={link}>
                          <NavigationMenuLink href={slug(link)}>{link}</NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <NavigationMenuLink href="#inbound-routing" className="col-span-3 mt-1 bg-muted px-4 py-3">
                  <span className="font-semibold text-foreground">New: inbound routing</span>
                  <span className="text-muted-foreground">Send replies to the right help desk queue.</span>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#pricing" className={navigationMenuTriggerStyle()}>Pricing</NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#docs" className={navigationMenuTriggerStyle()}>Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
