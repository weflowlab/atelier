"use client";
// 시공 사례 포트폴리오 섹션 (#gallery) — 지역별 · 공간별 2단 필터(AND) + 사진 클린 그리드.
// 그리드는 필터 결과 중 최신 MAX_TILES 장만 표시, 타일 클릭 시 라이트박스에서 필터 결과 "전체"를 넘겨봄.
// 필터 전환 시 페이드아웃 → 필터 교체 → @starting-style 페이드인. 아이템은 항상 마운트, hidden 토글.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GALLERY } from "../_lib/data";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import GalleryLightbox from "./GalleryLightbox";
import type { GalleryItem } from "../_lib/data";

const ALL = "전체";
const MAX_TILES = 13; // 그리드에 보여줄 최대 장수 (나머지는 라이트박스에서)
// 필터 옵션 — 데이터에서 중복 제거한 지역/공간 목록 (앞에 "전체")
const REGION_TABS = [ALL, ...Array.from(new Set(GALLERY.map((g) => g.region)))];
const SPACE_TABS = [ALL, ...Array.from(new Set(GALLERY.map((g) => g.space)))];

// 필터 한 줄 — 라벨 + 밑줄 애니메이션 탭 버튼
function FilterRow({
  label,
  tabs,
  value,
  onChange,
}: {
  label: string;
  tabs: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    // 모바일: 라벨 고정 폭 열 + 탭 열(왼쪽 정렬) → "지역"/"공간" 줄 시작선이 맞음. md+: 가운데 정렬 한 줄
    <div className="grid grid-cols-[2.75rem_1fr] items-baseline gap-x-2 md:flex md:flex-wrap md:items-baseline md:justify-center md:gap-x-5 md:gap-y-2">
      <span className="text-sm tracking-[0.25em] text-muted md:mr-1">{label}</span>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 md:contents">
      {tabs.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            aria-pressed={active}
            className={`group relative pb-1.5 text-base transition-colors ${
              active ? "text-foreground" : "text-muted hover:text-foreground"
            }`}
          >
            {t}
            <span
              className={`absolute right-0 bottom-0 left-0 h-px origin-left bg-accent transition-transform duration-300 ${
                active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
              }`}
            />
          </button>
        );
      })}
      </div>
    </div>
  );
}

export default function GalleryGrid() {
  const [region, setRegion] = useState(ALL); // 적용된 지역 필터
  const [space, setSpace] = useState(ALL); // 적용된 공간 필터
  const [fading, setFading] = useState(false); // 전환 중 페이드아웃 상태
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 필터 변경: 먼저 페이드아웃(200ms) → 상태 교체 → 새 아이템은 @starting-style 로 페이드인
  const change = (kind: "region" | "space", next: string) => {
    const cur = kind === "region" ? region : space;
    if (next === cur || fading) return;
    setFading(true);
    timer.current = setTimeout(() => {
      (kind === "region" ? setRegion : setSpace)(next);
      setFading(false);
    }, 200);
  };
  // 언마운트 시 타이머 정리
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null); // 라이트박스 시작 인덱스 (null=닫힘)

  // 두 필터 AND 적용 → 전체 결과(filtered)는 라이트박스용, 그리드에는 앞 MAX_TILES 장만
  const filtered: GalleryItem[] = GALLERY.filter(
    (g) => (region === ALL || g.region === region) && (space === ALL || g.space === space),
  );
  const visibleIds = filtered.slice(0, MAX_TILES).map((g) => g.id);
  const firstVisible = visibleIds[0];
  const filterLabel = [region, space].filter((v) => v !== ALL).join(" · ") || "전체";

  return (
    <section id="gallery" className="scroll-mt-20 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* 섹션 헤더 + 지역 키워드 캡션 (SEO) */}
        <Reveal className="text-center">
          <p className="eyebrow">GALLERY</p>
          <h2 className="serif mt-3 text-3xl font-medium tracking-tight md:text-4xl">실제 시공 · 작업 포트폴리오</h2>
          <p className="mt-3 text-sm text-muted">지역별 · 공간별로 확인하세요</p>
        </Reveal>

        {/* 필터 2줄 (지역 / 공간) + 결과 건수 */}
        {/* 필터 2줄(모바일은 라벨 열 고정으로 지역/공간 시작선 일치) + 결과 건수(가운데) */}
        <Reveal delay={100} className="mt-10 space-y-3">
          <FilterRow label="지역" tabs={REGION_TABS} value={region} onChange={(v) => change("region", v)} />
          <FilterRow label="공간" tabs={SPACE_TABS} value={space} onChange={(v) => change("space", v)} />
          <p className="inline-flex w-full items-center justify-center gap-1.5 pt-1 text-center text-sm text-muted" aria-live="polite">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
            </svg>
            <span>
              총 <span className="font-medium text-foreground">{filtered.length}</span>건
              {filtered.length > visibleIds.length
                ? ` · ${visibleIds.length}건 표시, 사진을 클릭해 전체 시공 사례를 넘겨 보세요`
                : " · 사진을 클릭해 시공 사례를 넘겨 보세요"}
            </span>
          </p>
        </Reveal>

        {/* 포토 그리드 — 보이는 첫 아이템만 md+ 에서 2×2 스팬, 나머지 정사각 타일 */}
        <Reveal delay={200}>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {GALLERY.map((item) => {
              const show = visibleIds.includes(item.id);
              return (
                <li
                  key={item.id}
                  className={`${show ? "" : "hidden"} ${
                    item.id === firstVisible ? "md:col-span-2 md:row-span-2" : ""
                  } aspect-square transition-all duration-300 starting:scale-95 starting:opacity-0 ${
                    fading ? "scale-95 opacity-0" : "scale-100 opacity-100"
                  }`}
                >
                  {/* 타일: 호버 시 이미지 살짝 확대 + 어두운 오버레이 위로 제목/지역·공간·상품 슬라이드업 */}
                  {/* 타일 클릭 → 라이트박스 (현재 필터 결과 전체를 해당 사진부터) */}
                  <button
                    type="button"
                    onClick={() => setLightboxIdx(filtered.findIndex((g) => g.id === item.id))}
                    aria-label={`${item.title} 크게 보기`}
                    className="group relative block h-full w-full overflow-hidden rounded-xl bg-surface text-left"
                  >
                    {/* 첫 타일만 md+ 에서 2×2 로 커지므로 sizes 도 따로 준다 */}
                    <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                      {item.src ? (
                        <Image
                          src={item.src}
                          alt={`${item.title} 시공 사진`}
                          fill
                          sizes={item.id === firstVisible ? "(min-width: 768px) 560px, 50vw" : "(min-width: 768px) 280px, 50vw"}
                          className="object-cover"
                        />
                      ) : (
                        <Placeholder label={item.title} />
                      )}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 px-4 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 translate-y-3 transition-transform duration-300 group-hover:translate-y-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                      <p className="translate-y-3 text-sm font-medium transition-transform duration-300 delay-75 group-hover:translate-y-0">
                        {item.title}
                      </p>
                      <p className="translate-y-3 text-[11px] tracking-widest text-white/70 transition-transform duration-300 delay-100 group-hover:translate-y-0">
                        {`${item.region} · ${item.space} · ${item.product}`}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>

      {/* 라이트박스 — 필터 결과 전체 */}
      <GalleryLightbox key={lightboxIdx ?? "closed"} items={filtered} startIndex={lightboxIdx} onClose={() => setLightboxIdx(null)} filterLabel={filterLabel} />
    </section>
  );
}
