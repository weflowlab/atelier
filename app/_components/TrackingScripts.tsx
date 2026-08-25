// 측정 스크립트 — 환경변수에 ID 가 있을 때만 로드.
// NEXT_PUBLIC_GA_ID: GA4 측정 ID (G-XXXX) / NEXT_PUBLIC_NAVER_WCS_ID: 네이버 프리미엄 로그분석 공통 ID
// 스마트로그(실시간 유입·부정클릭 감지)는 계정 고정값이라 항상 로드
import Script from "next/script";

// 스마트로그 계정 정보 — smart.js 가 전역 hpt_info 를 읽으므로 로드 전에 인라인으로 선언해야 한다
const SMLOG_ACCOUNT = "UHPT-39164";
const SMLOG_SERVER = "a31";

export default function TrackingScripts() {
  const ga = process.env.NEXT_PUBLIC_GA_ID;
  const wcs = process.env.NEXT_PUBLIC_NAVER_WCS_ID;
  return (
    <>
      {/* Smartlog — 부정클릭 방지 · 실시간 유입 분석 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `var hpt_info={'_account':'${SMLOG_ACCOUNT}', '_server': '${SMLOG_SERVER}'};`,
        }}
      />
      <Script src="https://cdn.smlog.co.kr/core/smart.js" charSet="utf-8" strategy="afterInteractive" />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://${SMLOG_SERVER}.smlog.co.kr/smart_bda.php?_account=${SMLOG_ACCOUNT.replace("UHPT-", "")}`} alt="" style={{ display: "none", width: 0, height: 0 }} />
      </noscript>
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
