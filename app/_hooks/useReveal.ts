"use client";
// 스크롤 진입 시 페이드업 애니메이션용 훅.
// 반환된 ref 를 요소에 붙이고, `data-reveal` 속성 + globals.css 의 .is-visible 규칙으로 동작.
import { useEffect, useRef } from "react";

export function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target); // 한 번만 실행
          }
        });
      },
      { threshold: 0.15, ...options },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [options]);
  return ref;
}
