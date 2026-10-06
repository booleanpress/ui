import { Avatar, AvatarBadge, AvatarFallback } from "@booleanpress/ui/avatar"

export default function AvatarWithBadge() {
  return (
    <Avatar size="lg">
      <AvatarFallback>GH</AvatarFallback>
      <AvatarBadge className="bg-success">
        <span className="sr-only">Online</span>
      </AvatarBadge>
    </Avatar>
  )
}
