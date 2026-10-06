import { useState } from "react"
import { SearchField } from "@booleanpress/ui/search-field"

const MAILERS = ["Amazon SES", "Brevo", "Mailgun", "Postmark", "SendGrid", "SMTP2GO", "SparkPost", "Zoho Mail"]

export default function SearchFieldResultsCount() {
  const [query, setQuery] = useState("")
  const matches = MAILERS.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <div className="flex w-full max-w-sm flex-col gap-2">
      <SearchField
        aria-label="Search mailers"
        placeholder="Search mailers"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-describedby="mailer-count"
      />
      <p id="mailer-count" role="status" className="text-xs text-muted-foreground">
        {matches.length} of {MAILERS.length} mailers
      </p>
      <ul className="flex flex-col gap-1 text-sm">
        {matches.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  )
}
