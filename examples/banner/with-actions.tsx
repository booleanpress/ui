import { Banner, BannerActions, BannerDescription, BannerTitle } from "@booleanpress/ui/banner"
import { Button } from "@booleanpress/ui/button"

export default function BannerWithActions() {
  return (
    <Banner tone="warning" className="w-full">
      <BannerTitle>Your licence expires in 5 days</BannerTitle>
      <BannerDescription>Renew it to keep receiving updates and support.</BannerDescription>
      <BannerActions>
        <Button size="sm" variant="outline">
          Remind me later
        </Button>
        <Button size="sm">Renew licence</Button>
      </BannerActions>
    </Banner>
  )
}
