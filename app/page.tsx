// 랜딩페이지 조립 파일 — 8섹션 + 가격 안내 (파워링크 유입 최적화).
// 헤더 → 메인 → 브랜드강점(+신뢰통계) → 고객후기 → 문제제기 → 주요제품(+가격) → 시공포트폴리오 → 진행절차/FAQ → 신청폼 → 푸터
import IntroSplash from "./_components/IntroSplash";
import Header from "./_components/Header";
import HeroSlider from "./_components/HeroSlider";
import PainPoint from "./_components/PainPoint";
import Strengths from "./_components/Strengths";
import ProductGrid from "./_components/ProductGrid";
import ProductCarousel from "./_components/ProductCarousel";
import PriceGuide from "./_components/PriceGuide";
import GalleryGrid from "./_components/GalleryGrid";
import Reviews from "./_components/Reviews";
import ProcessFaq from "./_components/ProcessFaq";
import EstimateForm from "./_components/EstimateForm";
import Footer from "./_components/Footer";
import QuickMenu from "./_components/QuickMenu";
import MobileBar from "./_components/MobileBar";
import ScrollTopButton from "./_components/ScrollTopButton";
import { CURTAINS, BLINDS } from "./_lib/data";

export default function Home() {
  return (
    <>
      {/* 진입 인트로 — 재봉틀 일러스트 + 문구 타이핑 후 페이드아웃 (세션 1회) */}
      <IntroSplash />

      {/* 고정 헤더: 히어로 위 투명 → 스크롤 시 배경색 전환 */}
      <Header />

      <main id="top" className="flex-1">
        {/* ① 메인 — 핵심 문구(무료 방문 실측·맞춤 제작·직접 시공) + 큰 CTA. ?kw= 유입 키워드로 헤드라인 매칭 */}
        <HeroSlider />

        {/* ③ 브랜드 강점 — 신뢰 통계 + 강점 5개 */}
        <Strengths />

        {/* ⑥ 고객 후기 캐러셀 */}
        <Reviews />

        {/* ② 문제 제기 & 공감 */}
        <PainPoint />

        {/* ④ 주요 제품 — 대표 4카드 + 커튼/블라인드 캐러셀 + 가격·견적 기준 */}
        <ProductGrid />
        <ProductCarousel id="curtain" eyebrow="CURTAIN" title="커튼" subtitle="암막커튼 · 쉬폰커튼 · 린넨커튼 · 로만쉐이드 · 유니슬렛" items={CURTAINS} />
        <ProductCarousel id="blind" eyebrow="BLIND" title="블라인드" subtitle="트리플쉐이드 · 콤비 · 허니콤 · 한옥쉐이드 · 알루미늄" items={BLINDS} dark />
        <PriceGuide />

        {/* ⑤ 시공 포트폴리오 — 지역별·공간별 필터 그리드 */}
        <GalleryGrid />

        {/* ⑦ 진행 절차 + FAQ */}
        <ProcessFaq />

        {/* ⑧ DB 수집 폼 — 이름/연락처/설치지역/원하는 상품 + 유입 키워드 히든 전송 */}
        <EstimateForm />
      </main>

      {/* CS CENTER / 사업자 정보 / 저작권 */}
      <Footer />

      {/* PC: 우하단 고정 퀵메뉴(실측/전화/카카오톡) · 모바일: 하단 2분할 바(바로전화/무료상담신청) + TOP */}
      <QuickMenu />
      <MobileBar />
      <ScrollTopButton />
    </>
  );
}
