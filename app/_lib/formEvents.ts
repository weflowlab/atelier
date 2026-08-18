// 라이트박스 등 다른 컴포넌트에서 신청 폼의 "원하는 상품"을 미리 선택시키는 커스텀 이벤트.
// dispatch: preselectProduct("로만쉐이드") → EstimateForm 이 수신해 PRODUCT_OPTIONS 중 매칭 항목을 체크.
export const PRESELECT_EVENT = "atelier:preselect-product";

export function preselectProduct(product: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PRESELECT_EVENT, { detail: { product } }));
}

// 제품명 → 폼 옵션 매칭 (부분 일치, 없으면 "기타")
export function matchProductOption(product: string, options: readonly string[]): string | undefined {
  const norm = (s: string) => s.replace(/\s+/g, "");
  const p = norm(product);
  return (
    options.find((o) => norm(o) === p) ??
    options.find((o) => p.includes(norm(o)) || norm(o).includes(p)) ??
    options.find((o) => (p.includes("전동") && o.includes("전동"))) ??
    options.find((o) => o === "기타")
  );
}

// 제품명 → 폼의 설치 제품 구분 (커튼 / 블라인드). 블라인드·롤스크린·쉐이드(트리플/허니콤)는 블라인드, 그 외 커튼
export function productTypeOf(product: string): string {
  const p = product.replace(/\s+/g, "");
  if (/블라인드|롤스크린|트리플쉐이드|허니콤|콤비/.test(p)) return "블라인드";
  return "커튼";
}
