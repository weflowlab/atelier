// robots.txt — 전체 허용 + 사이트맵 위치
import type { MetadataRoute } from "next";
import { SITE } from "./_lib/data";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${SITE.siteUrl}/sitemap.xml` };
}
