"use client";
// 우측 슬라이드 드로어(웜 베이지 팔레트) — 상단 전화/카카오톡 버튼, NAV 아코디언, 하단 대표번호·운영시간. 모바일/데스크톱 MENU 버튼 공용.
import { useEffect, useState } from "react";
import { NAV, SITE, type NavItem } from "../_lib/data";

type Props = { open: boolean; onClose: () => void };

export default function MobileDrawer({ open, onClose }: Props) {
  // 열려 있는 아코디언 인덱스 (한 번에 하나만)
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  // 열림 중 body 스크롤 잠금 + ESC 로 닫기
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenIdx(null);
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // 닫을 때 아코디언 상태도 초기화
  const close = () => {
    setOpenIdx(null);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      {/* 배경 딤 — 클릭 시 닫힘 */}
      <button
        type="button"
        aria-label="메뉴 닫기"
        tabIndex={-1}
        onClick={close}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
      />

      {/* 드로어 패널 — translate-x 로 슬라이드 인/아웃 (300ms) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        className={`absolute right-0 top-0 flex h-full w-[82vw] max-w-sm flex-col bg-surface text-foreground shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 상단: 워드마크 + 닫기 버튼 */}
        <div className="flex h-20 items-center justify-between border-b border-line px-5">
          {/* 영문 로고 — 헤더와 동일한 필기체 Atelier + 태그라인 */}
          <span className="flex flex-col items-center text-gold">
            <span className="script text-[27px] leading-none">{SITE.nameEn}</span>
            <span className="mt-1 text-[8px] tracking-[0.35em] uppercase">{SITE.tagline}</span>
          </span>
          <button
            type="button"
            aria-label="메뉴 닫기"
            onClick={close}
            className="-mr-2 flex h-9 w-9 items-center justify-center hover:text-muted"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* 빠른 문의 — 전화 상담 / 카카오톡 문의 큰 버튼 2개 */}
        <div className="grid grid-cols-2 gap-2 border-b border-line px-3 py-4">
          <a
            href={SITE.telHref}
            onClick={close}
            className="flex h-12 items-center justify-center gap-2 rounded-full border border-line bg-white text-[15px] font-medium text-foreground transition hover:bg-surface"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600" aria-hidden>
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
            </svg>
            <span className="-translate-y-[1px]">전화 상담</span>
          </a>
          <a
            href={SITE.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#FEE500] text-[15px] font-medium text-[#191919] transition-colors hover:bg-[#f5dc00]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.5 6.5l-1 3.7c-.1.3.3.6.6.4l4.4-2.9c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
            </svg>
            <span className="-translate-y-[1px]">카카오톡 문의</span>
          </a>
        </div>

        {/* 메뉴 목록 — children 있으면 아코디언, 없으면 단순 링크 */}
        <nav className="flex-1 overflow-y-auto">
          <ul>
            {NAV.map((item, i) => (
              <li key={item.label} className="border-b border-line">
                {item.children ? (
                  <AccordionItem
                    item={item}
                    expanded={openIdx === i}
                    onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                    onNavigate={close}
                  />
                ) : (
                  <a
                    href={item.href}
                    onClick={close}
                    className="block px-5 py-4 text-[14px] font-medium tracking-wide hover:bg-background"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* 하단: 전화번호 2개(휴대폰 먼저) + 운영시간 */}
        <div className="border-t border-line px-5 py-4">
          <p className="eyebrow">{SITE.tagline}</p>
          <a href="tel:01041262209" className="mt-1 block text-[19px] font-medium tracking-tight hover:text-brown">
            010-4126-2209
          </a>
          <a href={SITE.telHref} className="block text-[19px] font-medium tracking-tight hover:text-brown">
            {SITE.tels[0]}
          </a>
          <p className="mt-1 text-[10px] tracking-wider text-muted">{SITE.hours}</p>
        </div>
      </aside>
    </div>
  );
}

// 아코디언 항목 — grid-rows 트릭으로 높이 애니메이션, chevron 회전
function AccordionItem({
  item,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left text-[14px] font-medium tracking-wide hover:bg-background"
      >
        {item.label}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {/* 0fr → 1fr 전환으로 자연스러운 펼침 */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <ul className="overflow-hidden bg-background">
          {item.children?.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                onClick={onNavigate}
                className="block px-8 py-2.5 text-[12px] text-muted hover:text-foreground"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
