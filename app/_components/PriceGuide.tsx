// ④-2 가격 · 견적 기준 안내 섹션 — 상품별 기준/가격대 표(md+ 테이블, 모바일 카드) + 견적 포함 항목 + 무료 방문 실측 CTA. "추가 비용 없음" 강조.
import { PRICE_GUIDE } from "../_lib/data";
import Reveal from "./Reveal";

type Row = (typeof PRICE_GUIDE.rows)[number];

// 태그 pill (인기=골드, 가성비=올리브)
function Tag({ tag }: { tag?: string }) {
  if (!tag) return null;
  const tone = tag === "인기" ? "bg-gold text-white" : "bg-olive text-white";
  return <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold leading-none ${tone}`}>{tag}</span>;
}

// 체크 아이콘
function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-gold" aria-hidden>
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PriceGuide() {
  const rows: Row[] = PRICE_GUIDE.rows;
  return (
    <section id="price" className="bg-background pt-20 md:pt-28">
      <div className="mx-auto max-w-7xl px-6 pb-11 md:px-10 md:pb-13">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">{PRICE_GUIDE.eyebrow}</p>
          <h2 className="serif text-2xl font-semibold leading-snug md:text-4xl">{PRICE_GUIDE.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted">{PRICE_GUIDE.note}</p>
        </Reveal>

        {/* md+ 테이블: 상품 / 기준 / 가격대 */}
        <Reveal delay={100} className="mx-auto mt-12 hidden max-w-3xl md:block">
          {/* 가격 리스트: 좌 상품명(+칩) 아래 작은 기준 / 우 가격. 2열이라 시선이 좌→우로 깔끔하게 흐름 */}
          <ul className="overflow-hidden rounded-2xl border border-line bg-surface">
            {rows.map((r) => (
              <li key={r.product} className="flex items-center justify-between gap-6 border-t border-line px-7 py-5 first:border-t-0 transition hover:bg-background/50">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-2 text-base font-semibold text-foreground">
                    {r.product}
                    <Tag tag={r.tag} />
                  </p>
                  <p className="mt-1 text-sm text-muted">{r.basis}</p>
                </div>
                <p className="serif shrink-0 text-xl font-semibold text-accent">{r.price}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 모바일 카드 리스트 */}
        <ul className="mt-10 grid grid-cols-1 gap-3 md:hidden">
          {rows.map((r, i) => (
            <Reveal key={r.product} as="li" delay={i * 60}>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
                <div className="min-w-0">
                  <p className="inline-flex items-center gap-2 font-semibold">
                    {r.product}
                    <Tag tag={r.tag} />
                  </p>
                  <p className="mt-1 text-xs text-muted">{r.basis}</p>
                </div>
                <p className="serif shrink-0 text-base font-semibold text-accent">{r.price}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* 견적에 포함 — 체크 칩 */}
        <Reveal delay={150} className="mt-11 flex flex-col items-center gap-4 text-center md:mt-13 -translate-y-[5px]">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-muted">견적에 포함</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {PRICE_GUIDE.includes.map((item) => (
              <li key={item} className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line bg-surface px-4.5 py-2.5 text-base transition-colors hover:border-accent hover:bg-accent hover:text-white">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

      </div>

      {/* CTA 밴드 — 화면 끝까지 이어지는 밝은 면. 정확한 견적은 무료 방문 실측으로 + 추가 비용 없음 강조 */}
      <div className="border-y border-line bg-surface">
        <Reveal delay={200} className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 py-14 text-center md:px-10 md:py-16">
          <p className="serif text-xl leading-relaxed md:text-3xl">
            정확한 견적은 <span className="font-semibold text-accent">무료 방문 실측</span>으로 확인하세요
          </p>
          <p className="text-base text-muted md:text-lg">
            실측 후 확정 견적을 안내드리며, <strong className="font-semibold text-foreground">추가 비용은 없습니다.</strong>
          </p>
          <a
            href="#estimate"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-9 py-4 text-base font-semibold text-white shadow-md transition hover:bg-brown"
          >
            무료 방문 실측 신청
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
