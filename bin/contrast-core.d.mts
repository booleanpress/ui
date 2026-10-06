/** Types of contrast-core.mjs, for the documentation's theme builder. */
export declare const MIN: number
export declare const MIN_EDGE: number
export declare const EDGES: { edge: string; surfaces: string[] }[]
export interface Pair {
  text: string
  surfaces: string[]
  alpha?: { light?: number; dark?: number }
  /** Tokens a translucent surface is also measured over, beside the page background. */
  over?: string[]
}
export declare const PAIRS: Pair[]
export type Tokens = Record<string, string>
export declare function readThemes(css: string): { light: Tokens; dark: Tokens }
export declare function parseColour(value: string): [number, number, number, number] | null
export declare function ratio(a: number[], b: number[]): number
export interface Measurement {
  text: string
  surface: string
  ratio: number | null
  /** The ratio the pair must reach: MIN for text, MIN_EDGE for a control edge. */
  min: number
  note?: string
}
export declare function measure(tokens: Tokens, theme?: "light" | "dark"): Measurement[]
