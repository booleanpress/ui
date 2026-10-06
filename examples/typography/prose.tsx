import { Prose } from "@booleanpress/ui/typography"

export default function TypographyProse() {
  return (
    <Prose asChild className="max-w-xl">
      <article>
        <h1>Moving to a new mailer</h1>
        <p>
          Switching providers does not lose a single email. The old mailer keeps sending until the new one passes its
          first test, and the <a href="#delivery-log">delivery log</a> shows both side by side.
        </p>
        <h2>Before you start</h2>
        <p>
          Collect the new provider’s host, port and API key. Keys are shown once, so store yours in a secrets manager,
          not in <code>wp-config.php</code>.
        </p>
        <h3>Check your DNS</h3>
        <p>
          Add the provider’s <strong>SPF</strong> and <strong>DKIM</strong> records. Receiving servers check them on
          every message.
        </p>
        <pre>
          <code>{`v=spf1 include:_spf.example.com ~all`}</code>
        </pre>
        <h4>How long it takes</h4>
        <p>DNS changes usually reach every server within an hour, and always within two days.</p>
        <hr />
        <p>Questions? The support team answers within one working day.</p>
      </article>
    </Prose>
  )
}
