// ③ 브랜드 강점(Solution) 섹션. 헤더 → 신뢰 통계 밴드 → 6개 강점(가운데 100% 맞춤 제작 · 무료 방문 실측 다크 카드 강조).
import { STRENGTH, TRUST, type Strength } from "../_lib/data";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import LiveInquiries from "./LiveInquiries";

// 아이콘 키 → 시안에서 추출한 마스크 PNG (CSS mask 로 currentColor 색을 입혀 다크/라이트 카드 모두 대응).
// calendar(무료 방문 실측)만 시안에 없어 인라인 SVG 유지.
const MASK_ICONS: Partial<Record<Strength["icon"], string>> = {
  tape: "/images/icons/tape.png",
  fabric: "/images/icons/fabric.png",
  sewing: "/images/icons/sewing.png",
  shield: "/images/icons/shield.png",
  handshake: "/images/icons/handshake.png",
};

function StrengthIcon({ name }: { name: Strength["icon"] }) {
  const src = MASK_ICONS[name];
  if (src) {
    return (
      <span
        aria-hidden
        className="block h-16 w-16 bg-current"
        style={{
          maskImage: `url(${src})`,
          WebkitMaskImage: `url(${src})`,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        }}
      />
    );
  }
  // 무료 방문 실측 — 체크 달력
  return (
    <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 2v4M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}

export default function Strengths() {
  return (
    <section id="strength" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-4">{STRENGTH.eyebrow}</p>
          <p className="serif text-base font-bold text-foreground">{STRENGTH.intro}</p>
          {/* 데스크톱에서는 한 줄 유지 */}
          <h2 className="serif mt-3 text-2xl font-semibold leading-snug md:text-4xl md:whitespace-nowrap">
            {/* 모바일: "…전문가가 직접 / 실측·제작·시공합니다" 두 줄, PC: 한 줄 */}
            믿을 수 있는 전문가가 직접<br className="md:hidden" /> 실측·제작·시공합니다
          </h2>
          <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-gold" />
        </Reveal>
      </div>

      {/* 신뢰 통계 밴드 — 화면 끝까지 이어지는 밝은 면 (경력 · 누적 시공 · 맞춤 제작 · 실측 비용) */}
      <Reveal delay={100} className="mt-12 border-y border-line bg-surface md:mt-14">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 md:divide-x md:divide-line">
          {TRUST.map((t, i) => (
            <li
              key={t.label}
              className={`flex flex-col items-center px-4 py-8 text-center md:py-10 ${i < 2 ? "border-b border-line md:border-b-0" : ""} ${i % 2 === 1 ? "border-l border-line md:border-l-0" : ""}`}
            >
              <span
                className={`serif tracking-tight text-accent ${
                  t.highlight ? "text-3xl font-bold md:text-4xl" : "text-3xl font-medium md:text-4xl"
                }`}
              >
                {/* 누적 시공만 카운트업, 나머지는 정적. 시공 경력은 굵게 강조 */}
                {t.animate ? (
                  <CountUp end={t.end} suffix={t.suffix} format={t.format} />
                ) : (
                  <>{t.format ? t.end.toLocaleString("ko-KR") : t.end}{t.suffix}</>
                )}
              </span>
              <span className="mt-2 text-xs tracking-wider text-muted">{t.label}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* 실시간 상담 문의 보드 (연출용) — 신뢰 통계 바로 아래 */}
      <Reveal delay={150} className="mx-auto mt-6 max-w-7xl px-4 md:mt-8 md:px-10">
        <LiveInquiries />
      </Reveal>

      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* 강점: 모바일은 일반 가로 스크롤(스냅 없음, 1.n장, 진행바, 세로 스크롤 잠금) — 강조 카드 2개가 먼저 오도록 order-first / md 3열 / lg 6열(강조는 가운데). 전부 박스 */}
        {/* 강점 그리드: 모바일 2열 / md 3열 / lg 6열. 전부 박스, 강조 두 개(무료 방문 실측 · 100% 맞춤 제작)는 모바일 첫 줄, lg 는 가운데 */}
        <ul className="mx-[calc(50%-50vw)] mt-14 grid max-w-none grid-cols-2 gap-3 px-4 md:mt-20 md:grid-cols-3 md:gap-4 lg:grid-cols-6 lg:gap-3 lg:px-6">
          {STRENGTH.items.map((item) => {
            const hl = !!item.highlight; // 카드는 개별 페이드업 없이 그룹 단위로 등장 (가로 스크롤 중 튐 방지)
            return (
              <li key={item.title} className={`h-full ${hl ? "order-first lg:order-none" : ""}`}>
                {/* 카드: 전부 박스. 강조는 다크 카드, 기본은 밝은 면 + 테두리 (높이·라인 동일) */}
                <div
                  className={`group flex h-full flex-col items-center rounded-2xl px-2 py-8 text-center md:px-3 md:py-9 md:transition ${
                    hl
                      ? "bg-accent text-white shadow-lg shadow-accent/25"
                      : "border border-line bg-surface"
                  }`}
                >
                  {/* 아이콘: 강조 카드는 골드, 기본은 딥 브라운. 호버 시 살짝 확대 */}
                  <span
                    className={`mb-5 inline-flex md:transition-transform md:duration-300 md:group-hover:scale-110 ${
                      hl ? "text-gold" : "text-accent"
                    }`}
                  >
                    <StrengthIcon name={item.icon} />
                  </span>
                  <h3 className={`text-base font-semibold ${hl ? "text-white" : ""}`}>{item.title}</h3>
                  <p
                    className={`mt-2 whitespace-pre-line text-sm leading-relaxed ${
                      hl ? "text-white/75" : "text-muted"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
