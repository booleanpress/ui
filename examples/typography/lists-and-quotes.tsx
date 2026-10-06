import { Blockquote, Prose } from "@booleanpress/ui/typography"

export default function TypographyListsAndQuotes() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <Prose>
        <ul>
          <li>Connect a mailer</li>
          <li>
            Verify your domain
            <ul>
              <li>Add the SPF record</li>
              <li>Add the DKIM record</li>
            </ul>
          </li>
          <li>Send a test email</li>
        </ul>
        <ol>
          <li>Create an API key.</li>
          <li>Paste it into the mailer’s settings.</li>
          <li>Save, then press Send test.</li>
        </ol>
        <blockquote>
          <p>We moved forty sites to the new mailer in an afternoon, and no customer noticed.</p>
        </blockquote>
      </Prose>
      <Blockquote>A Blockquote on its own, outside Prose, looks the same.</Blockquote>
    </div>
  )
}
