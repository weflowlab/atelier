"use client";
// 가로 스크롤 트랙용 진행바 (모바일). trackId 요소의 scrollLeft 를 읽어 막대 위치를 갱신.
// 서버 컴포넌트(예: Strengths) 안에서도 쓸 수 있도록 id 로 트랙을 찾음.
import { useEffect, useState } from "react";

export default function ScrollProgress({ trackId, className = "" }: { trackId: string; className?: string }) {
  const [progress, setProgress] = useState(0); // 0~1
  const [thumb, setThumb] = useState(0.5);     // 막대 길이 비율 (보이는 폭 / 전체 폭)

  useEffect(() => {
    const el = document.getElementById(trackId);
    if (!el) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      setThumb(el.scrollWidth > 0 ? Math.max(0.15, el.clientWidth / el.scrollWidth) : 1);
    };
    // 스크롤 이벤트마다가 아니라 프레임당 1회만 갱신
    const update = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [trackId]);

  return (
    <div className={`relative h-px overflow-hidden bg-line ${className}`} aria-hidden>
      <div
        className="absolute inset-y-0 left-0 bg-accent transition-transform duration-150"
        style={{ width: `${thumb * 100}%`, transform: `translateX(${progress * (100 / thumb - 100)}%)` }}
      />
    </div>
  );
}
