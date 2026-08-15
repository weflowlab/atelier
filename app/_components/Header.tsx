"use client";
// 상단 고정 헤더 — 히어로 위에서는 투명(흰 글자), 스크롤 시 베이지 배경/블러/그림자/축소. 워드마크 로고 + 데스크톱 드롭다운 + 견적 CTA + MENU 드로어.
import { useCallback, useEffect, useState } from "react";
import { NAV, SITE } from "../_lib/data";
import { track, EVENTS } from "../_lib/analytics";
import MobileDrawer from "./MobileDrawer";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 스크롤 10px 이상이면 솔리드 스타일로 전환
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 text-foreground shadow-[0_2px_16px_rgba(43,37,33,0.08)] backdrop-blur"
            : "bg-transparent text-white"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 md:px-8 ${
            scrolled ? "h-16" : "h-[var(--header-h)]"
          }`}
        >
          {/* 로고 워드마크 — "커튼장인" | Atelier(필기체) + 하단 태그라인 */}
          <a href="#top" aria-label={`${SITE.nameKo} ${SITE.nameEn} 홈으로`} className="flex items-center gap-3">
            <span className="text-lg font-medium tracking-tight md:text-xl">{SITE.nameKo}</span>
            <span aria-hidden className="h-7 w-px bg-current opacity-40" />
            <span className="flex flex-col leading-none">
              <span className="script text-3xl leading-none">{SITE.nameEn}</span>
              <span className="mt-1 text-[9px] tracking-[0.3em] uppercase opacity-70">{SITE.tagline}</span>
            </span>
          </a>

          {/* 데스크톱 GNB — children 있으면 hover 드롭다운 */}
          <nav aria-label="주 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV.map((item) => (
                <li key={item.label} className="group relative">
                  <a
                    href={item.href}
                    className="relative flex h-16 items-center text-[13px] font-medium tracking-wide after:absolute after:bottom-4 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-300 group-hover:after:w-full"
                  >
                    {item.label}
                  </a>
                  {item.children && (
                    // 드롭다운 패널 — 150ms 페이드/슬라이드다운, hover 유지 위해 top 딱 붙임
                    <div className="invisible absolute left-1/2 top-full min-w-[160px] -translate-x-1/2 -translate-y-1 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <ul className="border border-line bg-surface py-2 text-foreground shadow-lg">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a
                              href={c.href}
                              className="block whitespace-nowrap px-5 py-2 text-[13px] text-muted hover:bg-background hover:text-foreground"
                            >
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* 우측 액션: 무료 방문실측 CTA(md+, 클릭 트래킹) + MENU 햄버거 */}
          <div className="flex items-center gap-2 md:gap-4">
            <a
              href="#estimate"
              onClick={() => track(EVENTS.CLICK_CTA, { location: "header" })}
              className="hidden items-center rounded-full bg-accent px-4 py-2 text-xs font-medium tracking-wide text-white shadow-sm transition-transform duration-200 hover:scale-105 hover:bg-brown md:inline-flex"
            >
              무료 방문실측
            </a>
            <button
              type="button"
              aria-label="전체 메뉴 열기"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 items-center gap-2 px-1"
            >
              <span className="hidden text-[11px] tracking-[0.2em] md:inline">MENU</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* 슬라이드 드로어 (모바일 + 데스크톱 MENU 공용) */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
