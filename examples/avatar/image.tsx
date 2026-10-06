import { Avatar, AvatarFallback, AvatarImage } from "@booleanpress/ui/avatar"

const PHOTO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#6366f1"/><circle cx="32" cy="25" r="11" fill="#e0e7ff"/><path d="M10 64c2-16 12-24 22-24s20 8 22 24z" fill="#e0e7ff"/></svg>'
  )

export default function AvatarImageExample() {
  return (
    <Avatar>
      <AvatarImage src={PHOTO} alt="Ada Lovelace" />
      <AvatarFallback>AL</AvatarFallback>
    </Avatar>
  )
}
