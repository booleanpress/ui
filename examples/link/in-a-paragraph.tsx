import { Link } from "@booleanpress/ui/link"

export default function LinkInAParagraph() {
  return (
    <p className="max-w-md text-sm/normal">
      A mailer stops sending once the provider rejects its key. Create a new key in the{" "}
      <Link href="#api-keys" underline="always">
        API keys
      </Link>{" "}
      settings, then read the{" "}
      <Link href="https://example.com/docs/keys" underline="always" external>
        provider’s key guide
      </Link>{" "}
      for the scopes it needs.
    </p>
  )
}
