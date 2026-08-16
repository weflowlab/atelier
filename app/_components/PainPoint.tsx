// ② 문제 제기 & 공감 섹션. 고객이 겪는 고민 4가지를 번호 카드로 나열하고, 마지막에 브랜드 강점 섹션으로 잇는 한 줄 + 화살표.
import { PAIN } from "../_lib/data";
import Reveal from "./Reveal";

export default function PainPoint() {
  return (
    <section id="pain" className="bg-surface pt-20 pb-17 md:pt-28 md:pb-25">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">{PAIN.eyebrow}</p>
          <h2 className="serif text-2xl font-semibold leading-snug md:text-4xl">{PAIN.title}</h2>
        </Reveal>

        {/* 고민 카드 그리드: 1 / 2 / 4열, 순차 등장 */}
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {PAIN.items.map((item, i) => (
            <Reveal key={item.title} as="li" delay={i * 100} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-line bg-background p-7 transition hover:-translate-y-1 hover:shadow-md">
                {/* 번호 원 + 인용부호 */}
                <div className="mb-6 flex items-center justify-between">
                  <span className="serif inline-flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 text-xs tracking-wider text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="text-gold/60" aria-hidden>
                    <path d="M7.5 6C5 6 3 8 3 10.5V18h7v-7H6.5A1.5 1.5 0 0 1 8 9.5V6h-.5zm10 0C15 6 13 8 13 10.5V18h7v-7h-3.5a1.5 1.5 0 0 1 1.5-1.5V6h-.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* 마무리 한 줄 + 다음 섹션(브랜드 강점)으로 이어지는 화살표 */}
        <Reveal delay={400} className="mt-14 flex flex-col items-center gap-8 text-center md:mt-20">
          <p className="serif text-xl font-medium leading-relaxed md:text-3xl">
            그래서 <span className="underline-draw font-semibold text-accent">커튼장인 아뜰리에</span>는<br className="md:hidden" /> 처음부터 끝까지 직접 합니다.
          </p>
          <a
            href="#strength"
            aria-label="브랜드 강점 보기"
            className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-400/70 text-foreground/70 transition hover:border-accent hover:text-accent"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="transition-transform group-hover:translate-y-0.5"
              aria-hidden
            >
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
