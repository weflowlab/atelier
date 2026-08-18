"use client";
// 스크롤 멈춤 감지 훅 — 스크롤 중 false, IDLE_MS 동안 멈추면 true (최상단 근처에서는 항상 false).
// 모바일 스티키(카카오톡/TOP)를 스크롤 멈춤 시 오른쪽으로 숨기는 데 사용. 헤더 자동 숨김과 같은 타이밍(1.1s).
import { useEffect, useState } from "react";

export function useScrollIdle(idleMs = 1100, minY = 50) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      setIdle(false);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.scrollY > minY) setIdle(true);
      }, idleMs);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [idleMs, minY]);
  return idle;
}
