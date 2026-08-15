// 전환 이벤트 공통 함수 — GA4(gtag) + 네이버 프리미엄 로그분석(wcs) 에 동시에 전송.
// 스크립트가 없으면 조용히 무시. 이벤트명은 아래 상수만 사용해 대시보드와 이름을 맞춤.
import { getAttribution } from "./attribution";

export const EVENTS = {
  LEAD_SUBMIT: "generate_lead",  // 폼 접수 완료 (핵심 전환)
  CLICK_CALL: "click_call",      // 전화 버튼 클릭
  CLICK_KAKAO: "click_kakao",    // 카카오톡 버튼 클릭
  CLICK_CTA: "click_cta",        // 견적 신청 버튼 클릭(스크롤 이동)
} as const;
type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// 네이버 전환 유형: 1 구매, 2 회원가입, 3 장바구니, 4 신청/예약, 5 기타
const NAVER_CNV: Partial<Record<EventName, string>> = {
  generate_lead: "4",
  click_call: "5",
  click_kakao: "5",
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    wcs?: { cnv: (type: string, value: string) => unknown };
    wcs_do?: (nasa?: Record<string, unknown>) => void;
    wcs_add?: Record<string, string>;
  }
}

export function track(event: EventName, params: Record<string, string | number | undefined> = {}) {
  if (typeof window === "undefined") return;
  const attr = getAttribution();
  const payload = { ...params, keyword: attr.n_keyword || attr.utm_term || attr.kw, source: attr.n_media || attr.utm_source };

  // GA4
  try {
    if (window.gtag) window.gtag("event", event, payload);
    else (window.dataLayer ||= []).push({ event, ...payload });
  } catch {}

  // 네이버 프리미엄 로그분석 전환
  try {
    const type = NAVER_CNV[event];
    if (type && window.wcs && window.wcs_do) {
      window.wcs_do({ cnv: window.wcs.cnv(type, "0") });
    }
  } catch {}

  if (process.env.NODE_ENV === "development") console.debug("[track]", event, payload);
}
