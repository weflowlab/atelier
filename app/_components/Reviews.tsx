"use client";
// 고객 후기 & 신뢰 요소 섹션 (#reviews) — 상단 TRUST 통계 스트립 + 후기 카드 가로 캐러셀 + 확인 가능한 신뢰 정보.
// * 후기는 실제 고객 후기로 교체 예정 (data.ts REVIEWS)
import { useCallback, useEffect, useRef, useState } from "react";
import { REVIEWS, SITE, TRUST } from "../_lib/data";
import Reveal from "./Reveal";

// 확인 가능한 신뢰 정보 3종 — 사업자등록번호 / 대표·경력 / 서비스 지역 (아이콘은 인라인 SVG)
const TRUST_INFO = [
  {
    label: "사업자등록번호",
    value: SITE.bizNo,
    icon: <path d="M4 5h16v14H4zM8 9h8M8 12h8M8 15h5" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: "대표 · 시공 경력",
    value: `대표 ${SITE.owner} · 시공 경력 ${SITE.careerYears}년+`,
    icon: <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3zM9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: "서비스 지역",
    value: SITE.serviceAreaLabel,
    icon: <path d="M12 21s-6-5.5-6-11a6 6 0 0112 0c0 5.5-6 11-6 11zM12 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

// 골드 별점 (rating 개수만큼 채움, 5개 고정 표시)
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`별점 ${rating}점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? "text-gold" : "text-line"}`}
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L10 14.9l-5.2 2.8 1-5.9L1.5 7.7l5.9-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0); // 0~1 스크롤 진행률

  // 스크롤 위치 → 화살표 활성/비활성 + 진행바 갱신
  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  // 최초 및 리사이즈 시 상태 동기화
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  // 화살표: 카드 1장 폭(+gap)만큼 부드럽게 스크롤
  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    el.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" });
  };

  const arrowCls =
    "flex h-10 w-10 items-center justify-center rounded-full border border-line text-foreground transition hover:bg-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-25";

  return (
    <section id="reviews" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* 섹션 헤더 */}
        <Reveal className="text-center">
          <p className="eyebrow">REVIEWS</p>
          <h2 className="serif mt-3 text-3xl font-medium tracking-tight md:text-4xl">고객 후기</h2>
          <p className="mt-3 text-sm text-muted">실제 시공 고객님들의 이야기</p>
        </Reveal>

        {/* TRUST 통계 스트립 — 4개 타일, 세로 구분선 */}
        <Reveal delay={100} className="mt-12">
          <ul className="grid grid-cols-2 divide-line rounded-2xl border border-line bg-background md:grid-cols-4 md:divide-x">
            {TRUST.map((t, i) => (
              <li
                key={t.label}
                className={`flex flex-col items-center px-4 py-7 text-center ${
                  i < 2 ? "border-b border-line md:border-b-0" : ""
                } ${i % 2 === 1 ? "border-l border-line md:border-l-0" : ""}`}
              >
                <span className="serif text-3xl font-medium tracking-tight text-accent md:text-4xl">{t.value}</span>
                <span className="mt-2 text-xs tracking-wider text-muted">{t.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* 캐러셀 헤더 — 우측 화살표 (sm 이상) */}
        <Reveal delay={150} className="mt-16 flex items-end justify-between">
          <p className="text-[11px] tracking-[0.25em] text-muted uppercase">Customer Stories</p>
          <div className="hidden gap-2 sm:flex">
            <button type="button" aria-label="이전" disabled={atStart} onClick={() => scrollByCard(-1)} className={arrowCls}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" aria-label="다음" disabled={atEnd} onClick={() => scrollByCard(1)} className={arrowCls}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </Reveal>

        {/* 후기 카드 트랙: 가로 스크롤 + 스냅, 스크롤바 숨김 */}
        <div
          ref={trackRef}
          onScroll={update}
          className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 md:gap-6"
        >
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.id}
              as="article"
              delay={i * 80}
              className="flex shrink-0 snap-start basis-[85%] flex-col rounded-2xl border border-line bg-background p-6 md:basis-[calc((100%_-_1.5rem)/2.2)] lg:basis-[calc((100%_-_1.5rem*2)/3)]"
            >
              {/* 상단: 별점 + 시공 지역 pill (지역 키워드 강조) */}
              <div className="flex items-center justify-between gap-3">
                <Stars rating={r.rating} />
                <span className="shrink-0 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium tracking-wide text-accent">
                  {r.area}
                </span>
              </div>
              <p className="mt-4 line-clamp-4 flex-1 text-sm leading-relaxed text-foreground">{r.text}</p>
              {/* 하단: 고객명 · 상품 + 시공 시기 */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4 text-xs text-muted">
                <p>
                  {r.name} · {r.product}
                </p>
                <time className="shrink-0 text-xs text-muted">{r.date}</time>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 진행바: 스크롤 위치에 따라 얇은 막대가 좌→우 이동 */}
        <div className="relative mt-8 h-px overflow-hidden">
          <div className="absolute inset-0 bg-line" />
          <div
            className="absolute inset-y-0 w-1/4 bg-accent transition-transform duration-150"
            style={{ transform: `translateX(${progress * 300}%)` }}
          />
        </div>

        {/* 모바일 전용 화살표 */}
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          <button type="button" aria-label="이전" disabled={atStart} onClick={() => scrollByCard(-1)} className={arrowCls}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="다음" disabled={atEnd} onClick={() => scrollByCard(1)} className={arrowCls}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        {/* 확인 가능한 신뢰 정보 — 사업자등록번호 / 대표·시공 경력 / 서비스 지역 3열 */}
        <Reveal delay={100} className="mt-14">
          <p className="text-center text-[11px] tracking-[0.25em] text-muted">확인 가능한 신뢰 정보</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {TRUST_INFO.map((t) => (
              <li
                key={t.label}
                className="flex items-center gap-3 rounded-xl border border-line bg-background px-4 py-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-accent">
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                    {t.icon}
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] tracking-wider text-muted">{t.label}</span>
                  <span className="mt-0.5 block text-sm leading-snug font-medium text-foreground">{t.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
