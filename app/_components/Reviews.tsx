// ⑥ 고객 후기 섹션 (#reviews) — 후기 카드 2줄 마퀴. 윗줄은 오른쪽으로, 아랫줄은 왼쪽으로 화면 끝까지 무한 흐름, 호버 시 정지.
// 각 줄은 카드 목록을 2번 이어붙이고 CSS 로 -50% 만큼 이동시켜 이음새 없이 반복. (data.ts REVIEWS — 실제 후기로 교체 예정)
import { REVIEWS, type Review } from "../_lib/data";
import Reveal from "./Reveal";

// 골드 별점 (rating 개수만큼 채움, 5개 고정 표시)
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`별점 ${rating}점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i < rating ? "text-gold" : "text-line"}`} fill="currentColor" aria-hidden>
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

// 후기 카드 — 고정 폭, 별점 + 지역 pill / 본문 / 이름·상품·날짜
function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col rounded-2xl border border-line bg-background p-6 md:w-[380px]">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={r.rating} />
        <span className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium tracking-wide text-accent">{r.area}</span>
      </div>
      <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-foreground">{r.text}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
        <p>{r.name} · {r.product}</p>
        <time className="shrink-0">{r.date}</time>
      </div>
    </article>
  );
}

// 한 줄 마퀴 — 방향(left/right)에 따라 애니메이션 클래스, 목록 2회 복제(두 번째는 aria-hidden)
function MarqueeRow({ items, direction, duration }: { items: Review[]; direction: "left" | "right"; duration: number }) {
  return (
    <div className="marquee overflow-hidden">
      <div className={`marquee-track gap-4 md:gap-6 ${direction === "left" ? "marquee-left" : "marquee-right"}`} style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex gap-4 md:gap-6 pr-4 md:pr-6" aria-hidden={copy === 1}>
            {items.map((r) => (
              <ReviewCard key={`${r.id}-${copy}`} r={r} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  // 두 줄로 나눔 (홀/짝) — 줄마다 다른 후기가 흐르도록
  const top = REVIEWS.filter((_, i) => i % 2 === 0);
  const bottom = REVIEWS.filter((_, i) => i % 2 === 1);
  return (
    <section id="reviews" className="scroll-mt-20 overflow-hidden bg-surface py-20 md:py-28">
      {/* 섹션 헤더 */}
      <Reveal className="mx-auto max-w-6xl px-5 text-center">
        <p className="eyebrow">SOCIAL PROOF</p>
        <h2 className="serif mt-3 text-3xl font-medium tracking-tight md:text-4xl">고객 후기</h2>
        <p className="mt-3 text-sm text-muted">실제 시공 고객님들의 이야기</p>
      </Reveal>

      {/* 2줄 마퀴 — 화면 끝까지(풀블리드). 윗줄 → 오른쪽, 아랫줄 → 왼쪽 */}
      <Reveal delay={100} className="mt-12 flex flex-col gap-4 md:gap-6">
        <MarqueeRow items={top} direction="right" duration={55} />
        <MarqueeRow items={bottom} direction="left" duration={62} />
      </Reveal>
    </section>
  );
}
