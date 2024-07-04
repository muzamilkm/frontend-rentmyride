import { SiteConfig, ContactConfig } from "@/types"

/* ====================
[> WEBSITE CONFIG <]
-- Fill the details about your website
 ==================== */

const baseUrl = "https://nextlanding.rdev.pro"

export const siteConfig: SiteConfig = {
  name: "RentMyRide",
  author: "muzamilkm",
  description:
    "Rent a car from your neighbors for a day, week, or even a month.",
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Radix UI",
    "shadcn/ui",
    "Landing Page",
    "Template",
    "Starter",
  ],
  url: {
    base: baseUrl,
    author: "Muzamil Kaleem",
  },
  ogImage: `${baseUrl}/og.jpg`,
}