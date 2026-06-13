import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yourdomain.com", // Replace with your live URL later
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
