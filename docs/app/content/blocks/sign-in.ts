import type { BlockDoc } from "./types.ts"

export default {
  slug: "sign-in",
  title: "Sign in",
  purpose: "A sign-in screen: email and password, a remembered session, single sign-on and the errors a person can meet.",
  usage: `A card centred on the page, with the product's name above it. The fields are \`Field\` parts, so each label, description and error is tied to its control: submitting with an empty field marks it invalid, says why under it and moves focus to the first one. While the request runs, the button shows its spinner and the form cannot be sent twice.

When you copy it, replace the timeout in \`signIn\` with your request, show the error your server returns in the alert, and point the links at your password reset and sign-up pages. Keep \`autoComplete\` on both fields, so password managers fill them.`,
  frameHeight: 720,
} satisfies BlockDoc
