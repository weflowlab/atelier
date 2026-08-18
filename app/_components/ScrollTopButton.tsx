"use client";
// 우하단 "TOP" 플로팅 버튼 — 400px 이상 스크롤 시 표시, 클릭 시 부드럽게 최상단 이동.
// 모바일은 하단 바 + 카카오 스티키 위(bottom-9rem)에 두고 스크롤 멈춤 시 오른쪽으로 스르륵 숨김, PC 는 우하단(bottom-3, 퀵메뉴가 그 위에 스택).
import { useEffect, useState } from "react";
import { useScrollIdle } from "../_hooks/useScrollIdle";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false); // 400px 이상 스크롤
  const idle = useScrollIdle(); // 모바일: 스크롤 멈춤 시 오른쪽으로 숨김

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
      className={`fixed bottom-[9rem] right-3 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-md transition-[opacity,translate,background-color,color] duration-[600ms] ease-in-out hover:bg-accent hover:text-white md:bottom-3 md:h-16 md:w-16 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${idle ? "translate-x-[calc(100%+1.25rem)] md:translate-x-0" : visible ? "translate-x-0 translate-y-0" : "translate-y-3"}`}
    >
      {/* 위쪽 화살표 아이콘 (텍스트 없음) */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
