import { FormatCurrency } from "@booleanpress/ui/format"

export default function FormatCurrencyExample() {
  return (
    <dl className="grid w-full max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm/normal">
      <dt className="text-muted-foreground">Business plan, monthly</dt>
      <dd className="text-end tabular-nums">
        <FormatCurrency value={29} currency="USD" />
      </dd>
      <dt className="text-muted-foreground">Invoice INV-2026-0142</dt>
      <dd className="text-end tabular-nums">
        <FormatCurrency value={1234.5} currency="EUR" />
      </dd>
      <dt className="text-muted-foreground">Refund to Northwind Ltd</dt>
      <dd className="text-end tabular-nums">
        <FormatCurrency value={-45} currency="GBP" currencySign="accounting" />
      </dd>
      <dt className="text-muted-foreground">Revenue this year</dt>
      <dd className="text-end tabular-nums">
        <FormatCurrency value={482500} currency="USD" notation="compact" />
      </dd>
      <dt className="text-muted-foreground">Price per 1,000 emails</dt>
      <dd className="text-end tabular-nums">
        <FormatCurrency value={0.085} currency="USD" maximumFractionDigits={3} />
      </dd>
    </dl>
  )
}
