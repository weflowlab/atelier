// 라이트박스 등 다른 컴포넌트에서 신청 폼의 "설치 제품"을 미리 선택시키는 커스텀 이벤트.
// dispatch: preselectProduct("로만쉐이드") → EstimateForm 이 수신해 PRODUCT_TYPE_OPTIONS 중 매칭 항목을 선택.
export const PRESELECT_EVENT = "atelier:preselect-product";

export function preselectProduct(product: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PRESELECT_EVENT, { detail: { product } }));
}

// 제품명 → 폼 옵션 매칭: 완전일치 → 부분일치(긴 옵션 우선) → 커튼/블라인드 대분류 → "상담 후 결정"
export function matchProductOption(product: string, options: readonly string[]): string {
  const norm = (s: string) => s.replace(/\s+/g, "");
  const p = norm(product);
  const exact = options.find((o) => norm(o) === p);
  if (exact) return exact;
  const partial = [...options]
    .sort((a, b) => b.length - a.length)
    .find((o) => p.includes(norm(o)) || norm(o).includes(p));
  if (partial) return partial;
  // 대분류로라도 맞춰줌 (예: "우드블라인드" → 알루미늄/콤비 등에 없으면 블라인드 계열 첫 항목)
  const isBlind = /블라인드|롤스크린|허니콤|콤비|트리플쉐이드|한옥쉐이드/.test(p);
  const fallback = options.find((o) => (isBlind ? /블라인드|쉐이드/.test(o) : /커튼/.test(o)));
  return fallback ?? options[options.length - 1]; // 마지막 항목("상담 후 결정")
}
