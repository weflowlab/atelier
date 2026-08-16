"use client";
// 제품 라이트박스 모달 — 카드 클릭 시 큰 사진 + 좌우 넘김 + 썸네일 + 제품 설명 + CTA(무료 방문 실측 신청 / 시공 사례 보기).
// 사진은 item.photos 가 없으면 플레이스홀더 4장. ESC/백드롭/닫기 버튼으로 닫힘, 열려 있는 동안 body 스크롤 잠금.
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { ProductCard } from "../_lib/data";
import Placeholder from "./Placeholder";
import { track, EVENTS } from "../_lib/analytics";
import { preselectProduct } from "../_lib/formEvents";

type Props = { item: ProductCard | null; onClose: () => void };
const PLACEHOLDER_COUNT = 4; // 실제 사진 준비 전 플레이스홀더 개수

export default function ProductLightbox({ item, onClose }: Props) {
  const [idx, setIdx] = useState(0); // 부모가 key={item.id} 로 리마운트하므로 열릴 때마다 0부터
  const photos: (string | undefined)[] = item?.photos?.length ? item.photos : Array.from({ length: PLACEHOLDER_COUNT }, () => undefined);
  const count = photos.length;

  const prev = useCallback(() => setIdx((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIdx((i) => (i + 1) % count), [count]);

  // ESC 닫기, ←/→ 넘김, body 스크롤 잠금
  useEffect(() => {
    if (!item) return;
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
  }, [item, onClose, prev, next]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} 사진 보기`}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-8"
    >
      {/* 백드롭 — 클릭 시 닫힘 */}
      <button type="button" aria-label="닫기" onClick={onClose} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* 패널 */}
      <div className="relative z-10 flex max-h-[calc(100dvh-1.5rem)] w-full max-w-5xl flex-col overflow-y-auto rounded-2xl bg-background text-foreground shadow-2xl no-scrollbar sm:max-h-[calc(100dvh-4rem)] lg:flex-row lg:overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>

        {/* 좌: 큰 사진 + 좌우 화살표 + 썸네일 */}
        <div className="flex shrink-0 flex-col lg:w-3/5">
          <div className="relative aspect-[3/2] bg-neutral-900 lg:aspect-[4/3]">
            <div key={idx} className="relative h-full w-full animate-[lbFade_0.35s_ease]">
              {photos[idx] ? (
                <Image src={photos[idx]!} alt={`${item.name} 시공 사진 ${idx + 1}`} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" priority />
              ) : (
                <Placeholder label={`${item.name} ${idx + 1}`} tone="dark" />
              )}
            </div>
            {count > 1 && (
              <>
                <button type="button" aria-label="이전 사진" onClick={prev} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" aria-label="다음 사진" onClick={next} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-accent">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white">{idx + 1} / {count}</span>
              </>
            )}
          </div>
          {/* 썸네일 — 클릭 시 해당 사진으로 */}
          {count > 1 && (
            <div className="flex gap-2 overflow-x-auto px-3 py-2 no-scrollbar sm:p-3">
              {photos.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i + 1}번 사진`}
                  onClick={() => setIdx(i)}
                  className={`h-11 w-16 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-14 sm:w-20 ${i === idx ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"}`}
                >
                  {photos[i] ? (
                    <span className="relative block h-full w-full">
                      <Image src={photos[i]!} alt="" fill sizes="80px" className="object-cover" />
                    </span>
                  ) : (
                    <Placeholder label={`${i + 1}`} tone="dark" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 우: 제품 정보 + CTA */}
        <div className="flex flex-col justify-between gap-4 p-5 sm:gap-6 sm:p-8 lg:w-2/5 lg:overflow-y-auto">
          <div>
            <p className="eyebrow">PRODUCT</p>
            <h3 className="serif mt-1 text-xl font-semibold sm:mt-2 sm:text-2xl md:text-3xl">{item.name}</h3>
            <p className="mt-2 text-sm text-muted">{item.caption}</p>
            {/* TODO: 제품별 상세 설명(item.desc) 추가 시 여기에 표시 */}
            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:mt-4">
              무료 방문 실측 시 원단 샘플을 직접 보여드리고, 공간에 맞는 {item.name}을(를) 제안해 드립니다.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href="#estimate"
              onClick={() => { track(EVENTS.CLICK_CTA, { location: "lightbox", product: item.name }); preselectProduct(item.name); onClose(); }}
              className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-brown sm:h-12"
            >
              이 제품으로 무료 방문 실측 신청
            </a>
            <a
              href="#gallery"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-full border border-line px-6 text-sm font-medium transition hover:border-accent hover:text-accent sm:h-12"
            >
              시공 사례 더 보기
            </a>
          </div>
        </div>
      </div>

      <style>{`@keyframes lbFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
    </div>
  );
}
