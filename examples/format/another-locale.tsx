import { BooleanUIProvider } from "@booleanpress/ui/provider"
import { FormatBytes, FormatCurrency, FormatDate, FormatNumber, FormatRelativeTime } from "@booleanpress/ui/format"

const NOW = "2026-10-14T12:00:00Z"

function Figures({ currency }: { currency: string }) {
  return (
    <ul className="space-y-1 text-sm/normal tabular-nums">
      <li>
        <FormatNumber value={1240861.5} />
      </li>
      <li>
        <FormatCurrency value={1234.5} currency={currency} />
      </li>
      <li>
        <FormatNumber value={0.4286} style="percent" maximumFractionDigits={1} />
      </li>
      <li>
        <FormatBytes value={3_670_016} />
      </li>
      <li>
        <FormatDate value="2026-10-14" dateStyle="long" />
      </li>
      <li>
        <FormatRelativeTime value="2026-10-14T09:00:00Z" now={NOW} />
      </li>
    </ul>
  )
}

export default function FormatAnotherLocale() {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-6">
      <figure lang="de-DE" className="space-y-2">
        <figcaption className="font-medium">Deutsch</figcaption>
        <BooleanUIProvider locale="de-DE">
          <Figures currency="EUR" />
        </BooleanUIProvider>
      </figure>
      <figure lang="ar-EG" dir="rtl" className="space-y-2">
        <figcaption className="font-medium">العربية</figcaption>
        <BooleanUIProvider locale="ar-EG">
          <Figures currency="EGP" />
        </BooleanUIProvider>
      </figure>
    </div>
  )
}
