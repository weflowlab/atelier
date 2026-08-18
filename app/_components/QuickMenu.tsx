"use client";
// 고정 퀵메뉴(PC 전용) — 우하단 원형 아이콘 버튼 3개(무료 방문 실측 / 전화 / 카카오톡), 순서대로 번갈아 흔들림. 모바일은 MobileBar.
// 클릭 시 전환 이벤트(track) 전송. tel/외부 링크는 기본 이동 유지(preventDefault 없음).
import { useEffect, useState } from "react";
import { SITE } from "../_lib/data";
import { track, EVENTS } from "../_lib/analytics";

// 카카오톡 말풍선 아이콘
function KakaoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.5 6.5l-1 3.7c-.1.3.3.6.6.4l4.4-2.9c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
    </svg>
  );
}

// 전화기 아이콘 (초록 — 통화 버튼 관습색)
function PhoneIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

// 방문 실측 아이콘 — 솔루션 섹션 "무료 방문 실측" 카드와 동일한 체크 달력
function VisitIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 2v4M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

// 클릭 트래킹 핸들러 (위치 공통: quickmenu)
const onCall = () => track(EVENTS.CLICK_CALL, { location: "quickmenu" });
const onKakao = () => track(EVENTS.CLICK_KAKAO, { location: "quickmenu" });
const onCta = () => track(EVENTS.CLICK_CTA, { location: "quickmenu" });

export default function QuickMenu() {
  const [lifted, setLifted] = useState(false); // 400px 이상 스크롤 → TOP 버튼 위로 올라감

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const btn = "flex h-16 w-16 items-center justify-center rounded-full shadow-md transition-transform hover:scale-105 hover:shadow-lg";

  return (
    // PC 전용 우하단 세로 스택 — 평소 bottom-3, TOP 버튼 등장 시 bottom-22(12+64+12px)로 이동. 모바일은 하단 바(MobileBar) 사용
    <nav
      aria-label="빠른 문의"
      className={`fixed right-3 z-40 hidden flex-col items-center gap-3 transition-[bottom] duration-[600ms] ease-in-out md:flex ${
        lifted ? "bottom-22" : "bottom-3"
      }`}
    >
      {/* 세 버튼이 순서대로 번갈아 흔들리도록 딜레이 분산 (3.3s 주기 / 3 → 0 / 1.1 / 2.2s) */}
      {/* 무료 방문 실측 — 브라운 원형(체크 달력 아이콘, 헤더 버튼과 동일 색) */}
      <a href="#estimate" aria-label="무료 방문 실측 신청" title="무료 방문 실측 신청" onClick={onCta} className={`wiggle ${btn} bg-accent text-white`}>
        <VisitIcon size={26} />
      </a>
      {/* 전화 — 화이트 */}
      <a href={SITE.telHref} aria-label="전화 연결" title="전화 연결" onClick={onCall} className={`wiggle ${btn} border border-line bg-white text-foreground`} style={{ animationDelay: "1.1s" }}>
        <PhoneIcon size={27} />
      </a>
      {/* 카카오톡 */}
      <a
        href={SITE.kakaoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 문의"
        title="카카오톡 문의"
        onClick={onKakao}
        className={`wiggle ${btn} bg-[#FEE500] text-[#191919]`}
        style={{ animationDelay: "2.2s" }}
      >
        <KakaoIcon size={30} />
      </a>
    </nav>
  );
}
