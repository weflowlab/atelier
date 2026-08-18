"use client";
// 진입 인트로 스플래시 — 재봉틀 일러스트 위로 문구가 한 글자씩 타이핑되고, 끝나면 페이드아웃되며 메인 노출.
// SSR 에서도 마크업을 내보내 "첫 페인트부터" 보이게 하고, 재방문(세션 내)·모션 최소화 설정이면
// layout.tsx 의 인라인 스크립트가 <html data-intro="seen"> 를 붙여 CSS 로 즉시 감춘다(깜빡임 방지).
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

const LINE = "한 폭의 커튼, 공간의 품격을 바꾸다";
const TYPE_MS = 80;   // 글자당 타이핑 간격
const HOLD_MS = 900;  // 다 적힌 뒤 머무는 시간
const FADE_MS = 700;  // 페이드아웃 시간
const KEY = "atelier_intro_seen";

export default function IntroSplash() {
  const [gone, setGone] = useState(false);       // 완전히 제거
  const [leaving, setLeaving] = useState(false); // 페이드아웃 중
  const [typed, setTyped] = useState("");
  const closed = useRef(false);

  // 종료 — 세션 기록 + <html data-intro="seen"> (CSS 로 숨김·스크롤 해제) 후 언마운트
  const close = useCallback((instant = false) => {
    if (closed.current) return;
    closed.current = true;
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    document.documentElement.setAttribute("data-intro", "seen");
    if (instant) {
      setGone(true);
      return;
    }
    setLeaving(true);
    setTimeout(() => setGone(true), FADE_MS);
  }, []);

  // 재방문/모션 최소화면 즉시 제거, 아니면 타이핑 시작 → 완료 후 자동 종료
  useEffect(() => {
    const seen = (() => {
      try {
        return !!sessionStorage.getItem(KEY);
      } catch {
        return false;
      }
    })();
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // 세션/모션설정(외부 상태) 확인 결과 즉시 제거 — CSS 로 이미 숨겨져 있어 화면 변화는 없음
      // eslint-disable-next-line react-hooks/set-state-in-effect
      close(true);
      return;
    }
    let i = 0;
    const iv = setInterval(() => {
      i += 1;
      setTyped(LINE.slice(0, i));
      if (i >= LINE.length) {
        clearInterval(iv);
        setTimeout(close, HOLD_MS);
      }
    }, TYPE_MS);
    return () => clearInterval(iv);
  }, [close]);

  // 아무 조작이나 하면 건너뛰기
  useEffect(() => {
    const skip = () => close();
    window.addEventListener("keydown", skip);
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchstart", skip, { passive: true });
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
    };
  }, [close]);

  if (gone) return null;

  return (
    <div
      id="intro-splash"
      onClick={() => close()}
      className={`fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#ecdfc6] transition-opacity duration-700 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* 이미지 가장자리는 파일 자체에 배경색 페이드를 구워 경계가 보이지 않음 */}
      <div className="relative w-[min(84vw,560px)] animate-[introFade_0.9s_ease_both]">
        <Image src="/images/intro/intro-sewing.webp" alt="커튼장인 아뜰리에" width={1253} height={977} priority className="h-auto w-full" />
      </div>

      {/* 타이핑 문구 + 깜빡이는 커서 */}
      <p className="serif mt-1 min-h-[1.6em] px-6 text-center text-lg font-medium tracking-tight text-accent sm:text-2xl md:text-3xl">
        {typed}
        <span className="ml-0.5 inline-block w-[2px] animate-[introCaret_0.8s_step-end_infinite] bg-accent align-[-0.1em] text-transparent">|</span>
      </p>

      {/* 건너뛰기 */}
      <button
        type="button"
        onClick={() => close()}
        className="absolute bottom-8 text-xs tracking-[0.25em] text-muted underline underline-offset-4 transition-colors hover:text-foreground"
      >
        SKIP
      </button>

      <style>{`
        @keyframes introFade { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }
        @keyframes introCaret { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      `}</style>
    </div>
  );
}
