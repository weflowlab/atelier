// 측정 스크립트 — 환경변수에 ID 가 있을 때만 로드.
// NEXT_PUBLIC_GA_ID: GA4 측정 ID (G-XXXX) / NEXT_PUBLIC_NAVER_WCS_ID: 네이버 프리미엄 로그분석 공통 ID
import Script from "next/script";

export default function TrackingScripts() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const wcs = process.env.NEXT_PUBLIC_NAVER_WCS_ID;
  return (
    <>
      {ga && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga}');
          `}</Script>
        </>
      )}
      {wcs && (
        <>
          <Script src="https://wcs.naver.net/wcslog.js" strategy="afterInteractive" />
          <Script id="naver-wcs-init" strategy="afterInteractive">{`
            if (!window.wcs_add) window.wcs_add = {};
            window.wcs_add["wa"] = "${wcs}";
            if (window.wcs) { window.wcs_do(); }
          `}</Script>
        </>
      )}
    </>
  );
}
