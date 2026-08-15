"use client";
// 상단 고정 헤더 — 히어로 위에서는 투명, 스크롤 시 흰 배경/그림자/축소. 데스크톱 드롭다운 + 검색바 + 드로어 토글.
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV, SITE } from "../_lib/data";
import MobileDrawer from "./MobileDrawer";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 스크롤 10px 이상이면 solid 스타일로 전환
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 검색바 열리면 입력창 포커스, ESC 로 닫기
  useEffect(() => {
    if (!searchOpen) return;
    searchInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearchOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // 투명(히어로 위) vs 솔리드(스크롤 후) 스타일 — 검색바 열림 시에도 솔리드
  const solid = scrolled || searchOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          solid ? "bg-white text-foreground shadow-[0_2px_12px_rgba(0,0,0,0.06)]" : "bg-transparent text-white"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 md:px-8 ${
            solid ? "h-16" : "h-[var(--header-h)]"
          }`}
        >
          {/* 로고 */}
          <a href="#top" className="text-lg font-semibold tracking-[0.3em]">
            {SITE.name}
          </a>

          {/* 데스크톱 GNB — children 있으면 hover 드롭다운 */}
          <nav aria-label="주 메뉴" className="hidden md:block">
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
                      <ul className="border border-line bg-white py-2 text-foreground shadow-lg">
                        {item.children.map((c) => (
                          <li key={c.label}>
                            <a
                              href={c.href}
                              className="block whitespace-nowrap px-5 py-2 text-[13px] text-muted hover:bg-neutral-50 hover:text-foreground"
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

          {/* 우측 액션: 검색(데스크톱) + MENU 햄버거 */}
          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              aria-label="검색"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden h-9 w-9 items-center justify-center md:flex"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </button>
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

        {/* 검색바 오버레이 — 헤더 바로 아래 전체폭, 열림 시 슬라이드다운 */}
        <div
          className={`overflow-hidden border-t border-line bg-white text-foreground transition-all duration-300 ${
            searchOpen ? "max-h-24 opacity-100" : "max-h-0 border-t-0 opacity-0"
          }`}
        >
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault(); // 데모: 실제 검색 없음
              setSearchOpen(false);
            }}
            className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-4"
          >
            <input
              ref={searchInputRef}
              type="search"
              placeholder="검색어를 입력하세요"
              className="h-10 flex-1 border-b border-foreground bg-transparent px-1 text-sm outline-none placeholder:text-muted"
            />
            <button type="submit" className="text-xs tracking-widest">
              SEARCH
            </button>
            <button
              type="button"
              aria-label="검색 닫기"
              onClick={() => setSearchOpen(false)}
              className="flex h-9 w-9 items-center justify-center"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </form>
        </div>
      </header>

      {/* 슬라이드 드로어 (모바일 + 데스크톱 MENU 공용) */}
      <MobileDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
