// 지역별 안내 섹션 — 남양주/마석/화도읍/다산/별내/구리 카드(파워링크 지역 키워드 랜딩 앵커 #region-{slug}) + 그 외 지역 전화 안내.
import { REGIONS, SITE } from "../_lib/data";
import Reveal from "./Reveal";

// 위치 핀 아이콘
function PinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold" aria-hidden>
      <path d="M12 21s-6-5.5-6-10.5a6 6 0 1 1 12 0C18 15.5 12 21 12 21z" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

export default function RegionSection() {
  return (
    <section id="region" className="bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">SERVICE AREA</p>
          <h2 className="serif text-2xl font-semibold leading-snug md:text-4xl">남양주 · 구리 지역별 커튼 · 블라인드 시공 안내</h2>
          <p className="mt-4 text-sm text-muted">지역별 검색으로 오신 분들을 위한 안내입니다.</p>
        </Reveal>

        {/* 지역 카드 그리드 1/2/3열 — 각 카드 id 는 광고 랜딩 앵커(예: #region-dasan) */}
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-16">
          {REGIONS.map((r, i) => (
            <Reveal key={r.slug} as="li" delay={i * 80} className="h-full">
              <article
                id={`region-${r.slug}`}
                className="flex h-full scroll-mt-24 flex-col rounded-2xl border border-line bg-background p-7 transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* 지역명 + 핀 */}
                <div className="flex items-center gap-2">
                  <PinIcon />
                  <h3 className="text-lg font-semibold">{r.name} 커튼 · 블라인드</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{r.desc}</p>

                {/* 세부 지역 칩 */}
                {r.spots && r.spots.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {r.spots.map((s) => (
                      <li key={s} className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs text-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                )}

                {/* 지역별 무료 방문실측 링크 */}
                <a
                  href="#estimate"
                  className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-accent transition hover:text-brown"
                >
                  {r.name} 무료 방문실측 신청 →
                </a>
              </article>
            </Reveal>
          ))}
        </ul>

        {/* 그 외 지역 안내 + 전화 */}
        <Reveal delay={300} className="mt-12 text-center text-sm text-muted">
          그 외 수도권 지역은 전화로 문의해주세요.{" "}
          <a href={SITE.telHref} className="font-semibold text-accent underline underline-offset-4 hover:text-brown">
            {SITE.tels[0]}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
