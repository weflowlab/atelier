"use client";
// ⑥ 고객 후기 섹션 (#reviews) — 후기 카드 2줄 마퀴. 윗줄은 오른쪽으로, 아랫줄은 왼쪽으로 화면 끝까지 무한 흐름.
// PC 는 호버 시 정지, 모바일은 터치하면 멈췄다가 5초 뒤 자동 재개.
// 각 줄은 카드 목록을 2번 이어붙이고 CSS 로 -50% 만큼 이동시켜 이음새 없이 반복. (data.ts REVIEWS)
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { REVIEWS, type Review } from "../_lib/data";
import Placeholder from "./Placeholder";
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

// 후기 카드 — 고정 폭, 시공 사진 / 별점 + 지역 pill / 본문 / 이름·상품
// 본문은 실제 후기라 길이가 제각각 → 자르지 않고 전문을 노출 (한 줄 안의 카드들은 flex stretch 로 높이가 맞춰짐)
function ReviewCard({ r }: { r: Review }) {
  return (
    <article className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-2xl border border-line bg-background md:w-[380px]">
      {/* 실제 시공 사진 */}
      <div className="relative aspect-[16/9] w-full">
        {r.src ? <Image src={r.src} alt={`${r.area} ${r.product} 시공 사진`} fill sizes="(min-width: 768px) 380px, 300px" className="object-cover" /> : <Placeholder label={r.product} />}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <Stars rating={r.rating} />
          <span className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium tracking-wide text-accent">{r.area}</span>
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground">{r.text}</p>
        <p className="mt-5 border-t border-line pt-4 text-xs text-muted">{r.name} · {r.product}</p>
      </div>
    </article>
  );
}

// 한 줄 마퀴 — 방향(left/right) · 속도(duration) · 시작 지점(offset 0~1)을 줄마다 다르게 줘서
// 같은 후기가 위아래로 나란히 놓이지 않게 한다. 목록은 2회 복제(두 번째는 aria-hidden).
function MarqueeRow({ items, direction, duration, offset = 0, indent = 0 }: { items: Review[]; direction: "left" | "right"; duration: number; offset?: number; indent?: number }) {
  const [paused, setPaused] = useState(false); // 터치로 일시정지 (5초 뒤 자동 재개)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseAwhile = () => {
    setPaused(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPaused(false), 5000);
  };
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <div className="marquee overflow-hidden" data-paused={paused} onTouchStart={pauseAwhile}>
      <div
        className={`marquee-track gap-4 md:gap-6 ${direction === "left" ? "marquee-left" : "marquee-right"}`}
        style={{
          "--marquee-duration": `${duration}s`,
          animationDelay: `-${(duration * offset).toFixed(1)}s`, // 시작 지점 이동
          paddingLeft: indent ? `${indent}px` : undefined,        // 카드 경계도 어긋나게
        } as React.CSSProperties}
      >
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
  // 두 줄 모두 후기 전체를 싣고, 아랫줄만 순서를 절반 밀어 같은 카드가 나란히 보이지 않게 한다.
  // (줄마다 절반씩 나눠 담으면 후기 수가 적을 때 트랙이 화면보다 좁아져 마퀴에 빈 구간이 생김)
  const half = Math.ceil(REVIEWS.length / 2);
  const top = REVIEWS;
  const bottom = [...REVIEWS.slice(half), ...REVIEWS.slice(0, half)];
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
        <MarqueeRow items={bottom} direction="left" duration={62} offset={0.5} indent={140} />
      </Reveal>
    </section>
  );
}
