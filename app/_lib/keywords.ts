// 유입 키워드(?kw= 또는 n_keyword)를 히어로 헤드라인/폼 기본값에 매칭.
// 예: "남양주암막커튼" → region "남양주", product "암막커튼"
import { REGION_NAMES, PRODUCT_KEYWORDS } from "./data";

export type KeywordMatch = { region?: string; product?: string; headline?: string };

export function matchKeyword(kw?: string | null): KeywordMatch {
  if (!kw) return {};
  const k = kw.replace(/\s+/g, "");
  const region = REGION_NAMES.find((r) => k.includes(r));
  // 긴 키워드 우선 매칭 (예: "암막커튼" 이 "커튼" 보다 먼저)
  const product = [...PRODUCT_KEYWORDS].sort((a, b) => b.length - a.length).find((p) => k.includes(p));
  if (!region && !product) return {};
  const headline = `${region ? `${region} ` : ""}${product ?? "커튼 · 블라인드"}\n무료 방문실측 · 맞춤 제작 · 직접 시공`;
  return { region, product, headline };
}
