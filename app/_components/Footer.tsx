// 푸터 — CS CENTER / 브랜드 정보 / 저작권. 서버 컴포넌트 (인터랙션 없음).
import { SITE } from "../_lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-neutral-100 text-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1fr_1.4fr] md:px-8">
        {/* CS CENTER — 전화번호 크게, 운영시간 */}
        <div>
          <p className="eyebrow">CS CENTER</p>
          <a href={`tel:${SITE.tel}`} className="mt-3 block text-3xl font-semibold tracking-tight md:text-4xl">
            {SITE.tel}
          </a>
          <ul className="mt-4 space-y-1 text-xs text-muted">
            {SITE.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        {/* 브랜드 블록 — 상호 + 연락처/사업자 정보 */}
        <div className="md:border-l md:border-line md:pl-10">
          <p className="text-lg font-semibold tracking-[0.3em]">{SITE.name}</p>
          <p className="mt-1 text-xs text-muted">{SITE.nameKo}</p>
          <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs text-muted">
            <dt className="tracking-widest">TEL</dt>
            <dd>{SITE.tel}</dd>
            <dt className="tracking-widest">FAX</dt>
            <dd>{SITE.fax}</dd>
            <dt className="tracking-widest">E-MAIL</dt>
            <dd>
              <a href={`mailto:${SITE.email}`} className="hover:text-foreground">
                {SITE.email}
              </a>
            </dd>
            <dt className="tracking-widest">BIZ LICENSE</dt>
            <dd>{SITE.bizLicense}</dd>
          </dl>
        </div>
      </div>

      {/* 저작권 라인 */}
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-5 py-5 text-[11px] tracking-widest text-muted md:px-8">
          © 2026 {SITE.name} COPYRIGHT
        </p>
      </div>
    </footer>
  );
}
