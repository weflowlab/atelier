"use client";
// 시공사진 갤러리 섹션 (#gallery) + 커뮤니티 스트립 (#community).
// 카테고리 탭으로 필터링 — 아이템은 항상 마운트, 클래스 전환으로 페이드 인/아웃.
import { useEffect, useRef, useState } from "react";
import { GALLERY } from "../_lib/data";
import Placeholder from "./Placeholder";
import Reveal from "./Reveal";

const ALL = "전체";
const TABS = [ALL, ...Array.from(new Set(GALLERY.map((g) => g.category)))];

// 커뮤니티 카드 (플레이스홀더 링크)
const COMMUNITY = [
  { title: "공지사항", desc: "새로운 소식과 안내사항을 확인하세요." },
  { title: "이벤트", desc: "진행 중인 할인 및 시공 이벤트." },
  { title: "Q&A", desc: "궁금한 점을 남겨주시면 답변드립니다." },
];

export default function GalleryGrid() {
  const [tab, setTab] = useState(ALL); // 현재 적용된 필터
  const [fading, setFading] = useState(false); // 탭 전환 중 페이드아웃 상태
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 탭 클릭: 먼저 페이드아웃(200ms) → 필터 교체 → 새 아이템은 @starting-style 로 페이드인
  const changeTab = (next: string) => {
    if (next === tab || fading) return;
    setFading(true);
    timer.current = setTimeout(() => {
      setTab(next);
      setFading(false);
    }, 200);
  };
  // 언마운트 시 타이머 정리
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <section id="gallery" className="scroll-mt-20 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        {/* 섹션 헤더 */}
        <Reveal className="text-center">
          <p className="eyebrow">PORTFOLIO</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">시공사진</h2>
          <p className="mt-2 text-xs tracking-[0.25em] text-neutral-400">OUR RECENT WORKS</p>
        </Reveal>

        {/* 카테고리 필터 탭 — 활성 탭 밑줄이 scale-x 로 애니메이션 */}
        <Reveal delay={100} className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => changeTab(t)}
                aria-pressed={active}
                className={`group relative pb-2 text-sm transition-colors ${
                  active ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {t}
                <span
                  className={`absolute right-0 bottom-0 left-0 h-px origin-left bg-neutral-900 transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
                  }`}
                />
              </button>
            );
          })}
        </Reveal>

        {/* 메이슨리풍 그리드 — 첫 아이템만 2×2 스팬, 나머지 정사각 */}
        <Reveal delay={200}>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {GALLERY.map((item, i) => {
              const show = tab === ALL || item.category === tab;
              return (
                <li
                  key={item.id}
                  className={`${show ? "" : "hidden"} ${i === 0 ? "col-span-2 md:row-span-2" : ""} aspect-square transition-all duration-300 starting:scale-95 starting:opacity-0 ${
                    fading ? "scale-95 opacity-0" : "scale-100 opacity-100"
                  }`}
                >
                  {/* 타일: 호버 시 전체 살짝 확대 + 어두운 오버레이 위로 텍스트 슬라이드업 */}
                  <a
                    href="#gallery"
                    className="group relative block h-full w-full overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
                  >
                    <Placeholder label={item.title} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
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
                        {item.category}
                      </p>
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* 더보기 */}
        <Reveal delay={100} className="mt-10 text-center">
          <a
            href="#gallery"
            className="inline-block border border-neutral-900 px-10 py-3 text-sm font-medium transition-colors hover:bg-neutral-900 hover:text-white"
          >
            더보기
          </a>
        </Reveal>

        {/* 커뮤니티 스트립 — 공지/이벤트/Q&A 링크 카드 */}
        <div id="community" className="mt-24 scroll-mt-20 border-t border-neutral-200 pt-14">
          <Reveal className="text-center">
            <p className="eyebrow">COMMUNITY</p>
          </Reveal>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {COMMUNITY.map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <a
                  href="#community"
                  className="group flex items-center justify-between border border-neutral-200 p-6 transition-colors hover:border-neutral-900"
                >
                  <div>
                    <p className="text-sm font-semibold">{c.title}</p>
                    <p className="mt-1 text-xs text-neutral-500">{c.desc}</p>
                  </div>
                  <span className="text-neutral-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-neutral-900">
                    →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
