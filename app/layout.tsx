// 루트 레이아웃: 폰트(고딕/세리프/스크립트) + SEO 메타데이터 + LocalBusiness JSON-LD + 측정 스크립트 + 유입 파라미터 캡처.
import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR, Great_Vibes } from "next/font/google";
import "./globals.css";
import { SITE, REGION_NAMES, PRODUCT_KEYWORDS } from "./_lib/data";
import TrackingScripts from "./_components/TrackingScripts";
import AttributionCapture from "./_components/AttributionCapture";

const notoSans = Noto_Sans_KR({ variable: "--font-noto-sans", subsets: ["latin"], weight: ["300", "400", "500", "700"] });
const notoSerif = Noto_Serif_KR({ variable: "--font-noto-serif", subsets: ["latin"], weight: ["400", "600"] });
const script = Great_Vibes({ variable: "--font-script", subsets: ["latin"], weight: "400" });

// 파워링크 키워드와 일치하도록 지역/상품 키워드를 title/description 에 포함
const TITLE = SITE.bizName; // 브라우저 탭 제목: "커튼장인 아뜰리에"
const DESC = `${SITE.serviceAreaLabel} 커튼·블라인드 전문. 암막커튼, 쉬폰커튼, 린넨커튼, 로만쉐이드, 허니콤·우드블라인드 무료 방문 실측 후 맞춤 제작·직접 시공. ${SITE.careerYears}년 경력 커튼장인.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.siteUrl),
  title: TITLE,
  description: DESC,
  keywords: [...REGION_NAMES.map((r) => `${r} 커튼`), ...REGION_NAMES.map((r) => `${r} 블라인드`), ...PRODUCT_KEYWORDS],
  openGraph: { title: TITLE, description: DESC, type: "website", locale: "ko_KR", siteName: SITE.bizName },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

// 검색엔진용 지역 비즈니스 구조화 데이터
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: SITE.bizName,
  alternateName: `${SITE.nameKo} ${SITE.nameEn}`,
  description: DESC,
  url: SITE.siteUrl,
  telephone: SITE.tels[0],
  address: { "@type": "PostalAddress", addressRegion: "경기도", addressLocality: "남양주시", streetAddress: SITE.address, addressCountry: "KR" },
  areaServed: REGION_NAMES.map((name) => ({ "@type": "City", name })),
  openingHours: "Mo-Su 08:00-24:00",
  makesOffer: PRODUCT_KEYWORDS.map((p) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: `${p} 맞춤 제작·시공` } })),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable} ${script.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <TrackingScripts />
        <AttributionCapture />
      </body>
    </html>
  );
}
