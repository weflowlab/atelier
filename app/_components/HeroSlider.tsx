"use client";
// 메인 히어로 슬라이더. 풀뷰포트 크로스페이드, 4초 자동재생(호버 중에도 계속, 탭 비활성 시만 정지), 화살표/도트/키보드/스와이프 지원.
// 텍스트는 md+ 에서 좌측 정렬(max-w-7xl 컨테이너), 모바일은 중앙 정렬. 하단에 큰 CTA 2개(무료 방문 견적 / 전화 상담).
// 헤더가 fixed 투명이므로 섹션이 최상단(top:0)부터 시작한다.
// 유입 키워드(?kw= / n_keyword)가 있으면 1번 슬라이드 헤드라인·소제목을 지역/상품에 맞게 클라이언트에서 교체(SSR 은 기본 문구).
import { useCallback, useEffect, useRef, useState } from "react";
import { HERO_SLIDES, HERO_BADGES } from "../_lib/data";
import { getEntryKeyword } from "../_lib/attribution";
import { matchKeyword } from "../_lib/keywords";
import { track, EVENTS } from "../_lib/analytics";
import Image from "next/image";
import Placeholder from "./Placeholder";
import AwardBadge from "./AwardBadge";

const INTERVAL = 4000; // 자동재생 간격(ms) — 문구 3종이 순차 전환

// 메인 카피의 **문구** 마커를 주황 강조로 렌더 (레퍼런스의 포인트 컬러 강조와 동일)
function renderTitle(title: string) {
  return title.split(/(\*\*[^*]+\*\*)/g).map((seg, i) =>
    seg.startsWith("**") && seg.endsWith("**") ? (
      <span key={i} className="text-orange">
        {seg.slice(2, -2)}
      </span>
    ) : (
      seg
    ),
  );
}

export default function HeroSlider({ panel }: { panel?: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // 탭 비활성 시 true (호버 시에는 계속 재생)
  const [reduced, setReduced] = useState(false); // prefers-reduced-motion
  const [slides, setSlides] = useState(HERO_SLIDES); // 키워드 매칭 시 1번 슬라이드만 교체
  const startX = useRef<number | null>(null); // 스와이프 시작 좌표
  const total = slides.length;

  const go = useCallback((n: number) => setIndex((i) => (i + n + total) % total), [total]);
  const lightBg = slides[index]?.layout === "split"; // 현재 슬라이드가 밝은 배경이면 컨트롤을 어둡게

  // 키워드 개인화: sessionStorage(캡처 이후) → 없으면 URL ?kw= 직접 확인 → 매칭되면 1번 슬라이드 교체
  useEffect(() => {
    const kw = getEntryKeyword() || new URLSearchParams(window.location.search).get("kw");
    const m = matchKeyword(kw);
    if (!m.headline) return;
    // 헤드라인만 지역·상품 맞춤으로 교체. "고객만족도 1위"는 좌상단 어워드 배지가 항상 노출한다
    // URL/sessionStorage(외부 상태) → 클라이언트 전용 동기화. SSR 은 기본 문구 유지
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSlides((prev) => prev.map((s, i) => (i === 0 ? { ...s, title: m.headline! } : s)));
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
      className="relative min-h-[calc(100svh-3.5rem-env(safe-area-inset-bottom))] w-full overflow-hidden bg-neutral-900 text-white select-none touch-pan-y md:min-h-[100svh]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (startX.current = null)}
    >
      {/* 슬라이드: 전부 겹쳐두고 opacity 로 크로스페이드 */}
      {slides.map((s, i) => {
        const active = i === index;
        const split = s.layout === "split" && !!s.src; // 밝은 배경 + 우측 사진 레이아웃
        return (
          <div
            key={s.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              active ? "z-10 opacity-100" : "z-0 opacity-0 pointer-events-none"
            }`}
          >
            {split ? (
              // split: 밝은 베이지 배경 + 우측 사진 (모바일은 사진이 배경, 위에 밝은 그라데이션)
              // PC 사진은 살짝 블러 + 옅은 베일로 한 톤 흐리게 눌러 문구가 도드라지게
              <>
                <div className="absolute inset-0 bg-linear-to-br from-surface via-background to-[#efe7dc]" />
                {/* overflow-hidden: 블러·확대된 사진이 컨테이너 밖(베이지 쪽)으로 번져 세로 라인이 생기는 것 방지 */}
                <div className="absolute inset-y-0 right-0 w-full overflow-hidden md:w-[50%] lg:w-[52%]">
                  <Image src={s.src!} alt="" fill sizes="(min-width:768px) 58vw, 100vw" priority={i === 0} className="scale-[1.04] object-cover object-[50%_60%] blur-[1.5px] brightness-[1.08] md:brightness-100" />
                  <div className="absolute inset-0 hidden bg-background/10 md:block" />
                  {/* 좌측(텍스트 쪽) 경계를 넓게 페이드 — 베이지에서 사진으로 이음새 없이 넘어가게 */}
                  <div className="absolute inset-y-0 left-0 hidden w-1/3 bg-linear-to-r from-background via-background/50 to-transparent md:block" />
                </div>
                {/* 모바일: 시안처럼 문구가 놓이는 상단을 밝은 화이트 워시로 눌러 글자가 사진 디테일과 경쟁하지 않게 */}
                <div className="absolute inset-0 bg-linear-to-b from-white/25 via-white/10 to-transparent md:hidden" />
              </>
            ) : (
              <>
                {s.src ? (
                  <Image src={s.src} alt="" fill sizes="100vw" priority={i === 0} className="object-cover" />
                ) : (
                  <Placeholder tone="dark" label="" noticeSize="lg" className="border-0" />
                )}
                {/* 텍스트 가독성용 어두운 그라데이션 오버레이 (좌측 텍스트가 놓이는 쪽을 더 어둡게) */}
                <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/30 to-black/60" />
                <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/10 to-transparent" />
              </>
            )}

            {/* 텍스트 블록: key 를 활성 여부로 바꿔 활성화될 때마다 페이드업 재실행 */}
            {active && (
              <div
                key={`text-${s.id}-${index}`}
                className="absolute inset-0 flex items-center animate-[heroText_0.9s_ease_both]"
              >
                <div className={`mx-auto flex h-full w-full max-w-7xl flex-col items-start px-6 pt-32 pb-6 text-left md:h-auto md:pt-20 md:pb-24 ${split ? "md:px-10 md:pr-0 lg:px-14 lg:pr-[470px] xl:pr-[510px]" : "md:px-16 lg:px-24"}`}>
                  {/* 어워드 배지 (고객만족도 1위) — 모바일·PC 모두 텍스트 컬럼 맨 위(좌상단), 바로 아래에 문구가 이어진다 */}
                  {/* 리스 잎 끝 기준 SVG 내부 여백(약 8.6%)만큼 왼쪽으로 당겨 아래 문구 시작선과 맞춘다 */}
                  <AwardBadge className="-ml-1.5 mb-5 w-[86px] md:-ml-2.5 md:mt-14 md:mb-6 md:w-28 lg:-ml-3 lg:w-32" />
                  {/* 소제목 — 핵심 강점 문구. 모바일은 시안처럼 흰 고딕, PC 는 세리프 브라운 */}
                  <p className={`serif mb-2 w-full text-lg font-semibold tracking-[0.02em] max-md:[font-family:var(--font-noto-sans)] sm:text-xl md:mb-4 md:text-2xl md:font-bold md:tracking-[0.08em] ${split ? "text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.45)] md:text-accent md:[text-shadow:none]" : "text-white"}`}>
                    {s.eyebrow}
                  </p>
                  {/* 메인 카피 — 모바일은 시안처럼 흰 고딕 볼드 + 주황 강조, PC 는 세리프 (줄바꿈 유지) */}
                  <h1 className={`serif text-[7vw] font-bold tracking-tight whitespace-pre-line leading-[1.32] max-md:[font-family:var(--font-noto-sans)] sm:text-3xl md:text-5xl md:font-semibold md:leading-[1.15] xl:text-6xl ${split ? "text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.35)] md:text-foreground md:[text-shadow:none]" : "text-white"}`}>
                    {renderTitle(s.title)}
                  </h1>
                  {/* 인디케이터 — 모바일 전용: 문구 바로 아래 좌측 정렬 (시안 배치) */}
                  <div className="mt-6 flex items-center gap-1.5 md:hidden" aria-label="슬라이드 선택">
                    {slides.map((sl, di) => (
                      <button
                        key={sl.id}
                        type="button"
                        aria-label={`${di + 1}번 슬라이드`}
                        aria-current={di === index}
                        onClick={() => setIndex(di)}
                        className={`h-[3.5px] transition-colors duration-150 ${di === index ? "w-10 bg-white" : "w-4 bg-white/50"}`}
                      />
                    ))}
                  </div>
                  {/* 얇은 골드 라인 — 데스크톱 전용 */}
                  <span aria-hidden className="mt-5.5 mb-4 hidden h-px w-12 bg-gold md:block" />
                  {/* 서브 카피 (비어 있으면 생략) */}
                  {s.sub && (
                    <p className={`mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed sm:text-base md:mt-0 md:whitespace-normal md:text-lg ${split ? "text-muted" : "text-white/80"}`}>
                      {s.sub}
                    </p>
                  )}

                  {/* 핵심 배지 (무료 방문 실측 · 100% 맞춤 제작) — 모바일은 사진 하단에 흰 알약으로, md+ 는 서브 카피 아래 */}
                  <ul className="mt-auto mb-7 grid w-fit grid-cols-2 gap-2.5 self-center sm:flex sm:flex-wrap sm:items-center sm:justify-start md:mt-6 md:mb-0 md:self-start" aria-label="핵심 안내">
                    {HERO_BADGES.map((b) => (
                      <li
                        key={b}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-semibold md:px-3 md:py-1 md:text-xs ${split ? "bg-white/95 text-foreground shadow-[0_4px_14px_rgba(43,37,33,0.15)] md:border md:border-line md:bg-surface/70 md:shadow-none" : "border border-white/40 text-white"}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-gold" aria-hidden>
                          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* 히어로 CTA — 태블릿(md) 전용. 모바일은 하단 MobileBar, lg+ 는 우측 폼 패널이 그 역할을 대신한다 */}
                  <a
                    href="#estimate"
                    onClick={() => track(EVENTS.CLICK_CTA, { location: "hero" })}
                    className={`group mt-9 hidden h-13 items-center gap-2.5 rounded-full bg-orange pr-6 pl-7 text-[15px] font-semibold text-white shadow-[0_10px_28px_-8px_rgba(232,102,60,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#cf5630] hover:shadow-[0_14px_32px_-8px_rgba(232,102,60,0.6)] md:inline-flex ${panel ? "lg:hidden" : ""}`}
                  >
                    무료 방문 실측 신청
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* PC 우측 패널 — 신청 폼 카드 (참고 시안 배치). 모바일은 하단 폼 섹션 사용 */}
      {panel && (
        <div className="pointer-events-none absolute inset-0 z-30 hidden lg:block">
          {/* 텍스트와 같은 max-w-7xl 컨테이너 안에서 우측 정렬 — 우측 여백이 좌측 컨텐츠 시작 여백과 동일해진다 */}
          <div className="mx-auto flex h-full max-w-7xl items-center justify-end px-10 pt-14 lg:px-14">
            <div className="pointer-events-auto">{panel}</div>
          </div>
        </div>
      )}

      {/* 좌우 화살표 (얇은 셰브론) — 슬라이드 2개 이상일 때만. 우측 폼 패널이 있으면 PC 에선 숨김 */}
      {/* 도트 인디케이터: 활성 도트는 길어지고, 그 안에서 진행바가 채워짐 (슬라이드 2개 이상일 때만) */}
      {/* 하단 중앙 인디케이터 — PC 전용 (모바일은 문구 아래 인라인 인디케이터 사용) */}
      {total > 1 && (
      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-1 md:flex">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.id}
              type="button"
              aria-label={`${i + 1}번 슬라이드`}
              aria-current={active}
              onClick={() => setIndex(i)}
              // 클릭 영역 확보: 보이는 바는 3px 이지만 버튼은 상하 12px 패딩으로 누르기 쉽게
              className="group flex items-center px-1 py-3"
            >
              {/* 직사각형 바 — 진행(채워짐) 없이 활성 바만 띡 띡 즉시 전환 */}
              <span
                className={`block h-[3px] transition-colors duration-150 ${
                  active
                    ? `w-10 ${lightBg ? "bg-foreground/80" : "bg-white"}`
                    : `w-4 ${lightBg ? "bg-foreground/25 group-hover:bg-foreground/50" : "bg-white/40 group-hover:bg-white/80"}`
                }`}
              />
            </button>
          );
        })}
      </div>
      )}

      {/* 슬라이더 전용 keyframes (텍스트 페이드업) */}
      <style>{`
        @keyframes heroText { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          #hero [class*="animate-["] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
