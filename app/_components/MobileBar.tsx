"use client";
// 모바일(<md) 하단 고정 2분할 바 — 바로전화 / 무료상담신청 (참고 시안) + 바 위 우측 카카오톡 원형 스티키. 항상 표시, safe-area 하단 여백 보정.
// PC 에서는 우하단 QuickMenu 가 대신 표시됨. 클릭 시 전환 이벤트(track) 전송.
import { SITE } from "../_lib/data";
import { track, EVENTS } from "../_lib/analytics";
import { useScrollIdle } from "../_hooks/useScrollIdle";

export default function MobileBar() {
  const idle = useScrollIdle(); // 스크롤 멈춤 → 카카오 스티키 오른쪽으로 숨김
  return (
    <>
    {/* 카카오톡 스티키 — 하단 바 위 우측, 모바일 전용(PC 는 QuickMenu). 흔들림으로 시선 유도, 스크롤 멈추면 오른쪽으로 스르륵 숨김 */}
    <a
      href={SITE.kakaoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="카카오톡 문의"
      onClick={() => track(EVENTS.CLICK_KAKAO, { location: "mobilebar" })}
      className={`wiggle fixed right-3 bottom-[4.75rem] z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#FEE500] bg-white/70 text-[#191919] shadow-md backdrop-blur transition-[translate] duration-[600ms] ease-in-out md:hidden ${idle ? "translate-x-[calc(100%+1.25rem)] [&]:animate-none" : "translate-x-0"}`}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 3C6.5 3 2 6.5 2 10.8c0 2.7 1.8 5.1 4.5 6.5l-1 3.7c-.1.3.3.6.6.4l4.4-2.9c.5.1 1 .1 1.5.1 5.5 0 10-3.5 10-7.8S17.5 3 12 3z" />
      </svg>
    </a>
    <nav
      aria-label="빠른 문의"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 bg-surface md:hidden"
    >
      {/* 바로전화 — 흰 배경 + 초록 전화기 (모바일 바는 휴대폰 번호로 연결) */}
      <a
        href="tel:01041262209"
        onClick={() => track(EVENTS.CLICK_CALL, { location: "mobilebar" })}
        className="flex min-h-14 items-center justify-center gap-2 bg-white px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[15px] font-semibold text-foreground active:bg-surface"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-emerald-600" aria-hidden>
          <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
        </svg>
        <span className="-translate-y-[0.5px]">바로전화</span>
      </a>
      {/* 무료상담신청 — 브라운 배경 (헤더/폼 버튼과 동일 색) */}
      <a
        href="#estimate"
        onClick={() => track(EVENTS.CLICK_CTA, { location: "mobilebar" })}
        className="flex min-h-14 items-center justify-center gap-2 bg-accent px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-[15px] font-semibold text-white active:bg-brown"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M8 2v4M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
        <span className="-translate-y-[0.5px]">무료상담신청</span>
      </a>
    </nav>
    </>
  );
}
