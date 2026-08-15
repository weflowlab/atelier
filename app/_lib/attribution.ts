// 광고 유입 파라미터 캡처 — 파워링크(n_*)/UTM/kw 등을 첫 방문 시 sessionStorage 에 저장.
// 폼 제출 시 함께 전송해 "어떤 키워드로 들어와 DB 신청까지 왔는지" 추적.
export const ATTR_KEYS = [
  // 네이버 검색광고 자동 추적 URL 파라미터
  "n_media", "n_query", "n_rank", "n_ad", "n_keyword", "n_keyword_id",
  "n_campaign_type", "n_ad_group", "n_ad_group_type", "n_match", "n_network",
  // 공통 UTM / 커스텀
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "kw", "gclid", "fbclid",
] as const;

export type Attribution = Partial<Record<(typeof ATTR_KEYS)[number], string>> & {
  landing_url?: string;
  referrer?: string;
  first_seen?: string;
};

const STORAGE_KEY = "atelier_attr";

// 첫 방문(랜딩) 시 1회 저장. 이미 저장돼 있으면 덮어쓰지 않음(최초 유입 기준).
export function captureAttribution(): Attribution | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
    const sp = new URLSearchParams(window.location.search);
    const attr: Attribution = {};
    ATTR_KEYS.forEach((k) => {
      const v = sp.get(k);
      if (v) attr[k] = v;
    });
    attr.landing_url = window.location.href;
    attr.referrer = document.referrer || undefined;
    attr.first_seen = new Date().toISOString();
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attr));
    return attr;
  } catch {
    return null;
  }
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

// 유입 키워드 (파워링크 n_keyword 우선 → utm_term → kw)
export function getEntryKeyword(): string | undefined {
  const a = getAttribution();
  return a.n_keyword || a.utm_term || a.kw;
}
