// 회사소개 섹션 (#about). 좌측 이미지 2장(겹침) / 우측 텍스트 + CTA 2개. 서버 컴포넌트, Reveal 로 순차 등장.
import { SITE } from "../_lib/data";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

export default function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2 md:gap-16">
        {/* 좌측: 큰 이미지 + 우하단에 겹치는 작은 디테일 이미지 */}
        <Reveal className="relative mx-auto w-full max-w-md md:max-w-none">
          <div className="aspect-[4/5] w-[85%]">
            <Placeholder label="ABOUT IMAGE" />
          </div>
          <div className="absolute right-0 bottom-[-8%] aspect-square w-[45%] shadow-xl ring-8 ring-white">
            <Placeholder label="DETAIL" tone="dark" />
          </div>
        </Reveal>

        {/* 우측: 소개 텍스트 + 버튼 */}
        <div className="pt-6 md:pt-0">
          <Reveal delay={100}>
            <p className="eyebrow">ABOUT US</p>
            <h2 className="mt-4 text-2xl leading-snug font-semibold tracking-tight md:text-4xl">
              트렌디하고 젊은 감성의
              <br />
              커튼 &amp; 블라인드 {SITE.nameKo}
            </h2>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-6 text-sm leading-relaxed text-neutral-600 md:text-base">
              다양한 디자인과 합리적인 가격으로 경쟁력을 갖춘 기업입니다.
            </p>
          </Reveal>
          <Reveal delay={340} className="mt-8 flex flex-wrap gap-3">
            {/* 주 CTA: 견적 섹션으로 이동, 호버 시 화살표 우측 슬라이드 */}
            <a
              href="#estimate"
              className="group inline-flex items-center gap-2 bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
            >
              견적문의하러가기
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </a>
            {/* 보조 CTA: 아웃라인 */}
            <a
              href="#about"
              className="inline-flex items-center border border-neutral-900 px-6 py-3 text-sm font-medium transition-colors hover:bg-neutral-900 hover:text-white"
            >
              회사소개
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
