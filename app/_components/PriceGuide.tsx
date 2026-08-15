// ④-2 가격 · 견적 기준 안내 섹션 — 상품별 기준/가격대 표(md+ 테이블, 모바일 카드) + 견적 포함 항목 + 무료 방문실측 CTA. "추가 비용 없음" 강조.
import { PRICE_GUIDE } from "../_lib/data";
import Reveal from "./Reveal";

type Row = (typeof PRICE_GUIDE.rows)[number];

// 태그 pill (인기=골드, 가성비=올리브)
function Tag({ tag }: { tag?: string }) {
  if (!tag) return null;
  const tone = tag === "인기" ? "bg-gold text-white" : "bg-olive text-white";
  return <span className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium leading-none align-middle ${tone}`}>{tag}</span>;
}

// 체크 아이콘
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold" aria-hidden>
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PriceGuide() {
  const rows: Row[] = PRICE_GUIDE.rows;
  return (
    <section id="price" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">{PRICE_GUIDE.eyebrow}</p>
          <h2 className="serif text-2xl font-semibold leading-snug md:text-4xl">{PRICE_GUIDE.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted">{PRICE_GUIDE.note}</p>
        </Reveal>

        {/* md+ 테이블: 상품 / 기준 / 가격대 */}
        <Reveal delay={100} className="mt-12 hidden md:block">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-background/70 text-[11px] uppercase tracking-[0.2em] text-muted">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">상품</th>
                  <th scope="col" className="px-6 py-4 font-medium">기준</th>
                  <th scope="col" className="px-6 py-4 text-right font-medium">가격대</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.product} className="border-t border-line transition hover:bg-background/50">
                    <th scope="row" className="px-6 py-4 font-semibold text-foreground">
                      {r.product}
                      <Tag tag={r.tag} />
                    </th>
                    <td className="px-6 py-4 text-muted">{r.basis}</td>
                    <td className="serif px-6 py-4 text-right text-base font-semibold text-accent">{r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        {/* 모바일 카드 리스트 */}
        <ul className="mt-10 grid grid-cols-1 gap-3 md:hidden">
          {rows.map((r, i) => (
            <Reveal key={r.product} as="li" delay={i * 60}>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold">
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
        <Reveal delay={150} className="mt-10 flex flex-col items-center gap-4 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-muted">견적에 포함</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {PRICE_GUIDE.includes.map((item) => (
              <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm">
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* CTA — 정확한 견적은 무료 방문실측으로 + 추가 비용 없음 강조 */}
        <Reveal delay={200} className="mt-12 flex flex-col items-center gap-5 rounded-2xl border border-line bg-surface px-6 py-10 text-center md:mt-16">
          <p className="serif text-lg leading-relaxed md:text-2xl">
            정확한 견적은 <span className="font-semibold text-accent">무료 방문실측</span>으로 확인하세요
          </p>
          <p className="text-sm text-muted">
            실측 후 확정 견적을 안내드리며, <strong className="font-semibold text-foreground">추가 비용은 없습니다.</strong>
          </p>
          <a
            href="#estimate"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-medium text-white shadow-md transition hover:bg-brown"
          >
            무료 방문실측 신청
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
