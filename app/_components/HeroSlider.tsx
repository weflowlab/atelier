"use client";
// 메인 히어로 슬라이더. 풀뷰포트 5장 크로스페이드, 5초 자동재생, 화살표/도트/키보드/스와이프 지원.
// 헤더가 fixed 투명이므로 섹션이 최상단(top:0)부터 시작한다.
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SLIDES } from "../_lib/data";
import Placeholder from "./Placeholder";

const INTERVAL = 5000; // 자동재생 간격(ms)

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // 호버/탭 비활성 시 true
  const [reduced, setReduced] = useState(false); // prefers-reduced-motion
  const startX = useRef<number | null>(null); // 스와이프 시작 좌표
  const total = HERO_SLIDES.length;

  const go = useCallback((n: number) => setIndex((i) => (i + n + total) % total), [total]);

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
      {HERO_SLIDES.map((s, i) => {
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
            {/* 텍스트 가독성용 어두운 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/60" />
            {/* 텍스트: key 를 활성 여부로 바꿔 활성화될 때마다 페이드업 재실행 */}
            {active && (
              <div
                key={`text-${s.id}-${index}`}
                className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center animate-[heroText_0.9s_ease_both]"
              >
                <p className="eyebrow mb-4 text-white/70!">{s.sub}</p>
                <h2 className="text-3xl font-light leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                  {s.title}
                </h2>
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
          className={`absolute top-1/2 ${b.side} z-20 -translate-y-1/2 p-3 text-white/70 transition hover:text-white`}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d={b.path} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ))}

      {/* 도트 인디케이터: 활성 도트는 길어지고, 그 안에서 진행바가 5초 동안 채워짐 */}
      <div className="absolute bottom-28 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
        {HERO_SLIDES.map((s, i) => {
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
                  className="absolute inset-y-0 left-0 bg-white animate-[heroBar_5s_linear_forwards]"
                />
              )}
              {active && (paused || reduced) && <span className="absolute inset-0 bg-white" />}
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
