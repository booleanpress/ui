import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@booleanpress/ui/avatar"

/** A person's silhouette on a coloured square, as a stand-in photo. */
const photo = (ground: string, figure: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${ground}"/><circle cx="32" cy="25" r="11" fill="${figure}"/><path d="M10 64c2-16 12-24 22-24s20 8 22 24z" fill="${figure}"/></svg>`
  )

const PEOPLE = [
  { name: "Ada Lovelace", initials: "AL", src: photo("#6366f1", "#e0e7ff") },
  { name: "Grace Hopper", initials: "GH", src: photo("#059669", "#d1fae5") },
  { name: "Lena Torres", initials: "LT", src: photo("#d97706", "#fef3c7") },
]

export default function AvatarGroupExample() {
  return (
    <AvatarGroup>
      {PEOPLE.map((person) => (
        <Avatar key={person.name}>
          <AvatarImage src={person.src} alt={person.name} />
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        <span aria-hidden="true">+4</span>
        <span className="sr-only">4 more people</span>
      </AvatarGroupCount>
    </AvatarGroup>
  )
}
