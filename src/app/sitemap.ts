import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://sani-mohibur.netlify.app", // Replace with your live URL later
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
