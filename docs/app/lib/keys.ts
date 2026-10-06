// How a keyboard row's keys read: one spelling per key, and "+" only after a modifier, so ["Shift", "Tab"] reads
// "Shift + Tab" while ["Enter", "Space"] reads "Enter or Space".

const MODIFIERS = new Set(["Shift", "Ctrl", "Control", "Alt", "Option", "Meta", "Cmd", "⌘"])

const NAMES: Record<string, string> = {
  ArrowDown: "↓",
  ArrowUp: "↑",
  ArrowLeft: "←",
  ArrowRight: "→",
  "Down Arrow": "↓",
  "Up Arrow": "↑",
  "Left Arrow": "←",
  "Right Arrow": "→",
  "Arrow Down": "↓",
  "Arrow Up": "↑",
  "Arrow Left": "←",
  "Arrow Right": "→",
  Letters: "A–Z",
  PageUp: "Page Up",
  PageDown: "Page Down",
  Control: "Ctrl",
  Esc: "Escape",
}

/** The key as the tables print it. */
export const keyName = (key: string) => NAMES[key] ?? key

/** Each key with the joiner that comes before it: "" for the first, "+" after a modifier, "or" otherwise. */
export function keySequence(keys: string[]): { key: string; joiner: "" | "+" | "or" }[] {
  return keys.map((key, i) => ({ key: keyName(key), joiner: i === 0 ? "" : MODIFIERS.has(keys[i - 1]) ? "+" : "or" }))
}

/** The row as plain text, for the Markdown copy: "Shift + Tab", "Enter or Space". */
export const keysText = (keys: string[]) =>
  keySequence(keys)
    .map(({ key, joiner }) => (joiner ? `${joiner} ${key}` : key))
    .join(" ")
