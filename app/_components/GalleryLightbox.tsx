"use client";
// 갤러리 라이트박스 — 그리드에서 타일 클릭 시 열리며, 현재 필터에 해당하는 "전체" 사진을 좌우로 넘겨봄.
// 그리드는 최신 N장만 보여주고 나머지는 이 모달 안에서 스와이프 → 작업물이 수백 장이어도 섹션 높이는 고정.
// ESC/백드롭/닫기 버튼으로 닫힘, ←/→ 키 지원, 열려 있는 동안 body 스크롤 잠금.
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "../_lib/data";
import Placeholder from "./Placeholder";
import { track, EVENTS } from "../_lib/analytics";
import { preselectProduct } from "../_lib/formEvents";

type Props = { items: GalleryItem[]; startIndex: number | null; onClose: () => void; filterLabel?: string };

export default function GalleryLightbox({ items, startIndex, onClose, filterLabel }: Props) {
  const [idx, setIdx] = useState(startIndex ?? 0); // 부모가 key={startIndex} 로 리마운트하므로 초기값으로 충분
  const thumbsRef = useRef<HTMLDivElement>(null);
  const count = items.length;
  const open = startIndex !== null && count > 0;

  const prev = useCallback(() => setIdx((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  // 활성 썸네일이 보이도록 스크롤
  useEffect(() => {
    const el = thumbsRef.current?.children[idx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [idx]);

  // ESC 닫기, ←/→ 넘김, body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, prev, next]);

  if (!open) return null;
  // 필터 변경 등으로 목록이 줄었을 때 이전 idx 가 범위를 벗어나지 않도록 클램프 (effect 반영 전 첫 렌더 대비)
  const safeIdx = Math.min(Math.max(idx, 0), count - 1);
  const item = items[safeIdx];

  return (
    <div role="dialog" aria-modal="true" aria-label="시공 사진 보기" className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-8">
      {/* 백드롭 */}
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* 패널 — 좌 사진 3/5 · 우 정보/CTA 2/5 (제품 라이트박스와 동일 레이아웃, 블랙 톤) */}
      <div className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl bg-neutral-950 text-white shadow-2xl no-scrollbar sm:max-h-[calc(100dvh-4rem)] lg:flex-row lg:overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {/* 좌: 큰 사진 + 좌우 화살표 + 카운터 + 썸네일 */}
        <div className="flex shrink-0 flex-col lg:w-3/5">
          <div className="relative aspect-[3/2] bg-black lg:aspect-[4/3]">
            <div key={item.id} className="relative h-full w-full animate-[glbFade_0.3s_ease]">
              {item.src ? (
                <Image src={item.src} alt={item.title} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-contain" priority />
              ) : (
                <Placeholder label={item.title} tone="dark" />
              )}
            </div>
            {count > 1 && (
              <>
                <button type="button" aria-label="이전 사진" onClick={prev} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white hover:text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" aria-label="다음 사진" onClick={next} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white hover:text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs tabular-nums">{safeIdx + 1} / {count}</span>
              </>
            )}
          </div>
          {/* 썸네일 스트립 — 활성 항목 골드 테두리, 자동 센터링 */}
          {count > 1 && (
            <div ref={thumbsRef} className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-2 sm:p-3">
              {items.map((g, i) => (
                <button
                  key={g.id}
                  type="button"
                  aria-label={`${i + 1}번 사진`}
                  onClick={() => setIdx(i)}
                  className={`relative h-11 w-16 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-14 sm:w-20 ${i === safeIdx ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  {g.src ? <Image src={g.src} alt="" fill sizes="80px" className="object-cover" /> : <Placeholder label={`${i + 1}`} tone="dark" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 우: 사례 정보 + CTA */}
        <div className="flex flex-col justify-between gap-4 border-t border-white/10 p-5 sm:gap-6 sm:p-8 lg:w-2/5 lg:overflow-y-auto lg:border-l lg:border-t-0">
          <div>
            <p className="text-[11px] tracking-[0.35em] uppercase text-white/50">{filterLabel ?? "전체"} · 총 {count}건</p>
            <h3 className="serif mt-1 text-xl font-semibold sm:mt-2 sm:text-2xl md:text-3xl">{item.title}</h3>
            <p className="mt-2 text-sm text-white/60">{item.region} · {item.space} · {item.product}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:mt-4">
              {item.region} {item.space} {item.product} 시공 사례입니다. 무료 방문 실측 시 같은 원단·사양으로 견적을 받아보실 수 있습니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="#estimate"
              onClick={() => { track(EVENTS.CLICK_CTA, { location: "gallery-lightbox", product: item.product }); preselectProduct(item.product); onClose(); }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-brown sm:h-12"
            >
              이 사례로 무료 방문 실측 신청
            </a>
            <a
              href="#products"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 px-6 text-sm font-medium transition hover:border-white hover:bg-white hover:text-accent sm:h-12"
            >
              제품 안내 더 보기
            </a>
          </div>
        </div>
      </div>

      <style>{`@keyframes glbFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
