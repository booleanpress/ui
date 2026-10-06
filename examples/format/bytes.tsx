import { FormatBytes } from "@booleanpress/ui/format"

const files = [
  { name: "unsubscribe.txt", size: 512 },
  { name: "invoice-0142.pdf", size: 245_760 },
  { name: "delivery-log-october.csv", size: 3_670_016 },
  { name: "mailbox-export.zip", size: 2_147_483_648 },
]

export default function FormatBytesExample() {
  return (
    <table className="w-full max-w-md text-sm/normal">
      <thead>
        <tr className="border-b text-muted-foreground">
          <th className="py-2 text-start font-medium">File</th>
          <th className="py-2 text-end font-medium">Decimal</th>
          <th className="py-2 text-end font-medium">Binary</th>
        </tr>
      </thead>
      <tbody>
        {files.map((file) => (
          <tr key={file.name} className="border-b last:border-0">
            <td className="py-2">{file.name}</td>
            <td className="py-2 text-end tabular-nums">
              <FormatBytes value={file.size} />
            </td>
            <td className="py-2 text-end tabular-nums">
              <FormatBytes value={file.size} units="binary" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
