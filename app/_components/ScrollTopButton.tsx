"use client";
// 우하단 "TOP" 플로팅 버튼 — 400px 이상 스크롤 시 표시, 클릭 시 부드럽게 최상단 이동. 퀵메뉴는 이 버튼 위쪽에 스택.
// 모바일(<md)에서는 퀵메뉴와 동일하게 스크롤 멈춤(idle) 시 오른쪽으로 스르륵 숨고, 스크롤 시 다시 나옴.
import { useEffect, useState } from "react";

export default function ScrollTopButton() {
  const [visible, setVisible] = useState(false); // 400px 이상 스크롤
  const [idle, setIdle] = useState(false);       // 스크롤 멈춤(모바일 숨김)

  useEffect(() => {
    const IDLE_MS = 1100; // QuickMenu/헤더와 동일
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setVisible(window.scrollY > 400);
      setIdle(false);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.scrollY > 50) setIdle(true);
      }, IDLE_MS);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <button
      type="button"
      aria-label="맨 위로 이동"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      // 표시/숨김은 opacity + 세로 이동, 모바일 idle 은 오른쪽으로 밀어냄(translate 속성 트랜지션)
      className={`fixed bottom-3 right-3 z-40 flex h-16 w-16 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-md transition-[opacity,translate,background-color,color] duration-[600ms] ease-in-out hover:bg-accent hover:text-white ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      } ${idle ? "translate-x-[calc(100%+1.25rem)] md:translate-x-0" : visible ? "translate-x-0 translate-y-0" : "translate-y-3"}`}
    >
      {/* 위쪽 화살표 아이콘 (텍스트 없음) */}
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
