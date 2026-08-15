// ③ 브랜드 강점 섹션. 6개 강점을 아이콘 + 제목 + 설명으로 나열. highlight(100% 맞춤 제작 / 무료 방문 견적)는 살짝 떠 있는 다크 카드로 강조.
import { STRENGTH, type Strength } from "../_lib/data";
import Reveal from "./Reveal";

// 아이콘 키 → 1.5px 스트로크 라인 아이콘 (40px)
function StrengthIcon({ name, className = "" }: { name: Strength["icon"]; className?: string }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
  switch (name) {
    case "tape": // 줄자
      return (
        <svg {...common}>
          <circle cx="9" cy="12" r="6" />
          <circle cx="9" cy="12" r="1.5" />
          <path d="M15 12h6v4h-6M18 12v2M21 12v1.5" />
        </svg>
      );
    case "calendar": // 방문 일정
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          <path d="M9 14.5l2 2 4-4" />
        </svg>
      );
    case "fabric": // 겹쳐진 원단 스와치
      return (
        <svg {...common}>
          <path d="M3.5 8.5l6-4 6 4-6 4z" />
          <path d="M3.5 12.5l6 4 6-4" />
          <path d="M3.5 16.5l6 4 6-4" />
          <path d="M15.5 8.5l5 3.3-5 3.2" />
        </svg>
      );
    case "sewing": // 재봉틀
      return (
        <svg {...common}>
          <path d="M4 18.5h16" />
          <path d="M6 15.5V8a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v7.5" />
          <path d="M9 6v6M9 12h4" />
          <path d="M11.5 12v3.5" />
          <circle cx="16" cy="9.5" r="1.2" />
        </svg>
      );
    case "shield": // 체크 방패
      return (
        <svg {...common}>
          <path d="M12 3.5l7 2.5v5.5c0 4.2-3 7.7-7 9-4-1.3-7-4.8-7-9V6z" />
          <path d="M9 12l2 2 4-4.5" />
        </svg>
      );
    case "handshake": // 악수 (사후 관리)
      return (
        <svg {...common}>
          <path d="M2.5 9.5l3-3.5 4 1.5 3-1.5 4 1.5 3-1.5 2 3.5" />
          <path d="M5.5 6l4.5 8 2 1.5" />
          <path d="M12.5 8L9 11.5l1.5 1.5L13 11l2 2 1.5-1.5 2 2 1.5-1.5" />
          <path d="M9 13l3 3M11 15l2.5 2" />
        </svg>
      );
  }
}

export default function Strengths() {
  return (
    <section id="strength" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* 섹션 헤더 */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-4">{STRENGTH.eyebrow}</p>
          <p className="serif text-base text-muted">{STRENGTH.intro}</p>
          <h2 className="serif mt-3 text-2xl font-semibold leading-snug md:text-4xl">{STRENGTH.title}</h2>
          <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-gold" />
        </Reveal>

        {/* 강점 그리드: 2 / 3 / 6열. highlight 는 다크 카드로 떠오르고, 나머지는 lg 에서 세로 구분선 */}
        <ul className="mt-16 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:mt-20 lg:grid-cols-6 lg:gap-x-0">
          {STRENGTH.items.map((item, i) => {
            const hl = !!item.highlight;
            const prevPlain = i > 0 && !STRENGTH.items[i - 1].highlight;
            return (
              <Reveal key={item.title} as="li" delay={i * 90} className="h-full">
                <div
                  className={`group flex h-full flex-col items-center px-4 text-center transition ${
                    hl
                      ? "rounded-2xl bg-accent py-9 text-white shadow-lg shadow-accent/25 lg:-translate-y-3 lg:mx-1"
                      : `py-9 ${prevPlain ? "lg:border-l lg:border-line" : ""}`
                  }`}
                >
                  {/* 아이콘: 강조 카드는 골드, 기본은 딥 브라운. 호버 시 살짝 확대 */}
                  <span
                    className={`mb-5 inline-flex transition-transform duration-300 group-hover:scale-110 ${
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
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
