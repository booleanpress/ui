// A block's page: a whole screen built only from the package's components, to copy into an app. Its code is
// `examples/blocks/<slug>.tsx`, which is also its preview and a test target, as an example is.

export interface BlockDoc {
  slug: string
  title: string
  /** The one-line purpose under the title. */
  purpose: string
  /** Markdown: what the screen holds, and what to change when you copy it into an app. */
  usage: string
  /** The height of its frame in pixels, at both widths: the window the screen fills. */
  frameHeight: number
}
