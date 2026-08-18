// 랜딩페이지 전역 콘텐츠 데이터.
// 문구/메뉴/카드 목록만 바꾸면 UI 전체에 반영되도록 한 곳에 모아둠.
// (구글폼 8섹션 + 파워링크 요구사항: 지역/상품 키워드, 가격 안내, 신뢰 요소, 지역별 콘텐츠, DB 수집)

export const SITE = {
  nameKo: "커튼장인",
  nameEn: "Atelier",
  tagline: "CURTAIN & BLIND",
  bizName: "커튼장인 아뜰리에",
  tels: ["1833-2523", "010-4126-2209"], // 첫 번째가 대표번호
  telHref: "tel:18332523",
  kakaoUrl: "https://open.kakao.com/o/sYZyueoi",
  hours: "MON - SUN : 08:00 AM ~ 12:00 AM",
  holiday: "Holidays Available",
  owner: "김용재",
  address: "경기도 남양주시 경춘로 1786 1층",
  bizAddress: "사업자주소 입력 예정",          // TODO
  bizNo: "180-17-02995",
  careerYears: 17,
  totalProjects: 12350, // 누적 시공 건수
  siteUrl: "https://example.com",            // TODO: 실제 도메인 (sitemap/JSON-LD 용)
  serviceAreaLabel: "서울 · 경기 · 인천 전 지역, 강원 일부(춘천·화천)",
};

// ── 지역 키워드 (파워링크 유입 지역) ─────────────────────────
export type Region = { slug: string; name: string; desc: string; spots?: string[] };
export const REGIONS: Region[] = [
  { slug: "namyangju", name: "남양주", desc: "남양주 전 지역 무료 방문 실측. 신도시 아파트부터 전원주택까지 맞춤 커튼·블라인드 시공.", spots: ["호평", "평내", "진접", "오남", "퇴계원", "와부"] },
  { slug: "maseok", name: "마석", desc: "마석·화도읍 인근 당일 방문 상담 가능. 전원주택 대형창 암막커튼, 린넨커튼 시공 다수.", spots: ["화도읍", "묵현리", "창현리"] },
  { slug: "hwado", name: "화도읍", desc: "화도읍 신축 아파트·타운하우스 쉬폰커튼, 우드블라인드 시공 사례 보유.", spots: ["마석우리", "가곡리"] },
  { slug: "dasan", name: "다산", desc: "다산신도시 아파트 거실 암막커튼, 허니콤 블라인드 시공 다수. 입주 일정에 맞춰 시공.", spots: ["다산동", "지금동", "도농"] },
  { slug: "byeollae", name: "별내", desc: "별내신도시·별내면 아파트, 상가 커튼·블라인드 맞춤 제작 및 직접 시공.", spots: ["별내동", "별내면"] },
  { slug: "guri", name: "구리", desc: "구리시 인창·교문·수택동 아파트 커튼, 로만쉐이드, 콤비블라인드 시공.", spots: ["인창동", "교문동", "수택동", "갈매"] },
];
export const REGION_NAMES = REGIONS.map((r) => r.name);

// ── 상품 키워드 ─────────────────────────────────────────────
export const PRODUCT_KEYWORDS = [
  "커튼", "암막커튼", "쉬폰커튼", "린넨커튼", "로만쉐이드",
  "블라인드", "허니콤블라인드", "우드블라인드", "콤비블라인드", "롤스크린",
];

// GNB 메뉴 — 섹션 앵커. children 이 있으면 드로어에서 아코디언
export type NavItem = { label: string; href: string; children?: NavItem[] };
export const NAV: NavItem[] = [
  { label: "브랜드 강점", href: "#pain" }, // 문제 제기(#pain)부터 읽히도록
  {
    label: "주요 제품 안내",
    href: "#products",
    children: [
      { label: "커튼", href: "#curtain" },
      { label: "블라인드", href: "#blind" },
      { label: "가격 · 견적 안내", href: "#price" },
    ],
  },
  { label: "시공 포트폴리오", href: "#gallery" },
  { label: "고객 후기", href: "#reviews" },
  { label: "진행 절차 · FAQ", href: "#process" },
];

// ① 히어로 — 첫 화면 핵심 문구: 무료 방문 실측 · 맞춤 제작 · 직접 시공 + 지역/상품 키워드
export type Slide = { id: number; eyebrow: string; title: string; sub: string; src?: string };
export const HERO_SLIDES: Slide[] = [
  { id: 1, eyebrow: "ATELIER CURTAIN & BLIND", title: "무료 실측부터 맞춤 제작,\n직접 시공까지 한 번에", sub: "커튼장인이 직접 방문해 실측하고 제작·시공합니다.", src: "/images/hero/hero-01.webp" },
  { id: 2, eyebrow: "CURTAIN", title: "암막커튼 · 쉬폰커튼\n로만쉐이드 맞춤 제작", sub: "프리미엄 원단을 실측 사이즈에 맞춰 제작합니다." },
  { id: 3, eyebrow: "BLIND", title: "허니콤 · 우드블라인드\n공간에 맞는 블라인드 제안", sub: "채광·단열·프라이버시까지 고려해 최적의 제품을 추천드립니다." },
];
export const HERO_CTA = {
  primary: { label: "무료 방문 실측 신청", href: "#estimate" },
  secondary: { label: "전화 상담", href: "tel:18332523" },
};
// 히어로 CTA 아래 핵심 배지 3개
export const HERO_BADGES = ["무료 방문 실측", "100% 맞춤 제작", "장인 직접 시공", "추가 비용 없음"];

// ② 문제 제기 & 공감
export const PAIN = {
  eyebrow: "PAIN POINT",
  title: "이런 고민, 한 번쯤 해보셨죠?",
  items: [
    { title: "사이즈가 안 맞아요", desc: "기성품 커튼은 창 크기와 맞지 않아\n빛이 새거나 바닥에 끌립니다." },
    { title: "암막? 쉬폰? 린넨?", desc: "종류가 많아 우리 집 거실·침실에 어떤 커튼·블라인드가 맞는지 고르기 어렵습니다." },
    { title: "시공이 불안해요", desc: "설치 후 처짐·틀어짐, 연락이 끊기는 업체 때문에 걱정됩니다." },
    { title: "가격이 불투명해요", desc: "방문 전에는 견적을 알 수 없고 추가 비용이 붙을까 불안합니다." },
  ],
};

// ③ 브랜드 강점 (Solution) — 아이콘과 함께 강조
export type Strength = { icon: "tape" | "fabric" | "sewing" | "shield" | "handshake" | "calendar"; title: string; desc: string; highlight?: boolean };
export const STRENGTH = {
  eyebrow: "SOLUTION",
  intro: "커튼장인 아뜰리에는",
  title: "믿을 수 있는 전문가가 직접 실측·제작·시공합니다", // 실제 렌더는 Strengths.tsx 에서 모바일 줄바꿈 포함해 직접 출력
  items: [
    { icon: "fabric", title: "엄선된 원단", desc: "프리미엄 원단만을\n엄선하여 사용" },
    { icon: "sewing", title: "장인의 시공", desc: "수년의 경력을 가진\n전문가가 직접 시공" },
    { icon: "tape", title: "100% 맞춤 제작", desc: "공간과 취향을 고려한\n1:1 맞춤 제작", highlight: true },
    { icon: "calendar", title: "무료 방문 실측", desc: "직접 방문해 실측하고\n투명한 견적 안내", highlight: true },
    { icon: "shield", title: "완벽한 마감", desc: "디테일한 마감으로\n오래도록 아름답게" },
    { icon: "handshake", title: "사후 관리", desc: "시공 후에도 책임있는\n관리와 A/S" },
  ] as Strength[],
};

// ④ 주요 제품 — 대표 4카드 + 커튼/블라인드 상세 캐러셀 (상품 키워드 반영)
export type Product = { id: string; en: string; ko: string; href: string; src?: string };
export const PRODUCTS: Product[] = [
  { id: "p1", en: "BLACKOUT CURTAIN", ko: "암막커튼", href: "#curtain" },
  { id: "p2", en: "SHEER & LINEN", ko: "쉬폰커튼 · 린넨커튼", href: "#curtain" },
  { id: "p3", en: "ROMAN SHADE", ko: "로만쉐이드", href: "#curtain" },
  { id: "p4", en: "BLIND", ko: "허니콤 · 우드블라인드", href: "#blind" },
];
export type ProductCard = { id: string; name: string; caption: string; src?: string; photos?: string[] }; // photos: 라이트박스용 시공 사진 (없으면 플레이스홀더)
export const CURTAINS: ProductCard[] = [
  ["로만쉐이드", "깔끔한 주름 · 주방/서재"], // 사진 있는 항목 우선
  ["암막커튼", "빛 차단 · 단열 · 침실/거실"],
  ["쉬폰커튼", "은은한 채광 · 거실 속커튼"],
  ["린넨커튼", "내추럴 질감 · 전원주택"],
  ["디자인커튼", "패턴 · 컬러 맞춤"],
  ["전동커튼", "리모컨 · 대형창"],
  ["병원/상가 커튼", "방염 · 항균 원단"],
].map(([name, caption], i) => ({ id: `c${i}`, name, caption }));
// 예시: 로만쉐이드 실제 시공 사진 (public/images/products/roman-shade/*.webp). 나머지 제품은 사진 준비 후 동일하게 추가
const ROMAN_PHOTOS = [1, 2, 3, 4].map((n) => `/images/products/roman-shade/roman-shade-${n}.webp`);
Object.assign(CURTAINS.find((c) => c.name === "로만쉐이드")!, { src: ROMAN_PHOTOS[0], photos: ROMAN_PHOTOS });
export const BLINDS: ProductCard[] = [
  ["트리플쉐이드", "부드러운 채광"], // 사진 있는 항목 우선
  ["허니콤블라인드", "단열 · 아이방/침실"],
  ["우드블라인드", "고급 원목 · 거실"],
  ["콤비블라인드", "채광 조절 · 전 공간"],
  ["암막콤비", "빛 차단 · 침실"],
  ["롤스크린", "심플 · 사무실/상가"],
  ["알루미늄블라인드", "습기 강함 · 주방/욕실"],
  ["전동블라인드", "리모컨 · 대형창"],
].map(([name, caption], i) => ({ id: `b${i}`, name, caption }));
// 예시: 트리플쉐이드 실제 시공 사진 4장 (public/images/products/triple-shade/*.webp)
const TRIPLE_PHOTOS = [1, 2, 3, 4].map((n) => `/images/products/triple-shade/triple-shade-${n}.webp`);
Object.assign(BLINDS.find((b) => b.name === "트리플쉐이드")!, { src: TRIPLE_PHOTOS[0], photos: TRIPLE_PHOTOS });

// ④-2 가격/견적 안내 — 표시 가격은 예시. TODO: 실제 단가 확인 후 수정
export const PRICE_GUIDE = {
  eyebrow: "PRICE GUIDE",
  title: "견적 기준 안내",
  // 안내문: [0] 첫 줄 / [1]+[2] 둘째 줄 (모바일에서는 [1] 뒤에서 한 번 더 줄바꿈)
  note: ["모든 제품은 원단·사이즈·옵션에 따라 견적이 달라집니다.", "무료 방문 실측 후 확정 견적을 안내드리며", "추가 비용은 없습니다."],
  // 가격은 표기하지 않음(고객 요청) — 대표 상품과 실측 기준만 안내
  rows: [
    { product: "암막커튼", basis: "거실창(가로 약 4m) 기준", tag: "인기" },
    { product: "쉬폰커튼", basis: "거실창(가로 약 4m) 기준" },
    { product: "린넨커튼", basis: "침실창(가로 약 2m) 기준" },
    { product: "로만쉐이드", basis: "창 1개(가로 약 1.5m) 기준" },
    { product: "허니콤블라인드", basis: "창 1개(가로 약 1.5m) 기준" },
    { product: "우드블라인드", basis: "창 1개(가로 약 1.5m) 기준" },
    { product: "콤비블라인드", basis: "창 1개(가로 약 1.5m) 기준", tag: "가성비" },
  ],
  includes: ["무료 방문 실측", "맞춤 제작", "직접 시공 · 설치", "기존 제품 철거"],
};

// ⑤ 시공 포트폴리오 — 지역별 · 공간별 구분
export type GalleryItem = { id: string; title: string; region: string; space: string; product: string; src?: string };
export const GALLERY: GalleryItem[] = [
  { id: "g1", title: "서울 강남구 아파트 거실 암막커튼", region: "서울", space: "거실", product: "암막커튼" },
  { id: "g2", title: "남양주 다산 침실 허니콤블라인드", region: "경기", space: "침실", product: "허니콤블라인드" },
  { id: "g3", title: "인천 송도 아파트 쉬폰커튼", region: "인천", space: "거실", product: "쉬폰커튼" },
  { id: "g4", title: "서울 마포구 카페 우드블라인드", region: "서울", space: "상가", product: "우드블라인드" },
  { id: "g5", title: "경기 구리 사무실 롤스크린", region: "경기", space: "사무실", product: "롤스크린" },
  { id: "g6", title: "경기 하남 전원주택 린넨커튼", region: "경기", space: "거실", product: "린넨커튼" },
  { id: "g7", title: "서울 송파구 아이방 허니콤블라인드", region: "서울", space: "아이방", product: "허니콤블라인드" },
  { id: "g8", title: "인천 부평구 병원 방염커튼", region: "인천", space: "병원", product: "병원커튼" },
  { id: "g9", title: "경기 성남 분당 주방 로만쉐이드", region: "경기", space: "주방", product: "로만쉐이드" },
  { id: "g10", title: "서울 서초구 거실 콤비블라인드", region: "서울", space: "거실", product: "콤비블라인드" },
  { id: "g11", title: "강원 춘천 침실 암막커튼", region: "강원", space: "침실", product: "암막커튼" },
  { id: "g12", title: "경기 남양주 거실 쉬폰+암막", region: "경기", space: "거실", product: "쉬폰커튼" },
  { id: "g13", title: "경기 용인 전원주택 트리플쉐이드", region: "경기", space: "거실", product: "트리플쉐이드" },
];

// ⑥ 고객 후기 & 신뢰 요소 — 더미, 실제 후기로 교체 (지역 키워드 포함)
export type Review = { id: string; name: string; area: string; product: string; rating: number; text: string; date: string; src?: string };
const REVIEW_PHOTO = "/images/products/roman-shade/roman-shade-2.webp"; // 임시: 모든 후기에 동일 사진 (실제 사진으로 교체)
export const REVIEWS: Review[] = [
  { id: "r1", name: "김○○", area: "경기 남양주", product: "암막커튼", rating: 5, date: "2026.07", src: REVIEW_PHOTO, text: "실측부터 시공까지 꼼꼼하게 봐주셔서 만족스러워요. 빛이 하나도 안 새고 마감이 정말 깔끔합니다." },
  { id: "r2", name: "이○○", area: "서울 강동구", product: "허니콤블라인드", rating: 5, date: "2026.06", src: REVIEW_PHOTO, text: "무료 방문 실측이라 부담 없이 시작했는데 가격도 투명하고 시공 당일 바로 끝났어요." },
  { id: "r3", name: "박○○", area: "경기 남양주", product: "린넨커튼", rating: 5, date: "2026.06", src: REVIEW_PHOTO, text: "원단 샘플을 직접 보여주시면서 추천해 주셔서 고르기 쉬웠습니다. 전원주택 분위기가 확 살아났어요." },
  { id: "r4", name: "최○○", area: "서울 마포구", product: "우드블라인드", rating: 5, date: "2026.05", src: REVIEW_PHOTO, text: "카페 창 전체를 우드블라인드로 교체했는데 일정 맞춰 정확하게 시공해 주셨습니다. 사후 관리도 확실해요." },
  { id: "r5", name: "정○○", area: "인천 송도", product: "쉬폰커튼 + 암막", rating: 5, date: "2026.05", src: REVIEW_PHOTO, text: "속커튼과 암막을 같이 했는데 조합 추천이 딱이었어요. 견적도 처음 말씀하신 그대로였습니다." },
  { id: "r6", name: "한○○", area: "경기 성남", product: "로만쉐이드", rating: 5, date: "2026.04", src: REVIEW_PHOTO, text: "주방 창에 로만쉐이드 했는데 주름이 정말 예쁘게 떨어져요. 사이즈도 딱 맞아서 빛 샘이 없습니다." },
  { id: "r7", name: "오○○", area: "경기 구리", product: "콤비블라인드", rating: 5, date: "2026.04", src: REVIEW_PHOTO, text: "이사 날짜에 맞춰서 시공해 주셨어요. 채광 조절이 편하고 아이들 방에도 잘 어울립니다." },
  { id: "r8", name: "윤○○", area: "서울 송파구", product: "트리플쉐이드", rating: 5, date: "2026.03", src: REVIEW_PHOTO, text: "거실 전체를 트리플쉐이드로 바꿨는데 분위기가 확 고급스러워졌어요. 설명도 친절하셨습니다." },
  { id: "r9", name: "장○○", area: "경기 하남", product: "린넨커튼 + 쉬폰", rating: 5, date: "2026.03", src: REVIEW_PHOTO, text: "전원주택 큰 창이라 걱정했는데 원단 추천부터 시공까지 완벽했어요. 주변에도 소개했습니다." },
  { id: "r10", name: "서○○", area: "강원 춘천", product: "전동커튼", rating: 5, date: "2026.02", src: REVIEW_PHOTO, text: "높은 창이라 전동으로 했는데 리모컨 세팅까지 다 해주시고 A/S 안내도 확실해서 안심됩니다." },
];
// 신뢰 통계 — animate 인 항목만 카운트업, 나머지는 정적 표시 (format: 천 단위 콤마)
export type TrustStat = { end: number; suffix: string; label: string; format?: boolean; animate?: boolean; highlight?: boolean };
export const TRUST: TrustStat[] = [
  { end: SITE.careerYears, suffix: "년+", label: "제작·시공 경력", highlight: true }, // 강조 표시
  { end: SITE.totalProjects, suffix: "+", label: "누적 시공", format: true, animate: true },
  { end: 100, suffix: "%", label: "맞춤 제작" },
  { end: 0, suffix: "원", label: "방문 실측 비용" },
];

// ⑦ 진행 절차 + FAQ
export const PROCESS = [
  { step: "01", title: "상담 신청", desc: "전화·카카오톡·신청폼으로\n편하게 문의" },
  { step: "02", title: "무료 방문 실측", desc: "확인 전화 후 방문해\n실측 및 원단 상담" },
  { step: "03", title: "견적 확정", desc: "투명한 견적서 안내,\n추가 비용 없음" },
  { step: "04", title: "맞춤 제작", desc: "실측 사이즈에 맞춰\n장인이 직접 제작" },
  { step: "05", title: "시공 & A/S", desc: "직접 시공 후\n사후 관리까지 책임" },
];
export type FaqItem = { q: string; a: string; list?: { label: string; items: string }[] };
export const FAQ: FaqItem[] = [
  { q: "방문 실측은 정말 무료인가요?", a: "네. 서비스 지역 내 방문 실측과 견적 상담은 무료이며, 견적 후 계약하지 않으셔도 비용이 발생하지 않습니다." },
  {
    q: "어느 지역까지 방문 가능한가요?",
    a: "서울 25개 자치구, 경기도 31개 시·군, 인천 전 지역, 강원 일부(춘천·화천)까지 방문 실측·시공이 가능합니다.",
    // 라벨 열 고정 → 줄바꿈되어도 지역명이 첫 지역명 아래에서 시작 (행잉 인덴트)
    list: [
      { label: "서울", items: "강남구 · 강동구 · 강북구 · 강서구 · 관악구 · 광진구 · 구로구 · 금천구 · 노원구 · 도봉구 · 동대문구 · 동작구 · 마포구 · 서대문구 · 서초구 · 성동구 · 성북구 · 송파구 · 양천구 · 영등포구 · 용산구 · 은평구 · 종로구 · 중구 · 중랑구" },
      { label: "경기", items: "수원시 · 성남시 · 고양시 · 용인시 · 부천시 · 안산시 · 안양시 · 남양주시 · 화성시 · 평택시 · 의정부시 · 시흥시 · 파주시 · 광명시 · 김포시 · 광주시 · 군포시 · 하남시 · 오산시 · 이천시 · 안성시 · 의왕시 · 양주시 · 포천시 · 여주시 · 동두천시 · 과천시 · 구리시 · 양평군 · 가평군 · 연천군" },
      { label: "인천", items: "중구 · 동구 · 미추홀구 · 연수구 · 남동구 · 부평구 · 계양구 · 서구 · 강화군 · 옹진군" },
      { label: "강원", items: "춘천시 · 화천시" },
    ],
  },
  { q: "제작·시공까지 얼마나 걸리나요?", a: "실측 후 보통 3~7일 내 제작이 완료되며, 시공은 당일 마무리됩니다. 원단·수량에 따라 달라질 수 있습니다." },
  { q: "암막커튼과 쉬폰커튼, 무엇을 골라야 하나요?", a: "안방은 암막을, 거실은 쉬폰 또는 린넨에 생활암막 또는 비암막 겉지를 조합해 많이 선택하십니다. 방문 실측 시 원단 샘플을 보여드리며 공간에 맞게 추천드립니다." },
  { q: "기존 커튼/블라인드 철거도 해주시나요?", a: "※ 기존 커튼·블라인드 철거는 가능하나, 철거 제품의 폐기·처분은 불가합니다." },
  { q: "A/S는 어떻게 받나요?", a: "시공 후 문제가 생기면 대표번호 또는 카카오톡으로 연락 주시면 신속히 방문해 드립니다." },
];

// ⑧ 신청 폼 — 필수: 성함/연락처/설치지역, 선택: 원하는 상품/문의내용
export const REGION_OPTIONS = ["서울", "경기", "인천", "강원(춘천·화천)", "기타 지역"];
// 설치 장소 (드롭다운, 선택)
export const PLACE_OPTIONS = ["아파트/주거", "회사/사무실", "상업공간(식당/카페)", "기타"];
// 설치 제품 (드롭다운, 선택) — 폼은 크게 커튼/블라인드만 고름 (세부 제품은 상담 시)
export const PRODUCT_TYPE_OPTIONS = ["커튼", "블라인드", "상담 후 결정"];
// 상품 키워드 매칭용 목록 (폼 표시 X)
export const PRODUCT_OPTIONS = [
  "암막커튼", "쉬폰커튼", "린넨커튼", "로만쉐이드", "트리플쉐이드", "허니콤블라인드", "우드블라인드", "콤비블라인드", "롤스크린", "전동커튼/블라인드", "상담 후 결정",
];
export const FORM_SUCCESS = "성공적으로 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.";
