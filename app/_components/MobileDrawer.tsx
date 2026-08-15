"use client";
// 우측 슬라이드 드로어 — NAV 전체(하위 메뉴 아코디언 포함)를 표시. 모바일/데스크톱 MENU 버튼 공용.
import { useEffect, useState } from "react";
import { NAV, type NavItem } from "../_lib/data";

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
    <div
      className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* 배경 딤 — 클릭 시 닫힘 */}
      <button
        type="button"
        aria-label="메뉴 닫기"
        tabIndex={-1}
        onClick={close}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* 드로어 패널 — translate-x 로 슬라이드 인/아웃 (300ms) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="전체 메뉴"
        className={`absolute right-0 top-0 flex h-full w-[82vw] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 상단: 로그인/마이페이지 링크 + 닫기 버튼 */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-3 text-xs text-muted">
            <a href="#" className="hover:text-foreground">로그인</a>
            <span aria-hidden className="h-3 w-px bg-line" />
            <a href="#" className="hover:text-foreground">마이페이지</a>
          </div>
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
                    className="block px-5 py-4 text-sm font-medium tracking-wide hover:bg-neutral-50"
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* 하단 연락처 안내 (선택) */}
        <div className="border-t border-line px-5 py-4 text-[11px] tracking-widest text-muted">
          CURTAIN &amp; BLIND
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
        className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium tracking-wide hover:bg-neutral-50"
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
        <ul className="overflow-hidden bg-neutral-50">
          {item.children?.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                onClick={onNavigate}
                className="block px-8 py-2.5 text-[13px] text-muted hover:text-foreground"
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
