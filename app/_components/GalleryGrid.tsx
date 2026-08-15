"use client";
// 시공 사례 포트폴리오 섹션 (#gallery) — 지역별 · 공간별 2단 필터(AND) + 사진 클린 그리드.
// 필터 전환 시 페이드아웃 → 필터 교체 → @starting-style 페이드인. 아이템은 항상 마운트, hidden 토글.
import { useEffect, useRef, useState } from "react";
import { GALLERY } from "../_lib/data";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

const ALL = "전체";
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
    <div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-2">
      <span className="mr-1 text-[11px] tracking-[0.25em] text-muted">{label}</span>
      {tabs.map((t) => {
        const active = t === value;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            aria-pressed={active}
            className={`group relative pb-1.5 text-sm transition-colors ${
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

  // 두 필터 AND 적용 — 첫 번째 보이는 아이템(2×2 스팬) 은 필터링된 목록 기준으로 계산
  const visibleIds = GALLERY.filter(
    (g) => (region === ALL || g.region === region) && (space === ALL || g.space === space),
  ).map((g) => g.id);
  const firstVisible = visibleIds[0];

  return (
    <section id="gallery" className="scroll-mt-20 bg-background py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* 섹션 헤더 + 지역 키워드 캡션 (SEO) */}
        <Reveal className="text-center">
          <p className="eyebrow">PORTFOLIO</p>
          <h2 className="serif mt-3 text-3xl font-medium tracking-tight md:text-4xl">남양주 · 구리 시공 사례</h2>
          <p className="mt-3 text-sm text-muted">지역별 · 공간별로 확인하세요</p>
          {/* 사진은 실제 시공사진으로 교체 예정 */}
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-muted">
            다산 · 별내 · 마석 · 화도읍 · 구리 아파트, 전원주택, 상가 등 실제 시공 사진입니다.
          </p>
        </Reveal>

        {/* 필터 2줄 (지역 / 공간) + 결과 건수 */}
        <Reveal delay={100} className="mt-10 space-y-3">
          <FilterRow label="지역" tabs={REGION_TABS} value={region} onChange={(v) => change("region", v)} />
          <FilterRow label="공간" tabs={SPACE_TABS} value={space} onChange={(v) => change("space", v)} />
          <p className="pt-1 text-center text-xs text-muted" aria-live="polite">
            <span className="font-medium text-foreground">{visibleIds.length}</span>건
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
                  <a
                    href="#gallery"
                    className="group relative block h-full w-full overflow-hidden rounded-xl bg-surface"
                  >
                    <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                      <Placeholder label={item.title} />
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
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* 더보기 — 아웃라인 버튼 */}
        <Reveal delay={100} className="mt-12 text-center">
          <a
            href="#"
            className="inline-block rounded-full border border-accent px-10 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            더보기
          </a>
        </Reveal>
      </div>
    </section>
  );
}
