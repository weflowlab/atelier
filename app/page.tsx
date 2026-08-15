// 랜딩페이지 조립 파일 — 8섹션 + 가격 안내 + 지역별 안내 (파워링크 유입 최적화).
// 헤더 → ①메인 → ②문제제기 → ③브랜드강점 → ④주요제품(+가격) → ⑤시공포트폴리오 → 지역별 → ⑥고객후기 → ⑦절차/FAQ → ⑧신청폼 → 푸터
import Header from "./_components/Header";
import HeroSlider from "./_components/HeroSlider";
import PainPoint from "./_components/PainPoint";
import Strengths from "./_components/Strengths";
import ProductGrid from "./_components/ProductGrid";
import ProductCarousel from "./_components/ProductCarousel";
import PriceGuide from "./_components/PriceGuide";
import GalleryGrid from "./_components/GalleryGrid";
import RegionSection from "./_components/RegionSection";
import Reviews from "./_components/Reviews";
import ProcessFaq from "./_components/ProcessFaq";
import EstimateForm from "./_components/EstimateForm";
import Footer from "./_components/Footer";
import QuickMenu from "./_components/QuickMenu";
import ScrollTopButton from "./_components/ScrollTopButton";
import { CURTAINS, BLINDS } from "./_lib/data";

export default function Home() {
  return (
    <>
      {/* 고정 헤더: 히어로 위 투명 → 스크롤 시 배경색 전환 */}
      <Header />

      <main id="top" className="flex-1">
        {/* ① 메인 — 핵심 문구(무료 방문실측·맞춤 제작·직접 시공) + 큰 CTA. ?kw= 유입 키워드로 헤드라인 매칭 */}
        <HeroSlider />

        {/* ② 문제 제기 & 공감 */}
        <PainPoint />

        {/* ③ 브랜드 강점 — 아이콘 강조 (무료 방문실측 / 100% 맞춤 제작) */}
        <Strengths />

        {/* ④ 주요 제품 — 대표 4카드 + 커튼/블라인드 캐러셀 + 가격·견적 기준 */}
        <ProductGrid />
        <ProductCarousel id="curtain" eyebrow="CURTAIN" title="커튼" subtitle="암막커튼 · 쉬폰커튼 · 린넨커튼 · 로만쉐이드" items={CURTAINS} />
        <ProductCarousel id="blind" eyebrow="BLIND" title="블라인드" subtitle="허니콤 · 우드 · 콤비 · 롤스크린" items={BLINDS} dark />
        <PriceGuide />

        {/* ⑤ 시공 포트폴리오 — 지역별·공간별 필터 그리드 */}
        <GalleryGrid />

        {/* 지역별 콘텐츠 — 남양주/마석/화도읍/다산/별내/구리 (파워링크 지역 키워드) */}
        <RegionSection />

        {/* ⑥ 고객 후기 & 신뢰 요소 (경력·누적 시공·사업자 정보) */}
        <Reviews />

        {/* ⑦ 진행 절차 + FAQ */}
        <ProcessFaq />

        {/* ⑧ DB 수집 폼 — 이름/연락처/설치지역/원하는 상품 + 유입 키워드 히든 전송 */}
        <EstimateForm />
      </main>

      {/* CS CENTER / 사업자 정보 / 저작권 */}
      <Footer />

      {/* 고정 퀵메뉴: 카카오톡 / 전화 / 무료 방문실측 (모바일 하단 3버튼) + TOP */}
      <QuickMenu />
      <ScrollTopButton />
    </>
  );
}
