// 랜딩페이지 전역 콘텐츠 데이터.
// 문구/메뉴/카드 목록만 바꾸면 UI 전체에 반영되도록 한 곳에 모아둠.

export const SITE = {
  name: "ATELIER", // 로고 텍스트 (참고 사이트: U & CHANG)
  nameKo: "아뜰리에",
  tel: "010-0000-0000",
  fax: "0504-000-0000",
  email: "hello@example.com",
  bizLicense: "000-00-00000",
  hours: ["MON - FRI : 09:00 ~ 18:00", "Sunday , Holiday : none"],
};

// GNB 메뉴 — children 이 있으면 데스크톱 드롭다운 / 모바일 아코디언으로 렌더
export type NavItem = { label: string; href: string; children?: NavItem[] };
export const NAV: NavItem[] = [
  { label: "회사소개", href: "#about" },
  {
    label: "커튼",
    href: "#curtain",
    children: [
      "일반 암막", "100프로 암막", "친환경 커튼", "속지 커튼",
      "수입커튼", "전동 커튼", "디자인 커튼", "병원커튼",
    ].map((l) => ({ label: l, href: "#curtain" })),
  },
  {
    label: "블라인드",
    href: "#blind",
    children: [
      "콤비 블라인드", "우드 블라인드", "암막 콤비 블라인드", "디자인 콤비 블라인드",
      "트리플 쉐이드", "허니콤 블라인드", "롤 스크린 블라인드", "알루미늄 블라인드",
    ].map((l) => ({ label: l, href: "#blind" })),
  },
  { label: "무료방문견적", href: "#estimate" },
  {
    label: "시공사진",
    href: "#gallery",
    children: ["가정블라인드", "가정커튼", "병원/학원", "상가", "사무실"].map((l) => ({ label: l, href: "#gallery" })),
  },
  {
    label: "커뮤니티",
    href: "#community",
    children: ["공지사항", "이벤트", "Q&A"].map((l) => ({ label: l, href: "#community" })),
  },
];

// 히어로 슬라이드 — 이미지는 플레이스홀더, 나중에 src 로 교체
export type Slide = { id: number; title: string; sub: string; src?: string };
export const HERO_SLIDES: Slide[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: ["트렌디하고 젊은 감성의", "다양한 디자인", "합리적인 가격", "무료 방문 견적", "빠른 시공"][i],
  sub: "CURTAIN & BLIND",
}));

// 제품 카드 (CURTAIN / BLIND 캐러셀 공용)
export type ProductCard = { id: string; name: string; caption: string; src?: string };
const caption = "HANDCRAFTED FROM THE MOST";
export const CURTAINS: ProductCard[] = [
  "100암막커튼", "디자인커튼", "일반암막", "일반암막커튼", "일반커튼", "친환경커튼", "전동커튼",
].map((n, i) => ({ id: `c${i}`, name: n, caption }));
export const BLINDS: ProductCard[] = [
  "디자인콤비블라인드", "롤스크린", "알루미늄블라인드", "암막콤비블라인드",
  "우드블라인드", "콤비블라인드", "트리플쉐이드", "허니콤블라인드",
].map((n, i) => ({ id: `b${i}`, name: n, caption }));

// 견적 폼 선택지
export const PLACE_OPTIONS = ["아파트", "주택", "상가", "사무실", "병원"];
export const PRODUCT_OPTIONS = [
  "콤비블라인드", "우드블라인드", "암막블라인드", "사계절커튼", "암막커튼",
  "차르르커튼", "전동블라인드", "전동커튼", "병원커튼",
];

// 시공사진 그리드 (호버 시 오버레이 텍스트)
export type GalleryItem = { id: string; title: string; category: string; src?: string };
export const GALLERY: GalleryItem[] = [
  { id: "g1", title: "거실 암막커튼", category: "가정커튼" },
  { id: "g2", title: "침실 콤비블라인드", category: "가정블라인드" },
  { id: "g3", title: "병원 커튼", category: "병원/학원" },
  { id: "g4", title: "카페 우드블라인드", category: "상가" },
  { id: "g5", title: "사무실 롤스크린", category: "사무실" },
];
