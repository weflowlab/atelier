// ④ 주요 제품 섹션. 대표 4카드(쉬어/암막/블라인드/호텔&프로젝트) — 클릭 시 상세 캐러셀/갤러리 앵커로 이동.
import { PRODUCTS } from "../_lib/data";
import Image from "next/image";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

export default function ProductGrid() {
  return (
    <section id="products" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">FEATURES</p>
          <h2 className="serif text-2xl font-semibold leading-snug md:text-4xl">주요 제품 안내</h2>
          <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-gold" />
        </Reveal>

        {/* 제품 카드 그리드: 1 / 2 / 4열, 순차 등장 */}
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {PRODUCTS.map((item, i) => (
            <Reveal key={item.id} as="li" delay={i * 100}>
              <a
                href={item.href}
                className="group block overflow-hidden rounded-2xl border border-line bg-background transition hover:shadow-md"
              >
                {/* 이미지: 호버 시 내부만 확대 (바깥 overflow-hidden 으로 잘림) */}
                <div className="aspect-square overflow-hidden">
                  <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                    {item.src ? (
                      <Image src={item.src} alt={item.ko} fill sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <Placeholder label={item.en} className="border-0" />
                    )}
                  </div>
                </div>
                {/* 캡션 */}
                <div className="flex flex-col items-center px-5 py-4 text-center">
                  <p className="text-xs tracking-widest text-muted">{item.en}</p>
                  <p className="mt-1 text-base font-medium">{item.ko}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
