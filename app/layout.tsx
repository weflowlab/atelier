// 루트 레이아웃: 폰트(고딕/세리프/스크립트) + SEO 메타데이터 + LocalBusiness JSON-LD + 측정 스크립트 + 유입 파라미터 캡처.
import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { SITE, REGION_NAMES, PRODUCT_KEYWORDS } from "./_lib/data";
import TrackingScripts from "./_components/TrackingScripts";
import AttributionCapture from "./_components/AttributionCapture";

const notoSans = Noto_Sans_KR({ variable: "--font-noto-sans", subsets: ["latin"], weight: ["400", "500", "700"] });
const notoSerif = Noto_Serif_KR({ variable: "--font-noto-serif", subsets: ["latin"], weight: ["400", "600"] });

// 탭 제목/설명 (지역·상품 키워드는 keywords 와 JSON-LD 에 포함)
const TITLE = `ATELIER | ${SITE.bizName}`; // 브라우저 탭 제목: "ATELIER | 커튼장인 아뜰리에"
const DESC = "커튼·블라인드 전문. 믿을 수 있는 전문가가 직접 실측·제작·시공합니다.";

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
  // suppressHydrationWarning: head 의 인라인 스크립트가 hydration 전에 data-intro 속성을 붙이므로 <html> 속성 불일치 경고만 억제
  return (
    <html lang="ko" className={`${notoSans.variable} ${notoSerif.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* 재방문(세션)·모션 최소화면 인트로를 첫 페인트부터 숨김 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('atelier_intro_seen')||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.setAttribute('data-intro','seen')}}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <TrackingScripts />
        <AttributionCapture />
      </body>
    </html>
  );
}
