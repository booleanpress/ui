import { ScrollTop } from "@booleanpress/ui/scroll-top"

// Twenty fixed entries, enough to scroll the frame this example is shown in.
const ENTRIES = Array.from({ length: 20 }, (_, index) => ({
  id: 4820 - index,
  to: `customer${index + 1}@example.com`,
  status: index % 7 === 3 ? "Failed" : "Delivered",
}))

export default function ScrollTopWindow() {
  return (
    <main className="mx-auto w-full max-w-xl p-6 text-sm">
      <h4 className="mb-2 font-semibold">Delivery log</h4>
      <p className="mb-4 text-muted-foreground">Scroll down: the button appears in the corner after 200 px.</p>
      <ul className="flex flex-col divide-y rounded-md border">
        {ENTRIES.map((entry) => (
          <li key={entry.id} className="flex justify-between px-4 py-3">
            <span>
              #{entry.id} to {entry.to}
            </span>
            <span className="text-muted-foreground">{entry.status}</span>
          </li>
        ))}
      </ul>
      <ScrollTop threshold={200} />
    </main>
  )
}
