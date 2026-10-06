import type { ComponentDoc } from "../types.ts"

export default {
  slug: "color-picker",
  title: "Color picker",
  category: "Form",
  purpose: "Lets people choose colours with an area, channel sliders, editable formats and a screen eyedropper.",
  links: {
    apg: { label: "APG Slider", href: "https://www.w3.org/WAI/ARIA/apg/patterns/slider/" },
    spec: "specs/004_full-suite-components.md#color-picker",
  },
  usage: `\`\`\`tsx
<ColorPicker defaultValue="#276def" aria-label="Button colour" />

<ColorPickerPopover defaultValue="#276def" aria-label="Link colour" />
\`\`\``,
  examples: [
    { id: "basic", title: "Basic", description: "An area, hue and alpha sliders, an eyedropper, a format selector and an editable value." },
    {
      id: "popover",
      title: "In a popover",
      description: "`ColorPickerPopover` opens the picker from a swatch button.",
    },
    {
      id: "vertical",
      title: "Vertical hue slider",
      description: "`orientation=\"vertical\"` stands the hue and alpha sliders beside the area.",
    },
    {
      id: "controlled",
      title: "Controlled",
      description: "`onValueChange` follows every move; `onValueCommit` reports the colour once a change ends.",
    },
    {
      id: "swatches",
      title: "Swatches",
      description: "`swatches` adds preset colours; the one matching the current colour is chosen.",
    },
    { id: "alpha", title: "Transparency", description: "Transparency is on by default, and a see-through colour carries its alpha in the hex." },
    { id: "opaque", title: "Opaque colours", description: "`alpha={false}` removes the transparency controls and gives six-digit hex." },
    { id: "formats", title: "Colour formats", description: "Switch between HEX, RGBA, HSBA, HSLA and OKLCHA without changing the colour." },
    { id: "advanced", title: "Channel composition", description: "Build your own layout from channel sliders, numeric fields, a CSS field and the eyedropper." },
    { id: "disabled", title: "Disabled", description: "A disabled picker cannot be changed and leaves the tab order." },
  ],
  accessibility: {
    semantics:
      'The picker is a `group`. The area and the hue and alpha sliders are `slider` controls; numeric channels are spinbuttons, and preset swatches are a radio group.',
    labels:
      'Name the picker with `aria-label` or `aria-labelledby`. Channel names and values are read in the provider\'s language; a swatch reads its `label`, else its hex.',
    focus:
      "Tab moves through the area, the sliders, the eyedropper, the format selector, the fields and the swatches. In a popover, focus moves into the picker on open and back to the swatch button on close.",
    limits: [
      "Colour is chosen by sight. The hex field and the swatches' names are the ways to choose an exact colour without it.",
      "The browser eyedropper is unavailable in some browsers and insecure contexts. Numeric and CSS fields remain available. OKLCH values are converted to sRGB and clipped to its gamut.",
      "In right-to-left pages the area and the horizontal sliders run from right to left, and the arrow keys follow them.",
    ],
  },
  keyboard: [
    { keys: ["←", "→"], behaviour: "On the area, lowers or raises the saturation by 1 and moves focus to the saturation input; on a slider, lowers or raises its value. Swapped in right-to-left pages, where the area and the sliders run from right to left." },
    { keys: ["↑", "↓"], behaviour: "On the area, raises or lowers the brightness by 1 and moves focus to the brightness input; on a slider, raises or lowers its value." },
    { keys: ["Shift", "→"], behaviour: "With an arrow key, moves 10 channel steps." },
    { keys: ["Page Up", "Page Down"], behaviour: "On the area, raises or lowers the brightness by 10; on a slider, its value by 10 channel steps." },
    { keys: ["Home", "End"], behaviour: "On the area, lowers or raises the saturation by 10 (as React Aria's ColorArea); on a slider, sets its minimum or maximum." },
    { keys: ["Enter"], behaviour: "In a colour field, commits the valid value and restores its formatted representation; numeric fields also support slider arrow, Page Up/Down and Home/End keys." },
    { keys: ["←", "→", "↑", "↓"], behaviour: "In the swatches, chooses the previous or next preset colour." },
  ],
  theming:
    "The area, the sliders and the swatches carry the colour itself; their edge is a 1px `--color-picker-edge` ring inside and the checks behind transparency are `--muted` on `--background`. The thumbs are 16 px circles with a white 3px ring in both themes, so they show on any colour. A chosen swatch has a 2px `--ring` ring 2px away. The hex field is an [input](/components/input).",
  props: {
    ColorPicker: {
      value: "A hex, RGB, HSL, HSB/HSV or OKLCH string when controlled. Pair it with `onValueChange`; output remains hex.",
      defaultValue: "The colour at the start, when it controls itself. `#000000` by default.",
      onValueChange: "Called with the hex colour while it changes.",
      onValueCommit: "Called with the hex colour once a drag, a key press or an edit of the hex field ends.",
      alpha: "True by default. Enables transparency; false hides the default alpha controls and emits opaque hex.",
      format: "Controlled display format: `hex`, `rgba`, `hsba`, `hsla` or `oklcha`. Does not change output serialization.",
      defaultFormat: "Initial display format; `hex` by default.",
      onFormatChange: "Called with the selected format, without changing the colour.",
      children: "Optional composition of ColorPickerArea, ColorPickerSlider, ColorPickerInput, ColorPickerPreview, ColorPickerFormatSelect and ColorPickerEyeDropper.",
      swatches: "Preset colours under the picker: hex strings, or `{ value, label }` to name them.",
      orientation: "`horizontal` (default) or `vertical`, which stands the sliders beside the area.",
      disabled: "Dims the picker and ignores the pointer and the keyboard.",
      size: "The hex field's and swatches' size: `sm`, `default` or `lg`. Defaults to the provider's `controlSize`.",
      variant: "`filled` fills the hex field grey. Defaults to the provider's `fieldVariant`.",
      name: "The form field name; the hex value is submitted with the form, and a reset of the form brings back `defaultValue`.",
    },
    ColorPickerPopover: {
      open: "Whether the popover is open, when you control it.",
      defaultOpen: "Whether the popover starts open.",
      onOpenChange: "Called when the popover opens or closes.",
      align: "The popover's alignment against the swatch: `start` (default), `center` or `end`.",
      side: "The side of the swatch the popover opens on. Below by default; it flips when there is no room.",
      size: "The swatch button: 28, 36 or 42 px, and the picker's field. Defaults to the provider's `controlSize`.",
    },
    ColorPickerSlider: {
      channel: "`red`, `green`, `blue`, `hue`, `saturation`, `brightness`, `lightness`, `chroma` or `alpha`.",
      format: "Optional channel interpretation: `rgba`, `hsba`, `hsla` or `oklcha`; defaults to the picker format.",
      orientation: "`horizontal` by default, or `vertical`.",
    },
    ColorPickerInput: {
      channel: "A numeric channel, `hex` (default) or `css`. CSS fields display OKLCH.",
      format: "Optional channel interpretation, useful when editing several colour spaces together.",
      grouped: "Use inside an attached InputGroup to share the group border; false by default.",
    },
    ColorSwatch: {
      color: "Any CSS colour: `#3b82f6`, `#3b82f680`, `rgb(…)`.",
      "aria-label": "Names the swatch as an image; without it the swatch is decorative.",
    },
  },
} satisfies ComponentDoc
