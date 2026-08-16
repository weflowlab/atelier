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
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
      setThumb(el.scrollWidth > 0 ? Math.max(0.15, el.clientWidth / el.scrollWidth) : 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
