"use client";
// 우하단 "TOP" 플로팅 버튼 — 400px 이상 스크롤 시 표시, 클릭 시 부드럽게 최상단 이동. 퀵메뉴(카카오/전화)는 이 버튼 위쪽에 스택.
import { useEffect, useState } from "react";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  // 스크롤 위치에 따라 표시/숨김 토글
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-md transition-all duration-300 hover:bg-accent hover:text-white ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      {/* 위쪽 화살표 아이콘 (텍스트 없음) */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
