import { Avatar, AvatarFallback, AvatarImage } from "@booleanpress/ui/avatar"

export default function AvatarFallbackExample() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="" alt="Lena Torres" />
        <AvatarFallback>LT</AvatarFallback>
      </Avatar>
    </div>
  )
}
