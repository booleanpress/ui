import { Banner, BannerDescription, BannerTitle } from "@booleanpress/ui/banner"

export default function BannerTones() {
  return (
    <div className="flex w-full flex-col gap-3">
      <Banner tone="neutral">
        <BannerDescription>Scheduled maintenance on 12 October 2026, 02:00–03:00 UTC.</BannerDescription>
      </Banner>
      <Banner tone="info">
        <BannerTitle>New sending limits</BannerTitle>
        <BannerDescription>Free plans can send 500 emails a day from 1 November 2026.</BannerDescription>
      </Banner>
      <Banner tone="success">
        <BannerDescription>Your domain example.com is verified. Emails are signed with DKIM.</BannerDescription>
      </Banner>
      <Banner tone="warning">
        <BannerDescription>The Primary mailer has used 90% of this month’s quota.</BannerDescription>
      </Banner>
      <Banner tone="destructive">
        <BannerTitle>Sending is paused</BannerTitle>
        <BannerDescription>The SMTP server refused the last 25 connections.</BannerDescription>
      </Banner>
    </div>
  )
}
