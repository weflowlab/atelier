"use client";
// 제품(커튼/블라인드) 가로 카드 캐러셀. 스크롤 스냅 + 양옆 화살표 + 마우스 드래그 + 무한 루프(세트 3회 렌더 후 경계에서 순간이동) + 3.5초 자동재생, 하단 도트.
// 카드 폭: 모바일 1.2장 / 태블릿 2장 / 데스크톱 3장이 보이도록 basis 로 지정.
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProductCard } from "../_lib/data";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import ProductLightbox from "./ProductLightbox";

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
  const [current, setCurrent] = useState(0); // 현재 카드 인덱스 (도트 표시용, 0..n-1)
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null); // 드래그 시작 상태
  const [dragging, setDragging] = useState(false); // 드래그 중엔 스냅 해제
  const [selected, setSelected] = useState<ProductCard | null>(null); // 라이트박스에 띄울 제품
  const n = items.length;

  // ── 무한 루프: 카드 세트를 3번(앞 복제 · 본 세트 · 뒤 복제) 렌더하고,
  //    스크롤이 본 세트 범위를 벗어나면 세트 폭만큼 순간이동해 항상 가운데 세트에 머물게 함.
  const loop = n > 1;
  const rendered = loop ? [...items, ...items, ...items] : items;

  // 카드 1장 이동 폭 (카드 폭 + gap)
  const step = () => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return 0;
    const gap = parseFloat(getComputedStyle(el).columnGap || "0") || 0;
    return card.offsetWidth + gap;
  };

  // 한 세트의 정확한 폭 (첫 카드 → n번째 카드의 실제 offset 차이; 소수점 오차 없음)
  const setWidth = useCallback(() => {
    const el = trackRef.current;
    if (!el || el.children.length < n + 1) return 0;
    const a = el.children[0] as HTMLElement;
    const b = el.children[n] as HTMLElement;
    return b.offsetLeft - a.offsetLeft;
  }, [n]);

  // 최초/리사이즈: 본 세트(가운데) 시작점으로 즉시 이동
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !loop) return;
    const goMiddle = () => {
      const setW = setWidth();
      el.style.scrollBehavior = "auto";
      el.scrollLeft = setW;
      el.style.scrollBehavior = "";
    };
    goMiddle();
    window.addEventListener("resize", goMiddle);
    return () => window.removeEventListener("resize", goMiddle);
  }, [loop, n, setWidth]);

  // 스크롤 위치 → 현재 인덱스 갱신 + 루프 경계 순간이동 (스크롤이 잠깐 멈췄을 때만 점프해 튐 최소화)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const st = step();
    if (!st) return;
    setCurrent(((Math.round(el.scrollLeft / st) % n) + n) % n);
    if (!loop) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      const setW = setWidth();
      if (!setW) return;
      if (el.scrollLeft < setW * 0.5 || el.scrollLeft > setW * 1.5) {
        el.style.scrollBehavior = "auto";
        el.scrollLeft = el.scrollLeft < setW * 0.5 ? el.scrollLeft + setW : el.scrollLeft - setW;
        el.style.scrollBehavior = "";
      }
    }, 120);
  }, [loop, n, setWidth]);

  // 화살표: 카드 1장 폭만큼 부드럽게 스크롤 (루프라 끝이 없음)
  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * step(), behavior: "smooth" });
  };

  // 뷰포트 진입 감지 — 화면에 보이는 캐러셀만 자동재생 (안 보이는 섹션은 첫 카드에서 대기)
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 자동재생: AUTOPLAY_MS 마다 오른쪽으로 1장. 화면 밖/호버/드래그/라이트박스 열림/탭 비활성/모션 최소화 시 정지
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const AUTOPLAY_MS = 3500;
    if (!loop || !inView || hovering || dragging || selected) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      scrollByCard(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loop, inView, hovering, dragging, selected]);

  // 도트 클릭: 현재 위치에서 가장 가까운 해당 인덱스로 이동
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const st = step();
    const cur = Math.round(el.scrollLeft / st);
    const base = cur - (((cur % n) + n) % n); // 현재 세트의 시작 카드 인덱스
    el.scrollTo({ left: (base + i) * st, behavior: "smooth" });
  };

  // 마우스 드래그로 스크롤: 이동 중엔 스냅을 끄고, 놓으면 다시 켬.
  // setPointerCapture 를 쓰면 click 이 트랙에서 발생해 카드 클릭이 먹지 않으므로 사용하지 않음.
  const lastMoved = useRef(false); // 직전 드래그가 실제로 이동했는지 (클릭 차단 판별용)
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return; // 터치는 네이티브 스크롤에 맡김
    const el = trackRef.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    lastMoved.current = false;
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) {
      drag.current.moved = true;
      lastMoved.current = true;
    }
    el.scrollLeft = drag.current.left - dx;
  };
  const onPointerUp = () => {
    if (!drag.current) return;
    setDragging(false);
    drag.current = null;
  };
  // 드래그 직후 발생하는 클릭은 무시 (카드가 열리는 오작동 방지). 단순 클릭이면 그대로 통과
  const onClickCapture = (e: React.MouseEvent) => {
    if (lastMoved.current) {
      e.preventDefault();
      e.stopPropagation();
      lastMoved.current = false;
    }
  };

  const arrowBase =
    "absolute top-[38%] z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur transition";
  const arrowTone = dark
    ? "border-white/30 bg-white/15 text-white hover:bg-white hover:text-accent"
    : "border-line bg-surface/90 text-foreground hover:bg-accent hover:text-white";

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`scroll-mt-20 py-20 sm:py-28 ${dark ? "bg-accent text-white" : "bg-background text-foreground"}`}
    >
      {/* 섹션 헤더 (뷰포트 진입 시 페이드업) */}
      <Reveal className="mx-auto mb-10 flex max-w-7xl items-end justify-between gap-6 px-6 sm:px-10">
        <div>
          <p className={`eyebrow ${dark ? "text-white/60!" : ""}`}>{eyebrow}</p>
          <h2 className="serif mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className={`mt-3 text-sm tracking-[0.12em] sm:text-base ${dark ? "text-white/60" : "text-muted"}`}>
            {subtitle}
          </p>
          {/* 클릭 안내 — 확대 아이콘 + 한 줄 */}
          <p className={`mt-3 inline-flex items-center gap-1.5 text-xs ${dark ? "text-white/50" : "text-muted"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
            </svg>
            사진을 클릭해 제품별 시공 사진을 더 확인해 보세요
          </p>
        </div>
      </Reveal>

      {/* 카드 트랙: 가로 스크롤 + 스냅, 스크롤바 숨김. 양끝 패딩으로 다음 카드가 살짝 보이게(peek) */}
      <div className="relative mx-auto max-w-7xl" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
        {/* 양옆 화살표 — 카드 1장씩 이동 */}
        <button type="button" aria-label="이전" onClick={() => scrollByCard(-1)} className={`${arrowBase} ${arrowTone} left-2 sm:left-4`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <button type="button" aria-label="다음" onClick={() => scrollByCard(1)} className={`${arrowBase} ${arrowTone} right-2 sm:right-4`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
        <div
          ref={trackRef}
          onScroll={update}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          onClickCapture={onClickCapture}
          className={`no-scrollbar flex gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 select-none sm:scroll-px-10 sm:gap-6 sm:px-10 cursor-grab active:cursor-grabbing ${
            dragging ? "" : "snap-x snap-mandatory"
          }`}
        >
          {rendered.map((item, i) => {
            const set = Math.floor(i / n); // 0 앞복제 · 1 본세트 · 2 뒤복제
            const cardCls = "group shrink-0 snap-start basis-[calc((100%_-_1rem)/1.2)] sm:basis-[calc((100%_-_1.5rem)/2)] lg:basis-[calc((100%_-_1.5rem*2)/3)]";
            const key = `${item.id}-${set}`;
            // 카드 본문
            // 카드 클릭 → 라이트박스 (드래그 후 클릭은 onClickCapture 에서 차단)
            const card = (
              <button type="button" onClick={() => setSelected(item)} className="block w-full text-left" aria-label={`${item.name} 사진 보기`}>
                {/* 이미지: 호버 시 내부 래퍼만 살짝 확대 (overflow-hidden 으로 넘침 차단) */}
                <div className="aspect-[3/4] overflow-hidden">
                  <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                    {item.src ? (
                      <Image src={item.src} alt={item.name} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 80vw" className="object-cover" draggable={false} />
                    ) : (
                      <Placeholder label={item.name} tone={dark ? "dark" : "light"} />
                    )}
                  </div>
                </div>
                {/* 캡션: 이름 + 소문구, 호버 시 VIEW MORE 가 드러남 */}
                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">{item.name}</h3>
                    <p className={`mt-1.5 text-sm tracking-wide ${dark ? "text-white/60" : "text-muted"}`}>
                      {item.caption}
                    </p>
                  </div>
                  <span className="mt-1 flex items-center gap-1 text-[10px] tracking-[0.2em] opacity-0 translate-y-1 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    VIEW MORE
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </div>
              </button>
            );
            // 카드는 페이드업 없이 즉시 표시 (자동재생/루프 순간이동과 충돌해 뒤늦게 올라오던 현상 방지)
            return (
              <article key={key} className={cardCls}>{card}</article>
            );
          })}
        </div>

        {/* 도트 인디케이터: 현재 카드 표시, 클릭 시 이동 (루프라 진행바 대신 사용) */}
        <div className="mt-8 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${item.name} 보기`}
              aria-current={i === current}
              onClick={() => goTo(i)}
              className="group flex items-center px-0.5 py-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? `w-6 ${dark ? "bg-white" : "bg-accent"}`
                    : `w-1.5 ${dark ? "bg-white/30 group-hover:bg-white/60" : "bg-line group-hover:bg-muted"}`
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* 라이트박스 모달 */}
      <ProductLightbox key={selected?.id ?? "closed"} item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
