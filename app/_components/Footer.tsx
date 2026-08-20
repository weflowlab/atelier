// 푸터 — [밝은 면] CS CENTER 블록 + [베이지 밴드] 워드마크·상호·대표/연락처/주소·저작권. 서버 컴포넌트 (인터랙션 없음).
import Image from "next/image";
import { SITE } from "../_lib/data";

// 명함 시안처럼 원형 테두리 안에 얇은 라인 아이콘
const ICONS = {
  person: <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20.5c0-3.7 3.3-6.3 7.5-6.3s7.5 2.6 7.5 6.3" /></>,
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />,
  doc: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 13h6M9 17h4" /></>,
  home: <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></>,
} as const;

function InfoIcon({ name }: { name: keyof typeof ICONS }) {
  return (
    <span aria-hidden className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-foreground/30 text-foreground/70">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </svg>
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line text-foreground">
      {/* CS CENTER — 굵은 제목 + 짧은 구분선 + 연락처/운영시간/휴무 안내 */}
      <div className="bg-surface">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <p className="eyebrow">Customer Service</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-[28px]">CS CENTER</h2>
          <span className="my-6 block h-px w-14 bg-gold" />
          <ul className="space-y-1.5 text-base leading-relaxed">
            {SITE.tels.map((t) => (
              <li key={t}>
                <a href={`tel:${t.replace(/-/g, "")}`} className="font-medium hover:text-brown hover:underline">
                  {t}
                </a>
              </li>
            ))}
            <li className="text-muted">{SITE.hours}</li>
            <li className="text-muted">{SITE.holiday}</li>
          </ul>
        </div>
      </div>

      {/* 브랜드 밴드 — 좌: 워드마크 + 상호 + 대표/연락처/주소 / 우: 저작권. */}
      <div className="border-t border-line bg-background">
        <div className="pb-16 md:pb-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
            <div>
              <Image src="/images/logo/wordmark-dark.png" alt={`${SITE.nameKo} ${SITE.nameEn}`} width={880} height={208} className="h-11 w-auto md:h-14" />
              {/* 명함 시안과 동일하게 영문 표기 */}
              <p className="serif mt-4 text-xl font-semibold tracking-wide">Curtain Atelier</p>
              <p className="mt-1.5 text-[10px] tracking-[0.3em] text-muted uppercase">Curtain &amp; Blind Specialist</p>
              {/* 정보 행 — 명함 시안처럼 원형 아이콘 + 항목 */}
              <ul className="mt-5 space-y-2.5 text-xs leading-relaxed text-muted">
                <li className="flex items-center gap-x-2.5">
                  <InfoIcon name="person" />
                  <span>CEO Kim Yongjae</span>
                </li>
                <li className="flex items-center gap-x-2.5">
                  <InfoIcon name="phone" />
                  <span>Tel {SITE.tels.join(" / ")}</span>
                </li>
                <li className="flex items-center gap-x-2.5">
                  <InfoIcon name="doc" />
                  <span>Business Registration No. {SITE.bizNo}</span>
                </li>
                <li className="flex items-center gap-x-2.5">
                  <InfoIcon name="pin" />
                  <span>Service Area Seoul · Gyeonggi · Incheon · Gangwon (Chuncheon · Hwacheon)</span>
                </li>
              </ul>
            </div>
            <p className="text-xs tracking-[0.15em] text-muted md:text-right">
              © 2026 CURTAIN ATELIER. ALL RIGHTS RESERVED.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
