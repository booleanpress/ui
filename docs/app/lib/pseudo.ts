import { DEFAULT_STRINGS, type UiStrings } from "@booleanpress/ui/provider"

const PLAIN = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
const ACCENTED = [..."áƀćđéƒğħíĵķĺɱńóþǫŕšťúṽŵẋýžÁƁĆĐÉƑĞĦÍĴĶĹṀŃÓÞǪŔŠŤÚṼŴẊÝŽ"]
const ACCENTS = Object.fromEntries([...PLAIN].map((ch, i) => [ch, ACCENTED[i]]))

/**
 * A visibly translated copy of a string: accented letters in brackets, so untranslated English stands out. `{name}`
 * placeholders stay as written, so `fillString()` still fills them.
 */
export const pseudo = (text: string) =>
  `[${text
    .split(/(\{\w+\})/)
    .map((part) => (/^\{\w+\}$/.test(part) ? part : [...part].map((ch) => ACCENTS[ch] ?? ch).join("")))
    .join("")}]`

export const PSEUDO_STRINGS = Object.fromEntries(
  Object.entries(DEFAULT_STRINGS).map(([key, value]) => [key, pseudo(value)])
) as UiStrings
