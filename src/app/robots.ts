import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/", // Block private folders if you have any later
    },
    sitemap: "https://sani-mohibur.netlify.app/sitemap.xml", // Replace with your live URL later
  };
}
