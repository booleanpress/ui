import * as React from "react"
import { cn } from "@booleanpress/ui/utils"
import { focusOutline } from "~/shell/styles.ts"
import { CopyButton } from "./CopyButton.tsx"

const MANAGERS = [
  { id: "npm", add: "npm install" },
  { id: "pnpm", add: "pnpm add" },
  { id: "yarn", add: "yarn add" },
  { id: "bun", add: "bun add" },
] as const

type Manager = (typeof MANAGERS)[number]["id"]

/** The install command for the packages, in the package manager the reader picks: a bar of the four over the command. */
export function InstallCommand({ packages }: { packages: string[] }) {
  const [manager, setManager] = React.useState<Manager>("npm")
  const add = MANAGERS.find((m) => m.id === manager)!.add
  const command = `${add} ${packages.join(" ")}`
  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center gap-2 border-b p-1 pe-1.5">
        <div role="group" aria-label="Package manager" className="flex items-center gap-0.5">
          {MANAGERS.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={manager === m.id}
              onClick={() => setManager(m.id)}
              className={cn(
                "h-7 rounded-md px-2 font-mono text-sm text-muted-foreground transition-colors hover:text-[var(--docs-heading)] aria-pressed:bg-secondary aria-pressed:text-[var(--docs-heading)]",
                focusOutline
              )}
            >
              {m.id}
            </button>
          ))}
        </div>
        <div className="ms-auto">
          <CopyButton code={command} label="Copy the install command" />
        </div>
      </div>
      {/* On a narrow screen the line breaks between the words, never inside a package's name. */}
      <pre dir="ltr" className="px-4 py-3 font-mono text-sm whitespace-normal text-[var(--docs-heading)]">
        <code>
          {[add, ...packages].map((word, i) => (
            <React.Fragment key={word}>
              {i ? " " : null}
              <span className="whitespace-nowrap">{word}</span>
            </React.Fragment>
          ))}
        </code>
      </pre>
    </div>
  )
}
