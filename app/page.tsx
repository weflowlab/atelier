// 랜딩페이지 조립 파일.
// 참고 사이트(커튼/블라인드) 섹션 순서를 그대로 따름:
// 헤더 → 히어로 슬라이더 → CURTAIN 캐러셀 → BLIND 캐러셀 → 무료 견적 폼 → 회사소개 → 시공사진 → 푸터
import Header from "./_components/Header";
import HeroSlider from "./_components/HeroSlider";
import ProductCarousel from "./_components/ProductCarousel";
import EstimateForm from "./_components/EstimateForm";
import AboutSection from "./_components/AboutSection";
import GalleryGrid from "./_components/GalleryGrid";
import Footer from "./_components/Footer";
import ScrollTopButton from "./_components/ScrollTopButton";
import { CURTAINS, BLINDS } from "./_lib/data";

export default function Home() {
  return (
    <>
      {/* 고정 헤더: 히어로 위에서는 투명, 스크롤 시 흰 배경으로 전환 */}
      <Header />

      <main className="flex-1">
        {/* 1. 풀스크린 히어로 슬라이더 (자동재생 / 화살표 / 도트 / 스와이프) */}
        <HeroSlider />

        {/* 2. CURTAIN — 제품 카드 가로 캐러셀 */}
        <ProductCarousel
          id="curtain"
          eyebrow="CURTAIN"
          title="커튼"
          subtitle="INTRODUCING CURTAINS OF VARIOUS MATERIALS"
          items={CURTAINS}
        />

        {/* 3. BLIND — 동일 컴포넌트 재사용, 어두운 톤으로 리듬 부여 */}
        <ProductCarousel
          id="blind"
          eyebrow="BLIND"
          title="블라인드"
          subtitle="INTRODUCING BLINDS OF VARIOUS MATERIALS"
          items={BLINDS}
          dark
        />

        {/* 4. 무료 방문 견적 신청 폼 (개인정보 아코디언 + 확인 모달) */}
        <EstimateForm />

        {/* 5. 회사소개 (이미지 + 카피 + CTA 2개) */}
        <AboutSection />

        {/* 6. 시공사진 호버 그리드 + 커뮤니티 스트립 */}
        <GalleryGrid />
      </main>

      {/* CS CENTER / 사업자 정보 / 카피라이트 */}
      <Footer />

      {/* 스크롤 400px 이후 노출되는 TOP 버튼 */}
      <ScrollTopButton />
    </>
  );
}
