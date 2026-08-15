"use client";
// 제품(커튼/블라인드) 가로 카드 캐러셀. 스크롤 스냅 + 화살표 + 마우스 드래그, 하단 진행바.
// 카드 폭: 모바일 1.2장 / 태블릿 2.5장 / 데스크톱 4장이 보이도록 basis 로 지정.
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductCard } from "../_lib/data";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

type Props = {
  id: string; // 앵커 id (예: "curtain")
  eyebrow: string; // 영문 소제목 (예: "CURTAIN")
  title: string;
  subtitle: string;
  items: ProductCard[];
  dark?: boolean; // 어두운 배경 변형
};

export default function ProductCarousel({ id, eyebrow, title, subtitle, items, dark = false }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(0); // 0~1 스크롤 진행률
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null); // 드래그 시작 상태
  const [dragging, setDragging] = useState(false); // 드래그 중엔 스냅 해제

  // 스크롤 위치 → 화살표 활성/비활성 + 진행바 갱신
  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }, []);

  // 최초 및 리사이즈 시 상태 동기화 (카드 폭이 바뀌면 끝 지점도 바뀜)
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

  // 마우스 드래그로 스크롤: 이동 중엔 스냅을 끄고, 놓으면 다시 켬
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // 터치는 네이티브 스크롤에 맡김
    const el = trackRef.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    el.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.left - dx;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current) return;
    el.releasePointerCapture(e.pointerId);
    setDragging(false);
    drag.current = null;
  };
  // 드래그 직후 발생하는 클릭은 무시 (카드 링크 오작동 방지)
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current?.moved) e.preventDefault();
  };

  const arrowBase =
    "flex h-10 w-10 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-25";
  const arrowTone = dark
    ? "border-white/30 text-white hover:bg-white hover:text-black"
    : "border-line text-foreground hover:bg-accent hover:text-white";

  return (
    <section
      id={id}
      className={`scroll-mt-20 py-20 sm:py-28 ${dark ? "bg-neutral-900 text-white" : "bg-background text-foreground"}`}
    >
      {/* 섹션 헤더 + 화살표 (뷰포트 진입 시 페이드업) */}
      <Reveal className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-6 sm:px-10">
        <div>
          <p className={`eyebrow ${dark ? "text-white/60!" : ""}`}>{eyebrow}</p>
          <h2 className="mt-3 text-2xl font-light tracking-tight sm:text-4xl">{title}</h2>
          <p className={`mt-3 text-[11px] tracking-[0.25em] uppercase ${dark ? "text-white/50" : "text-muted"}`}>
            {subtitle}
          </p>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          <button type="button" aria-label="이전" disabled={atStart} onClick={() => scrollByCard(-1)} className={`${arrowBase} ${arrowTone}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="다음" disabled={atEnd} onClick={() => scrollByCard(1)} className={`${arrowBase} ${arrowTone}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </Reveal>

      {/* 카드 트랙: 가로 스크롤 + 스냅, 스크롤바 숨김. 양끝 패딩으로 다음 카드가 살짝 보이게(peek) */}
      <div className="relative mx-auto max-w-7xl">
        <div
          ref={trackRef}
          onScroll={update}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onClickCapture}
          className={`no-scrollbar flex gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 select-none sm:scroll-px-10 sm:gap-6 sm:px-10 cursor-grab active:cursor-grabbing ${
            dragging ? "" : "snap-x snap-mandatory"
          }`}
        >
          {items.map((item, i) => (
            <Reveal
              key={item.id}
              as="article"
              delay={i * 80}
              className="group shrink-0 snap-start basis-[calc((100%_-_1rem)/1.2)] sm:basis-[calc((100%_-_1.5rem*2)/2.5)] lg:basis-[calc((100%_-_1.5rem*3)/4)]"
            >
              <a href={`#${id}`} className="block" draggable={false}>
                {/* 이미지: 호버 시 내부 래퍼만 살짝 확대 (overflow-hidden 으로 넘침 차단) */}
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                    <Placeholder label={item.name} tone={dark ? "dark" : "light"} />
                  </div>
                </div>
                {/* 캡션: 이름 + 소문구, 호버 시 VIEW MORE 가 아래에서 드러남 */}
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-medium sm:text-base">{item.name}</h3>
                    <p className={`mt-1 text-[10px] tracking-[0.25em] uppercase ${dark ? "text-white/50" : "text-muted"}`}>
                      {item.caption}
                    </p>
                  </div>
                  <span className="mt-1 flex items-center gap-1 text-[10px] tracking-[0.2em] opacity-0 translate-y-1 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    VIEW MORE
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
                <span className={`mt-3 block h-px w-0 transition-all duration-500 group-hover:w-full ${dark ? "bg-white" : "bg-foreground"}`} />
              </a>
            </Reveal>
          ))}
        </div>

        {/* 진행바: 스크롤 위치에 따라 얇은 막대가 좌→우 이동 */}
        <div className="mx-6 mt-8 h-px sm:mx-10 relative overflow-hidden">
          <div className={`absolute inset-0 ${dark ? "bg-white/15" : "bg-line"}`} />
          <div
            className={`absolute inset-y-0 w-1/4 transition-transform duration-150 ${dark ? "bg-white" : "bg-foreground"}`}
            style={{ transform: `translateX(${progress * 300}%)` }}
          />
        </div>

        {/* 모바일 전용 화살표 (헤더 우측 화살표는 sm 이상에서만 표시) */}
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          <button type="button" aria-label="이전" disabled={atStart} onClick={() => scrollByCard(-1)} className={`${arrowBase} ${arrowTone}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button type="button" aria-label="다음" disabled={atEnd} onClick={() => scrollByCard(1)} className={`${arrowBase} ${arrowTone}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}
