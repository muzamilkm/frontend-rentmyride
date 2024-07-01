import { HeroHeader, ContentSection } from "@/types/contents"

/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

export const heroHeader: HeroHeader = {
  header: `Rent a Car from Your Neighbors`,
  subheader: `Convenient. Affordable. Secure. Rent a car or list your own effortlessly.`,
  image: `/hero.png`,
}

export const featureCards: ContentSection = {
  header: `Powered by`,
  subheader: `The technology that drives RentMyRide`,
  content: [
    {
      text: `Next.js`,
      subtext: `The React Framework for production`,
      icon: "nextjs",
    },
    {
      text: `Express.js`,
      subtext: `Fast, unopinionated, minimalist web framework for Node.js`,
      icon: "expressjs",
    },
    {
      text: `MongoDB`,
      subtext: `Flexible and scalable database`,
      icon: "mongodb",
    },
  ],
}

export const features: ContentSection = {
  header: `Features`,
  subheader: `Why use RentMyRide?`,
  image: `/features-img.png`,
  content: [
    {
      text: `User-Friendly Interface`,
      subtext: `Easy to navigate for both car owners and renters`,
      icon: "userFriendly",
    },
    {
      text: `Highly Performant`,
      subtext: `Fast loading times and smooth performance`,
      icon: "barChart",
    },
    {
      text: `Flexible Renting Options`,
      subtext: `Rent a car for a day, week, or even a month`,
      icon: "rentingoptions",
    },
  ],
}