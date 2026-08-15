"use client";
// 고정 퀵메뉴 — 데스크톱: 우측 중앙 원형 버튼(카카오톡/전화) + 세로 "무료 방문실측" 라벨 / 모바일: 하단 고정 3분할 바(전화/카카오 상담/무료 방문실측).
// 모든 버튼 클릭 시 전환 이벤트(track) 전송. tel/앵커 링크는 기본 이동 유지(preventDefault 없음).
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

// 전화기 아이콘
function PhoneIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6.2 6.2l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

// 줄자(실측) 아이콘
function RulerIcon({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 17.5 17.5 3 21 6.5 6.5 21 3 17.5zM7 13l1.5 1.5M10 10l1.5 1.5M13 7l1.5 1.5" />
    </svg>
  );
}

// 클릭 트래킹 핸들러 (위치 공통: quickmenu)
const onCall = () => track(EVENTS.CLICK_CALL, { location: "quickmenu" });
const onKakao = () => track(EVENTS.CLICK_KAKAO, { location: "quickmenu" });
const onCta = () => track(EVENTS.CLICK_CTA, { location: "quickmenu" });

export default function QuickMenu() {
  return (
    <>
      {/* 데스크톱(md+) — 우측 중앙 세로 스택, hover 시 확대 + 그림자 */}
      <nav aria-label="빠른 문의" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <a
          href={SITE.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="카카오톡 문의"
          onClick={onKakao}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-[#FEE500] text-[#191919] shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <KakaoIcon size={22} />
          <span className="mt-0.5 text-[9px] font-medium leading-none">카카오톡</span>
        </a>
        <a
          href={SITE.telHref}
          aria-label="전화 연결"
          onClick={onCall}
          className="flex h-14 w-14 flex-col items-center justify-center rounded-full bg-accent text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <PhoneIcon size={20} />
          <span className="mt-0.5 text-[9px] font-medium leading-none">전화 연결</span>
        </a>
        {/* 세로 라벨 — 무료 방문실측 → #estimate */}
        <a
          href="#estimate"
          onClick={onCta}
          className="flex items-center justify-center rounded-full bg-gold px-2 py-4 text-[11px] font-medium tracking-[0.2em] text-white shadow-md transition-all duration-200 [writing-mode:vertical-rl] hover:scale-105 hover:shadow-lg"
        >
          무료 방문실측
        </a>
      </nav>

      {/* 모바일(<md) — 하단 고정 3분할 바(전화 / 카카오 상담 / 무료 방문실측), safe-area 하단 여백 보정 */}
      <nav
        aria-label="빠른 문의"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line shadow-[0_-4px_16px_rgba(43,37,33,0.12)] md:hidden"
      >
        <a
          href={SITE.telHref}
          onClick={onCall}
          className="flex min-h-14 flex-col items-center justify-center gap-1 bg-accent px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-white active:bg-brown"
        >
          <PhoneIcon size={20} />
          <span className="text-xs font-semibold leading-none">전화</span>
        </a>
        <a
          href={SITE.kakaoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onKakao}
          className="flex min-h-14 flex-col items-center justify-center gap-1 bg-[#FEE500] px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-[#191919] active:bg-[#f5dc00]"
        >
          <KakaoIcon size={20} />
          <span className="text-xs font-semibold leading-none">카카오 상담</span>
        </a>
        <a
          href="#estimate"
          onClick={onCta}
          className="flex min-h-14 flex-col items-center justify-center gap-1 bg-gold px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-white active:brightness-95"
        >
          <RulerIcon size={20} />
          <span className="text-xs font-semibold leading-none">무료 방문실측</span>
        </a>
      </nav>
    </>
  );
}
