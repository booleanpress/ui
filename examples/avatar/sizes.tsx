import { Avatar, AvatarFallback } from "@booleanpress/ui/avatar"

export default function AvatarSizes() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>AL</AvatarFallback>
      </Avatar>
    </div>
  )
}
