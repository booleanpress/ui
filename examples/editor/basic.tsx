import { Editor } from "@booleanpress/ui/editor"

const TEMPLATE = `<h2>Your password reset link</h2>
<p>Hi {{first_name}},</p>
<p>Someone asked to reset the password of your <strong>Northwind</strong> account. The link below works for <em>one hour</em>:</p>
<ul><li>Open the link on the device you sign in with.</li><li>Choose a password you have not used before.</li></ul>
<blockquote>If you did not ask for this, you can ignore this email.</blockquote>
<p>Questions? Read the <a href="https://example.com/help">help centre</a>.</p>`

export default function EditorBasic() {
  return <Editor aria-label="Email template" defaultValue={TEMPLATE} contentClassName="h-80" className="max-w-2xl" />
}
