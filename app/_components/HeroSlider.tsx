"use client";
// 메인 히어로 슬라이더. 풀뷰포트 크로스페이드, 5초 자동재생, 화살표/도트/키보드/스와이프 지원.
// 텍스트는 md+ 에서 좌측 정렬(max-w-7xl 컨테이너), 모바일은 중앙 정렬. 하단에 큰 CTA 2개(무료 방문 견적 / 전화 상담).
// 헤더가 fixed 투명이므로 섹션이 최상단(top:0)부터 시작한다.
// 유입 키워드(?kw= / n_keyword)가 있으면 1번 슬라이드 헤드라인·소제목을 지역/상품에 맞게 클라이언트에서 교체(SSR 은 기본 문구).
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SLIDES, HERO_CTA, HERO_BADGES } from "../_lib/data";
import { getEntryKeyword } from "../_lib/attribution";
import { matchKeyword } from "../_lib/keywords";
import { track, EVENTS } from "../_lib/analytics";
import Placeholder from "./Placeholder";

const INTERVAL = 5000; // 자동재생 간격(ms)

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // 호버/탭 비활성 시 true
  const [reduced, setReduced] = useState(false); // prefers-reduced-motion
  const [slides, setSlides] = useState(HERO_SLIDES); // 키워드 매칭 시 1번 슬라이드만 교체
  const startX = useRef<number | null>(null); // 스와이프 시작 좌표
  const total = slides.length;

  const go = useCallback((n: number) => setIndex((i) => (i + n + total) % total), [total]);

  // 키워드 개인화: sessionStorage(캡처 이후) → 없으면 URL ?kw= 직접 확인 → 매칭되면 1번 슬라이드 교체
  useEffect(() => {
    const kw = getEntryKeyword() || new URLSearchParams(window.location.search).get("kw");
    const m = matchKeyword(kw);
    if (!m.headline) return;
    const eyebrow = `${m.region ?? "남양주"} ${m.product ?? "커튼 · 블라인드"}`;
    setSlides((prev) => prev.map((s, i) => (i === 0 ? { ...s, title: m.headline!, eyebrow } : s)));
  }, []);

  // 접근성: 모션 축소 설정이면 자동재생 끔
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // 자동재생: 일시정지/모션축소가 아닐 때만 5초마다 다음 슬라이드
  useEffect(() => {
    if (paused || reduced) return;
    const t = setInterval(() => go(1), INTERVAL);
    return () => clearInterval(t);
  }, [paused, reduced, go, index]); // index 포함: 수동 이동 후 타이머 리셋

  // 탭이 숨겨지면 자동재생 중지 (백그라운드에서 불필요한 전환 방지)
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // 키보드 ← → 로 슬라이드 이동
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // 터치/마우스 스와이프: 50px 이상 이동 시 방향에 따라 전환
  const onPointerDown = (e: React.PointerEvent) => (startX.current = e.clientX);
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) >= 50) go(dx < 0 ? 1 : -1);
    startX.current = null;
  };

  return (
    <section
      id="hero"
      aria-roledescription="carousel"
      aria-label="메인 슬라이드"
      className="relative min-h-[100svh] w-full overflow-hidden bg-neutral-900 text-white select-none touch-pan-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(document.hidden)}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (startX.current = null)}
    >
      {/* 슬라이드: 전부 겹쳐두고 opacity 로 크로스페이드 */}
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              active ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
            }`}
          >
            <Placeholder tone="dark" label={`HERO ${s.id}`} className="border-0" />
            {/* 텍스트 가독성용 어두운 그라데이션 오버레이 (좌측 텍스트가 놓이는 쪽을 더 어둡게) */}
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/60" />
            <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/10 to-transparent" />

            {/* 텍스트 블록: key 를 활성 여부로 바꿔 활성화될 때마다 페이드업 재실행 */}
            {active && (
              <div
                key={`text-${s.id}-${index}`}
                className="absolute inset-0 flex items-center animate-[heroText_0.9s_ease_both]"
              >
                <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-24 pb-40 text-center md:items-start md:px-10 md:text-left">
                  {/* 영문 소제목 */}
                  <p className="mb-5 text-[11px] tracking-[0.35em] uppercase text-white/80 sm:text-xs">
                    {s.eyebrow}
                  </p>
                  {/* 메인 카피 (세리프, 줄바꿈 유지) */}
                  <h1 className="serif whitespace-pre-line text-4xl font-semibold leading-[1.2] tracking-tight text-white md:text-6xl md:leading-[1.15]">
                    {s.title}
                  </h1>
                  {/* 얇은 골드 라인 */}
                  <span aria-hidden className="my-6 block h-px w-12 bg-gold" />
                  {/* 서브 카피 */}
                  <p className="max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg">
                    {s.sub}
                  </p>

                  {/* CTA: 무료 방문 견적 신청(골드) / 전화 상담(아웃라인). 모바일은 세로 풀폭 */}
                  <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
                    <a
                      href={HERO_CTA.primary.href}
                      onClick={() => track(EVENTS.CLICK_CTA, { location: "hero" })}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-medium text-white shadow-lg shadow-black/20 transition hover:brightness-110 active:brightness-95 sm:w-auto"
                    >
                      {HERO_CTA.primary.label}
                      {/* 화살표 아이콘 */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                    <a
                      href={HERO_CTA.secondary.href}
                      onClick={() => track(EVENTS.CLICK_CALL, { location: "hero" })}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/70 px-8 py-4 text-base font-medium text-white transition hover:bg-white/10 sm:w-auto"
                    >
                      {/* 전화 아이콘 */}
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                        <path
                          d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {HERO_CTA.secondary.label}
                    </a>
                  </div>

                  {/* 핵심 배지 3개 (무료 방문실측 · 100% 맞춤 제작 · 장인 직접 시공) — 첫 화면에서 바로 보이도록 CTA 바로 아래 */}
                  <ul className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-start" aria-label="핵심 안내">
                    {HERO_BADGES.map((b) => (
                      <li
                        key={b}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/40 px-3 py-1 text-xs text-white/90"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold" aria-hidden>
                          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* 좌우 화살표 (얇은 셰브론) */}
      {[
        { dir: -1, side: "left-4 sm:left-8", label: "이전 슬라이드", path: "M15 5l-7 7 7 7" },
        { dir: 1, side: "right-4 sm:right-8", label: "다음 슬라이드", path: "M9 5l7 7-7 7" },
      ].map((b) => (
        <button
          key={b.dir}
          type="button"
          aria-label={b.label}
          onClick={() => go(b.dir)}
          className={`absolute top-1/2 ${b.side} z-20 hidden -translate-y-1/2 p-3 text-white/70 transition hover:text-white sm:block`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d={b.path} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}

      {/* 도트 인디케이터: 활성 도트는 길어지고, 그 안에서 진행바가 5초 동안 채워짐 (SCROLL 안내와 겹치지 않게 bottom-28) */}
      <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.id}
              type="button"
              aria-label={`${i + 1}번 슬라이드`}
              aria-current={active}
              onClick={() => setIndex(i)}
              className={`relative h-[3px] overflow-hidden rounded-full bg-white/40 transition-all duration-500 ${
                active ? "w-10" : "w-2 hover:bg-white/70"
              }`}
            >
              {active && !paused && !reduced && (
                <span
                  key={`bar-${index}`}
                  className="absolute inset-y-0 left-0 bg-gold animate-[heroBar_5s_linear_forwards]"
                />
              )}
              {active && (paused || reduced) && <span className="absolute inset-0 bg-gold" />}
            </button>
          );
        })}
      </div>

      {/* SCROLL 안내: 텍스트 + 위아래로 흔들리는 세로선 */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] tracking-[0.3em] text-white/60">
        <span>SCROLL</span>
        <span className="block h-8 w-px overflow-hidden bg-white/20">
          <span className="block h-1/2 w-full bg-white animate-[heroScroll_1.6s_ease-in-out_infinite]" />
        </span>
      </div>

      {/* 슬라이더 전용 keyframes (텍스트 페이드업 / 진행바 / 스크롤 라인) */}
      <style>{`
        @keyframes heroText { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @keyframes heroBar { from { width: 0 } to { width: 100% } }
        @keyframes heroScroll { 0% { transform: translateY(-100%) } 100% { transform: translateY(200%) } }
        @media (prefers-reduced-motion: reduce) {
          #hero [class*="animate-["] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
