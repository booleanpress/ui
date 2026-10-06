import type { ReactNode } from "react"
import { BooleanUIProvider } from "@booleanpress/ui/provider"
import "./globals.css"

export const metadata = { title: "@booleanpress/ui — Next.js fixture" }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BooleanUIProvider>{children}</BooleanUIProvider>
      </body>
    </html>
  )
}
