// 사이트맵 — 단일 랜딩이므로 루트 1개 (도메인은 SITE.siteUrl)
import type { MetadataRoute } from "next";
import { SITE } from "./_lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
