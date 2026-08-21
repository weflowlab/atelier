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
  "커튼", "암막커튼", "쉬폰커튼", "린넨커튼", "로만쉐이드", "패널커튼", "유니슬렛커튼",
  "블라인드", "트리플쉐이드", "콤비블라인드", "허니콤블라인드", "우드블라인드", "한옥쉐이드", "알루미늄블라인드",
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
    ],
  },
  { label: "시공 포트폴리오", href: "#gallery" },
  { label: "고객 후기", href: "#reviews" },
  { label: "진행 절차 · FAQ", href: "#process" },
];

// ① 히어로 — 첫 화면 핵심 문구: 무료 방문 실측 · 맞춤 제작 + 지역/상품 키워드
export type Slide = { id: number; eyebrow: string; title: string; sub: string; src?: string; layout?: "split" };
export const HERO_SLIDES: Slide[] = [
  // 단일 히어로 — 밝은 배경 + 우측 사진(split) 레이아웃
  { id: 1, eyebrow: "ATELIER CURTAIN & BLIND", title: "더 좋은 원단, 더 섬세한 시공,\n자체 공장 운영", sub: "", src: "/images/hero/hero-living.jpg", layout: "split" },
];
export const HERO_CTA = {
  primary: { label: "무료 방문 실측 신청", href: "#estimate" },
  secondary: { label: "전화 상담", href: "tel:18332523" },
};
// 히어로 CTA 아래 핵심 배지
export const HERO_BADGES = ["무료 방문 실측", "자체 공장 운영"];

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
  // 마무리 문구 + '커튼장인 아뜰리에가 다른 이유' 4가지
  reasons: [
    { no: "01", title: "자체 공장 운영", desc: "중간 유통과정을 줄이고 직접 제작·관리" },
    { no: "02", title: "자체 수제제작", desc: "공간과 창에 맞춰 섬세하게 완성" },
    { no: "03", title: "17년 경력의 장인", desc: "오랜 경험과 노하우를 바탕으로 한 전문 시공" },
    { no: "04", title: "무료 방문 실측", desc: "전문가가 직접 실측하고 공간에 맞는 제품 제안" },
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
    { icon: "sewing", title: "전문가 맞춤 시공", desc: "수년의 경력을 가진\n전문가가 직접 시공" },
    { icon: "tape", title: "100% 맞춤 제작", desc: "공간과 취향을 고려한\n1:1 맞춤 제작", highlight: true },
    { icon: "calendar", title: "무료 방문 실측", desc: "직접 방문해 실측하고\n투명한 견적 안내", highlight: true },
    { icon: "shield", title: "완벽한 마감", desc: "디테일한 마감으로\n오래도록 아름답게" },
    { icon: "handshake", title: "사후 관리", desc: "시공 후에도 책임있는\n관리와 A/S" },
  ] as Strength[],
};

// ④ 주요 제품 — 대표 4카드 + 커튼/블라인드 상세 캐러셀 (상품 키워드 반영)
export type Product = { id: string; en: string; ko: string; href: string; src?: string };
export const PRODUCTS: Product[] = [
  { id: "p1", en: "BLACKOUT CURTAIN", ko: "암막커튼", href: "#curtain", src: "/images/products/blackout/blackout-0.webp" },
  { id: "p2", en: "SHEER CURTAIN", ko: "쉬폰커튼", href: "#curtain", src: "/images/products/sheer/sheer-1.webp" },
  { id: "p3", en: "ROMAN SHADE", ko: "로만쉐이드", href: "#curtain", src: "/images/products/roman-shade/roman-shade-1.webp" },
  { id: "p4", en: "BLIND", ko: "블라인드", href: "#blind", src: "/images/products/triple-shade/triple-shade-1.webp" },
];
export type ProductCard = { id: string; name: string; caption: string; src?: string; photos?: string[] }; // photos: 라이트박스용 시공 사진

// 실제 시공 사진 (public/images/products/<slug>/<slug>-N.webp) — [슬러그, 제품명, 소개, 사진 장수]
const photos = (slug: string, n: number, order?: number[]) =>
  (order ?? Array.from({ length: n }, (_, i) => i + 1)).map((i) => `/images/products/${slug}/${slug}-${i}.webp`);
const build = (rows: [string, string, string, number, number[]?][]): ProductCard[] =>
  rows.map(([slug, name, caption, n, order], i) => {
    const p = photos(slug, n, order);
    return { id: `${slug}-${i}`, name, caption, src: p[0], photos: p };
  });

export const CURTAINS: ProductCard[] = build([
  // 0번이 대표 사진(신규)
  ["blackout", "암막커튼", "빛 차단 · 단열 · 침실/거실", 9, [0, 1, 2, 3, 4, 5, 6, 7, 8]],
  ["daylight", "생활암막 + 쉬폰 속지", "은은한 채광 · 거실 조합", 8],
  ["sheer", "쉬폰커튼", "부드러운 빛 · 거실 속커튼", 8],
  ["linen", "자수 린넨 속지커튼", "내추럴 질감 · 포인트 자수", 2],
  ["roman-shade", "로만쉐이드", "깔끔한 주름 · 주방/서재", 4],
  ["panel", "패널커튼", "모던한 면 분할 · 큰 창", 3],
  // 1번은 시공 전 사진이라 제외하고 15번을 대표로
  ["unislat", "유니슬렛 커튼", "세로 슬랫 · 거실/큰 창", 23, [15, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22, 23]],
]);

export const BLINDS: ProductCard[] = build([
  ["triple-shade", "트리플쉐이드", "부드러운 채광 조절", 15],
  ["combi", "암막 콤비블라인드", "빛 차단 · 채광 조절", 8],
  // 0번이 대표 사진(신규)
  ["honeycomb", "허니콤 블라인드", "단열 · 아이방/침실", 5, [0, 1, 2, 3, 4]],
  ["wood", "우드 블라인드", "원목 감성 · 채광 조절", 1],
  ["hanok", "한옥 쉐이드 블라인드", "우드 감성 · 채광 조절", 12], // 13번 사진 제외
  ["aluminum", "알루미늄 25mm 블라인드", "습기 강함 · 주방/욕실", 16],
]);

// ④-2 견적 기준 안내 (가격 미표기)
export const PRICE_GUIDE = {
  eyebrow: "PRICE GUIDE",
  title: "견적 기준 안내",
  // 안내문: [0] 첫 줄 / [1]+[2] 둘째 줄 (모바일에서는 [1] 뒤에서 한 번 더 줄바꿈)
  note: ["모든 제품은 원단·사이즈·옵션에 따라 견적이 달라집니다.", "무료 방문 실측 후 확정 견적을 안내드리며", "추가 비용은 없습니다."],
  // 가격은 표기하지 않음(고객 요청) — 대표 상품과 실측 기준만 안내
  rows: [
    { product: "암막커튼", basis: "거실창(가로 약 4m) 기준", tag: "인기" },
    { product: "생활암막 + 쉬폰 속지", basis: "거실창(가로 약 4m) 기준" },
    { product: "쉬폰커튼", basis: "거실창(가로 약 4m) 기준" },
    { product: "유니슬렛 커튼", basis: "거실창(가로 약 4m) 기준" },
    { product: "로만쉐이드", basis: "창 1개(가로 약 1.5m) 기준" },
    { product: "트리플쉐이드", basis: "창 1개(가로 약 1.5m) 기준" },
    { product: "암막 콤비블라인드", basis: "창 1개(가로 약 1.5m) 기준", tag: "가성비" },
    { product: "알루미늄 25mm 블라인드", basis: "주방창(가로 약 1.5m) 기준" },
  ],  includes: ["무료 방문 실측", "맞춤 제작", "직접 시공 · 설치", "기존 제품 철거"],
};

// ⑤ 시공 포트폴리오 — 지역별 · 공간별 구분
// 실제 시공 사진 (public/images/gallery/gallery-NN.webp). 순서·지역·공간은 고객님이 전달한 원본 파일명 기준.
// region/space 값이 그대로 필터 탭이 되므로(GalleryGrid) 새 값을 넣으면 탭이 늘어난다.
export type GalleryItem = { id: string; title: string; region: string; space: string; product: string; src?: string };
const galleryPhoto = (n: number) => `/images/gallery/gallery-${String(n).padStart(2, "0")}.webp`;
export const GALLERY: GalleryItem[] = [
  { id: "g1", title: "여주 전원주택 암막커튼 · 쉬폰커튼", region: "경기", space: "침실", product: "암막커튼 + 쉬폰커튼", src: galleryPhoto(1) },
  { id: "g2", title: "서울 평창동 쉬폰커튼", region: "서울", space: "거실", product: "쉬폰커튼", src: galleryPhoto(2) },
  { id: "g3", title: "서울 강동구 로만쉐이드", region: "서울", space: "거실", product: "로만쉐이드", src: galleryPhoto(3) },
  { id: "g4", title: "서울 잠실 뷰티샵 커튼 · 블라인드", region: "서울", space: "상가", product: "커튼 + 블라인드", src: galleryPhoto(4) },
  { id: "g5", title: "서울 은평구 에스테틱 커튼", region: "서울", space: "상가", product: "커튼", src: galleryPhoto(5) },
  { id: "g6", title: "평택 아파트 전동 유니슬렛", region: "경기", space: "거실", product: "유니슬렛 커튼", src: galleryPhoto(6) },
  { id: "g7", title: "남양주 병원 방염커튼", region: "경기", space: "병원", product: "방염커튼", src: galleryPhoto(7) },
  { id: "g8", title: "용인 린넨커튼", region: "경기", space: "거실", product: "린넨커튼", src: galleryPhoto(8) },
  { id: "g9", title: "남양주 별내 카페 알루미늄 블라인드", region: "경기", space: "상가", product: "알루미늄 25mm 블라인드", src: galleryPhoto(9) },
  { id: "g10", title: "파주 식당 썬스크린 블라인드", region: "경기", space: "상가", product: "썬스크린 블라인드", src: galleryPhoto(10) },
  { id: "g11", title: "서울 영등포 고등학교 블라인드", region: "서울", space: "학교", product: "롤스크린 블라인드", src: galleryPhoto(11) },
  { id: "g12", title: "과천 커튼 · 블라인드", region: "경기", space: "거실", product: "커튼 + 블라인드", src: galleryPhoto(12) },
];

// ⑥ 고객 후기 & 신뢰 요소 — 고객님이 전달한 실제 후기 (문구·이름·지역 원문 그대로)
// 사진: r1 은 제품컷(로만쉐이드 3), r2~r6 은 /images/review/ 실제 시공 사진
export type Review = { id: string; name: string; area: string; product: string; rating: number; text: string; src?: string };
export const REVIEWS: Review[] = [
  {
    id: "r1",
    name: "장*민",
    area: "양평 전원주택",
    product: "린넨 로만쉐이드 + 린넨 나비주름",
    rating: 5,
    src: "/images/products/roman-shade/roman-shade-3.webp",
    text: "전원주택이라 거실 창이 커서 고민했는데, 오른쪽창은 린넨 로만쉐이드로하고 왼쪽창은 같은 원단의 나비주름 커튼으로 맞춰주셔서 너무 예뻐요. 집 분위기와도 너무 잘 어울리고 상담부터 시공까지 꼼꼼해서 만족합니다.",
  },
  {
    id: "r2",
    name: "한*정",
    area: "송파 아파트",
    product: "생활암막겉지 + 쉬폰커튼",
    rating: 5,
    src: "/images/review/review-02.webp",
    text: "거실 분위기에 맞춰 생활암막과 쉬폰커튼으로 시공했는데 너무 깔끔하고 예뻐요. 빛도 은은하게 들어오면서 사생활 보호도 돼서 만족스럽습니다.",
  },
  {
    id: "r3",
    name: "정*인",
    area: "강남 아파트",
    product: "패널커튼",
    rating: 5,
    src: "/images/review/review-03.webp",
    text: "거실 창이 넓어서 패널커튼으로 했는데 공간이 훨씬 깔끔하고 넓어 보여요. 원단도 은은해서 채광은 살리면서 분위기까지 예쁘게 잡혀서 남편한테 커튼하길 잘했다고 칭찬받았어요.",
  },
  {
    id: "r4",
    name: "김*정",
    area: "영등포",
    product: "암막 콤비블라인드",
    rating: 5,
    src: "/images/review/review-04.webp",
    text: "거실에 암막 콤비블라인드로 설치했는데 깔끔하고 분위기에도 잘 어울려요. 빛 조절도 편하고 필요할 때는 암막까지 돼서 실용적이라 다른방도 다 바꾸고 싶어요.",
  },
  {
    id: "r5",
    name: "김*경",
    area: "하남시 전원주택",
    product: "암막커튼 + 쉬폰커튼",
    rating: 5,
    src: "/images/review/review-05.webp",
    text: "전원주택 이사하면서 집전체 맡겼는데 생각했던 것보다 훨씬 고급스럽고 집이 아늑해졌어요. 빛도 확실히 줄어들고 커튼 주름도 너무 예쁘게 잡혀서 만족스러워요.",
  },
  {
    id: "r6",
    name: "지*선",
    area: "평택시 아파트",
    product: "유니슬렛",
    rating: 5,
    src: "/images/review/review-06.webp",
    text: "처음엔 커튼이랑 블라인드 중에 고민했는데 유니슬렛으로 하길 정말 잘한 것 같아요. 거실이 훨씬 깔끔하고 고급스러워 보이고, 햇빛도 원하는 만큼 조절할 수 있어서 너무 만족스럽습니다. 상담부터 시공까지 꼼꼼하게 해주셔서 더 마음에 들었어요. 😊",
  },
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
export const PRODUCT_TYPE_OPTIONS = [
  "암막커튼",
  "생활암막 + 쉬폰 속지",
  "쉬폰커튼",
  "자수 린넨 속지커튼",
  "로만쉐이드",
  "패널커튼",
  "유니슬렛 커튼",
  "트리플쉐이드",
  "암막 콤비블라인드",
  "허니콤 블라인드",
  "우드 블라인드",
  "한옥 쉐이드 블라인드",
  "알루미늄 25mm 블라인드",
  "상담 후 결정",
];
// 상품 키워드 매칭용 목록 (폼 표시 X)
export const PRODUCT_OPTIONS = [
  "암막커튼", "쉬폰커튼", "린넨커튼", "로만쉐이드", "패널커튼", "유니슬렛커튼", "트리플쉐이드", "콤비블라인드", "허니콤블라인드", "우드블라인드", "한옥쉐이드", "알루미늄블라인드", "상담 후 결정",
];
export const FORM_SUCCESS = "성공적으로 접수되었습니다. 빠른 시간 내에 연락드리겠습니다.";
