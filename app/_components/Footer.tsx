// 푸터 — [밝은 면] CS CENTER 블록 + [베이지 밴드] 워드마크·상호·대표/연락처/주소·저작권. 서버 컴포넌트 (인터랙션 없음).
import { SITE } from "../_lib/data";

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
        <div>
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-12 md:flex-row md:items-end md:justify-between md:px-8">
            <div>
              <p className="script text-4xl leading-none md:text-5xl">{SITE.nameEn}</p>
              <p className="mt-3 text-sm font-medium">{SITE.bizName}</p>
              <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-relaxed text-muted">
                <span>대표 {SITE.owner}</span>
                <span aria-hidden>|</span>
                <span>Tel {SITE.tels.join(" / ")}</span>
                <span aria-hidden>|</span>
                <span>주소 {SITE.address}</span>
              </p>
              {/* 2행: 사업자등록번호 · 서비스 지역 (신뢰 정보 + 지역 키워드) */}
              <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-relaxed text-muted">
                <span>사업자등록번호 {SITE.bizNo}</span>
                <span aria-hidden>|</span>
                <span>서비스 지역 {SITE.serviceAreaLabel}</span>
              </p>
            </div>
            <p className="text-xs tracking-wide text-muted md:text-right">
              © 2026 {SITE.bizName} ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
