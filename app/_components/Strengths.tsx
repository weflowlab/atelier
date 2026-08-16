// ③ 브랜드 강점(Solution) 섹션. 헤더 → 신뢰 통계 밴드 → 6개 강점(가운데 100% 맞춤 제작 · 무료 방문 실측 다크 카드 강조).
import { STRENGTH, TRUST, type Strength } from "../_lib/data";
import Reveal from "./Reveal";
import ScrollProgress from "./ScrollProgress";

// 아이콘 키 → 1.5px 스트로크 라인 아이콘 (40px)
function StrengthIcon({ name, className = "" }: { name: Strength["icon"]; className?: string }) {
  const common = {
    width: 56,
    height: 56,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "tape": // 줄자(자)
      return (
        <svg {...common}>
          <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
          <path d="M14.5 12.5l2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2" />
        </svg>
      );
    case "calendar": // 방문 일정 (체크 달력)
      return (
        <svg {...common}>
          <path d="M8 2v4M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      );
    case "fabric": // 겹쳐진 원단 (레이어)
      return (
        <svg {...common}>
          <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
        </svg>
      );
    case "sewing": // 재봉틀 (받침 · 팔 · 바늘대 · 휠)
      return (
        <svg {...common}>
          <path d="M3 19h18" />
          <path d="M4 19v-4h5" />
          <path d="M20 19V8a3 3 0 0 0-3-3H8.5" />
          <path d="M8.5 5v7.5" />
          <path d="M6.5 12.5h4" />
          <path d="M8.5 12.5V15" />
          <circle cx="16.5" cy="9.5" r="1.6" />
        </svg>
      );
    case "shield": // 체크 방패
      return (
        <svg {...common}>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "handshake": // 악수 (사후 관리)
      return (
        <svg {...common}>
          <path d="m11 17 2 2a1 1 0 1 0 3-3" />
          <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
          <path d="m21 3 1 11h-2" />
          <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
          <path d="M3 4h8" />
        </svg>
      );
  }
}

export default function Strengths() {
  return (
    <section id="strength" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow mb-4">{STRENGTH.eyebrow}</p>
          <p className="serif text-base text-muted">{STRENGTH.intro}</p>
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
              <span className="serif text-3xl font-medium tracking-tight text-accent md:text-4xl">{t.value}</span>
              <span className="mt-2 text-xs tracking-wider text-muted">{t.label}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* 강점: 모바일은 일반 가로 스크롤(스냅 없음, 1.n장, 진행바, 세로 스크롤 잠금) — 강조 카드 2개가 먼저 오도록 order-first / md 3열 / lg 6열(강조는 가운데). 전부 박스 */}
        <div>
        <ul id="strength-track" className="no-scrollbar -mx-6 mt-14 flex gap-3 overflow-x-auto overscroll-x-contain px-6 py-4 md:mx-0 md:mt-20 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:px-0 md:py-0 lg:grid-cols-6 lg:gap-3">
          {STRENGTH.items.map((item) => {
            const hl = !!item.highlight; // 카드는 개별 페이드업 없이 그룹 단위로 등장 (가로 스크롤 중 튐 방지)
            return (
              <li key={item.title} className={`h-full shrink-0 basis-[58%] md:basis-auto md:shrink ${hl ? "order-first md:order-none" : ""}`}>
                {/* 카드: 전부 박스. 강조는 다크 카드, 기본은 밝은 면 + 테두리 (높이·라인 동일) */}
                <div
                  className={`group flex h-full flex-col items-center rounded-2xl px-4 py-10 text-center md:py-9 md:transition ${
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
        {/* 모바일 가로 스크롤 진행바 */}
        <ScrollProgress trackId="strength-track" className="mt-4 md:hidden" />
        </div>
      </div>
    </section>
  );
}
