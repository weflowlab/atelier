// 유입 키워드(?kw= 또는 n_keyword)를 히어로 헤드라인/폼 기본값에 매칭.
// 예: "남양주암막커튼" → region "남양주", product "암막커튼"
import { REGION_NAMES, PRODUCT_KEYWORDS } from "./data";

export type KeywordMatch = { region?: string; product?: string; headline?: string };

// 줄임말·별칭 → 페이지에 나오는 정식 제품명 (헤드라인·폼 프리필에 쓰는 표기)
const PRODUCT_ALIASES: Record<string, string> = {
  생활암막: "생활암막커튼",
  허니콤: "허니콤블라인드",
  콤비: "콤비블라인드",
  유니슬렛: "유니슬렛커튼",
  롤스크린: "롤스크린 블라인드",
  썬스크린: "썬스크린 블라인드",
};

// 긴 이름 우선 — "남양주"가 "양주"보다, "암막커튼"이 "커튼"보다 먼저 잡히게
const byLength = (a: string, b: string) => b.length - a.length;
const REGIONS_SORTED = [...REGION_NAMES].sort(byLength);
const PRODUCTS_SORTED = [...PRODUCT_KEYWORDS, ...Object.keys(PRODUCT_ALIASES)].sort(byLength);

export function matchKeyword(kw?: string | null): KeywordMatch {
  if (!kw) return {};
  const k = kw.replace(/\s+/g, "");
  const region = REGIONS_SORTED.find((r) => k.includes(r));
  const raw = PRODUCTS_SORTED.find((p) => k.includes(p));
  const product = raw ? (PRODUCT_ALIASES[raw] ?? raw) : undefined;
  if (!region && !product) return {};
  const headline = `${region ? `${region} ` : ""}${product ?? "커튼 · 블라인드"}\n무료 방문 실측 · 맞춤 제작 · 직접 시공`;
  return { region, product, headline };
}
